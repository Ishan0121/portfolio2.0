"use client";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects-data";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/utils";

export default function PortfolioPage() {
  return (
    <>
      <div className="h-16" />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container py-12 sm:py-16"
      >
        <motion.div variants={itemVariants}>
          <SectionHeading
            title="My Projects"
            description="A collection of projects I've built throughout my journey"
          />
        </motion.div>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
              <ProjectCard
                key={project.title}
                {...project}
                tags={[...project.tags]}
              />
          ))}
        </motion.div>
      </motion.section>
    </>
  );
}
