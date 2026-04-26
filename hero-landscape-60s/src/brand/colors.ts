/**
 * StillOpen brand tokens.
 * Sources of truth:
 *   - stillopen.ai index.html (marketing site)
 *   - chatbot.js (the live widget customers interact with)
 * Any drift here should be pulled from those two files, not invented.
 */
export const colors = {
  // Site surfaces
  bg: "#050506",
  bgSurface: "#0c0c0e",
  bgRaised: "#141416",
  bgHover: "#1a1a1e",

  // Widget (matches chatbot.js exactly)
  widgetBg: "#0c0c0e", // COLORS.navy
  widgetHeaderBg: "#111114", // COLORS.navyLight
  widgetBorder: "rgba(255,255,255,0.08)", // COLORS.navyBorder

  // Text
  textPrimary: "#fafafa",
  textSecondary: "#b4b4bd",
  textTertiary: "#71717a",
  textMuted: "#71717a",

  // Brand
  brand: "#f97316",
  accent: "#fb923c",
  accentHover: "#fdba74",
  brandGlow: "rgba(249, 115, 22, 0.12)",
  brandBorder: "rgba(249, 115, 22, 0.22)",

  // Status
  success: "#34d399", // online dot
  urgent: "#f87171",

  // Chat bubbles — MATCHES widget exactly.
  // User = the person typing (customer on plumber's site). Orange.
  // Bot  = the StillOpen AI front desk replying. Dark, muted text.
  userBubbleBg: "#f97316",
  userBubbleText: "#ffffff",
  botBubbleBg: "#18181b",
  botBubbleText: "#b4b4bd",
} as const;

export const font = {
  family:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
} as const;
