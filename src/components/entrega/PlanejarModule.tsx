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
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { AGENT_MODULE_GUIDANCE } from "@/lib/agentModuleGuidance";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAppProjects } from "@/hooks/useAppProjects";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { buildLovablePrompt } from "@/lib/promptBuilder";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";
import { useProjectJourney, JOURNEY_LABELS, type JourneyId } from "@/lib/journey";
import { ChecklistDisclosure } from "@/components/entrega/ChecklistDisclosure";

const yn = (v: ProjectContext["needsLogin"]) =>
  v === "sim" ? "Sim" : v === "nao" ? "Não" : "[a definir]";
const orPlaceholder = (s: string | undefined | null) =>
  s && s.trim() ? s.trim() : "[a definir]";

const buildAgentPlanPrompt = (
  ctx: ProjectContext,
  journey: JourneyId | null,
  projectName: string | null,
): string => {
  const journeyLabel = journey ? JOURNEY_LABELS[journey] : "[não escolhida]";
  const name = orPlaceholder(projectName || ctx.appName);
  return `Quero planejar meu app antes de construir no Lovable.

Contexto:
- Nome do app: ${name}
- O que o app faz: ${orPlaceholder(ctx.appDoes)}
- Público-alvo: ${orPlaceholder(ctx.audience)}
- Problema que resolve: ${orPlaceholder(ctx.problem)}
- Promessa principal: ${orPlaceholder(ctx.promise)}
- Ação principal do usuário: ${orPlaceholder(ctx.mainAction)}
- Produto ou serviço vendido: ${orPlaceholder(ctx.productSold)}
- Modelo de cobrança: ${orPlaceholder(ctx.pricingModel)}
- Login: ${yn(ctx.needsLogin)}
- Banco de dados: ${yn(ctx.needsDatabase)}
- Área paga: ${yn(ctx.needsPaidArea)}
- Admin: ${yn(ctx.needsAdmin)}
- Checkout: ${yn(ctx.needsCheckout)}
- Jornada escolhida na Fábrica: ${journeyLabel}

Me ajude a transformar isso em um plano claro e enxuto.

Responda obrigatoriamente com:

1. Diagnóstico rápido da ideia
2. Público ideal
3. Dor principal
4. Promessa principal
5. Ação principal do usuário
6. MVP recomendado com no máximo 5 funcionalidades
7. Telas essenciais
8. Dados que precisam ser salvos
9. Se precisa de login, banco, área paga ou admin agora
10. Monetização inicial, se fizer sentido
11. O que cortar agora
12. Riscos de escopo
13. Primeiro prompt recomendado para o Lovable
14. Próxima ação única

Regras:
- Não proponha um app grande demais.
- Não coloque mais de 5 funcionalidades no MVP.
- Não prometa venda garantida.
- Não prometa segurança 100%.
- Não invente checkout, banco ou área paga se não forem necessários.
- Se faltar informação, assuma hipóteses razoáveis e diga o que precisa validar depois.`;
};

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
  "Problema definido",
  "Público definido",
  "Promessa definida",
  "Ação principal definida",
  "MVP definido",
  "Telas principais definidas",
  "Primeira versão clara",
  "Próximo comando Lovable pronto",
];

const CRITICAL_ITEMS = new Set(CHECKLIST_ITEMS);

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
  { id: "agente", label: "Planejar esta etapa com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
  { id: "lovable", label: "Implementar no Lovable (avançado)", icon: Wrench },
];

const ETAPA_OBJETIVOS: Record<number, { objetivo: string; saida: string; cortar: string; criterio: string }> = {
  1: {
    objetivo: "Definir com clareza para quem é o app e qual dor ele resolve.",
    saida: "público ideal; dor principal; situação de uso; frase simples do problema; dúvidas a validar.",
    cortar: "Não defina personas amplas demais. Não invente público se ainda não validou.",
    criterio: "Saber dizer em 1 frase quem é o usuário e qual problema ele tem.",
  },
  2: {
    objetivo: "Escrever uma promessa clara, curta e honesta.",
    saida: "promessa segura; promessa curta; promessa sem exagero; o que NÃO prometer.",
    cortar: "Sem promessa de venda garantida, sem 'sucesso 100%', sem segurança absoluta.",
    criterio: "A promessa cabe em uma frase e é realista.",
  },
  3: {
    objetivo: "Decidir qual é a ação principal e única do usuário.",
    saida: "ação principal única; fluxo principal do usuário; começo, meio e fim da experiência.",
    cortar: "Não liste 5 ações principais — escolha 1.",
    criterio: "Existe uma ação dominante que define o app.",
  },
  4: {
    objetivo: "Separar o essencial do MVP do que fica para depois.",
    saida: "até 5 funcionalidades essenciais; lista do que fica para depois; riscos de escopo.",
    cortar: "Sem mais de 5 funcionalidades no MVP. Sem extras 'só porque seria legal'.",
    criterio: "Lista enxuta cabe em uma tela e atende a ação principal.",
  },
  5: {
    objetivo: "Transformar tudo num plano executável + primeiro prompt para o Lovable.",
    saida: "telas principais; dados que precisam ser salvos; decisão sobre login, banco, admin e checkout; primeiro prompt para o Lovable.",
    cortar: "Sem inventar login/banco/checkout que não foram pedidos. Sem ampliar escopo.",
    criterio: "Plano + primeiro prompt prontos para colar no Lovable.",
  },
};

const buildAgentStepPrompt = (
  etapa: Etapa,
  ctx: ProjectContext,
  journey: JourneyId | null,
  projectName: string | null,
): string => {
  const journeyLabel = journey ? JOURNEY_LABELS[journey] : "[não escolhida]";
  const name = orPlaceholder(projectName || ctx.appName);
  const meta = ETAPA_OBJETIVOS[etapa.n];
  return `Quero planejar a etapa "${etapa.title}" do meu app antes de pedir qualquer coisa ao Lovable.

Contexto do projeto:
- App: ${name}
- O que faz: ${orPlaceholder(ctx.appDoes)}
- Público: ${orPlaceholder(ctx.audience)}
- Problema: ${orPlaceholder(ctx.problem)}
- Promessa atual: ${orPlaceholder(ctx.promise)}
- Ação principal: ${orPlaceholder(ctx.mainAction)}
- Jornada escolhida: ${journeyLabel}

Etapa atual: ${etapa.n} — ${etapa.title}
Objetivo da etapa: ${meta.objetivo}
Saída esperada: ${meta.saida}
O que cortar: ${meta.cortar}
Critério para avançar: ${meta.criterio}

Me ajude a concluir esta etapa. Faça perguntas curtas se faltar dado e responda com a saída esperada acima, organizada em tópicos. Não amplie o escopo, não invente funcionalidades, não prometa venda garantida nem segurança 100%.`;
};



const CHECKLIST_PREFIX = "planejar_step__";




function EtapaCard({
  etapa,
  defaultOpen,
  enrichedAgentPrompt,
  hasProject,
}: {
  etapa: Etapa;
  defaultOpen: boolean;
  enrichedAgentPrompt: string;
  hasProject: boolean;
}) {
  const { context } = useProjectContext();
  const [tab, setTab] = useState<TabId>("agente");
  const [open, setOpen] = useState(defaultOpen);
  const Icon = etapa.icon;
  const isLovableTab = tab === "lovable";
  const lovableAllowed = etapa.n === 5;

  return (
    <GlassCard className="p-5 md:p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 text-left"
        aria-expanded={open}
      >
        <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
            Etapa {etapa.n}
          </div>
          <h3 className="text-lg md:text-xl font-heading font-bold leading-tight">
            {etapa.title}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 mt-2">
          {open ? "Recolher" : "Abrir"}
        </span>
      </button>

      {open && (
        <div className="mt-4">
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
              const isLov = t.id === "lovable";
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    active
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : isLov
                      ? "border-white/10 bg-white/[0.02] text-foreground/50 hover:bg-white/10"
                      : "border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10"
                  }`}
                >
                  <TIcon size={12} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {isLovableTab && !lovableAllowed && (
            <div className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[12px] text-amber-100 flex items-start gap-2">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              <span>
                Use o Lovable apenas quando já tiver um plano aprovado pelo Agente. Nas etapas 1 a 4 o objetivo é pensar, não construir.
              </span>
            </div>
          )}

          {tab === "avancar" ? (
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
                {etapa.tabs[tab]}
              </pre>
            </div>
          ) : (
            <EditablePromptBox
              key={`${tab}-${hasProject ? "p" : "np"}`}
              saveSourceModule="planejar"
              originalPrompt={tab === "agente" ? enrichedAgentPrompt : etapa.tabs[tab]}
              storageKey={`planejar_prompt__${etapa.n}__${tab}`}
              transformOnCopy={
                tab === "agente"
                  ? undefined
                  : (text) =>
                      buildLovablePrompt({
                        context,
                        stepName: `Planejar o App — ${etapa.title}`,
                        stepObjective: `Trabalhar a etapa "${etapa.title}" do planejamento do app preservando decisões já tomadas sobre problema, público, promessa, ação principal e funcionalidades da primeira versão. Não refazer o app inteiro nem alterar login, banco, checkout, área paga ou admin sem pedido explícito.`,
                        command: text,
                        moduleId: "planejar",
                      })
              }
              copyLabel={
                tab === "agente"
                  ? "Copiar para o Agente Arquiteto"
                  : tab === "corrigir"
                  ? "Copiar correção"
                  : "Copiar para implementar no Lovable"
              }
              helperText={
                tab === "agente"
                  ? "Cole no Agente Arquiteto. Use o Lovable só depois que o plano estiver claro."
                  : tab === "corrigir"
                  ? "Use quando o Lovable não entregar o resultado esperado."
                  : undefined
              }
            />
          )}
        </div>
      )}
    </GlassCard>
  );
}


export function PlanejarModule({ goTo }: { goTo?: (id: string) => void } = {}) {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();
  const { context } = useProjectContext();
  const [journey] = useProjectJourney(activeProject?.id ?? null);

  const agentPlanPrompt = buildAgentPlanPrompt(
    context,
    journey,
    activeProject?.name ?? null,
  );

  const copyAgentHelp = async () => {
    if (!activeProject) {
      toast("Selecione um Projeto em foco antes de planejar.", {
        description: "Sem projeto, o plano sai genérico.",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(agentPlanPrompt);
      toast.success("Prompt estratégico copiado! Cole no Agente Arquiteto.");
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

      <AgentArchitectCard
        className="mb-6"
        variant="hero"
        eyebrow={AGENT_MODULE_GUIDANCE.planejar.eyebrow}
        title={AGENT_MODULE_GUIDANCE.planejar.title}
        subtitle={AGENT_MODULE_GUIDANCE.planejar.subtitle}
        ctaLabel={AGENT_MODULE_GUIDANCE.planejar.ctaLabel}
        prompt={AGENT_MODULE_GUIDANCE.planejar.prompt}
        successMessage={AGENT_MODULE_GUIDANCE.planejar.successMessage}
      />


      {!activeProject && (
        <GlassCard className="p-5 md:p-6 mb-6 border-amber-400/50 bg-gradient-to-br from-amber-400/10 via-accent/[0.05] to-transparent shadow-[0_0_30px_-18px_rgba(251,191,36,0.5)]">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-amber-300/90 mb-1">
                Pré-requisito obrigatório
              </div>
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Antes de planejar, escolha o app que será planejado
              </h2>
              <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed">
                A Fábrica precisa saber qual é o Projeto em foco para gerar prompts úteis, usar sua jornada e orientar o próximo passo.
              </p>
              <p className="text-xs text-muted-foreground/90 mt-2">
                Isto não é um erro — é uma etapa obrigatória. O conteúdo abaixo só faz sentido depois que você escolher o projeto.
              </p>
              <p className="text-xs text-muted-foreground/90 mt-2">
                Já tem um app? Use esta etapa como auditoria do plano atual antes de evoluir.
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-amber-200/90 mb-2">
            Escolha uma das opções abaixo para liberar o planejamento:
          </p>
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
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-medium transition"
              >
                Ver ideias prontas
              </button>
            )}
            {goTo && (
              <button
                onClick={() => goTo("construir")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-medium transition"
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

      {/* Card antigo "Planeje com o Agente antes de construir" removido — substituído pelo AgentArchitectCard contextual (AGENT_MODULE_GUIDANCE.planejar) no topo do módulo para evitar duplicidade. */}


      <GlassCard className="p-4 mb-6 border-white/10 bg-white/[0.03]">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          Como esta etapa funciona
        </div>
        <ol className="space-y-1.5 text-sm text-foreground/85">
          {[
            "Defina o problema e o público.",
            "Escreva a promessa.",
            "Defina a ação principal.",
            "Separe essencial de extra.",
            "Monte o plano e o primeiro prompt para o Lovable.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-muted-foreground italic">
          Use o Agente para pensar. Use o Lovable para executar apenas depois que o plano estiver claro.
        </p>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-2">
        Em cada etapa, comece pela aba <strong className="text-foreground/90">Planejar esta etapa com o Agente</strong>. A aba <strong className="text-foreground/90">Implementar no Lovable</strong> é avançada e só faz sentido na Etapa 5.
      </p>
      <p className="text-[11px] text-amber-200/90 mb-4 italic">
        Copiar prompt não conclui a etapa. Só marque como concluído quando tiver um plano claro.
      </p>

      <div
        className={`space-y-5 mb-8 ${!activeProject ? "opacity-50 pointer-events-none select-none" : ""}`}
        aria-disabled={!activeProject}
      >
        {!activeProject && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[12px] text-amber-100">
            Prévia bloqueada. Crie ou selecione um Projeto em foco acima para destravar as etapas, prompts contextualizados e marcar como concluído.
          </div>
        )}
        {ETAPAS.map((e) => (
          <EtapaCard
            key={e.n}
            etapa={e}
            defaultOpen={e.n === 1}
            hasProject={!!activeProject}
            enrichedAgentPrompt={buildAgentStepPrompt(
              e,
              context,
              journey,
              activeProject?.name ?? null,
            )}
          />
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
              Resumo da primeira versão funcional. Próximas versões serão priorizadas em Melhorias e Versões. Copie para o Lovable apenas depois de revisar os 8 itens do planejamento.
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

      <ChecklistDisclosure title="Checklist opcional — Resultado esperado deste planejamento">
      <GlassCard className="p-5 border-emerald-500/30 bg-emerald-500/[0.04]">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Resultado esperado deste planejamento</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Marque cada item só depois que estiver claro de verdade no seu plano. Copiar prompt não conta.
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
