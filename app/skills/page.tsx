"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { SkillsSection } from "@/components/skills-section";
import { skillsData } from "@/lib/skills-data";
import Image from "next/image";
import { containerVariants, fadeInUpVariants } from "@/lib/utils";

export default function SkillsPage() {

  return (
    <>
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

        <motion.div className="space-y-16" variants={containerVariants}>
          {skillsData.map((category) => (
            <motion.div key={category.name} variants={fadeInUpVariants}>
              <SkillsSection category={category} />
            </motion.div>
          ))}
        </motion.div>

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
