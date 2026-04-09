import { THE_FOOL, THE_MAGICIAN, THE_HIGH_PRIESTESS, type ArcanoData, type QuizQuestion } from "./tarot-data";

/** Flashcard for symbol ↔ meaning association */
export interface Flashcard {
  id: string;
  arcanoId: number;
  front: string; // symbol or keyword
  back: string; // meaning / explanation
  category: "symbol" | "archetype" | "light-shadow" | "keyword" | "cabala";
}

/** A daily challenge — short, timed micro-review */
export interface DailyChallenge {
  id: string;
  date: string; // ISO date string
  type: "flashcard-set" | "quick-quiz" | "association";
  title: string;
  subtitle: string;
  items: string[]; // flashcard or quiz IDs
  xpReward: number;
}

/** Review item tracked for spaced repetition */
export interface ReviewItem {
  id: string;
  type: "flashcard" | "quiz";
  arcanoId: number;
  easeFactor: number; // 2.5 default, adjusts based on performance
  interval: number; // days until next review
  nextReview: string; // ISO date
  repetitions: number;
  lastAnswer?: "correct" | "incorrect" | "hard";
}

/** Generate flashcards from arcano data */
function generateFlashcards(arcano: ArcanoData): Flashcard[] {
  const cards: Flashcard[] = [];
  const prefix = `fc-${arcano.id}`;

  // Keywords
  arcano.keywords.forEach((kw, i) => {
    cards.push({
      id: `${prefix}-kw-${i}`,
      arcanoId: arcano.id,
      front: kw,
      back: `Palavra-chave de ${arcano.name} (${arcano.numeral}) — ${arcano.subtitle}`,
      category: "keyword",
    });
  });

  // Archetype
  cards.push({
    id: `${prefix}-arch`,
    arcanoId: arcano.id,
    front: `Qual é o arquétipo de ${arcano.name}?`,
    back: arcano.archetype,
    category: "archetype",
  });

  // Light
  cards.push({
    id: `${prefix}-light`,
    arcanoId: arcano.id,
    front: `Qual é a LUZ de ${arcano.name}?`,
    back: arcano.layers.main.light,
    category: "light-shadow",
  });

  // Shadow
  cards.push({
    id: `${prefix}-shadow`,
    arcanoId: arcano.id,
    front: `Qual é a SOMBRA de ${arcano.name}?`,
    back: arcano.layers.main.shadow,
    category: "light-shadow",
  });

  // Essence
  cards.push({
    id: `${prefix}-essence`,
    arcanoId: arcano.id,
    front: `Qual é a essência de ${arcano.name}?`,
    back: arcano.layers.main.essence,
    category: "symbol",
  });

  // Symbolism
  if (arcano.layers.deepDive.symbolism) {
    cards.push({
      id: `${prefix}-symbols`,
      arcanoId: arcano.id,
      front: `Quais são os símbolos centrais de ${arcano.name}?`,
      back: arcano.layers.deepDive.symbolism,
      category: "symbol",
    });
  }

  // Cabala
  if (arcano.layers.deepDive.cabala) {
    cards.push({
      id: `${prefix}-cabala`,
      arcanoId: arcano.id,
      front: `Qual é a correspondência cabalística de ${arcano.name}?`,
      back: arcano.layers.deepDive.cabala,
      category: "cabala",
    });
  }

  return cards;
}

const ALL_ARCANOS = [THE_FOOL, THE_MAGICIAN, THE_HIGH_PRIESTESS];

export const ALL_FLASHCARDS: Flashcard[] = ALL_ARCANOS.flatMap(generateFlashcards);

export const ALL_REVIEW_QUIZZES: QuizQuestion[] = ALL_ARCANOS.flatMap(a => a.quiz);

/** Get flashcards for a specific arcano */
export function getFlashcardsForArcano(arcanoId: number): Flashcard[] {
  return ALL_FLASHCARDS.filter(f => f.arcanoId === arcanoId);
}

/** Get arcano name by id */
export function getArcanoName(arcanoId: number): string {
  return ALL_ARCANOS.find(a => a.id === arcanoId)?.name ?? `Arcano ${arcanoId}`;
}

/** Generate a daily challenge based on date */
export function generateDailyChallenge(dateStr: string, completedLessons: string[]): DailyChallenge | null {
  const studied = ALL_ARCANOS.filter(a => completedLessons.includes(`arcano-${a.id}`));
  if (studied.length === 0) return null;

  const dayHash = dateStr.split("-").reduce((acc, n) => acc + parseInt(n), 0);
  const types: DailyChallenge["type"][] = ["flashcard-set", "quick-quiz", "association"];
  const type = types[dayHash % types.length];

  const arcano = studied[dayHash % studied.length];
  const flashcards = getFlashcardsForArcano(arcano.id);
  const quizzes = arcano.quiz;

  const titles: Record<DailyChallenge["type"], string> = {
    "flashcard-set": "Revisão Relâmpago",
    "quick-quiz": "Desafio Rápido",
    "association": "Conexões Simbólicas",
  };

  const subtitles: Record<DailyChallenge["type"], string> = {
    "flashcard-set": `Revise ${arcano.name} em flashcards`,
    "quick-quiz": `3 perguntas sobre ${arcano.name}`,
    "association": `Conecte símbolos e significados de ${arcano.name}`,
  };

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    type,
    title: titles[type],
    subtitle: subtitles[type],
    items: type === "quick-quiz"
      ? quizzes.slice(0, 3).map(q => q.id)
      : flashcards.slice(0, 5).map(f => f.id),
    xpReward: 15,
  };
}
