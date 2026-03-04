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
import { useState, useEffect, useRef } from "react";
import {
  fetchGitHubRepos,
  enrichProject,
  mergeProjects,
  Project,
  GitHubFetcherConfig,
} from "@/lib/github-projects-fetcher";
import { siteConfig } from "@/lib/config";
// import FloatingSplineBot from "@/components/FloatingSplineBot";

const GITHUB_USERNAME = siteConfig.githubUsername;

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(manualProjects);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // Cache key and expiry time (1 hour)
    const CACHE_KEY = "portfolio_projects_cache";
    const CACHE_EXPIRY = 45 * 60 * 1000;

    const loadProjects = async () => {
      // 1. Check local storage for cached data
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
          
          if (!isExpired && Array.isArray(data) && data.length > 0) {
            console.log("Using cached projects data");
            const mergedCachedProjects = mergeProjects(manualProjects, data);
            setProjects(mergedCachedProjects);
            setLoading(false);
            return; // Exit early if cache is valid
          }
        }
      } catch (error) {
        console.warn("Failed to read from local storage cache", error);
        // Continue to fetch if cache fails
      }

      console.log("Fetching fresh projects data");
      
      const config: GitHubFetcherConfig = {
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
      };

      // 2. Initial fast fetch (basic info only)
      const basicData = await fetchGitHubRepos(config);
      
      if (!isMounted.current) return;

      const basicProjects = basicData.map((d) => d.project);
      
      // Merge with manual projects and update state immediately
      const mergedBasicProjects = mergeProjects(manualProjects, basicProjects);
      setProjects(mergedBasicProjects);
      setLoading(false); // Stop showing loading indicator as we have content

      // 3. Background enrichment (images, tags, languages)
      const fullyEnrichedProjects: Project[] = [...basicProjects];
      let hasUpdates = false;

      // Process one by one or in small batches to update UI progressively
      for (let i = 0; i < basicData.length; i++) {
        if (!isMounted.current) break;
        
        const { repo, project } = basicData[i];
        const enrichedProject = await enrichProject(project, repo, config);
        
        if (!isMounted.current) break;
        
        fullyEnrichedProjects[i] = enrichedProject;
        hasUpdates = true;

        // Update the specific project in the state
        setProjects((prevProjects) => {
          return prevProjects.map((p) => {
            if (p.githubUrl === enrichedProject.githubUrl) {
              return enrichedProject;
            }
            return p;
          });
        });
      }

      // 4. Cache the fully enriched data
      if (hasUpdates && isMounted.current) {
         try {
           localStorage.setItem(CACHE_KEY, JSON.stringify({
             timestamp: Date.now(),
             data: fullyEnrichedProjects
           }));
           console.log("Projects data cached to local storage");
         } catch (e) {
           console.warn("Failed to cache projects data", e);
         }
      }
    };

    loadProjects();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <>
      {/* <FloatingSplineBot splineScene="./spline/genkub.splinecode"/> */}
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