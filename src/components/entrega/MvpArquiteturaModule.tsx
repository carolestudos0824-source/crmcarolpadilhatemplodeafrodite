import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Workflow,
  HelpCircle,
  Bot,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  Hammer,
  Rocket,
  Check,
  FileText,
  Search,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAppProjects } from "@/hooks/useAppProjects";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { CommandCard } from "@/components/entrega/CommandCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";
import { useProjectJourney, JOURNEY_LABELS, type JourneyId } from "@/lib/journey";

export type AppStage = "idea" | "building" | "ready";

const APP_STAGE_STORAGE_KEY = "fabrica_apps_mvp_stage";

const STAGE_OPTIONS: {
  id: AppStage;
  label: string;
  description: string;
  icon: typeof Lightbulb;
}[] = [
  {
    id: "idea",
    label: "Tenho só uma ideia",
    description: "Crie o MVP do zero com arquitetura simples e validável.",
    icon: Lightbulb,
  },
  {
    id: "building",
    label: "Já estou construindo",
    description:
      "Audite o que já existe, corrija falhas e organize os próximos passos sem recomeçar.",
    icon: Hammer,
  },
  {
    id: "ready",
    label: "Já tenho app pronto",
    description:
      "Otimize UX, monetização, onboarding, retenção e lançamento sem recriar o produto.",
    icon: Rocket,
  },
];

const STAGE_PREFIX: Record<AppStage, string> = {
  idea: "",
  building:
    "O usuário já está construindo este app. Não recrie tudo do zero. Audite a estrutura atual, preserve o que funciona e proponha correções práticas para arquitetura, fluxo, banco de dados, UX e priorização.",
  ready:
    "O usuário já tem um app pronto. Não recrie o MVP. Audite o produto existente e proponha melhorias de UX, monetização, onboarding, retenção, performance, clareza e escala.",
};

const withStage = (stage: AppStage, prompt: string): string =>
  stage === "idea" ? prompt : `${STAGE_PREFIX[stage]}\n\n${prompt}`;

const readStoredStage = (): AppStage => {
  if (typeof window === "undefined") return "idea";
  try {
    const v = window.localStorage.getItem(APP_STAGE_STORAGE_KEY);
    if (v === "idea" || v === "building" || v === "ready") return v;
  } catch {
    /* noop */
  }
  return "idea";
};

const orPlaceholder = (s: string | undefined | null) =>
  s && s.trim() ? s.trim() : "[a definir]";
const yn = (v: ProjectContext["needsLogin"]) =>
  v === "sim" ? "Sim" : v === "nao" ? "Não" : "[a definir]";

type Etapa = {
  n: number;
  title: string;
  objetivo: string;
  saida: string;
  cortar: string;
  criterio: string;
  tabs: {
    lovable: string;
    agente: string;
    corrigir: string;
    avancar: string;
  };
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    title: "Definir o MVP",
    objetivo: "Decidir o objetivo da primeira versão funcional e o que entra.",
    saida: "objetivo do MVP; até 5 funcionalidades essenciais; o que cortar agora.",
    cortar: "Sem mais de 5 funcionalidades. Sem 'seria legal'. Sem promessas de venda garantida.",
    criterio: "Você sabe descrever a primeira versão funcional em 1 parágrafo.",
    tabs: {
      lovable:
        "Crie a estrutura de MVP do meu app. Liste apenas o essencial da primeira versão funcional: objetivo, ação principal, até 5 funcionalidades. Não inclua extras.",
      agente:
        "Me ajude a definir o MVP do meu app. Quero objetivo da primeira versão, até 5 funcionalidades essenciais e o que cortar agora.",
      corrigir:
        "O Lovable deixou meu MVP grande demais. Reduza para uma primeira versão simples, com no máximo 5 funcionalidades principais.",
      avancar:
        "Avance quando a primeira versão estiver simples, clara e construível sem excesso.",
    },
  },
  {
    n: 2,
    title: "Definir telas principais",
    objetivo: "Mapear as telas mínimas para o usuário entrar, agir e receber resultado.",
    saida: "lista de telas; ordem do fluxo; tela inicial; tela de resultado/entrega.",
    cortar: "Sem telas administrativas se não houver admin. Sem telas extras de configuração agora.",
    criterio: "O fluxo principal cabe em poucas telas e está claro do começo ao fim.",
    tabs: {
      lovable:
        "Liste as telas necessárias para o MVP do meu app. Para cada tela explique: nome, função, o que o usuário faz e para onde vai depois.",
      agente:
        "Me ajude a mapear as telas do MVP. Quais são as mínimas para entrar, fazer a ação principal e receber o resultado?",
      corrigir:
        "O Lovable criou telas demais. Simplifique para as telas indispensáveis da primeira versão.",
      avancar:
        "Avance quando as telas principais estiverem claras e o fluxo do usuário estiver simples.",
    },
  },
  {
    n: 3,
    title: "Definir dados e banco",
    objetivo: "Decidir o que precisa ser salvo e como organizar o banco mínimo.",
    saida: "dados a salvar; tabelas mínimas; dados por usuário; dados públicos x privados.",
    cortar: "Sem tabelas que ninguém vai usar agora. Sem campos 'só por garantia'.",
    criterio: "Cada dado salvo tem um motivo claro ligado a uma tela ou ação.",
    tabs: {
      lovable:
        "Defina quais dados meu app precisa salvar. Organize em tabelas/coleções simples explicando o que cada uma guarda e quais campos são necessários.",
      agente:
        "Me ajude a pensar quais dados meu app precisa salvar: usuários, respostas, pagamentos, histórico, status? O que é público e o que é privado?",
      corrigir:
        "O Lovable criou dados/tabelas demais. Simplifique o banco para o mínimo da primeira versão.",
      avancar:
        "Avance quando estiver claro quais dados o app precisa salvar e por quê.",
    },
  },
  {
    n: 4,
    title: "Decidir login, admin, checkout e área paga",
    objetivo: "Decidir o que entra de infraestrutura sensível agora e o que fica para depois.",
    saida: "precisa de login agora?; admin agora?; checkout agora?; área paga agora?; o que fica para depois.",
    cortar: "Sem ativar login/admin/checkout 'só por garantia'. Cada decisão precisa de motivo prático.",
    criterio: "Cada uma das 4 decisões está respondida com Sim/Não e justificativa curta.",
    tabs: {
      lovable:
        "Defina se meu MVP precisa AGORA de login, admin, checkout e área paga. Justifique cada decisão com base no problema, público e ação principal do app.",
      agente:
        "Me ajude a decidir, com base no meu projeto, se preciso de login, admin, checkout e área paga AGORA ou se posso deixar para a versão 2.",
      corrigir:
        "O Lovable adicionou login/admin/checkout sem necessidade. Reveja cada decisão e remova o que não for indispensável para o MVP.",
      avancar:
        "Avance quando as 4 decisões estiverem respondidas com motivo curto.",
    },
  },
  {
    n: 5,
    title: "Gerar primeiro prompt para o Lovable",
    objetivo: "Consolidar o Blueprint num comando seguro para o Lovable criar a base do app.",
    saida: "comando único, enxuto, baseado no Blueprint, sem ampliar escopo.",
    cortar: "Sem refazer o app inteiro. Sem mexer em login/banco/checkout que foram marcados como 'depois'.",
    criterio: "Existe um prompt pronto para colar no Lovable que reflete o Blueprint aprovado.",
    tabs: {
      lovable:
        "Crie a base do app a partir deste Blueprint do MVP: objetivo, ação principal, funcionalidades, telas, dados, decisões sobre login/admin/checkout/área paga. Mantenha o escopo enxuto. Não adicione nada fora do Blueprint.",
      agente:
        "Organize meu app num primeiro prompt seguro para o Lovable, baseado no Blueprint do MVP que já construímos. O prompt deve refletir exatamente as decisões — sem ampliar.",
      corrigir:
        "O Lovable ampliou o escopo além do Blueprint. Reorganize o prompt para refletir apenas o MVP definido e o que foi decidido sobre login/admin/checkout.",
      avancar:
        "Avance quando você tiver um prompt pronto para colar no Lovable que cabe no Blueprint.",
    },
  },
];

const buildAgentMvpStepPrompt = (
  etapa: Etapa,
  ctx: ProjectContext,
  journey: JourneyId | null,
  projectName: string | null,
): string => {
  const journeyLabel = journey ? JOURNEY_LABELS[journey] : "[não escolhida]";
  const name = orPlaceholder(projectName || ctx.appName);
  return `Quero desenhar a etapa "${etapa.title}" do Blueprint do MVP do meu app antes de pedir qualquer coisa ao Lovable.

Contexto do projeto:
- App: ${name}
- O que faz: ${orPlaceholder(ctx.appDoes)}
- Público: ${orPlaceholder(ctx.audience)}
- Problema: ${orPlaceholder(ctx.problem)}
- Promessa: ${orPlaceholder(ctx.promise)}
- Ação principal: ${orPlaceholder(ctx.mainAction)}
- Login: ${yn(ctx.needsLogin)} | Banco: ${yn(ctx.needsDatabase)} | Admin: ${yn(ctx.needsAdmin)} | Checkout: ${yn(ctx.needsCheckout)} | Área paga: ${yn(ctx.needsPaidArea)}
- Jornada escolhida: ${journeyLabel}

Etapa atual: ${etapa.n} — ${etapa.title}
Objetivo: ${etapa.objetivo}
Saída esperada: ${etapa.saida}
O que cortar: ${etapa.cortar}
Critério para avançar: ${etapa.criterio}

Me ajude a concluir esta etapa do Blueprint. Faça perguntas curtas se faltar dado e responda com a saída esperada organizada em tópicos. Não amplie o escopo, não invente funcionalidades, não prometa venda garantida nem segurança 100%. Termine com um "Próximo passo único".`;
};

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "MVP", def: "A primeira versão simples do app, com apenas o essencial para testar." },
  { termo: "Blueprint", def: "O desenho do MVP: objetivo, funcionalidades, telas, dados e decisões." },
  { termo: "Arquitetura", def: "A estrutura do app: telas, funcionalidades, dados e regras." },
  { termo: "Tela", def: "Uma página ou área visual dentro do app." },
  { termo: "Banco de dados", def: "O lugar onde o app guarda informações." },
  { termo: "Escopo", def: "O limite do que entra ou não entra na primeira versão." },
  { termo: "Versão 2", def: "O que fica para depois, quando o MVP já estiver validado." },
];

// Itens críticos do Blueprint do MVP — devem casar com MVP_CRITICAL em Entrega.tsx.
const CHECKLIST_ITEMS = [
  "MVP definido",
  "Até 5 funcionalidades escolhidas",
  "Telas principais definidas",
  "Dados principais definidos",
  "Decisão sobre login",
  "Decisão sobre banco",
  "Decisão sobre admin",
  "Decisão sobre checkout/área paga",
  "Itens da versão 2 separados",
  "Primeiro prompt Lovable pronto",
];

const CHECKLIST_PREFIX = "mvp_step__";

const BLUEPRINT_TEMPLATE = `Blueprint do MVP

Objetivo do MVP:
[Para que serve a primeira versão]

Ação principal do usuário:
[O que o usuário faz primeiro]

Até 5 funcionalidades essenciais:
1.
2.
3.
4.
5.

Telas da primeira versão:
[Lista das telas]

Dados que precisam ser salvos:
[Tabelas/coleções mínimas]

Decisão sobre login: [Sim/Não — motivo curto]
Decisão sobre banco: [Sim/Não — motivo curto]
Decisão sobre admin: [Sim/Não — motivo curto]
Decisão sobre checkout: [Sim/Não — motivo curto]
Decisão sobre área paga: [Sim/Não — motivo curto]

O que fica para a versão 2:
[Lista do que NÃO entra agora]

Primeiro prompt seguro para o Lovable:
[Comando enxuto que cabe no Blueprint acima]`;

export function MvpArquiteturaModule({ goTo }: { goTo?: (id: string) => void } = {}) {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();
  const { context } = useProjectContext();
  const [journey] = useProjectJourney(activeProject?.id ?? null);
  const [appStage, setAppStage] = useState<AppStage>(() => readStoredStage());

  useEffect(() => {
    try {
      window.localStorage.setItem(APP_STAGE_STORAGE_KEY, appStage);
    } catch {
      /* noop */
    }
  }, [appStage]);

  const heroAgentPrompt = buildAgentMvpStepPrompt(
    ETAPAS[0],
    context,
    journey,
    activeProject?.name ?? null,
  );

  const copyHeroAgent = async () => {
    if (!activeProject) {
      toast("Selecione um Projeto em foco antes de desenhar o MVP.", {
        description: "Sem projeto, o Blueprint sai genérico.",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(heroAgentPrompt);
      toast.success("Prompt do Blueprint copiado! Cole no Agente Arquiteto.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const toggleItem = (item: string) => {
    const key = `${CHECKLIST_PREFIX}${item}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Encontra a primeira etapa pendente: usamos como heurística o primeiro item
  // crítico do checklist ainda não marcado, mapeado para a etapa correspondente.
  const firstPendingEtapa = (() => {
    if (!checklist[`${CHECKLIST_PREFIX}MVP definido`]) return 1;
    if (
      !checklist[`${CHECKLIST_PREFIX}Até 5 funcionalidades escolhidas`] ||
      !checklist[`${CHECKLIST_PREFIX}Telas principais definidas`]
    )
      return 2;
    if (!checklist[`${CHECKLIST_PREFIX}Dados principais definidos`]) return 3;
    if (
      !checklist[`${CHECKLIST_PREFIX}Decisão sobre login`] ||
      !checklist[`${CHECKLIST_PREFIX}Decisão sobre banco`] ||
      !checklist[`${CHECKLIST_PREFIX}Decisão sobre admin`] ||
      !checklist[`${CHECKLIST_PREFIX}Decisão sobre checkout/área paga`]
    )
      return 4;
    return 5;
  })();

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Workflow size={12} /> MVP e Arquitetura
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Desenhe o Blueprint do MVP antes de construir
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Transforme o planejamento numa primeira versão funcional clara: objetivo, telas, dados e decisões sobre login, banco, admin e checkout — antes de pedir ao Lovable.
        </p>
        <p className="text-xs text-amber-200/90 max-w-3xl mt-3 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] px-3 py-2">
          <strong className="text-amber-200">Regra da primeira versão:</strong> até 5 funcionalidades principais. As demais entram nas próximas versões, no módulo Melhorias e Versões.
        </p>
      </header>

      {!activeProject && (
        <GlassCard className="p-5 md:p-6 mb-6 border-amber-400/50 bg-gradient-to-br from-amber-400/10 via-accent/[0.05] to-transparent shadow-[0_0_30px_-18px_rgba(251,191,36,0.5)]">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-amber-300/90 mb-1">
                Pré-requisito obrigatório
              </div>
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Antes de desenhar o MVP, escolha o app que será estruturado
              </h2>
              <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed">
                A Fábrica precisa de um Projeto em foco para usar contexto, jornada, GPS, Agente e prompts inteligentes.
              </p>
              <p className="text-xs text-muted-foreground/90 mt-2">
                Já tem um app? Use esta etapa como auditoria da estrutura atual antes de evoluir.
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-amber-200/90 mb-2">
            Escolha uma das opções abaixo para liberar o desenho do MVP:
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <button
              onClick={openDrawer}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold transition"
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

      {/* Hero local "Desenhe o MVP com o Agente antes de construir" removido — substituído pelo AgentArchitectCard contextual (variant="compact" no fim do módulo) para evitar duplicidade. */}


      {/* Seletor de momento — preservado */}
      <GlassCard className="p-5 mb-6" aria-labelledby="mvp-stage-selector-title">
        <h2 id="mvp-stage-selector-title" className="font-heading font-semibold text-base md:text-lg mb-1">
          Qual é o momento do seu app?
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Escolha onde você está agora. Os comandos das próximas etapas se adaptam ao seu momento.
        </p>
        <div role="radiogroup" aria-labelledby="mvp-stage-selector-title" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STAGE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = appStage === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setAppStage(opt.id)}
                className={`text-left rounded-xl border p-4 min-h-[120px] transition flex flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                  active
                    ? "border-accent/60 bg-accent/10 shadow-[0_0_0_1px_rgba(0,194,255,0.25)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${active ? "bg-accent/15 border-accent/40 text-accent" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                    <Icon size={16} />
                  </span>
                  {active && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-accent">
                      <Check size={12} /> Selecionado
                    </span>
                  )}
                </div>
                <div className={`font-semibold text-sm ${active ? "text-accent" : "text-foreground/90"}`}>
                  {opt.label}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{opt.description}</p>
              </button>
            );
          })}
        </div>
        {appStage !== "idea" && (
          <p className="text-[11px] text-cyan-200/90 bg-cyan-500/[0.06] border border-cyan-400/25 rounded-md px-3 py-2 mt-3">
            Os prompts copiados receberão uma instrução extra para que o Lovable e o Agente <strong className="text-cyan-100">auditem o app existente</strong> em vez de recriar tudo do zero.
          </p>
        )}
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-2">
        Em cada etapa, comece pela aba <strong className="text-foreground/90">Revisar com o Agente Arquiteto primeiro</strong>. A aba <strong className="text-foreground/90">Implementar no Lovable</strong> é avançada — só faz sentido na Etapa 5.
      </p>
      <p className="text-[11px] text-amber-200/90 mb-4 italic">
        Copiar prompt não conclui a etapa. Só marque como concluído quando o Blueprint estiver completo.
      </p>

      {/* Etapas com prévia bloqueada se não houver projeto */}
      <div
        className={`space-y-5 mb-8 ${!activeProject ? "opacity-50 pointer-events-none select-none" : ""}`}
        aria-disabled={!activeProject}
      >
        {!activeProject && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[12px] text-amber-100">
            Prévia bloqueada. Crie ou selecione um Projeto em foco acima para destravar as etapas, prompts contextualizados e a marcação de conclusão.
          </div>
        )}
        {ETAPAS.map((e) => {
          const isFinal = e.n === 5;
          return (
            <div key={e.n}>
              {!isFinal && activeProject && (
                <div className="mb-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-2.5 text-[12px] text-amber-100 flex items-start gap-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span>
                    Use o Lovable apenas depois que o Blueprint do MVP estiver claro. Nesta etapa, comece pelo Agente.
                  </span>
                </div>
              )}
              <CommandCard
                key={`${e.n}-${appStage}`}
                number={e.n}
                title={e.title}
                description={e.objetivo}
                whenToUse={`Use nesta etapa: ${e.title}.`}
                whereToPaste={isFinal ? "Cole no chat do seu projeto no Lovable." : "Primeiro cole no Agente. No Lovable só na Etapa 5."}
                expectedResult={e.saida}
                commandText={withStage(appStage, e.tabs.lovable)}
                completedKey={`mvp_cmd__${e.n}__${appStage}`}
                moduleId="mvp"
                objective={e.title}
                agentPrompt={
                  activeProject
                    ? buildAgentMvpStepPrompt(e, context, journey, activeProject.name)
                    : withStage(appStage, e.tabs.agente)
                }
                correctionPrompt={withStage(appStage, e.tabs.corrigir)}
                advanceCriteria={e.criterio}
                defaultOpen={e.n === firstPendingEtapa}
              />
            </div>
          );
        })}
      </div>

      {/* Blueprint do MVP — entrega central */}
      <GlassCard className="p-5 md:p-6 mb-6 border-accent/40 bg-accent/[0.07]">
        <div className="flex items-start gap-3 mb-3">
          <FileText size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
              Entrega desta etapa
            </div>
            <h3 className="text-lg font-heading font-bold leading-tight">Blueprint do MVP</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Documento único com objetivo, ação principal, funcionalidades, telas, dados e decisões. Quando estiver preenchido, vire o primeiro prompt seguro para o Lovable na Etapa 5.
            </p>
          </div>
        </div>
        <EditablePromptBox
          saveSourceModule="mvp"
          originalPrompt={BLUEPRINT_TEMPLATE}
          storageKey="mvp_blueprint"
          copyLabel="Copiar Blueprint do MVP"
        />
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle size={16} className="text-accent" />
          <h3 className="font-heading font-semibold text-base">Não entendi uma palavra</h3>
        </div>
        <dl className="grid sm:grid-cols-2 gap-3">
          {GLOSSARIO.map((g) => (
            <div key={g.termo} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <dt className="text-sm font-semibold text-accent">{g.termo}</dt>
              <dd className="text-xs text-muted-foreground mt-1">{g.def}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>

      {/* Checklist crítico — controla conclusão do módulo via Entrega.tsx */}
      <GlassCard className="p-5 border-emerald-500/30 bg-emerald-500/[0.04]">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Blueprint do MVP — checklist final</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Marque cada item só depois que estiver claro de verdade no seu Blueprint. Copiar prompt não conta.
        </p>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            return (
              <li key={item}>
                <label
                  className="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition border-accent/30 bg-accent/[0.06] hover:bg-accent/10"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleItem(item)}
                    className="accent-accent w-5 h-5 shrink-0"
                  />
                  <span className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}>
                    {item}
                  </span>
                  {!done && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent shrink-0">
                      Crítico
                    </span>
                  )}
                  {done && (
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 ml-auto" />
                  )}
                  {!done && (
                    <Circle size={14} className="text-muted-foreground/40 shrink-0" />
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        {(() => {
          const allDone = CHECKLIST_ITEMS.every((it) => !!checklist[`${CHECKLIST_PREFIX}${it}`]);
          return allDone ? (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>Blueprint do MVP concluído. Agora você pode marcar o módulo como concluído.</span>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Ainda não conclua. Faltam itens críticos do Blueprint do MVP.
              </span>
            </div>
          );
        })()}
      </GlassCard>

      <div className="mt-6">
        <AgentArchitectCard
          variant="compact"
          title="Quer revisar antes de seguir?"
          subtitle="Use o Agente Arquiteto para validar se seu Blueprint está simples, vendável e pronto para construir."
          ctaLabel="Revisar Blueprint com o Agente Arquiteto"
        />
      </div>
    </section>
  );
}
