import { useState } from "react";
import { toast } from "sonner";
import {
  Scale,
  FileText,
  ShieldCheck,
  LifeBuoy,
  CreditCard,
  BadgeCheck,
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
import { CopyCommandWarning } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { useProjectContext } from "@/hooks/useProjectContext";
import { applyContextPlaceholders, buildLovablePrompt } from "@/lib/promptBuilder";
import { ResumoLegalCard } from "./ResumoLegalCard";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e preciso preparar páginas de confiança antes de divulgar. Me ajude a organizar: termos de uso, política de privacidade, suporte, segurança, entrega, pagamento, acesso, limites da promessa e mensagens claras para reduzir dúvidas dos usuários. Não quero texto jurídico complexo, quero uma estrutura simples, clara e responsável.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Scale;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: FileText,
    title: "Criar termos de uso",
    tabs: {
      lovable:
        "Revise meu app e crie ou melhore uma página de Termos de Uso simples e clara. Ela deve explicar regras de uso, acesso, responsabilidades do usuário, limites do serviço, pagamento, entrega, suporte e condições básicas. Não use juridiquês exagerado e não prometa resultado garantido.",
      agente:
        "Me ajude a estruturar os Termos de Uso do meu app de forma simples, clara e responsável. Quero saber quais tópicos não podem faltar para passar confiança sem ficar complexo demais.",
      corrigir:
        "Minha página de Termos de Uso está confusa, longa ou técnica demais. Reescreva com linguagem simples, organizada por seções e mantendo um tom profissional.",
      avancar:
        "Avance quando o app tiver uma página de Termos de Uso clara, acessível e sem promessa exagerada.",
    },
  },
  {
    n: 2,
    icon: ShieldCheck,
    title: "Criar política de privacidade",
    tabs: {
      lovable:
        "Revise meu app e crie ou melhore uma página de Política de Privacidade simples e clara. Ela deve explicar quais dados podem ser coletados, para que são usados, como o usuário pode entrar em contato e como o app trata informações de login, pagamento, progresso ou formulários, se existirem.",
      agente:
        "Me ajude a pensar quais dados meu app coleta e como explicar isso em uma Política de Privacidade simples, transparente e adequada para usuários reais.",
      corrigir:
        "Minha Política de Privacidade está genérica ou não combina com o app. Revise o texto para refletir melhor login, pagamento, formulários, progresso, suporte e dados do usuário, se existirem.",
      avancar:
        "Avance quando a Política de Privacidade estiver clara, acessível no app e coerente com os dados usados.",
    },
  },
  {
    n: 3,
    icon: CreditCard,
    title: "Explicar pagamento e entrega",
    tabs: {
      lovable:
        "Revise as telas de venda, checkout, obrigado e entrega do meu app. Garanta que o usuário entenda o que compra, como recebe acesso, quanto tempo pode levar, o que fazer se não conseguir entrar e onde pedir suporte. Não altere integrações de pagamento sem necessidade.",
      agente:
        "Me ajude a deixar claro o fluxo de pagamento e entrega do meu app. Quero reduzir dúvidas de compradores sobre acesso, liberação, login, suporte e o que acontece depois da compra.",
      corrigir:
        "O fluxo de pagamento e entrega está gerando dúvida. Reescreva as mensagens da página de venda, checkout, obrigado e entrega para explicar o próximo passo de forma objetiva.",
      avancar:
        "Avance quando o comprador conseguir entender o que acontece antes e depois do pagamento.",
    },
  },
  {
    n: 4,
    icon: LifeBuoy,
    title: "Criar suporte claro",
    tabs: {
      lovable:
        "Revise ou crie uma área de Suporte simples para meu app. Ela deve explicar como pedir ajuda, qual e-mail ou canal usar, problemas comuns de acesso, compra, login, código ou entrega, e o prazo de resposta se houver. Não invente canal que não exista.",
      agente:
        "Me ajude a criar uma página de suporte objetiva para meu app. Quero reduzir mensagens repetidas e orientar o usuário sobre problemas de login, acesso, compra, entrega e dúvidas comuns.",
      corrigir:
        "A página de suporte está fraca ou incompleta. Organize por perguntas frequentes, problemas comuns e canal de contato, usando linguagem simples e direta.",
      avancar:
        "Avance quando o usuário souber onde pedir ajuda e o que fazer em caso de problema.",
    },
  },
  {
    n: 5,
    icon: BadgeCheck,
    title: "Revisar promessa e confiança",
    tabs: {
      lovable:
        "Revise todos os textos principais do meu app, especialmente home, página de venda, checkout, obrigado e entrega. Remova promessas exageradas, garantias irreais ou frases que possam parecer enganosas. Reforce clareza, benefício, segurança, suporte e transparência.",
      agente:
        "Me ajude a revisar a promessa do meu app. Quero vender com força, mas sem prometer resultado garantido, sem exagero e sem gerar desconfiança.",
      corrigir:
        "Os textos do meu app estão exagerados ou pouco confiáveis. Reescreva para manter força comercial, mas com promessa responsável, clareza e confiança.",
      avancar:
        "Avance quando o app vender com clareza, sem promessas irreais e com páginas de confiança acessíveis.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Termos de uso", def: "Página que explica regras de uso do app, responsabilidades, limites e condições." },
  { termo: "Política de privacidade", def: "Página que explica quais dados podem ser coletados e como eles são usados." },
  { termo: "LGPD", def: "Lei brasileira que trata da proteção de dados pessoais." },
  { termo: "Suporte", def: "Canal ou orientação para o usuário pedir ajuda quando tiver problema." },
  { termo: "Promessa responsável", def: "Explicar o benefício do app sem garantir resultado impossível ou enganoso." },
  { termo: "Página de confiança", def: "Página ou seção que reduz medo antes da compra, mostrando segurança, clareza e suporte." },
  { termo: "Entrega", def: "O que o comprador recebe depois de pagar ou acessar o app." },
];

const CHECKLIST_ITEMS = [
  "Criei ou revisei Termos de Uso",
  "Criei ou revisei Política de Privacidade",
  "Expliquei pagamento e entrega",
  "Expliquei como o usuário recebe acesso",
  "Criei ou revisei Suporte",
  "Revisei promessas exageradas",
  "Conferi se não há garantia impossível",
  "Deixei links legais acessíveis",
  "Conferi se o comprador entende o próximo passo",
  "Estou pronta para publicar com mais confiança",
];

const TAB_META: { id: TabId; label: string; icon: typeof Scale }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "legal_step__";

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
  const { context } = useProjectContext();
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

      {tab === "avancar" ? (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
            {etapa.tabs[tab]}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          saveSourceModule="legal"
          key={`${etapa.n}-${tab}`}
          originalPrompt={etapa.tabs[tab]}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={
            tab === "agente"
              ? undefined
              : (text) =>
                  buildLovablePrompt({
                    context,
                    stepName: `Legal e Confiança — ${etapa.title}`,
                    stepObjective: `Trabalhar a etapa "${etapa.title}" de legal/confiança preservando textos legais, termos, política de privacidade, páginas de confiança e dados de empresa já configurados. Não prometer conformidade jurídica perfeita.`,
                    command: text,
                    moduleId: "legal",
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

export function LegalConfiancaModule() {
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
          <Scale size={12} /> Legal e Confiança
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Prepare confiança antes de vender
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Antes de divulgar seu app, revise páginas legais, suporte, privacidade, termos,
          segurança e mensagens de promessa responsável.
        </p>
      </header>

      <GlassCard className="p-5 mb-4 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Confiança vende. Um app sem termos, privacidade, suporte e explicação clara de
            entrega pode gerar medo, abandono e pedidos de ajuda desnecessários. Esta
            etapa ajuda você a preparar uma base profissional antes de levar pessoas reais
            para dentro do app.
          </p>
        </div>
      </GlassCard>

      <p className="text-[11px] text-muted-foreground/80 mb-6 max-w-3xl">
        Este módulo não substitui orientação jurídica. Ele ajuda a organizar páginas e
        mensagens básicas para deixar o app mais claro e confiável.
      </p>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai revisar as páginas de confiança do seu app, criar ou
          melhorar termos de uso, política de privacidade, suporte, segurança, aviso de
          pagamento, entrega e limites da promessa.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Revise termos e privacidade.",
            "Explique pagamento e entrega.",
            "Crie uma página de suporte clara.",
            "Remova promessas exageradas.",
            "Mostre segurança e confiança antes de divulgar.",
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
            <Bot size={14} /> Não sei o que colocar nas páginas legais
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
        <strong className="text-foreground/90">Revisar com o Agente primeiro</strong> quando quiser
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
