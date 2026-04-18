/**
 * @deprecated [Fase 6.6 — Faxina final]
 * Arquivo legado mantido apenas como SEED / BACKUP / ROLLBACK.
 * NÃO importar no runtime (páginas, componentes, hooks).
 * Runtime principal: @/lib/content (DB) + @/content/** + @/config/** + @/registry/**.
 * Importação fora de src/lib/content/**, src/data/** ou src/components/admin/** é bloqueada por ESLint.
 */
/**
 * @deprecated Moved to `@/content/lessons/combinacoes`.
 * This file is no longer part of the runtime. Kept temporarily as a
 * historical reference and will be removed in the legacy cleanup phase.
 *
 * Do NOT import from this path. Use:
 *   import { ... } from "@/content/lessons/combinacoes";
 */
export {};