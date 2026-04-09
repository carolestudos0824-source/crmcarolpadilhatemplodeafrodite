import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300" style={isActive ? {
      border: "1px solid hsl(340 42% 30% / 0.40)",
      background: "hsl(340 42% 30% / 0.10)",
      boxShadow: "0 0 14px hsl(340 42% 30% / 0.12)"
    } : {
      border: "1px solid hsl(36 25% 82% / 0.6)",
      background: "hsl(38 30% 95% / 0.5)"
    }}>
      <Flame
        className="w-4 h-4 transition-colors"
        style={{ color: isActive ? "hsl(340 42% 28%)" : "hsl(230 10% 40% / 0.35)" }}
      />
      <span className="text-sm font-heading tabular-nums" style={{
        color: isActive ? "hsl(230 25% 10% / 0.85)" : "hsl(230 10% 40% / 0.45)"
      }}>
        {streak}
      </span>
    </div>
  );
}
