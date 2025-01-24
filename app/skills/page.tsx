import { SectionHeading } from "@/components/section-heading";
import { SkillsSection } from "@/components/skills-section";
import { skillsData } from "@/lib/skills-data";
import Image from "next/image";

export default function SkillsPage() {
  return (
    <>
      <div className="h-10" />
      <section className="container py-12 sm:py-16 flex flex-col items-cente">
        <SectionHeading
          title="Skills & Expertise"
          description="A comprehensive overview of my technical skills and proficiency levels"
        />
        <div className="relative mb-10 h-[200px] lg:h-[400px]  w-[200px] lg:w-[400px] mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-20 blur-3xl" />
          <Image
            src="/images/skills.gif"
            alt="skills"
            fill
            className="object-cover rounded-lg absolute"
          />
        </div>
        <div className="space-y-16">
          {skillsData.map((category) => (
            <SkillsSection key={category.name} category={category} />
          ))}
        </div>

        <div className="relative mt-10 h-[130px] lg:h-[300px]  w-[300px] lg:w-[700px] mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg opacity-20 blur-3xl" />
          <Image
            src="/images/js.gif"
            alt="js"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </section>
    </>
  );
}