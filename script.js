const excuseForm = document.querySelector("#excuseForm");
const problemInput = document.querySelector("#problem");
const memoTitle = document.querySelector("#memoTitle");
const memoBody = document.querySelector("#memoBody");
const memoList = document.querySelector("#memoList");
const panicButton = document.querySelector("#panicButton");
const panicReadout = document.querySelector("#panicReadout");
const complaintButton = document.querySelector("#complaintButton");
const complaintReadout = document.querySelector("#complaintReadout");
const copyMemoButton = document.querySelector("#copyMemoButton");
const toggleVideosButton = document.querySelector("#toggleVideosButton");
const toast = document.querySelector("#toast");
const dailyVideo = document.querySelector("#dailyVideo");
const dailyDownloadLink = document.querySelector("#dailyDownloadLink");
const bulletinHeadline = document.querySelector("#bulletinHeadline");
const bulletinSubhead = document.querySelector("#bulletinSubhead");
const bulletinList = document.querySelector("#bulletinList");
const bulletinTag = document.querySelector("#bulletinTag");
const dailyVideoPlaceholder = document.querySelector("#dailyVideoPlaceholder");
const bulletinFeature = document.querySelector("#bulletinFeature");
const bulletinFeatureName = document.querySelector("#bulletinFeatureName");
const bulletinFeatureDescription = document.querySelector(
  "#bulletinFeatureDescription",
);

const tones = {
  corporate: {
    title: "Strategic delay detected",
    opener: "After a robust cross-functional review, we have determined that",
    cause: "calendar turbulence combined with stakeholder humidity",
    action: "schedule a follow-up to discuss whether a follow-up is needed",
  },
  dramatic: {
    title: "A minor inconvenience has entered its villain era",
    opener: "Behold, the tiny crisis: ",
    cause: "destiny tripped over a charging cable",
    action: "stare into the middle distance until confidence returns",
  },
  suspicious: {
    title: "Everything is fine, which is exactly what a problem would say",
    opener: "The bureau calmly acknowledges that",
    cause: "a suspiciously smooth sequence of preventable events",
    action: "whisper 'interesting' and create a folder named Final_Final",
  },
};

const snacks = [
  "emergency cereal",
  "desk crackers",
  "a morally complex granola bar",
  "three grapes and a large opinion",
  "leftover confidence",
];

const panicLevels = [
  "decorative",
  "wearing shoes indoors",
  "typing with unnecessary force",
  "opening a blank spreadsheet for comfort",
  "saying 'quick sync' out loud",
  "considering a career as a mysterious lighthouse keeper",
];

const complaintResponses = [
  "Complaint received and placed directly into a velvet-lined shrug.",
  "A specialist has been assigned. It is you. Good luck.",
  "Your complaint has been escalated to the Department of Loud Sighs.",
  "We printed your complaint, nodded at it, and learned absolutely nothing.",
  "Complaint rejected for being too emotionally accurate.",
];

let panicIndex = 0;
let complaintIndex = 0;
let toastTimer = null;
let videosPaused = false;

function clean(value) {
  return value.trim().replace(/\s+/g, " ");
}

function getTone() {
  return new FormData(excuseForm).get("tone");
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderMemo(problem, toneName) {
  const tone = tones[toneName];
  const snack = pick(snacks);

  memoTitle.textContent = tone.title;
  memoBody.textContent = `${tone.opener} "${problem}" is not a failure. It is an unscheduled character-building pop-up.`;
  memoList.innerHTML = `
    <li>Root cause: ${tone.cause}.</li>
    <li>Action item: ${tone.action}.</li>
    <li>Recommended snack: ${snack}, consumed with official urgency.</li>
  `;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function loadDailyBulletin() {
  if (!bulletinHeadline || !bulletinList) return;

  try {
    const response = await fetch("out/daily/bulletin.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();

    bulletinHeadline.textContent = data.headline ?? "Daily dispatch pending.";
    if (bulletinSubhead) {
      bulletinSubhead.textContent =
        data.subhead ?? "The bureau is generating nonsense. Please hold.";
    }
    if (bulletinTag) {
      bulletinTag.textContent = `${data.mood ?? "mood?"}${
        data.includeSound ? " · audio" : ""
      }`;
    }

    const feature = data.feature ?? null;
    if (bulletinFeature && feature && typeof feature === "object") {
      const name = typeof feature.name === "string" ? feature.name : "";
      const description =
        typeof feature.description === "string" ? feature.description : "";

      if (name && bulletinFeatureName) bulletinFeatureName.textContent = name;
      if (description && bulletinFeatureDescription) {
        bulletinFeatureDescription.textContent = description;
      }
      bulletinFeature.hidden = !(name || description);
    } else if (bulletinFeature) {
      bulletinFeature.hidden = true;
    }

    const items = Array.isArray(data.bulletins) ? data.bulletins : [];
    bulletinList.innerHTML = items
      .slice(0, 6)
      .map((item) => `<li>${clean(item)}</li>`)
      .join("");

    const dateISO = typeof data.dateISO === "string" ? data.dateISO : null;
    const cacheKey =
      dateISO && data.seed ? `${dateISO}-${data.seed}` : `${Date.now()}`;

    if (dailyVideo && dateISO) {
      dailyVideo.src = `out/daily/${encodeURIComponent(dateISO)}.mp4?v=${encodeURIComponent(cacheKey)}`;
    }

    if (dailyDownloadLink && dateISO) {
      dailyDownloadLink.href = `out/daily/${encodeURIComponent(dateISO)}.mp4`;
    }
  } catch (error) {
    // Leave placeholders. Bureaucracy is working on it.
  }
}

function setDailyVideoAvailable(isAvailable) {
  if (!dailyVideo) return;
  if (dailyVideoPlaceholder) {
    dailyVideoPlaceholder.hidden = isAvailable;
  }
  dailyVideo.hidden = !isAvailable;
}

dailyVideo?.addEventListener("error", () => {
  setDailyVideoAvailable(false);
  if (bulletinSubhead) {
    bulletinSubhead.textContent =
      "Today’s dispatch isn’t available yet. The robots are rendering (and filing forms about rendering).";
  }
  showToast("Daily dispatch not found yet. Please return after the robots finish arguing.");
});

async function copyMemo() {
  const title = memoTitle?.textContent?.trim() ?? "";
  const body = memoBody?.textContent?.trim() ?? "";
  const bullets = Array.from(memoList?.querySelectorAll("li") ?? []).map((item) =>
    clean(item.textContent ?? ""),
  );

  const text = [title, "", body, "", ...bullets.map((item) => `• ${item}`)].join(
    "\n",
  );

  if (!text.trim()) {
    showToast("Nothing to copy. Please file a tiny emergency first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Memo copied to clipboard. Please use it irresponsibly.");
  } catch (error) {
    showToast("Clipboard blocked. Highlight the memo like it’s 2007.");
  }
}

excuseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const problem = clean(problemInput.value);

  if (!problem) {
    memoTitle.textContent = "We cannot process invisible chaos.";
    memoBody.textContent =
      "Please type a tiny crisis. The bureau refuses to do paperwork for vibes alone.";
    memoList.innerHTML = `
      <li>Example: I waved back at someone waving behind me.</li>
      <li>Example: I said “same” to a printer error.</li>
      <li>Example: I forgot my own point mid-sentence and became weather.</li>
    `;
    problemInput.focus();
    return;
  }

  renderMemo(problem, getTone());
});

panicButton.addEventListener("click", () => {
  panicIndex = (panicIndex + 1) % panicLevels.length;
  panicReadout.textContent = `Current panic level: ${panicLevels[panicIndex]}.`;
  document.body.classList.toggle("wiggle-mode", panicIndex % 2 === 1);
});

complaintButton.addEventListener("click", () => {
  complaintReadout.textContent = complaintResponses[complaintIndex];
  complaintIndex = (complaintIndex + 1) % complaintResponses.length;
});

copyMemoButton?.addEventListener("click", () => {
  copyMemo();
});

toggleVideosButton?.addEventListener("click", () => {
  const videos = Array.from(document.querySelectorAll(".video-grid video"));
  if (!videos.length) return;

  videosPaused = !videosPaused;

  if (videosPaused) {
    videos.forEach((video) => video.pause());
    toggleVideosButton.textContent = "Play videos";
    showToast("Videos paused. Your CPU has filed a thank-you note.");
    return;
  }

  videos.forEach((video) => {
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
  });
  toggleVideosButton.textContent = "Pause videos";
  showToast("Videos resumed. Bureaucracy is back in motion.");
});

loadDailyBulletin();
