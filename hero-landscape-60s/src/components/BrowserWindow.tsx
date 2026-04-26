import React from "react";
import { colors, font } from "../brand/colors";

type Props = {
  url?: string;
  title?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

/**
 * Chrome-style browser frame for showing a plumber's website mockup.
 * Defaults to "Mike's Plumbing" so this asset is reusable across demos.
 */
export const BrowserWindow: React.FC<Props> = ({
  url = "mikesplumbing.com",
  title = "Mike's Plumbing — 24/7 Service",
  width = 1100,
  height = 700,
  children,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#1a1a1e",
        borderRadius: 14,
        boxShadow:
          "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: font.family,
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          height: 40,
          background: "#141416",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#febc2e",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#28c840",
          }}
        />
        <div
          style={{
            marginLeft: 24,
            background: "#0c0c0e",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 13,
            color: colors.textSecondary,
            maxWidth: 320,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
      </div>

      {/* URL bar */}
      <div
        style={{
          height: 44,
          background: "#0c0c0e",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <div
          style={{
            color: colors.textTertiary,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ←
        </div>
        <div
          style={{
            color: colors.textTertiary,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          →
        </div>
        <div
          style={{
            color: colors.textTertiary,
            fontSize: 14,
          }}
        >
          ↻
        </div>
        <div
          style={{
            flex: 1,
            background: "#141416",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 13,
            color: colors.textSecondary,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#34d399", fontSize: 11 }}>🔒</span>
          {url}
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          flex: 1,
          background: colors.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * The fake "Mike's Plumbing" homepage that lives inside BrowserWindow.
 * Orange brand color matches StillOpen for visual unity in the demo.
 */
export const MikesPlumbingPage: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "32px 40px",
        fontFamily: font.family,
        color: colors.textPrimary,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: colors.brand,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#0a0a0b",
            }}
          >
            M
          </div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Mike's Plumbing</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: 500,
          }}
        >
          <span>Services</span>
          <span>About</span>
          <span>Reviews</span>
          <span>Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.22)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12,
            color: colors.brand,
            fontWeight: 600,
            marginBottom: 24,
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
          Available 24/7
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Trusted Plumbing in Your Neighborhood
        </div>
        <div
          style={{
            fontSize: 16,
            color: colors.textSecondary,
            maxWidth: 540,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Family owned, licensed, and insured. We answer the phone day or
          night. No callback windows, no voicemail.
        </div>
      </div>
    </div>
  );
};
