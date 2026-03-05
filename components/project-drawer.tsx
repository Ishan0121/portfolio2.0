"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Project } from "@/lib/github-projects-fetcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Github, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectDrawerProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDrawer({ project, open, onOpenChange }: ProjectDrawerProps) {
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project || !open) return;

    const fetchReadme = async () => {
      setLoading(true);
      setReadmeContent("");
      try {
        // Extract username and repo from githubUrl if available
        if (project.githubUrl) {
          const urlParts = project.githubUrl.split('/');
          const username = urlParts[urlParts.length - 2];
          const repo = urlParts[urlParts.length - 1];

          if (username && repo) {
            // Priority 1: Main branch
            let res = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/README.md`);
            if (!res.ok) {
              // Priority 2: Master branch
              res = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/master/README.md`);
            }
            if (res.ok) {
              const text = await res.text();
              setReadmeContent(text);
            } else {
              setReadmeContent("No README found for this repository.");
            }
          } else {
            setReadmeContent("Invalid GitHub URL.");
          }
        } else {
           setReadmeContent("No GitHub URL associated with this project.");
        }
      } catch (error) {
        console.error("Error fetching README:", error);
        setReadmeContent("Failed to load README.");
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [project, open]);

  if (!project) return null;

  const isAutoLiveUrl = project.liveUrl.includes(".github.io") && project.liveUrl.includes(project.title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full flex flex-col h-[90vh] sm:h-[90vh] md:w-[90vw] md:mx-auto md:rounded-t-3xl glass bg-blue-900/10 border-white/10 p-0 shadow-2xl overflow-hidden mt-auto mb-0 mx-0 rounded-t-2xl">
        {/* Header Section */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <SheetTitle className="text-2xl font-bold tracking-tight">
                {project.title}
              </SheetTitle>
              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild className="rounded-full glass hover:bg-white/10 transition-colors">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" /> Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && !isAutoLiveUrl && (
                  <Button size="sm" asChild className="rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> Live
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full border border-white/20 bg-black/20 px-2.5 py-0.5 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable Markdown Area */}
        <ScrollArea className="flex-1 p-6 z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Fetching project documentation...</p>
            </div>
          ) : readmeContent ? (
            <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:border prose-img:border-white/10 max-w-none pb-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {readmeContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
              <BookOpen className="w-12 h-12 opacity-20" />
              <p>Documentation not available.</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
