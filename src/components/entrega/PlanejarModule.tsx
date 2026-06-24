import { useState } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  Target,
  Sparkles,
  MousePointerClick,
  Layers,
  FileText,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Search,
} from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAppProjects } from "@/hooks/useAppProjects";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";



const AGENT_HELP_PROMPT = `Estou criando um aplicativo do zero com IA e preciso planejar antes de construir. Me ajude a definir: qual problema meu app resolve, para quem ele é feito, qual é a promessa principal, qual é a ação principal do usuário e quais funcionalidades devem entrar somente na primeira versão.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Target;
  title: string;
  resultado: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Target,
    title: "Definir problema e público",
    resultado:
      "Você sai sabendo exatamente qual dor o app resolve e para quem ele foi criado.",
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
    resultado:
      "Você sai com uma frase clara que explica qual transformação o app promete.",
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
    resultado:
      "Você sai sabendo qual é a primeira ação que o usuário deve fazer dentro do app.",
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
    resultado:
      "Você sai com uma lista curta do que entra no MVP e do que fica para depois.",
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
    resultado:
      "Você sai com um plano simples, pronto para orientar a construção no Lovable.",
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

const CRITICAL_ITEMS = new Set([
  "Sei qual problema meu app resolve",
  "Sei para quem ele foi feito",
  "Defini a ação principal do usuário",
  "Separei o essencial do extra",
  "Tenho um plano inicial do app",
]);

const PLANO_TEMPLATE = `Plano inicial do app

Problema:
[Qual dor o app resolve]

Público:
[Quem vai usar]

Promessa:
[Qual resultado o app entrega]

Ação principal:
[O que o usuário faz primeiro]

Essencial no MVP:
[Até 5 funcionalidades essenciais]

Fora do MVP:
[Funcionalidades que ficam para depois]

Primeira versão:
[O que precisa existir para testar com usuários reais]`;

const TAB_META: { id: TabId; label: string; icon: typeof Target }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];


const CHECKLIST_PREFIX = "planejar_step__";




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

      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] p-3 mb-4">
        <div className="text-[10px] uppercase tracking-wider text-emerald-200/90 mb-1">
          Resultado esperado
        </div>
        <p className="text-sm text-foreground/90">{etapa.resultado}</p>
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

      {tab === "avancar" ? (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
            {etapa.tabs[tab]}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          key={tab}
          saveSourceModule="planejar"
          originalPrompt={etapa.tabs[tab]}
          storageKey={`planejar_prompt__${etapa.n}__${tab}`}
          transformOnCopy={tab === "agente" ? undefined : wrapLovable}
          copyLabel={
            tab === "agente"
              ? "Copiar para o Agente"
              : tab === "corrigir"
              ? "Copiar correção"
              : "Copiar para implementar no Lovable"
          }
          helperText={
            tab === "agente"
              ? "Use para pensar antes de aplicar."
              : tab === "corrigir"
              ? "Use quando o Lovable não entregar o resultado esperado."
              : undefined
          }
        />
      )}

    </GlassCard>
  );
}

export function PlanejarModule({ goTo }: { goTo?: (id: string) => void } = {}) {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();


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
          Antes de construir, evoluir ou auditar um app, defina problema, público, promessa, ação principal e o que entra na primeira versão funcional.
        </p>

        <p className="text-xs text-muted-foreground/90 max-w-3xl mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          Copie um comando por vez e avance só quando a etapa estiver clara.
        </p>
      </header>

      {!activeProject && (
        <GlassCard className="p-5 md:p-6 mb-6 border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-accent/[0.05] to-transparent">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Escolha um app antes de planejar
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Para gerar um plano útil, primeiro selecione uma ideia ou crie um app em foco.
                Depois esta etapa vai ajudar você a definir problema, público, promessa, ação principal e escopo da primeira versão funcional.
              </p>
              <p className="text-xs text-muted-foreground/90 mt-2">
                Já tem um app? Use esta etapa como auditoria do plano atual antes de evoluir.
              </p>

            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <button
              onClick={openDrawer}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold shadow-[0_0_0_1px_rgba(0,194,255,0.25)] transition"
            >
              <Sparkles size={14} /> Criar ou selecionar app
            </button>
            {goTo && (
              <button
                onClick={() => goTo("ideias")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15 text-sm font-semibold transition"
              >
                Ver ideias prontas
              </button>
            )}
            {goTo && (
              <button
                onClick={() => goTo("construir")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 text-sm font-medium transition"
              >
                <Search size={14} /> Usar Busca Inteligente
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {goTo && (
        <GlassCard className="p-4 mb-4 border-white/10 bg-white/[0.03]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-heading font-bold text-foreground/95">
                Ainda está em dúvida sobre a ideia?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Antes de planejar, você pode comparar potencial de venda, clareza do problema e dificuldade de construção.
              </p>
            </div>
            <button
              onClick={() => goTo("validacao")}
              className="shrink-0 w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-lg border border-white/15 bg-white/5 text-foreground/85 hover:bg-white/10 text-xs font-semibold"
            >
              Comparar viabilidade
            </button>
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-heading font-bold leading-tight mb-1">
              Um app começa antes do código
            </h3>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              Primeiro defina o problema, o público, a promessa e a ação principal. Depois copie os comandos para o Lovable.
            </p>
          </div>
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
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 text-sm font-semibold transition"
          >
            <Bot size={14} /> Não sei planejar meu app
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Use a aba <strong className="text-foreground/90">Implementar no Lovable</strong>{" "}
        quando quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Revisar com o Agente primeiro</strong> quando quiser
        ajuda para decidir antes de construir.
      </p>

      <div className="space-y-5 mb-8">
        {ETAPAS.map((e) => (
          <EtapaCard key={e.n} etapa={e} />
        ))}
      </div>

      {/* Resultado desta etapa: Plano inicial do app */}
      <GlassCard className="p-5 md:p-6 mb-6 border-accent/40 bg-accent/[0.07]">
        <div className="flex items-start gap-3 mb-3">
          <FileText size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
              Resultado desta etapa
            </div>
            <h3 className="text-lg font-heading font-bold leading-tight">
              Plano inicial do app
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Este é o resumo que deve guiar a construção do MVP. Copie para o Lovable apenas depois de revisar os 5 pontos acima.
            </p>
          </div>
        </div>
        <EditablePromptBox
          saveSourceModule="planejar"
          originalPrompt={PLANO_TEMPLATE}
          storageKey="planejar_plano_inicial"
          copyLabel="Copiar plano inicial para o Lovable"
        />
      </GlassCard>




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
          <h3 className="font-heading font-semibold text-base">Revisão da etapa</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Só avance quando todos os itens críticos estiverem claros.
        </p>

        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            const critical = CRITICAL_ITEMS.has(item);
            return (
              <li key={item}>
                <label
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    critical
                      ? "border-accent/30 bg-accent/[0.06] hover:bg-accent/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleItem(item)}
                    className="accent-accent w-5 h-5 shrink-0"
                  />
                  <span
                    className={`text-sm ${
                      done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
                  </span>
                  {critical && !done && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent shrink-0">
                      Crítico
                    </span>
                  )}
                  {done && (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400 shrink-0 ml-auto"
                    />
                  )}
                  {!critical && !done && (
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
        {(() => {
          const allCriticalDone = [...CRITICAL_ITEMS].every(
            (it) => !!checklist[`${CHECKLIST_PREFIX}${it}`],
          );
          return allCriticalDone ? (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>Planejamento concluído. Agora você pode avançar para MVP e Arquitetura.</span>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              <ArrowRight size={16} className="mt-0.5 shrink-0" />
              <span>
                Ainda não avance. Seu app precisa de problema, público, ação principal e escopo claro.
              </span>
            </div>
          );
        })()}
      </GlassCard>

    </section>
  );
}
