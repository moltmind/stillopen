import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../brand/colors";
import { PricingCard } from "../components/PricingCard";

/**
 * OfferScene · 0:44 → 0:54 · frames 1320–1620 (LOCAL frames 0–300)
 * Pricing card rises. Numbers count up. "Custom-trained on your business."
 * underlines in orange (visual hero of the card). Three checkmarks draw.
 */
export const OfferScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Background dim with brand glow centered behind the card
  const glowOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dissolve out at the end (frames 282-300)
  const sceneOpacity = interpolate(frame, [282, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        opacity: sceneOpacity,
      }}
    >
      {/* Brand glow behind the card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(249,115,22,${
            0.12 * glowOpacity
          }) 0%, transparent 55%)`,
        }}
      />

      {/* Vignette to focus the eye on the card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Centered pricing card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PricingCard startFrame={0} />
      </div>
    </AbsoluteFill>
  );
};
