"use client";

import { useState } from "react";

export function Mask() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const rows = 80; // Number of horizontal lines
  const columns = 90; // Number of vertical lines
  const spacing = "20px"; // Spacing between lines

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Horizontal Lines */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute w-full bg-gray-700 opacity-30"
          style={{
            height: "1px",
            top: `calc(${i} * ${spacing})`,
            clipPath: `circle(150px at ${cursorPos.x}px ${cursorPos.y}px)`,
          }}
        ></div>
      ))}

      {/* Vertical Lines */}
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute h-full bg-gray-700 opacity-30"
          style={{
            width: "1px",
            left: `calc(${i} * ${spacing})`,
            clipPath: `circle(150px at ${cursorPos.x}px ${cursorPos.y}px)`,
          }}
        ></div>
      ))}

      {/* Spotlight Mask */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle 150px at ${cursorPos.x}px ${cursorPos.y}px,
            rgba(255, 255, 255, 0.1),
            rgba(0, 0, 0, 0.9)
          )`,
        }}
      ></div>
    </div>
  );
}
