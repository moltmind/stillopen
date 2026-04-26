import React from "react";
import { colors } from "../brand/colors";

type Props = {
  width?: number;
  children?: React.ReactNode;
  glow?: boolean;
};

/**
 * Phone frame sized for a landscape composition.
 * Sits in the lower-third / left-third of a 1920x1080 frame.
 */
export const PhoneFrameLandscape: React.FC<Props> = ({
  width = 360,
  children,
  glow = false,
}) => {
  const height = (width * 16) / 9;
  const radius = width * 0.12;

  return (
    <div
      style={{
        width,
        height,
        background: "#000",
        borderRadius: radius,
        padding: 8,
        boxShadow: glow
          ? `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px ${colors.brandGlow}`
          : "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: colors.bg,
          borderRadius: radius - 6,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.4,
            height: 24,
            background: "#000",
            borderRadius: 14,
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </div>
  );
};

/**
 * Dark phone wallpaper with a subtle safety-orange accent.
 * Cole's call: no personal photos, near-black gradient with brand hint.
 */
export const PhoneWallpaper: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.10) 0%, transparent 55%),
                     radial-gradient(ellipse at 70% 90%, rgba(249,115,22,0.06) 0%, transparent 50%),
                     linear-gradient(180deg, #0a0a0b 0%, #050506 100%)`,
      }}
    />
  );
};
