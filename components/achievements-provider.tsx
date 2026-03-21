"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { features } from "@/config/features";
import { Trophy } from "lucide-react";

export type AchievementId = 
  | "first_visit"
  | "terminal_user"
  | "cmd_palette_user"
  | "theme_toggle"
  | "music_listener";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_visit: {
    id: "first_visit",
    title: "Hello World",
    description: "Welcome to my portfolio!",
    icon: "👋",
  },
  terminal_user: {
    id: "terminal_user",
    title: "Hacker Man",
    description: "You found the interactive terminal.",
    icon: "💻",
  },
  cmd_palette_user: {
    id: "cmd_palette_user",
    title: "Power User",
    description: "Used the Command Palette shortcut.",
    icon: "⌨️",
  },
  theme_toggle: {
    id: "theme_toggle",
    title: "Chameleon",
    description: "Changed the appearance theme.",
    icon: "🎨",
  },
  music_listener: {
    id: "music_listener",
    title: "Audiophile",
    description: "Started the ambient background track.",
    icon: "🎵",
  },
};

interface AchievementsContextType {
  unlocked: AchievementId[];
  unlockAchievement: (id: AchievementId) => void;
  resetAchievements: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!features.achievements) return;
    
    // Load from local storage
    try {
      const stored = localStorage.getItem("portfolio_achievements");
      if (stored) {
        setUnlocked(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load achievements", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (mounted && features.achievements) {
      localStorage.setItem("portfolio_achievements", JSON.stringify(unlocked));
    }
  }, [unlocked, mounted]);

  // First visit achievement
  useEffect(() => {
    if (mounted && features.achievements && !unlocked.includes("first_visit")) {
      // Small delay to let the page load
      const timer = setTimeout(() => unlockAchievement("first_visit"), 2000);
      return () => clearTimeout(timer);
    }
  }, [mounted, unlocked]);

  const unlockAchievement = (id: AchievementId) => {
    if (!features.achievements) return;

    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;

      const achievement = ACHIEVEMENTS[id];
      
      // Fire toast notification
      toast.success(
        <div className="flex items-start gap-3 w-full">
          <div className="text-2xl mt-0.5">{achievement.icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              Achievement Unlocked!
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            </h4>
            <p className="text-xs font-medium text-foreground/90 mt-1">{achievement.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{achievement.description}</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "bottom-center",
          className: "glass border-yellow-500/30 bg-background/80 backdrop-blur-xl",
        }
      );

      return [...prev, id];
    });
  };

  const resetAchievements = () => {
    setUnlocked([]);
    localStorage.removeItem("portfolio_achievements");
    toast.info("Achievements reset");
  };

  return (
    <AchievementsContext.Provider value={{ unlocked, unlockAchievement, resetAchievements }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementsProvider");
  }
  return context;
}
