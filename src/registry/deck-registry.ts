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

// ─── Menores oficiais (scans RWS, domínio público) ───
import menorCopas1 from "@/assets/menor-copas-1.jpg";
import menorCopas2 from "@/assets/menor-copas-2.jpg";
import menorCopas3 from "@/assets/menor-copas-3.jpg";
import menorCopas4 from "@/assets/menor-copas-4.jpg";
import menorCopas5 from "@/assets/menor-copas-5.jpg";
import menorCopas6 from "@/assets/menor-copas-6.jpg";
import menorCopas7 from "@/assets/menor-copas-7.jpg";
import menorCopas8 from "@/assets/menor-copas-8.jpg";
import menorCopas9 from "@/assets/menor-copas-9.jpg";
import menorCopas10 from "@/assets/menor-copas-10.jpg";
import menorPaus1 from "@/assets/menor-paus-1.jpg";
import menorPaus2 from "@/assets/menor-paus-2.jpg";
import menorPaus3 from "@/assets/menor-paus-3.jpg";

import loucoImage from "@/assets/arcano-0-louco.jpg";
import magoImage from "@/assets/arcano-1-mago.jpg";
import sacerdotisaImage from "@/assets/arcano-2-sacerdotisa.jpg";
import imperatrizImage from "@/assets/arcano-3-imperatriz.jpg";
import imperadorImage from "@/assets/arcano-4-imperador.jpg";
import hierofanteImage from "@/assets/arcano-5-hierofante.jpg";
import enamoradosImage from "@/assets/arcano-6-enamorados.jpg";
import carroImage from "@/assets/arcano-7-carro.jpg";
import justicaImage from "@/assets/arcano-8-justica.jpg";
import eremitaImage from "@/assets/arcano-9-eremita.jpg";
import rodaFortunaImage from "@/assets/arcano-10-roda-fortuna.jpg";
import forcaImage from "@/assets/arcano-11-forca.jpg";
import enforcadoImage from "@/assets/arcano-12-enforcado.jpg";
import morteImage from "@/assets/arcano-13-morte.jpg";
import temperancaImage from "@/assets/arcano-14-temperanca.jpg";
import diaboImage from "@/assets/arcano-15-diabo.jpg";
import torreImage from "@/assets/arcano-16-torre.jpg";
import estrelaImage from "@/assets/arcano-17-estrela.jpg";
import luaImage from "@/assets/arcano-18-lua.jpg";
import solImage from "@/assets/arcano-19-sol.jpg";
import julgamentoImage from "@/assets/arcano-20-julgamento.jpg";
import mundoImage from "@/assets/arcano-21-mundo.jpg";

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
    cardImage: imperatrizImage, assetStatus: "official",
    canonicalSymbols: ["coroa de 12 estrelas", "campo de trigo", "cetro", "escudo de Vênus", "rio fluindo"],
  },
  {
    number: 4, numeral: "IV", name: "O Imperador", slug: "o-imperador",
    subtitle: "A Estrutura e a Ordem",
    cardImage: imperadorImage, assetStatus: "official",
    canonicalSymbols: ["trono de pedra com cabeças de carneiro", "cetro ankh", "armadura", "montanhas áridas", "barba branca"],
  },
  {
    number: 5, numeral: "V", name: "O Hierofante", slug: "o-hierofante",
    subtitle: "A Tradição Sagrada",
    cardImage: hierofanteImage, assetStatus: "official",
    canonicalSymbols: ["tríplice coroa", "cetro papal", "dois discípulos", "duas chaves cruzadas", "colunas"],
  },
  {
    number: 6, numeral: "VI", name: "Os Enamorados", slug: "os-enamorados",
    subtitle: "A Escolha do Coração",
    cardImage: enamoradosImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo Rafael", "homem e mulher nus", "árvore da vida com chamas", "árvore do conhecimento com serpente", "sol radiante"],
  },
  {
    number: 7, numeral: "VII", name: "O Carro", slug: "o-carro",
    subtitle: "A Vitória da Vontade",
    cardImage: carroImage, assetStatus: "official",
    canonicalSymbols: ["duas esfinges (preta e branca)", "dossel estrelado", "armadura com luas nos ombros", "cidade ao fundo", "lemniscata"],
  },
  {
    number: 8, numeral: "VIII", name: "A Justiça", slug: "a-justica",
    subtitle: "O Equilíbrio Kármico",
    cardImage: justicaImage, assetStatus: "official",
    canonicalSymbols: ["espada erguida", "balança", "coroa com pedra azul", "manto vermelho", "véu entre colunas"],
  },
  {
    number: 9, numeral: "IX", name: "O Eremita", slug: "o-eremita",
    subtitle: "A Luz Interior",
    cardImage: eremitaImage, assetStatus: "official",
    canonicalSymbols: ["lanterna com estrela de seis pontas", "cajado", "manto cinza", "montanha gelada", "cabeça baixa"],
  },
  {
    number: 10, numeral: "X", name: "A Roda da Fortuna", slug: "a-roda-da-fortuna",
    subtitle: "Os Ciclos do Destino",
    cardImage: rodaFortunaImage, assetStatus: "official",
    canonicalSymbols: ["roda com letras TARO/YHVH", "esfinge no topo", "serpente descendo", "Anúbis subindo", "quatro criaturas aladas nos cantos"],
  },
  {
    number: 11, numeral: "XI", name: "A Força", slug: "a-forca",
    subtitle: "A Coragem Suave",
    cardImage: forcaImage, assetStatus: "official",
    canonicalSymbols: ["mulher acariciando leão", "lemniscata sobre a cabeça", "guirlanda de flores", "vestido branco", "montanha ao fundo"],
  },
  {
    number: 12, numeral: "XII", name: "O Enforcado", slug: "o-enforcado",
    subtitle: "A Rendição Iluminada",
    cardImage: enforcadoImage, assetStatus: "official",
    canonicalSymbols: ["homem suspenso de cabeça para baixo", "halo dourado", "cruz em T (Tau)", "perna dobrada formando 4", "expressão serena"],
  },
  {
    number: 13, numeral: "XIII", name: "A Morte", slug: "a-morte",
    subtitle: "A Grande Transformação",
    cardImage: morteImage, assetStatus: "official",
    canonicalSymbols: ["esqueleto em armadura preta", "estandarte com rosa branca de cinco pétalas", "cavalo branco", "sol nascendo entre torres", "rio"],
  },
  {
    number: 14, numeral: "XIV", name: "A Temperança", slug: "a-temperanca",
    subtitle: "A Alquimia Interior",
    cardImage: temperancaImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo com asas", "dois cálices com líquido fluindo", "um pé na água outro na terra", "triângulo no peito", "íris no caminho"],
  },
  {
    number: 15, numeral: "XV", name: "O Diabo", slug: "o-diabo",
    subtitle: "A Sombra das Amarras",
    cardImage: diaboImage, assetStatus: "official",
    canonicalSymbols: ["Baphomet com chifres e asas", "pentagrama invertido na testa", "casal acorrentado", "tocha invertida", "pedestal preto"],
  },
  {
    number: 16, numeral: "XVI", name: "A Torre", slug: "a-torre",
    subtitle: "A Revelação Súbita",
    cardImage: torreImage, assetStatus: "official",
    canonicalSymbols: ["torre atingida por raio", "coroa caindo", "duas figuras despencando", "22 chamas iod", "céu noturno"],
  },
  {
    number: 17, numeral: "XVII", name: "A Estrela", slug: "a-estrela",
    subtitle: "A Esperança Renovada",
    cardImage: estrelaImage, assetStatus: "official",
    canonicalSymbols: ["mulher nua ajoelhada", "estrela de oito pontas central", "sete estrelas menores", "dois cântaros (água na terra e no rio)", "íbis na árvore"],
  },
  {
    number: 18, numeral: "XVIII", name: "A Lua", slug: "a-lua",
    subtitle: "O Caminho da Intuição",
    cardImage: luaImage, assetStatus: "official",
    canonicalSymbols: ["lua com rosto de perfil", "15 gotas iod caindo", "cão e lobo uivando", "lagostim saindo da água", "duas torres ao fundo"],
  },
  {
    number: 19, numeral: "XIX", name: "O Sol", slug: "o-sol",
    subtitle: "A Alegria Radiante",
    cardImage: solImage, assetStatus: "official",
    canonicalSymbols: ["sol antropomorfizado central", "criança nua sobre cavalo branco", "girassóis", "estandarte vermelho", "muro de pedra"],
  },
  {
    number: 20, numeral: "XX", name: "O Julgamento", slug: "o-julgamento",
    subtitle: "O Despertar Final",
    cardImage: julgamentoImage, assetStatus: "official",
    canonicalSymbols: ["arcanjo Gabriel com trombeta", "estandarte com cruz vermelha", "figuras se erguendo de caixões", "montanhas geladas", "águas"],
  },
  {
    number: 21, numeral: "XXI", name: "O Mundo", slug: "o-mundo",
    subtitle: "A Completude Sagrada",
    cardImage: mundoImage, assetStatus: "official",
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

/**
 * Overrides oficiais dos Menores — scans Rider-Waite-Smith (Wikimedia Commons, domínio público).
 *
 * Cada entrada substitui o placeholder padrão e fornece símbolos canônicos da cena RWS
 * (não pip decorativo). Entradas ausentes permanecem como placeholder até oficialização.
 */
const MENORES_OFFICIAL_OVERRIDES: Partial<Record<string, {
  cardImage: string;
  canonicalSymbols: string[];
  subtitle: string;
}>> = {
  "copas-1": {
    cardImage: menorCopas1,
    subtitle: "O Cálice Transbordante",
    canonicalSymbols: [
      "mão divina emergindo da nuvem",
      "cálice dourado com a letra W (Water)",
      "pomba descendo com hóstia em cruz",
      "cinco jatos de água",
      "lago coberto de lótus",
    ],
  },
  "copas-2": {
    cardImage: menorCopas2,
    subtitle: "A União dos Opostos",
    canonicalSymbols: [
      "casal trocando cálices",
      "caduceu de Hermes entre eles",
      "cabeça de leão alada coroando o caduceu",
      "guirlanda de louros na mulher",
      "casa ao fundo na colina",
    ],
  },
  "copas-3": {
    cardImage: menorCopas3,
    subtitle: "A Celebração da Comunhão",
    canonicalSymbols: [
      "três mulheres dançando em círculo",
      "três cálices erguidos em brinde",
      "guirlandas de flores e frutas",
      "abóboras e uvas aos pés (abundância)",
      "céu aberto sem nuvens",
    ],
  },
  "copas-4": {
    cardImage: menorCopas4,
    subtitle: "A Apatia e o Cálice Oferecido",
    canonicalSymbols: [
      "jovem sentado sob a árvore com braços cruzados",
      "três cálices alinhados no chão à sua frente",
      "quarto cálice oferecido por mão emergindo da nuvem",
      "olhar contemplativo e desinteressado",
      "colina verde isolando a cena",
    ],
  },
  "copas-5": {
    cardImage: menorCopas5,
    subtitle: "O Luto e o que Permanece",
    canonicalSymbols: [
      "figura encapuzada de manto negro",
      "três cálices derramados aos pés",
      "dois cálices ainda em pé atrás dela",
      "rio escuro a separar a margem",
      "ponte ao fundo levando ao castelo",
    ],
  },
  "copas-6": {
    cardImage: menorCopas6,
    subtitle: "A Memória e a Inocência",
    canonicalSymbols: [
      "criança maior entregando cálice com flor branca",
      "criança menor recebendo a oferta",
      "seis cálices floridos com flores brancas de cinco pétalas",
      "vila medieval ao fundo",
      "sentinela em xadrez se afastando",
    ],
  },
  "copas-7": {
    cardImage: menorCopas7,
    subtitle: "As Visões e a Ilusão",
    canonicalSymbols: [
      "figura em silhueta diante de sete cálices nas nuvens",
      "cálice com cabeça humana (desejo)",
      "cálice com figura velada luminosa (espiritualidade)",
      "cálice com serpente (sabedoria/tentação)",
      "cálice com castelo (ambição), joias (riqueza), louros (vitória) e dragão (medo)",
    ],
  },
  "copas-8": {
    cardImage: menorCopas8,
    subtitle: "A Partida Silenciosa",
    canonicalSymbols: [
      "figura encapuzada de manto vermelho se afastando",
      "bastão na mão apoiando a caminhada",
      "oito cálices empilhados deixados para trás (cinco embaixo, três em cima)",
      "lua eclipsando o sol no céu",
      "rio e montanhas indicando a travessia",
    ],
  },
  "copas-9": {
    cardImage: menorCopas9,
    subtitle: "A Satisfação Plena",
    canonicalSymbols: [
      "homem sentado em banco baixo, braços cruzados",
      "chapéu vermelho com pluma",
      "nove cálices alinhados em arco sobre mesa coberta de tecido azul",
      "expressão satisfeita e segura",
      "fundo amarelo dourado uniforme (plenitude material)",
    ],
  },
  "copas-10": {
    cardImage: menorCopas10,
    subtitle: "O Arco-Íris da Família",
    canonicalSymbols: [
      "casal de braços abertos celebrando o céu",
      "duas crianças dançando de mãos dadas",
      "arco-íris formado por dez cálices no alto",
      "casa entre as árvores ao fundo",
      "rio sereno cortando o vale verde",
    ],
  },
  "paus-1": {
    cardImage: menorPaus1,
    subtitle: "A Centelha Criadora",
    canonicalSymbols: [
      "mão divina emergindo da nuvem segurando o bastão",
      "bastão verde florescendo com folhas vivas",
      "oito folhas caindo em forma de yod (chama hebraica)",
      "castelo no alto da colina ao fundo",
      "vale verde fértil sob o bastão",
    ],
  },
  "paus-2": {
    cardImage: menorPaus2,
    subtitle: "O Mundo na Palma da Mão",
    canonicalSymbols: [
      "homem nobre vestido em manto vermelho no parapeito",
      "globo terrestre seguro na mão direita",
      "bastão à esquerda fixo no chão, segundo bastão preso à muralha",
      "rosas e lírios cruzados em emblema (paixão e pureza)",
      "vista do alto sobre o mar e a costa",
    ],
  },
  "paus-3": {
    cardImage: menorPaus3,
    subtitle: "A Espera no Horizonte",
    canonicalSymbols: [
      "figura de costas no alto do penhasco",
      "três bastões fincados no chão à sua volta",
      "mão apoiada num dos bastões em postura de vigília",
      "navios partindo no mar amarelo dourado",
      "manto vermelho e verde sinalizando ação e crescimento",
    ],
  },
};

/** 40 Arcanos Menores numerados (1-10 × 4 naipes) */
export const MENORES_REGISTRY: readonly DeckCardEntry[] = SUITS.flatMap((suit) =>
  Array.from({ length: 10 }, (_, i) => {
    const pos = i + 1;
    const meta = SUIT_META[suit];
    const id = `${suit}-${pos}`;
    const override = MENORES_OFFICIAL_OVERRIDES[id];
    return {
      id,
      category: "menor" as const,
      name: `${numberName(pos)} de ${meta.name}`,
      slug: id,
      subtitle: override?.subtitle ?? `${meta.element} · posição ${pos}`,
      cardImage: override?.cardImage ?? placeholderImage,
      assetStatus: (override ? "official" : "placeholder") as "official" | "placeholder",
      canonicalSymbols: override?.canonicalSymbols ?? meta.symbols,
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

