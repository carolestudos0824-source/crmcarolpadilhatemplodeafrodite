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
  // Fase 2A — arcanos promovidos para 'auto' apenas para o piloto (Louco, Mago,
  // Sacerdotisa). Para os 19 arcanos restantes a leitura também tenta DB
  // (todos já existem em cms_arcanos como 'published'), mas a UI continua
  // baseada no objeto legado para preservar animação, voz, deepDive e símbolos
  // que ainda não estão totalmente no schema canônico.
  arcanos: "auto",
  // Fase 1 — quizzes promovidos para 'auto':
  // tenta DB primeiro; ausência ou erro cai automaticamente no legado com warn.
  quizzes: "auto",
  lessons: "fallback",
  modules: "fallback",
};

export function getFlag(domain: ContentDomain): ContentSourceMode {
  return CONTENT_FLAGS[domain];
}
