import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { UserProgress } from "@/data/tarot-data";

interface JourneyMapProps {
  progress: UserProgress;
}

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-lg mx-auto pb-16">
      {/* Central vertical path */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-px">
        <div className="w-px h-full bg-gradient-to-b from-primary/20 via-primary/8 to-transparent" />
      </div>

      <div className="space-y-3">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`);
          const isUnlocked = arcano.unlocked || isCompleted || progress.completedLessons.includes(`arcano-${arcano.id - 1}`);
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
              style={{ 
                animation: "fade-up 0.5s ease-out both",
                animationDelay: `${index * 60}ms` 
              }}
            >
              {/* Card */}
              <div className={`flex-1 ${side === "left" ? "pr-10" : "pl-10"}`}>
                <button
                  onClick={() => isUnlocked && navigate(`/lesson/${arcano.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-500 ${
                    side === "left" ? "text-right" : "text-left"
                  } ${
                    isCurrent
                      ? "card-mystic-active cursor-pointer hover:scale-[1.02]"
                      : isCompleted
                      ? "bg-card/40 border border-primary/8 cursor-pointer hover:border-primary/15 hover:bg-card/60"
                      : "bg-muted/20 border border-transparent cursor-not-allowed"
                  }`}
                  style={isCurrent ? { animation: "glow-breathe 4s ease-in-out infinite" } : undefined}
                >
                  <div className="relative z-10 p-4 md:p-5">
                    {/* Numeral */}
                    <span className={`font-heading text-[10px] tracking-[0.3em] block mb-1 ${
                      isCurrent 
                        ? "text-primary/70" 
                        : isCompleted 
                        ? "text-primary/30" 
                        : "text-muted-foreground/20"
                    }`}>
                      {arcano.numeral}
                    </span>
                    {/* Name */}
                    <h3 className={`font-heading text-sm md:text-base tracking-wide mb-0.5 transition-colors ${
                      isCurrent 
                        ? "text-gradient-gold" 
                        : isCompleted 
                        ? "text-foreground/70" 
                        : "text-muted-foreground/25"
                    }`}>
                      {arcano.name}
                    </h3>
                    {/* Subtitle */}
                    <p className={`font-accent text-xs italic ${
                      isCurrent 
                        ? "text-foreground/50" 
                        : isCompleted 
                        ? "text-muted-foreground/50" 
                        : "text-muted-foreground/15"
                    }`}>
                      {arcano.subtitle}
                    </p>
                  </div>

                  {/* Subtle inner glow for current */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
                  )}
                </button>
              </div>

              {/* Center node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    isCurrent
                      ? "border-primary/40 bg-primary/10"
                      : isCompleted
                      ? "border-primary/20 bg-primary/5"
                      : "border-border bg-muted/50"
                  }`}
                  style={isCurrent ? { animation: "glow-breathe 4s ease-in-out infinite" } : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-primary/60" />
                  ) : isUnlocked ? (
                    <span className="text-[10px] font-heading text-primary/80 tracking-wider">{arcano.numeral}</span>
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground/20" />
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
