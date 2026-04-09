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
            className={`group flex flex-col items-center gap-2.5 w-[76px] transition-all duration-500 ${
              badge.earned ? "opacity-100" : "opacity-50"
            }`}
            title={badge.description}
          >
            {/* Badge circle */}
            <div className={`relative w-[64px] h-[64px] rounded-full transition-all duration-500 ${
              badge.earned
                ? "group-hover:scale-110"
                : ""
            }`} style={badge.earned ? {
              boxShadow: "0 0 20px hsl(36 45% 58% / 0.30), 0 4px 15px hsl(340 42% 30% / 0.15), 0 0 40px hsl(42 70% 80% / 0.10)"
            } : undefined}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={badge.earned ? {
                border: "2px solid hsl(36 45% 52% / 0.55)",
                boxShadow: "inset 0 0 8px hsl(36 45% 58% / 0.10)"
              } : {
                border: "1.5px solid hsl(230 10% 40% / 0.20)"
              }} />
              {/* Inner ring */}
              <div className="absolute inset-[3px] rounded-full" style={badge.earned ? {
                border: "1px solid hsl(340 42% 30% / 0.30)"
              } : {
                border: "1px solid transparent"
              }} />
              {/* Core */}
              <div className="absolute inset-[6px] rounded-full flex items-center justify-center transition-all duration-300" style={badge.earned ? {
                background: "linear-gradient(135deg, hsl(38 30% 94%), hsl(36 33% 97%), hsl(36 45% 58% / 0.15))",
                boxShadow: "inset 0 2px 4px hsl(36 45% 58% / 0.18), inset 0 -1px 3px hsl(340 42% 30% / 0.10)"
              } : {
                background: "hsl(36 20% 90% / 0.50)"
              }}>
                <span className="text-xl leading-none" style={badge.earned ? {
                  color: "hsl(340 42% 26%)",
                  filter: "drop-shadow(0 1px 2px hsl(36 45% 58% / 0.25))"
                } : {
                  color: "hsl(230 10% 40% / 0.28)"
                }}>
                  {symbol}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-body text-center leading-tight tracking-wider uppercase transition-colors duration-300" style={badge.earned ? {
              color: "hsl(230 25% 10% / 0.70)"
            } : {
              color: "hsl(230 10% 40% / 0.35)"
            }}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
