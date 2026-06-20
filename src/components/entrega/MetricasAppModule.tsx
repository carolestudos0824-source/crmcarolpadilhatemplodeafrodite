import { useState } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  Target,
  ListChecks,
  Route,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso definir as métricas principais do meu app. Me ajude a escolher quais números acompanhar: visitas, cliques, cadastro, login, checkout, compra, entrega, abandono, erros e comportamento do usuário. Quero métricas simples para tomar decisões reais sem me perder em números inúteis.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof BarChart3;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Target,
    title: "Definir ação principal",
    tabs: {
      lovable:
        "Revise meu app e identifique qual é a ação principal que o usuário deve realizar. Pode ser cadastro, compra, envio de formulário, início de uso, acesso à área restrita ou conclusão de uma etapa. Depois destaque essa ação como métrica principal do app.",
      agente:
        "Me ajude a decidir qual é a ação principal do meu app. Quero saber qual comportamento prova que o usuário realmente entendeu e avançou.",
      corrigir:
        "Meu app tem muitas ações competindo entre si. Revise o fluxo e ajude a definir uma ação principal clara para acompanhar como métrica.",
      avancar:
        "Avance quando estiver claro qual ação prova que o app está funcionando.",
    },
  },
  {
    n: 2,
    icon: ListChecks,
    title: "Escolher métricas essenciais",
    tabs: {
      lovable:
        "Crie uma lista simples de métricas essenciais para acompanhar meu app. Inclua visitas, cliques no CTA principal, cadastros, logins, início de checkout, compras, acesso à entrega, abandono e erros importantes, se fizerem sentido para o app.",
      agente:
        "Me ajude a escolher poucas métricas importantes para meu app. Quero evitar métricas de vaidade e focar nos números que mostram se as pessoas estão usando, comprando ou travando.",
      corrigir:
        "Minhas métricas estão confusas ou excessivas. Simplifique para no máximo 5 métricas principais e explique por que cada uma importa.",
      avancar:
        "Avance quando houver uma lista curta de métricas que realmente ajudam a tomar decisão.",
    },
  },
  {
    n: 3,
    icon: Route,
    title: "Mapear o funil",
    tabs: {
      lovable:
        "Mapeie o funil principal do meu app em etapas simples. Mostre o caminho do usuário desde a entrada até a ação principal, indicando onde ele pode abandonar, travar ou se confundir.",
      agente:
        "Me ajude a desenhar o funil do meu app. Quero entender o caminho do visitante até cadastro, compra, entrega ou uso principal.",
      corrigir:
        "O funil do meu app está longo, confuso ou com etapas demais. Simplifique o caminho do usuário até a ação principal.",
      avancar:
        "Avance quando o caminho do usuário estiver claro do primeiro acesso até a ação principal.",
    },
  },
  {
    n: 4,
    icon: AlertTriangle,
    title: "Identificar abandono e erro",
    tabs: {
      lovable:
        "Revise meu app e liste possíveis pontos de abandono ou erro: botão que não chama ação, página confusa, checkout fraco, login difícil, formulário longo, mobile ruim, falta de suporte ou promessa pouco clara.",
      agente:
        "Me ajude a identificar onde as pessoas podem desistir do meu app. Quero olhar o fluxo com visão de usuário real.",
      corrigir:
        "Meu app tem pontos de abandono. Corrija os pontos mais críticos preservando o que já funciona e sem alterar integrações sensíveis sem necessidade.",
      avancar:
        "Avance quando os principais pontos de abandono estiverem identificados e priorizados.",
    },
  },
  {
    n: 5,
    icon: Lightbulb,
    title: "Decidir melhorias com dados",
    tabs: {
      lovable:
        "Crie uma seção simples de orientação para decisões com base em métricas. Explique quando melhorar a página de venda, quando ajustar CTA, quando revisar checkout, quando corrigir mobile, quando mexer no preço e quando esperar mais dados.",
      agente:
        "Me ajude a interpretar métricas simples do meu app e decidir o que melhorar primeiro. Quero evitar mudar tudo por ansiedade.",
      corrigir:
        "Estou mexendo no app sem saber o que os dados mostram. Crie um plano de decisão simples baseado em comportamento real, não em achismo.",
      avancar:
        "Avance quando você souber quais números vai acompanhar e como eles vão orientar as próximas melhorias.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Métrica", def: "Número usado para acompanhar o desempenho do app." },
  { termo: "Conversão", def: "Quando uma pessoa realiza a ação desejada, como clicar, cadastrar, comprar ou concluir uma etapa." },
  { termo: "Funil", def: "O caminho que o usuário percorre até chegar na ação principal." },
  { termo: "Abandono", def: "Quando a pessoa começa uma ação, mas desiste antes de terminar." },
  { termo: "Evento", def: "Uma ação importante feita pelo usuário, como clicar em botão, enviar formulário ou acessar uma página." },
  { termo: "Métrica de vaidade", def: "Número bonito, mas que não prova que o app está funcionando, como curtidas sem compra ou visitas sem ação." },
  { termo: "Sinal real", def: "Comportamento que mostra interesse verdadeiro, como cadastro, clique no checkout, compra, uso recorrente ou pedido de acesso." },
];

const CHECKLIST_ITEMS = [
  "Defini a ação principal do app",
  "Escolhi minhas métricas essenciais",
  "Evitei métricas de vaidade",
  "Mapeei o funil principal",
  "Identifiquei pontos de abandono",
  "Identifiquei possíveis erros críticos",
  "Sei quando revisar página de venda",
  "Sei quando revisar checkout",
  "Sei quando revisar mobile",
  "Sei tomar decisão sem mexer em tudo por ansiedade",
];

const TAB_META: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "metricas_step__";

function CopyBtn({ text, label = "Copiar comando" }: { text: string; label?: string }) {
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
      {tab !== "avancar" && (
        <div className="flex flex-col gap-1">
          <CopyBtn
            text={tab === "agente" ? etapa.tabs[tab] : wrapLovable(etapa.tabs[tab])}
            label={
              tab === "agente"
                ? "Copiar para o Agente"
                : tab === "corrigir"
                ? "Copiar correção"
                : "Copiar comando"
            }
          />
          <span className="text-[10px] text-muted-foreground/80">
            {tab === "agente"
              ? "Use para pensar antes de aplicar."
              : tab === "corrigir"
              ? "Use quando o Lovable não entregar o resultado esperado."
              : "Cole no projeto do seu app no Lovable."}
          </span>
        </div>
      )}
    </GlassCard>
  );
}

export function MetricasAppModule() {
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
          <BarChart3 size={12} /> Métricas do App
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Entenda os números antes de mexer no app
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Depois de divulgar, você precisa olhar o que as pessoas fazem de verdade: onde
          entram, onde clicam, onde travam e onde desistem.
        </p>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Opinião não é métrica. Elogio não é validação. Antes de mudar layout, preço,
            promessa ou campanha, veja o comportamento real das pessoas dentro do app.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai definir quais números acompanhar, como interpretar visitas,
          cliques, cadastros, compras, erros, abandono e quais decisões tomar com base em
          dados simples.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Defina a ação principal do app.",
            "Escolha as métricas mais importantes.",
            "Acompanhe onde as pessoas param.",
            "Separe vaidade de sinal real.",
            "Decida melhorias com base nos números.",
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
            <Bot size={14} /> Não sei quais métricas acompanhar
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
        </div>
      </GlassCard>

      <CopyCommandWarning />
      <p className="text-xs text-muted-foreground mb-4">
        Use a aba <strong className="text-foreground/90">Fazer no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Pensar com o Agente</strong> quando quiser
        ajuda para decidir antes de construir.
      </p>

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
