/**
 * Registry técnico dos 4 naipes — config local permitida.
 *
 * Este arquivo é o ponto de entrada oficial das telas (NaipePage,
 * NumerologiaPage, NaipeIntroPage, CartasCortePage) para metadados
 * de naipes. Encapsula `src/data/arcanos-menores/*`, que permanece
 * apenas como SEED legado consumido pelo adaptador `repo-legacy-*`.
 *
 * REGRA: telas NUNCA importam `@/data/arcanos-menores` diretamente.
 * Sempre importar a partir daqui.
 */

// eslint-disable-next-line no-restricted-imports
export {
  NAIPES,
  NAIPE_ORDER,
  CARD_POSITIONS,
  getCardName,
  getCardId,
  getCardsByNaipe,
  getArcanoMenor,
  getArcanoMenorByPosition,
  getNaipeInfo,
  getContentProgress,
  getPositionIndex,
  getPositionLabel,
  hasContent,
  isCourtCard,
} from "@/data/arcanos-menores";

// eslint-disable-next-line no-restricted-imports
export type {
  Naipe,
  CartaCorte,
  CartaPosicao,
  NaipeInfo,
  QuizQuestion,
  RevisaoRapida,
  ArcanoMenorEditorial,
} from "@/data/arcanos-menores";
