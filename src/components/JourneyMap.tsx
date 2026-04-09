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
      <div className="flex flex-col items-center mb-6 opacity-55">
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, transparent, hsl(36 45% 50% / 0.55))" }} />
        <Sparkles className="w-4 h-4" style={{ color: "hsl(36 45% 50% / 0.65)" }} />
      </div>

      {/* Central path line */}
      <div className="absolute left-1/2 top-16 bottom-16 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            hsl(36 45% 50% / 0.45) 0px, 
            hsl(36 45% 50% / 0.45) 4px, 
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
                        ? "cursor-pointer group-hover:shadow-[0_4px_20px_hsl(36_45%_58%/0.12)]"
                        : "cursor-not-allowed"
                    }`}
                    style={isCurrent ? {
                      background: "linear-gradient(145deg, hsl(38 30% 94% / 0.90), hsl(36 33% 96% / 0.82))",
                      backdropFilter: "blur(16px)",
                      border: "1.5px solid hsl(340 42% 30% / 0.35)",
                      boxShadow: "0 8px 35px hsl(340 42% 30% / 0.12), 0 0 60px hsl(42 70% 80% / 0.08), inset 0 1px 0 hsl(36 45% 58% / 0.18)",
                      animation: "glow-breathe 5s ease-in-out infinite"
                    } : isCompleted ? {
                      background: "hsl(38 30% 95% / 0.72)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid hsl(36 45% 58% / 0.30)",
                      boxShadow: "0 2px 12px hsl(36 45% 58% / 0.08)"
                    } : {
                      background: "hsl(36 20% 90% / 0.40)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid hsl(36 25% 82% / 0.45)"
                    }}
                  >
                    {/* Inner gradient for current */}
                    {isCurrent && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: "linear-gradient(135deg, hsl(36 45% 58% / 0.08), transparent 60%, hsl(340 42% 30% / 0.05))"
                      }} />
                    )}

                    <div className="relative z-10 p-5 md:p-6">
                      {/* Corner ornaments for current */}
                      {isCurrent && (
                        <>
                          <div className="absolute top-2.5 left-2.5 w-4 h-4" style={{ borderTop: "1.5px solid hsl(36 45% 50% / 0.40)", borderLeft: "1.5px solid hsl(36 45% 50% / 0.40)" }} />
                          <div className="absolute top-2.5 right-2.5 w-4 h-4" style={{ borderTop: "1.5px solid hsl(36 45% 50% / 0.40)", borderRight: "1.5px solid hsl(36 45% 50% / 0.40)" }} />
                          <div className="absolute bottom-2.5 left-2.5 w-4 h-4" style={{ borderBottom: "1.5px solid hsl(36 45% 50% / 0.40)", borderLeft: "1.5px solid hsl(36 45% 50% / 0.40)" }} />
                          <div className="absolute bottom-2.5 right-2.5 w-4 h-4" style={{ borderBottom: "1.5px solid hsl(36 45% 50% / 0.40)", borderRight: "1.5px solid hsl(36 45% 50% / 0.40)" }} />
                        </>
                      )}

                      {/* Numeral + symbol */}
                      <div className={`flex items-center gap-2 mb-2 ${side === "left" ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] font-heading tracking-[0.4em] uppercase" style={{
                          color: isCurrent ? "hsl(340 42% 26%)" : isCompleted ? "hsl(36 45% 45% / 0.80)" : "hsl(230 10% 40% / 0.30)"
                        }}>
                          {arcano.numeral}
                        </span>
                        <span className="text-sm" style={{
                          color: isCurrent ? "hsl(340 42% 30% / 0.65)" : isCompleted ? "hsl(36 45% 50% / 0.50)" : "hsl(230 10% 40% / 0.18)"
                        }}>
                          {symbol}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-heading tracking-wide leading-tight mb-1.5 transition-all duration-500 ${
                        isCurrent
                          ? "text-lg md:text-xl"
                          : isCompleted
                          ? "text-base"
                          : "text-sm"
                      }`} style={isCurrent ? {
                        background: "linear-gradient(135deg, hsl(340 42% 24%), hsl(36 38% 32%), hsl(36 45% 48%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      } : isCompleted ? {
                        color: "hsl(230 25% 10% / 0.72)"
                      } : {
                        color: "hsl(230 10% 40% / 0.30)"
                      }}>
                        {arcano.name}
                      </h3>

                      {/* Subtitle */}
                      <p className={`font-accent italic leading-relaxed ${
                        isCurrent ? "text-sm" : "text-xs"
                      }`} style={{
                        color: isCurrent ? "hsl(230 25% 10% / 0.58)" : isCompleted ? "hsl(230 25% 10% / 0.45)" : "hsl(230 10% 40% / 0.18)"
                      }}>
                        {arcano.subtitle}
                      </p>

                      {/* Status indicators */}
                      {isCompleted && (
                        <div className={`flex items-center gap-1.5 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <Check className="w-3.5 h-3.5" style={{ color: "hsl(36 45% 45% / 0.80)" }} />
                          <span className="text-[9px] tracking-[0.2em] uppercase font-body" style={{
                            color: "hsl(36 45% 45% / 0.65)"
                          }}>Completo</span>
                        </div>
                      )}

                      {isCurrent && (
                        <div className={`flex items-center gap-2 mt-3.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="w-6 h-px" style={{
                            background: "linear-gradient(90deg, hsl(340 42% 30% / 0.60), transparent)"
                          }} />
                          <span className="text-[10px] tracking-[0.3em] uppercase font-heading"
                            style={{
                              color: "hsl(340 42% 26%)",
                              animation: "pulse-gold 2.5s ease-in-out infinite"
                            }}>
                            Iniciar
                          </span>
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                        background: "linear-gradient(90deg, transparent, hsl(340 42% 30% / 0.35), transparent)"
                      }} />
                    )}
                  </div>
                </button>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-3 rounded-full"
                    style={{
                      border: "1px solid hsl(340 42% 30% / 0.30)",
                      animation: "glow-breathe 4s ease-in-out infinite"
                    }}
                  />
                )}
                <div
                  className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500"
                  style={isCurrent ? {
                    border: "2px solid hsl(340 42% 30% / 0.50)",
                    background: "linear-gradient(135deg, hsl(38 30% 94%), hsl(36 33% 97%), hsl(36 45% 58% / 0.15))",
                    boxShadow: "0 0 25px hsl(340 42% 30% / 0.18), 0 0 50px hsl(36 45% 58% / 0.10)",
                    animation: "glow-breathe 4s ease-in-out infinite"
                  } : isCompleted ? {
                    border: "2px solid hsl(36 45% 50% / 0.40)",
                    background: "hsl(38 30% 95% / 0.88)"
                  } : {
                    border: "1.5px solid hsl(36 25% 78% / 0.50)",
                    background: "hsl(36 20% 90% / 0.55)"
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" style={{ color: "hsl(36 45% 42% / 0.85)" }} />
                  ) : isUnlocked ? (
                    <span className="text-base" style={{ color: "hsl(340 42% 26%)", lineHeight: 1 }}>{symbol}</span>
                  ) : (
                    <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 40% / 0.30)" }} />
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
                <div className="w-full h-px" style={{
                  background: isCurrent ? "hsl(340 42% 30% / 0.35)" : isCompleted ? "hsl(36 45% 50% / 0.30)" : "hsl(36 25% 82% / 0.40)"
                }} />
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          );
        })}
      </div>

      {/* Decorative bottom */}
      <div className="flex flex-col items-center mt-8 opacity-45">
        <Sparkles className="w-4 h-4" style={{ color: "hsl(36 45% 50% / 0.55)" }} />
        <div className="w-px h-6" style={{ background: "linear-gradient(to top, transparent, hsl(36 45% 50% / 0.45))" }} />
      </div>
    </div>
  );
}
