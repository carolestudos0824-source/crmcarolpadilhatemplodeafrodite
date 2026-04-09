import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className="flex items-center gap-1.5">
      <Flame
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-secondary" : "text-muted-foreground/30"
        }`}
      />
      <span className={`text-xs font-body tabular-nums ${isActive ? "text-foreground/80" : "text-muted-foreground/40"}`}>
        {streak}
      </span>
    </div>
  );
}
