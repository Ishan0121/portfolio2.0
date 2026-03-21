"use client";

import { useState, useEffect } from "react";
import { features } from "@/config/features";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

export default function GuestbookPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!message.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        author: name.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
        content: message.trim(),
        createdAt: serverTimestamp(),
      });
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
            placeholder="Your name..."
            required
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
              disabled={isSubmitting || !message.trim() || !name.trim()}
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
      <div className="space-y-1 relative">
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
              className="flex gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-xl"
            >
              <img
                src={entry.avatar}
                alt={entry.author}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 shrink-0"
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
