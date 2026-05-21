const grid = document.querySelector("#libraryGrid");
const meta = document.querySelector("#libraryMeta");
const searchInput = document.querySelector("#librarySearch");
const toast = document.querySelector("#toast");

let allEntries = [];
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function clean(value) {
  return (value ?? "").toString().trim().replace(/\s+/g, " ");
}

function createCard(entry) {
  const article = document.createElement("article");
  article.className = "library-card";

  const video = document.createElement("video");
  video.src = entry.mp4;
  video.controls = true;
  video.preload = "metadata";
  video.playsInline = true;

  const header = document.createElement("div");
  header.className = "library-card-header";

  const title = document.createElement("strong");
  title.textContent = entry.headline || entry.dateISO;

  const tag = document.createElement("span");
  tag.className = "bulletin-tag";
  tag.textContent = `${entry.mood || "mood?"}${entry.includeSound ? " · audio" : ""}`;

  header.append(title, tag);

  const footer = document.createElement("div");
  footer.className = "library-card-footer";

  const date = document.createElement("span");
  date.className = "library-date";
  date.textContent = entry.dateISO;

  const download = document.createElement("a");
  download.className = "mini-link";
  download.href = entry.mp4;
  download.download = "";
  download.textContent = "Download";

  download.addEventListener("click", () => {
    showToast("Downloading dispatch. Please pretend this is important.");
  });

  footer.append(date, download);

  article.append(video, header, footer);
  return article;
}

function render(entries) {
  if (!grid) return;
  grid.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "library-empty";
    empty.textContent = "No dispatches match your search. Suspiciously peaceful.";
    grid.append(empty);
    return;
  }

  entries.forEach((entry) => grid.append(createCard(entry)));
}

function applyFilter() {
  const term = clean(searchInput?.value).toLowerCase();
  if (!term) {
    render(allEntries);
    meta.textContent = `${allEntries.length} dispatches archived.`;
    return;
  }

  const filtered = allEntries.filter((entry) => {
    const blob = `${entry.dateISO} ${entry.headline} ${entry.mood}`.toLowerCase();
    return blob.includes(term);
  });

  render(filtered);
  meta.textContent = `${filtered.length} match${filtered.length === 1 ? "" : "es"} for “${term}”.`;
}

async function loadIndex() {
  try {
    const response = await fetch("out/daily/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error("missing");
    const data = await response.json();
    allEntries = Array.isArray(data.entries) ? data.entries : [];
    meta.textContent = `${allEntries.length} dispatches archived.`;
    render(allEntries);
  } catch (error) {
    meta.textContent = "Archive is unavailable. Bureaucracy is regrouping.";
    render([]);
  }
}

searchInput?.addEventListener("input", () => {
  applyFilter();
});

loadIndex().then(() => applyFilter());

