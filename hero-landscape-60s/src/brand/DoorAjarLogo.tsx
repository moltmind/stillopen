import React from "react";
import { colors } from "./colors";

type Props = {
  size?: number;
  strokeColor?: string;
  doorColor?: string;
  knobColor?: string;
};

export const DoorAjarLogo: React.FC<Props> = ({
  size = 120,
  strokeColor = colors.textPrimary,
  doorColor = colors.brand,
  knobColor = "#0a0a0b",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="8"
        width="40"
        height="50"
        rx="1"
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
      />
      <path d="M10 58 L10 8 L38 14 L38 52 Z" fill={doorColor} />
      <circle cx="33" cy="34" r="2" fill={knobColor} />
    </svg>
  );
};
