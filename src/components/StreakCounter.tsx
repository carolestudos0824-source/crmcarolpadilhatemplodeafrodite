import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
      isActive ? "border-secondary/30 bg-secondary/10" : "border-border/50 bg-muted/30"
    }`}>
      <Flame
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-secondary" : "text-muted-foreground/40"
        }`}
      />
      <span className={`text-xs font-heading tabular-nums ${isActive ? "text-foreground/90" : "text-muted-foreground/50"}`}>
        {streak}
      </span>
    </div>
  );
}
