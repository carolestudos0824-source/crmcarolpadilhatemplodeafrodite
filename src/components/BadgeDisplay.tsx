import { Badge } from "@/data/tarot-data";

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
            badge.earned
              ? "card-mystic glow-gold"
              : "bg-muted/50 opacity-40"
          }`}
          title={badge.description}
        >
          <span className="text-2xl">{badge.icon}</span>
          <span className="text-[10px] font-medium text-center leading-tight text-foreground">
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}
