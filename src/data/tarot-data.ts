/**
 * @deprecated (Fase 6.0) — NÃO importe deste arquivo no runtime principal.
 *
 * Este arquivo foi reduzido a um re-export fino dos seeds formais
 * (`@/lib/content/seed-modules`, `seed-arcanos-summary`) e do registro
 * editorial canônico (`@/data/arcanos`). Existe APENAS para que data
 * files legados (`daily-challenges.ts`, `review-data.ts`) continuem
 * compilando enquanto migramos os módulos restantes.
 *
 * Telas, hooks e componentes do runtime principal devem importar de
 * `@/lib/content`:
 *
 *   import {
 *     MODULES_CATALOG, ARCANOS_MAIORES_CATALOG,
 *     FREE_ARCANO_IDS, isModuleUnlocked,
 *     getArcanoFull, getModuleFromCatalog,
 *     DEFAULT_PROGRESS,
 *     type ArcanoData, type LearningModule, type ArcanoSummary,
 *     type ModuleCategory, type QuizQuestion, type LessonSection,
 *     type LessonLayer, type ExtraMaterial, type Badge, type UserProgress,
 *   } from "@/lib/content";
 */

// ─── Tipos canônicos (vindos de runtime-types) ─────────────────────
export type {
  ArcanoData,
  Badge,
  ExtraMaterial,
  LessonLayer,
  LessonSection,
  QuizQuestion,
  UserProgress,
  LearningModule,
  ArcanoSummary,
  ModuleCategory,
} from "@/lib/content/runtime-types";

export { DEFAULT_PROGRESS } from "@/lib/content/runtime-types";

// ─── Catálogo (seeds formais) ──────────────────────────────────────
import { MODULES_SEED } from "@/lib/content/seed-modules";
import { ARCANOS_MAIORES_SEED } from "@/lib/content/seed-arcanos-summary";
import type { LearningModule, ArcanoSummary, ArcanoData } from "@/lib/content/runtime-types";
import { getArcanoAsLegacy } from "./arcanos/index";

/** @deprecated Use `MODULES_CATALOG` de `@/lib/content`. */
export const MODULES: LearningModule[] = [...MODULES_SEED];

/** @deprecated Use `ARCANOS_MAIORES_CATALOG` de `@/lib/content`. */
export const ARCANOS_MAIORES: ArcanoSummary[] = [...ARCANOS_MAIORES_SEED];

/** @deprecated Use `FREE_ARCANO_IDS` de `@/lib/content`. */
export const FREE_ARCANO_IDS = [0];

/** @deprecated Use `getModuleFromCatalog` de `@/lib/content`. */
export function getModuleById(id: string): LearningModule | undefined {
  return MODULES.find(m => m.id === id);
}

/** @deprecated Use `isModuleUnlocked` de `@/lib/content`. */
export function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
  const mod = getModuleById(moduleId);
  if (!mod) return false;
  if (!mod.prerequisiteModuleId) return true;
  return completedModules.includes(mod.prerequisiteModuleId);
}

/** @deprecated Use `getArcanoFull` de `@/lib/content`. */
export function getArcanoById(id: number): ArcanoData | undefined {
  return getArcanoAsLegacy(id, true);
}
