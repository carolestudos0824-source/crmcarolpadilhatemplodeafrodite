import { Star } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
          border: "1.5px solid hsl(340 42% 30% / 0.35)",
          background: "linear-gradient(135deg, hsl(340 42% 30% / 0.12), hsl(36 45% 58% / 0.08))",
          boxShadow: "0 0 15px hsl(340 42% 30% / 0.1), inset 0 1px 2px hsl(36 45% 58% / 0.1)"
        }}>
          <Star className="w-4.5 h-4.5 text-secondary fill-secondary/30" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-foreground/50 tracking-wider uppercase leading-none font-body">Nível</span>
          <span className="text-lg font-heading text-secondary tracking-wide leading-tight">{level}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-3 rounded-full overflow-hidden" style={{
          background: "hsl(36 20% 88%)",
          border: "1px solid hsl(36 25% 82% / 0.8)",
          boxShadow: "inset 0 1px 3px hsl(230 25% 10% / 0.06)"
        }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${Math.max(xpInLevel, 3)}%`,
              background: "linear-gradient(90deg, hsl(340 42% 30%), hsl(36 45% 52%), hsl(42 65% 72%))",
              boxShadow: "0 1px 4px hsl(36 45% 58% / 0.3)"
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(42 70% 80% / 0.7), transparent)",
                animation: "progress-shine 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-sm text-foreground/80 font-body tabular-nums shrink-0">
        {xpInLevel}<span className="text-foreground/40">/100</span> <span className="text-primary font-heading">XP</span>
      </span>
    </div>
  );
}
