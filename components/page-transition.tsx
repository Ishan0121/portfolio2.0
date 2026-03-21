"use client";

import { motion } from "framer-motion";
import { features } from "@/config/features";

export function PageTransition({ children }: { children: React.ReactNode }) {
  if (!features.pageTransitions) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
