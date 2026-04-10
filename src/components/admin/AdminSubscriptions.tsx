import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Crown, Users, Gift, TrendingUp, TrendingDown, DollarSign,
  ArrowUpRight, CalendarDays, Filter, RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ═══════════ TYPES ═══════════ */

type SubStatus =
  | "monthly_active"
  | "annual_active"
  | "gift_active"
  | "expired"
  | "cancelled_with_access"
  | "cancelled_expired"
  | "free";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  is_premium: boolean;
  premium_until: string | null;
  premium_source: string | null;
  created_at: string;
}

function resolveStatus(p: ProfileRow, now: Date): SubStatus {
  const until = p.premium_until ? new Date(p.premium_until) : null;
  if (!p.is_premium && !until) return "free";
  if (!p.is_premium && until && until > now) return "cancelled_with_access";
  if (!p.is_premium && until && until <= now) return "cancelled_expired";
  if (p.is_premium && until && until <= now) return "expired";
  if (p.is_premium && (p.premium_source === "gift" || p.premium_source === "admin")) return "gift_active";
  if (p.is_premium && p.premium_source === "store_annual") return "annual_active";
  if (p.is_premium) return "monthly_active";
  return "free";
}

const STATUS_LABELS: Record<SubStatus, string> = {
  monthly_active: "Mensal ativo",
  annual_active: "Anual ativo",
  gift_active: "Presenteado",
  expired: "Expirado",
  cancelled_with_access: "Cancelado (com acesso)",
  cancelled_expired: "Cancelado",
  free: "Gratuito",
};

const STATUS_COLORS: Record<SubStatus, string> = {
  monthly_active: "bg-green-500/10 text-green-600",
  annual_active: "bg-emerald-500/10 text-emerald-600",
  gift_active: "bg-purple-500/10 text-purple-600",
  expired: "bg-red-500/10 text-red-500",
  cancelled_with_access: "bg-amber-500/10 text-amber-600",
  cancelled_expired: "bg-red-500/10 text-red-400",
  free: "bg-muted text-muted-foreground",
};

const SOURCE_LABELS: Record<string, string> = {
  store_monthly: "Loja (mensal)",
  store_annual: "Loja (anual)",
  gift: "Presente",
  admin: "Admin",
};

const MONTHLY_PRICE = 29.9;
const ANNUAL_PRICE = 197;

/* ═══════════ PERIOD FILTER ═══════════ */

type PeriodFilter = "all" | "30d" | "90d" | "12m";
type PlanFilter = "all" | "monthly" | "annual" | "gift" | "free";
type StatusFilter = "all" | "active" | "expired" | "cancelled";

/* ═══════════ COMPONENT ═══════════ */

const AdminSubscriptions = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, is_premium, premium_until, premium_source, created_at");
      if (data) setProfiles(data);
      setLoading(false);
    };
    load();
  }, []);

  const now = useMemo(() => new Date(), []);

  const enriched = useMemo(() => {
    return profiles.map(p => ({ ...p, status: resolveStatus(p, now) }));
  }, [profiles, now]);

  /* ─── Filters ─── */
  const filtered = useMemo(() => {
    let list = enriched;

    // Period
    if (periodFilter !== "all") {
      const days = periodFilter === "30d" ? 30 : periodFilter === "90d" ? 90 : 365;
      const cutoff = new Date(now.getTime() - days * 86400000);
      list = list.filter(p => new Date(p.created_at) >= cutoff);
    }

    // Plan
    if (planFilter === "monthly") list = list.filter(p => p.premium_source === "store_monthly");
    else if (planFilter === "annual") list = list.filter(p => p.premium_source === "store_annual");
    else if (planFilter === "gift") list = list.filter(p => p.premium_source === "gift" || p.premium_source === "admin");
    else if (planFilter === "free") list = list.filter(p => p.status === "free");

    // Status
    if (statusFilter === "active") list = list.filter(p => ["monthly_active", "annual_active", "gift_active", "cancelled_with_access"].includes(p.status));
    else if (statusFilter === "expired") list = list.filter(p => ["expired", "cancelled_expired"].includes(p.status));
    else if (statusFilter === "cancelled") list = list.filter(p => ["cancelled_with_access", "cancelled_expired"].includes(p.status));

    return list;
  }, [enriched, periodFilter, planFilter, statusFilter, now]);

  /* ─── Aggregated stats (always from full data, not filtered) ─── */
  const stats = useMemo(() => {
    const monthlyActive = enriched.filter(p => p.status === "monthly_active").length;
    const annualActive = enriched.filter(p => p.status === "annual_active").length;
    const giftActive = enriched.filter(p => p.status === "gift_active").length;
    const cancelledAccess = enriched.filter(p => p.status === "cancelled_with_access").length;
    const expired = enriched.filter(p => p.status === "expired").length;
    const cancelledExpired = enriched.filter(p => p.status === "cancelled_expired").length;
    const free = enriched.filter(p => p.status === "free").length;

    const activeTotal = monthlyActive + annualActive + giftActive + cancelledAccess;
    const inactiveTotal = expired + cancelledExpired;
    const totalPaying = monthlyActive + annualActive;
    const mrr = (monthlyActive * MONTHLY_PRICE) + (annualActive * (ANNUAL_PRICE / 12));
    const conversionRate = enriched.length > 0 ? Math.round((activeTotal / enriched.length) * 100) : 0;

    return {
      monthlyActive, annualActive, giftActive, cancelledAccess,
      expired, cancelledExpired, free,
      activeTotal, inactiveTotal, totalPaying, mrr, conversionRate,
      total: enriched.length,
    };
  }, [enriched]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Carregando métricas comerciais...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-heading text-lg text-foreground">Área Comercial</h2>
        <p className="text-sm text-muted-foreground">Receita, assinantes, conversão e controle de acesso.</p>
      </div>

      {/* ═══════════ KPI CARDS ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard icon={<DollarSign className="w-4 h-4" />} label="Receita Mensal (MRR)" value={`R$ ${stats.mrr.toFixed(2)}`} accent="text-green-600" />
        <KPICard icon={<Crown className="w-4 h-4" />} label="Assinaturas Ativas" value={stats.activeTotal} accent="text-primary" />
        <KPICard icon={<TrendingUp className="w-4 h-4" />} label="Conversão" value={`${stats.conversionRate}%`} accent="text-blue-500" />
        <KPICard icon={<Users className="w-4 h-4" />} label="Total de Usuários" value={stats.total} />
      </div>

      {/* ═══════════ BREAKDOWN ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <MiniStat label="Mensal" value={stats.monthlyActive} color="bg-green-500/10 text-green-600" />
        <MiniStat label="Anual" value={stats.annualActive} color="bg-emerald-500/10 text-emerald-600" />
        <MiniStat label="Presenteado" value={stats.giftActive} color="bg-purple-500/10 text-purple-600" />
        <MiniStat label="Canc. c/ acesso" value={stats.cancelledAccess} color="bg-amber-500/10 text-amber-600" />
        <MiniStat label="Expirado" value={stats.expired} color="bg-red-500/10 text-red-500" />
        <MiniStat label="Cancelado" value={stats.cancelledExpired} color="bg-red-500/10 text-red-400" />
        <MiniStat label="Gratuito" value={stats.free} color="bg-muted text-muted-foreground" />
      </div>

      {/* ═══════════ FILTERS ═══════════ */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
        </div>
        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <CalendarDays className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo período</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="12m">Último ano</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os planos</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="annual">Anual</SelectItem>
            <SelectItem value="gift">Presente</SelectItem>
            <SelectItem value="free">Gratuito</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>

        {(periodFilter !== "all" || planFilter !== "all" || statusFilter !== "all") && (
          <button
            onClick={() => { setPeriodFilter("all"); setPlanFilter("all"); setStatusFilter("all"); }}
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Limpar
          </button>
        )}

        <span className="text-[10px] text-muted-foreground ml-auto">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ═══════════ SUBSCRIBER TABLE ═══════════ */}
      <div>
        <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Detalhamento</h3>

        {filtered.length === 0 ? (
          <div className="p-8 rounded-xl border border-border/50 bg-card/30 text-center">
            <Crown className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum resultado para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 text-xs text-muted-foreground font-medium">Usuário</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Plano</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Origem</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Válido até</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-center p-3 text-xs text-muted-foreground font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .sort((a, b) => {
                    // Active first, then by date desc
                    const order: Record<SubStatus, number> = {
                      monthly_active: 0, annual_active: 0, gift_active: 0,
                      cancelled_with_access: 1, expired: 2, cancelled_expired: 3, free: 4,
                    };
                    const diff = order[a.status] - order[b.status];
                    if (diff !== 0) return diff;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  })
                  .map((sub) => {
                    const until = sub.premium_until ? new Date(sub.premium_until) : null;
                    return (
                      <tr key={sub.user_id} className="border-b border-border/10 last:border-0 hover:bg-card/80 transition-colors">
                        <td className="p-3 text-foreground font-medium">{sub.display_name || "Sem nome"}</td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {sub.status === "free" ? "—" : sub.premium_source === "store_annual" ? "Anual" : sub.premium_source === "store_monthly" ? "Mensal" : "Presente"}
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {SOURCE_LABELS[sub.premium_source || ""] || "—"}
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {until ? until.toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[sub.status]}`}>
                            {STATUS_LABELS[sub.status]}
                          </span>
                        </td>
                        <td className="p-3 text-center text-muted-foreground text-xs">
                          {new Date(sub.created_at).toLocaleDateString("pt-BR")}
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

/* ═══════════ SUB-COMPONENTS ═══════════ */

const KPICard = ({
  icon, label, value, accent = "text-foreground",
}: {
  icon: React.ReactNode; label: string; value: string | number; accent?: string;
}) => (
  <div className="p-4 rounded-xl border border-border/50 bg-card/50">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
    </div>
    <p className={`text-xl font-heading ${accent}`}>{value}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const MiniStat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-2.5 rounded-lg border border-border/30 bg-card/30 text-center">
    <span className={`text-[10px] font-heading tracking-wide px-1.5 py-0.5 rounded-full ${color}`}>{value}</span>
    <p className="text-[9px] text-muted-foreground mt-1">{label}</p>
  </div>
);

export default AdminSubscriptions;
