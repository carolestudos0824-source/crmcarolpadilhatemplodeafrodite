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
            className={`group flex flex-col items-center gap-2.5 w-[72px] transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-60"
            }`}
            title={badge.description}
          >
            {/* Badge circle — richer, more precious */}
            <div className={`relative w-[60px] h-[60px] rounded-full transition-all duration-500 ${
              badge.earned
                ? "shadow-[0_0_20px_hsl(36_45%_58%/0.25),0_4px_15px_hsl(340_42%_30%/0.12)]"
                : ""
            }`}>
              {/* Outer ring */}
              <div className={`absolute inset-0 rounded-full ${
                badge.earned
                  ? "border-2 border-primary/50"
                  : "border border-muted-foreground/25"
              }`} />
              {/* Inner ring */}
              <div className={`absolute inset-[3px] rounded-full ${
                badge.earned
                  ? "border border-secondary/30"
                  : "border border-transparent"
              }`} />
              {/* Core */}
              <div className={`absolute inset-[6px] rounded-full flex items-center justify-center ${
                badge.earned
                  ? "bg-gradient-to-br from-ivory via-parchment to-primary/10"
                  : "bg-muted/60"
              }`} style={badge.earned ? {
                boxShadow: "inset 0 1px 3px hsl(36 45% 58% / 0.15), inset 0 -1px 2px hsl(340 42% 30% / 0.08)"
              } : undefined}>
                <span className={`text-xl leading-none ${
                  badge.earned ? "text-secondary" : "text-muted-foreground/35"
                }`}>
                  {symbol}
                </span>
              </div>
            </div>
            <span className={`text-[9px] font-body text-center leading-tight tracking-wider uppercase ${
              badge.earned ? "text-foreground/75" : "text-muted-foreground/45"
            }`}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
