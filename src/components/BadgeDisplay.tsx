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
    <div className="flex flex-wrap justify-center gap-6">
      {badges.map((badge) => {
        const symbol = BADGE_SYMBOLS[badge.id] || badge.icon;
        return (
          <div
            key={badge.id}
            className={`group relative flex flex-col items-center gap-3 w-20 transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-45"
            }`}
            title={badge.description}
          >
            {/* Badge circle with double border */}
            <div className={`relative w-16 h-16 rounded-full p-[2px] transition-all duration-500 ${
              badge.earned
                ? "bg-gradient-to-br from-secondary/40 via-primary/30 to-secondary/40"
                : "bg-border/60"
            }`}>
              <div
                className={`w-full h-full rounded-full flex items-center justify-center border transition-all duration-500 ${
                  badge.earned
                    ? "border-primary/30 bg-card"
                    : "border-border/40 bg-muted/60"
                }`}
                style={badge.earned ? { animation: "glow-breathe 5s ease-in-out infinite" } : undefined}
              >
                <span className={`text-xl transition-all ${
                  badge.earned ? "text-secondary" : "grayscale opacity-40 text-muted-foreground"
                }`}>
                  {symbol}
                </span>
              </div>
            </div>
            {/* Label */}
            <span className={`text-[10px] font-body text-center leading-tight tracking-wide uppercase ${
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
