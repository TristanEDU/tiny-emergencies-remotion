import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const DEFAULT_TZ = "America/Los_Angeles";

const moods = ["paperwork", "hotline", "panic", "snack", "tabs"];

const contentByMood = {
  paperwork: {
    headline: [
      "Your calendar is filing a complaint.",
      "A form has feelings now.",
      "We regret to inform you: paperwork is contagious.",
      "The bureau is experiencing a mild administrative crisis.",
    ],
    subhead: [
      "Please initial the corner of your soul and proceed.",
      "A helpful reminder that 'quick question' is never quick.",
      "This dispatch is legally binding in the emotional sense only.",
    ],
    bullets: [
      "Printer status: haunted but cooperative if complimented.",
      "Stapler has been promoted to manager (against everyone's wishes).",
      "Approval stamp deployed with theatrical confidence.",
      "Your inbox is drizzling passive-aggression with a 60% chance of 'circling back.'",
      "Reminder: sighs must be filed in triplicate.",
      "New policy: all deadlines are now 'interpretive.'",
    ],
  },
  hotline: {
    headline: [
      "You have reached the Tiny Emergency Hotline.",
      "Your hold music has been approved-ish.",
      "An operator is typing 'interesting' with intense concern.",
      "Please stay on the line. Forever.",
    ],
    subhead: [
      "Estimated wait time: three business emotions.",
      "Your call may be recorded and used as a cautionary tale.",
      "For faster service, pretend your Wi‑Fi is a metaphor.",
    ],
    bullets: [
      "Press 1 if you said 'you too' to a dentist.",
      "Press 2 if you opened the fridge and forgot your entire personality.",
      "Press 3 to escalate to the Department of Loud Sighs.",
      "All representatives are currently 'in another meeting' (emotionally).",
      "Your issue has been placed in a velvet-lined shrug queue.",
      "Thank you for your patience. We will not be using it responsibly.",
    ],
  },
  panic: {
    headline: [
      "Panic forecast updated.",
      "Today’s vibe: mostly awkward with a chance of spreadsheets.",
      "Atmospheric conditions: quick questions approaching rapidly.",
      "Storm warning: someone said 'can we just' and meant chaos.",
    ],
    subhead: [
      "Carry a small umbrella for emails that begin with 'hey'.",
      "Expect scattered 'tiny urgencies' after 4:57 PM.",
      "High probability of nodding before comprehension arrives.",
    ],
    bullets: [
      "9:00 AM: inbox drizzle with localized calendar turbulence.",
      "1:00 PM: meeting thunder and a front of 'makes sense.'",
      "4:59 PM: urgent sparkle advisory (avoid eye contact).",
      "Tomorrow: chance of emotionally damp tabs.",
      "Panic level may spike when someone says 'real quick.'",
      "Recommended coping mechanism: open a blank spreadsheet for comfort.",
    ],
  },
  snack: {
    headline: [
      "Snack protocol activated.",
      "Crunch support authorized.",
      "Your productivity has been diagnosed as hunger in a trench coat.",
      "Emergency munch order: standing by.",
    ],
    subhead: [
      "Desk crackers remain legal in 43 states of mind.",
      "A granola bar is morally complex but permitted.",
      "Hydration is a rumor; snacks are policy.",
    ],
    bullets: [
      "Approved: emergency cereal eaten over the sink.",
      "Approved: three grapes and a large opinion.",
      "Denied: 'just air' (not a snack; that's a threat).",
      "If your brain is buffering, deploy chips immediately.",
      "New law: cold fries qualify as a salad after 9 PM.",
      "Reminder: coffee counts as a meeting participant, not a breakfast.",
    ],
  },
  tabs: {
    headline: [
      "Browser counseling session begins.",
      "Your tabs are forming a union.",
      "We have detected 47 open tabs and one secret shame tab.",
      "Tab therapy update: boundaries have been requested.",
    ],
    subhead: [
      "Negotiations continue. Demands include benefits and closure.",
      "Please stop bookmarking emotions and calling it research.",
      "Your RAM has filed for witness protection.",
    ],
    bullets: [
      "One tab is just vibes (cannot be closed without consequences).",
      "Four are duplicate calendars and one is a prophecy.",
      "Seven are emotional support documents in different fonts.",
      "The loud one is hiding behind a 'todo' list from 2019.",
      "Closing tabs may trigger an immediate identity shift.",
      "Reminder: 'restore previous session' is not a lifestyle.",
    ],
  },
};

const dailyFeatures = [
  {
    name: "Policy of the Day",
    description:
      "A new policy clause has been issued and immediately ignored with confidence.",
  },
  {
    name: "Desk Weather",
    description:
      "Your desk now has atmospheric conditions. Please dress accordingly (emotionally).",
  },
  {
    name: "Sigh Ledger",
    description:
      "All sighs must be logged. Please provide a receipt for each exhale.",
  },
  {
    name: "Mood Stamp",
    description:
      "A different stamp design appears today. It does nothing, but it judges you.",
  },
  {
    name: "Emergency Horoscope",
    description:
      "The bureau forecasts your next tiny crisis with unsettling accuracy.",
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const makeRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const writeJson = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const readJson = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
};

const hashSeed = (input) => {
  const digest = crypto.createHash("sha256").update(input).digest();
  return digest.readUInt32BE(0);
};

const formatDateISO = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

const parseISOToUTC = (dateISO) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!match) return null;
  const [, year, month, day] = match;
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
};

const pickUnique = (rng, items, count) => {
  const pool = [...items];
  const picked = [];
  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(rng() * pool.length);
    picked.push(pool.splice(clamp(index, 0, pool.length - 1), 1)[0]);
  }
  return picked;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
};

const generateAudio = ({ seconds, mood, outPath }) => {
  const frequency =
    mood === "snack" ? 330 : mood === "panic" ? 550 : mood === "tabs" ? 420 : 440;

  const harmony = frequency * 1.5;
  const wobble = mood === "panic" ? 12 : 6;

  run("ffmpeg", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    `sine=frequency=${frequency}:duration=${seconds}:sample_rate=44100`,
    "-f",
    "lavfi",
    "-i",
    `sine=frequency=${harmony}:duration=${seconds}:sample_rate=44100`,
    "-filter_complex",
    `[0:a][1:a]amix=inputs=2:normalize=0,` +
      `tremolo=f=${wobble}:d=0.6,` +
      `aecho=0.8:0.88:40:0.35,` +
      `volume=0.16`,
    "-c:a",
    "libmp3lame",
    "-q:a",
    "6",
    outPath,
  ]);
};

const main = () => {
  const timeZone = process.env.TIMEZONE || DEFAULT_TZ;
  const keepDays = Number(process.env.KEEP_DAYS || "60");
  const now = new Date();
  const dateISO = process.env.DATE_ISO || formatDateISO(now, timeZone);
  const seed = Number(process.env.SEED || hashSeed(dateISO));
  const rng = makeRng(seed);

  const mood = process.env.MOOD || moods[Math.floor(rng() * moods.length)];
  const includeSound =
    process.env.INCLUDE_SOUND === "1"
      ? true
      : process.env.INCLUDE_SOUND === "0"
        ? false
        : seed % 5 < 2;

  const durationSeconds = Number(process.env.DURATION_SECONDS || "30");
  const content = contentByMood[mood] ?? contentByMood.paperwork;
  const headline =
    process.env.HEADLINE || content.headline[Math.floor(rng() * content.headline.length)];
  const subhead =
    process.env.SUBHEAD || content.subhead[Math.floor(rng() * content.subhead.length)];
  const bulletins = pickUnique(rng, content.bullets, 4);
  const feature = dailyFeatures[Math.floor(rng() * dailyFeatures.length)];

  const dailyDir = path.join(projectRoot, "out", "daily");
  ensureDir(dailyDir);

  const bulletinPath = path.join(dailyDir, "bulletin.json");
  writeJson(bulletinPath, {
    dateISO,
    seed,
    mood,
    includeSound,
    headline,
    subhead,
    bulletins,
    feature,
    timeZone,
    generatedAt: now.toISOString(),
  });

  const audioPath = path.join(projectRoot, "public", "_daily-audio.mp3");
  if (includeSound) {
    ensureDir(path.dirname(audioPath));
    generateAudio({ seconds: durationSeconds, mood, outPath: audioPath });
  } else if (fs.existsSync(audioPath)) {
    fs.rmSync(audioPath);
  }

  const outputVideo = path.join(dailyDir, `${dateISO}.mp4`);
  const latestVideo = path.join(dailyDir, "latest.mp4");

  const props = {
    dateISO,
    seed,
    includeSound,
    mood,
    headline,
    subhead,
    bulletins,
  };

  run("npx", [
    "--no-install",
    "remotion",
    "render",
    "src/index.ts",
    "DailyDispatch",
    outputVideo,
    "--props",
    JSON.stringify(props),
  ]);

  fs.copyFileSync(outputVideo, latestVideo);

  const indexPath = path.join(dailyDir, "index.json");
  const indexJson = readJson(indexPath, {
    timeZone,
    keepDays,
    entries: [],
  });

  const todayEntry = {
    dateISO,
    mp4: `out/daily/${dateISO}.mp4`,
    headline,
    mood,
    includeSound,
  };

  const withoutToday = (indexJson.entries ?? []).filter((entry) => entry.dateISO !== dateISO);
  const nextEntries = [todayEntry, ...withoutToday];

  const nowUtcDay = parseISOToUTC(dateISO);
  const cutoffUtcDay = nowUtcDay === null ? null : nowUtcDay - keepDays * 86400000;

  const keptEntries = cutoffUtcDay
    ? nextEntries.filter((entry) => {
        const ts = parseISOToUTC(entry.dateISO);
        return ts === null ? true : ts >= cutoffUtcDay;
      })
    : nextEntries;

  const keptSet = new Set(keptEntries.map((entry) => entry.dateISO));
  for (const entry of nextEntries) {
    if (keptSet.has(entry.dateISO)) continue;
    const staleFile = path.join(dailyDir, `${entry.dateISO}.mp4`);
    if (fs.existsSync(staleFile)) {
      fs.rmSync(staleFile);
    }
  }

  writeJson(indexPath, {
    timeZone,
    keepDays,
    generatedAt: now.toISOString(),
    entries: keptEntries,
  });

  console.log(
    `Daily video generated: out/daily/${dateISO}.mp4 (mood=${mood}, sound=${includeSound ? "on" : "off"})`,
  );
};

main();
