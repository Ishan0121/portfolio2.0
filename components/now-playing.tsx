"use client";

import { useEffect, useState, useRef } from "react";
import { features } from "@/config/features";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useAchievements } from "@/components/achievements-provider";

export function NowPlaying() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    setMounted(true);
    // Initialize audio
    // Ensure you place your ambient sound file in public/audio/ambient.mp3
    audioRef.current = new Audio("/audio/ambient.mp3"); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Subtle background volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Browsers restrict autoplay, so we start it on user interaction
      audioRef.current.play().then(() => {
        unlockAchievement("music_listener");
      }).catch(e => {
        console.error("Audio playback failed. The file /audio/ambient.mp3 might be missing:", e);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!features.nowPlaying || !mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 transition-transform hover:scale-105">
      <div className="flex items-center gap-2 backdrop-blur-md bg-background/60 border border-border/50 shadow-lg rounded-full px-3 py-2 hover:bg-background/80 transition-colors">
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${isPlaying ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary'} transition-colors shrink-0`}>
          <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>
        
        <div className="flex flex-col min-w-[80px] mr-2">
          <span className="text-[11px] font-semibold leading-none mb-1 text-foreground">
            Ambient Audio
          </span>
          <span className="text-[9px] text-muted-foreground leading-none font-mono">
            {isPlaying ? "Playing..." : "Paused"}
          </span>
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
           <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-full"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
