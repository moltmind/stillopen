import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../brand/colors";

type Props = {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  letterSpacing?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  textShadow?: string;
};

export const AnimatedText: React.FC<Props> = ({
  text,
  delay = 0,
  fontSize = 96,
  color = "#fafafa",
  weight = 800,
  letterSpacing = -0.02,
  lineHeight = 1.05,
  align = "center",
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const rise = spring({
    frame: local,
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 140 },
  });

  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(rise, [0, 1], [42, 0]);

  return (
    <div
      style={{
        fontFamily: font.family,
        fontSize,
        fontWeight: weight,
        color,
        letterSpacing: `${letterSpacing}em`,
        lineHeight,
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow,
        width: "100%",
      }}
    >
      {text}
    </div>
  );
};
