import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw, BookOpen, Sparkles } from "lucide-react";

interface ContinuityCardProps {
  lastLessonId: string | null;
  lastLessonName: string | null;
  completedLessons: number;
  completedQuizzes: number;
  hasUnfinishedReview: boolean;
}

const ContinuityCard = ({ lastLessonId, lastLessonName, completedLessons, completedQuizzes, hasUnfinishedReview }: ContinuityCardProps) => {
  const navigate = useNavigate();

  // Determine the best action to suggest
  const actions: Array<{
    label: string;
    subtitle: string;
    path: string;
    icon: typeof ArrowRight;
    priority: number;
  }> = [];

  // Continue last lesson
  if (lastLessonId && lastLessonName) {
    actions.push({
      label: `Continuar: ${lastLessonName}`,
      subtitle: "Retome de onde parou",
      path: `/lesson/${lastLessonId}`,
      icon: ArrowRight,
      priority: 1,
    });
  }

  // Review if there are completed lessons but user hasn't reviewed recently
  if (completedLessons >= 3 && hasUnfinishedReview) {
    actions.push({
      label: "Revisão rápida",
      subtitle: "Reforce o que já aprendeu",
      path: "/revisao",
      icon: RefreshCw,
      priority: 2,
    });
  }

  // Daily ritual
  actions.push({
    label: "Ritual diário",
    subtitle: "Sua prática de hoje",
    path: "/ritual-diario",
    icon: Sparkles,
    priority: 3,
  });

  // Sort by priority, show top 2
  const topActions = actions.sort((a, b) => a.priority - b.priority).slice(0, 2);

  if (topActions.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="text-[9px] tracking-[0.3em] uppercase font-body text-center mb-3" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
        Continue sua jornada
      </p>
      <div className="space-y-2">
        {topActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="w-full group transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="rounded-xl p-3.5 flex items-center gap-3" style={{
                background: "linear-gradient(145deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
                border: "1px solid hsl(340 42% 28% / 0.15)",
                boxShadow: "0 2px 10px hsl(340 42% 28% / 0.04)",
              }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
                  background: "hsl(340 42% 28% / 0.06)",
                  border: "1px solid hsl(340 42% 28% / 0.15)",
                }}>
                  <Icon className="w-4 h-4" style={{ color: "hsl(340 42% 26%)" }} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-heading text-[12px] tracking-wide truncate" style={{ color: "hsl(340 42% 22%)" }}>
                    {action.label}
                  </h4>
                  <p className="font-body text-[10px]" style={{ color: "hsl(230 15% 30% / 0.45)" }}>
                    {action.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(340 42% 28% / 0.30)" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContinuityCard;
