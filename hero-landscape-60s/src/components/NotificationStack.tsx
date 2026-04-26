import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font } from "../brand/colors";

type Notification = {
  time: string;
  title: string;
  body: string;
};

type Props = {
  notifications: Notification[];
  startFrame?: number;
  staggerFrames?: number;
  width?: number;
};

/**
 * iMessage-style stacked notifications on a phone lock screen.
 * Each one drops in with a small bounce, staggered.
 */
export const NotificationStack: React.FC<Props> = ({
  notifications,
  startFrame = 0,
  staggerFrames = 30,
  width = 320,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width,
      }}
    >
      {notifications.map((n, i) => {
        const localFrame = frame - startFrame - i * staggerFrames;
        const drop = spring({
          frame: localFrame,
          fps,
          config: { damping: 14, mass: 0.6, stiffness: 130 },
        });
        const opacity = interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(drop, [0, 1], [-30, 0]);
        const scale = interpolate(drop, [0, 1], [0.95, 1]);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              background: "rgba(28,28,32,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "12px 14px",
              fontFamily: font.family,
              display: "flex",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: colors.brand,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0b",
                fontWeight: 800,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: colors.textPrimary,
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.textTertiary,
                    fontWeight: 500,
                  }}
                >
                  {n.time}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 1.35,
                }}
              >
                {n.body}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
