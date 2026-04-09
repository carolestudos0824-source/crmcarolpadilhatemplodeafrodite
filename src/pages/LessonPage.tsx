import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { THE_FOOL } from "@/data/tarot-data";
import { FOOL_VOICE_TEXT, FOOL_LESSON_SECTIONS } from "@/data/fool-lesson-content";
import { useProgress } from "@/hooks/use-progress";
import { ArcanoCardDisplay } from "@/components/ArcanoCardDisplay";
import { ArcanoVoice } from "@/components/ArcanoVoice";
import { LessonSections } from "@/components/LessonSections";
import { DeepDiveSection } from "@/components/DeepDiveSection";
import { ExerciseSection } from "@/components/ExerciseSection";
import { QuizSection } from "@/components/QuizSection";
import { ArrowLeft, BookOpen, Sparkles, Eye } from "lucide-react";
import mysticBg from "@/assets/mystic-bg.jpg";

type LessonPhase = "intro" | "lesson" | "deepdive" | "exercise" | "quiz" | "complete";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz, earnBadge } = useProgress();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);

  const arcano = THE_FOOL;

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
    setPhase("complete");
  };

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
            onClick={() => navigate("/")}
            className="transition-colors hover:scale-105 duration-200"
            style={{ color: "hsl(230 10% 40%)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span
              className="font-heading text-xs tracking-[0.2em]"
              style={{ color: "hsl(36 40% 42%)" }}
            >
              {arcano.numeral}
            </span>
            <span
              className="font-heading text-sm"
              style={{ color: "hsl(230 25% 15%)" }}
            >
              {arcano.name}
            </span>
          </div>
          <div className="flex-1" />
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {phaseSteps.map((p, i) => (
              <div
                key={p}
                className="h-1.5 w-5 rounded-full transition-all duration-500"
                style={{
                  background:
                    i <= currentIdx
                      ? "hsl(36 45% 58%)"
                      : "hsl(36 25% 82% / 0.6)",
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-3xl px-4 py-8">
        {/* ====== INTRO PHASE ====== */}
        {phase === "intro" && (
          <div className="space-y-10" style={{ animation: "fade-up 0.6s ease-out" }}>
            {/* Card display */}
            <ArcanoCardDisplay
              name={arcano.name}
              numeral={arcano.numeral}
              subtitle={arcano.subtitle}
              keywords={arcano.keywords}
            />

            {/* Divider */}
            <div className="divider-gold" />

            {/* Voice of the Arcano */}
            <ArcanoVoice text={FOOL_VOICE_TEXT} arcanoName={arcano.name} />

            {/* Action buttons */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={handleStartLesson}
                className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow:
                    "0 4px 20px hsl(36 45% 58% / 0.2), 0 0 40px hsl(42 70% 80% / 0.08)",
                }}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Começar a Lição
                </span>
              </button>

              <button
                onClick={() => setShowSymbols(!showSymbols)}
                className="flex items-center gap-2 text-xs font-heading tracking-wider transition-colors duration-200"
                style={{ color: "hsl(230 10% 45%)" }}
              >
                <Eye className="w-3.5 h-3.5" />
                {showSymbols ? "Ocultar símbolos" : "Ver símbolos"}
              </button>
            </div>

            {/* Symbols preview (optional) */}
            {showSymbols && (
              <div
                className="rounded-xl p-5"
                style={{
                  background: "hsl(38 30% 95% / 0.8)",
                  border: "1px solid hsl(36 45% 58% / 0.15)",
                  animation: "fade-up 0.3s ease-out",
                }}
              >
                <h4
                  className="font-heading text-sm tracking-wider mb-3"
                  style={{ color: "hsl(36 40% 42%)" }}
                >
                  ◎ Símbolos do Arcano
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>
                  {FOOL_LESSON_SECTIONS.find((s) => s.id === "simbolos")?.content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ====== LESSON PHASE ====== */}
        {phase === "lesson" && (
          <div className="space-y-8" style={{ animation: "fade-up 0.5s ease-out" }}>
            {/* Phase label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "hsl(36 40% 42%)" }} />
                <span
                  className="text-xs font-heading tracking-[0.2em] uppercase"
                  style={{ color: "hsl(36 40% 42%)" }}
                >
                  Lição do Arcano
                </span>
              </div>
              <button
                onClick={() => setPhase("quiz")}
                className="text-xs font-heading tracking-wider transition-colors"
                style={{ color: "hsl(36 45% 58%)" }}
              >
                Ir ao Quiz →
              </button>
            </div>

            {/* Lesson sections */}
            <LessonSections sections={FOOL_LESSON_SECTIONS} />

            {/* Navigation after lesson */}
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
                <button
                  onClick={() => setPhase("deepdive")}
                  className="text-xs font-heading tracking-wider transition-colors"
                  style={{ color: "hsl(230 10% 45%)" }}
                >
                  🔮 Aprofundar
                </button>
                <button
                  onClick={() => setPhase("exercise")}
                  className="text-xs font-heading tracking-wider transition-colors"
                  style={{ color: "hsl(230 10% 45%)" }}
                >
                  ✍️ Exercício
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====== DEEP DIVE PHASE ====== */}
        {phase === "deepdive" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-heading tracking-[0.2em] uppercase"
                style={{ color: "hsl(36 40% 42%)" }}
              >
                Aprofundamento
              </span>
              <button
                onClick={() => setPhase("quiz")}
                className="text-xs font-heading tracking-wider"
                style={{ color: "hsl(36 45% 58%)" }}
              >
                Ir ao Quiz →
              </button>
            </div>

            <DeepDiveSection {...arcano.layers.deepDive} />

            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={() => setPhase("quiz")}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* ====== EXERCISE PHASE ====== */}
        {phase === "exercise" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-heading tracking-[0.2em] uppercase"
                style={{ color: "hsl(36 40% 42%)" }}
              >
                Exercício
              </span>
              <button
                onClick={() => setPhase("quiz")}
                className="text-xs font-heading tracking-wider"
                style={{ color: "hsl(36 45% 58%)" }}
              >
                Ir ao Quiz →
              </button>
            </div>

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
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                  color: "hsl(36 33% 97%)",
                  boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
                }}
              >
                Ir ao Quiz
              </button>
            </div>
          </div>
        )}

        {/* ====== QUIZ PHASE ====== */}
        {phase === "quiz" && (
          <div className="space-y-6" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="text-center mb-6">
              <h2
                className="font-heading text-2xl text-gradient-gold-warm mb-1"
              >
                Quiz de Fixação
              </h2>
              <p className="text-xs" style={{ color: "hsl(230 10% 45%)" }}>
                Teste o que você aprendeu com {arcano.name}
              </p>
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                background: "hsl(38 30% 95% / 0.85)",
                border: "1px solid hsl(36 45% 58% / 0.15)",
                boxShadow: "0 4px 20px hsl(36 45% 58% / 0.06)",
              }}
            >
              <QuizSection questions={arcano.quiz} onComplete={handleQuizComplete} />
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm transition-colors"
                style={{ color: "hsl(230 10% 45%)" }}
              >
                Voltar ao mapa
              </button>
            </div>
          </div>
        )}

        {/* ====== COMPLETE PHASE ====== */}
        {phase === "complete" && (
          <div
            className="text-center py-12 space-y-6"
            style={{ animation: "fade-up 0.6s ease-out" }}
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, hsl(36 45% 58% / 0.15), hsl(42 70% 80% / 0.1))",
                border: "2px solid hsl(36 45% 58% / 0.3)",
                animation: "glow-breathe 3s ease-in-out infinite",
              }}
            >
              ✦
            </div>
            <h2 className="font-heading text-2xl text-gradient-gold">
              Lição Completa
            </h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 30%)" }}>
              Você completou a jornada com {arcano.name}.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-3.5 rounded-full font-heading text-sm tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))",
                color: "hsl(36 33% 97%)",
                boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)",
              }}
            >
              Voltar à Jornada
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
