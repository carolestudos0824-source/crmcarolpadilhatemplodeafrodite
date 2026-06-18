import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles,
  Lightbulb,
  Hammer,
  Lock,
  Megaphone,
  ShoppingCart,
  Search,
  Rocket,
  Image as ImageIcon,
  Users,
  ListChecks,
  AlertTriangle,
  Gift,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Copy,
  CheckCircle2,
  Circle,
  LifeBuoy,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { CommandCard } from "@/components/entrega/CommandCard";
import { AppModelCard } from "@/components/entrega/AppModelCard";
import { clearSession } from "@/lib/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";
import {
  MODULES,
  MODULE_ORDER,
  type ModuleId,
  APP_MODELS,
  COMMANDS_CONSTRUIR,
  COMMANDS_LOGIN,
  COMMANDS_VENDA,
  COMMANDS_CHECKOUT,
  COMMANDS_SEO,
  COMMANDS_CAMPANHAS,
  COMMANDS_CRIATIVOS,
  COMMANDS_VALIDACAO,
  COMMON_ERRORS,
  CHECKLIST_PHASES,
  MODULE_HINTS,
  type Command,

} from "@/data/entregaModules";

const LOVABLE_URL = "https://lovable.dev";
const STORAGE_MODULE = "fabrica_apps_active_module_v1";
const STORAGE_MODULE_DONE = "fabrica_apps_module_done_v1";
const STORAGE_CHECKLIST = "fabrica_apps_checklist_v1";

const ICONS: Record<string, typeof Sparkles> = {
  Sparkles, Lightbulb, Hammer, Lock, Megaphone, ShoppingCart, Search,
  Rocket, Image: ImageIcon, Users, ListChecks, AlertTriangle, Gift,
};


// ====== Persistência simples ======

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }, [key, val]);
  return [val, setVal];
}

// ====== Página ======

export default function Entrega() {
  const navigate = useNavigate();
  const auth = useAuthState();

  const [active, setActive] = useLocalState<ModuleId>(STORAGE_MODULE, "comece");
  const [moduleDone, setModuleDone] = useLocalState<Record<ModuleId, boolean>>(
    STORAGE_MODULE_DONE,
    {} as Record<ModuleId, boolean>,
  );
  const [checklist, setChecklist] = useLocalState<Record<string, boolean>>(
    STORAGE_CHECKLIST,
    {},
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const allChecklistItems = useMemo(
    () => CHECKLIST_PHASES.flatMap((p) => p.items.map((i) => `${p.phase}__${i}`)),
    [],
  );
  const checklistProgress = useMemo(() => {
    if (allChecklistItems.length === 0) return 0;
    const done = allChecklistItems.filter((k) => checklist[k]).length;
    return Math.round((done / allChecklistItems.length) * 100);
  }, [allChecklistItems, checklist]);

  const logout = async () => {
    await clearSession();
    toast.success("Você saiu da área restrita.");
    navigate("/login");
  };

  // ===== Estados de auth =====
  if (auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-accent mx-auto mb-3" size={28} />
          <p className="text-sm text-muted-foreground">Carregando sua área...</p>
        </div>
      </div>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Lock className="text-accent mx-auto mb-3" size={28} />
          <h1 className="text-2xl font-heading font-bold mb-2">Área restrita</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Entre com o e-mail usado na compra para acessar seus comandos do Lovable.
          </p>
          <button onClick={() => navigate("/login")} className="btn-primary w-full justify-center">
            Entrar na área restrita
          </button>
        </GlassCard>
      </div>
    );
  }

  if (!auth.hasAccess && !auth.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Lock className="text-amber-400 mx-auto mb-3" size={28} />
          <h1 className="text-2xl font-heading font-bold mb-2">
            Acesso ainda não liberado
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sua conta foi criada, mas seu acesso ainda não está ativo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
              className="btn-primary w-full justify-center"
            >
              <LifeBuoy size={14} /> Falar com suporte
            </button>
            <button
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2"
            >
              <LogOut size={12} /> Sair desta conta
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const email = auth.email ?? "";

  const goTo = (id: ModuleId) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markModuleDone = () => {
    setModuleDone((prev) => ({ ...prev, [active]: true }));
    toast.success("Módulo marcado como concluído.");
  };

  const currentIdx = MODULE_ORDER.indexOf(active);
  const prevModule = currentIdx > 0 ? MODULE_ORDER[currentIdx - 1] : null;
  const nextModule = currentIdx < MODULE_ORDER.length - 1 ? MODULE_ORDER[currentIdx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Logo size="sm" />
          <span className="hidden md:inline text-sm text-muted-foreground">
            Fábrica de Apps com IA
          </span>
          <div className="ml-auto flex items-center gap-2 text-xs flex-wrap">
            {email && (
              <span className="hidden sm:inline px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                {email}
              </span>
            )}
            {auth.isAdmin && (
              <button
                onClick={() => navigate("/admin/acessos")}
                className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent inline-flex items-center gap-1"
              >
                <ShieldCheck size={12} /> Admin
              </button>
            )}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 inline-flex items-center gap-1"
            >
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* SHELL */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* SIDEBAR */}
        <aside
          className={`${
            menuOpen ? "fixed inset-0 z-30 bg-background/95 backdrop-blur-md pt-16 px-4 overflow-y-auto" : "hidden"
          } lg:sticky lg:top-14 lg:block lg:w-72 lg:shrink-0 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:p-4 lg:bg-transparent`}
        >
          <div className="lg:pr-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Seu caminho
            </div>
            <nav className="space-y-1">
              {MODULES.map((m) => {
                const Icon = ICONS[m.icon] ?? Circle;
                const isActive = active === m.id;
                const isDone = !!moduleDone[m.id];
                return (
                  <button
                    key={m.id}
                    onClick={() => goTo(m.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition border ${
                      isActive
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "border-transparent hover:bg-white/5 text-foreground/85"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="flex-1 leading-tight">{m.label}</span>
                    {isDone ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={14} className="text-muted-foreground/40 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Progresso */}
            <div className="mt-6 px-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span>Progresso geral</span>
                <span>{checklistProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {/* O que você vai fazer nesta etapa */}
          {active !== "comece" && (
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4 flex items-start gap-3">
              <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
                  O que você vai fazer nesta etapa
                </div>
                <p className="text-sm text-foreground/85">
                  {MODULE_HINTS[active].doNow}
                </p>
              </div>
            </div>
          )}

          <ModuleContent
            active={active}
            checklist={checklist}
            setChecklist={setChecklist}
            goTo={goTo}
          />

          {/* Quando posso avançar? */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
            <ArrowRight size={16} className="text-accent shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Quando posso avançar?
              </div>
              <p className="text-sm text-foreground/85">
                {MODULE_HINTS[active].advanceWhen}
              </p>
            </div>
          </div>

          {/* Footer do módulo */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => prevModule && goTo(prevModule)}
              disabled={!prevModule}
              className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm disabled:opacity-30"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
            <button
              onClick={markModuleDone}
              className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 inline-flex items-center gap-2 text-sm"
            >
              <CheckCircle2 size={14} /> Marcar módulo como concluído
            </button>
            <button
              onClick={() => nextModule && goTo(nextModule)}
              disabled={!nextModule}
              className="btn-primary text-sm disabled:opacity-30"
            >
              Próximo passo <ArrowRight size={14} />
            </button>
          </div>
        </main>

      </div>
    </div>
  );
}

// ====== Conteúdo dos módulos ======

type ModuleContentProps = {
  active: ModuleId;
  checklist: Record<string, boolean>;
  setChecklist: (v: Record<string, boolean> | ((p: Record<string, boolean>) => Record<string, boolean>)) => void;
  goTo: (id: ModuleId) => void;
};

const ModuleHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="mb-8">
    <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
  </header>
);

const CommandList = ({
  commands,
  moduleKey,
}: {
  commands: Command[];
  moduleKey: string;
}) => (
  <div className="space-y-3">
    {commands.map((c, i) => (
      <CommandCard
        key={c.n}
        number={c.n}
        title={c.title}
        description={c.purpose}
        whenToUse={c.when}
        whereToPaste={c.where}
        expectedResult={c.result}
        commandText={c.content}
        defaultOpen={i === 0}
        completedKey={`${moduleKey}_${c.n}`}
      />
    ))}
  </div>
);

function ModuleContent({ active, checklist, setChecklist, goTo }: ModuleContentProps) {
  if (active === "comece") {
    return (
      <section>
        <header className="mb-6">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
            <Sparkles size={12} /> Painel Arquiteto de Apps
          </span>
          <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
            Construa, publique e divulgue seu app no Lovable
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Esta é sua central para criar um app no Lovable. Você vai escolher uma
            ideia, copiar comandos, colar no Lovable, testar o app e depois divulgar
            para usuários reais.
          </p>
        </header>

        <GlassCard className="p-5 md:p-6 mb-6">
          <h2 className="font-heading font-semibold text-lg mb-1">O que você comprou</h2>
          <p className="text-sm text-muted-foreground">
            Um programa guiado para criar aplicativos no Lovable, mesmo sem saber
            programar. Aqui você tem ideias prontas, comandos, checklists, campanhas e
            criativos.
          </p>
        </GlassCard>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            ["Escolha uma ideia", "Use sua ideia ou escolha um modelo pronto."],
            ["Cole comandos no Lovable", "Copie um comando por vez e cole no Lovable."],
            ["Construa o app", "O Lovable cria telas, banco, login e área de entrega."],
            ["Divulgue e valide", "Use campanhas, criativos e teste com 10 pessoas reais."],
          ].map(([t, d], i) => (
            <GlassCard key={t} className="p-4">
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-bold flex items-center justify-center mb-2">
                {i + 1}
              </div>
              <h3 className="font-semibold text-sm mb-1">{t}</h3>
              <p className="text-xs text-muted-foreground">{d}</p>
            </GlassCard>
          ))}
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 mb-6 flex items-start gap-3">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <strong>Regra de ouro:</strong> um comando por vez. Não pule etapas.
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => goTo("ideias")} className="btn-primary">
            <Lightbulb size={16} /> Ir para ideias prontas
          </button>
          <button
            onClick={() => goTo("construir")}
            className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
          >
            <Hammer size={16} /> Construir minha própria ideia
          </button>
          <a
            href={LOVABLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
          >
            <ExternalLink size={16} /> Abrir Lovable
          </a>
        </div>
      </section>
    );
  }

  if (active === "ideias") {
    return (
      <section>
        <ModuleHeader
          title="Ideias prontas para criar no Lovable"
          subtitle="Escolha um modelo de app, copie o comando e cole no Lovable."
        />
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground mb-6">
          Essas ideias têm dor clara, público definido e forma possível de monetização.
          Mesmo assim, valide com usuários reais antes de investir pesado.
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {APP_MODELS.map((m) => (
            <AppModelCard key={m.name} model={m} />
          ))}
        </div>
      </section>
    );
  }

  if (active === "construir") {
    return (
      <section>
        <ModuleHeader
          title="Construir app no Lovable"
          subtitle="Use esta etapa para transformar sua ideia em um app funcional."
        />
        <CommandList commands={COMMANDS_CONSTRUIR} moduleKey="construir" />
      </section>
    );
  }

  if (active === "login") {
    return (
      <section>
        <ModuleHeader
          title="Login, banco e área restrita"
          subtitle="Use esta etapa quando seu app precisa salvar dados, ter usuários ou proteger conteúdo."
        />
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100 mb-5 flex items-start gap-3">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>Nunca exponha chave service role no frontend.</span>
        </div>
        <CommandList commands={COMMANDS_LOGIN} moduleKey="login" />
      </section>
    );
  }

  if (active === "venda") {
    return (
      <section>
        <ModuleHeader
          title="Página de venda"
          subtitle="Use esta etapa para criar uma página que explica e vende seu app."
        />
        <CommandList commands={COMMANDS_VENDA} moduleKey="venda" />
      </section>
    );
  }

  if (active === "checkout") {
    return (
      <section>
        <ModuleHeader
          title="Checkout e entrega"
          subtitle="Use esta etapa para organizar a compra e a entrega do produto."
        />
        <CommandList commands={COMMANDS_CHECKOUT} moduleKey="checkout" />
        <ChecklistBlock
          title="Checklist do módulo"
          items={[
            "Comprador entende o que recebeu",
            "Comprador sabe onde entrar",
            "Comprador não fica perdido depois da compra",
            "Área protegida não aparece para visitantes",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="checkout"
        />
      </section>
    );
  }

  if (active === "seo") {
    return (
      <section>
        <ModuleHeader
          title="SEO e GEO"
          subtitle="Use esta etapa para seu app aparecer melhor em buscas e ser entendido por ferramentas de IA."
        />
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-1 text-sm">SEO</h3>
            <p className="text-xs text-muted-foreground">
              Ajuda seu app a aparecer no Google.
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-1 text-sm">GEO</h3>
            <p className="text-xs text-muted-foreground">
              Ajuda ferramentas de IA e buscadores inteligentes a entenderem seu app.
            </p>
          </GlassCard>
        </div>
        <CommandList commands={COMMANDS_SEO} moduleKey="seo" />
      </section>
    );
  }

  if (active === "campanhas") {
    return (
      <section>
        <ModuleHeader
          title="Campanhas"
          subtitle="Use esta etapa para divulgar seu app e conseguir os primeiros usuários."
        />
        <CommandList commands={COMMANDS_CAMPANHAS} moduleKey="campanhas" />
        <CampaignGenerator />
      </section>
    );
  }

  if (active === "criativos") {
    return (
      <section>
        <ModuleHeader
          title="Criativos"
          subtitle="Use esta etapa para criar anúncios, posts, roteiros e ideias visuais."
        />
        <CommandList commands={COMMANDS_CRIATIVOS} moduleKey="criativos" />
        <CreativeGenerator />
      </section>
    );
  }

  if (active === "validacao") {
    return (
      <section>
        <ModuleHeader
          title="Validação com usuários"
          subtitle="Use esta etapa para testar se pessoas reais entendem e querem usar seu app."
        />
        <CommandList commands={COMMANDS_VALIDACAO} moduleKey="validacao" />
        <ChecklistBlock
          title="Checklist do módulo"
          items={[
            "Convidei 10 pessoas",
            "5 testaram",
            "3 entenderam sem ajuda",
            "1 demonstrou interesse real",
            "Anotei dúvidas repetidas",
            "Melhorei o app",
          ]}
          checklist={checklist}
          setChecklist={setChecklist}
          phase="validacao"
        />
      </section>
    );
  }

  if (active === "checklist") {
    return (
      <section>
        <ModuleHeader
          title="Checklist geral"
          subtitle="Acompanhe seu avanço em todas as fases do programa."
        />
        <div className="space-y-5">
          {CHECKLIST_PHASES.map((p) => (
            <GlassCard key={p.phase} className="p-5">
              <h3 className="font-heading font-semibold mb-3">{p.phase}</h3>
              <ul className="space-y-2">
                {p.items.map((item) => {
                  const key = `${p.phase}__${item}`;
                  const done = !!checklist[key];
                  return (
                    <li key={item}>
                      <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() =>
                            setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
                          }
                          className="accent-accent w-4 h-4"
                        />
                        <span
                          className={`text-sm ${
                            done ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>
    );
  }

  if (active === "erros") {
    return <ErrorsModule />;
  }

  if (active === "ativar") {
    return (
      <section>
        <ModuleHeader
          title="Ativar ou estender acesso"
          subtitle="Use esta área apenas se você recebeu um código de acesso."
        />
        <div className="max-w-xl">
          <GiftCodeRedemption />
        </div>
      </section>
    );
  }

  return null;
}

// ====== Sub-blocos ======

function ChecklistBlock({
  title,
  items,
  checklist,
  setChecklist,
  phase,
}: {
  title: string;
  items: string[];
  checklist: Record<string, boolean>;
  setChecklist: (v: Record<string, boolean> | ((p: Record<string, boolean>) => Record<string, boolean>)) => void;
  phase: string;
}) {
  return (
    <GlassCard className="mt-6 p-5">
      <h3 className="font-heading font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => {
          const key = `${phase}__${item}`;
          const done = !!checklist[key];
          return (
            <li key={item}>
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() =>
                    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="accent-accent w-4 h-4"
                />
                <span
                  className={`text-sm ${
                    done ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

function ErrorsModule() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMON_ERRORS;
    return COMMON_ERRORS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.explanation.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    );
  }, [query]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <section>
      <ModuleHeader
        title="Erros comuns"
        subtitle="Procure aqui antes de chamar o suporte."
      />
      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite seu problema"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((e) => (
          <GlassCard key={e.title} className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {e.category}
              </span>
            </div>
            <h3 className="font-heading font-semibold">{e.title}</h3>
            <p className="text-sm text-muted-foreground">{e.explanation}</p>
            <p className="text-sm">
              <strong className="text-accent">O que fazer:</strong> {e.fix}
            </p>
            <div className="rounded-lg border border-white/10 bg-black/40 max-h-40 overflow-auto">
              <pre className="text-xs p-3 whitespace-pre-wrap font-mono text-foreground/85">
                {e.command}
              </pre>
            </div>
            <button
              onClick={() => copy(e.command)}
              className="px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Copy size={14} /> Copiar
            </button>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nada encontrado. Tente outra palavra.
          </p>
        )}
      </div>
    </section>
  );
}

// ====== Geradores rápidos ======

function CampaignGenerator() {
  const [f, setF] = useState({
    name: "", audience: "", pain: "", benefit: "",
    channel: "Instagram", objective: "Leads", budget: "", cta: "",
  });
  const [generated, setGenerated] = useState("");

  const generate = () => {
    const text = `Crie uma campanha completa para o app "${f.name || "[nome do app]"}".

Público: ${f.audience || "[público]"}
Dor: ${f.pain || "[dor]"}
Benefício: ${f.benefit || "[benefício]"}
Canal: ${f.channel}
Objetivo: ${f.objective}
Orçamento: ${f.budget || "[informe]"}
CTA: ${f.cta || "[CTA]"}

Entregue:
1. Posicionamento da campanha
2. 3 ângulos diferentes
3. Copy principal
4. 5 variações de criativo
5. Calendário de 7 dias
6. Métricas a acompanhar
7. Critério para considerar sucesso`;
    setGenerated(text);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <GlassCard className="mt-6 p-5 md:p-6">
      <h3 className="font-heading font-semibold mb-1">Gerador rápido de campanha</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Preencha os campos e gere um comando pronto para o Lovable.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Input label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} />
        <Input label="Dor" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} />
        <Input label="Benefício" value={f.benefit} onChange={(v) => setF({ ...f, benefit: v })} />
        <Select
          label="Canal"
          value={f.channel}
          onChange={(v) => setF({ ...f, channel: v })}
          options={["Instagram", "Meta Ads", "Google", "TikTok", "WhatsApp", "LinkedIn"]}
        />
        <Select
          label="Objetivo"
          value={f.objective}
          onChange={(v) => setF({ ...f, objective: v })}
          options={["Leads", "Vendas", "Tráfego", "Engajamento", "Lista de espera"]}
        />
        <Input label="Orçamento" value={f.budget} onChange={(v) => setF({ ...f, budget: v })} />
        <Input label="CTA" value={f.cta} onChange={(v) => setF({ ...f, cta: v })} />
      </div>
      <button onClick={generate} className="btn-primary mt-4 text-sm">
        <Sparkles size={14} /> Gerar comando
      </button>
      {generated && (
        <div className="mt-5">
          <div className="rounded-xl border border-white/10 bg-black/40 max-h-64 overflow-auto">
            <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
              {generated}
            </pre>
          </div>
          <button onClick={copy} className="mt-3 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold">
            <Copy size={14} /> Copiar comando
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function CreativeGenerator() {
  const [f, setF] = useState({
    name: "", audience: "", pain: "", promise: "",
    format: "imagem", tone: "direto",
  });
  const [generated, setGenerated] = useState("");

  const generate = () => {
    const text = `Crie um criativo no formato "${f.format}" com tom "${f.tone}".

App: ${f.name || "[nome]"}
Público: ${f.audience || "[público]"}
Dor: ${f.pain || "[dor]"}
Promessa: ${f.promise || "[promessa]"}

Entregue:
1. Gancho nos 3 primeiros segundos
2. Headline
3. Subheadline
4. Corpo
5. CTA
6. Descrição visual ou roteiro
7. 2 variações alternativas`;
    setGenerated(text);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <GlassCard className="mt-6 p-5 md:p-6">
      <h3 className="font-heading font-semibold mb-1">Gerador rápido de criativo</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Preencha e gere um comando pronto para o Lovable.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Input label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} />
        <Input label="Dor" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} />
        <Input label="Promessa" value={f.promise} onChange={(v) => setF({ ...f, promise: v })} />
        <Select
          label="Formato"
          value={f.format}
          onChange={(v) => setF({ ...f, format: v })}
          options={["imagem", "vídeo", "reels", "story", "anúncio"]}
        />
        <Select
          label="Tom"
          value={f.tone}
          onChange={(v) => setF({ ...f, tone: v })}
          options={["direto", "emocional", "educativo", "comparativo", "urgente"]}
        />
      </div>
      <button onClick={generate} className="btn-primary mt-4 text-sm">
        <Sparkles size={14} /> Gerar comando de criativo
      </button>
      {generated && (
        <div className="mt-5">
          <div className="rounded-xl border border-white/10 bg-black/40 max-h-64 overflow-auto">
            <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
              {generated}
            </pre>
          </div>
          <button onClick={copy} className="mt-3 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center gap-2 text-sm font-semibold">
            <Copy size={14} /> Copiar comando
          </button>
        </div>
      )}
    </GlassCard>
  );
}

const Input = ({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
    />
  </label>
);

const Select = ({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-background">
          {o}
        </option>
      ))}
    </select>
  </label>
);
