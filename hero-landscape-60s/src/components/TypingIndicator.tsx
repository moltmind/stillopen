import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../brand/colors";

type Props = {
  delay?: number;
};

/**
 * Exact replica of the live widget's #he-typing indicator.
 * Three orange dots bouncing in sequence. 1.2s cycle, 0.2s stagger.
 */
export const TypingIndicator: React.FC<Props> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const cycleFrames = 36; // 1.2s at 30fps

  const opacity = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotTranslate = (staggerFrames: number) => {
    const t = ((local - staggerFrames) % cycleFrames) / cycleFrames;
    if (t < 0) return 0;
    // Bounce curve: peak at ~0.3
    if (t < 0.3) {
      return interpolate(t, [0, 0.3], [0, -14]);
    }
    if (t < 0.6) {
      return interpolate(t, [0.3, 0.6], [-14, 0]);
    }
    return 0;
  };

  const dotOpacity = (staggerFrames: number) => {
    const t = ((local - staggerFrames) % cycleFrames) / cycleFrames;
    if (t < 0) return 0.5;
    if (t < 0.3) return interpolate(t, [0, 0.3], [0.5, 1]);
    if (t < 0.6) return interpolate(t, [0.3, 0.6], [1, 0.5]);
    return 0.5;
  };

  const Dot: React.FC<{ stagger: number }> = ({ stagger }) => (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: colors.brand,
        transform: `translateY(${dotTranslate(stagger)}px)`,
        opacity: dotOpacity(stagger),
      }}
    />
  );

  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: "28px 40px",
        background: colors.botBubbleBg,
        border: `1px solid ${colors.widgetBorder}`,
        borderRadius: 40,
        borderBottomLeftRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
      }}
    >
      <Dot stagger={0} />
      <Dot stagger={6} />
      <Dot stagger={12} />
    </div>
  );
};
