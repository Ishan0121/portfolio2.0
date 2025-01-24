type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
};

export function TimelineItem({ year, title, description }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 h-full w-[2px] bg-border">
        <div className="absolute left-[-5px] top-2 h-3 w-3 rounded-full bg-primary" />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{year}</div>
        <div className="font-semibold">{title}</div>
        <div className="text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}