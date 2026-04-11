import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import mysticBg from "@/assets/mystic-bg.jpg";

interface GenericLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  exercise: { instruction: string; type: string };
  quiz: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
}

type Phase = "lesson" | "exercise" | "quiz" | "complete";

interface Props {
  lessons: GenericLesson[];
  getLessonByOrder: (order: number) => GenericLesson | undefined;
  moduleRoute: string;
  moduleName: string;
}

const GenericLessonPage = ({ lessons, getLessonByOrder, moduleRoute, moduleName }: Props) => {
  const { order } = useParams();
  const navigate = useNavigate();
  const { addXP, completeLesson, completeQuiz } = useProgress();
  const [phase, setPhase] = useState<Phase>("lesson");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);

  const lessonOrder = parseInt(order || "0", 10);
  const lesson = getLessonByOrder(lessonOrder);
  const nextLesson = getLessonByOrder(lessonOrder + 1);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 33% 97%)" }}>
        <p className="font-heading">Lição não encontrada</p>
        <button onClick={() => navigate(moduleRoute)} className="text-sm font-heading mt-4" style={{ color: "hsl(36 45% 58%)" }}>Voltar</button>
      </div>
    );
  }

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    if (idx === lesson.quiz[quizIdx].correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (quizIdx < lesson.quiz.length - 1) {
      setQuizIdx(i => i + 1);
      setSelected(null);
      setShowExp(false);
    } else {
      completeQuiz(lesson.id);
      completeLesson(lesson.id);
      addXP(25 + score * 10);
      setPhase("complete");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10), hsl(36 33% 97% / 0.22))" }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(moduleRoute)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(36 33% 97% / 0.7)", border: "1px solid hsl(36 42% 52% / 0.15)" }}>
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(230 20% 25%)" }} />
          </button>
          <div className="flex-1">
            <p className="text-[9px] font-heading tracking-[0.3em] uppercase" style={{ color: "hsl(36 40% 42% / 0.7)" }}>{moduleName}</p>
            <h1 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{lesson.title}</h1>
          </div>
          <span className="text-lg">{lesson.icon}</span>
        </div>

        {/* Phase: Lesson */}
        {phase === "lesson" && (
          <div className="space-y-5" style={{ animation: "fade-up 0.4s ease-out" }}>
            <div className="rounded-xl p-5" style={{ background: "hsl(38 28% 93% / 0.85)", border: "1px solid hsl(36 42% 52% / 0.15)" }}>
              <p className="font-accent text-xs italic mb-3" style={{ color: "hsl(230 20% 15% / 0.5)" }}>{lesson.subtitle}</p>
              {lesson.content.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "hsl(230 20% 25%)" }}
                  dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
            </div>

            {lesson.keyPoints.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "hsl(36 42% 44% / 0.06)", border: "1px solid hsl(36 42% 44% / 0.15)" }}>
                <h3 className="font-heading text-xs tracking-wider mb-2" style={{ color: "hsl(36 40% 42%)" }}>✦ Pontos-chave</h3>
                <ul className="space-y-1.5">
                  {lesson.keyPoints.map((kp, i) => (
                    <li key={i} className="text-xs leading-relaxed flex gap-2" style={{ color: "hsl(230 20% 25%)" }}>
                      <span style={{ color: "hsl(36 42% 44%)" }}>•</span>{kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center">
              <button onClick={() => setPhase("exercise")} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)", boxShadow: "0 4px 20px hsl(36 45% 58% / 0.2)" }}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Phase: Exercise */}
        {phase === "exercise" && (
          <div className="space-y-5" style={{ animation: "fade-up 0.4s ease-out" }}>
            <div className="rounded-xl p-5" style={{ background: "hsl(340 42% 28% / 0.05)", border: "1px solid hsl(340 42% 28% / 0.15)" }}>
              <h3 className="font-heading text-xs tracking-wider mb-3" style={{ color: "hsl(340 42% 28%)" }}>✍ Exercício</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(230 20% 25%)" }}>{lesson.exercise.instruction}</p>
            </div>
            {lesson.reflection && (
              <div className="rounded-xl p-4" style={{ background: "hsl(270 30% 35% / 0.04)", border: "1px solid hsl(270 30% 35% / 0.12)" }}>
                <h3 className="font-heading text-xs tracking-wider mb-2" style={{ color: "hsl(270 30% 35%)" }}>💭 Reflexão</h3>
                <p className="text-xs leading-relaxed italic" style={{ color: "hsl(230 20% 25%)" }}>{lesson.reflection}</p>
              </div>
            )}
            <div className="flex justify-center">
              <button onClick={() => { setPhase("quiz"); setQuizIdx(0); setSelected(null); setShowExp(false); setScore(0); }}
                className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)" }}>
                Ir ao Quiz →
              </button>
            </div>
          </div>
        )}

        {/* Phase: Quiz */}
        {phase === "quiz" && lesson.quiz[quizIdx] && (
          <div className="space-y-4" style={{ animation: "fade-up 0.3s ease-out" }}>
            <div className="flex justify-between text-[10px] font-heading tracking-wider" style={{ color: "hsl(230 20% 15% / 0.5)" }}>
              <span>Pergunta {quizIdx + 1}/{lesson.quiz.length}</span>
              <span>{score} acertos</span>
            </div>
            <div className="rounded-xl p-5" style={{ background: "hsl(38 28% 93% / 0.85)", border: "1px solid hsl(36 42% 52% / 0.15)" }}>
              <p className="text-sm font-heading leading-relaxed mb-4" style={{ color: "hsl(230 25% 15%)" }}>{lesson.quiz[quizIdx].question}</p>
              <div className="space-y-2">
                {lesson.quiz[quizIdx].options.map((opt, i) => {
                  const isCorrect = i === lesson.quiz[quizIdx].correctIndex;
                  const isSelected = i === selected;
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                      className="w-full text-left rounded-lg p-3 text-xs transition-all"
                      style={{
                        background: selected !== null ? (isCorrect ? "hsl(120 40% 40% / 0.1)" : isSelected ? "hsl(0 60% 50% / 0.1)" : "hsl(38 28% 93% / 0.5)") : "hsl(38 28% 93% / 0.5)",
                        border: `1px solid ${selected !== null ? (isCorrect ? "hsl(120 40% 40% / 0.3)" : isSelected ? "hsl(0 60% 50% / 0.3)" : "hsl(36 25% 82% / 0.3)") : "hsl(36 25% 82% / 0.3)"}`,
                        color: "hsl(230 20% 25%)",
                      }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showExp && (
                <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "hsl(36 42% 44% / 0.06)", border: "1px solid hsl(36 42% 44% / 0.12)", color: "hsl(230 20% 25%)" }}>
                  {lesson.quiz[quizIdx].explanation}
                </div>
              )}
            </div>
            {selected !== null && (
              <div className="flex justify-center">
                <button onClick={handleNext} className="px-8 py-3 rounded-full font-heading text-sm tracking-wider transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)" }}>
                  {quizIdx < lesson.quiz.length - 1 ? "Próxima →" : "Ver Resultado"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Complete */}
        {phase === "complete" && (
          <div className="text-center space-y-6 py-12" style={{ animation: "fade-up 0.5s ease-out" }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "hsl(36 42% 44% / 0.1)", border: "2px solid hsl(36 42% 44% / 0.3)" }}>
              <Sparkles className="w-7 h-7" style={{ color: "hsl(36 42% 44%)" }} />
            </div>
            <h2 className="font-heading text-lg" style={{ color: "hsl(230 25% 15%)" }}>Lição Concluída!</h2>
            <p className="text-sm" style={{ color: "hsl(230 20% 25%)" }}>{score}/{lesson.quiz.length} acertos • +{25 + score * 10} XP</p>
            <div className="flex flex-col gap-3">
              {nextLesson && (
                <button onClick={() => { navigate(`${moduleRoute.replace("/module/", "/")}/${nextLesson.order}`); setPhase("lesson"); setQuizIdx(0); setSelected(null); setShowExp(false); setScore(0); }}
                  className="px-8 py-3 rounded-full font-heading text-sm tracking-wider mx-auto"
                  style={{ background: "linear-gradient(135deg, hsl(36 40% 42%), hsl(36 45% 58%))", color: "hsl(36 33% 97%)" }}>
                  Próxima Lição <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              )}
              <button onClick={() => navigate(moduleRoute)} className="text-xs font-heading tracking-wider" style={{ color: "hsl(36 45% 58%)" }}>
                Voltar ao módulo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericLessonPage;
