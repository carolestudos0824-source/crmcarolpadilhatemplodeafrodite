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
  // Fase 2/3 — arcanos (Maiores, Menores e Cortes) já carregam via DB com
  // fallback automático para o legado em caso de erro.
  arcanos: "auto",
  // Fase 1 — quizzes via DB com fallback.
  quizzes: "auto",
  // Fase 4A — piloto controlado: módulo Fundamentos + 3 lições reais.
  // Como o serviço usa DB-first com fallback automático para o legado,
  // promover para 'auto' é seguro — qualquer lição/módulo ainda não semeado
  // continua resolvendo via legado e emite warn de telemetria.
  lessons: "auto",
  modules: "auto",
};

export function getFlag(domain: ContentDomain): ContentSourceMode {
  return CONTENT_FLAGS[domain];
}
