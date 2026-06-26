import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Loader2,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  LayoutGrid,
  CreditCard,
  Mail,
  Bot,
  FileText,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";
import { AdminShell, ADMIN_SECTIONS, type AdminSectionKey } from "@/components/admin/AdminShell";
import { GiftCodesPanel } from "@/components/admin/GiftCodesPanel";
import { BuyersList, type Buyer } from "@/components/admin/BuyersList";
import { BuyersPanel } from "@/components/admin/BuyersPanel";
import { AccessLogs } from "@/components/admin/AccessLogs";
import { AdminAuditLog } from "@/components/admin/AdminAuditLog";
import { AdminErrorBoundary, AdminRouteErrorFallback } from "@/components/admin/AdminErrorBoundary";
import { SupportInbox } from "@/components/admin/SupportInbox";
import { SalesPanel } from "@/components/admin/SalesPanel";
import { withTimeout } from "@/lib/promiseTimeout";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

const PENDENCIAS_KEY = "fabrica_admin_prelaunch_checklist_v1";

const PENDENCIAS_ITEMS = [
  { id: "checkout", label: "Checkout real configurado (marcar somente após CHECKOUT_FABRICA_URL conter a URL real do pagamento)" },
  { id: "suporte", label: "E-mail de suporte configurado" },
  { id: "legal", label: "Dados legais preenchidos" },
  { id: "fluxo", label: "Fluxo de liberação testado" },
  { id: "interna", label: "Área interna revisada" },
  { id: "mensagem", label: "Mensagem pós-compra pronta" },
  { id: "admin", label: "Acesso admin funcionando" },
  { id: "mobile", label: "Teste mobile realizado" },
];

const LOGIN_URL = "/login";
const ENTREGA_URL = "/entrega";

const SUPPORT_MESSAGES = [
  {
    title: "Acesso liberado",
    text:
      "Seu acesso à Fábrica de Apps com IA foi liberado. Entre com o mesmo e-mail usado na compra e acesse sua área.",
  },
  {
    title: "Use o mesmo e-mail",
    text:
      "Entre com o mesmo e-mail informado no pagamento. Se usar outro e-mail, o acesso pode não aparecer.",
  },
  {
    title: "Aguardando primeiro login",
    text:
      "Seu pagamento foi confirmado. Para liberar seu acesso, entre uma vez usando o mesmo e-mail informado na compra. Depois disso, me avise para eu finalizar sua liberação.",
  },
  {
    title: "Acesso não localizado",
    text:
      "Não localizei acesso neste e-mail. Envie o comprovante ou o e-mail usado na compra para eu verificar.",
  },
  {
    title: "Boas-vindas",
    text:
      "Bem-vindo à Fábrica de Apps com IA. Comece pelo primeiro módulo e siga a jornada em ordem.",
  },
  {
    title: "Checkout pendente",
    text:
      "Recebi sua mensagem. Assim que o pagamento for confirmado, libero seu acesso pelo e-mail informado.",
  },
  {
    title: "E-mail diferente",
    text:
      "Verifique se você entrou com o mesmo e-mail usado na compra. Se entrou com outro e-mail, o acesso pode não aparecer.",
  },
];

const BUYER_HANDOFF_MESSAGE =
  "Seu acesso à Fábrica de Apps com IA foi liberado. Entre com o mesmo e-mail usado na compra e acesse sua área.";

type LookupRow = {
  user_id: string;
  email: string;
  has_access: boolean | null;
  source: string | null;
  access_created_at: string | null;
  access_exists: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; row: LookupRow }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string; row: LookupRow; action: "grant" | "revoke" };

function isValidUrl(u: string) {
  const t = (u || "").trim();
  if (!t || /^COLE_AQUI/i.test(t)) return false;
  return /^https?:\/\//i.test(t);
}

export default function AdminAccess() {
  return (
    <AdminErrorBoundary resetKey="admin-route" variant="route">
      <AdminAccessInner />
    </AdminErrorBoundary>
  );
}

function AdminAccessInner() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [selfHasAccess, setSelfHasAccess] = useState<boolean | null>(null);

  const sectionParam = searchParams.get("section");
  const resolvedSection: AdminSectionKey =
    sectionParam && ADMIN_SECTIONS.some((s) => s.key === sectionParam)
      ? (sectionParam as AdminSectionKey)
      : "overview";
  const [section, setSection] = useState<AdminSectionKey>(resolvedSection);

  // Keep state in sync if the URL changes (back/forward, deep link).
  useEffect(() => {
    if (resolvedSection !== section) setSection(resolvedSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSection]);

  const changeSection = (k: AdminSectionKey) => {
    setSection(k);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("section", k);
      return next;
    }, { replace: true });
  };

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [acting, setActing] = useState(false);
  const [logsRefresh, setLogsRefresh] = useState(0);
  const bumpLogs = () => setLogsRefresh((v) => v + 1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: userData } = await withTimeout(
          supabase.auth.getUser(),
          10000,
          "sessão admin",
        );
        if (!userData?.user) {
          navigate("/login", { replace: true });
          return;
        }
        const uid = userData.user.id;
        const [adminRes, accessRes] = await withTimeout(Promise.all([
          supabase.rpc("is_admin").then(
            (r) => r,
            (e) => ({ data: false, error: e }),
          ),
          supabase
            .from("user_access")
            .select("has_access")
            .eq("user_id", uid)
            .maybeSingle()
            .then((r) => r, (e) => ({ data: null, error: e })),
        ]), 10000, "permissão admin");
        if (!mounted) return;
        setIsAdmin(Boolean(adminRes.data));
        setAdminEmail(userData.user.email ?? null);
        setSelfHasAccess(accessRes.data?.has_access ?? false);
        setAuthChecked(true);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : "Erro desconhecido.";
        setAuthError(msg);
        setAuthChecked(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus({ kind: "loading" });
    const { data, error } = await supabase.rpc("admin_lookup_user", { _email: email.trim() });
    if (error) return setStatus({ kind: "error", message: error.message });
    const rows = (data as LookupRow[] | null) ?? [];
    if (rows.length === 0) return setStatus({ kind: "not_found" });
    setStatus({ kind: "found", row: rows[0] });
  };

  const setAccess = async (userId: string, hasAccess: boolean) => {
    setActing(true);
    const { data, error } = await supabase.rpc("admin_set_access", {
      _user_id: userId,
      _has_access: hasAccess,
    });
    setActing(false);
    if (error) return setStatus({ kind: "error", message: error.message });
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) {
      return setStatus({
        kind: "error",
        message: res?.error ?? "Não foi possível concluir esta ação.",
      });
    }
    bumpLogs();
    const { data: lookup } = await supabase.rpc("admin_lookup_user", { _email: email.trim() });
    const rows = (lookup as LookupRow[] | null) ?? [];
    if (rows[0]) {
      setStatus({
        kind: "success",
        action: hasAccess ? "grant" : "revoke",
        message: hasAccess
          ? `Acesso liberado com sucesso para ${rows[0].email}.`
          : `Acesso revogado com sucesso para ${rows[0].email}.`,
        row: rows[0],
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 size={16} className="animate-spin" /> Carregando painel admin...
      </div>
    );
  }

  if (authError) {
    return <AdminRouteErrorFallback error={new Error(authError)} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-strong p-8 text-center">
          <AlertTriangle className="mx-auto text-red-400 mb-3" size={28} />
          <h1 className="text-xl font-heading font-bold mb-2">Acesso negado</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Esta área é exclusiva para administradores.
          </p>
          <Link to="/" className="btn-ghost inline-flex">Voltar para o início</Link>
        </div>
      </div>
    );
  }

  return (
    <AdminShell active={section} onChange={changeSection} adminEmail={adminEmail} onLogout={logout}>
      <AdminErrorBoundary resetKey={section}>
        {section === "overview" && (
          <OverviewSection
            adminEmail={adminEmail}
            selfHasAccess={selfHasAccess}
            onGoTo={changeSection}
          />
        )}
        {section === "acessos" && (
          <AcessosSection
            email={email}
            setEmail={setEmail}
            status={status}
            setStatus={setStatus}
            acting={acting}
            onSearch={onSearch}
            setAccess={setAccess}
            selfHasAccess={selfHasAccess}
            onSelfChanged={(v) => {
              setSelfHasAccess(v);
              bumpLogs();
            }}
            logsRefresh={logsRefresh}
          />
        )}
        {section === "compradores" && (
          <BuyersPanel onGoToSales={() => changeSection("vendas")} />
        )}

        {section === "vendas" && <SalesPanel />}
        {section === "codigos" && <GiftCodesPanel />}
        {section === "pendencias" && <PendenciasSection />}
        {section === "mensagens" && <MensagensSection />}
        {section === "inbox" && <SupportInbox />}
        {section === "config" && <ConfigSection />}
      </AdminErrorBoundary>
    </AdminShell>
  );
}

/* ============================== Sections ============================== */

function OverviewSection({
  adminEmail,
  selfHasAccess,
  onGoTo,
}: {
  adminEmail: string | null;
  selfHasAccess: boolean | null;
  onGoTo: (k: AdminSectionKey) => void;
}) {
  const [metrics, setMetrics] = useState<{
    loading: boolean;
    error: string | null;
    revenueConfirmed: number;
    salesConfirmed: number;
    pendingAccess: number;
    accessGranted: number;
    accessRevoked: number;
    giftRedemptions: number | null;
    supportMessages: number | null;
  }>({
    loading: true,
    error: null,
    revenueConfirmed: 0,
    salesConfirmed: 0,
    pendingAccess: 0,
    accessGranted: 0,
    accessRevoked: 0,
    giftRedemptions: null,
    supportMessages: null,
  });

  const load = () => {
    setMetrics((m) => ({ ...m, loading: true, error: null }));
    let cancelled = false;
    (async () => {
      try {
        const [salesRes, giftsRes, supportRes] = await withTimeout(Promise.all([
          (supabase as any)
            .rpc("admin_list_manual_sales", { _limit: 500 })
            .then((r: any) => r, (e: unknown) => ({ data: null, error: e })),
          supabase.from("gift_redemptions").select("*", { count: "exact", head: true }).then(
            (r) => r, (e) => ({ data: null, count: null, error: e }),
          ),
          supabase.from("support_messages").select("*", { count: "exact", head: true }).then(
            (r) => r, (e) => ({ data: null, count: null, error: e }),
          ),
        ]), 10000, "métricas admin");
        if (cancelled) return;

        const sales = (salesRes?.data as Array<{
          amount: number | string | null;
          payment_status: string | null;
          access_status: string | null;
        }> | null) ?? [];

        let revenue = 0;
        let confirmed = 0;
        let pending = 0;
        let granted = 0;
        let revoked = 0;
        for (const s of sales) {
          const paid = s.payment_status === "paid_confirmed";
          if (paid) {
            confirmed++;
            const amt = typeof s.amount === "string" ? Number(s.amount) : (s.amount ?? 0);
            if (!Number.isNaN(amt)) revenue += amt;
            if (s.access_status === "pending_access") pending++;
          }
          if (s.access_status === "access_granted") granted++;
          if (s.access_status === "access_revoked") revoked++;
        }

        setMetrics({
          loading: false,
          error: salesRes?.error ? "Não foi possível carregar vendas manuais." : null,
          revenueConfirmed: revenue,
          salesConfirmed: confirmed,
          pendingAccess: pending,
          accessGranted: granted,
          accessRevoked: revoked,
          giftRedemptions: giftsRes?.count ?? null,
          supportMessages: supportRes?.count ?? null,
        });
      } catch (e) {
        if (cancelled) return;
        setMetrics((m) => ({
          ...m,
          loading: false,
          error: e instanceof Error ? e.message : "Erro ao carregar métricas.",
        }));
      }
    })();
    return () => { cancelled = true; };
  };

  useEffect(() => {
    const cleanup = load();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkoutPending = !isValidUrl(APP_CONFIG.CHECKOUT_FABRICA_URL);
  const fmtBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const fmt = (n: number | null) => (n === null ? "—" : String(n));
  const dash = (n: number | null) => (metrics.loading ? "…" : fmt(n));

  if (metrics.error && metrics.salesConfirmed === 0 && !metrics.loading) {
    return (
      <div className="space-y-4">
        <div className="glass-strong p-6 text-center">
          <AlertTriangle className="mx-auto text-amber-300 mb-2" size={24} />
          <h3 className="font-heading font-semibold text-sm mb-1">Não foi possível carregar esta área</h3>
          <p className="text-xs text-muted-foreground mb-4">{metrics.error}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={load} className="btn-primary text-xs">
              <RefreshIcon /> Tentar novamente
            </button>
            <button onClick={() => onGoTo("vendas")} className="btn-ghost border border-white/15 text-xs">
              Ir para Vendas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 text-sky-100 text-sm px-4 py-3 flex items-start gap-2">
        <CreditCard size={16} className="shrink-0 mt-0.5" />
        <span>
          Operação manual ativa. Os dados abaixo vêm das vendas registradas no admin enquanto o checkout automático não está conectado.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusCard
          icon={<CreditCard size={16} />}
          title="Receita manual confirmada"
          badge={metrics.loading ? "…" : fmtBRL(metrics.revenueConfirmed)}
          tone={metrics.revenueConfirmed > 0 ? "ok" : "muted"}
          text="Soma de vendas manuais com pagamento confirmado."
        />
        <StatusCard
          icon={<UserCheck size={16} />}
          title="Vendas confirmadas"
          badge={dash(metrics.salesConfirmed)}
          tone={metrics.salesConfirmed > 0 ? "ok" : "muted"}
          text="Vendas com pagamento confirmado em manual_sales."
        />
        <StatusCard
          icon={<AlertTriangle size={16} />}
          title="Aguardando liberação"
          badge={dash(metrics.pendingAccess)}
          tone={metrics.pendingAccess > 0 ? "warn" : "muted"}
          text="Aguardando primeiro login/liberação do comprador."
        />
        <StatusCard
          icon={<ShieldCheck size={16} />}
          title="Acessos liberados"
          badge={dash(metrics.accessGranted)}
          tone={metrics.accessGranted > 0 ? "ok" : "muted"}
          text="Vendas marcadas como acesso liberado."
        />
        <StatusCard
          icon={<ShieldOff size={16} />}
          title="Acessos revogados"
          badge={dash(metrics.accessRevoked)}
          tone={metrics.accessRevoked > 0 ? "warn" : "muted"}
          text="Vendas marcadas como acesso revogado."
        />
        <StatusCard
          icon={<Bot size={16} />}
          title="Códigos premium usados"
          badge={dash(metrics.giftRedemptions)}
          tone="muted"
          text="Total de resgates registrados."
        />
        <StatusCard
          icon={<Mail size={16} />}
          title="Mensagens recebidas"
          badge={dash(metrics.supportMessages)}
          tone="muted"
          text="Suporte recebido pela área interna."
        />
        <StatusCard
          icon={<CreditCard size={16} />}
          title="Status do checkout"
          badge={checkoutPending ? "Manual" : "Configurado"}
          tone={checkoutPending ? "muted" : "ok"}
          text={
            checkoutPending
              ? "Checkout automático ainda não conectado. As vendas atuais são registradas manualmente."
              : "Checkout configurado."
          }
        />
      </div>

      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-3">Próximas ações</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onGoTo("vendas")} className="btn-primary text-xs">
            <ShoppingCartIcon /> Registrar venda manual
          </button>
          <button onClick={() => onGoTo("vendas")} className="btn-ghost border border-white/15 text-xs">
            Ver vendas
          </button>
          <button onClick={() => onGoTo("acessos")} className="btn-ghost border border-white/15 text-xs">
            <ShieldCheck size={14} /> Liberar acesso
          </button>
          <button onClick={() => onGoTo("inbox")} className="btn-ghost border border-white/15 text-xs">
            <Mail size={14} /> Ver mensagens
          </button>
          <button onClick={() => onGoTo("pendencias")} className="btn-ghost border border-white/15 text-xs">
            Prontidão para venda pública
          </button>
        </div>
      </div>

      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1">Automação de pagamento</h3>
        <p className="text-xs text-muted-foreground">
          Webhook: não configurado. Webhook de pagamento é uma etapa futura — por enquanto todos os acessos são confirmados manualmente.
        </p>
      </div>

      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1">Admin logado</h3>
        <p className="text-xs text-muted-foreground mb-3">
          {adminEmail ?? "Sessão admin não detectada."} · Acesso interno: {selfHasAccess ? "ativo" : "inativo"}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onGoTo("acessos")} className="btn-primary">
            <ShieldCheck size={14} /> Ir para Acessos
          </button>
          <Link to="/entrega" className="btn-ghost border border-white/15">
            <ExternalLink size={14} /> Abrir Minha área
          </Link>
        </div>
      </div>

      <AdminAuditLog />
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
    </svg>
  );
}
function ShoppingCartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}

function AcessosSection({
  email,
  setEmail,
  status,
  setStatus,
  acting,
  onSearch,
  setAccess,
  selfHasAccess,
  onSelfChanged,
  logsRefresh,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: Status;
  setStatus: (s: Status) => void;
  acting: boolean;
  onSearch: (e: React.FormEvent) => void;
  setAccess: (id: string, has: boolean) => void;
  selfHasAccess: boolean | null;
  onSelfChanged: (v: boolean) => void;
  logsRefresh: number;
}) {
  const row = status.kind === "found" || status.kind === "success" ? status.row : null;
  return (
    <div className="space-y-5">
      {/* Overview chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <OverviewCard
          icon={<UserCheck size={16} />}
          title="Meu acesso"
          text={
            selfHasAccess === null
              ? "Status do acesso do admin logado."
              : selfHasAccess
                ? "Ativo. Você pode entrar na área interna."
                : "Sem acesso. Use o bloco Teste admin abaixo."
          }
          tone={selfHasAccess ? "ok" : "default"}
        />
        <OverviewCard
          icon={<ShieldCheck size={16} />}
          title="Liberação manual"
          text="Use quando o pagamento foi confirmado fora do app."
        />
        <OverviewCard
          icon={<Search size={16} />}
          title="Busca por comprador"
          text="Encontre usuários pelo e-mail usado na compra."
        />
        <OverviewCard
          icon={<ShieldCheck size={16} />}
          title="Segurança"
          text="Somente admins podem liberar ou revogar acesso."
        />
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-100 text-sm px-4 py-3 flex items-start gap-2">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <span>
          Libere acesso apenas após confirmar o pagamento. Esta tela é exclusiva para administradores.
        </span>
      </div>

      {/* Flow */}
      <div className="glass-strong p-5">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid size={16} className="text-accent" />
          <h2 className="font-heading font-semibold text-sm">Liberar acesso manualmente</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Use esta área para liberar acesso após confirmar o pagamento no checkout externo ou para conceder acesso de teste/cortesia.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Confirme o pagamento no gateway ou WhatsApp.",
            "Busque o comprador pelo e-mail usado na compra.",
            "Confira se o usuário foi encontrado.",
            "Libere ou revogue acesso (pago confirmado, teste interno, cortesia ou código premium).",
            "Oriente o comprador a entrar em Minha área.",
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-semibold inline-flex items-center justify-center border border-accent/30">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <SelfGrant onChanged={onSelfChanged} />

      {/* Search */}
      <div className="glass-strong p-6">
        <form onSubmit={onSearch} className="space-y-3">
          <label className="text-xs text-muted-foreground block font-semibold">E-mail do comprador</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className={inputCls}
              type="email"
              placeholder="comprador@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={status.kind === "loading"} className="btn-primary">
              {status.kind === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /> Buscando…</>
              ) : (
                <><Search size={16} /> Buscar</>
              )}
            </button>
          </div>
        </form>
      </div>

      {status.kind === "not_found" && (
        <div className="glass-strong p-6 text-center text-muted-foreground text-sm">
          Nenhum usuário encontrado com este e-mail. Verifique se o comprador já criou conta.
        </div>
      )}

      {status.kind === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm px-4 py-3">
          Não foi possível concluir a ação. Verifique sua permissão de admin.
          <div className="text-[11px] text-red-200/70 mt-1">Detalhe: {status.message}</div>
        </div>
      )}

      {status.kind === "success" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm px-4 py-3">
            {status.message}
          </div>
          {status.action === "grant" && (
            <div className="glass-strong p-5">
              <h3 className="font-heading font-semibold text-sm mb-1">Próximo passo</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Oriente o comprador a acessar Minha área com o mesmo e-mail do cadastro.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/entrega"
                  className="text-xs px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center justify-center gap-2 font-semibold"
                >
                  Ir para Minha área <ArrowRight size={12} />
                </Link>
                <CopyButton text={BUYER_HANDOFF_MESSAGE} label="Copiar mensagem para comprador" />
              </div>
            </div>
          )}
        </div>
      )}

      {row && (
        <div className="glass-strong p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-accent" />
              <h2 className="font-heading font-semibold">Comprador encontrado</h2>
            </div>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full border ${
                row.access_exists && row.has_access
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-white/10 text-muted-foreground border-white/15"
              }`}
            >
              {row.access_exists && row.has_access ? "Acesso ativo" : "Sem acesso"}
            </span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Info label="E-mail" value={row.email} />
            <Info label="user_id" value={row.user_id} mono />
            <Info
              label="Status"
              value={!row.access_exists ? "Sem registro" : row.has_access ? "Ativo" : "Sem acesso"}
              tone={row.access_exists && row.has_access ? "ok" : row.access_exists ? "warn" : "muted"}
            />
            <Info label="Origem" value={row.source ?? "—"} />
            <Info
              label="Criado em"
              value={row.access_created_at ? new Date(row.access_created_at).toLocaleString("pt-BR") : "—"}
            />
          </dl>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => setAccess(row.user_id, true)}
              disabled={acting || (row.access_exists && row.has_access === true)}
              className={
                row.access_exists && row.has_access === true
                  ? "btn-ghost flex-1 border border-white/10 opacity-70"
                  : "btn-primary flex-1"
              }
            >
              {acting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  {row.access_exists ? "Liberar acesso" : "Criar e liberar acesso"}
                </>
              )}
            </button>
            <button
              onClick={() => setAccess(row.user_id, false)}
              disabled={acting || !row.access_exists || row.has_access === false}
              className="btn-ghost flex-1 border border-red-500/30 text-red-200 hover:bg-red-500/10"
            >
              <ShieldOff size={16} /> Revogar acesso
            </button>
          </div>
        </div>
      )}

      <AccessLogs refreshKey={logsRefresh} />
    </div>
  );
}

function CompradoresSection({
  email,
  setEmail,
  status,
  onSearch,
  onGoToAcessos,
  onViewBuyer,
  onSetBuyerAccess,
}: {
  email: string;
  setEmail: (v: string) => void;
  status: Status;
  onSearch: (e: React.FormEvent) => void;
  onGoToAcessos: () => void;
  onViewBuyer: (b: Buyer) => void;
  onSetBuyerAccess: (b: Buyer, has: boolean) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <BuyersList onView={onViewBuyer} onSetAccess={onSetBuyerAccess} />

      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1">Busca operacional</h3>
        <p className="text-xs text-muted-foreground mb-4">
          A busca por comprador depende de o usuário já ter criado conta na área interna. Use o mesmo e-mail informado na compra.
        </p>
        <form onSubmit={onSearch} className="space-y-2">
          <label className="text-xs text-muted-foreground block font-semibold">E-mail do comprador</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className={inputCls}
              type="email"
              placeholder="comprador@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              <Search size={16} /> Buscar
            </button>
          </div>
        </form>
        {status.kind === "found" && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <span>Comprador localizado: {status.row.email}</span>
            <button onClick={onGoToAcessos} className="text-xs underline">
              Abrir em Acessos →
            </button>
          </div>
        )}
        {status.kind === "not_found" && (
          <div className="mt-4 text-sm text-muted-foreground">
            Nenhum comprador encontrado. Confirme se ele já criou conta no app.
          </div>
        )}
      </div>

      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1">Observação</h3>
        <p className="text-xs text-muted-foreground">
          Para liberar, revogar ou ver detalhes do acesso, use a seção <button onClick={onGoToAcessos} className="text-accent underline">Acessos</button>.
        </p>
      </div>
    </div>
  );
}

function PendenciasSection() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDENCIAS_KEY);
      if (raw) setChecks(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);
  const toggle = (id: string) => {
    setChecks((p) => {
      const next = { ...p, [id]: !p[id] };
      try {
        localStorage.setItem(PENDENCIAS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const done = PENDENCIAS_ITEMS.filter((i) => checks[i.id]).length;
  return (
    <div className="space-y-4">
      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1">Prontidão para venda pública</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Salvo apenas no seu navegador. Não interfere no acesso nem no progresso de quem compra. {done}/{PENDENCIAS_ITEMS.length} concluídos.
        </p>
        <p className="text-[11px] text-muted-foreground/80 mb-4 rounded-md border border-white/10 bg-white/5 px-3 py-2">
          Marque os itens manualmente conforme forem concluídos. O único bloqueio real para venda pública agora é a URL real do checkout.
        </p>
        <ul className="space-y-1">
          {PENDENCIAS_ITEMS.map((item) => {
            const isDone = !!checks[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full text-left flex items-start gap-2 text-sm py-2 px-2 rounded-lg hover:bg-white/5"
                  aria-pressed={isDone}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className={isDone ? "line-through text-muted-foreground" : "text-foreground/90"}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MensagensSection() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const loginLink = origin ? `${origin}${LOGIN_URL}` : LOGIN_URL;
  const entregaLink = origin ? `${origin}${ENTREGA_URL}` : ENTREGA_URL;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Mensagens prontas para responder clientes. Use os botões para copiar o texto puro ou com link.
      </p>
      {SUPPORT_MESSAGES.map((m) => (
        <div key={m.title} className="glass-strong p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-heading font-semibold text-foreground">{m.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.text}</p>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={m.text} label="Copiar mensagem" compact />
            <CopyButton text={`${m.text}\n\nLogin: ${loginLink}`} label="Copiar com link de login" compact />
            <CopyButton text={`${m.text}\n\nMinha área: ${entregaLink}`} label="Copiar com link da área interna" compact />
          </div>
        </div>
      ))}
    </div>
  );
}


function ConfigSection() {
  const checkoutOk = isValidUrl(APP_CONFIG.CHECKOUT_FABRICA_URL);
  const supportOk = !!APP_CONFIG.SUPORTE_EMAIL?.trim();
  const agentOk = !!APP_CONFIG.GPT_AGENT_URL?.trim();
  const legalMissing = [
    !APP_CONFIG.COMPANY_NAME?.trim() && "Razão social",
    !APP_CONFIG.COMPANY_DOCUMENT?.trim() && "Documento",
    !APP_CONFIG.RESPONSIBLE_NAME?.trim() && "Responsável",
  ].filter(Boolean) as string[];
  const legalOk = legalMissing.length === 0;

  const publicUrl = typeof window !== "undefined" ? window.location.origin : "—";

  const items = [
    {
      icon: <CreditCard size={16} />,
      title: "Checkout",
      ok: checkoutOk,
      text: checkoutOk ? "Checkout configurado." : "Checkout real pendente (CHECKOUT_FABRICA_URL ainda placeholder ou vazio).",
    },
    {
      icon: <Mail size={16} />,
      title: "Suporte",
      ok: supportOk,
      text: supportOk ? (APP_CONFIG.SUPORTE_EMAIL as string) : "E-mail de suporte ainda não configurado.",
    },
    {
      icon: <ExternalLink size={16} />,
      title: "URL pública do app",
      ok: true,
      text: publicUrl,
    },
    {
      icon: <ShieldCheck size={16} />,
      title: "Login Google",
      ok: true,
      text: "Habilitado no Lovable Cloud. Login não concede admin nem acesso pago automaticamente.",
    },
    {
      icon: <UserCheck size={16} />,
      title: "Área interna",
      ok: true,
      text: "/entrega protegida por login e status de acesso.",
    },
    {
      icon: <ShoppingCartIcon />,
      title: "Painel de vendas manuais",
      ok: true,
      text: "Operacional. Registre vendas e libere acesso pela aba Vendas.",
    },
    {
      icon: <AlertTriangle size={16} />,
      title: "Webhook de pagamento",
      ok: false,
      text: "Não configurado. Webhook será uma etapa futura.",
    },
    {
      icon: <Bot size={16} />,
      title: "Agente Arquiteto",
      ok: agentOk,
      text: agentOk ? "GPT_AGENT_URL configurado." : "GPT_AGENT_URL vazio.",
    },
    {
      icon: <FileText size={16} />,
      title: "Dados legais",
      ok: legalOk,
      text: legalOk ? "Razão social, documento e responsável preenchidos." : `Pendente: ${legalMissing.join(", ")}.`,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Somente leitura. Valores vêm de <code className="text-foreground/80">APP_CONFIG</code>. Para alterar, edite <code className="text-foreground/80">src/config/appConfig.ts</code>.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.title} className="glass-strong p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-accent">
                {it.icon}
                <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">{it.title}</h4>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  it.ok
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-200 border-amber-500/30"
                }`}
              >
                {it.ok ? "Configurado" : "Pendente"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground break-words">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== Building blocks ============================== */

function OverviewCard({
  icon,
  title,
  text,
  tone = "default",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone?: "default" | "ok";
}) {
  return (
    <div className="glass-strong p-4">
      <div className={`flex items-center gap-2 mb-1.5 ${tone === "ok" ? "text-emerald-300" : "text-accent"}`}>
        {icon}
        <h3 className="text-xs font-heading font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{text}</p>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  text,
  badge,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  badge: string;
  tone: "ok" | "warn" | "muted";
}) {
  const toneCls =
    tone === "ok"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : tone === "warn"
        ? "bg-amber-500/15 text-amber-200 border-amber-500/30"
        : "bg-white/10 text-muted-foreground border-white/15";
  return (
    <div className="glass-strong p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-accent">
          {icon}
          <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
            {title}
          </h4>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${toneCls}`}>{badge}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug break-words">{text}</p>
    </div>
  );
}

function CopyButton({ text, label, compact }: { text: string; label: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copiado");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };
  return (
    <button
      onClick={copy}
      className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition ${
        compact ? "text-[11px] px-2.5 py-1" : "text-xs px-3 py-2"
      }`}
    >
      {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

function Info({
  label,
  value,
  mono,
  tone = "default",
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "default" | "ok" | "warn" | "muted";
}) {
  const toneCls =
    tone === "ok"
      ? "text-accent"
      : tone === "warn"
        ? "text-amber-300"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={`${toneCls} ${mono ? "font-mono text-xs break-all" : ""}`}>{value}</div>
    </div>
  );
}

function SelfGrant({ onChanged }: { onChanged?: (hasAccess: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  const grant = async () => {
    setLoading(true);
    setMsg(null);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setLoading(false);
      setMsg({ kind: "err", text: "Sessão não encontrada." });
      return;
    }
    const { data, error } = await supabase.rpc("admin_set_access", {
      _user_id: uid,
      _has_access: true,
    });
    setLoading(false);
    if (error) return setMsg({ kind: "err", text: error.message });
    const res = data as { success?: boolean; error?: string } | null;
    if (!res?.success) return setMsg({ kind: "err", text: res?.error ?? "Falha." });
    setMsg({ kind: "ok", text: "Seu acesso de teste foi liberado." });
    onChanged?.(true);
  };
  return (
    <div className="glass-strong p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-heading font-semibold text-sm mb-1">Teste admin</h2>
          <p className="text-xs text-muted-foreground mb-1">
            Use este botão apenas para liberar seu próprio acesso durante testes internos.
          </p>
          <p className="text-xs text-muted-foreground">
            Logado como: <span className="text-foreground/80">{email ?? "—"}</span>
          </p>
        </div>
        <button onClick={grant} disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><ShieldCheck size={16} /> Liberar meu acesso</>}
        </button>
      </div>
      {msg && (
        <div
          className={`mt-3 text-xs rounded-lg px-3 py-2 ${
            msg.kind === "ok"
              ? "bg-accent/10 text-accent border border-accent/30"
              : "bg-red-500/10 text-red-200 border border-red-500/30"
          }`}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}
