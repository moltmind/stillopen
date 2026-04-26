import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, font } from "../brand/colors";

/**
 * BookingScene · 0:18 → 0:32 · frames 540–960 (LOCAL frames 0–420)
 * Push into the chat. Slot picker. Stripe deposit. Confirmation. Calendar tile.
 * Plumber silhouette stays motionless on the right edge throughout.
 */
export const BookingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slot picker rises 80px with spring ease (frames 0-30)
  const slotSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const slotOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slotTranslate = interpolate(slotSpring, [0, 1], [80, 0]);

  // Slot picker tap at frame 90
  const slotTapScale = interpolate(frame, [90, 96, 102], [1, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stripe widget assembles in three steps starting at frame 110
  const stripeFrameOpacity = interpolate(frame, [110, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stripeNumberReveal = interpolate(frame, [134, 158], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stripeCheckScale = interpolate(frame, [170, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Confirmation message at frame 220
  const confirmOpacity = interpolate(frame, [220, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const confirmTranslate = interpolate(frame, [220, 240], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calendar tile slides in from right at frame 280
  const calendarTileX = interpolate(frame, [280, 304], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calendarTileOpacity = interpolate(frame, [280, 304], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
      }}
    >
      {/* Background remains the late-night gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(249,115,22,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Centered chat panel zoomed in (push from PivotScene) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          background: colors.widgetBg,
          border: `1px solid ${colors.widgetBorder}`,
          borderRadius: 24,
          padding: "28px 32px",
          fontFamily: font.family,
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingBottom: 16,
            borderBottom: `1px solid ${colors.widgetBorder}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: colors.brand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#0a0a0b",
              fontSize: 18,
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
              Mike's Plumbing
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 2,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: colors.success,
                }}
              />
              Booking · live
            </div>
          </div>
        </div>

        {/* Slot picker */}
        <div
          style={{
            opacity: slotOpacity,
            transform: `translateY(${slotTranslate}px) scale(${slotTapScale})`,
            background: "#141416",
            border: `1px solid ${colors.brandBorder}`,
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: colors.textTertiary,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Available slot
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.textPrimary,
                  letterSpacing: "-0.01em",
                }}
              >
                Tonight, 4:00 AM
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Emergency response · $99 deposit holds the slot
              </div>
            </div>
            <div
              style={{
                background: colors.brand,
                color: "#0a0a0b",
                fontWeight: 700,
                padding: "10px 16px",
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              Confirm
            </div>
          </div>
        </div>

        {/* Stripe payment widget */}
        <div
          style={{
            opacity: stripeFrameOpacity,
            background: "#0a0a0b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "16px 18px",
            marginBottom: 18,
            position: "relative",
          }}
        >
          {/* Orange brand stripe */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, #635bff 0%, ${colors.brand} 100%)`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: colors.textTertiary,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Card on file
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  fontFamily: 'ui-monospace, "SF Mono", monospace',
                  letterSpacing: "0.05em",
                }}
              >
                •••• •••• ••••{" "}
                <span
                  style={{
                    opacity: stripeNumberReveal,
                    color: colors.textPrimary,
                  }}
                >
                  4242
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.textPrimary,
                }}
              >
                $99.00
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: colors.success,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0a0b",
                  fontWeight: 800,
                  fontSize: 18,
                  transform: `scale(${stripeCheckScale})`,
                }}
              >
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation message bubble */}
        <div
          style={{
            opacity: confirmOpacity,
            transform: `translateY(${confirmTranslate}px)`,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "82%",
              background: colors.botBubbleBg,
              color: colors.botBubbleText,
              border: `1px solid ${colors.widgetBorder}`,
              borderRadius: 14,
              borderBottomLeftRadius: 4,
              padding: "12px 16px",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: colors.success, fontWeight: 700 }}>
              Booked.
            </span>{" "}
            Tech is en route at 4:00. You'll get a text when they're 10 minutes
            out.
          </div>
        </div>
      </div>

      {/* Calendar tile slides in from right edge */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: `translate(${calendarTileX}px, -50%)`,
          opacity: calendarTileOpacity,
          background: "#0c0c0e",
          border: `1px solid ${colors.brandBorder}`,
          borderRadius: 14,
          padding: "20px 24px",
          fontFamily: font.family,
          minWidth: 280,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${colors.brandGlow}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: colors.textTertiary,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Calendar · added
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: colors.brand,
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          4:00 AM
        </div>
        <div
          style={{
            fontSize: 14,
            color: colors.textPrimary,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Burst water heater
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.success,
            fontWeight: 600,
          }}
        >
          $99 deposit · paid
        </div>
      </div>
    </AbsoluteFill>
  );
};
