import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, BookOpen, Star, Target } from "lucide-react";

const AdminUsage = () => {
  const [stats, setStats] = useState<{
    totalLessons: number;
    totalQuizzes: number;
    totalExercises: number;
    topLessons: { id: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: progress } = await supabase
        .from("user_progress")
        .select("completed_lessons, completed_quizzes, completed_exercises");

      if (!progress) { setLoading(false); return; }

      const allLessons = progress.flatMap(p => p.completed_lessons || []);
      const allQuizzes = progress.flatMap(p => p.completed_quizzes || []);
      const allExercises = progress.flatMap(p => p.completed_exercises || []);

      // Count frequency of each lesson
      const lessonCounts: Record<string, number> = {};
      allLessons.forEach(l => { lessonCounts[l] = (lessonCounts[l] || 0) + 1; });
      const topLessons = Object.entries(lessonCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id, count]) => ({ id, count }));

      setStats({
        totalLessons: allLessons.length,
        totalQuizzes: allQuizzes.length,
        totalExercises: allExercises.length,
        topLessons,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;

  const cards = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Lições Concluídas", value: stats?.totalLessons ?? 0 },
    { icon: <Star className="w-5 h-5" />, label: "Quizzes Concluídos", value: stats?.totalQuizzes ?? 0 },
    { icon: <Target className="w-5 h-5" />, label: "Exercícios Feitos", value: stats?.totalExercises ?? 0 },
  ];

  const formatLessonName = (id: string) => {
    const match = id.match(/arcano-(\d+)/);
    if (match) {
      const names: Record<string, string> = {
        "0": "O Louco", "1": "O Mago", "2": "A Sacerdotisa", "3": "A Imperatriz",
        "4": "O Imperador", "5": "O Hierofante", "6": "Os Enamorados", "7": "O Carro",
        "8": "A Justiça", "9": "O Eremita", "10": "A Roda da Fortuna", "11": "A Força",
        "12": "O Enforcado", "13": "A Morte", "14": "A Temperança", "15": "O Diabo",
        "16": "A Torre", "17": "A Estrela", "18": "A Lua", "19": "O Sol",
        "20": "O Julgamento", "21": "O Mundo",
      };
      return names[match[1]] || id;
    }
    return id;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Progresso & Uso</h2>
        <p className="text-sm text-muted-foreground">Como os estudantes estão usando a plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
              {card.icon}
            </div>
            <p className="text-2xl font-heading text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Top lessons */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Conteúdos mais estudados</h3>
        {stats?.topLessons.length ? (
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">#</th>
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Conteúdo</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Conclusões</th>
                </tr>
              </thead>
              <tbody>
                {stats.topLessons.map((l, i) => (
                  <tr key={l.id} className="border-b border-border/10 last:border-0">
                    <td className="p-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                        {i + 1}
                      </span>
                    </td>
                    <td className="p-3 text-foreground">{formatLessonName(l.id)}</td>
                    <td className="p-3 text-center text-muted-foreground">{l.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Ainda sem dados de progresso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsage;
