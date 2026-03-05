"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { SkillsSection } from "@/components/skills-section";
import { TechTree } from "@/components/tech-tree";
import { skillsData } from "@/lib/skills-data";
import Image from "next/image";
import { containerVariants, fadeInUpVariants } from "@/lib/utils";
import FloatingSplineBot from "@/components/FloatingSplineBot";

export default function SkillsPage() {
  const [view, setView] = useState<"grid" | "tree">("grid");

  return (
    <>
      {/* <FloatingSplineBot splineScene="./spline/genkub.splinecode"/> */}
      <div className="h-10" />
      <motion.section
        className="container py-12 sm:py-16 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={fadeInUpVariants}>
          <SectionHeading
            title="Skills & Expertise"
            description="A comprehensive overview of my technical skills and proficiency levels"
          />
        </motion.div>

        <motion.div
          className="relative mb-10 h-[200px] lg:h-[400px] w-[200px] lg:w-[400px] mx-auto"
          variants={fadeInUpVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-20 blur-3xl" />
          <Image
            src="./images/skills.gif"
            alt="skills"
            fill
            className="object-cover rounded-lg absolute"
          />
        </motion.div>

        <motion.div variants={fadeInUpVariants} className="flex justify-center mb-10 w-full z-20">
          <div className="glass p-1 rounded-full flex items-center gap-1 border border-white/10 shadow-lg relative bg-blue-900/10">
            <button 
              onClick={() => setView("grid")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 w-32 ${view === "grid" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Grid View
            </button>
            <button 
              onClick={() => setView("tree")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all z-10 w-32 ${view === "tree" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Tree View
            </button>
            {/* Sliding background indicator */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary/20 border border-primary/30 rounded-full transition-transform duration-300 ease-out z-0`}
              style={{ transform: view === "grid" ? "translateX(0)" : "translateX(calc(100% + 4px))", left: "4px" }}
            />
          </div>
        </motion.div>

        {view === "grid" ? (
          <motion.div className="space-y-16 w-full" variants={containerVariants}>
            {skillsData.map((category) => (
              <motion.div key={category.name} variants={fadeInUpVariants}>
                <SkillsSection category={category} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeInUpVariants} className="w-full max-w-7xl z-10">
            <TechTree />
          </motion.div>
        )}

        <motion.div
          className="relative mt-10 h-[130px] lg:h-[300px] w-[300px] lg:w-[700px] mx-auto"
          variants={fadeInUpVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-20 blur-3xl" />
          <Image
            src="./images/js.gif"
            alt="js"
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>
      </motion.section>
    </>
  );
}
