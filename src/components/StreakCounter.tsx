import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
      <Flame className={`w-5 h-5 ${streak > 0 ? "text-secondary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium text-foreground">
        {streak} {streak === 1 ? "dia" : "dias"}
      </span>
    </div>
  );
}
