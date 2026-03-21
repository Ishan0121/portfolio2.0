"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { features } from "@/config/features";
import { useRouter } from "next/navigation";
import { useAchievements } from "@/components/achievements-provider";

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ id: number; text: string | React.ReactNode }[]>([
    { id: 0, text: "Welcome to the interactive terminal. Type 'help' to see available commands." }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const outputEndRef = useRef<HTMLDivElement>(null);
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    if (!features.terminal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on ` or Ctrl+J
      if (e.key === "`" || (e.ctrlKey && e.key === "j")) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) unlockAchievement("terminal_user");
          return !prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when output changes
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newOutput = [...output, { id: Date.now(), text: `> ${input}` }];
    
    switch (cmd) {
      case "help":
        newOutput.push({ id: Date.now() + 1, text: "Available commands: help, clear, about, projects, skills, contact, ls, sudo, exit" });
        break;
      case "clear":
        setOutput([]);
        setInput("");
        return;
      case "about":
        newOutput.push({ id: Date.now() + 1, text: "Navigating to About..." });
        router.push("/about");
        setIsOpen(false);
        break;
      case "projects":
        newOutput.push({ id: Date.now() + 1, text: "Navigating to Projects..." });
        router.push("/portfolio");
        setIsOpen(false);
        break;
      case "skills":
        newOutput.push({ id: Date.now() + 1, text: "Navigating to Skills..." });
        router.push("/skills");
        setIsOpen(false);
        break;
      case "contact":
        newOutput.push({ id: Date.now() + 1, text: "Navigating to Contact..." });
        router.push("/contact");
        setIsOpen(false);
        break;
      case "ls":
        newOutput.push({ id: Date.now() + 1, text: "about/  projects/  skills/  contact/" });
        break;
      case "whoami":
        newOutput.push({ id: Date.now() + 1, text: "guest_user_99" });
        break;
      case "sudo":
        newOutput.push({ id: Date.now() + 1, text: "Nice try! This incident will be reported." });
        break;
      case "exit":
        setIsOpen(false);
        break;
      default:
        newOutput.push({ id: Date.now() + 1, text: `Command not found: ${cmd}. Type 'help' for a list of commands.` });
    }

    setOutput(newOutput);
    setInput("");
  };

  if (!features.terminal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-full h-1/2 bg-black/95 backdrop-blur-md border-b border-green-500/30 z-[60] font-mono text-green-500 p-4 overflow-y-auto shadow-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2 shrink-0">
            <span className="text-sm font-bold">Terminal - guest@portfolio:~</span>
            <button onClick={() => setIsOpen(false)} className="text-xs hover:text-white transition-colors">
              [Close]
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 mb-4 text-sm">
            {output.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap">{line.text}</div>
            ))}
            <div ref={outputEndRef} />
          </div>

          <form onSubmit={handleCommand} className="flex items-center text-sm shrink-0">
            <span className="mr-2 text-green-300">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-green-500 placeholder-green-700 font-mono"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
