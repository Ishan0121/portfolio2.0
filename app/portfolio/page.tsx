import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects-data";

export default function PortfolioPage() {
  return (
    <>
      <div className="h-16" />
      <section className="container py-12 sm:py-16">
        <SectionHeading
          title="My Projects"
          description="A collection of projects I've built throughout my journey"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              {...project}
              tags={[...project.tags]}
            />
          ))}
        </div>
      </section>
    </>
  );
}