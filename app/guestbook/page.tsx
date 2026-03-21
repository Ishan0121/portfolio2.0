"use client";

import { useState, useEffect } from "react";
import { features } from "@/config/features";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Filter } from "bad-words";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Entry = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: Timestamp | null;
};

const filter = new Filter();

// You can add your own custom banned words here
const CUSTOM_BANNED_WORDS = [
  "spamword", // Example custom ban
];

// Core severe words that we want to ban even if they are compounded or hidden inside longer words (e.g. "dickshit")
const SUBSTRING_BANS = [
  "fuck", "shit", "bitch", "cunt", "nigger", "faggot", "pussy", "whore", "slut", "dick", "cock", "porn", "sex"
];

if (CUSTOM_BANNED_WORDS.length > 0) {
  filter.addWords(...CUSTOM_BANNED_WORDS);
}

export default function GuestbookPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strike, setStrike] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const s = localStorage.getItem("gb_strike");
    if (s) setStrike(parseInt(s, 10));
    
    const l = localStorage.getItem("gb_lockout");
    if (l) {
      const lockTime = parseInt(l, 10);
      if (lockTime > Date.now()) {
        setLockoutUntil(lockTime);
      } else {
        localStorage.removeItem("gb_lockout");
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutUntil > Date.now()) {
      interval = setInterval(() => {
        const rem = lockoutUntil - Date.now();
        if (rem <= 0) {
          setLockoutUntil(0);
          setStrike(0);
          localStorage.removeItem("gb_lockout");
          localStorage.removeItem("gb_strike");
          clearInterval(interval);
        } else {
          setTimeLeft(Math.ceil(rem / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  useEffect(() => {
    if (!features.guestbook) {
      router.push("/");
      return;
    }
    setMounted(true);

    // Real-time listener — updates UI as new messages arrive from any device
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc")
    );

    // Timeout: if Firestore doesn't respond in 10s, show an error
    // (common cause: Firestore Security Rules blocking access)
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError(
        "Could not connect to Firestore. Check your Firestore Security Rules — they may be blocking public access."
      );
      toast.error("Firestore connection timed out.");
    }, 10000);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        clearTimeout(timeoutId);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Entry[];
        setEntries(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        clearTimeout(timeoutId);
        console.error("Firestore error:", err);
        const msg =
          err.code === "permission-denied"
            ? "Permission denied. Update your Firestore Security Rules to allow reads."
            : `Firestore error: ${err.message}`;
        setError(msg);
        toast.error(msg);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const finalName = name.trim() || "Anonymous";

    // 1. Rate Limiting (1 minute cooldown)
    const lastPostStr = localStorage.getItem("guestbook_last_post");
    if (lastPostStr) {
      const lastPostTime = parseInt(lastPostStr, 10);
      if (Date.now() - lastPostTime < 60000) {
        toast.error("Please wait a minute before posting again to prevent spam.");
        return;
      }
    }

    // 2. Profanity Filter (using bad-words library)
    const allText = `${finalName} ${message}`;
    
    // Normalize text: replace all symbols/punctuation with spaces to catch sneaky formatting like _badWord_ or *badWord*
    const normalizedText = allText.toLowerCase().replace(/[^a-z0-9]/gi, ' ').trim();
    const words = normalizedText.split(/\s+/);
    
    // Find exactly which word triggered the filter (including our custom words)
    let badWord = words.find((w) => filter.isProfane(w) || CUSTOM_BANNED_WORDS.includes(w));

    // If no exact match (like "dickshit" which is compound), check for severe substrings
    if (!badWord) {
      const compoundBan = [...SUBSTRING_BANS, ...CUSTOM_BANNED_WORDS].find(b => normalizedText.includes(b));
      if (compoundBan) {
        // Return the actual full word that contains the banned substring (e.g., returns "dickshit")
        badWord = words.find(w => w.includes(compoundBan)) || compoundBan;
      }
    }

    if (badWord) {
      const newStrike = strike + 1;
      setStrike(newStrike);
      localStorage.setItem("gb_strike", newStrike.toString());

      if (newStrike >= 5) {
        const lockTime = Date.now() + 60000; // 60 seconds lockout
        setLockoutUntil(lockTime);
        localStorage.setItem("gb_lockout", lockTime.toString());
        toast.error("SYSTEM LOCKDOWN INITIATED.");
      } else {
        toast.error(`The word "${badWord}" is not allowed. Warning ${newStrike}/5.`);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        author: finalName,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalName)}`,
        content: message.trim(),
        createdAt: serverTimestamp(),
      });
      localStorage.setItem("guestbook_last_post", Date.now().toString());
      toast.success("Message posted!");
      setName("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      const firebaseErr = err as { code?: string; message?: string };
      const msg =
        firebaseErr.code === "permission-denied"
          ? "Permission denied. Update your Firestore Security Rules to allow writes."
          : "Failed to post message. Check your Firebase config.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "just now";
    return ts.toDate().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!mounted) return null;

  if (lockoutUntil > Date.now()) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-mono">
        {/* Futuristic Red Grid / Scanning Background */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-red-950/30 animate-pulse duration-[2000ms] pointer-events-none" />
        
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px] pointer-events-none z-0 mix-blend-overlay opacity-50" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mx-auto w-full">
          <div className="relative">
            <AlertTriangle className="w-24 h-24 md:w-32 md:h-32 text-red-500 mb-6 animate-[pulse_1s_infinite] drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" strokeWidth={2} />
            <div className="absolute inset-0 bg-red-500 blur-[50px] opacity-20" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-[0.2em] text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] uppercase">
            Access Denied
          </h1>
          
          <div className="bg-red-950/80 border border-red-500/30 p-6 md:p-8 rounded-none shadow-[0_0_30px_rgba(255,0,0,0.15)] relative overflow-hidden w-full mb-8 backdrop-blur-sm">
            {/* Top scanning line for the card */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(255,0,0,1)]" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(255,0,0,1)]" />

            <p className="text-red-300 md:text-lg mb-4 font-normal leading-relaxed text-left">
              <span className="text-red-500 font-bold block mb-2">[ SYSTEM LOG ]</span>
              User attempted to inject unauthorized profanity into the datastream.
              <br className="mb-2" />
              You chose to <strong className="text-red-500">ignore 5 consecutive warnings</strong> and violate the communication protocol.
            </p>
            <p className="text-left text-red-400/80 text-sm border-l-2 border-red-500/50 pl-3">
              Write-access to the guestbook interface has been temporarily revoked.
            </p>
          </div>
          
          <div className="flex flex-col gap-8 mb-10 w-full items-center justify-center">
            <div className="text-center bg-black/50 border border-red-500/20 px-10 py-6">
              <p className="text-red-500/60 uppercase tracking-[0.3em] text-xs mb-2 font-bold">
                Lockout Timer
              </p>
              <div className="font-mono font-black text-red-500 text-5xl md:text-7xl tabular-nums drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          <Link href="/" className="w-full max-w-[200px]">
            <Button 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black hover:border-red-500 transition-all uppercase tracking-widest text-xs h-12 rounded-none bg-red-950/20 shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 md:py-32 max-w-2xl mx-auto w-full">
      <SectionHeading
        title="Developer Guestbook"
        description="Leave a message — synced live across all visitors via Firestore."
      />

      {/* Post Section */}
      <div className="bg-card/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <h3 className="text-xl font-semibold mb-2 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-primary" />
          Sign the Guestbook
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Share a tip, a joke, or just say hello!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)..."
            maxLength={40}
            className="w-full bg-background/50 border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            required
            maxLength={200}
            className="w-full bg-background/50 border border-white/10 rounded-xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm placeholder:text-muted-foreground"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {message.length}/200
            </span>
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 backdrop-blur-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Message"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Entries */}
      <div className="space-y-3 relative">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Connecting to Firestore…</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-red-400 font-medium">⚠️ {error}</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Go to{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Firebase Console
              </a>{" "}
              → Firestore Database → Rules, and set them to allow public reads/writes.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs underline text-muted-foreground hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground italic">
            No entries yet. Be the first to sign!
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="group flex gap-4 p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-xl relative overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={entry.avatar}
                alt={entry.author}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground/90 truncate">
                    {entry.author}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    • {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/90 leading-relaxed break-words">
                  {entry.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
