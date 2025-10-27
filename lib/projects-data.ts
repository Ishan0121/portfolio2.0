// export const projects = [
//   {
//     title: "E-commerce Platform",
//     description: "A full-featured e-commerce platform built with Next.js and Stripe integration.",
//     imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600",
//     liveUrl: "https://example.com/ecommerce",
//     githubUrl: "https://github.com/username/ecommerce",
//     tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
//   },
//   {
//     title: "Task Management App",
//     description: "A collaborative task management tool with real-time updates.",
//     imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600",
//     liveUrl: "https://example.com/tasks",
//     githubUrl: "https://github.com/username/tasks",
//     tags: ["React", "Firebase", "TypeScript", "Material-UI"],
//   },
//   {
//     title: "Weather Dashboard",
//     description: "Real-time weather information with interactive maps and forecasts.",
//     imageUrl: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&h=600",
//     liveUrl: "https://example.com/weather",
//     githubUrl: "https://github.com/username/weather",
//     tags: ["React", "OpenWeather API", "Chart.js", "Tailwind CSS"],
//   },
// ] as const;


import { manualProjects } from "./manual-projects";
import { cachedGitHubProjects } from "./github-projects";

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}

/**
 * Combined projects from both manual and GitHub sources
 * Manual projects are displayed first, followed by GitHub projects
 */
export const projects: Project[] = [...manualProjects, ...cachedGitHubProjects];

/**
 * Get unique tags from all projects
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Filter projects by tag
 */
export function getProjectsByTag(tag: string): Project[] {
  return projects.filter((project) =>
    project.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search projects by title or description
 */
export function searchProjects(query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
  );
}