"use client";

import { motion } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/config";
import { fadeInVariant } from "@/lib/utils";
import { Github } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GithubStats() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("last");

  const currentYear = new Date().getFullYear();
  const years: string[] = ["last", currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString(), (currentYear - 3).toString()];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom colors to match the glassy/blue aesthetic
  // Array goes from light (least contributions) to dark (most contributions)
  const explicitTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    // We replace the standard GitHub green with our primary blue/violet gradient tones
    dark: ['#1e1e2e', '#2d334a', '#3f51b5', '#496ae2', '#6366f1'],
  };

  return (
    <motion.div
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full flex flex-col items-center mt-8 mb-16"
    >
      <div className="w-full max-w-5xl glass p-6 sm:p-10 rounded-2xl flex flex-col items-center border border-white/10 shadow-2xl bg-gradient-to-br from-blue-900/5 to-transparent relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 w-full z-10">
          <div className="flex items-center gap-3">
            <Github className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              GitHub Contributions
            </h2>
          </div>
          
          <div className="flex items-center justify-center">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[140px] glass border-white/10 rounded-full text-sm font-medium">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-xl">
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="rounded-lg cursor-pointer hover:bg-white/5">
                    {year === "last" ? "Last Year" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full pb-4 flex justify-center z-10 custom-scrollbar">
          <div className="flex justify-center min-h-[150px] overflow-x-auto max-w-full">
            {mounted && (
              <GitHubCalendar
                username={siteConfig.githubUsername}
                year={selectedYear === "last" ? "last" : parseInt(selectedYear)}
                colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                theme={explicitTheme}
                blockSize={14}
                blockMargin={5}
                fontSize={14}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
