import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font } from "../brand/colors";

type Props = {
  startFrame?: number;
};

/**
 * Pricing card. The "Custom-trained on your business." line is the visual hero.
 * Two prices count up. Three checkmarks draw in staggered.
 */
export const PricingCard: React.FC<Props> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const rise = spring({
    frame: local,
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 130 },
  });
  const cardOpacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(rise, [0, 1], [120, 0]);

  // Numbers count up between local frames 12 and 42
  const installValue = Math.round(
    interpolate(local, [12, 42], [0, 297], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const monthlyValue = Math.round(
    interpolate(local, [12, 42], [0, 47], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Custom-trained underline draws between local frames 60 and 78
  const underlineWidth = interpolate(local, [60, 78], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Checkmarks at local frames 90, 114, 138
  const checks = [
    { at: 90, text: "Answers every call in your voice" },
    { at: 114, text: "Books the job and takes the deposit" },
    { at: 138, text: "Works the hours you cannot" },
  ];

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${translateY}px)`,
        background: "#0c0c0e",
        border: `2px solid ${colors.brandBorder}`,
        borderRadius: 20,
        padding: "44px 56px",
        fontFamily: font.family,
        minWidth: 720,
        maxWidth: 820,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${colors.brandGlow}`,
      }}
    >
      {/* Prices row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 36,
          marginBottom: 28,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            ${installValue}
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.textTertiary,
              fontWeight: 600,
              marginTop: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Install
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 64,
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            ${monthlyValue}
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: colors.textSecondary,
                marginLeft: 4,
              }}
            >
              /mo
            </span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.textTertiary,
              fontWeight: 600,
              marginTop: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Cancel anytime
          </div>
        </div>
      </div>

      {/* Hero line: Custom-trained on your business */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 14,
          position: "relative",
          display: "inline-block",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: colors.brand,
            letterSpacing: "-0.01em",
            display: "inline-block",
            position: "relative",
          }}
        >
          Custom-trained on your business.
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${underlineWidth}%`,
              height: 4,
              background: colors.brand,
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 17,
          color: colors.textSecondary,
          fontWeight: 500,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Live in 24 hours.
      </div>

      {/* Checkmarks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        {checks.map((c, i) => {
          const checkLocal = local - c.at;
          const checkOpacity = interpolate(checkLocal, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const checkScale = interpolate(checkLocal, [0, 10], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: checkOpacity,
                transform: `scale(${checkScale})`,
                transformOrigin: "left center",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(52,211,153,0.15)",
                  border: `1.5px solid ${colors.success}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.success,
                  fontSize: 16,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: colors.textPrimary,
                  fontWeight: 500,
                }}
              >
                {c.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
