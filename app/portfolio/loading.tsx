import { SectionHeading } from "@/components/section-heading";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
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
        
        <div className="space-y-8" id="portfolio-grid">
          {/* Top Bar Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 w-full">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-16 sm:w-20 rounded-full" />
              ))}
            </div>
            {/* Page Indicator Skeleton */}
            <div className="flex-shrink-0 self-end md:self-auto">
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border p-2 space-y-2 glass">
                <Skeleton className="h-[220px] w-full rounded-lg" />
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border mt-4">
                    <Skeleton className="h-9 flex-1 rounded-full" />
                    <Skeleton className="h-9 flex-1 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
