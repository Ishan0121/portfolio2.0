import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

const blogDir = path.join(process.cwd(), 'content', 'blog');

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  return files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      const fullPath = path.join(blogDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const hasFrontmatter = fileContents.startsWith('---');
      let title = slug.replace(/-/g, ' '); // simple fallback
      // title case fallback
      title = title.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      let date = new Date().toISOString().split('T')[0];
      let excerpt = '';
      let content = fileContents;

      if (hasFrontmatter) {
        const parts = fileContents.split('---');
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          content = parts.slice(2).join('---').trim();
          
          frontmatter.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length) {
              const val = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
              if (key.trim() === 'title') title = val;
              if (key.trim() === 'date') date = val;
              if (key.trim() === 'excerpt') excerpt = val;
            }
          });
        }
      }

      if (!excerpt) {
        excerpt = content.slice(0, 150).replace(/[#>*\n]/g, ' ').trim() + '...';
      }

      return { slug, title, date, excerpt, content };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
