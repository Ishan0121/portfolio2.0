"use client";

import { useEffect, useState } from "react";

export function OnlyGrid() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({
          width: window.outerWidth,
          height: window.outerHeight,
        });
      };

      // Set initial dimensions
      updateDimensions();

      // Update dimensions on resize
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  const spacing = "20px"; // Spacing between lines
  const rows = Math.ceil(dimensions.height / 20) + 1; // Number of horizontal lines
  const columns = Math.ceil(dimensions.width / 20) + 1; // Number of vertical lines

  return (
    <div
      className="fixed inset-0 -z-10 opacity-30 transition-opacity duration-300 hover:opacity-100"
      style={{
        background: `
          linear-gradient(90deg, var(--background) 2px, transparent 1px) 50% 50% / 40px 40px,
          linear-gradient(var(--background) 2px, transparent 1px) 50% 50% / 40px 40px
        `,
      }}
    >
      {/* Horizontal Lines */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute w-full bg-gray-700 opacity-50"
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
          className="absolute h-full bg-gray-700 opacity-50"
          style={{
            width: "1px",
            left: `calc(${i} * ${spacing})`,
          }}
        ></div>
      ))}
      <div />
    </div>
  );
}
