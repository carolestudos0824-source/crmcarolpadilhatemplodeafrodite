import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  CreditCard,
  Mail,
  Bot,
  FileText,
  UserPlus,
  Search,
  ArrowRight,
  ExternalLink,
  ListChecks,
  Megaphone,
  AlertTriangle,
} from "lucide-react";
import { APP_CONFIG } from "@/config/appConfig";
import { openConfiguredUrl } from "@/lib/openLink";
import { toast } from "sonner";

const CHECKLIST_KEY = "fabrica_admin_prelaunch_checklist_v1";

const CHECKLIST_ITEMS = [
  { id: "checkout", label: "Checkout real configurado" },
  { id: "suporte", label: "E-mail de suporte configurado" },
  { id: "legal", label: "Dados legais preenchidos" },
  { id: "obrigado", label: "Página de obrigado revisada" },
  { id: "fluxo", label: "Fluxo de liberação testado" },
  { id: "mobile", label: "Área interna testada no mobile" },
  { id: "revogar", label: "Admin consegue liberar e revogar acesso" },
  { id: "mensagem", label: "Mensagem para comprador pronta" },
];

const BUYER_HANDOFF_MESSAGE =
  "Seu acesso à Fábrica de Apps com IA foi liberado. Entre em Minha área usando o e-mail do cadastro e comece pelo módulo Comece aqui.";

type CheckoutStatus = "ok" | "missing" | "review";

function detectCheckoutStatus(url: string): CheckoutStatus {
  const trimmed = (url || "").trim();
  if (!trimmed) return "missing";
  if (/^COLE_AQUI/i.test(trimmed)) return "missing";
  if (/^(https?:\/\/)/i.test(trimmed)) return "ok";
  return "review";
}

export function AdminOverview({ onScrollToSearch }: { onScrollToSearch: () => void }) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) setChecks(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const toggle = (id: string) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const checkoutStatus = detectCheckoutStatus(APP_CONFIG.CHECKOUT_FABRICA_URL);
  const supportEmail = (APP_CONFIG.SUPORTE_EMAIL || "").trim();
  const agentUrl = (APP_CONFIG.GPT_AGENT_URL || "").trim();
  const legalMissing = [
    !APP_CONFIG.COMPANY_NAME?.trim() && "Razão social",
    !APP_CONFIG.COMPANY_DOCUMENT?.trim() && "CNPJ/Documento",
    !APP_CONFIG.RESPONSIBLE_NAME?.trim() && "Responsável",
  ].filter(Boolean) as string[];

  const copyHandoff = async () => {
    try {
      await navigator.clipboard.writeText(BUYER_HANDOFF_MESSAGE);
      setCopied(true);
      toast.success("Mensagem copiada");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <section className="mb-8 space-y-4" aria-labelledby="visao-geral-admin">
      <header>
        <h2 id="visao-geral-admin" className="text-lg md:text-xl font-heading font-bold mb-1">
          Visão geral admin
        </h2>
        <p className="text-xs text-muted-foreground">
          Acompanhe rapidamente o estado dos acessos e ações manuais do programa.
        </p>
      </header>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusCard
          icon={<UserPlus size={16} />}
          title="Acesso manual"
          badge={{ label: "Ativo", tone: "ok" }}
          text="Fluxo atual: admin confirma pagamento e libera acesso manualmente."
        />
        <StatusCard
          icon={<CreditCard size={16} />}
          title="Checkout"
          badge={
            checkoutStatus === "ok"
              ? { label: "Configurado", tone: "ok" }
              : checkoutStatus === "missing"
                ? { label: "Não configurado", tone: "warn" }
                : { label: "Verificar", tone: "review" }
          }
          text={
            checkoutStatus === "ok"
              ? "CHECKOUT_FABRICA_URL aponta para uma URL válida."
              : checkoutStatus === "missing"
                ? "CHECKOUT_FABRICA_URL ainda está com placeholder ou vazio."
                : "CHECKOUT_FABRICA_URL existe, mas não parece uma URL pública. Verifique."
          }
        />
        <StatusCard
          icon={<Mail size={16} />}
          title="Suporte"
          badge={
            supportEmail
              ? { label: "Configurado", tone: "ok" }
              : { label: "Pendente", tone: "warn" }
          }
          text={supportEmail ? supportEmail : "E-mail de suporte ainda não configurado."}
        />
        <StatusCard
          icon={<Bot size={16} />}
          title="Agente Arquiteto"
          badge={
            agentUrl
              ? { label: "Configurado", tone: "ok" }
              : { label: "Pendente", tone: "warn" }
          }
          text={agentUrl ? "GPT_AGENT_URL está preenchido." : "GPT_AGENT_URL vazio."}
        />
        <StatusCard
          icon={<FileText size={16} />}
          title="Dados legais"
          badge={
            legalMissing.length === 0
              ? { label: "Completo", tone: "ok" }
              : { label: `${legalMissing.length} pendente(s)`, tone: "warn" }
          }
          text={
            legalMissing.length === 0
              ? "Razão social, documento e responsável preenchidos."
              : `Pendente: ${legalMissing.join(", ")}.`
          }
        />
        <StatusCard
          icon={<Megaphone size={16} />}
          title="Modo atual de venda"
          badge={{ label: "Manual", tone: "review" }}
          text="Pagamento confirmado fora do app e acesso liberado pelo admin."
        />
      </div>

      {/* Quick actions */}
      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
          <ArrowRight size={14} className="text-accent" /> Ações rápidas
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onScrollToSearch}
            className="text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center gap-2"
          >
            <Search size={12} /> Buscar comprador
          </button>
          <Link
            to="/entrega"
            className="text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center gap-2"
          >
            <ExternalLink size={12} /> Ir para Minha área
          </Link>
          <Link
            to="/checkout?plano=fabrica"
            className="text-xs px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center gap-2"
          >
            <CreditCard size={12} /> Ir para Checkout
          </Link>
          <button
            type="button"
            onClick={copyHandoff}
            className="text-xs px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 font-semibold"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copiado" : "Copiar mensagem de acesso liberado"}
          </button>
          {checkoutStatus !== "ok" && (
            <button
              type="button"
              onClick={() =>
                openConfiguredUrl(APP_CONFIG.CHECKOUT_FABRICA_URL, "Checkout ainda não configurado.")
              }
              className="text-xs px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 inline-flex items-center gap-2"
            >
              <AlertTriangle size={12} /> Testar checkout
            </button>
          )}
        </div>
      </div>

      {/* Pre-launch checklist */}
      <div className="glass-strong p-5">
        <h3 className="font-heading font-semibold text-sm mb-1 flex items-center gap-2">
          <ListChecks size={14} className="text-accent" /> Pendências antes da venda pública
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Checklist administrativo. Salvo apenas no seu navegador e não afeta o progresso do aluno.
        </p>
        <ul className="space-y-1.5">
          {CHECKLIST_ITEMS.map((item) => {
            const done = !!checks[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full text-left flex items-start gap-2 text-sm py-1.5 px-2 rounded-lg hover:bg-white/5 transition"
                  aria-pressed={done}
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className={done ? "line-through text-muted-foreground" : "text-foreground/90"}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sales mode block */}
      <div className="glass-strong p-5 border border-white/10">
        <h3 className="font-heading font-semibold text-sm mb-1 flex items-center gap-2">
          <Megaphone size={14} className="text-accent" /> Modo atual de venda
        </h3>
        <p className="text-sm text-foreground/85">
          Venda manual: o pagamento é confirmado fora do app e o acesso é liberado pelo admin.
        </p>
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-white/5">
          Quando houver webhook de pagamento, este fluxo poderá ser automatizado. Por enquanto, não
          prometa acesso automático se ele ainda não existe.
        </p>
      </div>
    </section>
  );
}

function StatusCard({
  icon,
  title,
  text,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  badge: { label: string; tone: "ok" | "warn" | "review" };
}) {
  const toneCls =
    badge.tone === "ok"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : badge.tone === "warn"
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
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${toneCls}`}>
          {badge.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug break-words">{text}</p>
    </div>
  );
}
