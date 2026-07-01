import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, Eye, Copy, UserCheck, UserX, Filter as FilterIcon, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/lib/promiseTimeout";
import { BuyerDetailsDrawer, MSG_FIRST_LOGIN } from "./BuyerDetailsDrawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Row returned by RPC admin_list_buyers_overview
type BuyerOverviewRow = {
  email: string;
  buyer_name: string | null;
  user_id: string | null;
  has_access: boolean;
  access_source: string | null;
  access_updated_at: string | null;
  access_expires_at: string | null;
  user_created_at: string | null;
  origin: "sale_only" | "user_only" | "mixed";
  sales_count: number;
  paid_confirmed_count: number;
  pending_count: number;
  refunded_count: number;
  cancelled_count: number;
  total_paid_confirmed: number;
  last_sale_id: string | null;
  last_sale_at: string | null;
  last_payment_status: string | null;
  last_access_status: string | null;
  sort_at: string;
};

export type ConsolidatedBuyer = {
  key: string;
  email: string | null;
  buyer_name: string | null;
  user_id: string | null;
  has_access: boolean;
  source: string | null;
  source_label: string;
  sale_id: string | null;
  amount: number | null;
  currency: string;
  payment_status: string | null;
  payment_status_label: string;
  access_status: string | null;
  access_status_label: string;
  payment_method: string | null;
  payment_reference: string | null;
  admin_notes: string | null;
  sale_created_at: string | null;
  access_granted_at: string | null;
  access_revoked_at: string | null;
  user_created_at: string | null;
  next_step: string;
  is_admin: boolean;
  sales_count: number;
  origin: string;
  total_paid_confirmed: number;
};

const PAYMENT_LABELS: Record<string, string> = {
  paid_confirmed: "Pagamento confirmado",
  pending_confirmation: "Aguardando confirmação",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};
const ACCESS_LABELS: Record<string, string> = {
  pending_access: "Aguardando liberação",
  access_granted: "Acesso liberado",
  access_revoked: "Acesso revogado",
};
const SOURCE_LABELS: Record<string, string> = {
  manual_sale: "Venda manual",
  manual: "Ajuste admin",
  gift: "Código premium",
  courtesy: "Cortesia",
  internal_test: "Teste interno",
};

function labelSource(s: string | null) {
  if (!s) return "Desconhecida";
  return SOURCE_LABELS[s] ?? s;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  } catch {
    return "—";
  }
}

function fmtMoney(amount: number | null, currency = "BRL") {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(amount));
  } catch {
    return `R$ ${Number(amount).toFixed(2)}`;
  }
}

function computeAccessLabel(r: BuyerOverviewRow): string {
  if (r.has_access) return "Acesso liberado";
  if (r.last_access_status === "access_revoked") return "Acesso revogado";
  if (r.paid_confirmed_count > 0 && !r.user_id) return "Aguardando primeiro login";
  if (r.paid_confirmed_count > 0) return "Aguardando liberação";
  return "Sem acesso";
}

function computeNextStep(r: BuyerOverviewRow, label: string): string {
  if (r.has_access) return "Acesso já liberado";
  if (r.last_payment_status === "refunded" || r.last_payment_status === "cancelled") return "Verifique pagamento";
  if (label === "Acesso revogado") return "Acesso revogado";
  if (r.paid_confirmed_count > 0 && !r.user_id) return "Peça primeiro login com o mesmo e-mail";
  if (r.paid_confirmed_count > 0 && r.user_id) return "Clique em liberar acesso";
  if (r.last_payment_status === "pending_confirmation") return "Verifique pagamento";
  if (!r.last_sale_id && !r.user_id) return "Venda não localizada";
  return "Revisar manualmente";
}

function rowToConsolidated(r: BuyerOverviewRow): ConsolidatedBuyer {
  const key = r.email.toLowerCase();
  const accessLabel = computeAccessLabel(r);
  return {
    key,
    email: r.email,
    buyer_name: r.buyer_name,
    user_id: r.user_id,
    has_access: r.has_access,
    source: r.access_source,
    source_label: labelSource(r.access_source),
    sale_id: r.last_sale_id,
    amount: null,
    currency: "BRL",
    payment_status: r.last_payment_status,
    payment_status_label: r.last_payment_status
      ? PAYMENT_LABELS[r.last_payment_status] ?? r.last_payment_status
      : "Não registrado",
    access_status: r.last_access_status,
    access_status_label: accessLabel,
    payment_method: null,
    payment_reference: null,
    admin_notes: null,
    sale_created_at: r.last_sale_at,
    access_granted_at: r.has_access ? r.access_updated_at : null,
    access_revoked_at: r.last_access_status === "access_revoked" ? null : null,
    user_created_at: r.user_created_at,
    next_step: computeNextStep(r, accessLabel),
    is_admin: false,
    sales_count: r.sales_count,
    origin: r.origin,
    total_paid_confirmed: Number(r.total_paid_confirmed ?? 0),
  };
}

async function copy(text: string, label = "Copiado.") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

const PAGE_SIZE = 50;

type Cursor = { sort_at: string; email: string } | null;

export function BuyersPanel({ onGoToSales }: { onGoToSales?: (saleId?: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BuyerOverviewRow[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState<ConsolidatedBuyer | null>(null);
  const [acting, setActing] = useState(false);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [fPay, setFPay] = useState<string>("all");
  const [fAccess, setFAccess] = useState<string>("all");
  const [fSource, setFSource] = useState<string>("all");
  const [fPeriod, setFPeriod] = useState<string>("all");
  const [confirmRevoke, setConfirmRevoke] = useState<ConsolidatedBuyer | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const reqIdRef = useRef(0);

  const load = useCallback(
    async (mode: "reset" | "more") => {
      const reqId = ++reqIdRef.current;
      if (mode === "reset") {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const periodDays =
        fPeriod === "7d" ? 7 : fPeriod === "30d" ? 30 : fPeriod === "90d" ? 90 : null;

      const params: Record<string, unknown> = {
        _limit: PAGE_SIZE + 1,
        _search: debouncedQ || null,
        _payment_status: fPay === "all" ? null : fPay,
        _access_filter: fAccess === "all" ? null : fAccess,
        _source: fSource === "all" ? null : fSource,
        _period_days: periodDays,
        _before_sort_at: mode === "more" && cursor ? cursor.sort_at : null,
        _before_email: mode === "more" && cursor ? cursor.email : null,
      };

      const res = await withTimeout<any>(
        (supabase as any).rpc("admin_list_buyers_overview", params),
        12000,
        "compradores",
      ).catch((e) => ({ data: null, error: e }));

      if (reqId !== reqIdRef.current) return; // stale

      if (res.error) {
        if (mode === "reset") {
          setError("Não foi possível carregar compradores.");
          setRows([]);
          setHasMore(false);
          setCursor(null);
        } else {
          toast.error("Não foi possível carregar mais resultados.");
        }
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const data = (res.data as BuyerOverviewRow[]) ?? [];
      const more = data.length > PAGE_SIZE;
      const pageData = more ? data.slice(0, PAGE_SIZE) : data;

      setHasMore(more);
      const last = pageData[pageData.length - 1];
      setCursor(last ? { sort_at: last.sort_at, email: last.email.toLowerCase() } : null);

      if (mode === "reset") {
        setRows(pageData);
        setLoading(false);
      } else {
        setRows((prev) => {
          const seen = new Set(prev.map((r) => r.email.toLowerCase()));
          const merged = [...prev];
          for (const r of pageData) {
            if (!seen.has(r.email.toLowerCase())) merged.push(r);
          }
          return merged;
        });
        setLoadingMore(false);
      }
    },
    [debouncedQ, fPay, fAccess, fSource, fPeriod, cursor],
  );

  // Reset + reload whenever filters change
  useEffect(() => {
    setCursor(null);
    // call with mode reset; we ignore the cursor inside because mode=reset forces null
    load("reset");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, fPay, fAccess, fSource, fPeriod]);

  const consolidated = useMemo<ConsolidatedBuyer[]>(
    () => rows.map(rowToConsolidated),
    [rows],
  );

  const grant = async (b: ConsolidatedBuyer) => {
    if (!b.user_id) {
      toast.error("Sem login criado. Peça primeiro login com o mesmo e-mail.");
      return;
    }
    setActing(true);
    try {
      const { data, error } = await supabase.rpc("admin_set_access", {
        _user_id: b.user_id,
        _has_access: true,
      });
      if (error) throw new Error(error.message);
      const r = data as { success?: boolean; error?: string } | null;
      if (!r?.success) throw new Error(r?.error ?? "Falha.");
      toast.success("Acesso liberado.");
      await load("reset");
      setSelected((s) => (s ? { ...s, has_access: true, access_status_label: "Acesso liberado" } : null));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setActing(false);
    }
  };

  const revoke = (b: ConsolidatedBuyer) => {
    if (!b.user_id) return;
    setConfirmRevoke(b);
  };

  const performRevoke = async (b: ConsolidatedBuyer) => {
    if (!b.user_id) return;
    setActing(true);
    try {
      const { data, error } = await supabase.rpc("admin_set_access", {
        _user_id: b.user_id,
        _has_access: false,
      });
      if (error) throw new Error(error.message);
      const r = data as { success?: boolean; error?: string } | null;
      if (!r?.success) throw new Error(r?.error ?? "Falha.");
      toast.success("Acesso revogado.");
      await load("reset");
      setSelected((s) => (s ? { ...s, has_access: false, access_status_label: "Acesso revogado" } : null));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setActing(false);
      setConfirmRevoke(null);
    }
  };

  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.access_source && set.add(r.access_source));
    return Array.from(set);
  }, [rows]);

  const clearFilters = () => {
    setQ("");
    setFPay("all");
    setFAccess("all");
    setFSource("all");
    setFPeriod("all");
  };

  return (
    <div className="space-y-4">
      <div className="admin-card p-5">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div>
            <h3 className="font-heading font-semibold text-sm">Compradores</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visão consolidada por e-mail, com paginação e contador de vendas.
            </p>
          </div>
          <button onClick={() => load("reset")} className="btn-ghost border border-white/15 text-xs">
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
          <div className="relative md:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="admin-input pl-8"
              placeholder="Buscar por e-mail ou nome"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="admin-input" value={fPay} onChange={(e) => setFPay(e.target.value)}>
            <option value="all">Pagamento: todos</option>
            <option value="paid_confirmed">Pago</option>
            <option value="pending_confirmation">Aguardando</option>
            <option value="refunded">Reembolsado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <select className="admin-input" value={fAccess} onChange={(e) => setFAccess(e.target.value)}>
            <option value="all">Acesso: todos</option>
            <option value="granted">Liberado</option>
            <option value="awaiting_login">Aguardando 1º login</option>
            <option value="awaiting_grant">Aguardando liberação</option>
            <option value="revoked">Revogado</option>
            <option value="none">Sem acesso</option>
          </select>
          <select className="admin-input" value={fSource} onChange={(e) => setFSource(e.target.value)}>
            <option value="all">Origem: todas</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>{labelSource(s)}</option>
            ))}
          </select>
          <select className="admin-input" value={fPeriod} onChange={(e) => setFPeriod(e.target.value)}>
            <option value="all">Período: tudo</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <FilterIcon size={11} /> {consolidated.length} comprador(es){hasMore ? " (há mais)" : ""}
          </span>
          <button onClick={clearFilters} className="text-[11px] text-muted-foreground hover:text-foreground underline">
            Limpar filtros
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 size={16} className="animate-spin" /> Carregando compradores...
          </div>
        ) : error ? (
          <div className="admin-alert admin-alert-warning space-y-2">
            <div>{error}</div>
            <div className="flex gap-2">
              <button onClick={() => load("reset")} className="px-3 py-1.5 rounded-lg border border-amber-400/40 text-xs">
                Tentar novamente
              </button>
            </div>
          </div>
        ) : consolidated.length === 0 ? (
          <div className="admin-empty">
            <Search className="text-muted-foreground" size={24} />
            <p className="admin-empty-title">Nenhum comprador encontrado</p>
            <p className="admin-empty-hint">Ajuste a busca ou os filtros acima para ver outros compradores.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <div className="overflow-x-auto">
                <table className="admin-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>E-mail / Nome</th>
                      <th>Vendas</th>
                      <th className="text-right">Total pago</th>
                      <th>Última venda</th>
                      <th>Acesso</th>
                      <th>Origem</th>
                      <th>Data</th>
                      <th>Próximo passo</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidated.map((c) => (
                      <tr key={c.key}>
                        <td>
                          <div className="font-medium text-foreground truncate max-w-[220px]">{c.email ?? "—"}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                            {c.buyer_name ?? "Sem nome"}
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge admin-badge-muted">
                            {c.sales_count} venda{c.sales_count === 1 ? "" : "s"}
                          </span>
                        </td>
                        <td className="text-right whitespace-nowrap tabular-nums">
                          {c.total_paid_confirmed > 0 ? fmtMoney(c.total_paid_confirmed, c.currency) : "—"}
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            c.payment_status === "paid_confirmed" ? "admin-badge-success"
                            : c.payment_status === "pending_confirmation" ? "admin-badge-warning"
                            : c.payment_status === "cancelled" ? "admin-badge-danger"
                            : "admin-badge-muted"
                          }`}>{c.payment_status_label}</span>
                        </td>
                        <td>
                          <span className={`admin-badge ${
                            c.has_access ? "admin-badge-success"
                            : c.access_status_label === "Acesso revogado" ? "admin-badge-danger"
                            : c.access_status_label.startsWith("Aguardando") ? "admin-badge-warning"
                            : "admin-badge-muted"
                          }`}>{c.access_status_label}</span>
                        </td>
                        <td><span className="admin-badge admin-badge-info">{c.source_label}</span></td>
                        <td className="whitespace-nowrap text-xs text-muted-foreground">{fmtDate(c.sale_created_at ?? c.user_created_at)}</td>
                        <td className="text-[11px]">{c.next_step}</td>
                        <td>
                          <div className="flex gap-1 justify-end flex-wrap">
                            <button
                              onClick={() => setSelected(c)}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
                              title="Ver detalhes"
                            >
                              <Eye size={12} />
                            </button>
                            <button
                              onClick={() => c.email && copy(c.email, "E-mail copiado.")}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
                              title="Copiar e-mail"
                            >
                              <Copy size={12} />
                            </button>
                            <button
                              onClick={() => copy(MSG_FIRST_LOGIN, "Instrução copiada.")}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
                              title="Copiar instrução de acesso"
                            >
                              <Copy size={12} />
                            </button>
                            {c.user_id && !c.has_access && (
                              <button
                                onClick={() => grant(c)}
                                disabled={acting}
                                className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 transition"
                                title="Liberar acesso"
                              >
                                <UserCheck size={12} />
                              </button>
                            )}
                            {c.user_id && c.has_access && (
                              <button
                                onClick={() => revoke(c)}
                                disabled={acting}
                                className="p-1.5 rounded-lg border border-rose-500/30 text-rose-200 hover:bg-rose-500/10 transition"
                                title="Revogar acesso geral"
                              >
                                <UserX size={12} />
                              </button>
                            )}
                            {c.sale_id && onGoToSales && (
                              <button
                                onClick={() => onGoToSales(c.sale_id!)}
                                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition"
                                title="Ver venda"
                              >
                                <ShoppingCart size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => load("more")}
                  disabled={loadingMore}
                  className="px-4 py-2 rounded-lg border border-white/15 text-xs hover:bg-white/5 inline-flex items-center gap-2 disabled:opacity-50 transition"
                >
                  {loadingMore && <Loader2 size={12} className="animate-spin" />}
                  Carregar mais
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BuyerDetailsDrawer
        buyer={selected}
        onClose={() => setSelected(null)}
        onGrant={grant}
        onRevoke={revoke}
        onViewSale={onGoToSales ? (id) => onGoToSales(id) : undefined}
        acting={acting}
      />

      <Dialog open={!!confirmRevoke} onOpenChange={(open) => { if (!open && !acting) setConfirmRevoke(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revogar acesso geral deste comprador?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>
                  Esta ação remove o acesso geral de{" "}
                  <span className="font-semibold text-foreground">{confirmRevoke?.email ?? "—"}</span>{" "}
                  à área paga.
                </p>
                <p>Mesmo que existam outras vendas ativas para este comprador, o acesso será removido.</p>
                <p>
                  Para revogar apenas uma venda específica preservando o acesso quando houver outra venda ativa,
                  use a seção <span className="font-semibold text-foreground">Vendas</span>.
                </p>
                <p>Deseja continuar?</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setConfirmRevoke(null)}
              disabled={acting}
              className="px-4 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => confirmRevoke && performRevoke(confirmRevoke)}
              disabled={acting}
              className="admin-danger-action text-sm disabled:opacity-50"
            >
              {acting && <Loader2 size={14} className="animate-spin" />}
              Revogar acesso geral
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
