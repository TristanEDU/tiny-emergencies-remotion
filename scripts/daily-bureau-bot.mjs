import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const DEFAULT_TZ = "America/Los_Angeles";
const moods = ["paperwork", "hotline", "panic", "snack", "tabs"];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command failed: ${command} ${args.join(" ")}`);
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

const hashSeed = (input) => {
  const digest = crypto.createHash("sha256").update(input).digest();
  return digest.readUInt32BE(0);
};

const randomUint32 = () => crypto.randomBytes(4).readUInt32BE(0);

const ensureDeps = () => {
  if (fs.existsSync(path.join(projectRoot, "node_modules"))) return;
  run("npm", ["ci"]);
};

const hasFfmpeg = () => {
  const probe = spawnSync("ffmpeg", ["-version"], { cwd: projectRoot, stdio: "ignore" });
  return probe.status === 0 && !probe.error;
};

const assertExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required output missing: ${path.relative(projectRoot, filePath)}`);
  }
};

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const main = () => {
  // Phase A: Daily dispatch (must succeed or fail loudly)
  const timeZone = process.env.TIMEZONE || DEFAULT_TZ;
  const now = new Date();
  const dateISO = process.env.DATE_ISO || formatDateISO(now, timeZone);

  const mood = process.env.MOOD || pick(moods);
  const durationSeconds = clamp(
    Number(process.env.DURATION_SECONDS || Math.floor(24 + Math.random() * 17)),
    24,
    40,
  );

  const seed =
    process.env.SEED !== undefined
      ? Number(process.env.SEED)
      : hashSeed(`${dateISO}-${randomUint32().toString(16)}`);

  const allowSound = hasFfmpeg();
  const includeSound =
    process.env.INCLUDE_SOUND === "1"
      ? true
      : process.env.INCLUDE_SOUND === "0"
        ? false
        : allowSound
          ? Math.random() < 0.4
          : false;

  ensureDeps();

  run("npm", [
    "run",
    "daily",
  ], {
    env: {
      ...process.env,
      TIMEZONE: timeZone,
      DATE_ISO: dateISO,
      MOOD: mood,
      SEED: String(seed >>> 0),
      DURATION_SECONDS: String(durationSeconds),
      INCLUDE_SOUND: includeSound ? "1" : "0",
    },
  });

  const dailyDir = path.join(projectRoot, "out", "daily");
  assertExists(path.join(dailyDir, `${dateISO}.mp4`));
  assertExists(path.join(dailyDir, "latest.mp4"));
  assertExists(path.join(dailyDir, "bulletin.json"));
  assertExists(path.join(dailyDir, "index.json"));

  // Phase B: Autonomous feature (exactly one unit per run)
  // Keep this intentionally tiny and safe for day 1: add a copy button for the daily bulletin.
  // Future autonomy can expand by adding more feature modules.
  run("node", ["scripts/site-features/copy-daily-bulletin.mjs"]);

  console.log(
    `Bureau bot complete: ${dateISO} mood=${mood} duration=${durationSeconds}s sound=${includeSound ? "on" : "off"}`,
  );
};

main();

