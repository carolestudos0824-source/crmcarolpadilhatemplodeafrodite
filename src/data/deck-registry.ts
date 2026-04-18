/**
 * @deprecated Faxina Final (Fase 6.6) — movido para `@/registry/deck-registry`.
 *
 * Compat interno apenas para `src/data/**` (seed/legacy).
 * Telas/hooks/componentes: usar `@/registry/deck-registry` (ESLint guard ativo).
 */
// eslint-disable-next-line no-restricted-imports
export {
  getCanonicalNumeral,
  getDeckEntry,
  getDeckEntryBySlug,
  validateDeck,
  DECK_REGISTRY,
  MENORES_REGISTRY,
  CORTES_REGISTRY,
  MAIORES_REGISTRY,
  FULL_DECK,
  getCard,
  getCardsByCategory,
  getCardsBySuit,
  getFullDeckSummary,
} from "@/registry/deck-registry";
// eslint-disable-next-line no-restricted-imports
export type {
  CardCategory,
  Suit,
  CourtRank,
  DeckCardEntry,
  DeckEntry,
  DeckValidationRow,
  FullDeckSummary,
} from "@/registry/deck-registry";
