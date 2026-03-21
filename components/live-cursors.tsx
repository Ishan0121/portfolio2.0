"use client";

import { useEffect, useState, useRef } from "react";
import { features } from "@/config/features";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, set, onDisconnect, remove } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { MousePointer2, Users } from "lucide-react";

// Generate a random stable ID for this session
const generateId = () => Math.random().toString(36).substring(2, 9);
const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"];

interface CursorData {
  x: number;
  y: number;
  pathname: string;
  color: string;
  timestamp: number;
}

export function LiveCursors() {
  const [mounted, setMounted] = useState(false);
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});
  const [sessionId] = useState(generateId());
  const [color] = useState(() => colors[Math.floor(Math.random() * colors.length)]);
  const pathname = usePathname();
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Only initialize if features are enabled and Firebase DB is ready
    if (!features.livePresence || !rtdb) return;

    const presenceRef = ref(rtdb, "presence");
    const myCursorRef = ref(rtdb, `presence/${sessionId}`);

    // Set up disconnect hook to remove cursor when user leaves
    onDisconnect(myCursorRef).remove();

    // Listen to all cursors
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Filter out our own cursor and stale cursors (> 2 minutes)
        const now = Date.now();
        const activeCursors: Record<string, CursorData> = {};
        
        Object.entries(data).forEach(([key, val]) => {
          const cursor = val as CursorData;
          if (key !== sessionId && now - cursor.timestamp < 120000) {
            activeCursors[key] = cursor;
          }
        });
        
        setCursors(activeCursors);
      } else {
        setCursors({});
      }
    });

    return () => {
      unsubscribe();
      remove(myCursorRef);
    };
  }, [sessionId]);

  // Track mouse movement
  useEffect(() => {
    if (!mounted || !features.livePresence || !rtdb) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle writes to Firebase to avoid rate limits (e.g. 50ms)
      if (updateTimeoutRef.current) return;

      const myCursorRef = ref(rtdb, `presence/${sessionId}`);
      
      updateTimeoutRef.current = setTimeout(() => {
        set(myCursorRef, {
          x: e.clientX,
          y: e.clientY,
          pathname,
          color,
          timestamp: Date.now()
        }).catch(err => {
          console.warn("Failed to write cursor position", err);
        });
        updateTimeoutRef.current = null;
      }, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    };
  }, [mounted, pathname, sessionId, color]);

  if (!mounted || !features.livePresence) return null;

  const activeUserCount = Object.keys(cursors).length + 1; // +1 for self

  return (
    <>
      {/* Render other users' cursors */}
      <AnimatePresence>
        {Object.entries(cursors).map(([id, cursor]) => {
          // Only show cursors on the same page
          if (cursor.pathname !== pathname) return null;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ x: cursor.x, y: cursor.y, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
              className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center transform -translate-x-[2px] -translate-y-[2px]"
            >
              <MousePointer2 
                fill={cursor.color} 
                className="w-5 h-5 drop-shadow-md" 
                style={{ color: cursor.color }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Online presence counter */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex items-center gap-2 backdrop-blur-md bg-background/60 border border-border/50 shadow-lg rounded-full px-3 py-1.5 hover:bg-background/80 transition-colors">
          <div className="relative flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">
            {activeUserCount} {activeUserCount === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      </div>
    </>
  );
}
