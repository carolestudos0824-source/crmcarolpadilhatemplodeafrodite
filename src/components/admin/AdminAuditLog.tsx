import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Search, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/promiseTimeout";

type AuditLog = {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_label: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

type Filter = "all" | "access" | "codes" | "today" | "mine";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

const ACTION_LABEL: Record<string, string> = {
  grant_access: "Acesso liberado",
  revoke_access: "Acesso revogado",
  self_grant: "Teste admin liberado",
  create_gift_code: "Código premium criado",
  activate_gift_code: "Código premium ativado",
  deactivate_gift_code: "Código premium desativado",
  update_gift_code: "Código premium atualizado",
  copy_gift_code: "Código premium copiado",
  view_gift_code: "Código premium visualizado",
};

const ACCESS_ACTIONS = new Set(["grant_access", "revoke_access", "self_grant"]);
const CODE_ACTIONS = new Set([
  "create_gift_code",
  "activate_gift_code",
  "deactivate_gift_code",
  "update_gift_code",
  "copy_gift_code",
  "view_gift_code",
]);

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
function isToday(iso: string) {
  try {
    const d = new Date(iso); const n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  } catch { return false; }
}

function summarize(log: AuditLog): string {
  const d = log.details ?? {};
  if (ACCESS_ACTIONS.has(log.action)) {
    const prev = d.previous_has_access;
    const next = d.new_has_access;
    if (typeof prev === "boolean" && typeof next === "boolean") {
      return `${prev ? "ativo" : "sem acesso"} → ${next ? "ativo" : "sem acesso"}`;
    }
    return "—";
  }
  if (CODE_ACTIONS.has(log.action)) {
    const parts: string[] = [];
    if (typeof d.duration_days === "number") parts.push(`${d.duration_days}d`);
    if (typeof d.max_uses === "number") parts.push(`${d.max_uses} usos`);
    if (typeof d.previous_is_active === "boolean" && typeof d.new_is_active === "boolean") {
      parts.push(`${d.previous_is_active ? "ativo" : "inativo"} → ${d.new_is_active ? "ativo" : "inativo"}`);
    }
    return parts.join(" · ") || "—";
  }
  return "—";
}

export function AdminAuditLog({ refreshKey = 0 }: { refreshKey?: number }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [error, setError] = useState<{ kind: "permission" | "unknown"; msg: string } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [myId, setMyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [{ data: userData }, res] = await withTimeout<any>(Promise.all([
      Promise.resolve(supabase.auth.getUser()).catch(() => ({ data: { user: null } })),
      Promise.resolve((supabase as any).rpc("admin_list_admin_audit_logs", { _limit: 50 })).catch((e: unknown) => ({ data: null, error: e })),
    ]), 10000, "log admin").catch((e) => ([
      { data: { user: null } },
      { data: null, error: e },
    ]));
    setMyId(userData.user?.id ?? null);
    if (res.error) {
      const msg = res.error.message || "";
      const isPerm = res.error.code === "42501" || /forbidden|permission|row-level|rls/i.test(msg);
      setError({
        kind: isPerm ? "permission" : "unknown",
        msg: isPerm
          ? "Você não tem permissão para ver o log admin."
          : "Não foi possível carregar o log agora.",
      });
      setRows([]);
    } else {
      setRows((res.data as AuditLog[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "access" && !ACCESS_ACTIONS.has(r.action)) return false;
      if (filter === "codes" && !CODE_ACTIONS.has(r.action)) return false;
      if (filter === "today" && !isToday(r.created_at)) return false;
      if (filter === "mine" && r.admin_id !== myId) return false;
      if (q) {
        const hay = [r.action, r.admin_email ?? "", r.target_label ?? "", r.target_type ?? ""]
          .join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filter, query, myId]);

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
            <Activity size={14} /> Log de ações admin
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ações administrativas sensíveis registradas em <code className="text-foreground/80">admin_audit_log</code>.
          </p>
        </div>
        <button type="button" onClick={load} className="btn-ghost border border-white/15 text-xs">
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className={inputCls + " pl-8"}
            placeholder="Filtrar por ação, admin ou alvo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {([
            ["all", "Todos"],
            ["access", "Acessos"],
            ["codes", "Códigos premium"],
            ["today", "Hoje"],
            ["mine", "Meu admin"],
          ] as [Filter, string][]).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`px-3 py-2 rounded-xl text-xs border transition ${
                filter === k
                  ? "bg-accent/15 border-accent/50 text-accent"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
            <Loader2 size={16} className="animate-spin" /> Carregando log admin...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm px-4 py-3">
            {error.msg}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            {rows.length === 0
              ? "Nenhuma ação administrativa registrada ainda."
              : "Nenhum registro com esses filtros."}
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((r) => {
              const label = ACTION_LABEL[r.action] ?? r.action;
              const isAccess = ACCESS_ACTIONS.has(r.action);
              const tone = isAccess
                ? r.action === "revoke_access"
                  ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-accent/10 text-accent border-accent/30";
              return (
                <li key={r.id} className="py-3 flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tone}`}>{label}</span>
                      <span className="text-sm text-foreground font-medium truncate">
                        {r.target_label ?? r.target_type ?? "—"}
                      </span>
                      {r.target_type && (
                        <span className="text-[10px] text-muted-foreground">[{r.target_type}]</span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {fmtDateTime(r.created_at)} · por {r.admin_email ?? "admin"} · {summarize(r)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-3 text-[11px] text-muted-foreground">
          Mostrando os 50 registros mais recentes.
        </div>
      </div>
    </div>
  );
}
