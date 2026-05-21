# Agent Instructions (Bureau of Tiny Emergencies)

This repository is a comedy project: **hilarious, dumb, and funny** — but built with *polished* execution.

If you are an AI agent (or any automation) making changes here, you are expected to preserve the core vibe and improve the project without turning it into a serious product.

## The vibe (non‑negotiable)

- **Deadpan bureaucracy**: treat tiny nonsense like regulated policy.
- **Premium presentation**: clean UI, bold typography, good spacing, smooth interactions.
- **Punchy copy**: short lines, big headers, snappy bullets.
- **Comedic restraint**: silly, not chaotic. One strong joke beats five weak jokes.

### What to avoid

- No sincere self-help, productivity preaching, or inspirational quotes (unless obviously satirical).
- No edgy/offensive humor. Keep it playful, not mean.
- No tracking/analytics, data collection, login, or “real user accounts”.
- Don’t turn it into a framework-heavy app; this is intentionally lightweight.

## Project structure (keep it simple)

- Static site:
  - `index.html`, `styles.css`, `script.js`
  - `library.html`, `library.js`
- Remotion:
  - `src/Root.tsx` registers compositions
  - `src/TinyEmergencyAd.tsx` powers the original short broadcasts
  - `src/DailyDispatch.tsx` powers the daily longer dispatch
- Output:
  - `out/*.mp4` (original broadcasts)
  - `out/daily/YYYY-MM-DD.mp4` (daily)
  - `out/daily/latest.mp4` (stable pointer)
  - `out/daily/index.json` (archive index)
  - `out/daily/bulletin.json` (homepage daily bulletin)

## Daily automation (do not break)

A GitHub Action runs daily:

- `.github/workflows/daily-bureau.yml`
- It runs `npm run daily`, which:
  - renders a new `DailyDispatch` video
  - updates `out/daily/index.json` + `out/daily/bulletin.json`
  - prunes old videos (retention)
  - commits `out/daily/*` back to `main`

Rules:

- Keep the archive format stable unless you also update the site readers.
- Keep video durations *funny-long* (e.g., ~20–40s), not 6 seconds.
- Style should vary by seed/mood; avoid repeating the same look every day.
- Some days should include audio, but keep it subtle (hold-music energy).
- Avoid exploding repo size: keep/prune history (currently `KEEP_DAYS`).

## When adding features

Preferred feature style:

- Add a new “department” section/page (e.g., policy desk, hotline, tab counseling) that feels like it belongs.
- Small, delightful interactions (copy buttons, toggles, fake readouts) beat big complicated systems.
- If you add a new page, link it from the header/nav.

Implementation rules:

- Keep changes **small and focused**; don’t rewrite everything.
- Maintain accessibility basics: semantic HTML, labels, readable contrast.
- Prefer vanilla JS and CSS; avoid adding large dependencies.
- Be mindful of motion: respect `prefers-reduced-motion`.

## Local dev commands

- Install: `npm ci`
- Site (static server): `npm run site` (serves on port `5173`)
- Remotion studio: `npm run remotion`
- Daily generator: `npm run daily`

## Commit discipline

- Use small commits with clear messages.
- Don’t commit temporary audio files (daily audio is generated during render).

