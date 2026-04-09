import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
      isActive ? "border-secondary/30 bg-secondary/8" : "border-border bg-muted/50"
    }`}>
      <Flame
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-secondary" : "text-muted-foreground/40"
        }`}
      />
      <span className={`text-xs font-heading tabular-nums ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}>
        {streak}
      </span>
    </div>
  );
}
