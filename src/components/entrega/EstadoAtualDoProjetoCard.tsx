import { ChevronRight } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCopy,
  Compass,
  FolderKanban,
  ImagePlus,
  Info,
  ListChecks,
  Radar,
  Route,
  UserCog,
} from "lucide-react";
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
import { useProjectJourney, JOURNEY_LABELS, JOURNEY_PHASE_LABELS } from "@/lib/journey";
import { ProjectLogoPicker } from "./ProjectLogoPicker";

/**
 * Deriva uma "última ação registrada" a partir do progresso existente.
 * Não cria timestamp, não muda dados.
 */
const resolveLastAction = (
  commandsDone: Record<string, boolean>,
  modulesDone: Record<string, boolean>,
  moduleLabel: Record<ModuleId, string>,
): string | null => {
  const cmdKeys = Object.keys(commandsDone).filter((k) => commandsDone[k]);
  if (cmdKeys.length > 0) {
    const lastKey = cmdKeys[cmdKeys.length - 1];
    const moduleId = MODULE_ORDER.find(
      (id) => lastKey === id || lastKey.startsWith(`${id}_`),
    );
    if (moduleId) return `Etapa concluída em ${moduleLabel[moduleId]}.`;
    return "Uma etapa foi marcada como concluída.";
  }
  const modKeys = Object.keys(modulesDone).filter((k) => modulesDone[k]);
  if (modKeys.length > 0) {
    const lastKey = modKeys[modKeys.length - 1] as ModuleId;
    const label = moduleLabel[lastKey];
    if (label) return `Módulo concluído: ${label}.`;
  }
  return null;
};

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

/**
 * GPS do Projeto — painel premium unificado (3 áreas):
 *  1. Cabeçalho compacto (onde estou)
 *  2. Próximo passo (o que faço agora)
 *  3. Alertas contextuais (o que preciso observar)
 *
 * Não altera lógica de próximo passo, prompts, progresso, IDs ou banco.
 */
export const EstadoAtualDoProjetoCard = ({ onGoToModule }: Props) => {
  const { activeProject, openDrawer } = useAppProjects();
  const [journey] = useProjectJourney(activeProject?.id ?? null);
  const { openEditor, context: liveContext } = useProjectContext();
  const { active, moduleDone, commands } = useUserProgress();
  const auth = useAuthState();
  const [copying, setCopying] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  const isAdmin = auth.status === "authed" && auth.isAdmin;
  const adminOnSelf =
    isAdmin && !!activeProject && isFabricaSelfProject(activeProject.context);
  const mode = adminOnSelf ? "Admin (Fábrica)" : isAdmin ? "Admin" : "Usuário";

  const phase = useMemo(() => {
    if (!activeProject) return "Sem projeto selecionado";
    if (journey) return JOURNEY_PHASE_LABELS[journey];
    const s = activeProject.status;
    if (["publicado", "vendendo", "escalando"].includes(s)) return "Já tenho um app";
    const mod = activeProject.currentModuleId ?? "";
    if (["comece", "ideias", "validacao"].includes(mod)) return "Começando do zero";
    return "Construindo por versões";
  }, [activeProject, journey]);

  const completedIds = activeProject?.completedModuleIds ?? [];
  const doneCount = MODULE_ORDER.filter(
    (id) => completedIds.includes(id) || moduleDone[id],
  ).length;
  const totalCount = MODULE_ORDER.length;
  const percent = Math.round((doneCount / totalCount) * 100);

  const activeModuleId = (active ?? activeProject?.currentModuleId ?? null) as ModuleId | null;
  const activeModuleLabel = activeModuleId ? MODULE_LABEL[activeModuleId] ?? "—" : "—";

  const lastActionText = useMemo(
    () => resolveLastAction(commands, moduleDone, MODULE_LABEL),
    [commands, moduleDone],
  );

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
    const activeIdx = activeModuleId ? MODULE_ORDER.indexOf(activeModuleId) : -1;
    const suggestIfNotPast = (id: ModuleId) =>
      !isDone(id) && (activeIdx === -1 || activeIdx <= MODULE_ORDER.indexOf(id));

    if (phase === "Já tenho um app" && suggestIfNotPast("melhorias")) {
      return {
        kind: "go-module",
        moduleId: "melhorias",
        label: "Ir para Melhorias e Versões",
        helper: "Auditar, corrigir e evoluir o app existente sem quebrar o que já funciona.",
      };
    }
    if (phase === "Começando do zero" && suggestIfNotPast("mvp")) {
      return {
        kind: "go-module",
        moduleId: "mvp",
        label: "Definir o MVP",
        helper: "Antes de construir, defina a versão mínima funcional.",
      };
    }
    if (phase === "Construindo por versões" && suggestIfNotPast("planejar")) {
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
      label: "Abrir Checklist de Prontidão",
      helper: "Todos os módulos foram concluídos. Revisar a prontidão geral.",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, phase, activeModuleId, completedIds, moduleDone]);

  const handleAction = () => {
    if (nextStep.kind === "fill-context") return openEditor();
    if (nextStep.kind === "open-drawer") return openDrawer();
    if (nextStep.moduleId) return onGoToModule(nextStep.moduleId);
  };

  const recommendedModuleId =
    nextStep.kind === "go-module" ? nextStep.moduleId ?? null : null;
  const recommendedIntent = recommendedModuleId
    ? MODULE_PROMPT_INTENTS[recommendedModuleId] ?? null
    : null;
  // Só permite copiar prompt quando o usuário está NO módulo recomendado.
  // Evita copiar prompt de outro módulo (ex.: em "Comece pelo Lovable" copiar prompt de "Planejar o App").
  const canCopyPrompt =
    !!activeProject &&
    !!recommendedModuleId &&
    !!recommendedIntent &&
    !!activeModuleId &&
    activeModuleId === recommendedModuleId &&
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

  // Alertas contextuais
  const mismatchAlert =
    recommendedModuleId &&
    activeModuleId &&
    recommendedModuleId !== activeModuleId &&
    !isDone(activeModuleId)
      ? {
          currentLabel: MODULE_LABEL[activeModuleId],
          recommendedLabel: MODULE_LABEL[recommendedModuleId],
          recommendedId: recommendedModuleId,
        }
      : null;

  const noJourney = !!activeProject && !journey;
  const noContext =
    !!activeProject && !hasUsefulProjectContext(activeProject.context);

  return (
    <section
      aria-label="GPS do projeto"
      className="relative mb-4 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-transparent backdrop-blur-xl shadow-[0_10px_40px_-20px_hsl(var(--accent)/0.35),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
    >
      {/* halo ciano sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
      />

      {/* ÁREA 1 — CABEÇALHO COMPACTO */}
      <header className="relative flex flex-wrap items-center gap-x-4 gap-y-2 px-4 md:px-5 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-accent">
          <Radar size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent/90">
            GPS do projeto
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground/80">
          <span className="text-foreground/90 font-medium">{activeProject?.name ?? "Nenhum projeto"}</span>
          <span className="mx-1.5 text-muted-foreground/40">·</span>
          {mode}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 min-w-[200px]"
            title="Mostra quantos módulos você já concluiu na Fábrica."
            aria-label={`Progresso do programa: ${doneCount} de ${totalCount} módulos concluídos (${percent}%)`}
          >
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground whitespace-nowrap">
              <span className="text-foreground/90">{doneCount} de {totalCount}</span>
              <span className="text-muted-foreground/70"> módulos</span>
            </span>
            <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-accent/90 font-semibold">
              {percent}%
            </span>
          </div>
        </div>
      </header>

      {/* Chips de contexto */}
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 md:px-5 pt-3">
        <Chip
          icon={<Route size={12} />}
          label="Jornada"
          value={journey ? JOURNEY_LABELS[journey] : "Não escolhida"}
          action={{
            text: journey ? "Trocar" : "Escolher",
            onClick: () => onGoToModule("comece"),
          }}
        />
        <Chip
          icon={<Compass size={12} />}
          label="Fase"
          value={phase}
        />
        <Chip
          icon={<ListChecks size={12} />}
          label="Módulo ativo"
          value={activeModuleLabel}
        />
      </div>

      {/* Progresso mobile */}
      <div
        className="sm:hidden px-4 pt-2 flex items-center gap-2"
        title="Mostra quantos módulos você já concluiu na Fábrica."
        aria-label={`Progresso: ${doneCount} de ${totalCount} módulos concluídos`}
      >
        <span className="text-[10px] font-medium tabular-nums text-foreground/90 whitespace-nowrap">
          {doneCount} de {totalCount} módulos
        </span>
        <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[10px] tabular-nums text-accent/90 font-semibold">
          {percent}%
        </span>
      </div>

      {/* ÁREA 2 — PRÓXIMO PASSO */}
      <div className="relative mx-4 md:mx-5 mt-4 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.10] via-accent/[0.05] to-transparent p-4 shadow-[0_0_30px_-15px_hsl(var(--accent)/0.6)_inset]">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              Próximo passo recomendado
            </div>
            <div className="mt-1 text-base font-semibold text-foreground leading-snug">
              {nextStep.label}
            </div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {nextStep.helper}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.7)] hover:brightness-110 transition"
            >
              Ir para próximo passo <ArrowRight size={14} />
            </button>
            {canCopyPrompt && (
              <button
                type="button"
                onClick={handleCopyPrompt}
                disabled={copying}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-foreground/80 text-xs font-medium hover:bg-white/[0.06] hover:text-foreground transition disabled:opacity-60"
                title="Copia um prompt seguro para colar no Lovable"
              >
                <ClipboardCopy size={13} /> {copying ? "Copiando..." : "Copiar prompt"}
              </button>
            )}
          </div>
        </div>
        {copiedHint && canCopyPrompt && (
          <p
            className="mt-2 text-[11px] text-muted-foreground/80"
            role="status"
            aria-live="polite"
          >
            Copiado. Cole no chat do Lovable como nova mensagem, teste o resultado e volte para marcar o módulo como concluído.
          </p>
        )}
      </div>

      {/* ÁREA 3 — ALERTAS CONTEXTUAIS */}
      <div className="relative px-4 md:px-5 pt-3 pb-4 space-y-2">
        {noJourney && (
          <AlertLine
            tone="warn"
            icon={<AlertTriangle size={12} />}
            text={
              <>
                <span className="text-foreground/90">Jornada não definida.</span>{" "}
                Escolha em Comece Aqui para receber o próximo passo certo.
              </>
            }
            action={{ text: "Escolher jornada", onClick: () => onGoToModule("comece") }}
          />
        )}
        {noContext && (
          <AlertLine
            tone="warn"
            icon={<AlertTriangle size={12} />}
            text={
              <>
                <span className="text-foreground/90">Contexto incompleto.</span>{" "}
                Sem contexto, os prompts saem genéricos.
              </>
            }
            action={{ text: "Preencher agora", onClick: () => openEditor() }}
          />
        )}
        {mismatchAlert && (
          <AlertLine
            tone="info"
            icon={<Info size={12} />}
            text={
              <>
                Você está vendo{" "}
                <span className="text-foreground/90">{mismatchAlert.currentLabel}</span>, mas o próximo passo recomendado é{" "}
                <span className="text-accent">{mismatchAlert.recommendedLabel}</span>.
              </>
            }
            action={{
              text: "Ir agora",
              onClick: () => onGoToModule(mismatchAlert.recommendedId),
            }}
          />
        )}

        <details className="group text-[11px] text-muted-foreground/80">
          <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 text-[11px] font-medium text-muted-foreground/80 hover:text-foreground hover:bg-white/[0.03] transition select-none">
            <ChevronRight
              size={12}
              className="text-accent/80 transition-transform duration-200 group-open:rotate-90"
            />
            Ver detalhes do projeto
          </summary>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <MiniField icon={<FolderKanban size={11} />} label="Projeto em foco" value={activeProject?.name ?? "Nenhum"} />
            <MiniField icon={<UserCog size={11} />} label="Modo atual" value={mode} />
            <div className="col-span-full text-[11px] text-muted-foreground/80">
              <span className="text-muted-foreground/60">Última ação: </span>
              {lastActionText ?? "Nenhuma ação concluída ainda."}
            </div>
            {activeProject && (
              <div className="col-span-full pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2">
                  <ImagePlus size={11} className="text-accent" />
                  Editar logo do projeto
                </div>
                <ProjectLogoPicker />
              </div>
            )}
          </div>
        </details>
      </div>
    </section>
  );
};

/* ---------- Subcomponentes locais ---------- */

const Chip = ({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: { text: string; onClick: () => void };
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 min-w-0">
    <span className="text-accent shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className="text-[12px] font-medium text-foreground truncate" title={value}>
        {value}
      </div>
    </div>
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="shrink-0 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-foreground/80 hover:bg-white/10 transition"
      >
        {action.text} <ArrowRight size={9} />
      </button>
    )}
  </div>
);

const AlertLine = ({
  tone,
  icon,
  text,
  action,
}: {
  tone: "warn" | "info";
  icon: React.ReactNode;
  text: React.ReactNode;
  action?: { text: string; onClick: () => void };
}) => (
  <div
    role="note"
    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed ${
      tone === "warn"
        ? "border-amber-400/20 bg-amber-400/[0.04] text-amber-100/90"
        : "border-accent/20 bg-accent/[0.05] text-foreground/85"
    }`}
  >
    <span className={tone === "warn" ? "text-amber-300 mt-0.5" : "text-accent mt-0.5"}>{icon}</span>
    <span className="flex-1">{text}</span>
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 transition"
      >
        {action.text} <ArrowRight size={11} />
      </button>
    )}
  </div>
);

const MiniField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="min-w-0">
    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="mt-0.5 text-[12px] font-medium text-foreground truncate" title={value}>
      {value}
    </div>
  </div>
);
