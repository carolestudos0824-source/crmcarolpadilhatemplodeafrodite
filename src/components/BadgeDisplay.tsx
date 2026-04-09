import { Badge } from "@/data/tarot-data";

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`group relative flex flex-col items-center gap-2 w-20 transition-all duration-500 ${
            badge.earned ? "opacity-100" : "opacity-30"
          }`}
          title={badge.description}
        >
          {/* Badge circle */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
              badge.earned
                ? "border-primary/30 bg-primary/5 glow-gold"
                : "border-border bg-muted/30"
            }`}
            style={badge.earned ? { animation: "glow-breathe 4s ease-in-out infinite" } : undefined}
          >
            <span className={`text-lg ${badge.earned ? "" : "grayscale"}`}>
              {badge.icon}
            </span>
          </div>
          {/* Label */}
          <span className={`text-[9px] font-body text-center leading-tight tracking-wide uppercase ${
            badge.earned ? "text-foreground/70" : "text-muted-foreground/40"
          }`}>
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}
