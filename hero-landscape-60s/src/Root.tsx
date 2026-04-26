import React from "react";
import { Composition } from "remotion";
import { HeroLandscape } from "./HeroLandscape";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroLandscape"
        component={HeroLandscape}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
