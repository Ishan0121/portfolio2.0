---
title: "Building This Developer Portfolio"
date: "2026-03-20"
excerpt: "A deep dive into the technologies and decisions behind building an interactive, high-performance developer portfolio."
---

# The Vision 🚀

When I set out to build this portfolio, I wanted more than just a static digital resume. I wanted it to feel **alive**, interactive, and technically impressive to fellow developers. 

Here are some of the key features that make it special:

## 1. The Stack
I chose **Next.js (App Router)** paired with **TailwindCSS** and **Framer Motion**. This combination gives me insane flexibility. Next.js handles the routing and optimization, Tailwind lets me style rapidly without context-switching, and Framer Motion handles the butter-smooth animations.

## 2. Interactive Easter Eggs
If you press \`Ctrl+J\` or \` \` \` on your keyboard right now, you might find a fully functional developer terminal hidden in the site! Things like this separate standard templates from custom-engineered experiences.

## 3. The Tech Tree
Using \`@xyflow/react\`, I built an interactive skill tree. Unlike a boring list of badges, the tech tree visualizes my core competencies as interconnected nodes. You can drag them around and explore!

### Code Snippet Example
Here's a quick look at how the page transitions work using Framer Motion:

\`\`\`tsx
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
\`\`\`

## What's Next?
I plan to keep adding features like a live Spotify widget, a Guestbook using Supabase, and more deep-dive technical articles here. Stay tuned!
