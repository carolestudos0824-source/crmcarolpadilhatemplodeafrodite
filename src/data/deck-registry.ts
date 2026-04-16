/**
 * DECK OFICIAL — Rider-Waite-Smith
 * =================================
 * Single source of truth para TODAS as 78 cartas:
 *  · 22 Arcanos Maiores
 *  · 40 Arcanos Menores numerados (1-10 × 4 naipes)
 *  · 16 Cartas da Corte (Pajem, Cavaleiro, Rainha, Rei × 4 naipes)
 *
 * Nenhuma tela pode hardcodar numeral, nome ou imagem de carta.
 * Tudo passa por aqui — impede inconsistências entre admin, jornada e lições.
 *
 * Regra: numerais romanos são SEMPRE renderizados via CSS overlay,
 * NUNCA confiamos no que está gravado dentro da imagem.
 */

import placeholderImage from "@/assets/arcano-placeholder.jpg";
import loucoImage from "@/assets/arcano-0-louco.jpg";
import magoImage from "@/assets/arcano-1-mago.jpg";
import sacerdotisaImage from "@/assets/arcano-2-sacerdotisa.jpg";

// ─── Tipos canônicos ─────────────────────────────────────────────
export type CardCategory = "maior" | "menor" | "corte";
export type Suit = "copas" | "paus" | "espadas" | "ouros";
export type CourtRank = "pajem" | "cavaleiro" | "rainha" | "rei";

/** Entrada base de qualquer carta no deck oficial */
export interface DeckCardEntry {
  /** ID único e estável (ex.: "maior-1", "copas-7", "espadas-rainha") */
  id: string;
  category: CardCategory;
  /** Nome oficial em português */
  name: string;
  /** Slug URL-safe */
  slug: string;
  /** Subtítulo poético */
  subtitle: string;
  /** Asset oficial — placeholder enquanto não houver arte fiel ao RWS */
  cardImage: string;
  /** Símbolos centrais canônicos (RWS) */
  canonicalSymbols: string[];
  /** Status do asset visual */
  assetStatus: "official" | "placeholder";

  // Maiores
  /** Número arábico (0–21) — apenas Maiores */
  number?: number;
  /** Numeral romano canônico — apenas Maiores */
  numeral?: string;

  // Menores e Cortes
  naipe?: Suit;
  /** Posição 1-10 — apenas Menores numerados */
  position?: number;
  /** Rank — apenas Cortes */
  court?: CourtRank;
}

/**
 * @deprecated Use DeckCardEntry. Mantido para retrocompatibilidade dos Maiores.
 */
export interface DeckEntry {
  number: number;
  numeral: string;
  name: string;
  slug: string;
  subtitle: string;
  cardImage: string;
  canonicalSymbols: string[];
  assetStatus: "official" | "placeholder";
}

export const DECK_REGISTRY: readonly DeckEntry[] = [
  {
    number: 0, numeral: "0", name: "O Louco", slug: "o-louco",
    subtitle: "O Início da Jornada",
    cardImage: loucoImage, assetStatus: "official",
    canonicalSymbols: ["penhasco", "trouxa", "cão", "flor branca", "céu aberto", "sol"],
  },
  {
    number: 1, numeral: "I", name: "O Mago", slug: "o-mago",
    subtitle: "O Poder da Vontade",
    cardImage: magoImage, assetStatus: "official",
    canonicalSymbols: ["bastão elevado", "mão para baixo", "mesa com 4 elementos", "lemniscata", "jardim de rosas e lírios"],
  },
  {
    number: 2, numeral: "II", name: "A Sacerdotisa", slug: "a-sacerdotisa",
    subtitle: "O Véu do Mistério",
    cardImage: sacerdotisaImage, assetStatus: "official",
    canonicalSymbols: ["colunas Boaz e Jachin", "véu com romãs", "lua crescente aos pés", "rolo Tora", "cruz no peito"],
  },
  {
    number: 3, numeral: "III", name: "A Imperatriz", slug: "a-imperatriz",
    subtitle: "A Abundância Criativa",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["coroa de 12 estrelas", "campo de trigo", "cetro", "escudo de Vênus", "rio fluindo"],
  },
  {
    number: 4, numeral: "IV", name: "O Imperador", slug: "o-imperador",
    subtitle: "A Estrutura e a Ordem",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["trono de pedra com cabeças de carneiro", "cetro ankh", "armadura", "montanhas áridas", "barba branca"],
  },
  {
    number: 5, numeral: "V", name: "O Hierofante", slug: "o-hierofante",
    subtitle: "A Tradição Sagrada",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["tríplice coroa", "cetro papal", "dois discípulos", "duas chaves cruzadas", "colunas"],
  },
  {
    number: 6, numeral: "VI", name: "Os Enamorados", slug: "os-enamorados",
    subtitle: "A Escolha do Coração",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["arcanjo Rafael", "homem e mulher nus", "árvore da vida com chamas", "árvore do conhecimento com serpente", "sol radiante"],
  },
  {
    number: 7, numeral: "VII", name: "O Carro", slug: "o-carro",
    subtitle: "A Vitória da Vontade",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["duas esfinges (preta e branca)", "dossel estrelado", "armadura com luas nos ombros", "cidade ao fundo", "lemniscata"],
  },
  {
    number: 8, numeral: "VIII", name: "A Justiça", slug: "a-justica",
    subtitle: "O Equilíbrio Kármico",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["espada erguida", "balança", "coroa com pedra azul", "manto vermelho", "véu entre colunas"],
  },
  {
    number: 9, numeral: "IX", name: "O Eremita", slug: "o-eremita",
    subtitle: "A Luz Interior",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["lanterna com estrela de seis pontas", "cajado", "manto cinza", "montanha gelada", "cabeça baixa"],
  },
  {
    number: 10, numeral: "X", name: "A Roda da Fortuna", slug: "a-roda-da-fortuna",
    subtitle: "Os Ciclos do Destino",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["roda com letras TARO/YHVH", "esfinge no topo", "serpente descendo", "Anúbis subindo", "quatro criaturas aladas nos cantos"],
  },
  {
    number: 11, numeral: "XI", name: "A Força", slug: "a-forca",
    subtitle: "A Coragem Suave",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["mulher acariciando leão", "lemniscata sobre a cabeça", "guirlanda de flores", "vestido branco", "montanha ao fundo"],
  },
  {
    number: 12, numeral: "XII", name: "O Enforcado", slug: "o-enforcado",
    subtitle: "A Rendição Iluminada",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["homem suspenso de cabeça para baixo", "halo dourado", "cruz em T (Tau)", "perna dobrada formando 4", "expressão serena"],
  },
  {
    number: 13, numeral: "XIII", name: "A Morte", slug: "a-morte",
    subtitle: "A Grande Transformação",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["esqueleto em armadura preta", "estandarte com rosa branca de cinco pétalas", "cavalo branco", "sol nascendo entre torres", "rio"],
  },
  {
    number: 14, numeral: "XIV", name: "A Temperança", slug: "a-temperanca",
    subtitle: "A Alquimia Interior",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["arcanjo com asas", "dois cálices com líquido fluindo", "um pé na água outro na terra", "triângulo no peito", "íris no caminho"],
  },
  {
    number: 15, numeral: "XV", name: "O Diabo", slug: "o-diabo",
    subtitle: "A Sombra das Amarras",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["Baphomet com chifres e asas", "pentagrama invertido na testa", "casal acorrentado", "tocha invertida", "pedestal preto"],
  },
  {
    number: 16, numeral: "XVI", name: "A Torre", slug: "a-torre",
    subtitle: "A Revelação Súbita",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["torre atingida por raio", "coroa caindo", "duas figuras despencando", "22 chamas iod", "céu noturno"],
  },
  {
    number: 17, numeral: "XVII", name: "A Estrela", slug: "a-estrela",
    subtitle: "A Esperança Renovada",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["mulher nua ajoelhada", "estrela de oito pontas central", "sete estrelas menores", "dois cântaros (água na terra e no rio)", "íbis na árvore"],
  },
  {
    number: 18, numeral: "XVIII", name: "A Lua", slug: "a-lua",
    subtitle: "O Caminho da Intuição",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["lua com rosto de perfil", "15 gotas iod caindo", "cão e lobo uivando", "lagostim saindo da água", "duas torres ao fundo"],
  },
  {
    number: 19, numeral: "XIX", name: "O Sol", slug: "o-sol",
    subtitle: "A Alegria Radiante",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["sol antropomorfizado central", "criança nua sobre cavalo branco", "girassóis", "estandarte vermelho", "muro de pedra"],
  },
  {
    number: 20, numeral: "XX", name: "O Julgamento", slug: "o-julgamento",
    subtitle: "O Despertar Final",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["arcanjo Gabriel com trombeta", "estandarte com cruz vermelha", "figuras se erguendo de caixões", "montanhas geladas", "águas"],
  },
  {
    number: 21, numeral: "XXI", name: "O Mundo", slug: "o-mundo",
    subtitle: "A Completude Sagrada",
    cardImage: placeholderImage, assetStatus: "placeholder",
    canonicalSymbols: ["dançarina nua envolta em estola", "guirlanda oval (mandorla)", "duas varinhas", "quatro criaturas vivas nos cantos (Tetramorfo)", "céu aberto"],
  },
];

// ─── Validação canônica do numeral romano ───
const CANONICAL_NUMERALS = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];

/** Numeral romano oficial para um número de arcano (0-21) */
export function getCanonicalNumeral(n: number): string {
  return CANONICAL_NUMERALS[n] ?? String(n);
}

/** Busca registro oficial por número */
export function getDeckEntry(number: number): DeckEntry | undefined {
  return DECK_REGISTRY.find((e) => e.number === number);
}

/** Busca registro oficial por slug */
export function getDeckEntryBySlug(slug: string): DeckEntry | undefined {
  return DECK_REGISTRY.find((e) => e.slug === slug);
}

/** Validação automática do deck inteiro */
export interface DeckValidationRow {
  number: number;
  name: string;
  numeral: string;
  imageValidated: boolean;
  symbolsValidated: boolean;
  cardLessonMatch: boolean;
  status: "aprovado" | "corrigir";
  notes: string[];
}

export function validateDeck(): DeckValidationRow[] {
  return DECK_REGISTRY.map((entry) => {
    const notes: string[] = [];
    const numeralOk = entry.numeral === getCanonicalNumeral(entry.number);
    if (!numeralOk) notes.push(`Numeral romano divergente (esperado ${getCanonicalNumeral(entry.number)})`);

    const imageValidated = entry.assetStatus === "official";
    if (!imageValidated) notes.push("Imagem placeholder — arte RWS oficial pendente");

    const symbolsValidated = entry.canonicalSymbols.length >= 4;
    if (!symbolsValidated) notes.push("Símbolos canônicos incompletos");

    const cardLessonMatch = numeralOk && entry.name.length > 0 && entry.slug.length > 0;

    const status: "aprovado" | "corrigir" =
      numeralOk && symbolsValidated && cardLessonMatch && imageValidated ? "aprovado" : "corrigir";

    return {
      number: entry.number,
      name: entry.name,
      numeral: entry.numeral,
      imageValidated,
      symbolsValidated,
      cardLessonMatch,
      status,
      notes,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// ARCANOS MENORES (40) + CARTAS DA CORTE (16)
// ═══════════════════════════════════════════════════════════════════

const SUIT_META: Record<Suit, { name: string; element: string; symbols: string[] }> = {
  copas:    { name: "Copas",    element: "Água",  symbols: ["cálice", "água", "peixes", "lótus"] },
  paus:     { name: "Paus",     element: "Fogo",  symbols: ["bastão florescido", "salamandra", "deserto", "folhas brotando"] },
  espadas:  { name: "Espadas",  element: "Ar",    symbols: ["lâmina", "nuvens", "vento", "pássaros"] },
  ouros:    { name: "Ouros",    element: "Terra", symbols: ["pentáculo", "moeda dourada", "jardim", "uvas"] },
};

const COURT_META: Record<CourtRank, { name: string; archetype: string }> = {
  pajem:      { name: "Pajem",      archetype: "mensageiro / aprendiz" },
  cavaleiro:  { name: "Cavaleiro",  archetype: "ação / movimento" },
  rainha:     { name: "Rainha",     archetype: "maturidade interior" },
  rei:        { name: "Rei",        archetype: "domínio externo" },
};

const SUITS: Suit[] = ["copas", "paus", "espadas", "ouros"];
const COURTS: CourtRank[] = ["pajem", "cavaleiro", "rainha", "rei"];

const numberName = (n: number) =>
  n === 1 ? "Ás" : ["Dois","Três","Quatro","Cinco","Seis","Sete","Oito","Nove","Dez"][n - 2];

/** 40 Arcanos Menores numerados (1-10 × 4 naipes) */
export const MENORES_REGISTRY: readonly DeckCardEntry[] = SUITS.flatMap((suit) =>
  Array.from({ length: 10 }, (_, i) => {
    const pos = i + 1;
    const meta = SUIT_META[suit];
    return {
      id: `${suit}-${pos}`,
      category: "menor" as const,
      name: `${numberName(pos)} de ${meta.name}`,
      slug: `${suit}-${pos}`,
      subtitle: `${meta.element} · posição ${pos}`,
      cardImage: placeholderImage,
      assetStatus: "placeholder" as const,
      canonicalSymbols: meta.symbols,
      naipe: suit,
      position: pos,
    };
  })
);

/** 16 Cartas da Corte (4 ranks × 4 naipes) */
export const CORTES_REGISTRY: readonly DeckCardEntry[] = SUITS.flatMap((suit) =>
  COURTS.map((rank) => {
    const sm = SUIT_META[suit];
    const cm = COURT_META[rank];
    return {
      id: `${suit}-${rank}`,
      category: "corte" as const,
      name: `${cm.name} de ${sm.name}`,
      slug: `${suit}-${rank}`,
      subtitle: `${cm.archetype} · ${sm.element}`,
      cardImage: placeholderImage,
      assetStatus: "placeholder" as const,
      canonicalSymbols: sm.symbols,
      naipe: suit,
      court: rank,
    };
  })
);

/** Maiores convertidos para o formato unificado DeckCardEntry */
export const MAIORES_REGISTRY: readonly DeckCardEntry[] = DECK_REGISTRY.map((e) => ({
  id: `maior-${e.number}`,
  category: "maior",
  name: e.name,
  slug: e.slug,
  subtitle: e.subtitle,
  cardImage: e.cardImage,
  assetStatus: e.assetStatus,
  canonicalSymbols: e.canonicalSymbols,
  number: e.number,
  numeral: e.numeral,
}));

/** Deck completo — 78 cartas oficiais */
export const FULL_DECK: readonly DeckCardEntry[] = [
  ...MAIORES_REGISTRY,
  ...MENORES_REGISTRY,
  ...CORTES_REGISTRY,
];

/** Busca qualquer carta por id estável (ex.: "maior-1", "copas-7", "espadas-rainha") */
export function getCard(id: string): DeckCardEntry | undefined {
  return FULL_DECK.find((c) => c.id === id);
}

/** Busca cartas por categoria */
export function getCardsByCategory(category: CardCategory): DeckCardEntry[] {
  return FULL_DECK.filter((c) => c.category === category);
}

/** Busca cartas por naipe (Menores + Cortes) */
export function getCardsBySuit(suit: Suit): DeckCardEntry[] {
  return FULL_DECK.filter((c) => c.naipe === suit);
}

/** Resumo de validação de todo o deck (78 cartas) */
export interface FullDeckSummary {
  total: number;
  approved: number;
  placeholders: number;
  byCategory: Record<CardCategory, { total: number; official: number; placeholder: number }>;
}

export function getFullDeckSummary(): FullDeckSummary {
  const summary: FullDeckSummary = {
    total: FULL_DECK.length,
    approved: 0,
    placeholders: 0,
    byCategory: {
      maior: { total: 0, official: 0, placeholder: 0 },
      menor: { total: 0, official: 0, placeholder: 0 },
      corte: { total: 0, official: 0, placeholder: 0 },
    },
  };
  for (const c of FULL_DECK) {
    const bucket = summary.byCategory[c.category];
    bucket.total++;
    if (c.assetStatus === "official") {
      bucket.official++;
      summary.approved++;
    } else {
      bucket.placeholder++;
      summary.placeholders++;
    }
  }
  return summary;
}

