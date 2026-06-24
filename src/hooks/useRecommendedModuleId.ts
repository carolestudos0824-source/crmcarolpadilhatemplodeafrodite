import { useMemo } from "react";
import { useAppProjects, hasUsefulProjectContext } from "@/hooks/useAppProjects";
import { useUserProgress } from "@/hooks/useUserProgress";
import { MODULE_ORDER, type ModuleId } from "@/data/entregaModules";

/**
 * Replica determinística do "próximo passo recomendado" do
 * EstadoAtualDoProjetoCard, restrita ao caso de navegar para um módulo.
 *
 * - Sem projeto em foco OU sem contexto útil → retorna null (não competir
 *   com o alerta do Estado Atual, conforme regra do produto).
 * - Quando o próximo passo é uma ação de UI (abrir drawer / preencher
 *   contexto), também retorna null.
 *
 * Não altera progresso, prompts, módulos ou IDs.
 */
export const useRecommendedModuleId = (): ModuleId | null => {
  const { activeProject } = useAppProjects();
  const { moduleDone, active } = useUserProgress();

  return useMemo<ModuleId | null>(() => {
    if (!activeProject) return null;
    if (!hasUsefulProjectContext(activeProject.context)) return null;

    const completedIds = activeProject.completedModuleIds ?? [];
    const isDone = (id: ModuleId) =>
      completedIds.includes(id) || !!moduleDone[id];

    const s = activeProject.status;
    const mod = activeProject.currentModuleId ?? "";
    let phase: "ready" | "scratch" | "versioning";
    if (["publicado", "vendendo", "escalando"].includes(s)) phase = "ready";
    else if (["comece", "ideias", "validacao"].includes(mod)) phase = "scratch";
    else phase = "versioning";

    if (phase === "ready" && !isDone("melhorias")) return "melhorias";
    if (phase === "scratch" && !isDone("mvp")) return "mvp";
    if (phase === "versioning" && !isDone("planejar")) return "planejar";

    const activeModuleId = (activeProject.currentModuleId ?? active) as ModuleId | null;
    if (activeModuleId && !isDone(activeModuleId)) return activeModuleId;

    const nextPending = MODULE_ORDER.find((id) => !isDone(id));
    return nextPending ?? null;
  }, [activeProject, moduleDone, active]);
};
