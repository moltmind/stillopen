import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../brand/colors";

type Appointment = {
  day: number; // 0-6, Mon-Sun
  hour: number; // 0-23
  duration: number; // hours
  label: string;
};

type Props = {
  appointments: Appointment[];
  startFrame?: number;
  staggerFrames?: number;
  width?: number;
  height?: number;
};

/**
 * Week-grid calendar that populates with orange appointment chips.
 * Days are columns, hours are rows. Chips scale in one at a time.
 */
export const CalendarFill: React.FC<Props> = ({
  appointments,
  startFrame = 0,
  staggerFrames = 18,
  width = 540,
  height = 280,
}) => {
  const frame = useCurrentFrame();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hourStart = 0;
  const hourEnd = 12;
  const hoursVisible = hourEnd - hourStart;

  const headerHeight = 32;
  const gridHeight = height - headerHeight;
  const colWidth = width / 7;
  const rowHeight = gridHeight / hoursVisible;

  const opacity = interpolate(frame - startFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "#0c0c0e",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: font.family,
        opacity,
        position: "relative",
      }}
    >
      {/* Day headers */}
      <div
        style={{
          height: headerHeight,
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {days.map((d) => (
          <div
            key={d}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: colors.textTertiary,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Hour grid + appointments */}
      <div
        style={{
          position: "relative",
          width,
          height: gridHeight,
        }}
      >
        {/* Hour gridlines */}
        {Array.from({ length: hoursVisible + 1 }).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: i * rowHeight,
              left: 0,
              right: 0,
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}

        {/* Day gridlines */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`d-${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: i * colWidth,
              borderLeft:
                i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}

        {/* Appointment chips */}
        {appointments.map((a, i) => {
          const localFrame = frame - startFrame - i * staggerFrames - 18;
          const chipScale = interpolate(localFrame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const chipOpacity = interpolate(localFrame, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: a.day * colWidth + 4,
                top: (a.hour - hourStart) * rowHeight + 2,
                width: colWidth - 8,
                height: a.duration * rowHeight - 4,
                background: colors.brand,
                borderRadius: 6,
                padding: "4px 6px",
                fontSize: 9,
                fontWeight: 600,
                color: "#0a0a0b",
                lineHeight: 1.2,
                opacity: chipOpacity,
                transform: `scale(${chipScale})`,
                transformOrigin: "top left",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
              }}
            >
              {a.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
