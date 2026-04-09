import { Badge } from "@/data/tarot-data";

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`group relative flex flex-col items-center gap-2.5 w-20 transition-all duration-500 ${
            badge.earned ? "opacity-100" : "opacity-40"
          }`}
          title={badge.description}
        >
          {/* Badge circle */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              badge.earned
                ? "border-primary/50 bg-primary/10 glow-gold-strong"
                : "border-border/60 bg-muted/40"
            }`}
            style={badge.earned ? { animation: "glow-breathe 4s ease-in-out infinite" } : undefined}
          >
            <span className={`text-xl ${badge.earned ? "" : "grayscale opacity-50"}`}>
              {badge.icon}
            </span>
          </div>
          {/* Label */}
          <span className={`text-[10px] font-body text-center leading-tight tracking-wide uppercase ${
            badge.earned ? "text-foreground/80" : "text-muted-foreground/50"
          }`}>
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}
