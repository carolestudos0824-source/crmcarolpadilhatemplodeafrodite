import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Code2,
  Database,
  Store,
  CreditCard,
  ShieldCheck,
  KeyRound,
  Bell,
  LogIn,
  ChevronRight,
  ExternalLink,
  X,
  Settings2,
  Wrench,
  Cloud,
} from "lucide-react";

type Status = "ativo" | "pendente" | "nao_implementado";
type Dependency = "externa" | "codigo" | "ambas" | "nenhuma";

interface Item {
  id: string;
  name: string;
  detail: string;
  icon: typeof Code2;
  status: Status;
  dependency: Dependency;
  whatsMissing?: string[];
  nextStep?: string;
  externalLink?: { label: string; url: string };
}

const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; cls: string; dot: string }> = {
  ativo: {
    label: "Ativo",
    icon: CheckCircle2,
    cls: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  pendente: {
    label: "Pendente",
    icon: Clock,
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
  },
  nao_implementado: {
    label: "Não implementado",
    icon: AlertCircle,
    cls: "bg-muted/50 text-muted-foreground border-border/40",
    dot: "bg-muted-foreground/40",
  },
};

const DEPENDENCY_META: Record<Dependency, { label: string; icon: typeof Cloud }> = {
  externa: { label: "Configuração externa", icon: Cloud },
  codigo: { label: "Implementação em código", icon: Code2 },
  ambas: { label: "Externa + código", icon: Wrench },
  nenhuma: { label: "Sem dependências", icon: CheckCircle2 },
};

const INFRA: Item[] = [
  {
    id: "db",
    name: "Banco de dados",
    detail: "Lovable Cloud · ativo",
    icon: Database,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Nenhuma ação necessária.",
  },
  {
    id: "code",
    name: "Acesso ao código",
    detail: "Lovable · edição e export disponíveis",
    icon: Code2,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Edição e deploy automatizados pela plataforma.",
  },
];

const AUTH: Item[] = [
  {
    id: "auth-email",
    name: "Autenticação por e-mail e senha",
    detail: "Login e cadastro padrão",
    icon: KeyRound,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Operacional. Sem ação pendente.",
  },
  {
    id: "auth-roles",
    name: "Papéis administrativos",
    detail: "Admin · Moderador · Usuário",
    icon: ShieldCheck,
    status: "ativo",
    dependency: "nenhuma",
    nextStep: "Gestão completa em Papéis.",
  },
  {
    id: "auth-oauth",
    name: "OAuth Google / Apple",
    detail: "Login social com provedores",
    icon: LogIn,
    status: "nao_implementado",
    dependency: "ambas",
    whatsMissing: [
      "Configurar Client ID e Secret no Google Cloud",
      "Configurar Service ID na Apple Developer",
      "Habilitar provedores no backend",
      "Adicionar botões de login social na tela de Auth",
    ],
    nextStep: "Decidir prioridade pós-beta. Não bloqueia lançamento.",
  },
];

const COMERCIAL: Item[] = [
  {
    id: "stripe",
    name: "Stripe (web)",
    detail: "Cobrança recorrente mensal e anual",
    icon: CreditCard,
    status: "pendente",
    dependency: "externa",
    whatsMissing: [
      "Criar produtos Mensal (R$ 29,90) e Anual (R$ 197) no Stripe",
      "Definir STRIPE_SECRET_KEY no backend",
      "Definir STRIPE_WEBHOOK_SECRET no backend",
      "Definir STRIPE_PRICE_MONTHLY e STRIPE_PRICE_YEARLY",
      "Apontar webhook do Stripe para a função stripe-webhook",
      "Validar checkout end-to-end com cartão de teste",
    ],
    nextStep: "Configurar credenciais e disparar checkout de teste para validar persistência em subscription_events.",
    externalLink: { label: "Stripe Dashboard", url: "https://dashboard.stripe.com" },
  },
  {
    id: "revenuecat",
    name: "RevenueCat (mobile)",
    detail: "Assinaturas via App Store e Google Play",
    icon: Store,
    status: "nao_implementado",
    dependency: "ambas",
    whatsMissing: [
      "Criar app no RevenueCat e linkar com App Store / Play Console",
      "Configurar produtos IAP nas lojas",
      "Implementar SDK no app mobile (fase pós-web)",
      "Conectar webhook do RevenueCat ao backend",
    ],
    nextStep: "Aguardar lançamento do app mobile. Não aplicável na fase web.",
    externalLink: { label: "RevenueCat", url: "https://www.revenuecat.com" },
  },
];

const ENGAJAMENTO: Item[] = [
  {
    id: "push",
    name: "Notificações push",
    detail: "Lembretes diários e retenção",
    icon: Bell,
    status: "nao_implementado",
    dependency: "ambas",
    whatsMissing: [
      "Definir provedor (OneSignal, Firebase ou nativo)",
      "Configurar credenciais e certificados push",
      "Implementar opt-in e gerenciamento de preferências",
      "Criar fluxos de envio (streak, lembrete diário, lições novas)",
    ],
    nextStep: "Planejar pós-beta. Web push é opcional; mobile push depende do app nativo.",
  },
];

const SECTIONS: Array<{ id: string; title: string; description: string; items: Item[] }> = [
  {
    id: "infra",
    title: "Infraestrutura",
    description: "Base técnica da plataforma — sem ação operacional necessária.",
    items: INFRA,
  },
  {
    id: "auth",
    title: "Autenticação e acesso",
    description: "Como pessoas entram e que permissões recebem.",
    items: AUTH,
  },
  {
    id: "comercial",
    title: "Comercial",
    description: "Cobrança recorrente e monetização. Centro do produto.",
    items: COMERCIAL,
  },
  {
    id: "engajamento",
    title: "Engajamento",
    description: "Canais de retenção e reativação.",
    items: ENGAJAMENTO,
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

const ItemRow = ({ item, onClick }: { item: Item; onClick: () => void }) => {
  const meta = STATUS_META[item.status];
  const Icon = item.icon;
  const StatusIcon = meta.icon;
  const active = item.status === "ativo";
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border/60 transition-all text-left group"
    >
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground">{item.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
      </div>
      <span
        className={`flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full shrink-0 border ${meta.cls}`}
      >
        <StatusIcon className="w-3 h-3" />
        {meta.label}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
    </button>
  );
};

const ItemDetailDrawer = ({ item, onClose }: { item: Item; onClose: () => void }) => {
  const meta = STATUS_META[item.status];
  const dep = DEPENDENCY_META[item.dependency];
  const StatusIcon = meta.icon;
  const DepIcon = dep.icon;
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Fechar"
      />
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-card border border-border/60 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200">
        <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border/40 p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base text-foreground">{item.name}</h3>
            <p className="text-[11px] text-muted-foreground">{item.detail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-1 rounded-full border ${meta.cls}`}
            >
              <StatusIcon className="w-3 h-3" />
              {meta.label}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-1 rounded-full border border-border/40 bg-muted/30 text-muted-foreground">
              <DepIcon className="w-3 h-3" />
              {dep.label}
            </span>
          </div>

          {item.whatsMissing && item.whatsMissing.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-heading tracking-[0.18em] uppercase text-muted-foreground/70">
                O que falta
              </h4>
              <ul className="space-y-1.5">
                {item.whatsMissing.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-foreground/90 leading-relaxed"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.nextStep && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-heading tracking-[0.18em] uppercase text-muted-foreground/70">
                Próximo passo
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed p-3 rounded-lg bg-muted/30 border border-border/30">
                {item.nextStep}
              </p>
            </div>
          )}

          {item.externalLink && (
            <a
              href={item.externalLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-heading tracking-wide hover:bg-primary/15 transition-colors"
            >
              {item.externalLink.label}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [selected, setSelected] = useState<Item | null>(null);

  const active = ALL_ITEMS.filter((i) => i.status === "ativo").length;
  const pending = ALL_ITEMS.filter((i) => i.status === "pendente").length;
  const missing = ALL_ITEMS.filter((i) => i.status === "nao_implementado").length;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-heading text-lg text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Central operacional de governança e configuração da plataforma.
        </p>
      </header>

      {/* ═══ CAMADA 1: VISÃO GERAL DE STATUS ═══ */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/70">
            Visão geral de status
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Ativos", value: active, status: "ativo" as Status },
            { label: "Pendentes", value: pending, status: "pendente" as Status },
            { label: "Não implementados", value: missing, status: "nao_implementado" as Status },
          ].map((s) => {
            const meta = STATUS_META[s.status];
            return (
              <div
                key={s.label}
                className="p-3 rounded-lg border border-border/40 bg-card/30 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  <p className="font-heading text-xl text-foreground">{s.value}</p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed px-1">
          Toque em qualquer item abaixo para ver o que falta, dependências e o próximo passo concreto.
        </p>
      </section>

      {/* ═══ CAMADA 2: AÇÕES E CONFIGURAÇÕES REAIS ═══ */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/70">
            Ações e configurações reais
          </h3>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.id} className="space-y-2">
            <div>
              <h4 className="font-heading text-sm text-foreground">{section.title}</h4>
              <p className="text-[11px] text-muted-foreground">{section.description}</p>
            </div>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <ItemRow key={item.id} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-lg border border-border/30 bg-muted/20 p-3 text-[11px] text-muted-foreground leading-relaxed">
        Esta tela é o painel de governança. Gestão de papéis fica em{" "}
        <span className="text-foreground">Papéis</span>, códigos presente em{" "}
        <span className="text-foreground">Presentes</span>, assinaturas em{" "}
        <span className="text-foreground">Assinaturas</span>, e o histórico de mudanças em{" "}
        <span className="text-foreground">Auditoria</span>.
      </div>

      {selected && <ItemDetailDrawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default AdminSettings;
