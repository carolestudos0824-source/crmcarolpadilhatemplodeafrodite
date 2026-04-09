import { Badge } from "@/data/tarot-data";

const BADGE_SYMBOLS: Record<string, string> = {
  "first-step": "✦",
  "fool-complete": "☽",
  "quiz-master": "★",
  "deep-diver": "◈",
  "streak-3": "☀",
  "streak-7": "✧",
  "library-explorer": "❋",
};

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-5 md:gap-7">
      {badges.map((badge) => {
        const symbol = BADGE_SYMBOLS[badge.id] || badge.icon;
        return (
          <div
            key={badge.id}
            className={`group relative flex flex-col items-center gap-3 w-[72px] transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-40"
            }`}
            title={badge.description}
          >
            {/* Outer ring */}
            <div className={`relative w-[60px] h-[60px] rounded-full transition-all duration-500 ${
              badge.earned
                ? "shadow-[0_0_20px_hsl(36_45%_58%/0.2)]"
                : ""
            }`}>
              {/* Decorative ring */}
              <div className={`absolute inset-0 rounded-full border-2 transition-all ${
                badge.earned
                  ? "border-primary/40"
                  : "border-border/50"
              }`} />
              {/* Inner ring */}
              <div className={`absolute inset-[3px] rounded-full border transition-all ${
                badge.earned
                  ? "border-secondary/25"
                  : "border-transparent"
              }`} />
              {/* Center */}
              <div className={`absolute inset-[6px] rounded-full flex items-center justify-center transition-all ${
                badge.earned
                  ? "bg-gradient-to-br from-card via-card to-primary/10"
                  : "bg-muted/60"
              }`}>
                <span className={`text-lg transition-all ${
                  badge.earned ? "text-secondary" : "text-muted-foreground/30"
                }`}>
                  {symbol}
                </span>
              </div>
            </div>
            {/* Label */}
            <span className={`text-[9px] font-body text-center leading-tight tracking-wider uppercase ${
              badge.earned ? "text-foreground/65" : "text-muted-foreground/35"
            }`}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
