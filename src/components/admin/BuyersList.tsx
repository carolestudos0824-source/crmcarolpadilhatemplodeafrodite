import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShieldCheck, UserCheck, UserX, Eye, Search, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Buyer = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  has_access: boolean;
  source: string | null;
  is_admin: boolean;
  user_created_at: string | null;
  access_created_at: string | null;
};

type Filter = "all" | "with" | "without" | "admins";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  } catch {
    return "—";
  }
}

export function BuyersList({
  onView,
  onSetAccess,
}: {
  onView: (b: Buyer) => void;
  onSetAccess: (b: Buyer, has: boolean) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Buyer[]>([]);
  const [error, setError] = useState<{ kind: "permission" | "unknown"; msg: string } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await (supabase as any).rpc("admin_list_buyers", { _limit: 50 });
    if (error) {
      const msg = error.message || "";
      const isPerm =
        error.code === "42501" ||
        /forbidden|permission denied|row-level security|rls/i.test(msg);
      setError({
        kind: isPerm ? "permission" : "unknown",
        msg: isPerm
          ? "Você não tem permissão para listar compradores. Verifique sua configuração de admin."
          : "Não foi possível carregar a lista agora.",
      });
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data as Buyer[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "with" && !r.has_access) return false;
      if (filter === "without" && r.has_access) return false;
      if (filter === "admins" && !r.is_admin) return false;
      if (q && !(r.email ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, filter, query]);

  const handleAccess = async (b: Buyer, has: boolean) => {
    setActingId(b.user_id);
    try {
      await onSetAccess(b, has);
      setRows((prev) =>
        prev.map((r) => (r.user_id === b.user_id ? { ...r, has_access: has } : r)),
      );
      toast.success(has ? "Acesso liberado." : "Acesso revogado.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha na operação.";
      toast.error(msg);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="glass-strong p-5">
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <h3 className="font-heading font-semibold text-sm">Últimos compradores e usuários</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Veja os usuários mais recentes e confira rapidamente quem tem acesso liberado.
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
            placeholder="Filtrar por e-mail"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {([
            ["all", "Todos"],
            ["with", "Com acesso"],
            ["without", "Sem acesso"],
            ["admins", "Admins"],
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
            <Loader2 size={16} className="animate-spin" /> Carregando compradores...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm px-4 py-3">
            {error.msg}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            {rows.length === 0 ? "Nenhum usuário encontrado ainda." : "Nenhum usuário com esses filtros."}
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((b) => (
              <li key={b.user_id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:flex-wrap">
                <div className="flex-1 min-w-0 sm:min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-foreground font-medium truncate max-w-full">{b.email ?? "—"}</span>
                    {b.is_admin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 inline-flex items-center gap-1">
                        <ShieldCheck size={10} /> admin
                      </span>
                    )}
                    {b.has_access ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        com acesso
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10">
                        sem acesso
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Criado em {fmtDate(b.user_created_at)} · Acesso: {fmtDate(b.access_created_at)}
                    {b.source ? ` · ${b.source}` : ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onView(b)}
                    className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/5 text-xs inline-flex items-center justify-center gap-1.5"
                    title="Ver"
                  >
                    <Eye size={14} /> Ver
                  </button>
                  {b.has_access ? (
                    <button
                      type="button"
                      disabled={actingId === b.user_id}
                      onClick={() => handleAccess(b, false)}
                      className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-200 hover:bg-rose-500/10 text-xs inline-flex items-center justify-center gap-1.5"
                    >
                      <UserX size={14} /> Revogar
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actingId === b.user_id}
                      onClick={() => handleAccess(b, true)}
                      className="btn-primary text-xs !px-3 !py-2"
                    >
                      <UserCheck size={14} /> Liberar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 text-[11px] text-muted-foreground">
          Mostrando os 50 registros mais recentes.
        </div>
      </div>
    </div>
  );
}
