import { useState } from "react";
import type { QuizQuestion } from "@/lib/content";
import { Check, X, ArrowRight, Trophy, RotateCcw, Sparkles } from "lucide-react";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  /** Called once per answered question — fire-and-forget telemetry hook. */
  onAnswer?: (questionIndex: number, selectedIndex: number, isCorrect: boolean) => void;
}

export function QuizSection({ questions, onComplete, onAnswer }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState<{ question: QuizQuestion; selected: number }[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const current = questions[currentIndex];
  const isTrueFalse = current?.type === "true-false";

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    const isCorrect = optionIndex === current.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setMistakes((m) => [...m, { question: current, selected: optionIndex }]);
    }
    onAnswer?.(currentIndex, optionIndex, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === current.correctIndex ? 1 : 0), questions.length);
    }
  };

  const handleReview = () => {
    setReviewMode(true);
    setReviewIndex(0);
  };

  // Review mode
  if (reviewMode && mistakes.length > 0) {
    const item = mistakes[reviewIndex];
    return (
      <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
            Revisão — {reviewIndex + 1} de {mistakes.length}
          </span>
          <button
            onClick={() => setReviewMode(false)}
            className="text-xs font-heading tracking-wider"
            style={{ color: "hsl(230 10% 45%)" }}
          >
            Fechar revisão
          </button>
        </div>

        <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.9)", border: "1px solid hsl(36 45% 58% / 0.15)" }}>
          <p className="font-accent text-lg mb-5" style={{ color: "hsl(230 25% 15%)" }}>{item.question.question}</p>
          <div className="space-y-3">
            {item.question.options.map((option, i) => {
              const isCorrect = i === item.question.correctIndex;
              const isWrong = i === item.selected;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-xl flex items-center gap-3 transition-all"
                  style={{
                    background: isCorrect ? "hsl(120 30% 92%)" : isWrong ? "hsl(0 40% 94%)" : "hsl(38 25% 93% / 0.6)",
                    border: `1.5px solid ${isCorrect ? "hsl(120 35% 60% / 0.4)" : isWrong ? "hsl(0 50% 65% / 0.4)" : "transparent"}`,
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{
                      border: `1.5px solid ${isCorrect ? "hsl(120 35% 50%)" : isWrong ? "hsl(0 50% 55%)" : "hsl(230 10% 70%)"}`,
                      color: isCorrect ? "hsl(120 35% 40%)" : isWrong ? "hsl(0 50% 45%)" : "hsl(230 10% 50%)",
                    }}
                  >
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : isWrong ? <X className="w-3.5 h-3.5" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm" style={{ color: "hsl(230 20% 25%)" }}>{option}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: "hsl(36 45% 58% / 0.08)", border: "1px solid hsl(36 45% 58% / 0.12)" }}>
            <p className="text-sm font-accent italic" style={{ color: "hsl(230 20% 30% / 0.85)" }}>{item.question.explanation}</p>
          </div>
        </div>

        <div className="flex justify-center">
          {reviewIndex < mistakes.length - 1 ? (
            <button
              onClick={() => setReviewIndex((i) => i + 1)}
              className="px-8 py-3 rounded-full font-heading text-sm tracking-wider flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)" }}
            >
              Próximo erro <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setReviewMode(false)}
              className="px-8 py-3 rounded-full font-heading text-sm tracking-wider flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)" }}
            >
              Concluir revisão <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Finished
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    return (
      <div className="text-center py-8 space-y-5" style={{ animation: "fade-up 0.6s ease-out" }}>
        <div
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
          style={{
            background: isPerfect
              ? "linear-gradient(135deg, hsl(36 45% 58% / 0.2), hsl(42 70% 80% / 0.15))"
              : "hsl(38 25% 93% / 0.8)",
            border: `2px solid ${isPerfect ? "hsl(36 45% 58% / 0.4)" : "hsl(230 10% 75% / 0.3)"}`,
            animation: isPerfect ? "glow-breathe 3s ease-in-out infinite" : "none",
          }}
        >
          <Trophy className="w-10 h-10" style={{ color: isPerfect ? "hsl(36 45% 58%)" : "hsl(230 10% 50%)" }} />
        </div>

        <div>
          <h3 className="font-heading text-2xl mb-1" style={{ color: "hsl(36 40% 42%)" }}>
            {isPerfect ? "Perfeito!" : percentage >= 70 ? "Muito Bem!" : "Continue Praticando"}
          </h3>
          <p className="text-lg font-accent" style={{ color: "hsl(230 20% 30%)" }}>
            {score}/{questions.length} corretas ({percentage}%)
          </p>
        </div>

        <p className="text-sm" style={{ color: "hsl(36 40% 42%)" }}>
          +{score * 10} XP ganhos
        </p>

        {isPerfect && (
          <p className="text-sm font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)", animation: "glow-breathe 3s ease-in-out infinite" }}>
            ⭐ Badge de Mestre desbloqueado!
          </p>
        )}

        <div className="flex flex-col items-center gap-3 pt-2">
          {mistakes.length > 0 && (
            <button
              onClick={handleReview}
              className="px-8 py-3 rounded-full font-heading text-sm tracking-wider flex items-center gap-2 transition-all hover:scale-105"
              style={{
                background: "transparent",
                border: "1.5px solid hsl(36 45% 58% / 0.4)",
                color: "hsl(36 40% 42%)",
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Revisar {mistakes.length} {mistakes.length === 1 ? "erro" : "erros"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active quiz
  return (
    <div className="space-y-6">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i < currentIndex ? "hsl(36 45% 58%)" : i === currentIndex ? "hsl(36 45% 58% / 0.5)" : "hsl(36 25% 82% / 0.5)",
            }}
          />
        ))}
      </div>

      <div style={{ animation: "fade-up 0.4s ease-out" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-heading tracking-[0.15em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
            {isTrueFalse ? "Verdadeiro ou Falso" : "Múltipla Escolha"}
          </span>
          <span className="text-xs" style={{ color: "hsl(230 10% 55%)" }}>
            — {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <h4 className="font-accent text-lg leading-relaxed mb-6" style={{ color: "hsl(230 25% 15%)" }}>
          {current.question}
        </h4>

        <div className={`grid gap-3 ${isTrueFalse ? "grid-cols-2" : "grid-cols-1"}`}>
          {current.options.map((option, i) => {
            let bg = "hsl(38 25% 93% / 0.7)";
            let border = "transparent";
            let textColor = "hsl(230 20% 25%)";
            let iconColor = "hsl(230 10% 55%)";

            if (isAnswered) {
              if (i === current.correctIndex) {
                bg = "hsl(120 30% 92%)";
                border = "hsl(120 35% 60% / 0.4)";
                textColor = "hsl(120 30% 25%)";
                iconColor = "hsl(120 35% 40%)";
              } else if (i === selectedOption) {
                bg = "hsl(0 40% 94%)";
                border = "hsl(0 50% 65% / 0.4)";
                textColor = "hsl(0 40% 30%)";
                iconColor = "hsl(0 50% 45%)";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                  !isAnswered ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer" : ""
                } ${isTrueFalse ? "justify-center text-center" : ""}`}
                style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  boxShadow: isAnswered && (i === current.correctIndex || i === selectedOption) ? "0 2px 12px hsl(0 0% 0% / 0.04)" : "none",
                }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading shrink-0"
                  style={{ border: `1.5px solid ${iconColor}`, color: iconColor }}
                >
                  {isAnswered && i === current.correctIndex ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isAnswered && i === selectedOption ? (
                    <X className="w-3.5 h-3.5" />
                  ) : isTrueFalse ? (
                    i === 0 ? "V" : "F"
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="text-sm" style={{ color: textColor }}>{option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className="mt-5 p-4 rounded-xl"
            style={{
              background: "hsl(36 45% 58% / 0.06)",
              border: "1px solid hsl(36 45% 58% / 0.12)",
              animation: "fade-up 0.3s ease-out",
            }}
          >
            <p className="text-sm font-accent italic leading-relaxed" style={{ color: "hsl(230 20% 30% / 0.85)" }}>
              {current.explanation}
            </p>
          </div>
        )}

        {isAnswered && (
          <div className="mt-5 flex justify-end" style={{ animation: "fade-up 0.3s ease-out" }}>
            <button
              onClick={handleNext}
              className="px-7 py-2.5 rounded-full font-heading text-sm tracking-wider flex items-center gap-2 transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 4px 16px hsl(36 45% 58% / 0.2)",
              }}
            >
              {currentIndex < questions.length - 1 ? "Próxima" : "Ver Resultado"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
