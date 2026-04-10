import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Crown, Gift, TrendingUp, UserPlus, 
  DollarSign, XCircle, BarChart3 
} from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    giftedUsers: 0,
    recentSignups: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, is_premium, premium_until, premium_source, created_at");

      if (!profiles) { setLoading(false); return; }

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const premium = profiles.filter(p => p.is_premium && (!p.premium_until || new Date(p.premium_until) > now));
      const gifted = premium.filter(p => p.premium_source === "gift" || p.premium_source === "admin");
      const recent = profiles.filter(p => new Date(p.created_at) >= weekAgo);

      setStats({
        totalUsers: profiles.length,
        premiumUsers: premium.length,
        freeUsers: profiles.length - premium.length,
        giftedUsers: gifted.length,
        recentSignups: recent.length,
        conversionRate: profiles.length > 0 ? Math.round((premium.length / profiles.length) * 100) : 0,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Carregando...</div>;

  const cards = [
    { icon: <Users className="w-5 h-5" />, label: "Total de Usuários", value: stats.totalUsers, color: "text-primary" },
    { icon: <Crown className="w-5 h-5" />, label: "Assinantes Ativos", value: stats.premiumUsers, color: "text-primary" },
    { icon: <Users className="w-5 h-5" />, label: "Usuários Gratuitos", value: stats.freeUsers, color: "text-muted-foreground" },
    { icon: <Gift className="w-5 h-5" />, label: "Presenteados", value: stats.giftedUsers, color: "text-primary" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Conversão Premium", value: `${stats.conversionRate}%`, color: "text-primary" },
    { icon: <UserPlus className="w-5 h-5" />, label: "Novos (7 dias)", value: stats.recentSignups, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg text-foreground">Visão Geral</h2>
        <p className="text-sm text-muted-foreground">Resumo operacional da plataforma.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="p-4 rounded-xl border border-border/50 bg-card/50 text-center">
            <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-heading text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-sm text-foreground font-medium mb-1">📊 Dados em tempo real</p>
        <p className="text-xs text-muted-foreground">
          Receita mensal, cancelamentos e reembolsos serão exibidos quando a integração de pagamento estiver ativa.
        </p>
      </div>
    </div>
  );
};

export default AdminOverview;
