import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Code2,
  Database,
  Store,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Gift,
  KeyRound,
  Bell,
  LogIn,
} from "lucide-react";

type Status = "ativo" | "pendente" | "nao_implementado";

interface Item {
  name: string;
  detail: string;
  icon: typeof Code2;
  status: Status;
}

const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  ativo: { label: "Ativo", icon: CheckCircle2, cls: "bg-primary/10 text-primary" },
  pendente: { label: "Pendente", icon: Clock, cls: "bg-secondary/20 text-secondary-foreground" },
  nao_implementado: {
    label: "Não implementado",
    icon: AlertCircle,
    cls: "bg-muted/40 text-muted-foreground/70",
  },
};

const PLATFORM: Item[] = [
  { name: "Painel administrativo", detail: "/admin — esta tela", icon: LayoutDashboard, status: "ativo" },
  { name: "Banco de dados", detail: "Lovable Cloud", icon: Database, status: "ativo" },
  { name: "Acesso ao código", detail: "Lovable — edição e export", icon: Code2, status: "ativo" },
];

const AUTH_ACCESS: Item[] = [
  { name: "Autenticação por e-mail e senha", detail: "Login e cadastro padrão", icon: KeyRound, status: "ativo" },
  { name: "Papéis administrativos", detail: "Admin · Moderador · Usuário", icon: ShieldCheck, status: "ativo" },
  { name: "OAuth Google / Apple", detail: "Login social", icon: LogIn, status: "nao_implementado" },
];

const COMMERCIAL: Item[] = [
  { name: "Códigos presente", detail: "Geração, resgate e auditoria", icon: Gift, status: "ativo" },
  { name: "Pagamentos web (Stripe)", detail: "Cobrança recorrente", icon: CreditCard, status: "pendente" },
  { name: "IAP mobile (RevenueCat)", detail: "Assinaturas App Store / Play", icon: Store, status: "pendente" },
];

const ENGAGEMENT: Item[] = [
  { name: "Notificações push", detail: "Lembretes diários e retenção", icon: Bell, status: "nao_implementado" },
];

const Row = ({ item }: { item: Item }) => {
  const meta = STATUS_META[item.status];
  const Icon = meta.icon;
  const ItemIcon = item.icon;
  const active = item.status === "ativo";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/30">
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        <ItemIcon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground">{item.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
      </div>
      <span
        className={`flex items-center gap-1.5 text-[10px] font-heading tracking-wide px-2 py-0.5 rounded-full shrink-0 ${meta.cls}`}
      >
        <Icon className="w-3 h-3" />
        {meta.label}
      </span>
    </div>
  );
};

const Section = ({ title, items }: { title: string; items: Item[] }) => (
  <section className="space-y-3">
    <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-muted-foreground/60">{title}</h3>
    <div className="space-y-1.5">
      {items.map((i) => (
        <Row key={i.name} item={i} />
      ))}
    </div>
  </section>
);

const AdminSettings = () => {
  const all = [...PLATFORM, ...AUTH_ACCESS, ...COMMERCIAL, ...ENGAGEMENT];
  const active = all.filter((i) => i.status === "ativo").length;
  const pending = all.filter((i) => i.status === "pendente").length;
  const missing = all.filter((i) => i.status === "nao_implementado").length;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-heading text-lg text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Estado honesto das integrações e capacidades da plataforma.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Ativos", value: active, cls: "text-primary" },
          { label: "Pendentes", value: pending, cls: "text-secondary-foreground" },
          { label: "Não implementados", value: missing, cls: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-lg border border-border/40 bg-card/30 text-center">
            <p className={`font-heading text-xl ${s.cls}`}>{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border/30 bg-muted/20 p-3 text-[11px] text-muted-foreground leading-relaxed">
        Esta tela é apenas leitura. Gestão de papéis fica em <span className="text-foreground">Papéis</span>,
        códigos presente em <span className="text-foreground">Presentes</span>, e o registro de mudanças em{" "}
        <span className="text-foreground">Auditoria</span>.
      </div>

      <Section title="Plataforma" items={PLATFORM} />
      <Section title="Autenticação e acesso" items={AUTH_ACCESS} />
      <Section title="Comercial" items={COMMERCIAL} />
      <Section title="Engajamento" items={ENGAGEMENT} />
    </div>
  );
};

export default AdminSettings;
