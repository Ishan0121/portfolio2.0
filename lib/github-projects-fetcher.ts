// lib/github-projects-fetcher.ts

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
}

export interface GitHubFetcherConfig {
  username: string;
  excludeRepos?: string[];
  maxProjects?: number;
  sortBy?: "updated" | "created" | "pushed" | "full_name";
  includeForked?: boolean;
  includeArchived?: boolean;
  customTitles?: Record<string, string>;
  customImages?: Record<string, string>;
  customDescriptions?: Record<string, string>;
  previewImagePaths?: string[];
}

const DEFAULT_LANGUAGE_IMAGES: Record<string, string> = {
  JavaScript:
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600",
  TypeScript:
    "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=600",
  Python:
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600",
  Java: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600",
  "C++":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600",
  Go: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600",
  Rust: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600",
  Ruby: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600",
  PHP: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&h=600",
  Swift:
    "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=600",
  HTML: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600",
  CSS: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=600",
  default:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600",
};

const DEFAULT_PREVIEW_PATHS = [
  "preview.png",
  "preview.jpg",
  "preview.jpeg",
  "preview/preview.png",
  "preview/preview.jpg",
  "preview/preview.jpeg",
  "assets/preview.png",
  "assets/websiteScreenshot.png",
  "assets/preview.jpg",
  "public/preview.png",
  "public/preview.jpg",
  "thumbnail.png",
  "thumbnail.jpg",
  "screenshot.png",
  "screenshot.jpg",
];

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return response.ok && (contentType?.startsWith("image/") ?? false);
  } catch {
    return false;
  }
}

async function fetchRepoLanguages(
  username: string,
  repoName: string
): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching languages for ${repoName}:`, error);
    return {};
  }
}

function getMostUsedLanguage(languages: Record<string, number>): string | null {
  if (Object.keys(languages).length === 0) return null;

  return Object.entries(languages).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev
  )[0];
}

async function fetchRepoPreviewImage(
  username: string,
  repoName: string,
  branch: string = "main",
  previewPaths: string[]
): Promise<string | null> {
  const branches = [branch, "master", "gh-pages"];

  for (const branchName of branches) {
    for (const path of previewPaths) {
      const url = `https://raw.githubusercontent.com/${username}/${repoName}/${branchName}/${path}`;
      const exists = await checkImageExists(url);
      if (exists) {
        return url;
      }
    }
  }

  return null;
}

function formatRepoTitle(
  repoName: string,
  customTitles?: Record<string, string>
): string {
  if (customTitles && customTitles[repoName]) {
    return customTitles[repoName];
  }

  return repoName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getImageUrl(
  repoName: string,
  languages: Record<string, number>,
  previewImage: string | null,
  customImages?: Record<string, string>
): string {
  // Priority 1: Custom image
  if (customImages && customImages[repoName]) {
    return customImages[repoName];
  }

  // Priority 2: Preview image from repo
  if (previewImage) {
    return previewImage;
  }

  // Priority 3: Language-based image (use most used language)
  const mostUsedLanguage = getMostUsedLanguage(languages);
  if (mostUsedLanguage && DEFAULT_LANGUAGE_IMAGES[mostUsedLanguage]) {
    return DEFAULT_LANGUAGE_IMAGES[mostUsedLanguage];
  }

  // Priority 4: Default image
  return DEFAULT_LANGUAGE_IMAGES.default;
}

export async function fetchGitHubProjects(
  config: GitHubFetcherConfig
): Promise<Project[]> {
  const {
    username,
    excludeRepos = [],
    maxProjects = 20,
    sortBy = "updated",
    includeForked = false,
    includeArchived = false,
    customTitles = {},
    customImages = {},
    customDescriptions = {},
    previewImagePaths = DEFAULT_PREVIEW_PATHS,
  } = config;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=${sortBy}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return [];
    }

    const repos = await response.json();

    // Filter repos
    const filteredRepos = repos.filter((repo: any) => {
      if (excludeRepos.includes(repo.name)) return false;
      if (!includeForked && repo.fork) return false;
      if (!includeArchived && repo.archived) return false;
      return true;
    });

    // Limit the number of repos to process
    const reposToProcess = filteredRepos.slice(0, maxProjects);

    // Process repos with preview images and all languages
    const projectsPromises = reposToProcess.map(async (repo: any) => {
      const repoName = repo.name;

      // Fetch all languages used in the repo
      const languages = await fetchRepoLanguages(username, repoName);

      // Try to fetch preview image from repo
      const previewImage = await fetchRepoPreviewImage(
        username,
        repoName,
        repo.default_branch,
        previewImagePaths
      );

      // Get final image URL with fallback logic (uses most used language)
      const imageUrl = getImageUrl(
        repoName,
        languages,
        previewImage,
        customImages
      );

      // Build tags from all languages
      const tags: string[] = [];
      const languageNames = Object.keys(languages);
      if (languageNames.length > 0) {
        // Add languages sorted by usage (most used first)
        const sortedLanguages = Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .map(([lang]) => lang)
          .slice(0, 5); // Limit to top 5 languages

        tags.push(...sortedLanguages);
      }

      // Add topics if available
      if (repo.topics && Array.isArray(repo.topics)) {
        tags.push(...repo.topics.slice(0, 3)); // Limit topics to avoid too many tags
      }

      return {
        title: formatRepoTitle(repoName, customTitles),
        description:
          customDescriptions[repoName] ||
          repo.description ||
          "No description available",
        imageUrl,
        liveUrl: repo.homepage || `https://${username}.github.io/${repoName}`,
        githubUrl: repo.html_url,
        tags,
      };
    });

    return await Promise.all(projectsPromises);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

// Helper function to merge manual and GitHub projects
export function mergeProjects(
  manualProjects: Project[],
  githubProjects: Project[],
  removeDuplicates: boolean = true
): Project[] {
  if (!removeDuplicates) {
    return [...manualProjects, ...githubProjects];
  }

  const manualTitles = new Set(
    manualProjects.map((p) => p.title.toLowerCase())
  );

  // Filter out GitHub projects that already exist in manual projects
  const uniqueGithubProjects = githubProjects.filter(
    (gp) => !manualTitles.has(gp.title.toLowerCase())
  );

  return [...manualProjects, ...uniqueGithubProjects];
}
