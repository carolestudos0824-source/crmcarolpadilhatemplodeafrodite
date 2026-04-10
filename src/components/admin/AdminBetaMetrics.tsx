import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, Brain, RotateCcw, Crown, MessageCircle, ArrowRight } from "lucide-react";

interface FunnelStep {
  label: string;
  event: string;
  count: number;
  icon: React.ReactNode;
}

interface FeedbackItem {
  message: string;
  type: string;
  rating: number | null;
  page: string | null;
  created_at: string;
}

const AdminBetaMetrics = () => {
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Count events by type
      const events = [
        { label: "Onboarding concluído", event: "onboarding_completed", icon: <Users className="w-4 h-4" /> },
        { label: "O Louco — iniciado", event: "lesson_started_0", icon: <BookOpen className="w-4 h-4" /> },
        { label: "O Louco — concluído", event: "lesson_completed_0", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Quiz O Louco — concluído", event: "quiz_completed_0", icon: <Brain className="w-4 h-4" /> },
        { label: "Voltou no dia seguinte", event: "return_visit", icon: <RotateCcw className="w-4 h-4" /> },
        { label: "Avançou para O Mago", event: "lesson_started_1", icon: <ArrowRight className="w-4 h-4" /> },
        { label: "Viu página premium", event: "premium_page_viewed", icon: <Crown className="w-4 h-4" /> },
        { label: "Bateu no premium gate", event: "premium_gate_hit", icon: <Crown className="w-4 h-4" /> },
      ];

      const funnelData: FunnelStep[] = [];
      
      for (const e of events) {
        const { count } = await (supabase.from("user_events") as any)
          .select("*", { count: "exact", head: true })
          .eq("event_name", e.event);
        funnelData.push({ ...e, count: count ?? 0 });
      }

      setFunnel(funnelData);

      // Total unique users
      const { data: profiles, count: profileCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setTotalUsers(profileCount ?? 0);

      // Recent feedback
      const { data: fb } = await supabase
        .from("beta_feedback")
        .select("message, type, rating, page, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentFeedback((fb as FeedbackItem[]) || []);
    } catch {
      // silent
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const maxCount = Math.max(...funnel.map(f => f.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg text-foreground">Métricas da Beta</h2>
        <p className="text-sm text-muted-foreground">
          Funil de validação — sinais de valor percebido.
        </p>
      </div>

      {/* Total users card */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-heading text-foreground">{totalUsers}</p>
          <p className="text-xs text-muted-foreground">Usuárias cadastradas</p>
        </div>
      </div>

      {/* Funnel */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-4">
          Funil de Jornada
        </h3>
        <div className="space-y-2">
          {funnel.map((step, i) => (
            <div key={step.event} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground truncate">{step.label}</span>
                  <span className="text-sm font-heading text-foreground ml-2">{step.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max((step.count / maxCount) * 100, step.count > 0 ? 4 : 0)}%`,
                      background: i < 4
                        ? "hsl(36 45% 58%)"
                        : i < 6
                          ? "hsl(280 30% 50%)"
                          : "hsl(340 42% 45%)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key signals */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
        <p className="text-sm font-heading text-foreground">✦ Sinais-chave para validação</p>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>• <strong>Retenção D1:</strong> quem volta no dia seguinte → sinal de valor real</li>
          <li>• <strong>Conclusão O Louco:</strong> quem termina a lição + quiz → engajamento forte</li>
          <li>• <strong>Avanço para O Mago:</strong> quem quer continuar → desejo de profundidade</li>
          <li>• <strong>Premium gate:</strong> quem bate no gate → intenção de pagamento</li>
          <li>• <strong>Feedback espontâneo:</strong> quem manda feedback → comprometimento</li>
        </ul>
      </div>

      {/* Recent feedback */}
      {recentFeedback.length > 0 && (
        <div>
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3 flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5" />
            Feedback Recente
          </h3>
          <div className="space-y-2">
            {recentFeedback.map((fb, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/30 bg-card/30">
                <p className="text-xs text-foreground leading-relaxed">{fb.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                    {fb.type}
                  </span>
                  {fb.rating && (
                    <span className="text-[10px] text-muted-foreground">
                      {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                    </span>
                  )}
                  {fb.page && (
                    <span className="text-[10px] text-muted-foreground/50">{fb.page}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBetaMetrics;
