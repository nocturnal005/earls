import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const EARLS_RED = "#C41E1E";

export const RedRule: React.FC = () => {
  const frame = useCurrentFrame();

  // Red line slides in from left to right
  const lineWidth = interpolate(frame, [0, 40], [0, 400], {
    extrapolateRight: "clamp",
  });

  const lineOpacity = interpolate(frame, [0, 5, 50, 80], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Small diamond accent at the end of the line
  const diamondOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const diamondScale = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: lineOpacity,
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* The red horizontal rule */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            backgroundColor: EARLS_RED,
            borderRadius: 2,
            boxShadow: `0 0 20px rgba(196, 30, 30, 0.5)`,
          }}
        />

        {/* Diamond accent at end */}
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: EARLS_RED,
            transform: `rotate(45deg) scale(${diamondScale})`,
            opacity: diamondOpacity,
            marginLeft: 8,
            boxShadow: `0 0 12px rgba(196, 30, 30, 0.6)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
