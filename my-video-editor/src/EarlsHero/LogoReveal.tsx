import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";

export const LogoReveal: React.FC<{ serifFont: string }> = ({ serifFont }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Logo scales in with spring
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  // Logo opacity
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo subtle glow pulse
  const glowOpacity = interpolate(
    frame,
    [20, 40, 60, 80],
    [0, 0.4, 0.2, 0],
    { extrapolateRight: "clamp" }
  );

  // "EARL'S FRAMING" wordmark slides up
  const wordmarkY = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });
  const wordmarkTranslate = interpolate(wordmarkY, [0, 1], [40, 0]);
  const wordmarkOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out the whole logo scene
  const sceneOpacity = interpolate(frame, [85, 120], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
      }}
    >
      {/* Logo image */}
      <Img
        src={staticFile("earls-logo.png")}
        style={{
          width: 220,
          height: 220,
          objectFit: "contain",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          filter: `drop-shadow(0 0 ${30 * glowOpacity}px rgba(196, 30, 30, ${glowOpacity}))`,
        }}
      />

      {/* Wordmark */}
      <div
        style={{
          position: "absolute",
          top: "58%",
          fontFamily: serifFont,
          fontSize: 52,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          transform: `translateY(${wordmarkTranslate}px)`,
          opacity: wordmarkOpacity,
          textShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}
      >
        EARL&apos;S FRAMING
      </div>

      {/* Thin decorative line under wordmark */}
      <div
        style={{
          position: "absolute",
          top: "65%",
          width: interpolate(frame, [40, 70], [0, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 1.5,
          backgroundColor: "#C41E1E",
          opacity: wordmarkOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
