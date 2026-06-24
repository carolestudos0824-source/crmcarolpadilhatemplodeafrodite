import { ArrowRight, ClipboardCopy, Compass, FolderKanban, ListChecks, Sparkles, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppProjects, hasUsefulProjectContext } from "@/hooks/useAppProjects";
import { useProjectContext } from "@/hooks/useProjectContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuthState } from "@/hooks/useAuthState";
import {
  buildLovablePrompt,
  isFabricaSelfProject,
  MODULE_PROMPT_INTENTS,
} from "@/lib/promptBuilder";
import { MODULES, MODULE_ORDER, type ModuleId } from "@/data/entregaModules";

/**
 * Card de leitura "Estado Atual do Projeto" — consolida, sem alterar dados:
 * - Produto principal (sempre Fábrica de Apps com IA)
 * - Modo atual (Admin/Usuário)
 * - Projeto em foco
 * - Fase atual
 * - Etapa/módulo ativo + progresso simples
 * - Próximo passo recomendado (regra determinística)
 *
 * Não cria tabelas, não altera schema, RLS, progresso, prompts ou checkout.
 */
type NextStep = {
  kind: "fill-context" | "open-drawer" | "go-module";
  moduleId?: ModuleId;
  label: string;
  helper: string;
};

const MODULE_LABEL = Object.fromEntries(MODULES.map((m) => [m.id, m.label])) as Record<ModuleId, string>;

type Props = {
  onGoToModule: (id: ModuleId) => void;
};

export const EstadoAtualDoProjetoCard = ({ onGoToModule }: Props) => {
  const { activeProject, openDrawer } = useAppProjects();
  const { openEditor, context: liveContext } = useProjectContext();
  const { active, moduleDone } = useUserProgress();
  const auth = useAuthState();
  const [copying, setCopying] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  const isAdmin = auth.status === "authed" && auth.isAdmin;
  const adminOnSelf =
    isAdmin && !!activeProject && isFabricaSelfProject(activeProject.context);
  const mode = adminOnSelf ? "Admin (Fábrica)" : isAdmin ? "Admin" : "Usuário";

  const phase = useMemo(() => {
    if (!activeProject) return "Sem projeto selecionado";
    const s = activeProject.status;
    if (["publicado", "vendendo", "escalando"].includes(s)) return "Já tenho um app";
    const mod = activeProject.currentModuleId ?? "";
    if (["comece", "ideias", "validacao"].includes(mod)) return "Começando do zero";
    return "Construindo por versões";
  }, [activeProject]);

  const completedIds = activeProject?.completedModuleIds ?? [];
  const doneCount = MODULE_ORDER.filter(
    (id) => completedIds.includes(id) || moduleDone[id],
  ).length;
  const totalCount = MODULE_ORDER.length;
  const percent = Math.round((doneCount / totalCount) * 100);

  const activeModuleId = (activeProject?.currentModuleId ?? active) as ModuleId | null;
  const activeModuleLabel = activeModuleId ? MODULE_LABEL[activeModuleId] ?? "—" : "—";

  const isDone = (id: ModuleId) =>
    completedIds.includes(id) || !!moduleDone[id];

  const nextStep: NextStep = useMemo(() => {
    if (!activeProject) {
      return {
        kind: "open-drawer",
        label: "Selecionar ou criar projeto em foco",
        helper: "Escolha ou crie um app em construção para a Fábrica te guiar.",
      };
    }
    if (!hasUsefulProjectContext(activeProject.context)) {
      return {
        kind: "fill-context",
        label: "Preencher contexto do projeto em foco",
        helper: "Sem contexto, os prompts saem genéricos. Preencha para personalizar.",
      };
    }
    if (phase === "Já tenho um app" && !isDone("melhorias")) {
      return {
        kind: "go-module",
        moduleId: "melhorias",
        label: "Ir para Melhorias e Versões",
        helper: "Auditar, corrigir e evoluir o app existente sem quebrar o que já funciona.",
      };
    }
    if (phase === "Começando do zero" && !isDone("mvp")) {
      return {
        kind: "go-module",
        moduleId: "mvp",
        label: "Definir o MVP",
        helper: "Antes de construir, defina a versão mínima funcional.",
      };
    }
    if (phase === "Construindo por versões" && !isDone("planejar")) {
      return {
        kind: "go-module",
        moduleId: "planejar",
        label: "Planejar o App",
        helper: "Organize escopo e versões antes de copiar prompts.",
      };
    }
    if (activeModuleId && !isDone(activeModuleId)) {
      return {
        kind: "go-module",
        moduleId: activeModuleId,
        label: `Continuar em ${MODULE_LABEL[activeModuleId]}`,
        helper: "Você parou aqui. Retomar de onde estava.",
      };
    }
    const nextPending = MODULE_ORDER.find((id) => !isDone(id));
    if (nextPending) {
      return {
        kind: "go-module",
        moduleId: nextPending,
        label: `Ir para ${MODULE_LABEL[nextPending]}`,
        helper: "Próximo módulo da ordem atual que ainda não foi concluído.",
      };
    }
    return {
      kind: "go-module",
      moduleId: "checklist",
      label: "Abrir Painel de Prontidão",
      helper: "Todos os módulos foram concluídos. Revisar a prontidão geral.",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, phase, activeModuleId, completedIds, moduleDone]);

  const handleAction = () => {
    if (nextStep.kind === "fill-context") return openEditor();
    if (nextStep.kind === "open-drawer") return openDrawer();
    if (nextStep.moduleId) return onGoToModule(nextStep.moduleId);
  };

  // Só copia prompt quando o próximo passo é um módulo real com intent segura
  // no promptBuilder. Para ações de UI (fill-context / open-drawer) ou módulos
  // sem intent definida, o botão não aparece — evita prompt genérico.
  const recommendedModuleId =
    nextStep.kind === "go-module" ? nextStep.moduleId ?? null : null;
  const recommendedIntent = recommendedModuleId
    ? MODULE_PROMPT_INTENTS[recommendedModuleId] ?? null
    : null;
  const canCopyPrompt =
    !!activeProject &&
    !!recommendedModuleId &&
    !!recommendedIntent &&
    hasUsefulProjectContext(liveContext);

  const handleCopyPrompt = async () => {
    if (!canCopyPrompt || !recommendedModuleId || !recommendedIntent) return;
    try {
      setCopying(true);
      const prompt = buildLovablePrompt({
        context: liveContext,
        stepName: MODULE_LABEL[recommendedModuleId],
        stepObjective: recommendedIntent.directRequest,
        command: recommendedIntent.directRequest,
        moduleId: recommendedModuleId,
      });
      await navigator.clipboard.writeText(prompt);
      setCopiedHint(true);
      toast.success("Prompt recomendado copiado", {
        description: `Módulo: ${MODULE_LABEL[recommendedModuleId]}`,
      });
    } catch {
      toast.error("Não foi possível copiar o prompt. Tente novamente.");
    } finally {
      setCopying(false);
    }
  };

  return (
    <section
      aria-label="Estado atual do projeto"
      className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] p-4 md:p-5"
    >
      <header className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles size={14} />
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground/90">
            Estado atual do projeto
          </h2>
        </div>
        <span className="text-[10px] text-muted-foreground/70">
          {doneCount}/{totalCount} módulos · {percent}%
        </span>
      </header>

      <p className="mb-3 text-[11px] text-muted-foreground/70">
        Você está usando a Fábrica de Apps com IA para guiar este projeto.
      </p>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <InfoField
          icon={<FolderKanban size={12} />}
          label="Projeto em foco"
          value={activeProject?.name ?? "Nenhum"}
        />
        <InfoField
          icon={<UserCog size={12} />}
          label="Modo atual"
          value={mode}
        />
        <InfoField
          icon={<Compass size={12} />}
          label="Fase atual"
          value={phase}
        />
        <InfoField
          icon={<ListChecks size={12} />}
          label="Módulo ativo"
          value={activeModuleLabel}
        />
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent/70 to-accent shadow-[0_0_12px_rgba(0,194,255,0.5)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.06] p-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-accent">
            Próximo passo recomendado
          </div>
          <div className="mt-0.5 text-sm font-medium text-foreground">
            {nextStep.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {nextStep.helper}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {canCopyPrompt && (
            <button
              type="button"
              onClick={handleCopyPrompt}
              disabled={copying}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-xs font-medium hover:bg-accent/15 transition disabled:opacity-60"
              title="Copia um prompt seguro para colar no Lovable, usando o contexto do projeto em foco"
            >
              <ClipboardCopy size={14} /> {copying ? "Copiando..." : "Copiar prompt recomendado"}
            </button>
          )}
          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition"
          >
            Ir para próximo passo <ArrowRight size={14} />
          </button>
        </div>
        {copiedHint && canCopyPrompt && (
          <p
            className="basis-full mt-1 text-[11px] text-muted-foreground/80 md:text-right"
            role="status"
            aria-live="polite"
          >
            Copiado. Agora cole no chat do Lovable como nova mensagem. Quando o Lovable terminar, volte aqui, teste o resultado e marque o módulo como concluído.
          </p>
        )}
      </div>
    </section>
  );
};

const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="min-w-0">
    <div className="flex items-center gap-1 uppercase tracking-wider text-muted-foreground/80">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="mt-0.5 text-sm font-medium text-foreground truncate" title={value}>
      {value}
    </div>
  </div>
);
