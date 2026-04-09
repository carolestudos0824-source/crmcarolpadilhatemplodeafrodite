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
      <div className="flex flex-col items-center mb-6 opacity-50">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary/50" />
        <Sparkles className="w-4 h-4 text-primary/60" />
      </div>

      {/* Central path line */}
      <div className="absolute left-1/2 top-16 bottom-16 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            hsl(36 45% 58% / 0.4) 0px, 
            hsl(36 45% 58% / 0.4) 4px, 
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
                        ? "hover:scale-[1.02] cursor-pointer"
                        : isCompleted
                        ? "cursor-pointer hover:bg-card/80"
                        : "cursor-not-allowed"
                    }`}
                    style={isCurrent ? {
                      background: "linear-gradient(145deg, hsl(38 30% 95% / 0.85), hsl(36 33% 97% / 0.75))",
                      backdropFilter: "blur(12px)",
                      border: "1.5px solid hsl(340 42% 30% / 0.3)",
                      boxShadow: "0 8px 35px hsl(340 42% 30% / 0.1), 0 0 60px hsl(42 70% 80% / 0.06), inset 0 1px 0 hsl(36 45% 58% / 0.15)",
                      animation: "glow-breathe 5s ease-in-out infinite"
                    } : isCompleted ? {
                      background: "hsl(38 30% 95% / 0.65)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid hsl(36 45% 58% / 0.25)",
                      boxShadow: "0 2px 12px hsl(36 45% 58% / 0.06)"
                    } : {
                      background: "hsl(36 20% 90% / 0.35)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid hsl(36 25% 82% / 0.4)"
                    }}
                  >
                    {/* Inner gradient for current */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04] pointer-events-none" />
                    )}

                    <div className="relative z-10 p-5 md:p-6">
                      {/* Corner ornaments for current */}
                      {isCurrent && (
                        <>
                          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-primary/35" />
                          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-primary/35" />
                          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-primary/35" />
                          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-primary/35" />
                        </>
                      )}

                      {/* Numeral + symbol */}
                      <div className={`flex items-center gap-2 mb-2 ${side === "left" ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] font-heading tracking-[0.4em] uppercase ${
                          isCurrent ? "text-secondary" : isCompleted ? "text-primary/70" : "text-muted-foreground/35"
                        }`}>
                          {arcano.numeral}
                        </span>
                        <span className={`text-sm ${
                          isCurrent ? "text-secondary/60" : isCompleted ? "text-primary/40" : "text-muted-foreground/20"
                        }`}>
                          {symbol}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-heading tracking-wide leading-tight mb-1.5 transition-all duration-500 ${
                        isCurrent
                          ? "text-lg md:text-xl"
                          : isCompleted
                          ? "text-base text-foreground/75"
                          : "text-sm text-muted-foreground/35"
                      }`} style={isCurrent ? {
                        background: "linear-gradient(135deg, hsl(340 42% 28%), hsl(36 40% 38%), hsl(36 45% 55%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      } : undefined}>
                        {arcano.name}
                      </h3>

                      {/* Subtitle */}
                      <p className={`font-accent italic leading-relaxed ${
                        isCurrent
                          ? "text-sm text-foreground/60"
                          : isCompleted
                          ? "text-xs text-foreground/45"
                          : "text-xs text-muted-foreground/20"
                      }`}>
                        {arcano.subtitle}
                      </p>

                      {/* Status indicators */}
                      {isCompleted && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <Check className="w-3.5 h-3.5 text-primary/70" />
                          <span className="text-[9px] tracking-[0.2em] uppercase text-primary/60 font-body">Completo</span>
                        </div>
                      )}

                      {isCurrent && (
                        <div className={`flex items-center gap-2 mt-3.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="w-6 h-px bg-gradient-to-r from-secondary/60 to-transparent" />
                          <span className="text-[10px] tracking-[0.3em] uppercase text-secondary font-heading"
                            style={{ animation: "pulse-gold 2.5s ease-in-out infinite" }}>
                            Iniciar
                          </span>
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                    )}
                  </div>
                </button>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-3 rounded-full border border-secondary/25"
                    style={{ animation: "glow-breathe 4s ease-in-out infinite" }}
                  />
                )}
                <div
                  className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500"
                  style={isCurrent ? {
                    border: "2px solid hsl(340 42% 30% / 0.4)",
                    background: "linear-gradient(135deg, hsl(38 30% 95%), hsl(36 33% 97%), hsl(36 45% 58% / 0.12))",
                    boxShadow: "0 0 25px hsl(340 42% 30% / 0.15), 0 0 50px hsl(36 45% 58% / 0.08)",
                    animation: "glow-breathe 4s ease-in-out infinite"
                  } : isCompleted ? {
                    border: "2px solid hsl(36 45% 58% / 0.35)",
                    background: "hsl(38 30% 95% / 0.85)"
                  } : {
                    border: "1px solid hsl(36 25% 82% / 0.5)",
                    background: "hsl(36 20% 90% / 0.5)"
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary/80" />
                  ) : isUnlocked ? (
                    <span className="text-base text-secondary" style={{ lineHeight: 1 }}>{symbol}</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/35" />
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
                    ? "bg-secondary/30"
                    : isCompleted
                    ? "bg-primary/25"
                    : "bg-border/40"
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
        <Sparkles className="w-4 h-4 text-primary/50" />
        <div className="w-px h-6 bg-gradient-to-t from-transparent to-primary/40" />
      </div>
    </div>
  );
}
