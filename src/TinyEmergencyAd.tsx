import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type TinyEmergencyAdProps = {
  accent: "blue" | "green" | "pink" | "yellow";
  badge: string;
  crises: string[];
  headline: string;
  punchline: string;
  stamp: string;
};

const palette = {
  background: "#100b1f",
  ink: "#fff8e8",
  muted: "#d6c7b1",
  yellow: "#ffd166",
  pink: "#ff5da2",
  blue: "#6ee7f9",
  green: "#a7f070",
  shadow: "#17111e",
};

export const TinyEmergencyAd = ({
  accent,
  badge,
  crises,
  headline,
  punchline,
  stamp,
}: TinyEmergencyAdProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accentColor = palette[accent];

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 120,
    },
  });

  const stampRotation = interpolate(frame, [2 * fps, 3.1 * fps], [-24, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const stampScale = spring({
    frame: frame - 2 * fps,
    fps,
    config: {
      damping: 8,
      mass: 0.6,
      stiffness: 180,
    },
  });

  const footerY = interpolate(frame, [4 * fps, 5 * fps], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const bubbleDrift = interpolate(frame, [0, 180], [-16, 24]);
  const panicNeedle = interpolate(frame, [0, 70, 115, 180], [-32, 18, -8, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 10%, rgba(255, 209, 102, 0.34), transparent 360px), radial-gradient(circle at 85% 20%, rgba(255, 93, 162, 0.28), transparent 340px), linear-gradient(135deg, #100b1f 0%, #231339 52%, #111827 100%)",
        color: palette.ink,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 130 + bubbleDrift,
          right: 80,
          width: 190,
          height: 190,
          border: `5px solid ${palette.shadow}`,
          borderRadius: 999,
          background: accentColor,
          boxShadow: `14px 14px 0 ${palette.shadow}`,
          opacity: 0.88,
          transform: `rotate(${panicNeedle}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 230 - bubbleDrift,
          left: 74,
          width: 115,
          height: 115,
          border: `5px solid ${palette.shadow}`,
          borderRadius: 32,
          background: palette.green,
          boxShadow: `12px 12px 0 ${palette.shadow}`,
          transform: `rotate(${interpolate(frame, [0, 180], [-8, 18])}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.055) 2px, transparent 2px)",
          backgroundSize: "56px 56px",
          opacity: 0.75,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 76,
          left: 76,
          display: "flex",
          alignItems: "center",
          gap: 22,
          transform: `translateY(${interpolate(intro, [0, 1], [-40, 0])}px)`,
          opacity: intro,
        }}
      >
        <div
          style={{
            display: "grid",
            width: 82,
            height: 82,
            placeItems: "center",
            border: `5px solid ${palette.shadow}`,
            borderRadius: 28,
            color: palette.shadow,
            background: `linear-gradient(135deg, ${palette.yellow}, ${accentColor})`,
            boxShadow: `12px 12px 0 ${palette.shadow}`,
            fontSize: 58,
            fontWeight: 900,
            transform: "rotate(-6deg)",
          }}
        >
          !
        </div>
        <div style={{ fontSize: 35, fontWeight: 900, letterSpacing: -1.5 }}>
          Bureau of Tiny Emergencies
        </div>
      </div>

      <main
        style={{
          width: 850,
          transform: `scale(${interpolate(intro, [0, 1], [0.94, 1])})`,
          opacity: intro,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            marginBottom: 30,
            border: `3px solid ${palette.shadow}`,
            borderRadius: 999,
            padding: "13px 22px",
            color: palette.shadow,
            background: accentColor,
            boxShadow: `8px 8px 0 ${palette.shadow}`,
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          {badge}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 102,
            lineHeight: 0.92,
            letterSpacing: -7,
            textWrap: "balance",
          }}
        >
          {headline}
        </h1>

        <div
          style={{
            display: "grid",
            gap: 18,
            marginTop: 44,
          }}
        >
          {crises.map((crisis, index) => {
            const itemIntro = spring({
              frame: frame - (index * fps) / 4 - 18,
              fps,
              config: {
                damping: 13,
                mass: 0.7,
                stiffness: 150,
              },
            });

            return (
              <div
                key={crisis}
                style={{
                  border: "2px solid rgba(255,248,232,0.22)",
                  borderRadius: 28,
                  padding: "24px 28px",
                  background: "rgba(255,248,232,0.12)",
                  color: palette.muted,
                  fontSize: 31,
                  fontWeight: 800,
                  transform: `translateX(${interpolate(itemIntro, [0, 1], [-80, 0])}px)`,
                  opacity: itemIntro,
                }}
              >
                {crisis}
              </div>
            );
          })}
        </div>
      </main>

      <div
        style={{
          position: "absolute",
          right: 88,
          bottom: 196,
          border: `8px solid ${accentColor}`,
          borderRadius: 28,
          padding: "24px 36px",
          color: accentColor,
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: 3,
          textTransform: "uppercase",
          transform: `rotate(${stampRotation}deg) scale(${stampScale})`,
          opacity: stampScale,
        }}
      >
        {stamp}
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          left: 0,
          padding: "40px 76px",
          background: "rgba(0,0,0,0.32)",
          transform: `translateY(${footerY}px)`,
        }}
      >
        <div
          style={{
            color: palette.ink,
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          {punchline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
