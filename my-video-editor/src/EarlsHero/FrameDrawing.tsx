import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const EARLS_RED = "#C41E1E";

// Golden ratio rectangle centered on screen
const RECT_W = 580;
const RECT_H = 380;
const CX = 960; // center x
const CY = 520; // center y (slightly above center)
const X = CX - RECT_W / 2;
const Y = CY - RECT_H / 2;

// Corner ornament size
const CORNER = 20;

export const FrameDrawing: React.FC = () => {
  const frame = useCurrentFrame();

  // Total perimeter for stroke animation
  const perimeter = 2 * (RECT_W + RECT_H);

  // Draw progress: 0 to 1 over frames 0-70
  const drawProgress = interpolate(frame, [0, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const strokeDashoffset = perimeter * (1 - drawProgress);

  // Opacity of the whole frame
  const opacity = interpolate(frame, [0, 10, 100, 130], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Inner glow when frame completes drawing
  const glowOpacity = interpolate(frame, [65, 80, 100, 130], [0, 0.6, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Corner ornaments appear after frame is drawn
  const cornerOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cornerScale = interpolate(frame, [60, 80], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute" }}
      >
        {/* Main frame rectangle — stroke draws itself */}
        <rect
          x={X}
          y={Y}
          width={RECT_W}
          height={RECT_H}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2}
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Inner line (slightly inset) */}
        <rect
          x={X + 8}
          y={Y + 8}
          width={RECT_W - 16}
          height={RECT_H - 16}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.5}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - Math.max(0, drawProgress - 0.15) / 0.85)}
        />

        {/* Glow effect when frame completes */}
        <rect
          x={X}
          y={Y}
          width={RECT_W}
          height={RECT_H}
          fill="none"
          stroke={EARLS_RED}
          strokeWidth={1}
          opacity={glowOpacity}
          filter="url(#glow)"
        />

        {/* Corner ornaments */}
        <g opacity={cornerOpacity} transform={`scale(${cornerScale})`} style={{ transformOrigin: `${X}px ${Y}px` }}>
          {/* Top-left */}
          <line x1={X - 10} y1={Y} x2={X + CORNER} y2={Y} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          <line x1={X} y1={Y - 10} x2={X} y2={Y + CORNER} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        </g>
        <g opacity={cornerOpacity}>
          {/* Top-right */}
          <line x1={X + RECT_W + 10} y1={Y} x2={X + RECT_W - CORNER} y2={Y} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          <line x1={X + RECT_W} y1={Y - 10} x2={X + RECT_W} y2={Y + CORNER} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        </g>
        <g opacity={cornerOpacity}>
          {/* Bottom-left */}
          <line x1={X - 10} y1={Y + RECT_H} x2={X + CORNER} y2={Y + RECT_H} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          <line x1={X} y1={Y + RECT_H + 10} x2={X} y2={Y + RECT_H - CORNER} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        </g>
        <g opacity={cornerOpacity}>
          {/* Bottom-right */}
          <line x1={X + RECT_W + 10} y1={Y + RECT_H} x2={X + RECT_W - CORNER} y2={Y + RECT_H} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
          <line x1={X + RECT_W} y1={Y + RECT_H + 10} x2={X + RECT_W} y2={Y + RECT_H - CORNER} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        </g>

        {/* SVG filter for glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
