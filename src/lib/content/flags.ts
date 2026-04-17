/**
 * Feature flags da camada de conteúdo.
 *
 * Cada domínio decide independentemente como resolver:
 *   - 'fallback': lê apenas do `.ts` legado (modo atual / rollback de emergência)
 *   - 'auto':     tenta DB primeiro; se falhar/vazio → cai no legado + telemetria
 *   - 'db':       lê apenas do banco; falha = erro real (sem mascarar)
 *
 * Regra: começamos TUDO em 'fallback' na Fase 2 (zero impacto runtime).
 * Promovemos por domínio à medida que cada migração for validada.
 */

export type ContentSourceMode = "fallback" | "auto" | "db";

export type ContentDomain = "arcanos" | "quizzes" | "lessons" | "modules";

export const CONTENT_FLAGS: Record<ContentDomain, ContentSourceMode> = {
  arcanos: "fallback",
  quizzes: "fallback",
  lessons: "fallback",
  modules: "fallback",
};

export function getFlag(domain: ContentDomain): ContentSourceMode {
  return CONTENT_FLAGS[domain];
}
