import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";
import { PhoneFrameLandscape, PhoneWallpaper } from "../components/PhoneFrameLandscape";
import { NotificationStack } from "../components/NotificationStack";
import { StripeCounter } from "../components/StripeCounter";
import { CalendarFill } from "../components/CalendarFill";

/**
 * ProofScene · 0:32 → 0:44 · frames 960–1320 (LOCAL frames 0–360)
 * Sunrise. Plumber sits up (silhouette). Reaches for phone.
 * Three booking notifications stack. Stripe counter rolls $0 -> $297.
 * Calendar week-grid populates with three orange chips.
 */
export const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Sunrise gradient sweep over 60 frames
  const sunriseProgress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#050506",
      }}
    >
      {/* Sunrise gradient: warm orange-amber sweeping left to right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(110deg,
            rgba(255, 140, 60, ${0.18 * sunriseProgress}) 0%,
            rgba(255, 175, 100, ${0.10 * sunriseProgress}) 25%,
            rgba(40, 30, 50, ${0.30 * sunriseProgress}) 60%,
            rgba(20, 20, 30, ${0.40 * sunriseProgress}) 100%)`,
        }}
      />

      {/* Subtle window-blind streaks */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(180deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 80px,
            rgba(0,0,0,${0.08 * sunriseProgress}) 80px,
            rgba(0,0,0,${0.08 * sunriseProgress}) 84px)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* LEFT: Phone with notifications */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 110,
        }}
      >
        <PhoneFrameLandscape width={400} glow={false}>
          <PhoneWallpaper />

          {/* Lock screen header: 6:42 AM */}
          <div
            style={{
              position: "absolute",
              top: 70,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: font.family,
              color: colors.textPrimary,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: colors.textTertiary,
                letterSpacing: "0.05em",
              }}
            >
              Wednesday, April 15
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 200,
                marginTop: 4,
                letterSpacing: "-0.02em",
              }}
            >
              6:42
            </div>
          </div>

          {/* Notification stack starts at frame 30 (1s into scene) */}
          <div
            style={{
              position: "absolute",
              top: 240,
              left: 16,
              right: 16,
            }}
          >
            <NotificationStack
              startFrame={30}
              staggerFrames={42}
              width={368}
              notifications={[
                {
                  time: "2:18 AM",
                  title: "StillOpen",
                  body: "Burst water heater · $99 deposit",
                },
                {
                  time: "4:51 AM",
                  title: "StillOpen",
                  body: "Drain clog · $99 deposit",
                },
                {
                  time: "6:30 AM",
                  title: "StillOpen",
                  body: "Toilet repair · $99 deposit",
                },
              ]}
            />
          </div>
        </PhoneFrameLandscape>
      </div>

      {/* RIGHT TOP: Stripe counter */}
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 180,
        }}
      >
        <StripeCounter
          startFrame={180}
          durationFrames={36}
          endValue={297}
          label="Stripe · last 12 hours"
        />
      </div>

      {/* RIGHT BOTTOM: Calendar week */}
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 360,
        }}
      >
        <CalendarFill
          startFrame={210}
          staggerFrames={28}
          width={620}
          height={360}
          appointments={[
            { day: 2, hour: 4, duration: 2, label: "Burst heater" },
            { day: 2, hour: 7, duration: 1, label: "Drain clog" },
            { day: 2, hour: 9, duration: 2, label: "Toilet repair" },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
