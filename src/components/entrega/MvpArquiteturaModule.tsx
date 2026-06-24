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
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAppProjects } from "@/hooks/useAppProjects";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { AgentArchitectCard } from "@/components/entrega/AgentArchitectCard";
import { CommandCard } from "@/components/entrega/CommandCard";


const AGENT_HELP_PROMPT = `Estou criando um aplicativo do zero com IA. Já tenho uma ideia inicial e preciso transformar isso em um MVP simples. Me ajude a definir: quais funcionalidades entram na primeira versão, quais telas o app precisa ter, quais dados precisam ser salvos, quais regras o app deve seguir e o que deve ficar para uma versão futura.`;

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


type Etapa = {
  n: number;
  title: string;
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
    tabs: {
      lovable:
        "Crie uma estrutura de MVP para meu app. Liste apenas o essencial da primeira versão: objetivo do app, público, problema resolvido, ação principal e funcionalidades indispensáveis. Não inclua funcionalidades extras agora.",
      agente:
        "Me ajude a transformar minha ideia em um MVP simples. Quero saber o que é indispensável para a primeira versão e o que deve ficar para depois.",
      corrigir:
        "O Lovable deixou meu MVP grande demais. Reduza para uma primeira versão simples, com no máximo 5 funcionalidades principais.",
      avancar:
        "Avance quando a primeira versão do app estiver simples, clara e possível de construir sem excesso.",
    },
  },
  {
    n: 2,
    title: "Listar funcionalidades essenciais",
    tabs: {
      lovable:
        "Crie uma lista de funcionalidades essenciais para a primeira versão do meu app. Separe em: obrigatório agora, importante depois e extra para versão futura.",
      agente:
        "Analise minha ideia de app e me ajude a escolher no máximo 5 funcionalidades essenciais para o MVP. Quero cortar o que não for necessário agora.",
      corrigir:
        "O Lovable colocou funcionalidades demais. Reorganize a lista e mantenha somente o que é necessário para testar o app com usuários reais.",
      avancar:
        "Avance quando você tiver no máximo 5 funcionalidades principais para a primeira versão.",
    },
  },
  {
    n: 3,
    title: "Mapear telas necessárias",
    tabs: {
      lovable:
        "Liste as telas necessárias para o MVP do meu app. Para cada tela, explique: nome da tela, função, o que o usuário faz nela e para onde ele vai depois.",
      agente:
        "Me ajude a mapear as telas do meu app. Quero saber quais telas são realmente necessárias para o usuário entrar, realizar a ação principal e receber o resultado.",
      corrigir:
        "O Lovable criou telas demais. Simplifique o fluxo para as telas indispensáveis da primeira versão.",
      avancar:
        "Avance quando as telas principais estiverem claras e o fluxo do usuário estiver simples.",
    },
  },
  {
    n: 4,
    title: "Definir dados e banco",
    tabs: {
      lovable:
        "Defina quais dados meu app precisa salvar no banco. Organize em tabelas ou coleções simples, explicando o que cada uma guarda e quais campos são necessários.",
      agente:
        "Me ajude a pensar quais dados meu app precisa salvar. Quero entender se preciso guardar usuários, respostas, pagamentos, resultados, histórico, status de acesso ou outras informações.",
      corrigir:
        "O Lovable criou dados demais ou tabelas confusas. Simplifique o banco para o mínimo necessário da primeira versão.",
      avancar:
        "Avance quando estiver claro quais dados o app precisa salvar e por quê.",
    },
  },
  {
    n: 5,
    title: "Criar prompt de arquitetura para o Lovable",
    tabs: {
      lovable:
        "Crie a arquitetura inicial do meu app com base neste planejamento: objetivo, público, problema, promessa, ação principal, funcionalidades essenciais, telas necessárias, dados que precisam ser salvos e regras principais. Estruture tudo de forma clara para começar a construção no Lovable.",
      agente:
        "Organize meu app em uma arquitetura simples para eu colar no Lovable. Quero um prompt claro com telas, funcionalidades, banco de dados, regras, fluxo do usuário e o que deve ficar para depois.",
      corrigir:
        "O Lovable misturou planejamento, telas e funcionalidades de forma confusa. Reorganize a arquitetura em tópicos claros: objetivo, público, telas, funcionalidades, dados, regras e próximos passos.",
      avancar:
        "Avance quando você tiver um prompt de arquitetura claro para iniciar a construção do app.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "MVP", def: "A primeira versão simples do app, com apenas o essencial para testar." },
  { termo: "Arquitetura", def: "A estrutura do app: telas, funcionalidades, dados e regras." },
  { termo: "Funcionalidade", def: "Um recurso ou ação que o app oferece." },
  { termo: "Tela", def: "Uma página ou área visual dentro do app." },
  { termo: "Banco de dados", def: "O lugar onde o app guarda informações." },
  { termo: "Regra de negócio", def: "Uma regra que define como o app deve funcionar." },
  { termo: "Escopo", def: "O limite do que entra ou não entra na primeira versão." },
  { termo: "Versão futura", def: "Algo que pode ser feito depois, quando o MVP já estiver validado." },
];

const CHECKLIST_ITEMS = [
  "Defini o MVP do meu app",
  "Cortei funcionalidades extras",
  "Tenho no máximo 5 funcionalidades principais",
  "Listei as telas necessárias",
  "Defini quais dados precisam ser salvos",
  "Escrevi as regras principais",
  "Tenho um prompt de arquitetura claro",
];

const CHECKLIST_PREFIX = "mvp_step__";

function etapaTitle(e: Etapa) {
  return e.n === 5 ? "Arquitetura pronta para o Lovable" : e.title;
}

function etapaDescription(e: Etapa) {
  if (e.n === 5) {
    return "Comando consolidado para construir a primeira versão funcional do app com base em MVP, telas, dados e regras definidos acima.";
  }
  if (e.n === 2) {
    return "Escolha até 5 funcionalidades principais agora. As demais ficam nas próximas versões.";
  }
  return `Etapa ${e.n} do desenho de MVP e arquitetura.`;
}

export function MvpArquiteturaModule({ goTo }: { goTo?: (id: string) => void } = {}) {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();
  const [appStage, setAppStage] = useState<AppStage>(() => readStoredStage());

  useEffect(() => {
    try {
      window.localStorage.setItem(APP_STAGE_STORAGE_KEY, appStage);
    } catch {
      /* noop */
    }
  }, [appStage]);

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
          <Workflow size={12} /> MVP e Arquitetura
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Desenhe o MVP e a arquitetura do app
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Agora você vai transformar o plano do app em uma estrutura simples, com telas,
          funcionalidades, dados e regras essenciais.
        </p>
        <p className="text-xs text-muted-foreground/90 max-w-3xl mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          Em cada etapa, use os três caminhos do card: implementar direto no Lovable, revisar com o Agente primeiro, ou copiar uma auditoria para o Lovable analisar sem alterar nada.
        </p>
        <p className="text-xs text-amber-200/90 max-w-3xl mt-2 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] px-3 py-2">
          <strong className="text-amber-200">Regra da primeira versão:</strong> até 5 funcionalidades principais agora. As demais entram nas próximas versões, no módulo Melhorias e Versões.
        </p>
      </header>

      {!activeProject && (
        <GlassCard className="p-5 md:p-6 mb-6 border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-accent/[0.05] to-transparent">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                Escolha um app antes de desenhar o MVP
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Para definir MVP, telas, funcionalidades e dados com precisão, primeiro selecione ou crie o app em foco.
                Assim os comandos ficam conectados ao problema, público e promessa do seu projeto.
              </p>
              <p className="text-xs text-muted-foreground/90 mt-2">
                Já tem um app? Use esta etapa como auditoria da estrutura atual antes de evoluir.
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
                onClick={() => goTo("planejar")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15 text-sm font-semibold transition"
              >
                Voltar para Planejar
              </button>
            )}
            {goTo && (
              <button
                onClick={() => goTo("ideias")}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-white/10 bg-white/5 text-foreground/80 hover:bg-white/10 text-sm font-medium transition"
              >
                Ver ideias prontas
              </button>
            )}
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              Você não está criando um app limitado. Está criando a primeira versão funcional e publicável do seu app completo, que continua evoluindo nas próximas versões.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              O MVP é o <strong className="text-foreground/95">quê</strong>: as funcionalidades essenciais da primeira versão funcional.
              A arquitetura é o <strong className="text-foreground/95">como</strong>: as telas, os dados e as regras que sustentam essas funcionalidades.
            </p>
            <p className="text-xs text-amber-200/90 leading-relaxed rounded-md border border-amber-400/30 bg-amber-400/[0.08] px-3 py-2 mt-2">
              <strong>Comece com até 5 funcionalidades principais.</strong> As demais não são descartadas — entram nas próximas versões. Um MVP não é o app dos sonhos: é a primeira versão funcional e publicável.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai sair do planejamento e criar a arquitetura inicial do app:
          quais telas existirão, quais funcionalidades são essenciais, quais dados precisam
          ser salvos e quais regras o Lovable deve seguir.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Defina o MVP.",
            "Escolha no máximo 5 funcionalidades principais.",
            "Liste as telas necessárias.",
            "Defina os dados que o app precisa guardar.",
            "Escreva as regras principais do app.",
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
            <Bot size={14} /> Não sei desenhar meu MVP
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Cada card abaixo oferece os três caminhos do padrão da Fábrica: <strong className="text-foreground/90">Implementar no Lovable</strong>, <strong className="text-foreground/90">Revisar com o Agente primeiro</strong> e <strong className="text-foreground/90">Copiar auditoria para o Lovable</strong> (somente análise, não implementa).
      </p>

      <GlassCard
        className="p-5 mb-6"
        aria-labelledby="mvp-stage-selector-title"
      >
        <h2
          id="mvp-stage-selector-title"
          className="font-heading font-semibold text-base md:text-lg mb-1"
        >
          Qual é o momento do seu app?
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Escolha onde você está agora. Os comandos das próximas etapas se adaptam ao seu momento.
        </p>
        <div
          role="radiogroup"
          aria-labelledby="mvp-stage-selector-title"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
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
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${
                      active
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "bg-white/5 border-white/10 text-muted-foreground"
                    }`}
                  >
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
                <p className="text-xs text-muted-foreground leading-snug">
                  {opt.description}
                </p>
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

      <div className="space-y-5 mb-8">
        {ETAPAS.map((e) => (
          <CommandCard
            key={`${e.n}-${appStage}`}
            number={e.n}
            title={etapaTitle(e)}
            description={etapaDescription(e)}
            whenToUse={`Use nesta etapa: ${e.title}.`}
            whereToPaste="Cole no chat do seu projeto no Lovable."
            expectedResult={e.tabs.avancar}
            commandText={withStage(appStage, e.tabs.lovable)}
            completedKey={`mvp_cmd__${e.n}__${appStage}`}
            moduleId="mvp"
            objective={e.title}
            agentPrompt={withStage(appStage, e.tabs.agente)}
            correctionPrompt={withStage(appStage, e.tabs.corrigir)}
            advanceCriteria={e.tabs.avancar}
            defaultOpen
          />
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
          <h3 className="font-heading font-semibold text-base">Revisão da etapa</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Só avance quando a primeira versão funcional estiver clara e construível. Extras devem estar listados para próximas versões.
        </p>
        <ul className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => {
            const key = `${CHECKLIST_PREFIX}${item}`;
            const done = !!checklist[key];
            const highlight = item === "Cortei funcionalidades extras";
            return (
              <li key={item}>
                <label
                  className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    highlight
                      ? "border-amber-400/30 bg-amber-400/[0.06] hover:bg-amber-400/[0.1]"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
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
          Quando todos os itens estiverem marcados, esta etapa será considerada concluída na sua jornada.
        </p>
      </GlassCard>

      <div className="mt-6">
        <AgentArchitectCard
          variant="compact"
          title="Quer revisar antes de seguir?"
          subtitle="Use o Agente Arquiteto para validar se seu MVP está simples, vendável e pronto para construir."
          ctaLabel="Revisar checklist com o Agente Arquiteto"
        />
      </div>
    </section>
  );
}
