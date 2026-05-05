import { Flame } from "lucide-react";

export function StreakCounter({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600">
      <Flame className="w-4 h-4 fill-current" />
      <span className="text-sm font-heading">{streak}</span>
    </div>
  );
}
