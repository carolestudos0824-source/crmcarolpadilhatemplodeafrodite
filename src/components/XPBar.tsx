import { Star } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

export function XPBar({ xp, level }: XPBarProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
        <Star className="w-4 h-4 text-primary fill-primary" />
        <span className="text-sm font-medium text-primary">Nv. {level}</span>
      </div>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${xpInLevel}%`,
            background: "linear-gradient(90deg, hsl(43 80% 55%), hsl(43 70% 70%))",
          }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-medium min-w-[60px] text-right">
        {xpInLevel}/100 XP
      </span>
    </div>
  );
}
