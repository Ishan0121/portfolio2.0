"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Menu, X, SunDimIcon, CpuIcon, CodeIcon, Search } from "lucide-react";
import { CommandMenu } from "@/components/command-menu";

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full box-border mx-10 px-10 border-b backdrop-blur-sm"
    >
      {/* <nav className="fixed top-0 z-50 w-full box-border mx-10 px-10 border-b backdrop-blur-sm"> */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <code>&lt;Portfolio/&gt;</code>
          </Link>

          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={` hover:opacity-80 transition-colors px-4 py-1 rounded-2xl ${
                  pathname === link.href ? "glass" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center ml-2 border-l border-white/10 pl-2 space-x-2">
              <Button
                variant="outline"
                className="hidden lg:flex w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 glass rounded-full relative"
                onClick={() => setCommandOpen(true)}
              >
                <span className="hidden lg:inline-flex">Search portfolio...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-foreground glass">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setCommandOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
              suppressHydrationWarning
              onClick={() => {
                if (theme === "system") setTheme("dark");
                else if (theme === "dark") setTheme("light");
                else setTheme("system");
              }}
            >
              {theme === "system" ? (
                <CpuIcon className="h-5 w-5" />
              ) : theme === "dark" || (theme === "system" && systemTheme === "dark") ? (
                <Moon className="h-5 w-5" />
              ) : (
                <SunDimIcon className="h-5 w-5" />
              )}
            </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-primary transition-colors px-4 py-1 rounded-2xl ${
                    pathname === link.href ? "glass" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="outline"
                size="icon"
                suppressHydrationWarning
                onClick={() => {
                  if (theme === "system") setTheme("dark");
                  else if (theme === "dark") setTheme("light");
                  else setTheme("system");
                }}
              >
                {theme === "system" ? (
                  <CpuIcon className="h-5 w-5" />
                ) : theme === "dark" || (theme === "system" && systemTheme === "dark") ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <SunDimIcon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm text-muted-foreground rounded-2xl"
                onClick={() => {
                  setCommandOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search Portfolio</span>
              </Button>
            </div>
          </div>
        )}
      {/* </nav> */}
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
    </motion.nav>
  );
}
