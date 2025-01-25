import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
};

export function ProjectCard({
  title,
  description,
  imageUrl,
  liveUrl,
  githubUrl,
  tags,
}: ProjectCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-lg border p-2 glass glass-hover"
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2 ">
          <Button asChild size="sm" variant="outline">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Code
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}