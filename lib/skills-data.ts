export type SkillCategory = {
  name: string;
  skills: {
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    description: string;
  }[];
};

export const skillsData: SkillCategory[] = [
  {
    name: "Frontend Development",
    skills: [
      {
        name: "HTML5",
        level: "Advanced",
        description: "Structuring and presenting web content",
      },
      {
        name: "CSS",
        level: "Advanced",
        description: "Styling web applications for responsive designs",
      },
      {
        name: "JavaScript",
        level: "Advanced",
        description: "Building dynamic and interactive web applications",
      },
      {
        name: "Tailwind CSS",
        level: "Advanced",
        description: "Utility-first CSS framework for rapid UI development",
      },
      {
        name: "React",
        level: "Advanced",
        description:
          "Building modern web applications with React and its ecosystem",
      },
      {
        name: "Next.js",
        level: "Intermediate",
        description: "Creating performant and SEO-friendly web applications",
      },
      {
        name: "TypeScript",
        level: "Intermediate",
        description: "Writing type-safe code for scalable applications",
      },
      {
        name: "Ant Design",
        level: "Intermediate",
        description: "Design system for building enterprise-level UIs",
      },
      {
        name: "Vite",
        level: "Intermediate",
        description: "Frontend build tool for fast and modern web development",
      },
    ],
  },
  {
    name: "Backend Development",
    skills: [
      {
        name: "PHP",
        level: "Intermediate",
        description: "Server-side scripting for web applications",
      },
      {
        name: "Node.js",
        level: "Beginner",
        description: "Building scalable server-side applications",
      },
      {
        name: "PostgreSQL",
        level: "Intermediate",
        description: "Designing and managing relational databases",
      },
      {
        name: "MySQL",
        level: "Intermediate",
        description: "Managing relational database systems",
      },
      {
        name: "MongoDB",
        level: "Intermediate",
        description:
          "Working with NoSQL databases for flexible data structures",
      },
    ],
  },
  {
    name: "Operating Systems & Distributions",
    skills: [
      {
        name: "Ubuntu",
        level: "Intermediate",
        description: "Popular Linux distribution for beginners and developers",
      },
      {
        name: "Linux Mint",
        level: "Intermediate",
        description: "Beginner-friendly Linux distribution for daily use",
      },
      {
        name: "Fedora",
        level: "Intermediate",
        description: "Cutting-edge Linux distribution sponsored by Red Hat",
      },
      {
        name: "Kali Linux",
        level: "Intermediate",
        description:
          "Penetration testing and ethical hacking Linux distribution",
      },
      {
        name: "Pop!_OS",
        level: "Intermediate",
        description:
          "Linux distribution focused on productivity and development",
      },
      {
        name: "Garuda",
        level: "Intermediate",
        description: "User-friendly Arch-based Linux with gaming focus",
      },
      {
        name: "Archcraft",
        level: "Intermediate",
        description: "Minimal and aesthetically focused Arch-based Linux",
      },
      {
        name: "Arch",
        level: "Intermediate",
        description: "Minimalistic and user-controlled Linux distribution",
      },
      {
        name: "BlackArch",
        level: "Intermediate",
        description:
          "Security-focused Linux distribution for penetration testing",
      },
    ],
  },
  {
    name: "Programming Languages",
    skills: [
      {
        name: "C",
        level: "Advanced",
        description: "Developing system-level applications",
      },
      {
        name: "C++",
        level: "Intermediate",
        description: "Object-oriented programming with advanced capabilities",
      },
      {
        name: "Java",
        level: "Intermediate",
        description: "Object-oriented programming for scalable solutions",
      },
      {
        name: "Python",
        level: "Intermediate",
        description: "Developing scalable applications and scripts",
      },
      {
        name: "C#",
        level: "Beginner",
        description: "Building desktop and game applications",
      },
      {
        name: "Markdown",
        level: "Advanced",
        description: "Creating structured documentation with ease",
      },
      {
        name: "R",
        level: "Beginner",
        description: "Statistical computing and graphics programming",
      },
    ],
  },
  {
    name: "Productivity Tools",
    skills: [
      {
        name: "Microsoft Word",
        level: "Intermediate",
        description: "Creating and formatting professional documents",
      },
      {
        name: "Microsoft Excel",
        level: "Intermediate",
        description: "Data analysis, visualization, and management",
      },
      {
        name: "Microsoft PowerPoint",
        level: "Intermediate",
        description: "Creating visually appealing presentations",
      },
      {
        name: "MS Office Suite",
        level: "Intermediate",
        description: "Proficiency in Microsoft Office applications",
      },
      {
        name: "Obsidian",
        level: "Intermediate",
        description: "Knowledge management and note-taking using markdown",
      },
    ],
  },
  {
    name: "Tools & Others",
    skills: [
      {
        name: "Git",
        level: "Advanced",
        description: "Version control and collaboration",
      },
      {
        name: "GitHub",
        level: "Advanced",
        description: "Managing repositories and collaboration",
      },
      {
        name: "Docker",
        level: "Intermediate",
        description: "Containerization and deployment",
      },
      {
        name: "Cloudflare",
        level: "Intermediate",
        description: "Optimizing and securing web traffic",
      },
      {
        name: "NPM",
        level: "Intermediate",
        description: "JavaScript package management",
      },
      {
        name: "Bun",
        level: "Intermediate",
        description: "An all-in-one JavaScript runtime",
      },
    ],
  },
  {
    name: "Design & Multimedia",
    skills: [
      {
        name: "Draw.io",
        level: "Intermediate",
        description: "Creating diagrams and flowcharts easily",
      },
      {
        name: "Blender",
        level: "Beginner",
        description: "3D modeling and animation software",
      },
    ],
  },
];
