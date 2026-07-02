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
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { useProjectContext } from "@/hooks/useProjectContext";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { ResumoMetricasCard } from "@/components/entrega/ResumoMetricasCard";
import { ChecklistDisclosure } from "@/components/entrega/ChecklistDisclosure";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso definir as métricas principais do meu app. Me ajude a escolher quais números acompanhar: visitas, cliques, início do fluxo, conclusão, CTA, lead, checkout, compra, entrega, abandono, suporte, objeções e custo por resultado quando houver tráfego pago. Quero métricas simples para tomar decisões reais sem me perder em números inúteis.`;

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
        "Revise o app [nome do app ativo], que é [descreva o app] para [descreva o público] e resolve [descreva a dor], com a promessa de [promessa]. Identifique qual é a ação principal que prova que a pessoa entendeu e avançou: pode ser [ação principal], cadastro, compra de [produto] ou conclusão de etapa. Defina o evento principal, o sucesso mínimo e o que conta como conversão. Separe claramente ação de visitante, lead, comprador e usuário ativo. Não instale analytics, pixel ou tag externa nesta tarefa.",
      agente:
        "Me ajude a decidir qual é a ação principal do meu app [nome do app ativo] ([descreva o app]) para [descreva o público]. Quero saber qual comportamento prova que o usuário realmente avançou, qual evento principal acompanhar e o que conta como conversão real, separando visitante, lead, comprador e usuário ativo.",
      corrigir:
        "Meu app [nome do app ativo] tem muitas ações competindo entre si. Revise o fluzo de [descreva o app] para [descreva o público] e ajude a definir uma ação principal clara — provavelmente próxima de [ação principal] — para acompanhar como métrica.",
      avancar:
        "Avance quando estiver claro qual ação prova que o app está funcionando para [descreva o público].",
    },
  },
  {
    n: 2,
    icon: ListChecks,
    title: "Escolher métricas essenciais",
    tabs: {
      lovable:
        "Crie uma lista simples de métricas essenciais para acompanhar o app [nome do app ativo], que vende [produto] no modelo [modelo de cobrança]. Inclua: visitas, cliques, início do fluxo, conclusão do fluxo, clique no CTA, lead, checkout iniciado, compra, entrega acessada, abandono, suporte, objeções e custo por resultado quando houver tráfego pago. Evite métricas de vaidade. Explique em uma linha por que cada métrica importa para [promessa]. Não instale ferramenta externa nem registre dados pessoais sensíveis.",
      agente:
        "Me ajude a escolher poucas métricas importantes para o app [nome do app ativo], focado em [descreva o público] e na promessa de [promessa]. Quero evitar métricas de vaidade e focar em visitas, cliques, início e conclusão do fluxo, CTA, lead, checkout, compra, entrega, abandono, suporte, objeções e custo por resultado se houver mídia paga.",
      corrigir:
        "Minhas métricas para o app [nome do app ativo] estão confusas ou excessivas. Simplifique para no máximo 5 a 7 métricas principais cobrindo visitas, CTA, checkout, compra e entrega, e explique por que cada uma importa.",
      avancar:
        "Avance quando houver uma lista curta de métricas que realmente ajudam a decidir sobre [produto] e [promessa].",
    },
  },
  {
    n: 3,
    icon: Route,
    title: "Mapear o funil",
    tabs: {
      lovable:
        "Mapeie o funil principal do app [nome do app ativo] em etapas simples, do primeiro acesso até a [ação principal]. Inclua: entrada, primeira ação, etapa intermediária, CTA, checkout, compra, entrega, retenção ou retorno e principal ponto de abandono. Considere que o público é [descreva o público] e a dor é [descreva a dor]. Não invente etapas que não existem no app.",
      agente:
        "Me ajude a desenhar o funil do app [nome do app ativo] para [descreva o público]. Quero entender o caminho do visitante até [ação principal], passando por CTA, checkout, compra, entrega e retorno, e onde fica o principal ponto de abandono.",
      corrigir:
        "O funil do app [nome do app ativo] está longo, confuso ou com etapas demais. Simplifique o caminho do usuário até [ação principal] preservando o que já funciona.",
      avancar:
        "Avance quando o caminho do usuário estiver claro do primeiro acesso até a entrega.",
    },
  },
  {
    n: 4,
    icon: AlertTriangle,
    title: "Identificar abandono e erro",
    tabs: {
      lovable:
        "Revise o app [nome do app ativo] e liste possíveis pontos de abandono e erro: abandono em página inicial, abandono em formulário ou quiz, abandono no CTA, abandono no checkout, erro de login, erro de pagamento, erro de entrega, erro mobile, dúvidas repetidas e objeções recorrentes vindas de [descreva o público]. Priorize os 3 pontos mais críticos sem alterar integrações sensíveis sem necessidade.",
      agente:
        "Me ajude a identificar onde as pessoas podem desistir do app [nome do app ativo] (público [descreva o público], dor [descreva a dor]). Quero olhar o fluxo com visão de usuário real, mapeando abandono em página, fluxo, CTA, checkout, login, pagamento, entrega e mobile, além de objeções e dúvidas repetidas.",
      corrigir:
        "O app [nome do app ativo] tem pontos de abandono. Corrija os pontos mais críticos preservando o que já funciona e sem alterar integrações sensíveis sem necessidade.",
      avancar:
        "Avance quando os principais pontos de abandono e erro estiverem identificados e priorizados.",
    },
  },
  {
    n: 5,
    icon: Lightbulb,
    title: "Decidir melhorias com dados",
    tabs: {
      lovable:
        "Crie uma seção simples de orientação para decisões com base nas métricas do app [nome do app ativo]. Para cada cenário, diga o que corrigir primeiro e o que NÃO mexer ainda: (1) se o problema é tráfego, (2) se é criativo, (3) se é oferta, (4) se é página, (5) se é checkout, (6) se é entrega. Indique quando testar de novo após a melhoria e quando seguir para Melhorias e Versões ou escalar campanha. Não prometa crescimento, conversão ou vendas garantidas.",
      agente:
        "Me ajude a interpretar métricas simples do app [nome do app ativo] e decidir o que melhorar primeiro entre tráfego, criativo, oferta, página, checkout ou entrega. Quero evitar mudar tudo por ansiedade e saber quando testar de novo e quando escalar.",
      corrigir:
        "Estou mexendo no app [nome do app ativo] sem saber o que os dados mostram. Crie um plano de decisão simples baseado em comportamento real, indicando o que corrigir primeiro, o que não mexer ainda e quando reavaliar.",
      avancar:
        "Avance quando você souber quais números vai acompanhar, o que melhorar primeiro e quando seguir para Melhorias e Versões.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Métrica", def: "Número usado para acompanhar o desempenho do app." },
  { termo: "Evento", def: "Uma ação importante feita pelo usuário, como clicar em botão, enviar formulário ou acessar uma página." },
  { termo: "Funil", def: "O caminho que o usuário percorre desde a entrada até a ação principal." },
  { termo: "Conversão", def: "Quando uma pessoa realiza a ação desejada, como cadastrar, clicar no CTA, comprar ou acessar a entrega." },
  { termo: "Taxa de conversão", def: "Quantas pessoas converteram dividido por quantas tiveram a chance, em porcentagem." },
  { termo: "Abandono", def: "Quando a pessoa começa uma ação, mas desiste antes de terminar." },
  { termo: "Retenção", def: "Quantas pessoas voltam a usar o app depois da primeira vez." },
  { termo: "Ativação", def: "Momento em que a pessoa percebe valor de verdade — por exemplo, conclui a primeira ação importante." },
  { termo: "CTR", def: "Click-through rate: cliques dividido por impressões, usado em criativos e anúncios." },
  { termo: "Custo por resultado", def: "Quanto custou cada ação medida (clique, lead, compra) quando há tráfego pago." },
  { termo: "Lead", def: "Pessoa que demonstrou interesse e deixou um contato ou iniciou o fluxo." },
  { termo: "Checkout iniciado", def: "Pessoa que chegou na tela de pagamento, mesmo que ainda não tenha comprado." },
  { termo: "Compra concluída", def: "Pagamento aprovado e pedido confirmado." },
  { termo: "Objeção", def: "Motivo que faz a pessoa não avançar: preço, confiança, dúvida, medo, falta de prova." },
  { termo: "Coorte", def: "Grupo de pessoas que entraram na mesma janela de tempo, comparadas entre si para ver evolução." },
  { termo: "Insight", def: "Conclusão útil tirada dos dados — algo que muda decisão, não só observação." },
];

const CHECKLIST_ITEMS = [
  "Defini a ação principal",
  "Defini o evento principal",
  "Escolhi métricas essenciais",
  "Mapeei o funil",
  "Medi visitas",
  "Medi cliques",
  "Medi CTA",
  "Medi leads ou respostas",
  "Medi checkout",
  "Medi compra",
  "Medi entrega",
  "Identifiquei abandono",
  "Identifiquei objeções",
  "Identifiquei erros críticos",
  "Decidi o que melhorar primeiro",
  "Decidi o que não mexer ainda",
  "Vou testar novamente depois da melhoria",
];

const TAB_META: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente Arquiteto primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "metricas_step__";

function CopyBtn({ text, label = "Copiar para implementar no Lovable" }: { text: string; label?: string }) {
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

const RAW_METRICAS_PLACEHOLDER =
  /\[(?:nome do app(?:\s+ativo|\s+selecionado|\s+atual)?|descreva(?:\s+o\s+app|\s+o\s+público|\s+a\s+dor)?|promessa|produto(?:\s+ou\s+serviço)?|modelo de cobrança|ação principal|informe|preencha|público|problema)\]|Aplicativo X/i;

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const { context, isFilled } = useProjectContext();
  const Icon = etapa.icon;
  const resolvedPrompt = applyContextPlaceholders(etapa.tabs[tab], context);
  const invalidateSavedPrompt = isFilled
    ? (saved: string) => RAW_METRICAS_PLACEHOLDER.test(saved)
    : undefined;
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

      {tab === "avancar" ? (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
            {resolvedPrompt}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          saveSourceModule="metricas"
          key={`${etapa.n}-${tab}`}
          originalPrompt={resolvedPrompt}
          shouldInvalidateSavedValue={invalidateSavedPrompt}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Métricas do App — ${etapa.title}`,
                    stepObjective: `Trabalhar a etapa "${etapa.title}" de métricas preservando scripts de analytics, eventos, funis, pixels e tags já configurados. Não instalar ferramenta externa nova sem pedido explícito, não criar eventos no banco sem pedido, não registrar dados pessoais sensíveis e não alterar scripts/tags existentes sem explicar risco.`,
                    command: text,
                    moduleId: "metricas",
                  })
          }
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
              : "Cole no projeto do seu app no Lovable."
          }
        />
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
          Meça o caminho real do usuário antes de mexer no app
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Meça o caminho real do usuário antes de mudar layout, promessa, preço
          ou campanha.
        </p>
      </header>

      <ResumoMetricasCard />

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
          Nesta etapa, você vai definir a ação principal, escolher métricas essenciais,
          mapear o funil, identificar abandono e erro e decidir o que melhorar com base
          em dados simples — sem instalar analytics real nem registrar dados sensíveis.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Defina a ação principal do app.",
            "Escolha as métricas essenciais.",
            "Mapeie o funil do usuário.",
            "Identifique abandono e erros.",
            "Decida o que melhorar primeiro.",
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
        Use a aba <strong className="text-foreground/90">Implementar no Lovable</strong> quando
        quiser aplicar no app. Use a aba{" "}
        <strong className="text-foreground/90">Revisar com o Agente Arquiteto primeiro</strong> quando quiser
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

      <GlassCard className="p-5 mb-6 border-sky-400/30 bg-sky-400/5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-sky-300" />
          <h3 className="font-heading font-semibold text-base">Antes de seguir, decida com critério</h3>
        </div>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li>• Melhore primeiro o ponto com maior abandono ou maior impacto.</li>
          <li>• Não escale campanha se o funil ainda está quebrado.</li>
          <li>• Não refaça tudo sem saber onde as pessoas estão parando.</li>
        </ul>
      </GlassCard>

      <ChecklistDisclosure title="Checklist opcional — Revisão da etapa">
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} className="text-emerald-300" />
          <h3 className="font-heading font-semibold text-base">Revisão da etapa</h3>
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
          Quando todos os itens estiverem marcados, esta etapa será considerada concluída na sua jornada.
        </p>
      </GlassCard>
      </ChecklistDisclosure>
    </section>
  );
}
