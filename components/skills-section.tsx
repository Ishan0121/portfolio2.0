import { SkillCard } from "./skill-card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { SkillCategory } from "@/lib/skills-data";

type SkillsSectionProps = {
  category: SkillCategory;
};

export function SkillsSection({ category }: SkillsSectionProps) {
  return (
    <div className="space-y-6 overflow-hidden">
      {" "}
      {/* Added overflow-hidden */}
      <h3 className="text-2xl font-semibold">{category.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.skills.map((skill, index) => (
          <SkillAnimationWrapper key={skill.name} index={index}>
            <SkillCard {...skill} />
          </SkillAnimationWrapper>
        ))}
      </div>
    </div>
  );
}

function SkillAnimationWrapper({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{
        x: index % 2 === 0 ? -50 : 50, // Reduced the x offset
        opacity: 0,
      }}
      animate={
        isInView
          ? { x: 0, opacity: 1 }
          : { x: index % 2 === 0 ? -50 : 50, opacity: 0 }
      }
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="overflow-hidden" // Prevent horizontal scroll
    >
      {children}
    </motion.div>
  );
}
