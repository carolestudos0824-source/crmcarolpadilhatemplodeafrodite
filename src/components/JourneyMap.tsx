import { useNavigate } from "react-router-dom";
import { Lock, Check, ChevronRight } from "lucide-react";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { UserProgress } from "@/data/tarot-data";

interface JourneyMapProps {
  progress: UserProgress;
}

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-md mx-auto">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

      <div className="space-y-4">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`);
          const isUnlocked = arcano.unlocked || isCompleted || progress.completedLessons.includes(`arcano-${arcano.id - 1}`);
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Card */}
              <div className={`flex-1 ${side === "left" ? "pr-8" : "pl-8"}`}>
                <button
                  onClick={() => isUnlocked && navigate(`/lesson/${arcano.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full text-${side} p-4 rounded-xl transition-all duration-300 group ${
                    isCurrent
                      ? "card-mystic glow-gold cursor-pointer hover:scale-[1.02]"
                      : isCompleted
                      ? "bg-muted/60 border border-primary/20 cursor-pointer hover:bg-muted"
                      : "bg-muted/30 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-heading tracking-wider ${isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground/50"}`}>
                      {arcano.numeral}
                    </span>
                    {isCurrent && <ChevronRight className="w-3 h-3 text-primary animate-pulse" />}
                  </div>
                  <h3 className={`font-heading text-sm font-semibold ${isCurrent ? "text-gradient-gold" : isCompleted ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {arcano.name}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isCurrent ? "text-foreground/70" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                    {arcano.subtitle}
                  </p>
                </button>
              </div>

              {/* Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/20 glow-gold"
                      : isCompleted
                      ? "border-primary/50 bg-primary/10"
                      : "border-muted-foreground/20 bg-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : isUnlocked ? (
                    <span className="text-xs font-heading text-primary">{arcano.numeral}</span>
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground/40" />
                  )}
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
