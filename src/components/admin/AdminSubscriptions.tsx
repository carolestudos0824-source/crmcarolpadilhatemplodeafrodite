import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Users, Gift, TrendingUp } from "lucide-react";

interface SubscriptionStats {
  totalUsers: number;
  premiumUsers: number;
  giftedUsers: number;
  expiredUsers: number;
  conversionRate: number;
}

const AdminSubscriptions = () => {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, is_premium, premium_until, premium_source, created_at");

      if (!profiles) {
        setLoading(false);
        return;
      }

      const now = new Date();
      const premium = profiles.filter(p => p.is_premium && (!p.premium_until || new Date(p.premium_until) > now));
      const gifted = premium.filter(p => p.premium_source === "gift" || p.premium_source === "admin");
      const expired = profiles.filter(p => p.is_premium && p.premium_until && new Date(p.premium_until) <= now);

      setStats({
        totalUsers: profiles.length,
        premiumUsers: premium.length,
        giftedUsers: gifted.length,
        expiredUsers: expired.length,
        conversionRate: profiles.length > 0 ? Math.round((premium.length / profiles.length) * 100) : 0,
      });

      setSubscribers(
        profiles
          .filter(p => p.is_premium)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );
      setLoading(false);
    };

    fetch();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Carregando métricas...</div>;
  }

  const statCards = [
    { icon: <Users className="w-5 h-5" />, label: "Total de Usuários", value: stats?.totalUsers ?? 0 },
    { icon: <Crown className="w-5 h-5" />, label: "Assinantes Ativos", value: stats?.premiumUsers ?? 0 },
    { icon: <Gift className="w-5 h-5" />, label: "Presenteados", value: stats?.giftedUsers ?? 0 },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Conversão", value: `${stats?.conversionRate ?? 0}%` },
  ];

  const sourceLabel = (source: string | null) => {
    if (source === "gift") return "Presente";
    if (source === "admin") return "Admin";
    if (source === "stripe") return "Stripe";
    return source || "—";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Assinaturas</h2>
        <p className="text-sm text-muted-foreground">Métricas comerciais e gestão de assinantes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
              {stat.icon}
            </div>
            <p className="text-2xl font-heading text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Subscriber list */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Assinantes</h3>
        {subscribers.length === 0 ? (
          <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
            <Crown className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum assinante ainda.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Usuário</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Origem</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Válido até</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => {
                  const now = new Date();
                  const until = sub.premium_until ? new Date(sub.premium_until) : null;
                  const isActive = !until || until > now;
                  return (
                    <tr key={sub.user_id} className="border-b border-border/10 last:border-0">
                      <td className="p-3 text-foreground">{sub.display_name || "Sem nome"}</td>
                      <td className="p-3 text-center text-muted-foreground">{sourceLabel(sub.premium_source)}</td>
                      <td className="p-3 text-center text-muted-foreground">
                        {until ? until.toLocaleDateString("pt-BR") : "Ilimitado"}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${
                          isActive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                        }`}>
                          {isActive ? "Ativo" : "Expirado"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;
