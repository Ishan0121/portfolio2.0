// "use client";
// import { SectionHeading } from "@/components/section-heading";
// import { ProjectCard } from "@/components/project-card";
// import { projects } from "@/lib/projects-data";
// import { motion } from "framer-motion";
// import { containerVariants, itemVariants } from "@/lib/utils";

// export default function PortfolioPage() {
//   return (
//     <>
//       <div className="h-16" />
//       <motion.section
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="container py-12 sm:py-16"
//       >
//         <motion.div variants={itemVariants}>
//           <SectionHeading
//             title="My Projects"
//             description="A collection of projects I've built throughout my journey"
//           />
//         </motion.div>
//         <motion.div
//           variants={containerVariants}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//         >
//           {projects.map((project) => (
//               <ProjectCard
//                 key={project.title}
//                 {...project}
//                 tags={[...project.tags]}
//               />
//           ))}
//         </motion.div>
//       </motion.section>
//     </>
//   );
// }


"use client";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { manualProjects } from "@/lib/manual-projects";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  fetchGitHubProjects,
  mergeProjects,
  Project,
} from "@/lib/github-projects-fetcher";
import FloatingSplineBot from "@/components/FloatingSplineBot";

const GITHUB_USERNAME = "Ishan0121";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(manualProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const githubProjects = await fetchGitHubProjects({
        username: GITHUB_USERNAME,
        excludeRepos: [
          GITHUB_USERNAME, // Profile README repo
          "dotfiles",
          "config",
          // Add more repos to exclude
        ],
        maxProjects: 20,
        sortBy: "updated",
        includeForked: false,
        includeArchived: false,

        // Optional: Custom titles for specific repos
        customTitles: {
          // "repo-name": "Custom Title",
        },

        // Optional: Custom images for specific repos
        customImages: {
          // "repo-name": "https://example.com/custom-image.jpg",
        },

        // Optional: Custom descriptions for specific repos
        customDescriptions: {
          // "repo-name": "Better description",
        },
      });

      const mergedProjects = mergeProjects(manualProjects, githubProjects);
      setProjects(mergedProjects);
      setLoading(false);
    };

    loadProjects();
  }, []);

  return (
    <>
      <FloatingSplineBot splineScene="./spline/genkub.splinecode"/>
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
        {loading && projects.length === manualProjects.length && (
          <div className="text-center py-8 text-muted-foreground">
            Loading GitHub projects...
          </div>
        )}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              {...project}
              tags={[...project.tags]}
            />
          ))}
        </motion.div>
      </motion.section>
    </>
  );
}