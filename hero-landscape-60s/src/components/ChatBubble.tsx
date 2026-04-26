import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";

type Props = {
  text: string;
  role: "user" | "bot";
  delay?: number;
};

/**
 * Exact replica of the live StillOpen widget bubble (.he-bubble-text + .he-msg).
 *
 * Real widget reference (chatbot.js):
 *   - max-width: 82%
 *   - padding: 10px 14px   (scaled 2.8× here for 1080w vertical)
 *   - border-radius: 14px  (scaled)
 *   - font-size: 13.5px    (scaled)
 *   - line-height: 1.5
 *   - user (customer) = orange #f97316, white text, flat-ish bottom-right corner
 *   - bot (AI front desk) = dark #18181b, muted text #b4b4bd, 1px border, flat-ish bottom-left corner
 *   - entry animation: 0.2s ease, 6px translateY slide + opacity fade
 */
export const ChatBubble: React.FC<Props> = ({ text, role, delay = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;

  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(local, [0, 8], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "82%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        alignItems: isUser ? "flex-end" : "flex-start",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          padding: "28px 40px",
          fontFamily: font.family,
          fontSize: 38,
          lineHeight: 1.5,
          letterSpacing: "-0.005em",
          wordBreak: "break-word",
          background: isUser ? colors.userBubbleBg : colors.botBubbleBg,
          color: isUser ? colors.userBubbleText : colors.botBubbleText,
          borderRadius: 40,
          borderBottomRightRadius: isUser ? 12 : 40,
          borderBottomLeftRadius: isUser ? 40 : 12,
          border: isUser ? "none" : `1px solid ${colors.widgetBorder}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
