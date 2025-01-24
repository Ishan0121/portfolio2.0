import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { TimelineItem } from "@/components/timeline-item";
import { Sidebar } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="h-16" />
      <section className=" py-12 sm:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Passionate about building exceptional web experiences
            </h1>
            <p className="text-lg text-muted-foreground">
              With over 5 years of experience in web development, I specialize
              in creating modern, performant, and user-friendly applications. My
              journey in tech started with a curiosity about how things work on
              the web, which evolved into a passion for crafting digital
              solutions.
            </p>
            <p className="text-lg text-muted-foreground">
              When I&apos;m not coding, you can find me exploring new
              technologies, contributing to open-source projects, or sharing
              knowledge with the developer community through blog posts and
              mentoring.
            </p>
          </div>
          <div className="relative h-[400px] lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-20 blur-3xl" />
            <Image
              src="/images/table.gif"
              alt="About Me"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="absolute h-2 w-2 z-10 rounded-[1px] rotate-45 border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute  bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-2 w-2 z-10 rounded-[1px] rotate-45 border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black"></div>
      </section>
      <hr className=" border-blue-200 dark:border-blue-300/25 border-dotted border-opacity-50" />
      <section className=" py-24 sm:py-32 ">
        <SectionHeading
          title="Experience & Education"
          description="My professional journey and academic background"
        />
        <div className="max-w-2xl mx-auto glass p-4 rounded-lg">
          <TimelineItem
            year="2024"
            title="Web Development"
            description="Started journey of Web development with html,css,javascript.Graspe the knowledge of the frameworks of css and javascript like React, Tailwind, Typescript, NEXT "
          />
          <TimelineItem
            year="2023"
            title="Learnt C language"
            description="Learnt C language in the first year of college."
          />
          <TimelineItem
            year="2022"
            title="Higher Secondary"
            description="Passed higher secondary from state board in 2022."
          />
          <TimelineItem
            year="2020"
            title="Secondary"
            description="Passed Secondary examination from state board."
          />
        </div>
      </section>
    </>
  );
}