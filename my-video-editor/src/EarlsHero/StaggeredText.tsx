import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

const EARLS_RED = "#C41E1E";

const WORDS = ["Bespoke.", "Professional.", "Built to Last."];
const STAGGER = 18; // frames between each word

export const StaggeredText: React.FC<{
  serifFont: string;
  sansFont: string;
}> = ({ serifFont, sansFont }) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Fade out the entire scene
  const sceneOpacity = interpolate(frame, [95, 130], [1, 0], {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {WORDS.map((word, i) => {
          const delay = i * STAGGER;
          const localFrame = Math.max(0, frame - delay);

          const y = spring({
            frame: localFrame,
            fps,
            config: { damping: 14, stiffness: 70, mass: 0.9 },
          });

          const translateY = interpolate(y, [0, 1], [35, 0]);
          const opacity = interpolate(localFrame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Subtle letter spacing animation
          const letterSpacing = interpolate(localFrame, [0, 20], [0.3, 0.08], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={word}
              style={{
                fontFamily: serifFont,
                fontSize: i === 2 ? 64 : 56, // "Built to Last." slightly bigger
                fontWeight: 700,
                color: i === 2 ? EARLS_RED : "#FFFFFF",
                letterSpacing: `${letterSpacing}em`,
                transform: `translateY(${translateY}px)`,
                opacity,
                textShadow:
                  i === 2
                    ? "0 2px 30px rgba(196, 30, 30, 0.4)"
                    : "0 2px 20px rgba(0,0,0,0.4)",
              }}
            >
              {word}
            </div>
          );
        })}

        {/* Tagline below */}
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 22,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
            marginTop: 20,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [55, 75], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [55, 75], [15, 0], {
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          Custom Picture Framing Since 1960
        </div>
      </div>
    </AbsoluteFill>
  );
};
