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
        <div className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center bg-primary/10 glow-gold">
          <Star className="w-4 h-4 text-primary fill-primary/40" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase leading-none">Nível</span>
          <span className="text-base font-heading text-primary tracking-wide">{level}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="h-2 bg-muted/80 rounded-full overflow-hidden border border-border/50">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${Math.max(xpInLevel, 2)}%`,
              background: "linear-gradient(90deg, hsl(40 45% 38%), hsl(40 60% 55%), hsl(40 50% 62%))",
            }}
          >
            <div
              className="absolute inset-0 w-1/3 h-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(40 55% 75% / 0.5), transparent)",
                animation: "progress-shine 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-foreground/70 font-body tabular-nums shrink-0">
        {xpInLevel}<span className="text-muted-foreground/60">/100</span> <span className="text-primary/60 font-heading">XP</span>
      </span>
    </div>
  );
}
