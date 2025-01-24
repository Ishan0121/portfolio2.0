import { SkillCard } from "./skill-card";
import type { SkillCategory } from "@/lib/skills-data";

type SkillsSectionProps = {
  category: SkillCategory;
};

export function SkillsSection({ category }: SkillsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">{category.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.skills.map((skill) => (
          <SkillCard key={skill.name} {...skill} />
        ))}
      </div>
    </div>
  );
}