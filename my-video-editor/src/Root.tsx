import { Composition } from "remotion";
import { EarlsHero } from "./EarlsHero/EarlsHero";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EarlsHero"
        component={EarlsHero}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
