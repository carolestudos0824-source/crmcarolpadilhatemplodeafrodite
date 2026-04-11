import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronRight, BookOpen } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { XPBar } from "@/components/XPBar";
import mysticBg from "@/assets/mystic-bg.jpg";

interface GenericLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
}

interface GenericModulePageProps {
  moduleTitle: string;
  moduleSubtitle: string;
  moduleIcon: string;
  lessons: GenericLesson[];
  lessonRoutePrefix: string;
  backRoute?: string;
}

const GenericModulePage = ({ moduleTitle, moduleSubtitle, moduleIcon, lessons, lessonRoutePrefix, backRoute = "/app" }: GenericModulePageProps) => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const isCompleted = (id: string) => progress.completedLessons.includes(id);
  const isUnlocked = (order: number) => {
    if (order === 0) return true;
    const prev = lessons.find(l => l.order === order - 1);
    return prev ? isCompleted(prev.id) : false;
  };

  const completedCount = lessons.filter(l => isCompleted(l.id)).length;
  const pct = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src={mysticBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(36 33% 97% / 0.10), hsl(36 33% 97% / 0.22))" }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(backRoute)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "hsl(36 33% 97% / 0.7)", border: "1px solid hsl(36 42% 52% / 0.15)" }}>
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(230 20% 25%)" }} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{moduleIcon}</span>
              <h1 className="font-heading text-base tracking-wide" style={{ color: "hsl(230 25% 15%)" }}>{moduleTitle}</h1>
            </div>
            <p className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.5)" }}>{moduleSubtitle}</p>
          </div>
        </div>

        <XPBar xp={progress.xp} level={progress.level} />

        {/* Progress */}
        <div className="mb-6 mt-4">
          <div className="flex justify-between text-[10px] font-heading tracking-wider mb-1.5" style={{ color: "hsl(230 20% 15% / 0.5)" }}>
            <span>{completedCount}/{lessons.length} lições</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(36 25% 82% / 0.4)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, hsl(36 42% 44%), hsl(36 45% 58%))" }} />
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-2.5">
          {lessons.sort((a, b) => a.order - b.order).map((lesson) => {
            const completed = isCompleted(lesson.id);
            const unlocked = isUnlocked(lesson.order);
            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && navigate(`${lessonRoutePrefix}/${lesson.order}`)}
                disabled={!unlocked}
                className="w-full text-left group transition-all duration-300"
              >
                <div className="rounded-xl p-4 flex items-center gap-3.5 transition-all" style={{
                  background: completed ? "hsl(36 42% 44% / 0.08)" : unlocked ? "hsl(38 28% 93% / 0.80)" : "hsl(38 28% 93% / 0.40)",
                  border: `1px solid ${completed ? "hsl(36 42% 44% / 0.25)" : unlocked ? "hsl(36 42% 52% / 0.20)" : "hsl(36 25% 82% / 0.25)"}`,
                  opacity: unlocked ? 1 : 0.5,
                }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                    background: completed ? "hsl(36 42% 44% / 0.12)" : "hsl(36 45% 58% / 0.06)",
                    border: `1px solid ${completed ? "hsl(36 42% 44% / 0.3)" : "hsl(36 45% 58% / 0.15)"}`,
                  }}>
                    {completed ? <Check className="w-4 h-4" style={{ color: "hsl(36 42% 44%)" }} /> : !unlocked ? <Lock className="w-3.5 h-3.5" style={{ color: "hsl(230 10% 60%)" }} /> : <span className="text-sm">{lesson.icon}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm tracking-wide" style={{ color: "hsl(230 20% 12% / 0.80)" }}>{lesson.title}</h3>
                    <p className="font-accent text-[11px] italic truncate" style={{ color: "hsl(230 20% 15% / 0.45)" }}>{lesson.subtitle}</p>
                  </div>
                  {unlocked && <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(36 42% 45% / 0.35)" }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenericModulePage;
