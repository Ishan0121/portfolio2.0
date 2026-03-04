// lib/github-projects-fetcher.ts

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  isLoading?: boolean;
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
  "assets/preview.png",
  "public/images/preview.png",
  // "preview.jpg",
  // "preview.jpeg",
  // "preview/preview.png",
  // "preview/preview.jpg",
  // "preview/preview.jpeg",
  // "assets/websiteScreenshot.png",
  // "assets/preview.jpg",
  // "public/preview.jpg",
  // "thumbnail.png",
  // "thumbnail.jpg",
  // "screenshot.png",
  // "screenshot.jpg",
];

async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: "HEAD",
      next: { revalidate: 3600 }
    });
    const contentType = response.headers.get("content-type");
    return response.ok && (contentType?.startsWith("image/") ?? false);
  } catch {
    return false;
  }
}

async function fetchRepoPreviewImage(
  username: string,
  repoName: string,
  branch: string = "main",
  previewPaths: string[]
): Promise<string | null> {
  // Only check the default branch as suggested to improve performance
  for (const path of previewPaths) {
    const url = `https://raw.githubusercontent.com/${username}/${repoName}/${branch}/${path}`;
    const exists = await checkImageExists(url);
    if (exists) {
      return url;
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
  primaryLanguage: string | null,
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

  // Priority 3: Language-based image
  if (primaryLanguage && DEFAULT_LANGUAGE_IMAGES[primaryLanguage]) {
    return DEFAULT_LANGUAGE_IMAGES[primaryLanguage];
  }

  // Priority 4: Default image
  return DEFAULT_LANGUAGE_IMAGES.default;
}

export async function fetchGitHubRepos(
  config: GitHubFetcherConfig
): Promise<{ repo: any; project: Project }[]> {
  const {
    username,
    excludeRepos = [],
    maxProjects = 100,
    sortBy = "updated",
    includeForked = false,
    includeArchived = false,
    customTitles = {},
    customDescriptions = {},
  } = config;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=${sortBy}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }
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

    // Return basic project info suitable for immediate display
    return reposToProcess.map((repo: any) => {
      const repoName = repo.name;
      const project: Project = {
        title: formatRepoTitle(repoName, customTitles),
        description:
          customDescriptions[repoName] ||
          repo.description ||
          "No description available",
        imageUrl: DEFAULT_LANGUAGE_IMAGES.default, // Default placeholder
        liveUrl: repo.homepage || `https://${username}.github.io/${repoName}`,
        githubUrl: repo.html_url,
        tags: [],
        isLoading: true,
      };
      return { repo, project };
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

export async function enrichProject(
  basicProject: Project,
  repo: any,
  config: GitHubFetcherConfig
): Promise<Project> {
  const {
    username,
    customImages = {},
    previewImagePaths = DEFAULT_PREVIEW_PATHS,
  } = config;
  const repoName = repo.name;

  try {
    // Avoid fetching languages separately to save API calls
    // Use repo.language (primary language) and keywords instead

    // Try to fetch preview image from repo
    const previewImage = await fetchRepoPreviewImage(
      username,
      repoName,
      repo.default_branch,
      previewImagePaths
    );

    // Get final image URL with fallback logic (uses primary language)
    const imageUrl = getImageUrl(
      repoName,
      repo.language, // Use the primary language from the repo object
      previewImage,
      customImages
    );

    // Build tags
    const tags: string[] = [];
    
    // Add primary language if available
    if (repo.language) {
      tags.push(repo.language);
    }

    // Add topics if available
    if (repo.topics && Array.isArray(repo.topics)) {
      tags.push(...repo.topics.slice(0, 4)); // Limit topics
    }

    return {
      ...basicProject,
      imageUrl,
      tags,
      isLoading: false,
    };
  } catch (error) {
    console.error(`Error enriching project ${repoName}:`, error);
    return { ...basicProject, isLoading: false };
  }
}

export async function fetchGitHubProjects(
  config: GitHubFetcherConfig
): Promise<Project[]> {
  const basicData = await fetchGitHubRepos(config);
  const enrichedProjectsPromise = basicData.map(({ repo, project }) =>
    enrichProject(project, repo, config)
  );
  return await Promise.all(enrichedProjectsPromise);
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
