import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, RefreshCw, Users, Eye, CalendarDays, BarChart3, Clock } from "lucide-react";

type Metrics = {
  online_now: number;
  today_views: number;
  views_7d: number;
  views_30d: number;
  active_today: number;
  active_7d: number;
};

type OnlineUser = {
  user_id: string;
  email: string | null;
  last_seen_at: string;
  last_route: string | null;
  last_module: string | null;
};

type RecentEvent = {
  id: string;
  user_id: string;
  email: string | null;
  route: string;
  module: string | null;
  event_type: string;
  created_at: string;
};

type TopModule = { module: string; total: number };

const ONLINE_WINDOWS = [2, 5, 10] as const;
const PERIOD_DAYS = [7, 30, 90] as const;

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function EventBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    page_view: "admin-badge admin-badge-info",
    module_open: "admin-badge admin-badge-success",
    session_start: "admin-badge admin-badge-muted",
  };
  return <span className={map[type] ?? "admin-badge admin-badge-muted"}>{type}</span>;
}

export default function ProgramMetricsPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [recent, setRecent] = useState<RecentEvent[]>([]);
  const [topModules, setTopModules] = useState<TopModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [onlineWindow, setOnlineWindow] = useState<number>(5);
  const [periodDays, setPeriodDays] = useState<number>(30);

  const load = useCallback(async () => {
    setError(null);
    setForbidden(false);
    try {
      const [m, o, r, t] = await Promise.all([
        supabase.rpc("admin_get_program_metrics"),
        supabase.rpc("admin_list_online_users", { _window_minutes: onlineWindow, _limit: 100 }),
        supabase.rpc("admin_list_recent_activity", { _limit: 50 }),
        supabase.rpc("admin_top_modules", { _period_days: periodDays, _limit: 10 }),
      ]);

      const firstErr = [m.error, o.error, r.error, t.error].find(Boolean);
      if (firstErr) {
        const msg = String(firstErr.message ?? "");
        if (/forbidden/i.test(msg)) {
          setForbidden(true);
          return;
        }
        setError(msg || "Falha ao carregar métricas.");
        return;
      }

      setMetrics(m.data as unknown as Metrics);
      setOnline((o.data ?? []) as OnlineUser[]);
      setRecent((r.data ?? []) as RecentEvent[]);
      setTopModules((t.data ?? []) as TopModule[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    }
  }, [onlineWindow, periodDays]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (forbidden) {
    return (
      <div className="admin-alert admin-alert-danger">
        Acesso negado. Esta seção requer perfil de administrador.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-kpi animate-pulse">
              <div className="h-3 w-20 bg-white/5 rounded" />
              <div className="h-7 w-14 bg-white/10 rounded mt-2" />
            </div>
          ))}
        </div>
        <div className="admin-card animate-pulse h-40" />
      </div>
    );
  }

  return (
    <div className="admin-section">
      {error && <div className="admin-alert admin-alert-warning">{error}</div>}

      {/* Controles */}
      <div className="admin-card flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Janela "online"</label>
          <select
            className="admin-input"
            value={onlineWindow}
            onChange={(e) => setOnlineWindow(Number(e.target.value))}
          >
            {ONLINE_WINDOWS.map((w) => (
              <option key={w} value={w}>{w} min</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Período (top módulos)</label>
          <select
            className="admin-input"
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
          >
            {PERIOD_DAYS.map((d) => (
              <option key={d} value={d}>{d} dias</option>
            ))}
          </select>
        </div>
        <div className="sm:ml-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--admin-border-strong))] bg-[hsl(var(--admin-surface-3))] hover:border-accent/40 text-sm transition disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Atualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi icon={<Activity size={14} />} label="Online agora" value={metrics?.online_now ?? 0} />
        <Kpi icon={<Eye size={14} />} label="Acessos hoje" value={metrics?.today_views ?? 0} />
        <Kpi icon={<CalendarDays size={14} />} label="Acessos 7d" value={metrics?.views_7d ?? 0} />
        <Kpi icon={<CalendarDays size={14} />} label="Acessos 30d" value={metrics?.views_30d ?? 0} />
        <Kpi icon={<Users size={14} />} label="Ativos hoje" value={metrics?.active_today ?? 0} />
        <Kpi icon={<Users size={14} />} label="Ativos 7d" value={metrics?.active_7d ?? 0} />
      </div>

      {/* Online agora */}
      <section className="admin-card">
        <header className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-heading font-semibold flex items-center gap-2">
              <Activity size={14} className="text-accent" /> Usuários online agora
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Online é uma estimativa baseada em atividade recente nos últimos {onlineWindow} minutos.
            </p>
          </div>
          <span className="admin-badge admin-badge-info">{online.length}</span>
        </header>
        {online.length === 0 ? (
          <div className="admin-empty">
            <Activity size={18} className="text-muted-foreground" />
            <div className="admin-empty-title">Ninguém online no momento</div>
            <div className="admin-empty-hint">Os usuários aparecem aqui enquanto navegam pela área interna.</div>
          </div>
        ) : (
          <ul className="space-y-2">
            {online.map((u) => (
              <li
                key={u.user_id}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[hsl(var(--admin-surface-1))] border border-[hsl(var(--admin-border-subtle))]"
              >
                <div className="min-w-0">
                  <div className="text-sm text-foreground/90 truncate">{u.email ?? "—"}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {(u.last_module ?? "programa")} · {u.last_route ?? "—"}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0">
                  <Clock size={11} /> {formatRelative(u.last_seen_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Top módulos */}
      <section className="admin-card">
        <header className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-heading font-semibold flex items-center gap-2">
            <BarChart3 size={14} className="text-accent" /> Módulos mais acessados
          </h2>
          <span className="admin-badge admin-badge-muted">{periodDays} dias</span>
        </header>
        {topModules.length === 0 ? (
          <div className="admin-empty">
            <BarChart3 size={18} className="text-muted-foreground" />
            <div className="admin-empty-title">Sem dados de módulos no período</div>
          </div>
        ) : (
          <ul className="space-y-2">
            {topModules.map((m) => {
              const max = Math.max(...topModules.map((x) => Number(x.total)));
              const pct = max > 0 ? Math.round((Number(m.total) / max) * 100) : 0;
              return (
                <li key={m.module} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-foreground/85 truncate">{m.module}</div>
                  <div className="flex-1 h-2 rounded-full bg-[hsl(var(--admin-surface-3))] overflow-hidden">
                    <div className="h-full bg-accent/70" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-12 text-right text-xs tabular-nums text-muted-foreground">{m.total}</div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Últimos acessos */}
      <section>
        <header className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-heading font-semibold">Últimos acessos</h2>
          <span className="admin-badge admin-badge-muted">{recent.length}</span>
        </header>
        {recent.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-title">Sem acessos recentes</div>
          </div>
        ) : (
          <div className="admin-table-wrapper overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Módulo</th>
                  <th>Rota</th>
                  <th>Evento</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e.id}>
                    <td className="max-w-[220px] truncate">{e.email ?? "—"}</td>
                    <td className="text-muted-foreground">{e.module ?? "—"}</td>
                    <td className="max-w-[260px] truncate text-foreground/80">{e.route}</td>
                    <td><EventBadge type={e.event_type} /></td>
                    <td className="text-muted-foreground text-xs whitespace-nowrap">{formatDateTime(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="admin-kpi">
      <div className="admin-kpi-label flex items-center gap-1.5">
        <span className="text-accent">{icon}</span> {label}
      </div>
      <div className="admin-kpi-value">{value.toLocaleString("pt-BR")}</div>
    </div>
  );
}
