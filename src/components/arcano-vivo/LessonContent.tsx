import { useState } from "react";
import { BookOpen, Layers, Eye, ChevronDown } from "lucide-react";
import { type LessonSection } from "@/data/fool-lesson-content";

interface LessonContentProps {
  sections: LessonSection[];
  essence: string;
  light: string;
  shadow: string;
  onComplete: () => void;
  onGoDeepDive: () => void;
  onGoExercise: () => void;
  onSkipToQuiz: () => void;
}

/**
 * Phase 2: Pedagogical content in progressive steps
 * Mobile-first card-based layout with expandable sections
 */
export function LessonContent({
  sections, essence, light, shadow,
  onComplete, onGoDeepDive, onGoExercise, onSkipToQuiz,
}: LessonContentProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0=essence, 1=light, 2=shadow, 3=sections

  const steps = [
    { id: "essence", title: "Essência", icon: "✦", content: essence },
    { id: "light", title: "Luz", icon: "☀", content: light },
    { id: "shadow", title: "Sombra", icon: "☾", content: shadow },
  ];

  return (
    <div className="space-y-6 pb-8" style={{ animation: "fade-up 0.5s ease-out" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
          <span className="text-[10px] font-heading tracking-[0.25em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
            Lição do Arcano
          </span>
        </div>
        <button onClick={onSkipToQuiz} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
          Ir ao Quiz →
        </button>
      </div>

      {/* Progressive steps */}
      <div className="space-y-3">
        {steps.map((s, idx) => {
          const isActive = idx <= step;
          const isCurrent = idx === step;
          return (
            <div
              key={s.id}
              className={`rounded-xl overflow-hidden transition-all duration-500 ${isActive ? "opacity-100" : "opacity-30 pointer-events-none"}`}
              style={{
                background: isCurrent ? "hsl(38 30% 95% / 0.9)" : "hsl(38 30% 95% / 0.6)",
                border: `1px solid ${isCurrent ? "hsl(36 45% 58% / 0.25)" : "hsl(36 25% 82% / 0.4)"}`,
                boxShadow: isCurrent ? "0 4px 20px hsl(36 45% 58% / 0.06)" : "none",
                animation: isActive ? `fade-up 0.4s ease-out ${idx * 0.1}s both` : undefined,
              }}
            >
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-base w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: "hsl(36 45% 58% / 0.08)",
                      border: "1px solid hsl(36 45% 58% / 0.2)",
                    }}
                  >{s.icon}</span>
                  <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{s.content}</p>
              </div>
              {isCurrent && idx < 2 && (
                <div className="px-5 pb-4">
                  <button
                    onClick={() => setStep(idx + 1)}
                    className="text-[10px] font-heading tracking-wider px-4 py-1.5 rounded-full transition-all"
                    style={{
                      background: "hsl(36 45% 58% / 0.1)",
                      border: "1px solid hsl(36 45% 58% / 0.2)",
                      color: "hsl(36 40% 42%)",
                    }}
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable lesson sections */}
      {step >= 2 && sections.length > 0 && (
        <div className="space-y-2 pt-2" style={{ animation: "fade-up 0.4s ease-out" }}>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3.5 h-3.5" style={{ color: "hsl(36 40% 42%)" }} />
            <span className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(36 40% 42% / 0.7)" }}>
              Conteúdo detalhado
            </span>
          </div>
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="rounded-xl overflow-hidden"
                style={{
                  background: isOpen ? "hsl(38 30% 95% / 0.8)" : "hsl(38 30% 95% / 0.5)",
                  border: `1px solid ${isOpen ? "hsl(36 45% 58% / 0.2)" : "hsl(36 25% 82% / 0.3)"}`,
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="font-heading text-xs tracking-wide flex-1" style={{ color: "hsl(230 25% 15%)" }}>{section.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "hsl(230 10% 50%)" }} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4" style={{ animation: "fade-up 0.3s ease-out" }}>
                    <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.15), transparent)" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{section.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      {step >= 2 && (
        <div className="flex flex-col items-center gap-3 pt-4" style={{ animation: "fade-up 0.4s ease-out" }}>
          <button onClick={onComplete}
            className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
              color: "hsl(36 33% 97%)",
              boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
            }}
          >
            Concluir Lição ✦
          </button>
          <div className="flex gap-4">
            <button onClick={onGoDeepDive} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
              🔮 Aprofundar
            </button>
            <button onClick={onGoExercise} className="text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 10% 45%)" }}>
              ✍️ Exercício
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
