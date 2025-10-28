"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/projects-data";
import { Typewriter } from "@/components/type-writer";
import DownloadAnimationButton from "@/components/download-button-with-animation";
import { motion } from "framer-motion";
import { cardVariant, fadeInVariant, staggerContainer } from "@/lib/utils";

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
      <motion.section
        className="container py-12 sm:py-16 relative lg:min-h-screen"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
          {/* Animated Text Section */}
          <motion.div className="select-none" variants={fadeInVariant}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 cursor-cell">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent">
                Ishan Maiti
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent text-2xl sm:text-4xl font-mono">
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg">
                  <Link href="/contact">
                    Contact Me
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <DownloadAnimationButton
                filePath="./docs/ISHAN MAITI_CV2.pdf"
                fileName="My Resume.pdf"
                delay={1500}
                buttonClassName="glass"
                iconClassName="ml-2 h-5 w-5"
              />
            </div>
          </motion.div>
          {/* Animated Profile Image */}
          <motion.div
            className="relative h-[300px] lg:h-[600px]  w-[300px] lg:w-[600px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-40 blur-3xl" />
            <Image
              src="./images/about.png"
              alt="Profile"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </motion.div>
        </div>
      </motion.section>
      <hr className="border-blue-700 dark:border-blue-300/25 border-dotted" />
      <motion.section
        className="py-12 sm:py-16 select-none"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight text-center mb-16"
          variants={fadeInVariant}
        >
          Featured Projects
        </motion.h2>
        <motion.div
          variants={fadeInVariant}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.slice(0, 3).map((project, i) => (
            <motion.div
              key={i}
              className="glass glass-hover group relative overflow-hidden rounded-lg border p-2"
              variants={cardVariant}
              whileHover="hover"
            >
              <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </>
  );
}
