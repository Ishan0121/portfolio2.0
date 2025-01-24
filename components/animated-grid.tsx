"use client";

import { useRef, useState } from "react";

export function AnimatedGrid() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const rows = 80; // Number of horizontal lines
  const columns = 90; // Number of vertical lines
  const spacing = "20px"; // Spacing between lines

  return (
    <div
      ref={containerRef}
      className="fixed z-20 inset-0 opacity-50 transition-opacity duration-300 hover:opacity-100"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          linear-gradient(90deg, var(--background) 2px, transparent 1px) 50% 50% / 40px 40px,
          linear-gradient(var(--background) 2px, transparent 1px) 50% 50% / 40px 40px
        `,
        clipPath: `circle(200px at ${cursorPos.x}px ${cursorPos.y}px)`,
      }}
    >
      {/* Horizontal Lines */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute w-full bg-gray-700 opacity-30"
          style={{
            height: "1px",
            top: `calc(${i} * ${spacing})`,
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
          }}
        ></div>
      ))}

      <div
        className="absolute transform-gpu transition-transform duration-1000"
        style={{
          background: `radial-gradient(
            600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
            hsl(var(--primary) / 0.1),
            transparent 40%
          )`,
          // background: `radial-gradient(
          //   circle 150px at ${cursorPos.x}px ${cursorPos.y}px,
          //   rgba(255, 255, 255, 0.1),
          //   rgba(0, 0, 0, 0.9)
          // )`,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}