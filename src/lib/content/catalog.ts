/**
 * Catálogo formal de Módulos e Arcanos Maiores — única ponte oficial
 * para listagens estáticas no runtime principal.
 *
 * REGRA DE OURO:
 * - Telas globais (Index, Profile, JourneyMap, Trails, StudyRoutine,
 *   ModulesPage, ContinuityCard) devem importar daqui.
 * - NUNCA mais importar `MODULES`, `ARCANOS_MAIORES`, `getArcanoById`
 *   diretamente de `@/data/tarot-data`.
 *
 * STATUS:
 * Internamente ainda lê do legado (espelho 1:1) porque `cms_modules` está
 * publicado parcialmente e a UI precisa do catálogo completo de imediato.
 * Quando o CMS tiver os 17 módulos publicados + 22 arcanos com `order_index`
 * estável, basta trocar a fonte interna deste arquivo — as telas não mudam.
 */

import {
  MODULES as LEGACY_MODULES,
  ARCANOS_MAIORES as LEGACY_ARCANOS_MAIORES,
  getArcanoById as legacyGetArcanoById,
  type LearningModule,
  type ArcanoSummary,
  type ArcanoData,
  type ModuleCategory,
} from "@/data/tarot-data";

export type { LearningModule, ArcanoSummary, ArcanoData, ModuleCategory };

/** Catálogo completo de módulos do produto. Ordenado por `order`. */
export const MODULES_CATALOG: readonly LearningModule[] = LEGACY_MODULES;

/** Catálogo completo dos 22 Arcanos Maiores. Ordenado por `id`. */
export const ARCANOS_MAIORES_CATALOG: readonly ArcanoSummary[] =
  LEGACY_ARCANOS_MAIORES;

export function getModuleFromCatalog(id: string): LearningModule | undefined {
  return MODULES_CATALOG.find((m) => m.id === id);
}

export function getArcanoSummaryFromCatalog(
  id: number,
): ArcanoSummary | undefined {
  return ARCANOS_MAIORES_CATALOG.find((a) => a.id === id);
}

/**
 * Resolução completa de um arcano (editorial + visual + quiz).
 * Internamente usa o registro editorial canônico.
 */
export function getArcanoFull(id: number): ArcanoData | undefined {
  return legacyGetArcanoById(id);
}
