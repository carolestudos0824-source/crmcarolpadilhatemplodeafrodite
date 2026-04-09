import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles } from "lucide-react";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { UserProgress } from "@/data/tarot-data";

interface JourneyMapProps {
  progress: UserProgress;
}

const ARCANO_SYMBOLS: Record<number, string> = {
  0: "☽", 1: "✧", 2: "◈", 3: "❋", 4: "◆", 5: "✦", 6: "♡", 7: "⚡",
  8: "∞", 9: "☆", 10: "◎", 11: "⚖", 12: "△", 13: "✝", 14: "☾",
  15: "⛧", 16: "⌂", 17: "★", 18: "☽", 19: "☀", 20: "♱", 21: "◯",
};

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-2xl mx-auto pb-16">
      {/* Decorative top */}
      <div className="flex flex-col items-center mb-8 opacity-50">
        <div className="w-px h-6 bg-gradient-to-b from-transparent to-primary/40" />
        <Sparkles className="w-3.5 h-3.5 text-primary/60" />
      </div>

      {/* Central path */}
      <div className="absolute left-1/2 top-16 bottom-16 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            hsl(40 60% 55% / 0.25) 0px, 
            hsl(40 60% 55% / 0.25) 4px, 
            transparent 4px, 
            transparent 12px)`,
        }} />
      </div>

      <div className="relative space-y-0">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`);
          const isUnlocked = arcano.unlocked || isCompleted || progress.completedLessons.includes(`arcano-${arcano.id - 1}`);
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";
          const symbol = ARCANO_SYMBOLS[arcano.id] || "◇";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center py-3 ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
              style={{
                animation: "fade-up 0.6s ease-out both",
                animationDelay: `${index * 70}ms`,
              }}
            >
              {/* Card */}
              <div className={`flex-1 ${side === "left" ? "pr-10 md:pr-14" : "pl-10 md:pl-14"}`}>
                <button
                  onClick={() => isUnlocked && navigate(`/lesson/${arcano.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full group relative transition-all duration-500 ${
                    side === "left" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                      isCurrent
                        ? "card-mystic-active hover:scale-[1.02] cursor-pointer"
                        : isCompleted
                        ? "bg-card/60 border border-primary/12 cursor-pointer hover:bg-card/80 hover:border-primary/20"
                        : "bg-muted/20 border border-border/30 cursor-not-allowed"
                    }`}
                    style={isCurrent ? { animation: "glow-breathe 5s ease-in-out infinite" } : undefined}
                  >
                    {/* Inner glow for current */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.03] pointer-events-none" />
                    )}

                    <div className="relative z-10 p-5 md:p-6">
                      {/* Numeral + symbol */}
                      <div className={`flex items-center gap-2 mb-2 ${side === "left" ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] font-heading tracking-[0.4em] uppercase ${
                          isCurrent ? "text-primary/80" : isCompleted ? "text-primary/40" : "text-muted-foreground/25"
                        }`}>
                          {arcano.numeral}
                        </span>
                        <span className={`text-sm ${
                          isCurrent ? "text-primary/60" : isCompleted ? "text-primary/25" : "text-muted-foreground/15"
                        }`}>
                          {symbol}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-heading tracking-wide leading-tight mb-1.5 transition-all duration-500 ${
                        isCurrent
                          ? "text-lg md:text-xl text-gradient-gold-warm"
                          : isCompleted
                          ? "text-base text-foreground/70"
                          : "text-sm text-muted-foreground/30"
                      }`}>
                        {arcano.name}
                      </h3>

                      {/* Subtitle */}
                      <p className={`font-accent italic leading-relaxed ${
                        isCurrent
                          ? "text-sm text-foreground/55"
                          : isCompleted
                          ? "text-xs text-foreground/40"
                          : "text-xs text-muted-foreground/15"
                      }`}>
                        {arcano.subtitle}
                      </p>

                      {/* Completed */}
                      {isCompleted && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <Check className="w-3 h-3 text-primary/50" />
                          <span className="text-[9px] tracking-[0.2em] uppercase text-primary/45 font-body">Completo</span>
                        </div>
                      )}

                      {/* Current */}
                      {isCurrent && (
                        <div className={`flex items-center gap-2 mt-3.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                          <span className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-heading"
                            style={{ animation: "pulse-gold 2.5s ease-in-out infinite" }}>
                            Iniciar
                          </span>
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
                    )}
                  </div>
                </button>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-2.5 rounded-full border border-primary/25"
                    style={{ animation: "glow-breathe 4s ease-in-out infinite" }}
                  />
                )}
                <div
                  className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCurrent
                      ? "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/8"
                      : isCompleted
                      ? "border-primary/25 bg-primary/8"
                      : "border-border/60 bg-muted/40"
                  }`}
                  style={isCurrent ? {
                    boxShadow: "0 0 25px hsl(40 60% 55% / 0.2), 0 0 60px hsl(40 60% 55% / 0.08)",
                    animation: "glow-breathe 4s ease-in-out infinite",
                  } : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary/60" />
                  ) : isUnlocked ? (
                    <span className="text-base text-primary/80" style={{ lineHeight: 1 }}>{symbol}</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/25" />
                  )}
                </div>
              </div>

              {/* Connector line */}
              <div className={`absolute top-1/2 -translate-y-px h-px ${
                side === "left"
                  ? "right-1/2 left-auto mr-[24px] md:mr-[25px]"
                  : "left-1/2 ml-[24px] md:ml-[25px]"
              }`}
                style={{ width: "calc(50% - 60px)" }}
              >
                <div className={`w-full h-px ${
                  isCurrent
                    ? "bg-primary/25"
                    : isCompleted
                    ? "bg-primary/12"
                    : "bg-border/30"
                }`} />
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          );
        })}
      </div>

      {/* Decorative bottom */}
      <div className="flex flex-col items-center mt-8 opacity-40">
        <Sparkles className="w-3.5 h-3.5 text-primary/50" />
        <div className="w-px h-6 bg-gradient-to-t from-transparent to-primary/30" />
      </div>
    </div>
  );
}
