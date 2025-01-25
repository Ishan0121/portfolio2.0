import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects-data";
import { Typewriter } from "@/components/type-writer";
import DownloadAnimationButton from "@/components/download-button-with-animation";
export default function Home() {
  const messages = [
    "Welcome to my Portfolio!",
    "I am a Developer.",
    "I Love Coding.",
    "Exploring Technologies.",
    "A Programmer.",
  ];
  return (
    <>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <section className=" container py-12 sm:py-16 relative lg:min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
          <div className=" select-none">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 cursor-cell">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent">
                Ishan Maiti
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent text-4xl font-mono">
                <Typewriter
                  textArray={messages}
                  typingSpeed={100}
                  delayBetweenTexts={2000}
                />
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Passionate about crafting seamless digital experiences through
              clean code and <br />
              innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Contact Me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <DownloadAnimationButton
                filePath="/docs/demo.pdf" // Custom file path
                fileName="My Resume.pdf" // Custom file name
                delay={1500} // Custom delay of 1.5 seconds
                buttonClassName="glass" // Custom button styling
                iconClassName="ml-2 h-5 w-5" // Custom icon size
              />

            </div>
          </div>
          <div className="relative h-[300px] lg:h-[600px]  w-[300px] lg:w-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-40 blur-3xl" />
            <Image
              src="https://github.com/Ishan0121/portfolio2.0/blob/4a086a73be72d84fbb8a5d2086d6c67da6c5ef9b/public/images/about.png"
              alt="Profile"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        <div className="absolute h-2 w-2 rounded-[1px] rotate-45 border border-blue-300 dark:border-blue-300/25 bg-white dark:bg-black bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute  bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-2 w-2 z-10 rounded-[1px] rotate-45 border border-blue-300 dark:border-blue-300/25 bg-white dark:bg-black"></div>
      </section>
      <hr className=" border-blue-700 dark:border-blue-300/25 border-dotted" />
      <section className=" py-12 sm:py-16 select-none">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-16">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="glass glass-hover group relative overflow-hidden rounded-lg border p-2"
            >
              <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                <Image
                  src={projects[i].imageUrl}
                  alt={projects[i].title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold"> {projects[i].title} </h3>
                <p className="text-sm text-muted-foreground">
                  {projects[i].description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
