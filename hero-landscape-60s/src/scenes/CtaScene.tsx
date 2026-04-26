import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";
import { DoorAjarLogo } from "../brand/DoorAjarLogo";
import { AnimatedText } from "../components/AnimatedText";

/**
 * CtaScene · 0:54 → 1:00 · frames 1620–1800 (LOCAL frames 0–180)
 * Black background. DoorAjarLogo settles. Tagline. URL types in.
 * Last second is a stable hold for the social-platform thumbnail.
 */
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Logo: pieces converge over 30 frames
  const logoConverge = interpolate(frame, [6, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(logoConverge, [0, 1], [0.7, 1]);

  // Tagline fades up at frame 36 over 18 frames
  const taglineOpacity = interpolate(frame, [36, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineTranslateY = interpolate(frame, [36, 54], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL types char-by-char from frame 60 to 96 (12 chars × 3 frames each)
  const url = "stillopen.ai";
  const charsToShow = Math.min(
    Math.floor(interpolate(frame, [60, 96], [0, url.length + 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    url.length
  );
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: "#000",
      }}
    >
      {/* Subtle brand-orange ambient at the center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(249,115,22,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <DoorAjarLogo size={180} />
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font.family,
            fontSize: 56,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Your sign says closed.
          <br />
          <span style={{ color: colors.brand }}>StillOpen stays open.</span>
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          top: "78%",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: 'ui-monospace, "SF Mono", monospace',
            fontSize: 32,
            fontWeight: 600,
            color: colors.brand,
            letterSpacing: "0.02em",
          }}
        >
          {url.slice(0, charsToShow)}
          <span style={{ opacity: cursorBlink ? 1 : 0, color: colors.brand }}>
            ▍
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
