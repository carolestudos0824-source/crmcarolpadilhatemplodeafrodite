import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all ${
      isActive
        ? "border border-secondary/35 bg-secondary/10"
        : "border border-border bg-card/60"
    }`} style={isActive ? {
      boxShadow: "0 0 12px hsl(340 42% 30% / 0.1)"
    } : undefined}>
      <Flame
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-secondary" : "text-muted-foreground/45"
        }`}
      />
      <span className={`text-sm font-heading tabular-nums ${isActive ? "text-foreground" : "text-muted-foreground/55"}`}>
        {streak}
      </span>
    </div>
  );
}
