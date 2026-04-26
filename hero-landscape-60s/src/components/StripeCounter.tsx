import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";

type Props = {
  startFrame?: number;
  durationFrames?: number;
  endValue?: number;
  label?: string;
};

/**
 * Stripe-style balance counter. Rolls from $0 up to endValue.
 * Soft mechanical tick is added in the audio layer of HeroLandscape.
 */
export const StripeCounter: React.FC<Props> = ({
  startFrame = 0,
  durationFrames = 24,
  endValue = 297,
  label = "Today's Stripe balance",
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const value = Math.round(
    interpolate(local, [0, durationFrames], [0, endValue], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        background: "#0c0c0e",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "20px 28px",
        fontFamily: font.family,
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: colors.textTertiary,
          fontWeight: 500,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-0.02em",
          }}
        >
          ${value.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: 16,
            color: colors.success,
            fontWeight: 600,
            marginLeft: 8,
          }}
        >
          +${value > 0 ? value : 0}
        </span>
      </div>
    </div>
  );
};
