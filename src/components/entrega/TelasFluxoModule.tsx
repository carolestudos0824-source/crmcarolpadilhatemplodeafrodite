import { toast } from "sonner";
import {
  Workflow,
  HelpCircle,
  Bot,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileText,
  Search,
  Map as MapIcon,
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
    title: "Listar telas essenciais",
    objetivo:
      "Decidir quais telas o app precisa para o usuário entrar, agir e receber o resultado.",
    saida:
      "tela inicial; telas obrigatórias da primeira versão; telas que ficam para depois.",
    cortar:
      "Sem telas decorativas, sem páginas administrativas se não houver admin, sem telas 'só por garantia'.",
    criterio:
      "Você consegue listar as telas indispensáveis e justificar cada uma em 1 frase.",
    tabs: {
      lovable:
        "Liste as telas indispensáveis do meu app. Para cada tela explique: nome, objetivo, o que o usuário vê, qual ação realiza e para onde vai depois. Mantenha apenas o essencial da primeira versão.",
      agente:
        "Me ajude a listar as telas essenciais do meu app: quais são as mínimas para o usuário entrar, entender a proposta, realizar a ação principal e receber o resultado?",
      corrigir:
        "O Lovable criou telas demais. Reduza para as telas indispensáveis da primeira versão e explique a função de cada uma.",
      avancar:
        "Avance quando você souber quais telas existem e qual função cada uma cumpre.",
    },
  },
  {
    n: 2,
    title: "Definir fluxo do usuário",
    objetivo:
      "Desenhar o caminho do usuário do início ao resultado, sem desvios desnecessários.",
    saida:
      "começo, meio e fim da jornada; ordem das telas; caminhos alternativos; ponto de conversão ou entrega.",
    cortar:
      "Sem passos extras, sem onboarding longo, sem etapas que não levam à ação principal.",
    criterio:
      "O caminho do usuário cabe num parágrafo curto e termina num resultado claro.",
    tabs: {
      lovable:
        "Crie um fluxo simples do usuário no meu app. Mostre o caminho passo a passo da primeira tela até o resultado final, incluindo login, formulário, pagamento ou entrega apenas se forem necessários.",
      agente:
        "Me ajude a desenhar o caminho do usuário dentro do app: começo, meio, fim, ponto de conversão e caminhos alternativos. Quero um fluxo curto e direto.",
      corrigir:
        "O Lovable criou um fluxo confuso. Reorganize o caminho do usuário em uma sequência simples e direta, sem etapas desnecessárias.",
      avancar:
        "Avance quando o caminho do usuário estiver claro do início ao fim.",
    },
  },
  {
    n: 3,
    title: "Classificar telas públicas e restritas",
    objetivo:
      "Separar o que qualquer visitante pode ver do que exige login, pagamento ou acesso liberado.",
    saida:
      "telas abertas; telas com login; telas de admin; telas de checkout/área paga, se existirem.",
    cortar:
      "Sem expor conteúdo pago em tela pública. Sem proteger telas que precisam ser públicas para gerar conversão.",
    criterio:
      "Cada tela está marcada como pública ou restrita, com motivo curto.",
    tabs: {
      lovable:
        "Separe as telas do meu app em públicas e restritas. Telas públicas podem ser vistas por visitantes. Telas restritas exigem login, compra, código ou acesso liberado. Explique o motivo de cada separação.",
      agente:
        "Me ajude a decidir quais telas do meu app devem ser públicas e quais devem ser restritas. Considere venda, entrega, login, pagamento, privacidade e experiência do usuário.",
      corrigir:
        "O Lovable deixou conteúdo pago ou privado visível em tela pública. Reorganize as telas para proteger acesso restrito e manter a venda clara.",
      avancar:
        "Avance quando estiver claro o que qualquer visitante pode ver e o que só usuários com acesso podem ver.",
    },
  },
  {
    n: 4,
    title: "Definir CTA e dados por tela",
    objetivo:
      "Para cada tela, decidir o botão principal, o que acontece ao clicar, quais dados são usados ou salvos e os estados de sucesso, erro e vazio.",
    saida:
      "CTA principal por tela; o que acontece após o clique; dados preenchidos; dados salvos; estados de sucesso/erro/vazio.",
    cortar:
      "Sem botões competindo entre si, sem CTAs genéricos, sem promessas de resultado garantido.",
    criterio:
      "Cada tela tem um próximo passo óbvio, dados claros e mensagens definidas.",
    tabs: {
      lovable:
        "Revise cada tela do meu app e defina: CTA principal, texto do botão, o que acontece ao clicar, dados usados, dados salvos e mensagens de sucesso, erro e vazio. Mantenha apenas um CTA principal por tela.",
      agente:
        "Me ajude a definir, para cada tela do meu app, o CTA principal, o que acontece ao clicar, os dados usados ou salvos e os estados de sucesso, erro e vazio.",
      corrigir:
        "O Lovable criou botões demais, dados confusos ou esqueceu estados de erro/vazio. Simplifique cada tela para um próximo passo claro e cubra os estados que faltam.",
      avancar:
        "Avance quando cada tela tiver CTA principal, dados claros e estados definidos.",
    },
  },
  {
    n: 5,
    title: "Gerar prompt de implementação para o Lovable",
    objetivo:
      "Consolidar o Mapa de Telas e Fluxo num comando seguro para o Lovable criar ou ajustar as telas sem quebrar o que já existe.",
    saida:
      "comando único, enxuto, baseado no Mapa, preservando layout, login, banco, admin, checkout e área paga.",
    cortar:
      "Sem refazer o app inteiro. Sem inventar telas fora do Mapa. Sem mexer em login/banco/checkout que não foram pedidos.",
    criterio:
      "Existe um prompt pronto para colar no Lovable que reflete o Mapa aprovado.",
    tabs: {
      lovable:
        "Crie ou ajuste as telas do meu app a partir deste Mapa de Telas e Fluxo: telas, ordem, CTAs, dados, telas públicas/restritas e estados. Preserve layout aprovado, login, banco, admin, checkout e área paga. Faça alteração cirúrgica. Não invente telas fora do Mapa. No final, diga o que foi feito e o que testar.",
      agente:
        "Organize meu app num primeiro prompt seguro para o Lovable baseado no Mapa de Telas e Fluxo que já construímos. O prompt deve refletir exatamente as decisões — sem ampliar.",
      corrigir:
        "O Lovable ampliou o escopo além do Mapa. Reorganize o prompt para refletir apenas as telas, CTAs e dados aprovados, preservando login, banco, admin, checkout e área paga.",
      avancar:
        "Avance quando você tiver um prompt pronto para colar no Lovable que cabe no Mapa.",
    },
  },
];

// Camada global de orientação por jornada — fonte única em src/lib/journeyGuidance.ts.
// Mantemos o alias local `JOURNEY_TELAS_GUIDE` por compatibilidade com os usos abaixo.
import {
  getJourneyGuidance,
  getJourneyPromptInstruction,
  type JourneyGuidance,
} from "@/lib/journeyGuidance";

const JOURNEY_TELAS_GUIDE: Record<JourneyId, JourneyGuidance> = {
  comecando_do_zero: getJourneyGuidance("comecando_do_zero", "telas")!,
  app_completo_por_versoes: getJourneyGuidance("app_completo_por_versoes", "telas")!,
  ja_tenho_um_app: getJourneyGuidance("ja_tenho_um_app", "telas")!,
};

const buildAgentTelasStepPrompt = (
  etapa: Etapa,
  ctx: ProjectContext,
  journey: JourneyId | null,
  projectName: string | null,
): string => {
  const journeyLabel = journey ? JOURNEY_LABELS[journey] : "[não escolhida]";
  const name = orPlaceholder(projectName || ctx.appName);
  const journeyDirective = getJourneyPromptInstruction(journey, "telas", "agent");
  const lovableDirective =
    etapa.n === 5 && journey
      ? `\n\nQuando você gerar o prompt final para o Lovable, inclua explicitamente esta restrição da jornada:\n"${JOURNEY_TELAS_GUIDE[journey].lovableDirective}"`
      : "";
  return `Quero desenhar a etapa "${etapa.title}" do Mapa de Telas e Fluxo do meu app antes de pedir qualquer coisa ao Lovable.

Contexto do projeto:
- App: ${name}
- O que faz: ${orPlaceholder(ctx.appDoes)}
- Público: ${orPlaceholder(ctx.audience)}
- Problema: ${orPlaceholder(ctx.problem)}
- Promessa: ${orPlaceholder(ctx.promise)}
- Ação principal: ${orPlaceholder(ctx.mainAction)}
- Login: ${yn(ctx.needsLogin)} | Banco: ${yn(ctx.needsDatabase)} | Admin: ${yn(ctx.needsAdmin)} | Checkout: ${yn(ctx.needsCheckout)} | Área paga: ${yn(ctx.needsPaidArea)}
- Jornada escolhida: ${journeyLabel}${journeyDirective}${lovableDirective}

Etapa atual: ${etapa.n} — ${etapa.title}
Objetivo: ${etapa.objetivo}
Saída esperada: ${etapa.saida}
O que cortar: ${etapa.cortar}
Critério para avançar: ${etapa.criterio}

Me ajude a concluir esta etapa do Mapa de Telas e Fluxo. Faça perguntas curtas se faltar dado e responda com a saída esperada organizada em tópicos. Não amplie o escopo, não invente telas fora do necessário, não prometa venda garantida nem segurança 100%. Termine com um "Próximo passo único".`;
};

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Tela", def: "Uma página ou área visual dentro do app." },
  { termo: "Fluxo", def: "O caminho que o usuário percorre dentro do app." },
  { termo: "Jornada do usuário", def: "A sequência de passos desde a entrada até o resultado final." },
  { termo: "Tela inicial", def: "A primeira tela que a pessoa vê ao entrar no app." },
  { termo: "CTA", def: "O botão ou chamada que indica o próximo passo." },
  { termo: "Área restrita", def: "Parte do app que só pode ser vista por quem tem login ou acesso liberado." },
  { termo: "Estado vazio", def: "Como a tela aparece quando ainda não há dados a mostrar." },
  { termo: "Estado de erro", def: "Como a tela reage quando algo falha (ex: campo inválido, sem internet)." },
];

// Itens críticos do Mapa de Telas e Fluxo — devem casar com TELAS_CRITICAL em Entrega.tsx.
const CHECKLIST_ITEMS = [
  "Lista de telas principais definida",
  "Fluxo do usuário definido",
  "Telas públicas e restritas definidas",
  "CTA principal por tela definido",
  "Dados por tela definidos",
  "Estados de sucesso/erro/vazio definidos",
  "Tela final ou entrega definida",
  "Prompt de implementação pronto",
];

const CHECKLIST_PREFIX = "telas_step__";

const MAPA_TEMPLATE = `Mapa de Telas e Fluxo

Telas essenciais (primeira versão):
1.
2.
3.

Tela inicial:
[Qual tela o usuário vê primeiro]

Tela da ação principal:
[Onde acontece a ação central do app]

Tela de resultado / entrega:
[Onde o usuário recebe o que veio buscar]

Ordem de navegação:
[Tela A → Tela B → Tela C ...]

Telas públicas:
[Quem não está logado pode ver]

Telas restritas:
[Exigem login, pagamento ou acesso liberado]

CTA principal por tela:
- Tela X: botão "..." → leva para ...
- Tela Y: botão "..." → leva para ...

Dados usados ou salvos por tela:
- Tela X: usa ... | salva ...
- Tela Y: usa ... | salva ...

Estados de sucesso, erro e vazio:
- Sucesso: ...
- Erro: ...
- Vazio: ...

O que fica fora da primeira versão:
[Telas e funcionalidades que entram depois]

Primeiro prompt seguro para o Lovable:
[Comando enxuto que cabe no Mapa acima, preservando layout, login, banco, admin, checkout e área paga]`;

const isContextEssentialMissing = (ctx: ProjectContext): boolean => {
  const need = [ctx.problem, ctx.audience, ctx.promise, ctx.mainAction];
  return need.some((v) => !v || !v.trim());
};

export function TelasFluxoModule({ goTo }: { goTo?: (id: string) => void } = {}) {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();
  const { context } = useProjectContext();
  const [journey] = useProjectJourney(activeProject?.id ?? null);

  const contextIncomplete = !!activeProject && isContextEssentialMissing(context);

  const heroAgentPrompt = buildAgentTelasStepPrompt(
    ETAPAS[0],
    context,
    journey,
    activeProject?.name ?? null,
  );

  const copyHeroAgent = async () => {
    if (!activeProject) {
      toast("Selecione um Projeto em foco antes de mapear as telas.", {
        description: "Sem projeto, o Mapa sai genérico.",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(heroAgentPrompt);
      toast.success("Prompt do Mapa copiado! Cole no Agente Arquiteto.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const toggleItem = (item: string) => {
    const key = `${CHECKLIST_PREFIX}${item}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Primeira etapa pendente — abertura progressiva.
  const firstPendingEtapa = (() => {
    if (!checklist[`${CHECKLIST_PREFIX}Lista de telas principais definida`]) return 1;
    if (!checklist[`${CHECKLIST_PREFIX}Fluxo do usuário definido`]) return 2;
    if (!checklist[`${CHECKLIST_PREFIX}Telas públicas e restritas definidas`]) return 3;
    if (
      !checklist[`${CHECKLIST_PREFIX}CTA principal por tela definido`] ||
      !checklist[`${CHECKLIST_PREFIX}Dados por tela definidos`] ||
      !checklist[`${CHECKLIST_PREFIX}Estados de sucesso/erro/vazio definidos`] ||
      !checklist[`${CHECKLIST_PREFIX}Tela final ou entrega definida`]
    )
      return 4;
    return 5;
  })();

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Workflow size={12} /> Telas e Fluxo
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Mapeie as telas e o fluxo com o Agente antes de construir
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de pedir telas ao Lovable, defina quais telas existem, em que ordem aparecem, qual CTA cada uma tem e o que acontece depois de cada ação.
        </p>
      </header>

      {/* Gate sem Projeto em foco */}
      {!activeProject && (
        <GlassCard className="p-5 md:p-6 mb-6 border-amber-400/50 bg-gradient-to-br from-amber-400/10 via-accent/[0.05] to-transparent shadow-[0_0_30px_-18px_rgba(251,191,36,0.5)]">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-amber-300/90 mb-1">
                Pré-requisito obrigatório
              </div>
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Antes de desenhar as telas, escolha o app que será organizado
              </h2>
              <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed">
                A Fábrica precisa de um Projeto em foco para usar contexto, jornada, MVP, GPS, Agente e prompts inteligentes.
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-amber-200/90 mb-2">
            Escolha uma das opções abaixo para liberar o desenho do Mapa:
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
                onClick={() => goTo("planejar")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 text-xs font-medium transition"
              >
                <Search size={14} /> Ir para Planejar o App
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Aviso de contexto incompleto */}
      {contextIncomplete && (
        <GlassCard className="p-4 mb-6 border-amber-400/40 bg-amber-400/[0.06]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-heading font-semibold text-amber-100">
                Antes de desenhar telas, preencha pelo menos problema, público, promessa e ação principal.
              </h3>
              <p className="text-xs text-foreground/85 mt-1 leading-relaxed">
                Sem esses dados, os prompts ficam fracos e o Mapa de Telas e Fluxo sai genérico. Você pode continuar mesmo assim, mas o resultado será melhor com contexto preenchido.
              </p>
              {goTo && (
                <button
                  onClick={() => goTo("planejar")}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/50 bg-amber-400/15 text-amber-100 hover:bg-amber-400/20 text-xs font-semibold transition"
                >
                  Voltar para Planejar o App
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Hero do Agente — ação principal */}
      <GlassCard className="p-5 md:p-6 mb-6 border-accent/40 bg-gradient-to-br from-accent/[0.12] via-accent/[0.04] to-transparent shadow-[0_0_30px_-18px_rgba(0,194,255,0.6)]">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">
              Comece por aqui
            </div>
            <h2 className="text-lg md:text-2xl font-heading font-bold leading-tight">
              Mapear telas com o Agente Arquiteto
            </h2>
            <p className="text-sm md:text-base text-foreground/90 mt-1.5 leading-relaxed">
              {journey
                ? JOURNEY_TELAS_GUIDE[journey].heroSubtitle
                : "Use o Agente para pensar telas, fluxo, CTAs e dados antes de pedir qualquer coisa ao Lovable. O Lovable entra só na Etapa 5, depois que o Mapa estiver claro."}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={copyHeroAgent}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold transition"
          >
            <Bot size={14} /> Mapear telas com o Agente Arquiteto
          </button>
          {!activeProject && (
            <button
              onClick={openDrawer}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15 text-sm font-semibold transition"
            >
              <Sparkles size={14} /> Criar ou selecionar app primeiro
            </button>
          )}
        </div>
        <details className="mt-4 rounded-lg border border-white/10 bg-black/30">
          <summary className="cursor-pointer select-none px-3 py-2 text-xs text-foreground/80 hover:text-foreground">
            Ver e editar o prompt do Mapa antes de copiar
          </summary>
          <div className="p-3 pt-0">
            <EditablePromptBox
              key={`telas-hero-${activeProject?.id ?? "no-project"}-${journey ?? "no-journey"}`}
              saveSourceModule="telas"
              originalPrompt={heroAgentPrompt}
              storageKey={`telas_agent_hero__${activeProject?.id ?? "no-project"}`}
              copyLabel="Copiar prompt para o Agente"
              helperText="Cole no Agente Arquiteto, não no Lovable."
            />
          </div>
        </details>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Comece sempre pela aba <strong className="text-foreground/90">Revisar com o Agente primeiro</strong>. O Lovable entra só na Etapa 5. Copiar prompt não conclui a etapa.
      </p>

      {/* Aviso: jornada não escolhida */}
      {activeProject && !journey && (
        <GlassCard className="p-4 mb-6 border-amber-400/40 bg-amber-400/[0.06]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-heading font-semibold text-amber-100">
                Escolha uma jornada antes de desenhar o fluxo, para a Fábrica adaptar o mapa de telas ao seu momento.
              </h3>
              <p className="text-xs text-foreground/85 mt-1 leading-relaxed">
                As 3 jornadas (Começando do zero, Quero um app completo, Já tenho um app) mudam quais telas entram agora, quais ficam para depois e o que o Lovable pode mexer. Sem jornada, os prompts ficam menos precisos.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Etapas — prévia bloqueada se não houver projeto */}
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
          const journeyGuide = journey ? JOURNEY_TELAS_GUIDE[journey] : null;
          return (
            <div key={e.n}>
              {!isFinal && activeProject && (
                <div className="mb-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-2.5 text-[12px] text-amber-100 flex items-start gap-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span>
                    {journeyGuide
                      ? journeyGuide.preservationNote
                      : "Use o Lovable apenas depois que o Mapa de Telas e Fluxo estiver claro. Nesta etapa, comece pelo Agente."}
                  </span>
                </div>
              )}
              {isFinal && activeProject && journeyGuide && (
                <div className="mb-2 rounded-lg border border-cyan-400/30 bg-cyan-400/[0.06] p-2.5 text-[12px] text-cyan-100 flex items-start gap-2">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  <span>
                    Regra de implementação no Lovable para esta jornada: {journeyGuide.lovableDirective}
                  </span>
                </div>
              )}
              <CommandCard
                key={`telas-${e.n}`}
                number={e.n}
                title={e.title}
                description={e.objetivo}
                whenToUse={`Use nesta etapa: ${e.title}.`}
                whereToPaste={
                  isFinal
                    ? "Cole no chat do seu projeto no Lovable."
                    : "Primeiro cole no Agente. No Lovable só na Etapa 5."
                }
                expectedResult={e.saida}
                commandText={e.tabs.lovable}
                completedKey={`telas_cmd__${e.n}`}
                moduleId="telas"
                objective={e.title}
                agentPrompt={
                  activeProject
                    ? buildAgentTelasStepPrompt(e, context, journey, activeProject.name)
                    : e.tabs.agente
                }
                correctionPrompt={e.tabs.corrigir}
                advanceCriteria={journey ? `${e.criterio} ${JOURNEY_TELAS_GUIDE[journey].advanceHint}` : e.criterio}
                defaultOpen={e.n === firstPendingEtapa}
              />
            </div>
          );
        })}
      </div>

      {/* Mapa de Telas e Fluxo — entrega central */}
      <GlassCard className="p-5 md:p-6 mb-6 border-accent/40 bg-accent/[0.07]">
        <div className="flex items-start gap-3 mb-3">
          <MapIcon size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-accent mb-1">
              Entrega desta etapa
            </div>
            <h3 className="text-lg font-heading font-bold leading-tight">Mapa de Telas e Fluxo</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Documento único com telas, ordem, CTAs, dados, telas públicas/restritas e estados. Quando estiver preenchido, vire o primeiro prompt seguro para o Lovable na Etapa 5.
            </p>
          </div>
        </div>
        <EditablePromptBox
          saveSourceModule="telas"
          originalPrompt={MAPA_TEMPLATE}
          storageKey="telas_mapa"
          copyLabel="Copiar Mapa de Telas e Fluxo"
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
          <h3 className="font-heading font-semibold text-base">Mapa de Telas e Fluxo — checklist final</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Marque cada item só depois que estiver claro de verdade no seu Mapa. Copiar prompt não conta.
          {journey && (
            <>
              <br />
              <span className="text-amber-200/90">{JOURNEY_TELAS_GUIDE[journey].checklistNote}</span>
            </>
          )}
        </p>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            return (
              <li key={item}>
                <label className="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition border-accent/30 bg-accent/[0.06] hover:bg-accent/10">
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
              <span>Mapa de Telas e Fluxo concluído. Agora você pode marcar o módulo como concluído.</span>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Ainda não conclua. Faltam itens críticos do Mapa de Telas e Fluxo.
              </span>
            </div>
          );
        })()}
      </GlassCard>

      <div className="mt-6">
        <AgentArchitectCard
          variant="compact"
          title="Quer revisar antes de seguir?"
          subtitle="Use o Agente Arquiteto para validar se seu Mapa de Telas e Fluxo está simples, claro e pronto para virar prompt do Lovable."
          ctaLabel="Revisar Mapa com o Agente Arquiteto"
        />
      </div>
    </section>
  );
}
