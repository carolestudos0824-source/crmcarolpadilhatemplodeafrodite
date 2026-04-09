import { Star } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
          <Star className="w-3.5 h-3.5 text-primary fill-primary/30" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase leading-none">Nível</span>
          <span className="text-sm font-heading text-primary tracking-wide">{level}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${Math.max(xpInLevel, 2)}%`,
              background: "linear-gradient(90deg, hsl(40 40% 35%), hsl(40 55% 50%), hsl(40 45% 60%))",
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(40 55% 70% / 0.4), transparent)",
                animation: "progress-shine 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground font-body tabular-nums shrink-0">
        {xpInLevel}<span className="text-muted-foreground/40">/100</span> <span className="text-muted-foreground/50">XP</span>
      </span>
    </div>
  );
}
