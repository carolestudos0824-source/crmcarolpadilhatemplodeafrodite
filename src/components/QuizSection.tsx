import { useState, useEffect } from "react";
import { QuizQuestion } from "@/data/tarot-data";
import { Check, X, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export function QuizSection({ questions, onComplete }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const current = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === current.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === current.correctIndex ? 0 : 0), questions.length);
    }
  };

  useEffect(() => {
    if (isFinished) {
      onComplete(score, questions.length);
    }
  }, [isFinished]);

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8 animate-fade-up">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${percentage === 100 ? "text-primary" : "text-muted-foreground"}`} />
        <h3 className="font-heading text-2xl text-gradient-gold mb-2">Quiz Completo!</h3>
        <p className="text-foreground/70 text-lg">
          {score}/{questions.length} corretas ({percentage}%)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          +{score * 10} XP ganhos
        </p>
        {percentage === 100 && (
          <p className="text-primary text-sm mt-3 animate-pulse-gold">⭐ Perfeito! Badge desbloqueado!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i < currentIndex ? "bg-primary" : i === currentIndex ? "bg-primary/50" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="animate-fade-up">
        <p className="text-xs text-muted-foreground mb-2">
          Pergunta {currentIndex + 1} de {questions.length}
        </p>
        <h4 className="font-accent text-xl text-foreground mb-6">{current.question}</h4>

        <div className="space-y-3">
          {current.options.map((option, i) => {
            let style = "bg-muted hover:bg-muted/80 border-transparent";
            if (isAnswered) {
              if (i === current.correctIndex) style = "bg-primary/10 border-primary text-primary";
              else if (i === selectedOption) style = "bg-secondary/10 border-secondary text-secondary";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${style}`}
              >
                <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium shrink-0">
                  {isAnswered && i === current.correctIndex ? (
                    <Check className="w-4 h-4" />
                  ) : isAnswered && i === selectedOption ? (
                    <X className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="text-sm">{option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-4 p-4 rounded-xl bg-mystic-elevated border border-gold animate-fade-up">
            <p className="text-sm text-foreground/80 font-accent italic">{current.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleNext} className="gap-2">
              {currentIndex < questions.length - 1 ? "Próxima" : "Finalizar"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
