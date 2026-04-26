import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";
import { BrowserWindow, MikesPlumbingPage } from "../components/BrowserWindow";
import { ChatBubble } from "../components/ChatBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { AnimatedText } from "../components/AnimatedText";

/**
 * PivotScene · 0:08 → 0:18 · frames 240–540 (LOCAL frames 0–300)
 * Browser left, sleeping plumber right.
 * Customer types panicked message. AI replies in plumber tone.
 * Title underline at local frame 240: "Answers every call. In your voice. 24/7."
 */
export const PivotScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Browser fades up over 12 frames at start
  const browserOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Widget grows from 48px dot to full size between frames 12-30
  const widgetScale = interpolate(frame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
      }}
    >
      {/* Subtle late-night gradient stays consistent with HookScene */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(249,115,22,0.04) 0%, transparent 60%)",
        }}
      />

      {/* CENTERED: Browser with widget (sleeper removed, browser re-centered) */}
      <div
        style={{
          position: "absolute",
          left: 370,
          top: 130,
          opacity: browserOpacity,
        }}
      >
        <BrowserWindow width={1180} height={760} url="mikesplumbing.com">
          <MikesPlumbingPage />

          {/* Widget bottom-right of the browser */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              transform: `scale(${widgetScale})`,
              transformOrigin: "bottom right",
              width: 380,
              background: colors.widgetBg,
              border: `1px solid ${colors.widgetBorder}`,
              borderRadius: 20,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              overflow: "hidden",
              fontFamily: font.family,
            }}
          >
            {/* Widget header */}
            <div
              style={{
                background: colors.widgetHeaderBg,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: `1px solid ${colors.widgetBorder}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: colors.brand,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0a0b",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                M
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: colors.textPrimary,
                  }}
                >
                  Mike's Plumbing
                </div>
                <div
                  style={{
                    fontSize: 11,
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
                      boxShadow: `0 0 6px ${colors.success}`,
                    }}
                  />
                  Online · replies instantly
                </div>
              </div>
            </div>

            {/* Chat thread */}
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 280,
                fontSize: 13,
              }}
            >
              {/* Customer message at frame 30 (1.0s into scene) */}
              <Sequence from={30} layout="none">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      maxWidth: "82%",
                      background: colors.userBubbleBg,
                      color: colors.userBubbleText,
                      borderRadius: 14,
                      borderBottomRightRadius: 4,
                      padding: "10px 14px",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    water heater just burst basement flooding
                  </div>
                </div>
              </Sequence>

              {/* Typing indicator from frame 90 to 130 */}
              <Sequence from={90} durationInFrames={40} layout="none">
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "82%",
                      background: colors.botBubbleBg,
                      border: `1px solid ${colors.widgetBorder}`,
                      borderRadius: 14,
                      borderBottomLeftRadius: 4,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: colors.brand,
                        opacity: 0.9 - 0.4 * Math.sin(frame / 5),
                      }}
                    />
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: colors.brand,
                        opacity: 0.9 - 0.4 * Math.sin(frame / 5 + 0.6),
                      }}
                    />
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: colors.brand,
                        opacity: 0.9 - 0.4 * Math.sin(frame / 5 + 1.2),
                      }}
                    />
                  </div>
                </div>
              </Sequence>

              {/* AI reply at frame 130 */}
              <Sequence from={130} layout="none">
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "82%",
                      background: colors.botBubbleBg,
                      color: colors.botBubbleText,
                      border: `1px solid ${colors.widgetBorder}`,
                      borderRadius: 14,
                      borderBottomLeftRadius: 4,
                      padding: "10px 14px",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                    }}
                  >
                    Sorry to hear that. We can have a tech there by 4 AM. Want
                    me to lock it in and take a deposit to hold the slot?
                  </div>
                </div>
              </Sequence>

              {/* Input bar at bottom */}
              <div style={{ flex: 1 }} />
              <div
                style={{
                  borderTop: `1px solid ${colors.widgetBorder}`,
                  paddingTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                <span>Type a message...</span>
              </div>
            </div>
          </div>
        </BrowserWindow>
      </div>

      {/* Title underline at local frame 240 (8s) */}
      {frame >= 240 && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <AnimatedText
            text="Answers every call. In your voice. 24/7."
            delay={240}
            fontSize={48}
            color="#ffffff"
            weight={700}
            letterSpacing={-0.015}
            textShadow="0 4px 20px rgba(0,0,0,0.8)"
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
