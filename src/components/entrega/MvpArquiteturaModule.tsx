import { useState } from "react";
import { toast } from "sonner";
import {
  Workflow,
  Boxes,
  ListChecks,
  Layout,
  Database,
  FileCode,
  HelpCircle,
  Bot,
  Wrench,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
  Pencil,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  CopyCommandWarning,
  wrapLovable,
} from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { PromptEditDialog } from "@/components/entrega/PromptEditDialog";


const AGENT_HELP_PROMPT = `Estou criando um aplicativo do zero com IA. Já tenho uma ideia inicial e preciso transformar isso em um MVP simples. Me ajude a definir: quais funcionalidades entram na primeira versão, quais telas o app precisa ter, quais dados precisam ser salvos, quais regras o app deve seguir e o que deve ficar para uma versão futura.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof Workflow;
  title: string;
  tabs: Record<TabId, string>;
};

const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: Boxes,
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
    icon: ListChecks,
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
    icon: Layout,
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
    icon: Database,
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
    icon: FileCode,
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

const TAB_META: { id: TabId; label: string; icon: typeof Workflow }[] = [
  { id: "lovable", label: "Fazer no Lovable", icon: Wrench },
  { id: "agente", label: "Pensar com o Agente", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "mvp_step__";

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
  const [editOpen, setEditOpen] = useState(false);
  const Icon = etapa.icon;
  const currentPrompt = etapa.tabs[tab];
  const promptForCopy = tab === "agente" ? currentPrompt : wrapLovable(currentPrompt);
  const promptForEditor = tab === "agente" ? currentPrompt : wrapLovable(currentPrompt);
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
          
        />
      )}

      <PromptEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        stepName={etapa.title}
        originalPrompt={promptForEditor}
        storageKey={`mvp_prompt_edit__${etapa.n}__${tab}`}
      />
    </GlassCard>
  );
}



export function MvpArquiteturaModule() {
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
          Em cada etapa, você pode copiar o comando direto ou revisar o prompt antes de colar no chat do seu projeto no Lovable.
        </p>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              Um MVP não é o app dos sonhos. É a primeira versão simples, clara e testável.
              Aqui você vai decidir o que entra agora, como o app se organiza e o que deve
              ficar para depois.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              O MVP é o <strong className="text-foreground/95">quê</strong>: quais funcionalidades entram na primeira versão.
              A arquitetura é o <strong className="text-foreground/95">como</strong>: as telas, os dados e as regras que sustentam essas funcionalidades.
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
