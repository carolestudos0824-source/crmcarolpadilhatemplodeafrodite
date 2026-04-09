import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { THE_FOOL } from "@/data/tarot-data";
import { useProgress } from "@/hooks/use-progress";
import { ArcanoGuide } from "@/components/ArcanoGuide";
import { QuizSection } from "@/components/QuizSection";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { LibrarySection } from "@/components/LibrarySection";
import { ArrowLeft } from "lucide-react";

type LessonPhase = "guided" | "deepdive" | "extras" | "exercise" | "quiz" | "complete";

const PHASE_LABELS: Record<LessonPhase, string> = {
  guided: "Aula com o Arcano",
  deepdive: "Aprofundamento",
  extras: "Biblioteca",
  exercise: "Exercício",
  quiz: "Quiz",
  complete: "Concluído",
};

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const [phase, setPhase] = useState<LessonPhase>("guided");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const arcano = THE_FOOL;
  const phases: LessonPhase[] = ["guided", "deepdive", "extras", "exercise", "quiz"];
  const currentPhaseIndex = phases.indexOf(phase);

  const handleGuideComplete = () => {
    addXP(25);
    completeLesson(`arcano-${arcano.id}`);
    earnBadge("first-step");
    // Show choice: go deeper or quiz
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
        <div className="container max-w-4xl py-3 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs text-primary tracking-wider">{arcano.numeral}</span>
            <span className="font-heading text-sm text-foreground">{arcano.name}</span>
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            {phases.map((p, i) => (
              <div
                key={p}
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                  i <= currentPhaseIndex ? "bg-primary" : "bg-muted"
                }`}
                title={PHASE_LABELS[p]}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-4xl px-4 py-6">
        {/* Phase label */}
        {phase !== "guided" && (
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

        {/* Immersive Guided Experience */}
        {phase === "guided" && (
          <ArcanoGuide arcano={arcano} onComplete={handleGuideComplete} />
        )}

        {/* After guided lesson — choice panel */}
        {phase === "quiz" && (
          <div className="space-y-8">
            {/* Optional sections CTA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => setPhase("deepdive")}
                className="card-mystic p-4 text-left hover:glow-gold transition-all duration-300 group"
              >
                <span className="text-lg mb-1 block">🔮</span>
                <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors">
                  Aprofundar
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Simbolismo, cabala e história</p>
              </button>
              <button
                onClick={() => setPhase("extras")}
                className="card-mystic p-4 text-left hover:glow-gold transition-all duration-300 group"
              >
                <span className="text-lg mb-1 block">📚</span>
                <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors">
                  Biblioteca
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Materiais extras e leituras</p>
              </button>
              <button
                onClick={() => setPhase("exercise")}
                className="card-mystic p-4 text-left hover:glow-gold transition-all duration-300 group"
              >
                <span className="text-lg mb-1 block">✍️</span>
                <h4 className="font-heading text-sm text-foreground group-hover:text-primary transition-colors">
                  Exercício
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Reflexão e prática</p>
              </button>
            </div>

            {/* Quiz */}
            <div className="animate-fade-up">
              <h2 className="font-heading text-2xl text-gradient-gold text-center mb-8">
                Quiz de Fixação
              </h2>
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
          </div>
        )}

        {/* Deep Dive */}
        {phase === "deepdive" && (
          <div className="space-y-6">
            <DeepDiveSection {...arcano.layers.deepDive} />
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => setPhase("quiz")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ir ao Quiz
              </button>
              <button
                onClick={() => setPhase("extras")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Ver materiais extras →
              </button>
            </div>
          </div>
        )}

        {/* Extras */}
        {phase === "extras" && (
          <div className="space-y-6">
            <LibrarySection materials={arcano.layers.extras} cardName={arcano.name} />
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => setPhase("quiz")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* Exercise */}
        {phase === "exercise" && (
          <div className="space-y-6">
            <ExerciseSection
              instruction={arcano.layers.exercise.instruction}
              type={arcano.layers.exercise.type}
              duration={arcano.layers.exercise.duration}
              onComplete={handleExerciseComplete}
              completed={exerciseCompleted}
            />
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setPhase("quiz")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
