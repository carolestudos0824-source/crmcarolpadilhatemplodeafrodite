import { useState, useEffect } from "react";
import { ArcanoData } from "@/data/tarot-data";

interface CardPresentationProps {
  arcano: ArcanoData;
  onComplete: () => void;
}

export function CardPresentation({ arcano, onComplete }: CardPresentationProps) {
  const [phase, setPhase] = useState<"reveal" | "speaking" | "done">("reveal");
  const [textIndex, setTextIndex] = useState(0);
  const fullText = arcano.firstPersonIntro;

  useEffect(() => {
    const timer = setTimeout(() => setPhase("speaking"), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "speaking") return;
    if (textIndex < fullText.length) {
      const timer = setTimeout(() => setTextIndex((i) => i + 1), 25);
      return () => clearTimeout(timer);
    } else {
      setPhase("done");
    }
  }, [phase, textIndex, fullText]);

  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center py-12">
      {/* Background glow */}
      <div className="absolute inset-0 bg-mystic-glow pointer-events-none" />

      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-primary/30 animate-stars text-2xl">✦</div>
      <div className="absolute top-20 right-16 text-primary/20 animate-stars text-lg" style={{ animationDelay: "1s" }}>✧</div>
      <div className="absolute bottom-20 left-20 text-primary/25 animate-stars text-xl" style={{ animationDelay: "2s" }}>✦</div>

      {/* Card */}
      <div
        className={`relative w-48 h-72 rounded-2xl border-2 border-primary/40 glow-gold flex flex-col items-center justify-center transition-all duration-1000 ${
          phase === "reveal" ? "animate-card-reveal" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, hsl(240 8% 10%), hsl(240 8% 14%))",
        }}
      >
        <div className="absolute inset-2 rounded-xl border border-primary/20" />
        <span className="text-5xl font-heading text-gradient-gold">{arcano.numeral}</span>
        <h2 className="font-heading text-lg text-primary mt-3">{arcano.name}</h2>
        <p className="text-xs text-muted-foreground mt-1 font-accent italic">{arcano.subtitle}</p>
      </div>

      {/* Speech text */}
      {phase !== "reveal" && (
        <div className="mt-8 max-w-lg mx-auto">
          <div className="card-mystic p-6">
            <p className="font-accent text-lg text-foreground/90 italic leading-relaxed">
              "{fullText.substring(0, textIndex)}
              {phase === "speaking" && <span className="animate-pulse-gold">|</span>}"
            </p>
          </div>
          {phase === "done" && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onComplete}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Iniciar Lição
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
