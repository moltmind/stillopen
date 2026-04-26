import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";
import { PhoneFrameLandscape, PhoneWallpaper } from "../components/PhoneFrameLandscape";
import { AnimatedText } from "../components/AnimatedText";

/**
 * HookScene · 0:00 → 0:08 · frames 0–240 (LOCAL frames 0–240)
 * Plumber on couch at 2:14 AM. Phone vibrates with "Unknown Number".
 * He lets it go to voicemail. Voicemail icon dies.
 * Title slam at frame 180: "Another job lost."
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Background room ambience: very dim with a flickering TV glow
  const tvFlicker = 0.5 + 0.3 * Math.sin(frame / 4) * Math.cos(frame / 7);

  // Phone vibration: 4-frame jitter loop, two cycles between f30-f110
  const isVibrating = frame >= 30 && frame <= 110;
  const vibrateX = isVibrating
    ? Math.sin(frame * 6) * 3 + Math.cos(frame * 11) * 2
    : 0;
  const vibrateY = isVibrating ? Math.cos(frame * 5) * 2 : 0;

  // Caller ID swipes off-frame after frame 90
  const callerOpacity = interpolate(frame, [10, 30, 90, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callerTranslateY = interpolate(frame, [90, 110], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Voicemail icon: pulses once at f130, then dims to 30%
  const voicemailOpacity = interpolate(
    frame,
    [120, 132, 156, 180],
    [0, 1, 1, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const voicemailScale = interpolate(frame, [120, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#020203",
      }}
    >
      {/* Ambient TV glow: subtle blue from off-screen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 80% 30%, rgba(40,60,90,${
            0.18 * tvFlicker
          }) 0%, transparent 55%)`,
        }}
      />

      {/* Vignette for the late-night look */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Coffee table front-edge hint */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 60,
          transform: "translateX(-50%)",
          width: 900,
          height: 12,
          background: "linear-gradient(180deg, #0c0c0e 0%, #050506 100%)",
          borderRadius: 4,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.8)",
        }}
      />

      {/* Phone on the coffee table, vibrating */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 100,
          transform: `translateX(${-180 + vibrateX}px) translateY(${vibrateY}px) rotate(-3deg)`,
        }}
      >
        <PhoneFrameLandscape width={240} glow={isVibrating}>
          <PhoneWallpaper />

          {/* 2:14 AM time + lock screen content */}
          <div
            style={{
              position: "absolute",
              top: 60,
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
              Tuesday, April 14
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 200,
                marginTop: 4,
                letterSpacing: "-0.02em",
              }}
            >
              2:14
            </div>
          </div>

          {/* Caller ID card */}
          <div
            style={{
              position: "absolute",
              top: 220,
              left: 16,
              right: 16,
              opacity: callerOpacity,
              transform: `translateY(${callerTranslateY}px)`,
              background: "rgba(20,20,22,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "14px 16px",
              fontFamily: font.family,
              textAlign: "center",
            }}
          >
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
              Incoming call
            </div>
            <div
              style={{
                fontSize: 18,
                color: colors.textPrimary,
                fontWeight: 700,
              }}
            >
              Unknown Number
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              Mobile · Nearby
            </div>
          </div>

          {/* Voicemail icon (after caller ID swipes off) */}
          <div
            style={{
              position: "absolute",
              top: 240,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: voicemailOpacity,
              transform: `scale(${voicemailScale})`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              📞
            </div>
            <div
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                fontWeight: 600,
                fontFamily: font.family,
              }}
            >
              Missed Call · Voicemail
            </div>
          </div>
        </PhoneFrameLandscape>
      </div>

      {/* Title slam: "Another job lost." */}
      {frame >= 180 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <AnimatedText
            text="Another job lost."
            delay={180}
            fontSize={140}
            color="#ffffff"
            weight={800}
            letterSpacing={-0.025}
            textShadow="0 6px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)"
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
