import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/config";
import { fetchGitHubProjects, mergeProjects } from "@/lib/github-projects-fetcher";
import { manualProjects } from "@/lib/manual-projects";
import { PortfolioGrid } from "@/components/portfolio-grid";

export const revalidate = 3600; // revalidate at most every hour

export default async function PortfolioPage() {
  const GITHUB_USERNAME = siteConfig.githubUsername;

  const config = {
    username: GITHUB_USERNAME,
    excludeRepos: [
      GITHUB_USERNAME,
      "dotfiles",
      "config",
    ],
    sortBy: "updated" as const,
    includeForked: false,
    includeArchived: false,
  };

  // Fetch automatically on the server side
  const githubProjects = await fetchGitHubProjects(config);
  const allProjects = mergeProjects(manualProjects, githubProjects);

  return (
    <>
      <div className="h-16" />
      <section className="container py-12 sm:py-16">
        <div className="mb-12">
          <SectionHeading
            title="My Projects"
            description="A collection of projects I've built throughout my journey"
          />
        </div>
        
        {/* Pass all projects to client component for animated filtering */}
        <PortfolioGrid projects={allProjects} />
      </section>
    </>
  );
}