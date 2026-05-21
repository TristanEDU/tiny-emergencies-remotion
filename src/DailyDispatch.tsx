import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type DailyDispatchMood = "paperwork" | "hotline" | "panic" | "snack" | "tabs";

export type DailyDispatchProps = {
  dateISO: string;
  seed: number;
  includeSound: boolean;
  mood: DailyDispatchMood;
  headline: string;
  subhead: string;
  bulletins: string[];
};

type Theme = {
  name: string;
  background: string;
  panel: string;
  ink: string;
  accent: string;
  accentSoft: string;
};

const themesByMood: Record<DailyDispatchMood, Theme[]> = {
  paperwork: [
    {
      name: "Midnight Clerk",
      background: "radial-gradient(circle at 20% 15%, #2f2454 0%, #0c0818 60%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#a78bfa",
      accentSoft: "rgba(167, 139, 250, 0.25)",
    },
    {
      name: "Inkjet Panic",
      background: "radial-gradient(circle at 20% 20%, #1f2a44 0%, #070a12 60%)",
      panel: "rgba(255, 255, 255, 0.07)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#38bdf8",
      accentSoft: "rgba(56, 189, 248, 0.22)",
    },
  ],
  hotline: [
    {
      name: "Neon Hold Music",
      background: "radial-gradient(circle at 35% 25%, #ff5fa2 0%, #13000c 60%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#fb7185",
      accentSoft: "rgba(251, 113, 133, 0.22)",
    },
    {
      name: "Operator Anxiety",
      background: "radial-gradient(circle at 30% 20%, #34d399 0%, #050c08 62%)",
      panel: "rgba(255, 255, 255, 0.07)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#34d399",
      accentSoft: "rgba(52, 211, 153, 0.22)",
    },
  ],
  panic: [
    {
      name: "Forecast of Dread",
      background: "radial-gradient(circle at 25% 30%, #ffb020 0%, #120b02 62%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.93)",
      accent: "#fbbf24",
      accentSoft: "rgba(251, 191, 36, 0.22)",
    },
    {
      name: "Spreadsheet Storm",
      background: "radial-gradient(circle at 20% 15%, #60a5fa 0%, #040712 64%)",
      panel: "rgba(255, 255, 255, 0.07)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#60a5fa",
      accentSoft: "rgba(96, 165, 250, 0.22)",
    },
  ],
  snack: [
    {
      name: "Crunch Authority",
      background: "radial-gradient(circle at 30% 20%, #fde68a 0%, #140f03 65%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#fbbf24",
      accentSoft: "rgba(251, 191, 36, 0.22)",
    },
    {
      name: "Desk Cracker Law",
      background: "radial-gradient(circle at 30% 15%, #f97316 0%, #140702 65%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#fb923c",
      accentSoft: "rgba(251, 146, 60, 0.22)",
    },
  ],
  tabs: [
    {
      name: "Browser Counseling",
      background: "radial-gradient(circle at 30% 15%, #22d3ee 0%, #030b0f 64%)",
      panel: "rgba(255, 255, 255, 0.07)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#22d3ee",
      accentSoft: "rgba(34, 211, 238, 0.22)",
    },
    {
      name: "Unionized Tabs",
      background: "radial-gradient(circle at 25% 20%, #c084fc 0%, #080212 66%)",
      panel: "rgba(255, 255, 255, 0.08)",
      ink: "rgba(255, 255, 255, 0.92)",
      accent: "#c084fc",
      accentSoft: "rgba(192, 132, 252, 0.22)",
    },
  ],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const makeRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

const pad2 = (value: number) => value.toString().padStart(2, "0");

const prettyDate = (dateISO: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!match) return dateISO;
  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
};

export const DailyDispatch: React.FC<DailyDispatchProps> = ({
  dateISO,
  seed,
  includeSound,
  mood,
  headline,
  subhead,
  bulletins,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rng = useMemo(() => makeRng(seed), [seed]);
  const theme = useMemo(() => {
    const options = themesByMood[mood] ?? themesByMood.paperwork;
    const index = Math.floor(rng() * options.length);
    return options[clamp(index, 0, options.length - 1)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, seed]);

  const intro = spring({
    fps,
    frame,
    config: { damping: 200, mass: 0.9, stiffness: 180 },
  });

  const headerPop = spring({
    fps,
    frame: frame - 10,
    config: { damping: 220, mass: 0.8, stiffness: 220 },
  });

  const stampBounce = spring({
    fps,
    frame: frame - 34,
    config: { damping: 12, mass: 1.2, stiffness: 120 },
  });

  const tickerProgress =
    (frame / durationInFrames) * 1.2 +
    interpolate(frame, [0, durationInFrames], [0, 0.08]);

  const noiseDots = useMemo(() => {
    const dots: Array<{ x: number; y: number; size: number; opacity: number }> = [];
    for (let i = 0; i < 46; i += 1) {
      dots.push({
        x: Math.round(rng() * 980),
        y: Math.round(rng() * 980),
        size: 2 + Math.round(rng() * 5),
        opacity: 0.08 + rng() * 0.12,
      });
    }
    return dots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const bulletStart = 80;
  const bulletEvery = 95;
  const stampedCode = Math.floor(100000 + (seed % 900000));
  const daySlug = prettyDate(dateISO);

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        color: theme.ink,
        padding: 72,
      }}
    >
      {includeSound ? <Audio src={staticFile("_daily-audio.mp3")} /> : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          transform: `translateY(${(1 - intro) * 8}px)`,
        }}
      >
        {noiseDots.map((dot, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size,
              background: theme.accent,
              opacity: dot.opacity,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 36,
          padding: 54,
          background: theme.panel,
          border: `1px solid rgba(255,255,255,0.14)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          transform: `translateY(${(1 - intro) * 34}px) scale(${0.96 + 0.04 * intro})`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: 999,
                background: theme.accentSoft,
                border: `1px solid rgba(255,255,255,0.18)`,
                letterSpacing: 0.4,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: 18,
                transform: `scale(${0.92 + 0.08 * headerPop})`,
                transformOrigin: "left center",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  background: theme.accent,
                  boxShadow: `0 0 0 6px ${theme.accentSoft}`,
                }}
              />
              Daily dispatch · {daySlug}
            </div>
            <h1
              style={{
                margin: "18px 0 0",
                fontSize: 72,
                lineHeight: 1.04,
                letterSpacing: -2,
                fontWeight: 900,
                maxWidth: 820,
              }}
            >
              {headline}
            </h1>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: 26,
                lineHeight: 1.35,
                maxWidth: 760,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              {subhead}
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "flex-end",
              opacity: interpolate(frame, [0, 40], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                columnGap: 18,
                rowGap: 8,
                padding: "16px 18px",
                borderRadius: 22,
                border: `1px solid rgba(255,255,255,0.16)`,
                background: "rgba(0,0,0,0.22)",
                fontSize: 18,
                letterSpacing: 0.2,
                minWidth: 270,
              }}
            >
              <span style={{ opacity: 0.68 }}>Case ID</span>
              <span style={{ fontWeight: 800, textAlign: "right" }}>
                {stampedCode}
              </span>
              <span style={{ opacity: 0.68 }}>Mood</span>
              <span style={{ fontWeight: 800, textAlign: "right" }}>
                {mood}
              </span>
              <span style={{ opacity: 0.68 }}>Audio</span>
              <span style={{ fontWeight: 800, textAlign: "right" }}>
                {includeSound ? "Absolutely" : "Silently judgmental"}
              </span>
            </div>

            <div
              style={{
                padding: "14px 18px",
                borderRadius: 999,
                border: `2px solid ${theme.accent}`,
                color: theme.accent,
                fontWeight: 900,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                fontSize: 16,
                transform: `rotate(${-10 + 12 * stampBounce}deg) scale(${
                  0.92 + 0.12 * stampBounce
                })`,
                boxShadow: `0 10px 20px rgba(0,0,0,0.35)`,
              }}
            >
              Approved-ish
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, display: "grid", gap: 16 }}>
          {bulletins.slice(0, 5).map((bulletin, index) => {
            const appear = spring({
              fps,
              frame: frame - (bulletStart + index * bulletEvery),
              config: { damping: 18, mass: 0.9, stiffness: 110 },
            });
            const opacity = interpolate(appear, [0, 0.5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = interpolate(appear, [0, 1], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`${index}-${bulletin}`}
                style={{
                  opacity,
                  transform: `translateY(${y}px)`,
                  padding: "18px 22px",
                  borderRadius: 22,
                  border: `1px solid rgba(255,255,255,0.14)`,
                  background: "rgba(0,0,0,0.18)",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    background: theme.accentSoft,
                    border: `1px solid rgba(255,255,255,0.16)`,
                    color: theme.accent,
                    fontWeight: 900,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {pad2(index + 1)}
                </div>
                <div style={{ fontSize: 28, lineHeight: 1.25, fontWeight: 700 }}>
                  {bulletin}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 44,
            padding: "14px 18px",
            borderRadius: 18,
            border: `1px solid rgba(255,255,255,0.14)`,
            background: "rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 48,
              whiteSpace: "nowrap",
              fontSize: 18,
              letterSpacing: 0.3,
              opacity: 0.84,
              transform: `translateX(${-tickerProgress * 540}px)`,
            }}
          >
            <span>
              Policy update: all meetings are now classified as performance art.
            </span>
            <span>
              Reminder: “quick question” legally requires a 40-minute prologue.
            </span>
            <span>
              Bureau note: the printer is sentient. Be respectful.
            </span>
            <span>
              Intake status: accepting minor chaos until further notice.
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 54,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
          opacity: interpolate(frame, [durationInFrames - 60, durationInFrames], [1, 0.65], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ fontSize: 16, letterSpacing: 0.5, opacity: 0.7 }}>
          Generated daily · Variant “{theme.name}”
        </div>
        <div
          style={{
            fontSize: 16,
            letterSpacing: 0.5,
            opacity: 0.7,
            textAlign: "right",
          }}
        >
          Forms processed today: {Math.floor(3 + (seed % 23))} ·
          &nbsp;Lessons learned: 0
        </div>
      </div>
    </AbsoluteFill>
  );
};

