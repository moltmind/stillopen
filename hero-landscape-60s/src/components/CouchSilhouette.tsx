import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  scale?: number;
  breathing?: boolean;
};

/**
 * Silhouette of a person on a couch / bed, sleeping.
 * Black-on-near-black so it reads as a shape, not a face.
 * Optional gentle breathing loop (3% scale on Y, 4-second cycle).
 */
export const CouchSilhouette: React.FC<Props> = ({
  scale = 1,
  breathing = true,
}) => {
  const frame = useCurrentFrame();

  // 4-second breathing cycle = 120 frames
  const breathPhase = breathing ? Math.sin((frame / 120) * Math.PI * 2) : 0;
  const yScale = 1 + breathPhase * 0.015;

  return (
    <div
      style={{
        width: 600 * scale,
        height: 320 * scale,
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 320"
        fill="none"
        style={{
          transform: `scaleY(${yScale})`,
          transformOrigin: "center bottom",
        }}
      >
        {/* Couch base */}
        <rect
          x="0"
          y="220"
          width="600"
          height="100"
          fill="#0a0a0b"
        />
        {/* Couch back */}
        <rect
          x="0"
          y="160"
          width="600"
          height="80"
          fill="#0e0e10"
          rx="6"
        />
        {/* Pillow under head */}
        <ellipse cx="120" cy="180" rx="80" ry="22" fill="#141416" />
        {/* Body shape — head, shoulder, torso, legs */}
        <path
          d="M 60 175
             Q 90 145 130 155
             Q 165 162 195 178
             Q 240 188 320 196
             Q 420 204 500 210
             L 520 220
             L 60 220
             Z"
          fill="#050506"
          stroke="#1a1a1e"
          strokeWidth="1"
        />
        {/* Arm draped over face */}
        <path
          d="M 95 168 Q 110 158 135 160 Q 145 165 140 170 Z"
          fill="#030304"
        />
      </svg>
    </div>
  );
};
