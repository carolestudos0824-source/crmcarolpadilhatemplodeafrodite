import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Search, Eye, Copy, UserCheck, UserX, Filter as FilterIcon, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/lib/promiseTimeout";
import { BuyerDetailsDrawer, MSG_FIRST_LOGIN } from "./BuyerDetailsDrawer";
import type { Buyer } from "./BuyersList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ManualSale = {
  id: string;
  buyer_email: string;
  buyer_name: string | null;
  amount: number;
  currency: string;
  payment_status: string;
  access_status: string;
  access_source: string;
  payment_method: string | null;
  payment_reference: string | null;
  admin_notes: string | null;
  created_at: string;
  access_granted_at: string | null;
  access_revoked_at: string | null;
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

function computeNextStep(b: ConsolidatedBuyer): string {
  if (b.has_access) return "Acesso já liberado";
  if (b.payment_status === "refunded" || b.payment_status === "cancelled") return "Verifique pagamento";
  if (b.access_status === "access_revoked") return "Acesso revogado";
  if (b.payment_status === "paid_confirmed" && !b.user_id) return "Peça primeiro login com o mesmo e-mail";
  if (b.payment_status === "paid_confirmed" && b.user_id) return "Clique em liberar acesso";
  if (b.payment_status === "pending_confirmation") return "Verifique pagamento";
  if (!b.sale_id && !b.user_id) return "Venda não localizada";
  return "Revisar manualmente";
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

async function copy(text: string, label = "Copiado.") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

export function BuyersPanel({ onGoToSales }: { onGoToSales?: (saleId?: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<ManualSale[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selected, setSelected] = useState<ConsolidatedBuyer | null>(null);
  const [acting, setActing] = useState(false);

  const [q, setQ] = useState("");
  const [fPay, setFPay] = useState<string>("all");
  const [fAccess, setFAccess] = useState<string>("all");
  const [fSource, setFSource] = useState<string>("all");
  const [fPeriod, setFPeriod] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    const [salesRes, buyersRes] = await Promise.all([
      withTimeout<any>(
        (supabase as any).rpc("admin_list_manual_sales", { _limit: 500 }),
        12000,
        "vendas",
      ).catch((e) => ({ data: null, error: e })),
      withTimeout<any>(
        (supabase as any).rpc("admin_list_buyers", { _limit: 200 }),
        12000,
        "compradores",
      ).catch((e) => ({ data: null, error: e })),
    ]);
    if (salesRes.error && buyersRes.error) {
      setError("Não foi possível carregar compradores.");
      setSales([]);
      setBuyers([]);
      setLoading(false);
      return;
    }
    setSales((salesRes.data as ManualSale[]) ?? []);
    setBuyers((buyersRes.data as Buyer[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const consolidated = useMemo<ConsolidatedBuyer[]>(() => {
    const map = new Map<string, ConsolidatedBuyer>();

    for (const s of sales) {
      const key = (s.buyer_email ?? "").toLowerCase();
      if (!key) continue;
      const c: ConsolidatedBuyer = {
        key,
        email: s.buyer_email,
        buyer_name: s.buyer_name,
        user_id: null,
        has_access: s.access_status === "access_granted",
        source: s.access_source,
        source_label: labelSource(s.access_source),
        sale_id: s.id,
        amount: s.amount,
        currency: s.currency || "BRL",
        payment_status: s.payment_status,
        payment_status_label: PAYMENT_LABELS[s.payment_status] ?? s.payment_status,
        access_status: s.access_status,
        access_status_label: ACCESS_LABELS[s.access_status] ?? s.access_status,
        payment_method: s.payment_method,
        payment_reference: s.payment_reference,
        admin_notes: s.admin_notes,
        sale_created_at: s.created_at,
        access_granted_at: s.access_granted_at,
        access_revoked_at: s.access_revoked_at,
        user_created_at: null,
        next_step: "",
        is_admin: false,
      };
      map.set(key, c);
    }

    for (const b of buyers) {
      const key = (b.email ?? "").toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.user_id = b.user_id;
        existing.user_created_at = b.user_created_at;
        existing.has_access = b.has_access || existing.has_access;
        existing.is_admin = b.is_admin;
        if (!existing.source) {
          existing.source = b.source;
          existing.source_label = labelSource(b.source);
        }
      } else {
        map.set(key, {
          key,
          email: b.email,
          buyer_name: b.display_name,
          user_id: b.user_id,
          has_access: b.has_access,
          source: b.source,
          source_label: labelSource(b.source),
          sale_id: null,
          amount: null,
          currency: "BRL",
          payment_status: null,
          payment_status_label: "Não registrado",
          access_status: b.has_access ? "access_granted" : null,
          access_status_label: b.has_access ? "Acesso liberado" : "Sem acesso",
          payment_method: null,
          payment_reference: null,
          admin_notes: null,
          sale_created_at: null,
          access_granted_at: b.access_created_at,
          access_revoked_at: null,
          user_created_at: b.user_created_at,
          next_step: "",
          is_admin: b.is_admin,
        });
      }
    }

    // Refine access_status_label using has_access + user existence
    const arr = Array.from(map.values()).map((c) => {
      if (c.has_access) {
        c.access_status_label = "Acesso liberado";
      } else if (c.access_status === "access_revoked") {
        c.access_status_label = "Acesso revogado";
      } else if (c.payment_status === "paid_confirmed" && !c.user_id) {
        c.access_status_label = "Aguardando primeiro login";
      } else if (c.payment_status === "paid_confirmed") {
        c.access_status_label = "Aguardando liberação";
      } else if (!c.sale_id && !c.has_access) {
        c.access_status_label = "Sem acesso";
      } else if (!c.access_status) {
        c.access_status_label = "Não registrado";
      }
      c.next_step = computeNextStep(c);
      return c;
    });

    return arr.sort((a, b) => {
      const da = a.sale_created_at ?? a.user_created_at ?? "";
      const db = b.sale_created_at ?? b.user_created_at ?? "";
      return db.localeCompare(da);
    });
  }, [sales, buyers]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const now = Date.now();
    const periodMs =
      fPeriod === "7d"
        ? 7 * 86400000
        : fPeriod === "30d"
        ? 30 * 86400000
        : fPeriod === "90d"
        ? 90 * 86400000
        : null;

    return consolidated.filter((c) => {
      if (query) {
        const hay = `${c.email ?? ""} ${c.buyer_name ?? ""}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (fPay !== "all" && c.payment_status !== fPay) return false;
      if (fAccess !== "all") {
        if (fAccess === "granted" && !c.has_access) return false;
        if (fAccess === "awaiting_login" && c.access_status_label !== "Aguardando primeiro login") return false;
        if (fAccess === "awaiting_grant" && c.access_status_label !== "Aguardando liberação") return false;
        if (fAccess === "revoked" && c.access_status !== "access_revoked") return false;
        if (fAccess === "none" && (c.has_access || c.access_status_label !== "Sem acesso")) return false;
      }
      if (fSource !== "all" && (c.source ?? "unknown") !== fSource) return false;
      if (periodMs) {
        const ref = c.sale_created_at ?? c.user_created_at;
        if (!ref) return false;
        if (now - new Date(ref).getTime() > periodMs) return false;
      }
      return true;
    });
  }, [consolidated, q, fPay, fAccess, fSource, fPeriod]);

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
      await load();
      setSelected((s) => (s ? { ...s, has_access: true, access_status_label: "Acesso liberado" } : null));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setActing(false);
    }
  };

  const revoke = async (b: ConsolidatedBuyer) => {
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
      await load();
      setSelected((s) => (s ? { ...s, has_access: false, access_status_label: "Acesso revogado" } : null));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setActing(false);
    }
  };

  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    consolidated.forEach((c) => set.add(c.source ?? "unknown"));
    return Array.from(set);
  }, [consolidated]);

  const clearFilters = () => {
    setQ("");
    setFPay("all");
    setFAccess("all");
    setFSource("all");
    setFPeriod("all");
  };

  return (
    <div className="space-y-4">
      <div className="glass-strong p-5">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div>
            <h3 className="font-heading font-semibold text-sm">Compradores</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visão consolidada de vendas manuais, acessos e próximo passo recomendado.
            </p>
          </div>
          <button onClick={load} className="btn-ghost border border-white/15 text-xs">
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
          <div className="relative md:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className={inputCls + " pl-8"}
              placeholder="Buscar por e-mail ou nome"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className={inputCls} value={fPay} onChange={(e) => setFPay(e.target.value)}>
            <option value="all">Pagamento: todos</option>
            <option value="paid_confirmed">Pago</option>
            <option value="pending_confirmation">Aguardando</option>
            <option value="refunded">Reembolsado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <select className={inputCls} value={fAccess} onChange={(e) => setFAccess(e.target.value)}>
            <option value="all">Acesso: todos</option>
            <option value="granted">Liberado</option>
            <option value="awaiting_login">Aguardando 1º login</option>
            <option value="awaiting_grant">Aguardando liberação</option>
            <option value="revoked">Revogado</option>
            <option value="none">Sem acesso</option>
          </select>
          <select className={inputCls} value={fSource} onChange={(e) => setFSource(e.target.value)}>
            <option value="all">Origem: todas</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>{labelSource(s === "unknown" ? null : s)}</option>
            ))}
          </select>
          <select className={inputCls} value={fPeriod} onChange={(e) => setFPeriod(e.target.value)}>
            <option value="all">Período: tudo</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <FilterIcon size={11} /> {filtered.length} comprador(es)
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
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm px-4 py-3 space-y-2">
            <div>{error}</div>
            <div className="flex gap-2">
              <button onClick={load} className="px-3 py-1.5 rounded-lg border border-amber-400/40 text-xs">
                Tentar novamente
              </button>
            </div>
          </div>
        ) : consolidated.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Nenhuma venda manual registrada ainda.
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">
            Nenhum comprador encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs min-w-[760px]">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-white/10">
                  <th className="text-left px-2 py-2">E-mail / Nome</th>
                  <th className="text-left px-2 py-2">Venda</th>
                  <th className="text-left px-2 py-2">Acesso</th>
                  <th className="text-left px-2 py-2">Origem</th>
                  <th className="text-right px-2 py-2">Valor</th>
                  <th className="text-left px-2 py-2">Data</th>
                  <th className="text-left px-2 py-2">Próximo passo</th>
                  <th className="text-right px-2 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.key} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-2 py-2">
                      <div className="font-medium text-foreground truncate max-w-[200px]">{c.email ?? "—"}</div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                        {c.buyer_name ?? "Sem nome"}
                      </div>
                    </td>
                    <td className="px-2 py-2">{c.payment_status_label}</td>
                    <td className="px-2 py-2">{c.access_status_label}</td>
                    <td className="px-2 py-2">{c.source_label}</td>
                    <td className="px-2 py-2 text-right">{fmtMoney(c.amount, c.currency)}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{fmtDate(c.sale_created_at ?? c.user_created_at)}</td>
                    <td className="px-2 py-2 text-[11px]">{c.next_step}</td>
                    <td className="px-2 py-2">
                      <div className="flex gap-1 justify-end flex-wrap">
                        <button
                          onClick={() => setSelected(c)}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                          title="Ver detalhes"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => c.email && copy(c.email, "E-mail copiado.")}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                          title="Copiar e-mail"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={() => copy(MSG_FIRST_LOGIN, "Instrução copiada.")}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                          title="Copiar instrução de acesso"
                        >
                          <Copy size={12} />
                        </button>
                        {c.user_id && !c.has_access && (
                          <button
                            onClick={() => grant(c)}
                            disabled={acting}
                            className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                            title="Liberar acesso"
                          >
                            <UserCheck size={12} />
                          </button>
                        )}
                        {c.user_id && c.has_access && (
                          <button
                            onClick={() => revoke(c)}
                            disabled={acting}
                            className="p-1.5 rounded-lg border border-rose-500/30 text-rose-200 hover:bg-rose-500/10"
                            title="Revogar acesso"
                          >
                            <UserX size={12} />
                          </button>
                        )}
                        {c.sale_id && onGoToSales && (
                          <button
                            onClick={() => onGoToSales(c.sale_id!)}
                            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
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
    </div>
  );
}
