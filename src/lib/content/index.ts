/**
 * Fachada pública da camada de conteúdo.
 *
 * REGRA DE OURO PARA AS TELAS:
 * sempre importe daqui — nunca de `src/data/arcanos*` ou `src/data/*_LESSONS`
 * diretamente. Isso garante que a Fase 8 (cleanup) seja segura.
 */

export {
  getArcanoContent,
  listArcanosContent,
  getQuizContent,
  getLessonContent,
  getModuleContent,
  type GetArcanoParams,
  type GetQuizParams,
  type GetLessonParams,
} from "./service";

export type {
  ArcanoContent,
  QuizContent,
  QuizQuestionContent,
  LessonContent,
  ModuleContent,
  UseContentResult,
  ContentSource,
  ContentTier,
  ContentStatus,
  ContentNaipe,
  ContentArcanoTipo,
} from "./types";

export { CONTENT_FLAGS, getFlag, type ContentDomain, type ContentSourceMode } from "./flags";
