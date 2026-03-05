"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { ProjectDrawer } from "@/components/project-drawer";
import { Project } from "@/lib/github-projects-fetcher";
import { containerVariants } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 10;

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract all tags and count occurrences
  const tagCounts = projects.flatMap(p => p.tags).reduce((acc, tag) => {
    if (tag) acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by count (descending) and get top 8 tags to not overwhelm the UI
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(entry => entry[0]);

  const filterTags = ["All", ...topTags];

  const filteredProjects = projects.filter((project) =>
    activeTag === "All" ? true : project.tags.includes(activeTag)
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // Scroll to the top of the grid with an offset
      // Using setTimeout to ensure the state update has started rendering
      setTimeout(() => {
        const element = document.getElementById("portfolio-grid");
        if (element) {
          const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: topOffset, behavior: "smooth" });
        }
      }, 50);
    }
  };

  return (
    <div className="space-y-8" id="portfolio-grid">
      {/* Top Bar: Filters + Page Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 w-full">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {filterTags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagChange(tag)}
              className="rounded-full transition-all duration-300 shadow-sm"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Top Page Indicator */}
        {totalPages > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-white/10 shadow-[0_4px_24px_-8px_rgba(var(--primary),0.3)] bg-background/40 backdrop-blur-md self-end md:self-auto hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">Page</span>
                <span className="text-sm font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  {currentPage}
                </span>
                <span className="text-xs text-muted-foreground/60 px-0.5">/</span>
                <span className="text-sm font-semibold text-muted-foreground">{totalPages}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1 opacity-70" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10 bg-background/60 backdrop-blur-xl min-w-[120px] max-h-[300px] overflow-y-auto">
              {Array.from({ length: totalPages }).map((_, i) => (
                <DropdownMenuItem 
                  key={i + 1} 
                  onClick={() => handlePageChange(i + 1)}
                  className={`flex justify-between items-center cursor-pointer ${
                    currentPage === i + 1 ? "bg-primary/20 text-primary focus:bg-primary/30" : "text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-white/10"
                  }`}
                >
                  <span>Page {i + 1}</span>
                  {currentPage === i + 1 && (
                    <motion.div 
                      layoutId="dropdown-active-indicator" 
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]" // Min height prevents huge layout shifts when paginating
      >
        <AnimatePresence mode="popLayout">
          {currentProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={`${project.githubUrl || project.title}-${currentPage}-${index}`}
            >
              <ProjectCard {...project} tags={[...project.tags]} onClick={() => {
                setSelectedProject(project);
                setIsDrawerOpen(true);
              }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-16 text-muted-foreground glass rounded-xl border flex flex-col justify-center min-h-[300px]"
        >
          <p className="text-xl font-medium mb-2">No projects found</p>
          <p>Try selecting a different filter option.</p>
        </motion.div>
      )}

      {/* Futuristic Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-12 pt-8 select-none"
        >
          <div className="glass flex items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] bg-background/40 backdrop-blur-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full hover:bg-white/10 hover:text-foreground transition-all duration-300 text-muted-foreground w-9 h-9 sm:w-10 sm:h-10 shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                
                // Truncate logic for many pages
                if (
                  totalPages > 5 &&
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) > 1
                ) {
                  // Only show ellipsis once per block
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={page} className="text-muted-foreground px-1">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300
                      ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-page-indicator"
                        className="absolute inset-0 bg-primary/90 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 30 
                        }}
                      />
                    )}
                    <span className="relative z-10">{page}</span>
                  </button>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full hover:bg-white/10 hover:text-foreground transition-all duration-300 text-muted-foreground w-9 h-9 sm:w-10 sm:h-10 shrink-0"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Project Detail Drawer */}
      <ProjectDrawer 
        project={selectedProject} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </div>
  );
}
