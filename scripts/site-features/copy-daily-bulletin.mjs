import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..", "..");

const files = {
  indexHtml: path.join(projectRoot, "index.html"),
  scriptJs: path.join(projectRoot, "script.js"),
};

const read = (filePath) => fs.readFileSync(filePath, "utf8");
const writeIfChanged = (filePath, next) => {
  const prev = read(filePath);
  if (prev === next) return false;
  fs.writeFileSync(filePath, next, "utf8");
  return true;
};

const insertOnce = ({ content, marker, insertion, where }) => {
  if (content.includes(marker)) return content;
  const index = content.indexOf(where);
  if (index === -1) throw new Error(`Insertion point not found: ${where}`);
  return content.slice(0, index) + insertion + content.slice(index);
};

const ensureIndexHtml = () => {
  const marker = "data-bureau-feature=\"copy-bulletin\"";
  const html = read(files.indexHtml);

  // Add a "Copy bulletin" button in the Daily Dispatch tool row (next to download).
  const where = `<a class="mini-link" id="dailyDownloadLink" href="out/daily/latest.mp4" download>`;
  const insertion = `          <button class="mini-button" id="copyBulletinButton" type="button" ${marker}>
            Copy bulletin
          </button>
`;

  const next = insertOnce({ content: html, marker, insertion, where });
  return writeIfChanged(files.indexHtml, next);
};

const ensureScriptJs = () => {
  const marker = "copyBulletinButton";
  const js = read(files.scriptJs);
  if (js.includes(marker)) return false;

  const insertAfter = `const bulletinFeatureDescription = document.querySelector(
  "#bulletinFeatureDescription",
);
`;

  const insertion = `const copyBulletinButton = document.querySelector("#copyBulletinButton");
`;

  const next = insertOnce({
    content: js,
    marker,
    insertion,
    where: insertAfter,
  });

  // Add handler at end, before loadDailyBulletin();
  const hookMarker = "copyBulletinButton?.addEventListener";
  if (next.includes(hookMarker)) return writeIfChanged(files.scriptJs, next);

  const where2 = `loadDailyBulletin();`;
  const insertion2 = `
function buildBulletinText() {
  const headline = clean(bulletinHeadline?.textContent ?? "");
  const subhead = clean(bulletinSubhead?.textContent ?? "");
  const bullets = Array.from(bulletinList?.querySelectorAll("li") ?? []).map((item) =>
    clean(item.textContent ?? ""),
  );
  const featureName = clean(bulletinFeatureName?.textContent ?? "");
  const featureDescription = clean(bulletinFeatureDescription?.textContent ?? "");

  const lines = [];
  if (headline) lines.push(headline);
  if (subhead) lines.push("", subhead);
  if (featureName || featureDescription) {
    lines.push("", "Feature drop:");
    if (featureName) lines.push("• " + featureName);
    if (featureDescription) lines.push("• " + featureDescription);
  }
  if (bullets.length) lines.push("", ...bullets.map((item) => "• " + item));

  return lines.join("\\n").trim();
}

async function copyBulletin() {
  const text = buildBulletinText();
  if (!text) {
    showToast("Nothing to copy yet. Please wait while the robots file the bulletin.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast("Bulletin copied. Please distribute it like it’s legally binding.");
  } catch (error) {
    showToast("Clipboard blocked. Screenshot it like a true bureaucrat.");
  }
}

copyBulletinButton?.addEventListener("click", () => {
  copyBulletin();
});

`;

  const next2 = insertOnce({ content: next, marker: hookMarker, insertion: insertion2, where: where2 });
  return writeIfChanged(files.scriptJs, next2);
};

const changed = [ensureIndexHtml(), ensureScriptJs()].some(Boolean);
if (changed) {
  console.log("Applied site feature: Copy Daily Bulletin");
} else {
  console.log("Site feature already present: Copy Daily Bulletin");
}
