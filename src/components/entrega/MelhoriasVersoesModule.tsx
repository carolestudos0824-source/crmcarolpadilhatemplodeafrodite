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
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo no Lovable e já tenho métricas, testes ou feedbacks. Me ajude a decidir o que melhorar primeiro. Quero separar bugs, melhorias, ideias futuras, ajustes de venda, ajustes de mobile, ajustes de checkout e mudanças de experiência do usuário. Quero melhorar sem quebrar o que já funciona.`;

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
        "Crie uma estrutura simples para organizar feedbacks e métricas do meu app. Separe em: elogios, dúvidas, travas, bugs, abandono, pedidos de melhoria e ideias futuras. Não altere o app ainda, apenas organize os sinais.",
      agente:
        "Me ajude a analisar feedbacks e métricas do meu app. Quero separar opinião, elogio, sinal real, bug, dúvida frequente e oportunidade de melhoria.",
      corrigir:
        "Meus feedbacks estão confusos e não sei o que fazer primeiro. Organize em uma lista priorizada e diga o que é urgente, importante ou futuro.",
      avancar:
        "Avance quando os sinais estiverem organizados e você souber quais problemas realmente importam.",
    },
  },
  {
    n: 2,
    icon: SplitSquareHorizontal,
    title: "Separar bug de melhoria",
    tabs: {
      lovable:
        "Revise a lista de problemas do meu app e separe o que é bug, melhoria, ajuste visual, ajuste comercial, ajuste de mobile, ajuste de checkout e ideia futura. Não aplique mudanças ainda.",
      agente:
        "Me ajude a entender a diferença entre bug, melhoria e ideia futura no meu app. Quero saber o que preciso corrigir agora e o que pode esperar.",
      corrigir:
        "Estou tratando tudo como urgente. Separe o que realmente quebra o app do que é apenas melhoria desejável.",
      avancar:
        "Avance quando estiver claro o que é erro crítico e o que é melhoria não urgente.",
    },
  },
  {
    n: 3,
    icon: ListOrdered,
    title: "Priorizar a próxima versão",
    tabs: {
      lovable:
        "Crie um plano de próxima versão para meu app. Priorize no máximo 5 mudanças com base em impacto na venda, uso, entrega, confiança, checkout, login, mobile ou clareza da experiência.",
      agente:
        "Me ajude a decidir quais melhorias entram na próxima versão do meu app. Quero escolher poucas mudanças com maior impacto e evitar refazer tudo.",
      corrigir:
        "A lista de melhorias está grande demais. Reduza para no máximo 5 prioridades e explique o motivo de cada uma.",
      avancar:
        "Avance quando a próxima versão tiver poucas mudanças claras e importantes.",
    },
  },
  {
    n: 4,
    icon: ShieldCheck,
    title: "Aplicar melhorias com segurança",
    tabs: {
      lovable:
        "Aplique as melhorias priorizadas da próxima versão do meu app com segurança. Preserve o que já funciona, não altere banco, autenticação, checkout ou integrações sensíveis sem necessidade, e mantenha a identidade visual existente.",
      agente:
        "Me ajude a transformar minha lista de melhorias em um comando seguro para o Lovable. Quero melhorar sem quebrar funcionalidades existentes.",
      corrigir:
        "As melhorias aplicadas quebraram algo que funcionava. Compare o antes e depois, preserve funcionalidades importantes e corrija apenas o que foi afetado.",
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
        "Crie um pequeno registro da nova versão do meu app. Inclua o que mudou, por que mudou, o que foi corrigido, o que ainda ficou para depois e quais testes precisam ser repetidos antes de divulgar novamente.",
      agente:
        "Me ajude a criar um changelog simples da nova versão do meu app e um checklist de reteste antes de divulgar.",
      corrigir:
        "Fiz mudanças no app, mas não sei o que mudou. Organize um registro simples da versão atual e liste os testes finais necessários.",
      avancar:
        "Avance quando a nova versão estiver documentada, testada e pronta para nova divulgação.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Versão", def: "Uma nova etapa do app com melhorias ou correções aplicadas." },
  { termo: "Bug", def: "Erro que impede algo de funcionar corretamente." },
  { termo: "Melhoria", def: "Ajuste que torna o app mais claro, útil, bonito, rápido ou fácil de usar." },
  { termo: "Backlog", def: "Lista organizada de coisas para corrigir ou melhorar no futuro." },
  { termo: "Prioridade", def: "O que deve ser resolvido primeiro porque afeta uso, venda ou entrega." },
  { termo: "Changelog", def: "Registro simples do que mudou em cada versão." },
  { termo: "Dívida técnica", def: "Parte do app que funciona, mas precisa ser organizada melhor no futuro." },
  { termo: "Iteração", def: "Ciclo de testar, aprender, melhorar e testar novamente." },
];

const CHECKLIST_ITEMS = [
  "Organizei feedbacks e métricas",
  "Separei elogios de sinais reais",
  "Separei bug de melhoria",
  "Listei ideias futuras",
  "Priorizei no máximo 5 mudanças",
  "Criei plano da próxima versão",
  "Apliquei melhorias com segurança",
  "Preservei o que já funcionava",
  "Registrei o que mudou",
  "Testei novamente antes de divulgar",
];

const TAB_META: { id: TabId; label: string; icon: typeof GitBranch }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "melhorias_step__";

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

      {tab === "avancar" ? (
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <pre className="text-[13px] whitespace-pre-wrap font-mono text-foreground/90 leading-relaxed">
            {etapa.tabs[tab]}
          </pre>
        </div>
      ) : (
        <EditablePromptBox
          key={`${etapa.n}-${tab}`}
          originalPrompt={etapa.tabs[tab]}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          transformOnCopy={tab === "agente" ? undefined : wrapLovable}
          copyLabel={
            tab === "agente"
              ? "Copiar para o Agente"
              : tab === "corrigir"
              ? "Copiar correção"
              : "Copiar comando"
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
          Depois de medir e validar, você precisa transformar feedback em melhorias reais,
          sem refazer o app inteiro.
        </p>
      </header>

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
          Nesta etapa, você vai organizar feedbacks, separar bug de melhoria, priorizar o
          que importa, criar uma nova versão do app e testar antes de publicar de novo.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Reúna métricas e feedbacks.",
            "Separe erro, melhoria e ideia futura.",
            "Priorize o que afeta venda, uso ou entrega.",
            "Crie uma nova versão do app.",
            "Teste antes de publicar novamente.",
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
