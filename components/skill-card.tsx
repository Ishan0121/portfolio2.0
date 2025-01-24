type SkillCardProps = {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
};

export function SkillCard({ name, level, description }: SkillCardProps) {
  return (
    <div className="rounded-lg border bg-blue-900 bg-opacity-5 backdrop-blur-[1px] p-4 transition-colors hover:backdrop-blur-[3px] hover:bg-opacity-20 shadow-sm shadow-blue-900">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-sm text-muted-foreground">{level}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}