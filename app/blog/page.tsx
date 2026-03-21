import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { features } from "@/config/features";
import { redirect } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

export const metadata = {
  title: "Blog | Insights and Case Studies",
  description: "Read my latest thoughts and case studies on software engineering.",
};

export default function BlogIndex() {
  if (!features.blog) {
    redirect("/");
  }

  const posts = getBlogPosts();

  return (
    <div className="py-20 md:py-32">
      <SectionHeading
        title="Blog & Insights"
        description="Thoughts, tutorials, and case studies about development and design."
      />

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground mt-20">
          <p>No posts found. Add markdown files to `content/blog/` to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
              <Card className="h-full flex flex-col bg-card/40 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors text-xl">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2 font-mono text-xs">
                    <CalendarIcon className="w-3 h-3" />
                    {post.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow text-sm text-muted-foreground">
                  {post.excerpt}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
