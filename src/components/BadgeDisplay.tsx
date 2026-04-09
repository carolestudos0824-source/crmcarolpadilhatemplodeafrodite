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
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {badges.map((badge) => {
        const symbol = BADGE_SYMBOLS[badge.id] || badge.icon;
        return (
          <div
            key={badge.id}
            className={`group flex flex-col items-center gap-2 w-[68px] transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-50"
            }`}
            title={badge.description}
          >
            {/* Badge circle */}
            <div className={`relative w-14 h-14 rounded-full transition-all duration-500 ${
              badge.earned
                ? "shadow-[0_0_18px_hsl(340_42%_30%/0.2),0_0_40px_hsl(36_45%_58%/0.12)]"
                : ""
            }`}>
              <div className={`absolute inset-0 rounded-full border-2 ${
                badge.earned ? "border-primary/50" : "border-muted-foreground/20"
              }`} />
              <div className={`absolute inset-[3px] rounded-full border ${
                badge.earned ? "border-secondary/30" : "border-transparent"
              }`} />
              <div className={`absolute inset-[5px] rounded-full flex items-center justify-center ${
                badge.earned
                  ? "bg-gradient-to-br from-parchment to-ivory"
                  : "bg-muted/70"
              }`}>
                <span className={`text-lg ${
                  badge.earned ? "text-secondary" : "text-muted-foreground/30"
                }`}>
                  {symbol}
                </span>
              </div>
            </div>
            <span className={`text-[9px] font-body text-center leading-tight tracking-wider uppercase ${
              badge.earned ? "text-foreground/70" : "text-muted-foreground/40"
            }`}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
