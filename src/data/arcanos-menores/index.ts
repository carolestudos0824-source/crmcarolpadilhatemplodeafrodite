/**
 * @deprecated [Fase 6.6 — Faxina final]
 * Arquivo legado mantido apenas como SEED / BACKUP / ROLLBACK.
 * NÃO importar no runtime (páginas, componentes, hooks).
 * Runtime principal: @/lib/content (DB) + @/content/** + @/config/** + @/registry/**.
 * Importação fora de src/lib/content/**, src/data/** ou src/components/admin/** é bloqueada por ESLint.
 */
/**
 * Arcanos Menores — Data Architecture
 * 56 cards across 4 suits, ready for content expansion.
 */

// ─── Types ────────────────────────────────────────────────────────

export type Naipe = "copas" | "paus" | "espadas" | "ouros";
export type CartaCorte = "pajem" | "cavaleiro" | "rainha" | "rei";
export type CartaPosicao = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "pajem" | "cavaleiro" | "rainha" | "rei";

export interface NaipeInfo {
  id: Naipe;
  name: string;
  subtitle: string;
  element: string;
  elementSymbol: string;
  icon: string;
  description: string;
  color: {
    primary: string;   // HSL string
    surface: string;
    border: string;
  };
  keywords: string[];
  totalCards: 14;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RevisaoRapida {
  palavraChave: string;
  luz: string;
  sombra: string;
  licaoCentral: string;
  aplicacaoPratica: string;
  fraseFixacao: string;
}

export interface ArcanoMenorEditorial {
  /** Unique ID, e.g. "copas-1", "espadas-pajem" */
  id: string;
  /** Numeric position (1-10) or court role */
  posicao: CartaPosicao;
  /** Full name, e.g. "Ás de Copas" */
  nome: string;
  /** Suit */
  naipe: Naipe;
  /** Short thematic subtitle */
  subtitulo: string;
  /** Core meaning in ~2 sentences */
  essencia: string;
  /** Key symbols in the card */
  simbolosCentrais: string;
  /** Archetype represented */
  arquetipo: string;
  /** Upright / light meaning */
  luz: string;
  /** Reversed / shadow meaning */
  sombra: string;
  /** Practical life lesson */
  licaoPratica: string;
  /** Love interpretation */
  interpretacaoAmor: string;
  /** Work/career interpretation */
  interpretacaoTrabalho: string;
  /** Spiritual interpretation */
  interpretacaoEspiritualidade: string;
  /** First-person voice of the card */
  vozDaCarta: string;
  /** Deep symbolic/historical expansion */
  aprofundamento: string;
  /** Reflection questions for the student */
  perguntasReflexao: string[];
  /** Quiz questions */
  quiz: QuizQuestion[];
  /** Quick review data */
  revisaoRapida: RevisaoRapida;
  /** Unlocked status (runtime, not persisted here) */
  desbloqueado: boolean;
  /** Card image path */
  cardImage: string;
}

// ─── Suit Definitions ─────────────────────────────────────────────

export const NAIPES: Record<Naipe, NaipeInfo> = {
  copas: {
    id: "copas",
    name: "Naipe de Copas",
    subtitle: "O Elemento Água",
    element: "Água",
    elementSymbol: "🜄",
    icon: "💧",
    description: "Copas governa o mundo emocional: amor, relacionamentos, intuição, sonhos e a vida interior. É o naipe do coração, da empatia e da conexão humana.",
    color: {
      primary: "hsl(200 60% 45%)",
      surface: "hsl(200 40% 95%)",
      border: "hsl(200 50% 70% / 0.35)",
    },
    keywords: ["Emoção", "Amor", "Intuição", "Relacionamentos", "Sonhos"],
    totalCards: 14,
  },
  paus: {
    id: "paus",
    name: "Naipe de Paus",
    subtitle: "O Elemento Fogo",
    element: "Fogo",
    elementSymbol: "🜂",
    icon: "🔥",
    description: "Paus governa a ação, a criatividade, a paixão e a vontade. É o naipe da energia vital, do empreendedorismo e da força motriz que transforma intenção em realidade.",
    color: {
      primary: "hsl(15 70% 50%)",
      surface: "hsl(15 50% 96%)",
      border: "hsl(15 60% 65% / 0.35)",
    },
    keywords: ["Ação", "Criatividade", "Paixão", "Vontade", "Energia"],
    totalCards: 14,
  },
  espadas: {
    id: "espadas",
    name: "Naipe de Espadas",
    subtitle: "O Elemento Ar",
    element: "Ar",
    elementSymbol: "🜁",
    icon: "⚔️",
    description: "Espadas governa a mente: pensamento, comunicação, conflito, verdade e clareza intelectual. É o naipe do discernimento, mas também da dor que vem da lucidez.",
    color: {
      primary: "hsl(210 40% 50%)",
      surface: "hsl(210 25% 95%)",
      border: "hsl(210 35% 65% / 0.35)",
    },
    keywords: ["Mente", "Verdade", "Conflito", "Comunicação", "Clareza"],
    totalCards: 14,
  },
  ouros: {
    id: "ouros",
    name: "Naipe de Ouros",
    subtitle: "O Elemento Terra",
    element: "Terra",
    elementSymbol: "🜃",
    icon: "💎",
    description: "Ouros governa o mundo material: corpo, dinheiro, trabalho, saúde e manifestação. É o naipe da prosperidade, da construção e da relação com o mundo concreto.",
    color: {
      primary: "hsl(45 65% 45%)",
      surface: "hsl(45 45% 96%)",
      border: "hsl(45 55% 60% / 0.35)",
    },
    keywords: ["Matéria", "Prosperidade", "Corpo", "Trabalho", "Manifestação"],
    totalCards: 14,
  },
};

// ─── Card Name Helpers ────────────────────────────────────────────

const NUMERAL_NAMES: Record<number, string> = {
  1: "Ás",
  2: "Dois",
  3: "Três",
  4: "Quatro",
  5: "Cinco",
  6: "Seis",
  7: "Sete",
  8: "Oito",
  9: "Nove",
  10: "Dez",
};

const COURT_NAMES: Record<CartaCorte, string> = {
  pajem: "Pajem",
  cavaleiro: "Cavaleiro",
  rainha: "Rainha",
  rei: "Rei",
};

const NAIPE_DISPLAY: Record<Naipe, string> = {
  copas: "Copas",
  paus: "Paus",
  espadas: "Espadas",
  ouros: "Ouros",
};

export function getCardName(posicao: CartaPosicao, naipe: Naipe): string {
  if (typeof posicao === "number") {
    return `${NUMERAL_NAMES[posicao]} de ${NAIPE_DISPLAY[naipe]}`;
  }
  return `${COURT_NAMES[posicao]} de ${NAIPE_DISPLAY[naipe]}`;
}

export function getCardId(posicao: CartaPosicao, naipe: Naipe): string {
  return `${naipe}-${posicao}`;
}

// ─── All 56 Card Positions (ordered) ──────────────────────────────

export const CARD_POSITIONS: CartaPosicao[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  "pajem", "cavaleiro", "rainha", "rei",
];

export const NAIPE_ORDER: Naipe[] = ["copas", "paus", "espadas", "ouros"];

// ─── Scaffold: Empty Cards for Content Expansion ──────────────────

function createEmptyCard(posicao: CartaPosicao, naipe: Naipe): ArcanoMenorEditorial {
  const id = getCardId(posicao, naipe);
  const nome = getCardName(posicao, naipe);

  return {
    id,
    posicao,
    nome,
    naipe,
    subtitulo: "",
    essencia: "",
    simbolosCentrais: "",
    arquetipo: "",
    luz: "",
    sombra: "",
    licaoPratica: "",
    interpretacaoAmor: "",
    interpretacaoTrabalho: "",
    interpretacaoEspiritualidade: "",
    vozDaCarta: "",
    aprofundamento: "",
    perguntasReflexao: [],
    quiz: [],
    revisaoRapida: {
      palavraChave: "",
      luz: "",
      sombra: "",
      licaoCentral: "",
      aplicacaoPratica: "",
      fraseFixacao: "",
    },
    desbloqueado: false,
    cardImage: `/assets/arcanos-menores/${id}.jpg`,
  };
}

// ─── Content Imports ──────────────────────────────────────────────

import { COPAS_1_5 } from "./copas-1-5";
import { COPAS_6_10 } from "./copas-6-10";
import { COPAS_CORTE } from "./copas-corte";
import { PAUS_1_5 } from "./paus-1-5";
import { PAUS_6_10 } from "./paus-6-10";
import { PAUS_CORTE } from "./paus-corte";
import { ESPADAS_1_5 } from "./espadas-1-5";
import { ESPADAS_6_10 } from "./espadas-6-10";
import { ESPADAS_CORTE } from "./espadas-corte";
import { OUROS_1_5 } from "./ouros-1-5";
import { OUROS_6_10 } from "./ouros-6-10";
import { OUROS_CORTE } from "./ouros-corte";

/** Merge editorial content into scaffolded cards */
function mergeContent(
  cards: ArcanoMenorEditorial[],
  contentBatches: Partial<ArcanoMenorEditorial>[][]
): ArcanoMenorEditorial[] {
  const contentMap = new Map<string, Partial<ArcanoMenorEditorial>>();
  for (const batch of contentBatches) {
    for (const c of batch) {
      if (c.id) contentMap.set(c.id, c);
    }
  }
  return cards.map((card) => {
    const content = contentMap.get(card.id);
    return content ? { ...card, ...content } : card;
  });
}

/** All 56 Minor Arcana cards, scaffolded and filled with available content */
export const ARCANOS_MENORES: ArcanoMenorEditorial[] = mergeContent(
  NAIPE_ORDER.flatMap((naipe) => CARD_POSITIONS.map((pos) => createEmptyCard(pos, naipe))),
  [COPAS_1_5, COPAS_6_10, COPAS_CORTE, PAUS_1_5, PAUS_6_10, PAUS_CORTE, ESPADAS_1_5, ESPADAS_6_10, ESPADAS_CORTE, OUROS_1_5, OUROS_6_10, OUROS_CORTE]
);

// ─── Lookup Helpers ───────────────────────────────────────────────

/** Get all cards for a specific suit */
export function getCardsByNaipe(naipe: Naipe): ArcanoMenorEditorial[] {
  return ARCANOS_MENORES.filter((c) => c.naipe === naipe);
}

/** Get a single card by ID */
export function getArcanoMenor(id: string): ArcanoMenorEditorial | undefined {
  return ARCANOS_MENORES.find((c) => c.id === id);
}

/** Get a card by suit and position */
export function getArcanoMenorByPosition(naipe: Naipe, posicao: CartaPosicao): ArcanoMenorEditorial | undefined {
  return ARCANOS_MENORES.find((c) => c.naipe === naipe && c.posicao === posicao);
}

/** Check if a card has content (non-empty essencia) */
export function hasContent(card: ArcanoMenorEditorial): boolean {
  return card.essencia.length > 0;
}

/** Get suit info */
export function getNaipeInfo(naipe: Naipe): NaipeInfo {
  return NAIPES[naipe];
}

/** Count cards with content per suit */
export function getContentProgress(naipe: Naipe): { total: number; filled: number } {
  const cards = getCardsByNaipe(naipe);
  return {
    total: cards.length,
    filled: cards.filter(hasContent).length,
  };
}

/** Get the order index of a card position (0-13) */
export function getPositionIndex(posicao: CartaPosicao): number {
  return CARD_POSITIONS.indexOf(posicao);
}

// ─── Definição oficial dos 4 naipes (fonte canônica) ──────────────
export {
  NAIPES_OFICIAIS,
  getNaipeOficial,
  getAllNaipesOficiais,
  naipeHsl,
  type NaipeOficial,
} from "./naipes-oficial";

// ─── Registry oficial do deck (acervo dos 56 menores) ─────────────
export {
  DECK_MENORES_REGISTRY,
  DECK_BY_ID,
  DECK_BY_SLUG,
  getDeckEntry,
  getDeckEntryBySlug,
  getDeckByNaipe,
  getDeckByTipo,
  getDeckStats,
  validateDeckIntegrity,
  DECK_OFICIAL_FLAG,
  FROZEN_DECK,
  FROZEN_DECK_VERSION,
  DECK_MENORES_OFICIAL,
  type DeckEntry,
  type StatusValidacao,
  type DeckIntegrityIssue,
} from "./deck-registry";

/** Check if position is a court card */
export function isCourtCard(posicao: CartaPosicao): boolean {
  return typeof posicao === "string";
}

/** Get display label for position */
export function getPositionLabel(posicao: CartaPosicao): string {
  if (typeof posicao === "number") return NUMERAL_NAMES[posicao];
  return COURT_NAMES[posicao];
}