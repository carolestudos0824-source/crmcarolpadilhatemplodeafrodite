import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArcanoById, ARCANOS_MAIORES } from "@/data/tarot-data";
import { useProgress } from "@/hooks/use-progress";
import { useTrackEvent } from "@/hooks/use-track-event";
import { ArcanoCardDisplay } from "@/components/ArcanoCardDisplay";
import { ArcanoVoice } from "@/components/ArcanoVoice";
import { LessonSections } from "@/components/LessonSections";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { QuizSection } from "@/components/QuizSection";
import PremiumGate from "@/components/PremiumGate";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Eye, MapPin } from "lucide-react";
import mysticBg from "@/assets/mystic-bg.jpg";

/** Arcanos available for free in beta */
const FREE_ARCANO_IDS = [0];

type LessonPhase = "intro" | "lesson" | "deepdive" | "exercise" | "quiz" | "complete";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge, isArcanoCompleted } = useProgress();
  const { trackEvent } = useTrackEvent();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);

  const arcanoId = parseInt(id || "0", 10);
  const arcano = getArcanoById(arcanoId);

  // Navigation helpers
  const prevArcano = arcanoId > 0 ? ARCANOS_MAIORES[arcanoId - 1] : null;
  const nextArcano = arcanoId < 21 ? ARCANOS_MAIORES[arcanoId + 1] : null;

  // Track lesson view on mount (before early return)
  const isPremiumLocked = !FREE_ARCANO_IDS.includes(arcanoId);

  useEffect(() => {
    if (arcano) {
      trackEvent(`lesson_started_${arcano.id}`, { name: arcano.name });
    }
  }, [arcanoId]);

  useEffect(() => {
    if (isPremiumLocked && arcano) {
      trackEvent("premium_gate_hit", { arcano_id: arcanoId, name: arcano.name });
    }
  }, [isPremiumLocked, arcanoId]);

  if (!arcano) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <div className="text-center space-y-4">
          <p className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>
            Arcano não encontrado
          </p>
          <button
            onClick={() => navigate("/module/arcanos-maiores")}
            className="text-sm font-heading tracking-wider"
            style={{ color: "hsl(36 45% 58%)" }}
          >
            Voltar à Jornada
          </button>
        </div>
      </div>
    );
  }

  const phaseSteps: LessonPhase[] = ["intro", "lesson", "deepdive", "exercise", "quiz"];
  const currentIdx = phaseSteps.indexOf(phase);

  const handleStartLesson = () => {
    addXP(10);
    earnBadge("first-step");
    setPhase("lesson");
  };

  const handleLessonComplete = () => {
    addXP(25);
    completeLesson(`arcano-${arcano.id}`);
    trackEvent(`lesson_completed_${arcano.id}`, { name: arcano.name });
    setPhase("quiz");
  };

  const handleExerciseComplete = () => {
    setExerciseCompleted(true);
    addXP(10);
  };

  const handleQuizComplete = (score: number, total: number) => {
    addXP(score * 10);
    completeQuiz(`quiz-arcano-${arcano.id}`);
    trackEvent(`quiz_completed_${arcano.id}`, { name: arcano.name, score, total });
    if (arcano.id === 0) earnBadge("fool-complete");
    if (score === total) earnBadge("quiz-master");
    setPhase("complete");
  };

  const handleNextArcano = () => {
    if (nextArcano) {
      navigate(`/lesson/${nextArcano.id}`);
      // Reset state for new lesson
      setPhase("intro");
      setExerciseCompleted(false);
      setShowSymbols(false);
      window.scrollTo(0, 0);
    }
  };

  const symbolsSection = arcano.lessonSections.find((s) => s.id === "simbolos");

  if (isPremiumLocked) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <img src={mysticBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.92), hsl(36 33% 97% / 0.88))",
          }} />
        </div>
        <header className="relative z-10 backdrop-blur-md" style={{
          background: "hsl(36 33% 97% / 0.85)",
          borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
        }}>
          <div className="container max-w-3xl py-3 px-4 flex items-center gap-4">
            <button onClick={() => navigate("/module/arcanos-maiores")} className="transition-colors hover:scale-105 duration-200" style={{ color: "hsl(230 10% 40%)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-[9px] tracking-[0.35em] uppercase font-heading" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
                {arcano.numeral} · Conteúdo Premium
              </span>
            </div>
          </div>
        </header>

        <main className="relative z-10 container max-w-lg mx-auto px-6 pt-12 pb-20">
          {/* Arcano preview */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
              background: "linear-gradient(135deg, hsl(38 28% 93%), hsl(36 33% 96%), hsl(36 45% 55% / 0.12))",
              border: "2px solid hsl(36 45% 58% / 0.30)",
              boxShadow: "0 0 30px hsl(36 45% 55% / 0.10)",
            }}>
              <span className="font-heading text-xl" style={{ color: "hsl(340 42% 22%)" }}>{arcano.numeral}</span>
            </div>
            <h1 className="font-heading text-2xl tracking-wide mb-2" style={{
              background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 42% 42%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {arcano.name}
            </h1>
            <p className="font-accent text-sm italic" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
              {arcano.subtitle}
            </p>
          </div>

          <PremiumGate
            featureName={arcano.name}
            message={`Estude ${arcano.name} com profundidade — essência, símbolos, luz, sombra, voz do arcano, exercícios e quiz completo.`}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(36 33% 97% / 0.88), hsl(36 33% 97% / 0.82), hsl(36 33% 97% / 0.92))",
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative z-10 backdrop-blur-md"
        style={{
          background: "hsl(36 33% 97% / 0.85)",
          borderBottom: "1px solid hsl(36 45% 58% / 0.15)",
        }}
      >
        <div className="container max-w-3xl py-3 px-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/module/arcanos-maiores")}
            className="transition-colors hover:scale-105 duration-200"
            style={{ color: "hsl(230 10% 40%)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs tracking-[0.2em]" style={{ color: "hsl(36 40% 42%)" }}>
              {arcano.numeral}
            </span>
            <span className="font-heading text-sm" style={{ color: "hsl(230 25% 15%)" }}>
              {arcano.name}
            </span>
          </div>
          <div className="flex-1" />
          {/* Arcano position indicator */}
          <span className="text-[10px] font-body tracking-wider" style={{ color: "hsl(230 10% 50%)" }}>
            {arcanoId + 1}/22
          </span>
          <div className="flex gap-1.5">
            {phaseSteps.map((p, i) => (
              <div
                key={p}
                className="h-1.5 w-5 rounded-full transition-all duration-500"
                style={{
                  background: i <= currentIdx ? "hsl(36 45% 58%)" : "hsl(36 25% 82% / 0.6)",
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* INTRO */}
        {phase === "intro" && (
          <div className="space-y-10" style={{ animation: "fade-up 0.6s ease-out" }}>
            <ArcanoCardDisplay
              name={arcano.name}
              numeral={arcano.numeral}
              subtitle={arcano.subtitle}
              keywords={arcano.keywords}
              cardImage={arcano.cardImage}
            />

            {/* Archetype */}
            <p className="text-center text-sm font-accent italic leading-relaxed max-w-md mx-auto"
              style={{ color: "hsl(230 20% 25% / 0.70)" }}
            >
              {arcano.archetype}
            </p>

            <div className="divider-gold" />
            <ArcanoVoice text={arcano.voiceText} arcanoName={arcano.name} />
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={handleStartLesson}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2), 0 0 40px hsl(42 70% 80% / 0.08)",
                }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Começar a Lição
                </span>
              </button>
              {symbolsSection && (
                <button
                  onClick={() => setShowSymbols(!showSymbols)}
                  className="flex items-center gap-2 text-xs font-heading tracking-wider transition-colors duration-200"
                  style={{ color: "hsl(230 10% 45%)" }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showSymbols ? "Ocultar símbolos" : "Ver símbolos"}
                </button>
              )}
            </div>
            {showSymbols && symbolsSection && (
              <div
                className="rounded-xl p-5"
                style={{
                  background: "hsl(38 30% 95% / 0.8)",
                  border: "1px solid hsl(36 45% 58% / 0.15)",
                  animation: "fade-up 0.3s ease-out",
                }}
              >
                <h4 className="font-heading text-sm tracking-wider mb-3" style={{ color: "hsl(36 40% 42%)" }}>
                  ◎ Símbolos do Arcano
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>
                  {symbolsSection.content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* LESSON */}
        {phase === "lesson" && (
          <div className="space-y-8" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
                <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>
                  Lição do Arcano
                </span>
              </div>
              <button onClick={() => setPhase("quiz")} className="text-xs font-heading tracking-wider transition-colors" style={{ color: "hsl(36 45% 58%)" }}>
                Ir ao Quiz →
              </button>
            </div>
            <LessonSections sections={arcano.lessonSections} />
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={handleLessonComplete}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >
                Concluir Lição ✦
              </button>
              <div className="flex gap-4 mt-2">
                <button onClick={() => setPhase("deepdive")} className="text-xs font-heading tracking-wider transition-colors" style={{ color: "hsl(230 10% 45%)" }}>
                  🔮 Aprofundar
                </button>
                <button onClick={() => setPhase("exercise")} className="text-xs font-heading tracking-wider transition-colors" style={{ color: "hsl(230 10% 45%)" }}>
                  ✍️ Exercício
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEEP DIVE */}
        {phase === "deepdive" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Aprofundamento</span>
              <button onClick={() => setPhase("quiz")} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <DeepDiveSection {...arcano.layers.deepDive} />
            <div className="flex justify-center pt-4">
              <button onClick={() => setPhase("quiz")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)" }}>
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* EXERCISE */}
        {phase === "exercise" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading tracking-[0.2em] uppercase" style={{ color: "hsl(36 40% 42%)" }}>Exercício</span>
              <button onClick={() => setPhase("quiz")} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>Ir ao Quiz →</button>
            </div>
            <ExerciseSection
              instruction={arcano.layers.exercise.instruction}
              type={arcano.layers.exercise.type}
              duration={arcano.layers.exercise.duration}
              onComplete={handleExerciseComplete}
              completed={exerciseCompleted}
            />
            <div className="flex justify-center pt-2">
              <button onClick={() => setPhase("quiz")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105" style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)" }}>
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl text-gradient-gold-warm mb-1">Quiz de Fixação</h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>Teste o que você aprendeu com {arcano.name}</p>
            </div>
            <div className="rounded-xl p-6" style={{ background: "hsl(38 30% 95% / 0.85)", border: "1px solid hsl(36 45% 58% / 0.15)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)" }}>
              <QuizSection questions={arcano.quiz} onComplete={handleQuizComplete} />
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigate("/module/arcanos-maiores")} className="text-sm transition-colors flex items-center gap-2" style={{ color: "hsl(230 10% 45%)" }}>
                <MapPin className="w-3.5 h-3.5" /> Voltar ao mapa
              </button>
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {phase === "complete" && (
          <div className="text-center py-12 space-y-8" style={{ animation: "fade-up 0.6s ease-out" }}>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, hsl(36 45% 58% / 0.15), hsl(42 70% 80% / 0.1))", border: "2px solid hsl(36 45% 58% / 0.3)", animation: "glow-breathe 3s ease-in-out infinite" }}>✦</div>
            <h2 className="font-heading text-2xl text-gradient-gold">Lição Completa</h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>Você completou a jornada com <strong>{arcano.name}</strong>.</p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col items-center gap-4 pt-4">
              {/* Next arcano button */}
              {nextArcano && (
                <button
                  onClick={handleNextArcano}
                  className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                    color: "hsl(36 33% 97%)",
                    boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2), 0 0 40px hsl(42 70% 80% / 0.08)",
                  }}
                >
                  <span className="flex flex-col items-start">
                    <span className="text-[9px] tracking-[0.3em] uppercase opacity-75">Próximo Arcano</span>
                    <span className="flex items-center gap-2">
                      {nextArcano.numeral} — {nextArcano.name}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </span>
                </button>
              )}

              {/* Back to map */}
              <button
                onClick={() => navigate("/module/arcanos-maiores")}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                  background: "transparent",
                  border: "1.5px solid hsl(36 45% 58% / 0.35)",
                  color: "hsl(36 40% 42%)",
                }}
              >
                <MapPin className="w-4 h-4" />
                Voltar à Jornada
              </button>

              {/* Previous arcano link */}
              {prevArcano && isArcanoCompleted(prevArcano.id) && (
                <button
                  onClick={() => {
                    navigate(`/lesson/${prevArcano.id}`);
                    setPhase("intro");
                    setExerciseCompleted(false);
                    setShowSymbols(false);
                    window.scrollTo(0, 0);
                  }}
                  className="text-xs font-heading tracking-wider transition-colors flex items-center gap-2 mt-2"
                  style={{ color: "hsl(230 10% 50%)" }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Revisar {prevArcano.name}
                </button>
              )}
            </div>

            {/* Journey completed! */}
            {!nextArcano && (
              <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(36 45% 58% / 0.15)" }}>
                <div className="text-2xl mb-3">🎉</div>
                <h3 className="font-heading text-lg tracking-wide mb-2" style={{ color: "hsl(340 42% 22%)" }}>
                  Jornada dos Arcanos Maiores Completa!
                </h3>
                <p className="font-accent text-sm italic max-w-sm mx-auto" style={{ color: "hsl(230 20% 15% / 0.55)" }}>
                  Do vazio fértil do Louco à dança cósmica do Mundo — você percorreu todos os 22 arquétipos da alma.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
