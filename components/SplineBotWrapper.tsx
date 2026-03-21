"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const FloatingSplineBot = dynamic(
  () => import("@/components/FloatingSplineBot"),
  { ssr: false }
);

import { features } from "@/config/features";

export function SplineBotWrapper() {
  const [size, setSize] = useState(200);

  useEffect(() => {
    const update = () => setSize(window.innerWidth < 768 ? 130 : 200);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!features.splineBot) return null;

  return (
    <FloatingSplineBot
      splineScene="/spline/genkub.splinecode"
      width={size}
      height={size}
    />
  );
}
