import { useState, useEffect, useCallback, useRef } from "react";
import type { ArcanoData } from "@/lib/content";
import foolCardImage from "@/assets/the-fool-card.jpg";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

interface ArcanoGuideProps {
  arcano: ArcanoData;
  onComplete: () => void;
}

interface NarrationStep {
  id: string;
  label: string;
  icon: string;
  text: string;
  accentColor?: string;
}

function useTypewriter(text: string, speed = 22, active = true) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (!active || done) return;
    if (index >= text.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [index, text, speed, active, done]);

  const skip = useCallback(() => {
    setIndex(text.length);
    setDone(true);
  }, [text]);

  return { displayed: text.substring(0, index), done, skip };
}

export function ArcanoGuide({ arcano, onComplete }: ArcanoGuideProps) {
  const [phase, setPhase] = useState<"intro" | "teaching">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const steps: NarrationStep[] = [
    {
      id: "essence",
      label: "Essência",
      icon: "✦",
      text: arcano.layers.main.essence,
    },
    {
      id: "light",
      label: "Luz",
      icon: "☀",
      text: arcano.layers.main.light,
    },
    {
      id: "shadow",
      label: "Sombra",
      icon: "☾",
      text: arcano.layers.main.shadow,
      accentColor: "secondary",
    },
    {
      id: "application",
      label: "Aplicação Prática",
      icon: "◈",
      text: arcano.layers.main.practicalApplication,
    },
  ];

  const currentStep = phase === "intro" ? null : steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Intro typewriter
  const intro = useTypewriter(arcano.firstPersonIntro, 20, phase === "intro");

  // Teaching typewriter
  const teaching = useTypewriter(
    currentStep?.text || "",
    18,
    phase === "teaching"
  );

  // Intro card entrance delay
  useEffect(() => {
    const t = setTimeout(() => setIntroReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleIntroComplete = () => {
    setPhase("teaching");
    setStepIndex(0);
  };

  const handleNext = () => {
    if (!teaching.done) {
      teaching.skip();
      return;
    }
    if (isLastStep) {
      onComplete();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSkipIntro = () => {
    intro.skip();
  };

  // Scroll to content on step change
  useEffect(() => {
    if (phase === "teaching" && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stepIndex, phase]);

  const accentClass = currentStep?.accentColor === "secondary" ? "text-secondary" : "text-primary";
  const borderAccent = currentStep?.accentColor === "secondary" ? "border-secondary/30" : "border-gold";

  return (
    <div className="relative min-h-[80vh] flex flex-col">
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              left: `${15 + i * 14}%`,
              top: `${10 + (i * 17) % 80}%`,
              animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Card avatar — always visible, sidebar on desktop, top on mobile */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8 py-8">
        {/* Card column */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:sticky lg:top-24 shrink-0">
          <div
            className={`relative w-40 h-56 md:w-48 md:h-64 rounded-2xl border-2 border-primary/30 overflow-hidden transition-all duration-1000 ${
              introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${phase === "teaching" ? "animate-float" : ""}`}
            style={{
              boxShadow: "0 0 40px hsl(43 80% 55% / 0.15), 0 0 80px hsl(43 80% 55% / 0.05)",
            }}
          >
            <img
              src={foolCardImage}
              alt={arcano.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <h2 className="font-heading text-sm text-primary drop-shadow-lg tracking-wider">
                {arcano.numeral} · {arcano.name}
              </h2>
            </div>
          </div>

          {/* Step indicators (teaching phase) */}
          {phase === "teaching" && (
            <div className="flex gap-2 mt-4">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (i <= stepIndex) setStepIndex(i);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                    i === stepIndex
                      ? "bg-primary/20 border border-primary text-primary scale-110"
                      : i < stepIndex
                      ? "bg-primary/10 border border-primary/30 text-primary/60"
                      : "bg-muted border border-border text-muted-foreground/40"
                  }`}
                  title={s.label}
                  disabled={i > stepIndex}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content column */}
        <div ref={contentRef} className="flex-1 min-w-0 w-full">
          {/* INTRO PHASE */}
          {phase === "intro" && (
            <div
              className={`transition-all duration-700 ${
                introReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {/* Speech bubble */}
              <div className="card-mystic p-6 md:p-8 relative">
                {/* Quote mark */}
                <span className="absolute -top-3 left-6 text-4xl text-primary/30 font-accent leading-none">
                  "
                </span>
                <p className="font-accent text-base md:text-lg text-foreground/90 italic leading-relaxed pt-2">
                  {intro.displayed}
                  {!intro.done && (
                    <span className="inline-block w-0.5 h-5 bg-primary/60 ml-1 animate-pulse-gold align-middle" />
                  )}
                </p>
                {!intro.done && (
                  <span className="absolute -bottom-3 right-6 text-4xl text-primary/30 font-accent leading-none opacity-30">
                    "
                  </span>
                )}
                {intro.done && (
                  <span className="absolute -bottom-3 right-6 text-4xl text-primary/30 font-accent leading-none">
                    "
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-3 mt-8">
                {intro.done ? (
                  <button
                    onClick={handleIntroComplete}
                    className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
                  >
                    Começar a Lição
                  </button>
                ) : (
                  <button
                    onClick={handleSkipIntro}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pular introdução
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TEACHING PHASE */}
          {phase === "teaching" && currentStep && (
            <div key={currentStep.id} className="animate-fade-up">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-2xl ${accentClass}`}>{currentStep.icon}</span>
                <h3 className={`font-heading text-xl tracking-wide ${
                  currentStep.accentColor === "secondary" ? "text-secondary" : "text-gradient-gold"
                }`}>
                  {currentStep.label}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                <span className="text-xs text-muted-foreground font-heading">
                  {stepIndex + 1}/{steps.length}
                </span>
              </div>

              {/* Keywords (only on first step) */}
              {stepIndex === 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {arcano.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Narrated content */}
              <div className={`card-mystic p-6 md:p-8 ${borderAccent}`}>
                <p className={`${
                  stepIndex === 0 ? "font-accent italic" : ""
                } text-foreground/85 leading-relaxed text-base md:text-lg`}>
                  {stepIndex === 0 ? '"' : ''}
                  {teaching.displayed}
                  {!teaching.done && (
                    <span className="inline-block w-0.5 h-5 bg-primary/60 ml-1 animate-pulse-gold align-middle" />
                  )}
                  {stepIndex === 0 ? '"' : ''}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {stepIndex > 0 ? (
                  <button
                    onClick={() => setStepIndex((i) => i - 1)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-heading tracking-wider"
                  >
                    ← Anterior
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className={`px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 ${
                    teaching.done
                      ? "bg-primary text-primary-foreground hover:glow-gold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {!teaching.done
                    ? "Mostrar tudo"
                    : isLastStep
                    ? "Concluir Lição ✦"
                    : "Próximo →"}
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full transition-all duration-500"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
