import { useState } from "react";
import { toast } from "sonner";
import {
  GitBranch,
  Inbox,
  SplitSquareHorizontal,
  ListOrdered,
  ShieldCheck,
  FileText,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
  Globe,
  Smartphone,
  Store,
  Rocket,
  Layers,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { useProjectContext } from "@/hooks/useProjectContext";
import { ResumoMelhoriasCard } from "@/components/entrega/ResumoMelhoriasCard";
import { PromptsExecutarEtapa } from "@/components/entrega/PromptsExecutarEtapa";
import { PROMPTS_MELHORIAS } from "@/data/promptsPosAppPronto";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e já tenho métricas, testes ou feedbacks. Me ajude a decidir o que melhorar primeiro: bug crítico, ajuste pequeno, melhoria de conversão, melhoria de experiência, melhoria visual, nova funcionalidade ou versão maior. Quero priorizar com impacto, esforço, risco e evidência, sem quebrar o que já funciona em login, checkout, entrega ou dados.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof GitBranch;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Inbox,
    title: "Organizar feedbacks e métricas",
    tabs: {
      lovable:
        "Organize feedbacks e métricas do app [nome do app ativo], que é [descreva o app] para [descreva o público] e resolve [descreva a dor], com a promessa de [promessa]. Para cada item, registre: métrica principal, feedback do usuário, objeção, bug relatado, print ou exemplo, etapa do funil afetada, impacto no usuário, impacto em venda ou conversão, urgência e frequência. Não altere o app nesta etapa — apenas organize os sinais.",
      agente:
        "Me ajude a organizar feedbacks e métricas do app [nome do app ativo] ([descreva o app]) para [descreva o público]. Quero separar opinião, elogio, sinal real, bug, dúvida frequente, objeção e oportunidade de melhoria, e marcar etapa do funil, impacto, urgência e frequência.",
      corrigir:
        "Meus feedbacks do app [nome do app ativo] estão confusos. Organize em uma lista priorizada por impacto e urgência, separando bug, objeção e melhoria, e indicando a etapa do funil afetada.",
      avancar:
        "Avance quando os sinais estiverem organizados por etapa do funil, impacto e urgência.",
    },
  },
  {
    n: 2,
    icon: SplitSquareHorizontal,
    title: "Separar bug de melhoria",
    tabs: {
      lovable:
        "Revise a lista de problemas do app [nome do app ativo] e classifique cada item em: bug crítico, bug menor, melhoria de clareza, melhoria de conversão, melhoria visual, melhoria de usabilidade, nova funcionalidade ou pedido para backlog. Indique o risco de mexer agora em cada item, considerando que o público é [descreva o público] e a promessa é [promessa]. Não aplique mudanças nesta etapa.",
      agente:
        "Me ajude a separar bug de melhoria no app [nome do app ativo]. Quero distinguir bug crítico, bug menor, melhoria de clareza, conversão, visual, usabilidade, nova funcionalidade e pedido para backlog — e entender o risco de mexer agora em cada um.",
      corrigir:
        "Estou tratando tudo como urgente no app [nome do app ativo]. Separe o que realmente quebra o app do que é apenas melhoria desejável, e indique o risco de cada mudança.",
      avancar:
        "Avance quando estiver claro o que é bug crítico, melhoria e o que vai para backlog.",
    },
  },
  {
    n: 3,
    icon: ListOrdered,
    title: "Priorizar a próxima versão",
    tabs: {
      lovable:
        "Crie o plano da próxima versão do app [nome do app ativo], focando em [ação principal] e na promessa de [promessa]. Para cada candidato, avalie: impacto, esforço, risco, evidência (métrica ou feedback), urgência, dependências, o que preservar e o que testar depois. Escolha no máximo 5 mudanças, indique a versão sugerida (ex.: v1.1, v1.2, v1.3, v2.0) e a justificativa de cada prioridade.",
      agente:
        "Me ajude a priorizar a próxima versão do app [nome do app ativo]. Quero escolher poucas mudanças com base em impacto, esforço, risco, evidência, urgência e dependências, indicando o que preservar e o que testar depois.",
      corrigir:
        "A lista de melhorias do app [nome do app ativo] está grande demais. Reduza para no máximo 5 prioridades com impacto, esforço e risco claros, e explique a justificativa.",
      avancar:
        "Avance quando a próxima versão tiver poucas mudanças claras, com impacto e risco avaliados.",
    },
  },
  {
    n: 4,
    icon: ShieldCheck,
    title: "Aplicar melhoria com segurança",
    tabs: {
      lovable:
        "Aplique as melhorias priorizadas da próxima versão do app [nome do app ativo] com segurança. Faça uma mudança por vez. Preserve login, banco, checkout, área paga, admin e dados do usuário. Não altere fluxos já aprovados sem necessidade. Teste antes de concluir e devolva um resumo do que mudou, o que foi preservado e o que precisa ser testado.",
      agente:
        "Me ajude a transformar minha lista de melhorias do app [nome do app ativo] em um comando seguro para o Lovable, preservando login, banco, checkout, área paga e admin, e aplicando uma mudança por vez.",
      corrigir:
        "As melhorias aplicadas no app [nome do app ativo] quebraram algo que funcionava. Compare antes e depois, preserve o que estava certo e corrija apenas o que foi afetado.",
      avancar:
        "Avance quando as melhorias principais tiverem sido aplicadas sem quebrar fluxo, login, checkout, entrega ou mobile.",
    },
  },
  {
    n: 5,
    icon: FileText,
    title: "Registrar versão e testar novamente",
    tabs: {
      lovable:
        "Crie o registro da nova versão do app [nome do app ativo] incluindo: número da versão, data, mudança feita, motivo da mudança, métrica esperada, risco, o que testar, resultado do teste, próximo passo e plano de rollback ou correção caso algo quebre. Não prometa melhoria, conversão ou vendas garantidas.",
      agente:
        "Me ajude a registrar a nova versão do app [nome do app ativo] com número da versão, data, mudança, motivo, métrica esperada, risco, plano de teste e rollback se algo quebrar.",
      corrigir:
        "Fiz mudanças no app [nome do app ativo], mas não sei o que mudou. Organize um registro simples com versão, motivo, métrica esperada, risco e plano de rollback.",
      avancar:
        "Avance quando a nova versão estiver documentada, testada e com plano de rollback definido.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Versão", def: "Uma nova entrega do app com mudanças aplicadas (ex.: v1.1, v1.2, v2.0)." },
  { termo: "Bug", def: "Erro que faz algo do app funcionar diferente do esperado." },
  { termo: "Bug crítico", def: "Erro que quebra login, checkout, entrega, pagamento ou bloqueia a ação principal." },
  { termo: "Melhoria", def: "Ajuste que torna o app mais claro, útil, bonito, rápido ou fácil de usar." },
  { termo: "Backlog", def: "Lista organizada do que será feito depois, sem entrar na versão atual." },
  { termo: "Prioridade", def: "O que deve ser resolvido primeiro porque tem mais impacto ou urgência." },
  { termo: "Impacto", def: "Quanto a mudança afeta uso, venda, entrega ou confiança." },
  { termo: "Esforço", def: "Quanto trabalho a mudança exige." },
  { termo: "Risco", def: "Chance de a mudança quebrar algo que já funciona." },
  { termo: "Changelog", def: "Registro simples do que mudou em cada versão." },
  { termo: "Rollback", def: "Voltar o app para uma versão anterior quando a nova quebra algo." },
  { termo: "Dívida técnica", def: "Parte do app que funciona mas precisa ser organizada melhor depois." },
  { termo: "Regressão", def: "Quando uma mudança nova quebra algo que antes funcionava." },
  { termo: "Escopo", def: "O que entra e o que não entra na versão atual." },
  { termo: "MVP", def: "Versão mínima funcional do app, com o essencial para testar interesse real." },
  { termo: "Versão maior", def: "Mudança grande de funcionalidade, fluxo ou modelo — feita só após validação." },
];

const CHECKLIST_ITEMS = [
  "Organizei feedbacks e métricas",
  "Separei bug de melhoria",
  "Identifiquei o maior gargalo",
  "Escolhi uma melhoria principal",
  "Defini impacto, esforço e risco",
  "Preservei login, banco, checkout e entrega",
  "Criei plano da próxima versão",
  "Limitei escopo da versão",
  "Apliquei uma mudança por vez",
  "Testei antes de concluir",
  "Registrei o que mudou",
  "Registrei o motivo da mudança",
  "Defini o que medir depois",
  "Tenho plano de correção se algo quebrar",
];

const TAB_META: { id: TabId; label: string; icon: typeof GitBranch }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente Arquiteto primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "melhorias_step__";

const RAW_MELHORIAS_PLACEHOLDER =
  /\[(?:nome do app(?:\s+ativo|\s+selecionado|\s+atual)?|descreva(?:\s+o\s+app|\s+o\s+público|\s+a\s+dor)?|promessa|produto(?:\s+ou\s+serviço)?|modelo de cobrança|ação principal|informe|preencha|público|problema)\]|Aplicativo X/i;

// Frases das versões antigas (v1) deste módulo. Quando o contexto está
// preenchido, prompts salvos com essas frases são considerados obsoletos
// e substituídos pela versão contextualizada nova.
const LEGACY_MELHORIAS_PHRASES: RegExp[] = [
  /Crie uma estrutura simples para organizar feedbacks e métricas/i,
  /Analise a lista de problemas do app/i,
  /Crie um plano da próxima versão/i,
  /Aplique a melhoria priorizada/i,
  /Crie um pequeno registro de uma versão do app/i,
];

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

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const { context, isFilled } = useProjectContext();
  const Icon = etapa.icon;
  const resolvedPrompt = applyContextPlaceholders(etapa.tabs[tab], context);
  const invalidateSavedPrompt = isFilled
    ? (saved: string) =>
        RAW_MELHORIAS_PLACEHOLDER.test(saved) ||
        LEGACY_MELHORIAS_PHRASES.some((re) => re.test(saved))
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
          saveSourceModule="melhorias"
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
                    stepName: `Melhorias e Versões — ${etapa.title}`,
                    stepObjective: `Trabalhar a etapa "${etapa.title}" de melhorias do app sem quebrar funcionalidades existentes. Aplicar uma mudança por vez. Não refazer o app inteiro nem alterar login, banco, checkout, área paga, admin ou dados do usuário sem pedido explícito.`,
                    command: text,
                    moduleId: "melhorias",
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

export function MelhoriasVersoesModule() {
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
          <GitBranch size={12} /> Melhorias e Versões
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Melhore sem quebrar o que funciona
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Priorize a próxima versão com base em métricas. Faça uma mudança por
          vez, preserve o que funciona e registre o que mudou.
        </p>
      </header>

      <ResumoMelhoriasCard />

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Melhorar não é mexer em tudo. Melhorar é olhar dados, ouvir usuários, escolher
            o problema mais importante e criar uma versão melhor com segurança.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai organizar feedbacks e métricas, separar bug de melhoria,
          priorizar a próxima versão, aplicar com segurança e registrar para testar de novo.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Reúna métricas e feedbacks.",
            "Separe bug de melhoria.",
            "Priorize a próxima versão.",
            "Aplique uma mudança por vez.",
            "Registre a versão e teste novamente.",
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
            <Bot size={14} /> Não sei o que melhorar primeiro
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

      <GlassCard className="p-5 md:p-6 mb-6 border-accent/30">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={18} className="text-accent" />
          <span className="text-[11px] uppercase tracking-wider text-accent">
            Seção complementar
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-heading font-bold leading-tight mb-2">
          Evolução do app: web, PWA, loja ou nativo futuro
        </h2>
        <p className="text-sm md:text-base text-foreground/85 leading-relaxed mb-5">
          Depois que seu app está publicado, a próxima decisão não é fazer tudo de
          uma vez. O caminho mais seguro é evoluir por versões: primeiro validar,
          depois melhorar, depois pensar em instalação, loja ou versão nativa —
          se isso fizer sentido para o projeto.
        </p>

        <div className="grid md:grid-cols-2 gap-3 mb-5">
          {[
            {
              icon: Globe,
              tag: "Versão 1",
              title: "Web app publicado",
              text: "A primeira versão pode começar como web app com domínio. É o caminho mais simples para testar a ideia, mostrar para pessoas reais, vender, receber feedback e corrigir o que for necessário.",
            },
            {
              icon: Sparkles,
              tag: "Versão 2",
              title: "Melhoria com feedback real",
              text: "Antes de transformar em PWA ou loja, observe o uso real. Veja onde as pessoas travam, quais telas precisam melhorar, quais funcionalidades faltam e quais partes não estão sendo usadas.",
            },
            {
              icon: Smartphone,
              tag: "Versão 3",
              title: "PWA instalável",
              text: "Depois que o app já estiver funcionando bem no celular, pode fazer sentido preparar uma versão PWA, com experiência mais próxima de app instalado. Um passo intermediário antes de pensar em loja.",
            },
            {
              icon: Store,
              tag: "Versão 4",
              title: "Preparação para Google Play ou App Store",
              text: "A publicação em loja pode fazer sentido quando o app já foi validado, tem pessoas reais usando, boa experiência mobile, suporte, política de privacidade e uma razão clara para estar como app instalado.",
            },
            {
              icon: Rocket,
              tag: "Versão futura",
              title: "App nativo",
              text: "Uma versão nativa pode ser considerada quando o app já tiver maturidade, demanda real, receita, necessidade de recursos avançados do celular ou uma estratégia mais robusta. Não é o primeiro passo para a maioria dos projetos.",
            },
          ].map((v) => {
            const VIcon = v.icon;
            return (
              <div
                key={v.tag}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                    <VIcon size={15} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-accent/80 font-semibold">
                    {v.tag}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-sm md:text-base mb-1.5">
                  {v.title}
                </h4>
                <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                  {v.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={15} className="text-sky-300" />
            <h4 className="font-heading font-semibold text-sm md:text-base text-sky-100">
              Quando evoluir para o próximo nível?
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs md:text-sm text-foreground/85">
            <li>• Evolua para PWA quando o app já funciona bem no celular e as pessoas precisam acessar com frequência.</li>
            <li>• Pense em Google Play ou App Store quando já houver validação, pessoas reais usando e motivo claro para estar em loja.</li>
            <li>• Considere nativo apenas quando houver necessidade real de recursos avançados, performance específica ou escala.</li>
            <li>• Continue como web app se o projeto ainda está em validação, sem pessoas reais usando ou com ajustes importantes pendentes.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={15} className="text-amber-300" />
            <h4 className="font-heading font-semibold text-sm text-amber-100">
              Cuidado com a evolução por vaidade
            </h4>
          </div>
          <p className="text-xs md:text-sm text-foreground/85 leading-relaxed">
            Estar na App Store ou Google Play não garante vendas, downloads ou
            validação. Publicar cedo demais pode gerar custo, retrabalho,
            rejeição, suporte desnecessário e manutenção antes da hora.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 size={15} className="text-emerald-300" />
            <h4 className="font-heading font-semibold text-sm text-emerald-100">
              Recomendação
            </h4>
          </div>
          <p className="text-xs md:text-sm text-foreground/85 leading-relaxed">
            A melhor evolução é aquela que acompanha o momento do app. Primeiro
            publique, teste e valide. Depois melhore a experiência. Só então
            decida se PWA, loja ou nativo fazem sentido.
          </p>
        </div>
      </GlassCard>

      <PromptsExecutarEtapa prompts={PROMPTS_MELHORIAS} />

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
          <h3 className="font-heading font-semibold text-base">Antes de avançar, decida com critério</h3>
        </div>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li>• Avance se você sabe exatamente o que melhorar e por quê.</li>
          <li>• Não avance se você quer refazer tudo sem dados.</li>
          <li>• Não avance se a melhoria mexe em login, checkout, entrega ou banco sem plano de teste.</li>
          <li>• Coloque no backlog tudo que não for prioridade agora.</li>
        </ul>
      </GlassCard>

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
    </section>
  );
}
