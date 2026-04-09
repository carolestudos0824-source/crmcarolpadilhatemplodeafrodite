import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { THE_FOOL } from "@/data/tarot-data";
import { useProgress } from "@/hooks/use-progress";
import { CardPresentation } from "@/components/CardPresentation";
import { QuizSection } from "@/components/QuizSection";
import { ArrowLeft, BookOpen, Eye, Moon, Sun, Lightbulb, Scroll, Dumbbell } from "lucide-react";

type LessonPhase = "presentation" | "content" | "quiz";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const [phase, setPhase] = useState<LessonPhase>("presentation");
  const [showDeepDive, setShowDeepDive] = useState(false);

  // For now, only The Fool is available
  const arcano = THE_FOOL;

  const handlePresentationComplete = () => {
    setPhase("content");
    addXP(10);
    earnBadge("first-step");
  };

  const handleQuizComplete = (score: number, total: number) => {
    addXP(score * 10);
    completeQuiz(`quiz-arcano-${arcano.id}`);
    completeLesson(`arcano-${arcano.id}`);
    earnBadge("fool-complete");
    if (score === total) earnBadge("quiz-master");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-mystic-glow pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-gold">
        <div className="container max-w-3xl py-3 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs text-primary tracking-wider">{arcano.numeral}</span>
            <span className="font-heading text-sm text-foreground">{arcano.name}</span>
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            {(["presentation", "content", "quiz"] as LessonPhase[]).map((p) => (
              <div
                key={p}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  phase === p ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-6">
        {/* Presentation Phase */}
        {phase === "presentation" && (
          <CardPresentation arcano={arcano} onComplete={handlePresentationComplete} />
        )}

        {/* Content Phase */}
        {phase === "content" && (
          <div className="space-y-8 animate-fade-up">
            {/* Keywords */}
            <div className="flex flex-wrap gap-2 justify-center">
              {arcano.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {kw}
                </span>
              ))}
            </div>

            {/* Essence */}
            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Essência</h3>
              </div>
              <p className="font-accent text-foreground/85 leading-relaxed italic">"{arcano.essence}"</p>
            </section>

            {/* Light */}
            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Luz</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.light}</p>
            </section>

            {/* Shadow */}
            <section className="card-mystic p-6 border-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-secondary" />
                <h3 className="font-heading text-lg text-secondary">Sombra</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.shadow}</p>
            </section>

            {/* Practical Application */}
            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Aplicação Prática</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.practicalApplication}</p>
            </section>

            {/* Deep Dive Toggle */}
            <div>
              <button
                onClick={() => setShowDeepDive(!showDeepDive)}
                className="w-full card-mystic p-4 flex items-center gap-3 hover:glow-gold transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-heading text-sm text-foreground">Aprofundamento</span>
                <span className="text-xs text-muted-foreground ml-auto">{showDeepDive ? "Recolher" : "Expandir"}</span>
              </button>

              {showDeepDive && (
                <div className="mt-4 space-y-6 animate-fade-up">
                  <section className="card-mystic p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Scroll className="w-5 h-5 text-primary" />
                      <h4 className="font-heading text-sm text-primary">Texto Aprofundado</h4>
                    </div>
                    <p className="text-foreground/75 leading-relaxed text-sm">{arcano.deepDive.text}</p>
                  </section>

                  <section className="card-mystic p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Dumbbell className="w-5 h-5 text-primary" />
                      <h4 className="font-heading text-sm text-primary">Exercício</h4>
                    </div>
                    <p className="text-foreground/75 leading-relaxed text-sm font-accent italic">"{arcano.deepDive.exercise}"</p>
                  </section>
                </div>
              )}
            </div>

            {/* Go to quiz */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPhase("quiz")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ir para o Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Phase */}
        {phase === "quiz" && (
          <div className="animate-fade-up">
            <h2 className="font-heading text-2xl text-gradient-gold text-center mb-8">Quiz de Fixação</h2>
            <div className="card-mystic p-6">
              <QuizSection questions={arcano.quiz} onComplete={handleQuizComplete} />
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Voltar ao mapa
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
