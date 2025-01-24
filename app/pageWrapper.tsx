"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const [animate, setAnimate] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 500); // Match CSS animation duration
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <div className={animate ? "animate-fade-in" : ""}>{children}</div>;
}
