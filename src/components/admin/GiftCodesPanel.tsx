import { useEffect, useState } from "react";
import {
  Loader2,
  KeyRound,
  Plus,
  Power,
  PowerOff,
  Copy,
  Check,
  AlertTriangle,
  History,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/lib/promiseTimeout";

type GiftCode = {
  id: string;
  code: string;
  duration_days: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

type Redemption = {
  id: string;
  gift_code_id: string;
  user_id: string;
  redeemed_at: string;
};

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

function maskCode(code: string) {
  if (!code) return "—";
  if (code.length <= 4) return "•".repeat(code.length);
  return code.slice(0, 2) + "•".repeat(Math.max(2, code.length - 4)) + code.slice(-2);
}

function statusOf(c: GiftCode): { label: string; tone: "ok" | "warn" | "muted" } {
  const expired = c.expires_at && new Date(c.expires_at) < new Date();
  const exhausted = c.current_uses >= c.max_uses;
  if (!c.is_active) return { label: "Inativo", tone: "muted" };
  if (expired) return { label: "Expirado", tone: "warn" };
  if (exhausted) return { label: "Esgotado", tone: "warn" };
  return { label: "Ativo", tone: "ok" };
}

export function GiftCodesPanel() {
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form
  const [code, setCode] = useState("");
  const [days, setDays] = useState(30);
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [codesRes, redRes] = await withTimeout<any>(Promise.all([
      supabase
        .from("gift_codes")
        .select("id, code, duration_days, max_uses, current_uses, is_active, expires_at, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("gift_redemptions")
        .select("id, gift_code_id, user_id, redeemed_at")
        .order("redeemed_at", { ascending: false })
        .limit(20),
    ]), 10000, "códigos premium").catch((e) => ([
      { data: null, error: e },
      { data: null, error: e },
    ]));
    if (codesRes.error) {
      const msg = codesRes.error.message || "";
      const isPermission =
        codesRes.error.code === "42501" ||
        /permission denied|row-level security|rls/i.test(msg);
      setError(
        isPermission
          ? "Você tem acesso ao painel admin, mas não tem permissão para gerenciar códigos premium. Verifique a configuração de admin no banco (admin_users / user_roles)."
          : msg
      );
      setLoading(false);
      return;
    }
    setCodes((codesRes.data as GiftCode[]) ?? []);
    setRedemptions((redRes.data as Redemption[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toLowerCase();
    if (!normalized) {
      toast.error("Informe um código.");
      return;
    }
    if (!Number.isFinite(days) || days < 1) {
      toast.error("Dias de acesso deve ser maior que zero.");
      return;
    }
    if (!Number.isFinite(maxUses) || maxUses < 1) {
      toast.error("Limite de usos deve ser pelo menos 1.");
      return;
    }
    let expIso: string | null = null;
    if (expiresAt) {
      const d = new Date(expiresAt);
      if (Number.isNaN(d.getTime())) {
        toast.error("Data de expiração inválida.");
        return;
      }
      expIso = d.toISOString();
    }
    setCreating(true);
    const { data, error: rpcError } = await (supabase as any).rpc("admin_create_gift_code", {
      _code: normalized,
      _duration_days: days,
      _max_uses: maxUses,
      _is_active: isActive,
      _expires_at: expIso,
    });
    setCreating(false);
    if (rpcError) {
      toast.error(rpcError.message);
      return;
    }
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) {
      toast.error(res?.error ?? "Não foi possível criar o código.");
      return;
    }
    toast.success("Código criado");
    setCode("");
    setDays(30);
    setMaxUses(1);
    setExpiresAt("");
    setIsActive(true);
    load();
  };

  const toggleActive = async (c: GiftCode) => {
    const { data, error: rpcError } = await (supabase as any).rpc("admin_set_gift_code_active", {
      _code_id: c.id,
      _is_active: !c.is_active,
    });
    if (rpcError) {
      toast.error(rpcError.message);
      return;
    }
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) {
      toast.error(res?.error ?? "Não foi possível atualizar o código.");
      return;
    }
    toast.success(c.is_active ? "Código desativado" : "Código ativado");
    load();
  };

  const copyCode = async (c: GiftCode) => {
    try {
      await navigator.clipboard.writeText(c.code);
      setCopiedId(c.id);
      toast.success("Código copiado. Compartilhe apenas com compradores autorizados.");
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const now = new Date();
  const active = codes.filter((c) => statusOf(c).label === "Ativo").length;
  const expired = codes.filter((c) => c.expires_at && new Date(c.expires_at) < now).length;
  const exhausted = codes.filter((c) => c.current_uses >= c.max_uses).length;
  const totalRedemptions = codes.reduce((sum, c) => sum + (c.current_uses || 0), 0);

  return (
    <section className="mb-8 space-y-5" aria-labelledby="codigos-premium">
      <p id="codigos-premium" className="text-xs text-muted-foreground -mt-2">
        Cada código libera ou estende o acesso de quem resgatar. Defina dias de acesso, limite de usos e, se quiser, uma data de expiração.
      </p>



      {error && (
        <div className="admin-card border-[hsl(var(--admin-destructive)/0.4)] bg-[hsl(var(--admin-destructive)/0.08)] text-red-200 text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            Não foi possível carregar os códigos. Verifique se você tem papel admin em user_roles.
            <div className="text-[11px] text-red-200/70 mt-1">Detalhe: {error}</div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Ativos" value={active} tone="ok" />
        <StatCard label="Expirados" value={expired} tone="warn" />
        <StatCard label="Esgotados" value={exhausted} tone="warn" />
        <StatCard label="Total de resgates" value={totalRedemptions} />
      </div>

      {/* Create form */}
      <form onSubmit={createCode} className="admin-card space-y-4">
        <div>
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
            <Plus size={14} className="text-accent" /> Novo código
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            O código será normalizado em minúsculas. Compartilhe apenas com compradores autorizados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Código">
            <input
              className={inputCls}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ex: bemvindo30"
              maxLength={64}
              required
            />
          </Field>
          <Field label="Dias de acesso">
            <input
              className={inputCls}
              type="number"
              min={1}
              max={3650}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value || "0", 10))}
              required
            />
          </Field>
          <Field label="Limite de usos">
            <input
              className={inputCls}
              type="number"
              min={1}
              max={10000}
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value || "0", 10))}
              required
            />
          </Field>
          <Field label="Expiração (opcional)">
            <input
              className={inputCls}
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-foreground/80 sm:col-span-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-accent"
            />
            Ativo no momento da criação
          </label>
        </div>
        <button type="submit" disabled={creating} className="btn-primary w-full sm:w-auto px-5 shadow-lg shadow-accent/10">
          {creating ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Criar código</>}
        </button>
      </form>

      {/* List */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-3 gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-sm">Códigos cadastrados</h3>
            <p className="admin-help mt-0.5">Mostra os 200 códigos mais recentes.</p>
          </div>
          <button onClick={load} className="text-[11px] text-muted-foreground hover:text-foreground shrink-0">
            Atualizar
          </button>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" /> Carregando…
          </div>
        ) : codes.length === 0 ? (
          <div className="admin-empty">
            <KeyRound size={20} className="text-muted-foreground/70" />
            <p className="admin-empty-title">Nenhum código cadastrado ainda.</p>
            <p className="admin-empty-hint">
              Crie um código acima para liberar ou estender o acesso de um comprador.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {codes.map((c) => {
              const st = statusOf(c);
              const badgeCls =
                st.tone === "ok"
                  ? "admin-badge admin-badge-success"
                  : st.tone === "warn"
                    ? "admin-badge admin-badge-warning"
                    : "admin-badge admin-badge-muted";
              const revealed = !!reveal[c.id];
              return (
                <li key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <code className="font-mono text-sm text-foreground break-all">
                          {revealed ? c.code : maskCode(c.code)}
                        </code>
                        <button
                          type="button"
                          onClick={() => setReveal((r) => ({ ...r, [c.id]: !r[c.id] }))}
                          className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                        >
                          {revealed ? "Ocultar" : "Ver"}
                        </button>
                        <span className={badgeCls}>
                          {st.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>Usos: {c.current_uses}/{c.max_uses}</span>
                        <span>Dias: {c.duration_days}</span>
                        <span>
                          Expira: {c.expires_at ? new Date(c.expires_at).toLocaleDateString("pt-BR") : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => copyCode(c)}
                        className="text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-1.5"
                      >
                        {copiedId === c.id ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === c.id ? "Copiado" : "Copiar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(c)}
                        className={`text-xs px-3 py-2 rounded-lg inline-flex items-center justify-center gap-1.5 border ${
                          c.is_active
                            ? "border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
                            : "border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10"
                        }`}
                      >
                        {c.is_active ? <><PowerOff size={14} /> Desativar</> : <><Power size={14} /> Ativar</>}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Redemptions */}
      <div className="glass-strong p-5">
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
            <History size={14} className="text-accent" /> Últimos resgates
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Mostra os 20 resgates mais recentes. Apenas user_id é exibido por segurança.
          </p>
        </div>
        {redemptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center">
            <History size={18} className="mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm text-foreground/80">Nenhum resgate registrado ainda.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Os resgates aparecem aqui quando um comprador utilizar um código. Para identificar o comprador, use a busca por e-mail na seção Acessos.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5 text-xs">
            {redemptions.map((r) => {
              const c = codes.find((x) => x.id === r.gift_code_id);
              return (
                <li
                  key={r.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <code className="font-mono text-foreground">
                      {c ? maskCode(c.code) : "—"}
                    </code>
                    <span className="text-muted-foreground truncate font-mono">
                      {r.user_id}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-3">
                    <span>{c?.duration_days ?? "—"} dias</span>
                    <span>{new Date(r.redeemed_at).toLocaleString("pt-BR")}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "ok" | "warn";
}) {
  const toneCls =
    tone === "ok" ? "text-emerald-300" : tone === "warn" ? "text-amber-200" : "text-foreground";
  return (
    <div className="glass-strong p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-heading font-bold ${toneCls}`}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">
        {label}
      </span>
      {children}
    </label>
  );
}
