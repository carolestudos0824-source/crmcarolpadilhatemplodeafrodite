import { useState } from "react";
import { toast } from "sonner";
import {
  Map as MapIcon,
  PanelTop,
  Route,
  LayoutTemplate,
  MousePointerClick,
  ShieldCheck,
  Workflow,
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
import { LOVABLE_AUDIT_PROMPT } from "@/components/entrega/CopyCommandWarning";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { buildLovablePrompt } from "@/lib/promptBuilder";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useAppProjects } from "@/hooks/useAppProjects";
import { FolderKanban } from "lucide-react";

const AGENT_HELP_PROMPT = `Estou criando um aplicativo do zero com IA e preciso organizar as telas e o fluxo do usuário. Me ajude a definir: primeira tela, telas públicas, telas restritas, ação principal, formulários, resultado, pagamento, entrega e caminho ideal para o usuário não se perder.`;

type TabId = "lovable" | "agente" | "corrigir" | "avancar";

type Etapa = {
  n: number;
  icon: typeof MapIcon;
  title: string;
  tabs: Record<TabId, string>;
};


const ETAPAS: Etapa[] = [
  {
    n: 1,
    icon: PanelTop,
    title: "Mapear as telas principais",
    tabs: {
      lovable:
        `Liste as telas principais do meu app. Para cada tela, explique: nome da tela, objetivo, o que o usuário vê, qual ação ele realiza e para onde ele vai depois. Mantenha apenas as telas necessárias para a primeira versão.`,
      agente:
        "Me ajude a mapear as telas essenciais do meu app. Quero saber quais telas preciso para o usuário entrar, entender a proposta, realizar a ação principal e receber o resultado.",
      corrigir:
        "O Lovable criou telas demais. Reduza para as telas indispensáveis da primeira versão e explique a função de cada uma.",
      avancar:
        "Avance quando você souber quais telas existem e qual função cada uma cumpre.",
    },
  },
  {
    n: 2,
    icon: Route,
    title: "Definir o fluxo do usuário",
    tabs: {
      lovable:
        `Crie um fluxo simples do usuário dentro do meu app. Mostre o caminho passo a passo desde a primeira tela até o resultado final, incluindo login, formulário, pagamento ou entrega apenas se forem necessários.`,
      agente:
        "Me ajude a desenhar o caminho do usuário dentro do app. Quero um fluxo simples, sem etapas desnecessárias, com início, ação principal e resultado claro.",
      corrigir:
        "O Lovable criou um fluxo confuso. Reorganize o caminho do usuário em uma sequência simples e direta.",
      avancar:
        "Avance quando o caminho do usuário estiver claro do início ao fim.",
    },
  },
  {
    n: 3,
    icon: ShieldCheck,
    title: "Organizar telas públicas e restritas",
    tabs: {
      lovable:
        `Separe as telas do meu app em públicas e restritas. Telas públicas podem ser vistas por visitantes. Telas restritas exigem login, compra, código ou acesso liberado. Explique o motivo de cada separação.`,
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
    icon: MousePointerClick,
    title: "Definir CTA e próximo passo",
    tabs: {
      lovable: `Revise cada tela do meu app e defina um CTA principal para cada uma. O usuário deve saber exatamente qual botão clicar e o que acontece depois.

Para cada tela, entregue:

1. Nome da tela.
2. Objetivo da tela.
3. CTA principal recomendado.
4. Texto do botão.
5. O que acontece depois do clique.
6. Se existem botões demais, simplifique.

Importante:
Não crie CTAs genéricos.
Não coloque muitos botões competindo entre si.
Não prometa resultado garantido.
Não altere autenticação, pagamento, banco ou regras sensíveis sem necessidade.`,
      agente:
        "Me ajude a definir o CTA principal de cada tela do meu app. Quero evitar botões demais e deixar o próximo passo óbvio para o usuário.",
      corrigir:
        "O Lovable criou botões demais ou CTAs confusos. Simplifique cada tela para ter um próximo passo principal.",
      avancar: "Avance quando cada tela tiver um próximo passo claro.",
    },
  },
  {
    n: 5,
    icon: LayoutTemplate,
    title: "Criar mapa final de fluxo",
    tabs: {
      lovable:
        `Crie um mapa final do fluxo do meu app com: telas públicas, telas restritas, ordem de navegação, CTA principal de cada tela, dados coletados e resultado esperado em cada etapa.`,
      agente:
        "Organize meu app em um mapa final de fluxo. Quero uma visão clara das telas, ordem de navegação, CTAs, áreas restritas e pontos críticos antes de construir no Lovable.",
      corrigir:
        "O Lovable misturou telas, fluxo e funcionalidades. Reorganize em tópicos claros: telas públicas, telas restritas, caminho do usuário, CTAs e resultado final.",
      avancar:
        "Avance quando você tiver um mapa claro das telas e do caminho do usuário.",
    },
  },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Tela", def: "Uma página ou área visual dentro do app." },
  { termo: "Fluxo", def: "O caminho que o usuário percorre dentro do app." },
  { termo: "Jornada do usuário", def: "A sequência de passos desde a entrada até o resultado final." },
  { termo: "Tela inicial", def: "A primeira tela que a pessoa vê ao entrar no app." },
  { termo: "CTA", def: "O botão ou chamada que indica o próximo passo." },
  { termo: "Área restrita", def: "Parte do app que só pode ser vista por quem tem login ou acesso liberado." },
  { termo: "Onboarding", def: "Uma introdução rápida para orientar o usuário no primeiro uso." },
  { termo: "Tela de resultado", def: "Onde o usuário recebe a resposta, análise, entrega ou conclusão da ação principal." },
];

const CHECKLIST_ITEMS = [
  "Listei as telas principais do app",
  "Sei qual é a função de cada tela",
  "Defini o caminho do usuário",
  "Separei telas públicas e restritas",
  "Defini o CTA principal de cada tela",
  "Cortei telas desnecessárias",
  "Tenho um mapa final do fluxo",
];

const TAB_META: { id: TabId; label: string; icon: typeof MapIcon }[] = [
  { id: "lovable", label: "Implementar no Lovable", icon: Wrench },
  { id: "agente", label: "Revisar com o Agente primeiro", icon: Bot },
  { id: "corrigir", label: "Corrigir erro", icon: HelpCircle },
  { id: "avancar", label: "Quando avançar", icon: ArrowRight },
];

const CHECKLIST_PREFIX = "telas_step__";

function CopyBtn({
  text,
  label = "Copiar para implementar no Lovable",
  hint,
}: {
  text: string;
  label?: string;
  hint?: string;
}) {
  const [ok, setOk] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setOk(true);
      toast.success("Copiado!");
      setTimeout(() => setOk(false), 1600);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handle}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition w-fit ${
          ok
            ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
            : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
        }`}
      >
        {ok ? <Check size={14} /> : <Copy size={14} />}
        {ok ? "Copiado!" : label}
      </button>
      {hint && (
        <span className="text-[10px] text-muted-foreground/80">{hint}</span>
      )}
    </div>
  );
}

function EtapaCard({ etapa }: { etapa: Etapa }) {
  const [tab, setTab] = useState<TabId>("lovable");
  const [auditCopied, setAuditCopied] = useState(false);
  const Icon = etapa.icon;

  const handleCopyAudit = async () => {
    try {
      await navigator.clipboard.writeText(LOVABLE_AUDIT_PROMPT(etapa.tabs.lovable).trim());
      setAuditCopied(true);
      toast.success("Auditoria copiada.", {
        description: "Cole no Lovable. Ele só vai analisar, não vai implementar.",
      });
      setTimeout(() => setAuditCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition min-h-[36px] ${
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
      ) : tab === "lovable" ? (
        <div className="space-y-4">
          {/* Grupo 1: Antes de implementar */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                1. Antes de implementar
              </span>
            </div>
            <EditablePromptBox
              collapsible
              saveSourceModule="telas"
              key={`${etapa.n}-${tab}`}
              originalPrompt={etapa.tabs[tab]}
              storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
              copyLabel="Copiar para implementar no Lovable"
            />
          </div>

          {/* Grupo 2: Depois de implementar */}
          <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/[0.04] p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider text-cyan-200 font-semibold">
                2. Depois de implementar
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyAudit}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition w-full sm:w-fit justify-center min-h-[44px] ${
                  auditCopied
                    ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                    : "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15"
                }`}
              >
                {auditCopied ? <Check size={14} /> : <ShieldCheck size={14} />}
                {auditCopied ? "Auditoria copiada!" : "Copiar auditoria para o Lovable"}
              </button>
              <div className="inline-flex items-start gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[11px] text-cyan-100/90 leading-snug">
                <ShieldCheck size={12} className="mt-0.5 shrink-0" />
                <span>
                  <strong className="text-cyan-50">Somente auditoria.</strong> Não implemente nada. Use quando quiser que o Lovable analise antes de alterar seu app.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditablePromptBox
          collapsible
          saveSourceModule="telas"
          key={`${etapa.n}-${tab}`}
          originalPrompt={etapa.tabs[tab]}
          storageKey={`${CHECKLIST_PREFIX}prompt__${etapa.n}__${tab}`}
          copyLabel={
            tab === "agente"
              ? "Copiar para revisar com o Agente"
              : "Copiar correção"
          }
          helperText={
            tab === "agente"
              ? "Use para revisar com o Agente antes de aplicar."
              : "Use quando o Lovable não entregar o resultado esperado."
          }
        />
      )}

    </GlassCard>
  );
}

export function TelasFluxoModule() {
  const { checklist, setChecklist } = useUserProgress();
  const { activeProject, openDrawer } = useAppProjects();

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
          <Workflow size={12} /> Telas e Fluxo
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Organize as telas e o caminho do usuário
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Um app bom conduz a pessoa sem confusão. Aqui você vai definir quais telas
          existem, o que cada uma faz e qual caminho o usuário deve seguir.
        </p>
        <div className="max-w-3xl mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-xs text-muted-foreground/90">
            Em cada etapa, você copia o comando e cola no chat do seu projeto no Lovable. Os comandos já orientam o Lovable a preservar o que está funcionando antes de aplicar novas mudanças.
          </p>
        </div>
      </header>

      <GlassCard className="p-5 mb-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.03] to-transparent">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
            Não basta ter funcionalidades. O usuário precisa entender onde começa, qual
            botão clicar, o que acontece depois e onde recebe o resultado. Telas soltas
            criam confusão. Fluxo claro cria confiança.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
          O que você vai fazer nesta etapa
        </div>
        <p className="text-sm text-foreground/90 mb-4">
          Nesta etapa, você vai transformar a arquitetura do app em uma jornada clara:
          tela inicial, ação principal, login quando necessário, formulário, resultado,
          pagamento, entrega e próximos passos.
        </p>
        <ol className="space-y-2 text-sm text-foreground/85">
          {[
            "Defina a primeira tela do app.",
            "Organize o caminho do usuário.",
            "Separe telas públicas e telas restritas.",
            "Confirme onde ficam formulário, resultado, pagamento e entrega.",
            "Corte telas desnecessárias.",
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
            <Bot size={14} /> Não sei organizar as telas
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Copia um prompt pronto para você colar no Agente Arquiteto.
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Use este botão para pensar com o Agente. Use os comandos das etapas para colar no Lovable do seu app.
          </p>
        </div>
      </GlassCard>



      {!activeProject && (
        <GlassCard className="p-4 sm:p-5 mb-5 border-amber-400/50 bg-gradient-to-br from-amber-400/[0.08] via-amber-400/[0.04] to-transparent shadow-[0_0_24px_-16px_rgba(251,191,36,0.5)]">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <FolderKanban size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-heading font-semibold text-amber-100 mb-1.5">
                Escolha seu app para começar
              </h3>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed mb-3">
                Antes de copiar comandos ou avançar na jornada, selecione ou crie o app que você quer construir. Isso permite personalizar os prompts, salvar progresso e revisar a entrega com mais precisão.
              </p>
              <button
                type="button"
                onClick={openDrawer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-amber-400/50 bg-gradient-to-r from-amber-400/20 to-amber-400/10 text-amber-100 hover:from-amber-400/25 hover:to-amber-400/15 text-sm font-semibold transition min-h-[44px]"
              >
                <FolderKanban size={14} /> Criar ou selecionar app
              </button>
            </div>
          </div>
        </GlassCard>
      )}

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
