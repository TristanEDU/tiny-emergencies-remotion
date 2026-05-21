# The Bureau of Tiny Emergencies (Remotion + Static Site)

Government-grade nonsense for problems too small for therapy.

This repo is intentionally **hilarious, dumb, and funny**. Future additions should match the vibe: playful bureaucracy, mildly unhelpful “official” tone, and polished UI that takes nonsense seriously.

## What this is

- A **static website** (`index.html`, `styles.css`, `script.js`) that lets you:
  - Generate “official” excuses
  - Mash a panic button
  - File pointless complaints
  - Watch the bureau’s tiny emergency broadcasts
- A **Remotion** setup (`src/*`) that renders square (1080×1080) “broadcast” videos.
- A **daily automation** that generates a brand-new video + updates an archive once per day.

Live site is deployed on Vercel (auto-updates on pushes to `main`).

## The vibe rules (please do not break these)

- Treat nonsense like it’s a regulated industry.
- Humor style: deadpan “official”, petty policies, faux compliance, bureaucratic drama.
- Copy should be punchy and skimmable (big headers, short bullets).
- Visuals should feel *premium* even when the content is ridiculous.
- No sincere self-help. No inspirational quotes. No earnest productivity advice. (Unless it’s clearly a joke.)

## Site features we’ve added

- **Copy memo** button for excuses (with a toast).
- **Pause videos** toggle for the video grid.
- **Download** links for each MP4.
- **Daily Dispatch** section on the homepage:
  - Shows `out/daily/bulletin.json` (headline/subhead/bullets + “Feature drop”)
  - Plays today’s dispatch when it exists
  - Shows a friendly placeholder when it doesn’t
- **Video library page** at `library.html` that reads `out/daily/index.json` and lets you browse/search the archive.
- Basic SEO/share metadata (OpenGraph/Twitter).
- `prefers-reduced-motion` support and `preload="metadata"` on videos.

## Remotion videos

Existing compositions (quick 6-second-ish “broadcast” variants) are defined in `src/Root.tsx` and implemented by `src/TinyEmergencyAd.tsx`.

### Daily Dispatch (longer + varied)

We added a new Remotion composition:

- `DailyDispatch` (`src/DailyDispatch.tsx`)
  - **Longer**: default 30 seconds in the generator (composition is 900 frames @ 30fps)
  - **Varied**: seeded “mood” + theme variants
  - **Optional audio**: some days include procedural audio

## Daily automation (hands-off)

This repo uses a scheduled **GitHub Action** to run once per day:

- Workflow: `.github/workflows/daily-bureau.yml`
- What it does:
  1) Installs dependencies
  2) Installs `ffmpeg`
  3) Runs `npm run daily`
  4) Commits updated `out/daily/*` back to `main`
  5) Vercel redeploys automatically from `main`

Important: for the workflow to commit back to the repo, GitHub must allow workflow write access:

- GitHub repo → **Settings → Actions → General → Workflow permissions**
- Set to **Read and write**

## Running locally

Prereqs:
- Node + npm
- (For daily rendering) `ffmpeg`

Install deps:

```bash
npm ci
```

Run the static site on port 5173:

```bash
npm run site
```

Open:
- `http://localhost:5173`
- `http://localhost:5173/library.html`

Open Remotion Studio:

```bash
npm run remotion
```

List compositions:

```bash
npm run compositions
```

Generate a daily dispatch locally (writes to `out/daily/`):

```bash
npm run daily
```

Handy env overrides:

```bash
DATE_ISO=2026-05-21 MOOD=panic INCLUDE_SOUND=1 DURATION_SECONDS=24 npm run daily
```

## Output files

- `out/*.mp4` — the original “broadcast” videos
- `out/daily/YYYY-MM-DD.mp4` — the daily dispatch video (one per day)
- `out/daily/latest.mp4` — a copy of today’s MP4 for stable linking
- `out/daily/index.json` — archive index consumed by `library.html`
- `out/daily/bulletin.json` — homepage “daily bulletin” content

## If you add new stuff

Strong suggestions:
- Prefer adding **new sections/pages** that feel like “departments” of the bureau.
- If you add interactivity, keep it fast + silly (buttons, toggles, “official” readouts).
- If you add more videos/compositions, keep them square, short-ish, and visually bold.
- If you add sound, keep it subtle and funny (hold music, tiny synth stings, etc.).

If a change makes the site feel serious, sensible, or helpful: it’s probably wrong.

