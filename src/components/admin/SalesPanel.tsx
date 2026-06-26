import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  ShoppingCart,
  Copy,
  Check,
  ShieldCheck,
  ShieldOff,
  Eye,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/lib/promiseTimeout";

export type ManualSale = {
  id: string;
  buyer_email: string;
  buyer_name: string | null;
  product_name: string;
  amount: number;
  currency: string;
  payment_status: string;
  access_status: string;
  access_source: string;
  payment_method: string | null;
  payment_reference: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  access_granted_at: string | null;
  access_revoked_at: string | null;
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  paid_confirmed: "Pago",
  pending_confirmation: "Aguardando",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};
const ACCESS_STATUS_LABEL: Record<string, string> = {
  pending_access: "Aguardando liberação",
  access_granted: "Acesso liberado",
  access_revoked: "Acesso revogado",
};

const ACCESS_MESSAGE =
  "Seu acesso à Fábrica de Apps com IA foi liberado. Entre com o mesmo e-mail usado na compra e acesse sua área.";

const AWAITING_LOGIN_INSTRUCTION =
  "Seu pagamento foi confirmado. Para liberar seu acesso, entre na Fábrica de Apps com IA usando o mesmo e-mail informado na compra. Você pode usar Google ou link por e-mail. Depois disso, me avise para eu finalizar sua liberação.";

const FRIENDLY_NO_USER_MSG =
  "Venda registrada, mas ainda não existe login criado com este e-mail. Peça para a pessoa entrar uma vez usando o mesmo e-mail da compra. Depois volte aqui e clique em Liberar acesso.";

function isNoUserError(msg?: string | null) {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return m.includes("ainda não criou conta") || m.includes("não criou conta") || m.includes("comprador ainda não");
}

function isAwaitingFirstLogin(sale: { payment_status: string; access_status: string }) {
  return sale.payment_status === "paid_confirmed" && sale.access_status === "pending_access";
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

function fmtMoney(amount: number, currency = "BRL") {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(amount) || 0);
  } catch {
    return `R$ ${Number(amount || 0).toFixed(2)}`;
  }
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return d;
  }
}

async function copyText(text: string, label = "Copiado") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

export function SalesPanel() {
  const [sales, setSales] = useState<ManualSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<ManualSale | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = (await withTimeout(
          (supabase as any).rpc("admin_list_manual_sales", { _limit: 200 }),
          10000,
          "lista de vendas",
        )) as { data: ManualSale[] | null; error: { message: string } | null };
        if (!mounted) return;
        if (res.error) throw new Error(res.error.message);
        const data = res.data;
        setSales((data as ManualSale[]) ?? []);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Erro desconhecido.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sales.filter((s) => {
      if (q) {
        const inEmail = s.buyer_email.toLowerCase().includes(q);
        const inName = (s.buyer_name ?? "").toLowerCase().includes(q);
        if (!inEmail && !inName) return false;
      }
      if (paymentFilter !== "all" && s.payment_status !== paymentFilter) return false;
      if (accessFilter !== "all" && s.access_status !== accessFilter) return false;
      return true;
    });
  }, [sales, search, paymentFilter, accessFilter]);

  const reload = () => setReloadKey((k) => k + 1);

  const grantAccess = async (sale: ManualSale) => {
    if (!confirm(`Tem certeza que deseja liberar o acesso desta venda (${sale.buyer_email})? O comprador poderá entrar na área do aluno.`)) return;
    const { data, error } = await (supabase as any).rpc("admin_grant_access_from_sale", { _sale_id: sale.id });
    if (error) {
      if (isNoUserError(error.message)) return toast.warning(FRIENDLY_NO_USER_MSG, { duration: 8000 });
      return toast.error("Não foi possível liberar acesso agora. Tente novamente em instantes.");
    }
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) {
      if (isNoUserError(res?.error)) return toast.warning(FRIENDLY_NO_USER_MSG, { duration: 8000 });
      return toast.error(res?.error ?? "Não foi possível liberar acesso.");
    }
    toast.success(`Acesso liberado para ${sale.buyer_email}.`);
    reload();
    if (selected?.id === sale.id) setSelected(null);
  };

  const revokeAccess = async (sale: ManualSale) => {
    if (!confirm(`Revogar acesso de ${sale.buyer_email}?`)) return;
    const { data, error } = await (supabase as any).rpc("admin_revoke_access_from_sale", { _sale_id: sale.id });
    if (error) return toast.error(error.message);
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) return toast.error(res?.error ?? "Não foi possível revogar acesso.");
    toast.success(`Acesso revogado para ${sale.buyer_email}.`);
    reload();
    if (selected?.id === sale.id) setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Honest banner */}
      <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 text-sky-100 text-sm px-4 py-3 flex items-start gap-2">
        <ShoppingCart size={16} className="shrink-0 mt-0.5" />
        <span>
          Operação manual ativa. Registre aqui as vendas confirmadas até o checkout automático ser conectado.
        </span>
      </div>

      {/* Toolbar */}
      <div className="glass-strong p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por e-mail ou nome"
              className={inputCls + " pl-9"}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="btn-primary whitespace-nowrap"
          >
            <Plus size={14} /> Registrar venda manual
          </button>
          <button
            type="button"
            onClick={reload}
            className="btn-ghost border border-white/15"
            title="Recarregar"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <FilterSelect label="Pagamento" value={paymentFilter} onChange={setPaymentFilter} options={[
            { value: "all", label: "Todos os pagamentos" },
            { value: "paid_confirmed", label: "Pago" },
            { value: "pending_confirmation", label: "Aguardando" },
            { value: "refunded", label: "Reembolsado" },
            { value: "cancelled", label: "Cancelado" },
          ]} />
          <FilterSelect label="Acesso" value={accessFilter} onChange={setAccessFilter} options={[
            { value: "all", label: "Todos os acessos" },
            { value: "pending_access", label: "Aguardando liberação" },
            { value: "access_granted", label: "Acesso liberado" },
            { value: "access_revoked", label: "Acesso revogado" },
          ]} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="glass-strong p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Carregando vendas…
        </div>
      ) : error ? (
        <div className="glass-strong p-6 border border-red-500/30">
          <h3 className="font-heading font-semibold text-red-300 mb-1">Não foi possível carregar vendas</h3>
          <p className="text-xs text-muted-foreground mb-3">{error}</p>
          <button type="button" onClick={reload} className="btn-ghost border border-white/15">
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          hasAny={sales.length > 0}
          onCreate={() => setShowCreate(true)}
        />
      ) : (
        <div className="glass-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Comprador</th>
                  <th className="text-left px-4 py-3 font-medium">Valor</th>
                  <th className="text-left px-4 py-3 font-medium">Pagamento</th>
                  <th className="text-left px-4 py-3 font-medium">Acesso</th>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-right px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground/90">{s.buyer_email}</div>
                      {s.buyer_name && (
                        <div className="text-xs text-muted-foreground">{s.buyer_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{fmtMoney(s.amount, s.currency)}</td>
                    <td className="px-4 py-3"><Badge variant={paymentTone(s.payment_status)}>{PAYMENT_STATUS_LABEL[s.payment_status] ?? s.payment_status}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={accessTone(s.access_status)}>{isAwaitingFirstLogin(s) ? "Aguardando primeiro login" : (ACCESS_STATUS_LABEL[s.access_status] ?? s.access_status)}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="Ver detalhes" onClick={() => setSelected(s)}><Eye size={14} /></IconBtn>
                        <IconBtn title="Copiar e-mail" onClick={() => copyText(s.buyer_email, "E-mail copiado")}><Copy size={14} /></IconBtn>
                        {s.access_status !== "access_granted" && (
                          <IconBtn title="Liberar acesso" tone="ok" onClick={() => grantAccess(s)}><ShieldCheck size={14} /></IconBtn>
                        )}
                        {s.access_status === "access_granted" && (
                          <IconBtn title="Revogar acesso" tone="danger" onClick={() => revokeAccess(s)}><ShieldOff size={14} /></IconBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateSaleDrawer
          existingEmails={sales.map((s) => s.buyer_email.toLowerCase())}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            reload();
          }}
        />
      )}

      {selected && (
        <SaleDetailDrawer
          sale={selected}
          onClose={() => setSelected(null)}
          onGrant={() => grantAccess(selected)}
          onRevoke={() => revokeAccess(selected)}
        />
      )}
    </div>
  );
}

/* ============ Helpers ============ */

function paymentTone(s: string): BadgeVariant {
  switch (s) {
    case "paid_confirmed": return "ok";
    case "pending_confirmation": return "warn";
    case "refunded": return "muted";
    case "cancelled": return "danger";
    default: return "muted";
  }
}
function accessTone(s: string): BadgeVariant {
  switch (s) {
    case "access_granted": return "ok";
    case "pending_access": return "warn";
    case "access_revoked": return "danger";
    default: return "muted";
  }
}

type BadgeVariant = "ok" | "warn" | "danger" | "muted";
function Badge({ children, variant = "muted" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const map: Record<BadgeVariant, string> = {
    ok: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    warn: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    danger: "bg-red-500/15 text-red-200 border-red-500/30",
    muted: "bg-white/5 text-muted-foreground border-white/10",
  };
  return (
    <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border ${map[variant]}`}>
      {children}
    </span>
  );
}

function IconBtn({
  children, onClick, title, tone = "neutral",
}: { children: React.ReactNode; onClick: () => void; title: string; tone?: "neutral" | "ok" | "danger" }) {
  const cls =
    tone === "ok"
      ? "border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10"
      : tone === "danger"
      ? "border-red-500/30 text-red-200 hover:bg-red-500/10"
      : "border-white/10 text-foreground/80 hover:bg-white/5";
  return (
    <button type="button" onClick={onClick} title={title} aria-label={title} className={`p-1.5 rounded-md border ${cls}`}>
      {children}
    </button>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs text-foreground focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0B1020]">{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ hasAny, onCreate }: { hasAny: boolean; onCreate: () => void }) {
  return (
    <div className="glass-strong p-10 text-center">
      <ShoppingCart className="mx-auto text-muted-foreground mb-3" size={28} />
      <h3 className="font-heading font-semibold mb-1">
        {hasAny ? "Nenhuma venda corresponde aos filtros" : "Nenhuma venda manual registrada ainda"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        {hasAny
          ? "Ajuste a busca ou os filtros acima para ver outras vendas."
          : "Quando confirmar um pagamento, registre a venda aqui para liberar o acesso do comprador."}
      </p>
      {!hasAny && (
        <button type="button" onClick={onCreate} className="btn-primary inline-flex">
          <Plus size={14} /> Registrar primeira venda
        </button>
      )}
    </div>
  );
}

/* ============ Create Drawer ============ */

function CreateSaleDrawer({
  existingEmails, onClose, onCreated,
}: { existingEmails: string[]; onClose: () => void; onCreated: () => void }) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [amount, setAmount] = useState("47");
  const [paymentStatus, setPaymentStatus] = useState("paid_confirmed");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [grantAfter, setGrantAfter] = useState(true);
  const [saving, setSaving] = useState(false);

  const submit = async (alsoGrant: boolean) => {
    const email = buyerEmail.trim().toLowerCase();
    const amt = Number(amount);
    if (!email || !email.includes("@")) return toast.error("Informe um e-mail válido.");
    if (!Number.isFinite(amt) || amt < 0) return toast.error("Informe um valor válido.");
    if (!paymentStatus) return toast.error("Informe o status do pagamento.");

    if (existingEmails.includes(email)) {
      if (!confirm(`Já existe venda registrada para ${email}. Deseja registrar mesmo assim?`)) return;
    }

    setSaving(true);
    try {
      const { data, error } = await (supabase as any).rpc("admin_create_manual_sale", {
        _buyer_email: email,
        _buyer_name: buyerName.trim() || null,
        _amount: amt,
        _payment_status: paymentStatus,
        _payment_method: paymentMethod.trim() || null,
        _payment_reference: paymentReference.trim() || null,
        _admin_notes: adminNotes.trim() || null,
      });
      if (error) throw new Error(error.message);
      const res = data as { success?: boolean; error?: string; id?: string } | null;
      if (!res?.success || !res.id) throw new Error(res?.error ?? "Falha ao registrar venda.");
      toast.success("Venda registrada.");

      if (alsoGrant) {
        const { data: gData, error: gErr } = await (supabase as any).rpc("admin_grant_access_from_sale", { _sale_id: res.id });
        if (gErr) {
          if (isNoUserError(gErr.message)) toast.warning(FRIENDLY_NO_USER_MSG, { duration: 9000 });
          else toast.error(`Venda criada, mas não foi possível liberar acesso agora.`);
        } else {
          const gRes = gData as { success?: boolean; error?: string } | null;
          if (!gRes?.success) {
            if (isNoUserError(gRes?.error)) toast.warning(FRIENDLY_NO_USER_MSG, { duration: 9000 });
            else toast.error(`Venda criada, mas: ${gRes?.error ?? "falha ao liberar."}`);
          } else toast.success("Acesso liberado.");
        }
      }
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DrawerShell title="Registrar venda manual" onClose={onClose}>
      <div className="space-y-3">
        <Field label="E-mail do comprador *">
          <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className={inputCls} placeholder="comprador@exemplo.com" autoFocus />
        </Field>
        <Field label="Nome do comprador">
          <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={inputCls} placeholder="Opcional" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor (BRL) *">
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Status do pagamento *">
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputCls}>
              <option value="paid_confirmed" className="bg-[#0B1020]">Pago / confirmado</option>
              <option value="pending_confirmation" className="bg-[#0B1020]">Aguardando confirmação</option>
              <option value="refunded" className="bg-[#0B1020]">Reembolsado</option>
              <option value="cancelled" className="bg-[#0B1020]">Cancelado</option>
            </select>
          </Field>
        </div>
        <Field label="Método de pagamento">
          <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputCls} placeholder="Pix, transferência, cartão…" />
        </Field>
        <Field label="Referência / comprovante">
          <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} className={inputCls} placeholder="ID da transação, código do comprovante…" />
        </Field>
        <Field label="Observação interna">
          <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className={inputCls + " min-h-[80px]"} placeholder="Notas internas (não visíveis ao comprador)" />
        </Field>
        <label className="flex items-center gap-2 text-sm pt-1">
          <input type="checkbox" checked={grantAfter} onChange={(e) => setGrantAfter(e.target.checked)} />
          <span>Liberar acesso após registrar venda</span>
        </label>
        <p className="text-[11px] text-muted-foreground">
          Para liberar o acesso, o comprador precisa já ter feito login com este mesmo e-mail.
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <button type="button" onClick={onClose} disabled={saving} className="btn-ghost border border-white/15">Cancelar</button>
        <button type="button" onClick={() => submit(false)} disabled={saving} className="btn-ghost border border-white/15">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Salvar venda
        </button>
        <button type="button" onClick={() => submit(true)} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Salvar e liberar acesso
        </button>
      </div>
    </DrawerShell>
  );
}

/* ============ Detail Drawer ============ */

function SaleDetailDrawer({
  sale, onClose, onGrant, onRevoke,
}: { sale: ManualSale; onClose: () => void; onGrant: () => void; onRevoke: () => void }) {
  return (
    <DrawerShell title="Detalhes da venda" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Row label="E-mail" value={sale.buyer_email} copyable />
        <Row label="Nome" value={sale.buyer_name ?? "Não registrado"} />
        <Row label="Produto" value={sale.product_name} />
        <Row label="Valor pago" value={fmtMoney(sale.amount, sale.currency)} />
        <Row label="Status do pagamento" value={PAYMENT_STATUS_LABEL[sale.payment_status] ?? sale.payment_status} />
        <Row label="Status do acesso" value={isAwaitingFirstLogin(sale) ? "Aguardando primeiro login" : (ACCESS_STATUS_LABEL[sale.access_status] ?? sale.access_status)} />
        <Row label="Origem" value={sale.access_source} />
        <Row label="Método de pagamento" value={sale.payment_method ?? "Não registrado"} />
        <Row label="Referência" value={sale.payment_reference ?? "Não registrado"} />
        <Row label="Data da compra" value={fmtDate(sale.created_at)} />
        <Row label="Liberação" value={fmtDate(sale.access_granted_at)} />
        <Row label="Revogação" value={fmtDate(sale.access_revoked_at)} />
        <Row label="Observações internas" value={sale.admin_notes ?? "—"} />
      </div>

      {isAwaitingFirstLogin(sale) && (
        <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-sm px-4 py-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Próximo passo: aguardar primeiro login</div>
              <p className="text-xs text-amber-100/80 mt-1">
                Pagamento confirmado, mas ainda não existe conta criada com este e-mail. Peça para o comprador entrar uma vez em /login com o mesmo e-mail da compra. Depois clique em “Tentar liberar novamente”.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</div>
        <div className="flex flex-wrap gap-2">
          {sale.access_status !== "access_granted" && (
            <button type="button" onClick={onGrant} className="btn-primary">
              <ShieldCheck size={14} /> {isAwaitingFirstLogin(sale) ? "Tentar liberar novamente" : "Liberar acesso"}
            </button>
          )}
          {sale.access_status === "access_granted" && (
            <button type="button" onClick={onRevoke} className="btn-ghost border border-red-500/30 text-red-200 hover:bg-red-500/10">
              <ShieldOff size={14} /> Revogar acesso
            </button>
          )}
          <button type="button" onClick={() => copyText(sale.buyer_email, "E-mail copiado")} className="btn-ghost border border-white/15">
            <Copy size={14} /> Copiar e-mail
          </button>
          <button type="button" onClick={() => copyText(AWAITING_LOGIN_INSTRUCTION, "Instrução copiada")} className="btn-ghost border border-white/15">
            <Copy size={14} /> Copiar instrução de acesso
          </button>
          <button type="button" onClick={() => copyText(ACCESS_MESSAGE, "Mensagem copiada")} className="btn-ghost border border-white/15">
            <Copy size={14} /> Copiar mensagem de acesso liberado
          </button>
        </div>
      </div>
    </DrawerShell>
  );
}

function Row({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 items-start">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground pt-0.5">{label}</span>
      <div className="flex items-start gap-2">
        <span className="text-foreground/90 break-words">{value}</span>
        {copyable && (
          <button type="button" onClick={() => copyText(value)} className="text-muted-foreground hover:text-foreground" title="Copiar">
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

function DrawerShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70" onClick={onClose} aria-hidden />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0B1020] border-l border-white/10 flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-heading font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1.5 rounded-lg hover:bg-white/5">
            <X size={16} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </>
  );
}
