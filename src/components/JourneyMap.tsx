import { useNavigate } from "react-router-dom";
import { Lock, Check, Sparkles } from "lucide-react";
import { ARCANOS_MAIORES } from "@/data/tarot-data";
import { UserProgress } from "@/data/tarot-data";

interface JourneyMapProps {
  progress: UserProgress;
}

// Arcano symbols for visual richness
const ARCANO_SYMBOLS: Record<number, string> = {
  0: "☽", 1: "✧", 2: "◈", 3: "❋", 4: "◆", 5: "✦", 6: "♡", 7: "⚡",
  8: "∞", 9: "☆", 10: "◎", 11: "⚖", 12: "△", 13: "✝", 14: "☾",
  15: "⛧", 16: "⌂", 17: "★", 18: "☽", 19: "☀", 20: "♱", 21: "◯",
};

export function JourneyMap({ progress }: JourneyMapProps) {
  const navigate = useNavigate();

  return (
    <div className="relative max-w-2xl mx-auto pb-20">
      {/* Decorative top element */}
      <div className="flex flex-col items-center mb-10 opacity-40">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-primary/30" />
        <Sparkles className="w-3 h-3 text-primary/50" />
      </div>

      {/* Central path with ornamental line */}
      <div className="absolute left-1/2 top-20 bottom-20 -translate-x-px w-px">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(to bottom, 
            hsl(40 55% 50% / 0.15) 0px, 
            hsl(40 55% 50% / 0.15) 4px, 
            transparent 4px, 
            transparent 12px)`,
        }} />
        {/* Ornamental dots along the path */}
        {ARCANOS_MAIORES.map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/10"
            style={{ top: `${(i / ARCANOS_MAIORES.length) * 100}%` }}
          />
        ))}
      </div>

      <div className="relative space-y-1">
        {ARCANOS_MAIORES.map((arcano, index) => {
          const isCompleted = progress.completedLessons.includes(`arcano-${arcano.id}`);
          const isUnlocked = arcano.unlocked || isCompleted || progress.completedLessons.includes(`arcano-${arcano.id - 1}`);
          const isCurrent = isUnlocked && !isCompleted;
          const side = index % 2 === 0 ? "left" : "right";
          const symbol = ARCANO_SYMBOLS[arcano.id] || "◇";

          return (
            <div
              key={arcano.id}
              className={`relative flex items-center py-2 ${side === "left" ? "flex-row" : "flex-row-reverse"}`}
              style={{
                animation: "fade-up 0.6s ease-out both",
                animationDelay: `${index * 70}ms`,
              }}
            >
              {/* Arcano Card */}
              <div className={`flex-1 ${side === "left" ? "pr-12 md:pr-16" : "pl-12 md:pl-16"}`}>
                <button
                  onClick={() => isUnlocked && navigate(`/lesson/${arcano.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full group relative transition-all duration-700 ${
                    side === "left" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
                      isCurrent
                        ? "bg-gradient-to-br from-card via-card to-primary/[0.03] border border-primary/20 hover:border-primary/35 hover:scale-[1.015] cursor-pointer"
                        : isCompleted
                        ? "bg-card/30 border border-primary/[0.06] cursor-pointer hover:bg-card/50 hover:border-primary/12"
                        : "bg-muted/10 border border-transparent cursor-not-allowed"
                    }`}
                    style={isCurrent ? { animation: "glow-breathe 5s ease-in-out infinite" } : undefined}
                  >
                    {/* Inner glow layer for current */}
                    {isCurrent && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.02] pointer-events-none" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
                      </>
                    )}

                    <div className="relative z-10 p-5 md:p-6">
                      {/* Top row: symbol + numeral */}
                      <div className={`flex items-center gap-2 mb-2.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] font-heading tracking-[0.4em] uppercase ${
                          isCurrent ? "text-primary/60" : isCompleted ? "text-primary/25" : "text-muted-foreground/15"
                        }`}>
                          {arcano.numeral}
                        </span>
                        <span className={`text-xs ${
                          isCurrent ? "text-primary/40" : isCompleted ? "text-primary/15" : "text-muted-foreground/10"
                        }`}>
                          {symbol}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-heading tracking-wide leading-tight mb-1 transition-all duration-500 ${
                        isCurrent
                          ? "text-base md:text-lg text-gradient-gold-warm"
                          : isCompleted
                          ? "text-sm md:text-base text-foreground/60"
                          : "text-sm text-muted-foreground/20"
                      }`}>
                        {arcano.name}
                      </h3>

                      {/* Subtitle */}
                      <p className={`font-accent italic leading-relaxed ${
                        isCurrent
                          ? "text-xs md:text-sm text-foreground/40"
                          : isCompleted
                          ? "text-xs text-muted-foreground/35"
                          : "text-xs text-muted-foreground/10"
                      }`}>
                        {arcano.subtitle}
                      </p>

                      {/* Completed indicator */}
                      {isCompleted && (
                        <div className={`flex items-center gap-1.5 mt-2.5 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="w-4 h-px bg-primary/20" />
                          <span className="text-[9px] tracking-[0.2em] uppercase text-primary/30 font-body">Completo</span>
                        </div>
                      )}

                      {/* Current indicator */}
                      {isCurrent && (
                        <div className={`flex items-center gap-2 mt-3 ${side === "left" ? "justify-end" : "justify-start"}`}>
                          <div className="w-5 h-px bg-gradient-to-r from-primary/40 to-transparent" />
                          <span className="text-[9px] tracking-[0.3em] uppercase text-primary/50 font-body animate-pulse-gold">
                            Iniciar
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom decorative line */}
                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
                    )}
                  </div>
                </button>
              </div>

              {/* Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                {/* Outer ring for current */}
                {isCurrent && (
                  <div
                    className="absolute inset-0 -m-2 rounded-full border border-primary/15"
                    style={{ animation: "glow-breathe 4s ease-in-out infinite" }}
                  />
                )}
                <div
                  className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center border transition-all duration-700 ${
                    isCurrent
                      ? "border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5"
                      : isCompleted
                      ? "border-primary/15 bg-primary/[0.04]"
                      : "border-border/50 bg-muted/30"
                  }`}
                  style={isCurrent ? {
                    boxShadow: "0 0 20px hsl(40 55% 50% / 0.12), 0 0 50px hsl(40 55% 50% / 0.05)",
                    animation: "glow-breathe 4s ease-in-out infinite",
                  } : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-primary/50" />
                  ) : isUnlocked ? (
                    <span className="text-sm text-primary/70" style={{ lineHeight: 1 }}>{symbol}</span>
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground/15" />
                  )}
                </div>
              </div>

              {/* Connector line from node to card */}
              <div className={`absolute top-1/2 -translate-y-px h-px ${
                side === "left"
                  ? "right-1/2 left-auto mr-[22px] md:mr-[23px]"
                  : "left-1/2 ml-[22px] md:ml-[23px]"
              }`}
                style={{
                  width: "calc(50% - 70px)",
                }}
              >
                <div className={`w-full h-px ${
                  isCurrent
                    ? "bg-gradient-to-r from-primary/20 to-primary/5"
                    : isCompleted
                    ? "bg-primary/8"
                    : "bg-border/20"
                }`}
                  style={side === "left" ? {
                    background: isCurrent
                      ? "linear-gradient(to left, hsl(40 55% 50% / 0.2), hsl(40 55% 50% / 0.05))"
                      : undefined,
                  } : undefined}
                />
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          );
        })}
      </div>

      {/* Decorative bottom element */}
      <div className="flex flex-col items-center mt-10 opacity-30">
        <Sparkles className="w-3 h-3 text-primary/40" />
        <div className="w-px h-8 bg-gradient-to-t from-transparent to-primary/20" />
      </div>
    </div>
  );
}
