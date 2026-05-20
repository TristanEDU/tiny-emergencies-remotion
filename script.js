const excuseForm = document.querySelector("#excuseForm");
const problemInput = document.querySelector("#problem");
const memoTitle = document.querySelector("#memoTitle");
const memoBody = document.querySelector("#memoBody");
const memoList = document.querySelector("#memoList");
const panicButton = document.querySelector("#panicButton");
const panicReadout = document.querySelector("#panicReadout");
const complaintButton = document.querySelector("#complaintButton");
const complaintReadout = document.querySelector("#complaintReadout");

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
