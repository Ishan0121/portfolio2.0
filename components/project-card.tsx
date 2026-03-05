import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ProjectCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  isLoading?: boolean;
  onClick?: () => void;
};

export function ProjectCard({
  title,
  description,
  imageUrl,
  liveUrl,
  githubUrl,
  tags,
  isLoading,
  onClick,
}: ProjectCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border p-2 space-y-2 glass">
        <Skeleton className="h-[220px] w-full rounded-lg" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Determine if it's the auto-generated live URL which we shouldn't show if missing
  const isAutoLiveUrl = liveUrl.includes(".github.io") && liveUrl.includes(title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <div 
      className={`group relative flex flex-col h-full overflow-hidden rounded-xl border p-2 glass glass-hover transition-all duration-300 dark:border-white/10 dark:hover:border-white/20 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={(e) => {
        // Only trigger if not clicking on the action buttons directly
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
          return;
        }
        onClick?.();
      }}
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="flex flex-col flex-grow p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl tracking-tight transition-colors duration-300 line-clamp-1 group-hover:text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors hover:bg-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border mt-4">
          {liveUrl && !isAutoLiveUrl && (
            <Button asChild size="sm" className="flex-1 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button asChild size="sm" variant={liveUrl && !isAutoLiveUrl ? "outline" : "default"} className="flex-1 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}