import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { THE_FOOL } from "@/data/tarot-data";
import { useProgress } from "@/hooks/use-progress";
import { CardPresentation } from "@/components/CardPresentation";
import { QuizSection } from "@/components/QuizSection";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { LibrarySection } from "@/components/LibrarySection";
import { ArrowLeft, Eye, Moon, Sun, Lightbulb, Check } from "lucide-react";

type LessonPhase = "presentation" | "main" | "deepdive" | "extras" | "exercise" | "quiz";

const PHASE_LABELS: Record<LessonPhase, string> = {
  presentation: "Apresentação",
  main: "Lição Principal",
  deepdive: "Aprofundamento",
  extras: "Biblioteca",
  exercise: "Exercício",
  quiz: "Quiz",
};

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const [phase, setPhase] = useState<LessonPhase>("presentation");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const arcano = THE_FOOL;
  const phases: LessonPhase[] = ["presentation", "main", "deepdive", "extras", "exercise", "quiz"];
  const currentPhaseIndex = phases.indexOf(phase);

  const handlePresentationComplete = () => {
    setPhase("main");
    addXP(10);
    earnBadge("first-step");
  };

  const handleMainComplete = () => {
    addXP(15);
    completeLesson(`arcano-${arcano.id}`);
    // Skip to quiz — deepdive/extras/exercise are optional
    setPhase("quiz");
  };

  const handleExerciseComplete = () => {
    setExerciseCompleted(true);
    addXP(10);
  };

  const handleQuizComplete = (score: number, total: number) => {
    addXP(score * 10);
    completeQuiz(`quiz-arcano-${arcano.id}`);
    earnBadge("fool-complete");
    if (score === total) earnBadge("quiz-master");
  };

  const canSkipToQuiz = phase === "deepdive" || phase === "extras" || phase === "exercise";

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
          {/* Phase progress */}
          <div className="flex gap-1">
            {phases.map((p, i) => (
              <div
                key={p}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i <= currentPhaseIndex ? "bg-primary" : "bg-muted"
                }`}
                title={PHASE_LABELS[p]}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-6">
        {/* Phase label */}
        {phase !== "presentation" && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-heading text-muted-foreground tracking-widest uppercase">
              {PHASE_LABELS[phase]}
            </span>
            {canSkipToQuiz && (
              <button
                onClick={() => setPhase("quiz")}
                className="text-xs text-primary hover:text-primary/80 transition-colors font-heading tracking-wider"
              >
                Ir direto ao Quiz →
              </button>
            )}
          </div>
        )}

        {/* Presentation */}
        {phase === "presentation" && (
          <CardPresentation arcano={arcano} onComplete={handlePresentationComplete} />
        )}

        {/* Main Content — required */}
        {phase === "main" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {arcano.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {kw}
                </span>
              ))}
            </div>

            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Essência</h3>
              </div>
              <p className="font-accent text-foreground/85 leading-relaxed italic">"{arcano.layers.main.essence}"</p>
            </section>

            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Luz</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.layers.main.light}</p>
            </section>

            <section className="card-mystic p-6 border-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-secondary" />
                <h3 className="font-heading text-lg text-secondary">Sombra</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.layers.main.shadow}</p>
            </section>

            <section className="card-mystic p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg text-gradient-gold">Aplicação Prática</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">{arcano.layers.main.practicalApplication}</p>
            </section>

            {/* Navigation */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={handleMainComplete}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Concluir e Ir ao Quiz
              </button>
              <button
                onClick={() => setPhase("deepdive")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Quero aprofundar antes →
              </button>
            </div>
          </div>
        )}

        {/* Deep Dive — optional */}
        {phase === "deepdive" && (
          <div className="space-y-6">
            <DeepDiveSection {...arcano.layers.deepDive} />
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => setPhase("extras")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ver Materiais Extras
              </button>
              <button
                onClick={() => setPhase("exercise")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Ir ao Exercício →
              </button>
            </div>
          </div>
        )}

        {/* Extras / Library — optional */}
        {phase === "extras" && (
          <div className="space-y-6">
            <LibrarySection materials={arcano.layers.extras} cardName={arcano.name} />
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => setPhase("exercise")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ir ao Exercício
              </button>
            </div>
          </div>
        )}

        {/* Exercise — optional */}
        {phase === "exercise" && (
          <div className="space-y-6">
            <ExerciseSection
              instruction={arcano.layers.exercise.instruction}
              type={arcano.layers.exercise.type}
              duration={arcano.layers.exercise.duration}
              onComplete={handleExerciseComplete}
              completed={exerciseCompleted}
            />
            {exerciseCompleted && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setPhase("quiz")}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
                >
                  Ir ao Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
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
