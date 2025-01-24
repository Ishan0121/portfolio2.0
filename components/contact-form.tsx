"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Form submission logic would go here
    setTimeout(() => setIsSubmitting(false), 1000);
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}