"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";

const COOLDOWN_MINUTES = 30;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState<number | null>(null);

  useEffect(() => {
    const lastSubmission = localStorage.getItem("lastContactSubmission");
    if (lastSubmission) {
      const timeElapsed = Date.now() - parseInt(lastSubmission, 10);
      const minutesElapsed = timeElapsed / (1000 * 60);
      if (minutesElapsed < COOLDOWN_MINUTES) {
        setCooldown(COOLDOWN_MINUTES - minutesElapsed);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cooldown !== null && cooldown > 0) {
      toast.warning(`I have already received your message. Please wait a while before sending another one.`);
      return;
    }

    if (!siteConfig.web3formsAccessKey) {
      toast.error("Contact form is not configured yet. Missing Access Key.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: siteConfig.web3formsAccessKey,
          ...data,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success("Message received successfully! I will get back to you soon.");
        localStorage.setItem("lastContactSubmission", Date.now().toString());
        setCooldown(COOLDOWN_MINUTES);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Input
          className="glass"
          id="name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Input
          className="glass"
          id="email"
          name="email"
          type="email"
          placeholder="Your Email"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Input
          className="glass"
          id="subject"
          name="subject"
          type="text"
          placeholder="Subject"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          id="message"
          name="message"
          placeholder="Your Message"
          required
          disabled={isSubmitting}
          className="min-h-[150px] glass"
        />
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </motion.div>
    </form>
  );
}