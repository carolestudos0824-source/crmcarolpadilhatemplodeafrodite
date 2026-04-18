/**
 * Catálogo formal de Módulos e Arcanos Maiores — única ponte oficial
 * para listagens estáticas no runtime principal.
 *
 * REGRA DE OURO:
 * - Telas globais (Index, Profile, JourneyMap, Trails, StudyRoutine,
 *   ModulesPage, ContinuityCard) devem importar daqui (via @/lib/content).
 * - NUNCA importar de `@/data/tarot-data` no runtime principal.
 *
 * STATUS (Fase 6.0):
 * Lê dos SEEDS formais (`seed-modules`, `seed-arcanos-summary`) e do
 * registro editorial canônico (`@/data/arcanos`). `tarot-data.ts` foi
 * removido do caminho de importação do runtime principal.
 */

import type {
  LearningModule,
  ArcanoSummary,
  ArcanoData,
  ModuleCategory,
} from "./runtime-types";
import { MODULES_SEED } from "./seed-modules";
import { ARCANOS_MAIORES_SEED } from "./seed-arcanos-summary";
import { getArcanoAsLegacy } from "@/content/arcanos-maiores";

export type { LearningModule, ArcanoSummary, ArcanoData, ModuleCategory };

/** Catálogo completo de módulos do produto. Ordenado por `order`. */
export const MODULES_CATALOG: readonly LearningModule[] = MODULES_SEED;

/** Catálogo completo dos 22 Arcanos Maiores. Ordenado por `id`. */
export const ARCANOS_MAIORES_CATALOG: readonly ArcanoSummary[] =
  ARCANOS_MAIORES_SEED;

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
 * Internamente usa o registro editorial canônico em `@/data/arcanos`.
 */
export function getArcanoFull(id: number): ArcanoData | undefined {
  return getArcanoAsLegacy(id, true);
}
