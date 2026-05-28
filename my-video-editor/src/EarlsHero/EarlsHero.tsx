import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  staticFile,
  Video,
  Img,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadSans } from "@remotion/google-fonts/SourceSans3";
import { LogoReveal } from "./LogoReveal";
import { FrameDrawing } from "./FrameDrawing";
import { StaggeredText } from "./StaggeredText";
import { RedRule } from "./RedRule";

const { fontFamily: serifFont } = loadFont();
const { fontFamily: sansFont } = loadSans();

const EARLS_BLACK = "#1A1A1A";
const EARLS_RED = "#C41E1E";

export const EarlsHero: React.FC = () => {
  const frame = useCurrentFrame();

  // Global vignette that deepens toward the end
  const vignetteOpacity = interpolate(frame, [0, 200, 280, 300], [0.3, 0.3, 0.7, 1], {
    extrapolateRight: "clamp",
  });

  // Fade from black at start
  const fadeInOpacity = interpolate(frame, [0, 30], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Fade to black at end (for seamless loop)
  const fadeOutOpacity = interpolate(frame, [260, 300], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Background video opacity — fades in gently
  const bgOpacity = interpolate(frame, [0, 45], [0, 0.35], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: EARLS_BLACK }}>
      {/* Background video layer — subtle, darkened */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <Video
          src={staticFile("background.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          startFrom={0}
          volume={0}
        />
      </AbsoluteFill>

      {/* Dark overlay on video */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${EARLS_BLACK} 100%)`,
          opacity: vignetteOpacity,
        }}
      />

      {/* Scene 1: Logo reveal (frames 0-90) */}
      <Sequence from={0} durationInFrames={120}>
        <LogoReveal serifFont={serifFont} />
      </Sequence>

      {/* Scene 2: Animated frame border (frames 50-150) */}
      <Sequence from={50} durationInFrames={130}>
        <FrameDrawing />
      </Sequence>

      {/* Scene 3: Staggered text reveals (frames 110-210) */}
      <Sequence from={110} durationInFrames={130}>
        <StaggeredText serifFont={serifFont} sansFont={sansFont} />
      </Sequence>

      {/* Scene 4: Red rule slide (frames 180-260) */}
      <Sequence from={180} durationInFrames={80}>
        <RedRule />
      </Sequence>

      {/* Fade from black (start) */}
      <AbsoluteFill
        style={{
          backgroundColor: EARLS_BLACK,
          opacity: fadeInOpacity,
        }}
      />

      {/* Fade to black (end — seamless loop) */}
      <AbsoluteFill
        style={{
          backgroundColor: EARLS_BLACK,
          opacity: fadeOutOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
