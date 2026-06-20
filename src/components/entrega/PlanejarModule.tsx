import { useState } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  Target,
  Users,
  Sparkles,
  MousePointerClick,
  Layers,
  FileText,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo do zero com IA e preciso planejar antes de construir. Me ajude a definir: qual problema meu app resolve, para quem ele é feito, qual é a promessa principal, qual é a ação principal do usuário e quais funcionalidades devem entrar somente na primeira versão.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Target;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Target,
    title: "Definir problema e público",
    tabs: {
      lovable:
        "Crie uma seção de planejamento para meu app explicando claramente qual problema ele resolve e para qual público ele foi criado. Use linguagem simples, direta e sem promessas exageradas.",
      agente:
        "Me ajude a definir o problema e o público do meu app. Faça perguntas sobre a dor que quero resolver, quem sente essa dor e por que essa pessoa usaria meu aplicativo.",
      corrigir:
        "O Lovable deixou meu público e problema genéricos. Reescreva deixando claro: quem é a pessoa, qual dor ela sente e como o app ajuda.",
      avancar:
        "Avance quando você conseguir dizer em uma frase quem usa seu app e qual problema ele resolve.",
    },
  },
  {
    n: 2,
    icon: Sparkles,
    title: "Escrever a promessa do app",
    tabs: {
      lovable:
        "Crie uma frase de promessa para meu app explicando o que ele ajuda o usuário a fazer. A promessa deve ser clara, realista e sem garantir resultado.",
      agente:
        "Me ajude a escrever uma promessa clara para meu app. Quero uma frase simples que explique o valor do aplicativo sem exagero e sem promessa impossível.",
      corrigir:
        "O Lovable criou uma promessa exagerada. Ajuste para uma promessa honesta, clara e conectada ao que o app realmente entrega.",
      avancar: "Avance quando a promessa do app estiver clara e fácil de entender.",
    },
  },
  {
    n: 3,
    icon: MousePointerClick,
    title: "Definir ação principal",
    tabs: {
      lovable:
        "Defina a ação principal do usuário dentro do meu app. Explique o que a pessoa precisa fazer primeiro e qual resultado ela deve receber depois dessa ação.",
      agente:
        "Me ajude a escolher a ação principal do meu app. Quero saber o que o usuário deve fazer logo que entra e qual deve ser o resultado dessa ação.",
      corrigir: "O Lovable criou ações demais. Simplifique para uma ação principal clara.",
      avancar:
        "Avance quando estiver claro qual é a principal ação que o usuário deve realizar dentro do app.",
    },
  },
  {
    n: 4,
    icon: Layers,
    title: "Separar essencial de extra",
    tabs: {
      lovable:
        "Crie uma lista separando funcionalidades essenciais da primeira versão e funcionalidades extras que devem ficar para depois. Mantenha o MVP simples.",
      agente:
        "Analise minha ideia de app e me ajude a separar o que é essencial para a primeira versão e o que deve ficar para uma versão futura.",
      corrigir:
        "O Lovable colocou funcionalidades demais na primeira versão. Reduza o escopo para no máximo 5 funcionalidades essenciais.",
      avancar:
        "Avance quando a primeira versão do app estiver simples e sem excesso de funcionalidades.",
    },
  },
  {
    n: 5,
    icon: FileText,
    title: "Criar plano inicial do app",
    tabs: {
      lovable:
        "Crie um plano inicial do meu app com: nome provisório, público, problema, promessa, ação principal, funcionalidades essenciais e o que ficará para depois.",
      agente:
        "Organize meu app em um plano inicial simples com: público, problema, promessa, ação principal, funcionalidades essenciais e próximos passos.",
      corrigir:
        "O Lovable deixou o plano confuso. Reorganize em tópicos claros e mantenha apenas o essencial para começar.",
      avancar: "Avance quando você tiver um plano claro para construir o app no Lovable.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Problema", def: "A dor ou necessidade que o app resolve." },
  { termo: "Público", def: "As pessoas para quem o app foi feito." },
  { termo: "Promessa", def: "O que o app entrega de valor para o usuário." },
  {
    termo: "Ação principal",
    def: "O principal movimento que o usuário precisa fazer dentro do app.",
  },
  { termo: "Escopo", def: "O limite do que entra ou não entra na primeira versão." },
  { termo: "Funcionalidade", def: "Uma ação ou recurso que o app oferece." },
  {
    termo: "MVP",
    def: "A primeira versão simples do app, com apenas o essencial para testar.",
  },
];

const CHECKLIST_ITEMS = [
  "Sei qual problema meu app resolve",
  "Sei para quem ele foi feito",
  "Escrevi uma promessa clara",
  "Defini a ação principal do usuário",
  "Separei o essencial do extra",
  "Tenho um plano inicial do app",
];

const TAB_META: { id: TabId; label: string; icon: typeof Target }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "planejar_step__";

function CopyBtn({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setOk(true);
      toast.success("Copiado! Agora cole no Lovable.");
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition ${
        ok
          ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
          : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      }`}
    >
      {ok ? <Check size={14} /> : <Copy size={14} />}
      {ok ? "Copiado!" : label}
    </button>
  );
}

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const Icon = etapa.icon;
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
            Etapa {etapa.n}
          </div>
          <h3 className="text-lg md:text-xl font-heading font-bold leading-tight">
            {etapa.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TAB_META.map((t) => {
          const TIcon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                active
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10"
              }`}
            >
              <TIcon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 p-4 mb-3">
        <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
          {etapa.tabs[tab]}
        </pre>
      </div>
      {tab !== "avancar" && <CopyBtn text={etapa.tabs[tab]} label="Copiar comando" />}
    </GlassCard>
  );
}

export function PlanejarModule() {
  const { checklist, setChecklist } = useUserProgress();

  const copyAgentHelp = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_HELP_PROMPT);
      toast.success("Prompt copiado! Cole no Agente Arquiteto.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const toggleItem = (item: string) => {
    const key = `${CHECKLIST_PREFIX}${item}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <ClipboardList size={12} /> Planejar o App
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Planeje seu app antes de construir
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de abrir o Lovable, você precisa saber qual problema seu app resolve, quem
          vai usar e qual será a ação principal.
        </p>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Um app começa antes do código. Primeiro você define o problema, o público, a
            promessa e o que precisa existir na primeira versão.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai transformar uma ideia solta em um plano claro para
          construir no Lovable sem pedir funcionalidades demais e sem criar um app confuso.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Defina o problema que o app resolve.",
            "Escolha para quem o app será feito.",
            "Escreva a promessa principal.",
            "Defina a ação principal do usuário.",
            "Separe o essencial do que pode ficar para depois.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5">
          <button
            onClick={copyAgentHelp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm font-semibold transition"
          >
            <Bot size={14} /> Não sei planejar meu app
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <div className="space-y-5 mb-8">
        {ETAPAS.map((e) => (
          <EtapaCard key={e.n} etapa={e} />
        ))}
      </div>

      <GlassCard className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={16} className="text-accent" />
          <h3 className="font-heading font-semibold text-base">Não entendi uma palavra</h3>
        </div>
        <dl className="grid sm:grid-cols-2 gap-3">
          {GLOSSARIO.map((g) => (
            <div
              key={g.termo}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <dt className="text-sm font-semibold text-accent">{g.termo}</dt>
              <dd className="text-xs text-muted-foreground mt-1">{g.def}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Checklist do módulo</h3>
        </div>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            return (
              <li key={item}>
                <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleItem(item)}
                    className="accent-accent w-4 h-4"
                  />
                  <span
                    className={`text-sm ${
                      done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
                  </span>
                  {done ? (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400 shrink-0 ml-auto"
                    />
                  ) : (
                    <Circle
                      size={14}
                      className="text-muted-foreground/40 shrink-0 ml-auto"
                    />
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-muted-foreground mt-3">
          Este checklist é salvo na sua conta, mas não afeta o progresso geral nesta rodada.
        </p>
      </GlassCard>
    </section>
  );
}
