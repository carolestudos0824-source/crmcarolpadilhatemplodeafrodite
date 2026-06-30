import { useMemo } from "react";
import { useAppProjects, hasUsefulProjectContext } from "@/hooks/useAppProjects";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useProjectJourney, JOURNEY_TO_PHASE } from "@/lib/journey";
import { MODULE_ORDER, type ModuleId } from "@/data/entregaModules";

/**
 * Replica determinística do "próximo passo recomendado" do
 * EstadoAtualDoProjetoCard, restrita ao caso de navegar para um módulo.
 *
 * Fonte única da fase: jornada salva no projeto ativo. Heurístico antigo
 * só roda como fallback quando a jornada ainda não foi escolhida.
 *
 * - Sem projeto em foco OU sem contexto útil → retorna null (não competir
 *   com o alerta do Estado Atual, conforme regra do produto).
 *
 * Não altera progresso, prompts, módulos ou IDs.
 */
export const useRecommendedModuleId = (): ModuleId | null => {
  const { activeProject } = useAppProjects();
  const { moduleDone, active } = useUserProgress();
  const [journey] = useProjectJourney(activeProject?.id ?? null);

  return useMemo<ModuleId | null>(() => {
    if (!activeProject) return null;
    if (!hasUsefulProjectContext(activeProject.context)) return null;

    const completedIds = activeProject.completedModuleIds ?? [];
    const isDone = (id: ModuleId) =>
      completedIds.includes(id) || !!moduleDone[id];

    let phase: "ready" | "scratch" | "versioning";
    if (journey) {
      phase = JOURNEY_TO_PHASE[journey];
    } else {
      const s = activeProject.status;
      const mod = activeProject.currentModuleId ?? "";
      if (["publicado", "vendendo", "escalando"].includes(s)) phase = "ready";
      else if (["comece", "ideias", "validacao"].includes(mod)) phase = "scratch";
      else phase = "versioning";
    }


    const activeModuleId = (activeProject.currentModuleId ?? active) as ModuleId | null;
    const activeIdx = activeModuleId ? MODULE_ORDER.indexOf(activeModuleId) : -1;
    const idxOf = (id: ModuleId) => MODULE_ORDER.indexOf(id);

    // Só recomenda um passo "anterior" da jornada se a pessoa ainda não
    // avançou além dele. Evita mostrar "Planejar o App" quando a usuária
    // está em módulos posteriores como Página de venda.
    const suggestIfNotPast = (id: ModuleId) =>
      !isDone(id) && (activeIdx === -1 || activeIdx <= idxOf(id)) ? id : null;

    if (phase === "ready") {
      const s1 = suggestIfNotPast("melhorias");
      if (s1) return s1;
    }
    if (phase === "scratch") {
      const s2 = suggestIfNotPast("mvp");
      if (s2) return s2;
    }
    if (phase === "versioning") {
      const s3 = suggestIfNotPast("planejar");
      if (s3) return s3;
    }

    if (activeModuleId && !isDone(activeModuleId)) return activeModuleId;

    const nextPending = MODULE_ORDER.find((id) => !isDone(id));
    return nextPending ?? null;
  }, [activeProject, moduleDone, active]);
};
