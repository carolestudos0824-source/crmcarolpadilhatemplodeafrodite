/**
 * Review system — builders derivadores.
 *
 * Substituem `src/data/review-data.ts`. Geram flashcards, quick reviews
 * e desafios diários a partir de `ArcanoContent[]` (adapter `@/lib/content`).
 *
 * O hook `useReview` (SRS) e a UI permanecem intactos.
 */

import type { ArcanoContent, QuizQuestionContent } from "@/lib/content/types";

// ─── Tipos exportados (compat com a UI antiga) ───

export interface Flashcard {
  id: string;
  arcanoId: number;
  front: string;
  back: string;
  category: "symbol" | "archetype" | "light-shadow" | "keyword" | "cabala";
}

export interface QuickReviewSummary {
  arcanoId: number;
  name: string;
  numeral: string;
  keyword: string;
  light: string;
  shadow: string;
  lesson: string;
  practicalApplication: string;
  fixationPhrase: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  type: "flashcard-set" | "quick-quiz" | "association";
  title: string;
  subtitle: string;
  items: string[];
  xpReward: number;
}

// Re-export QuizQuestionContent under legacy alias for compat
export type QuizQuestionLike = QuizQuestionContent & {
  // Compat fields used in ReviewPage UI
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// ─── Helpers ───

function arcanoNum(a: ArcanoContent): number {
  return a.numero ?? 0;
}

function firstTwoSentences(text?: string, fallback = ""): string {
  const t = (text ?? "").trim();
  if (!t) return fallback;
  const parts = t.split(/[.!?]/).slice(0, 2).map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts.join(". ") + "." : fallback;
}

// ─── Flashcard generation ───

function generateFlashcards(a: ArcanoContent): Flashcard[] {
  const id = arcanoNum(a);
  const prefix = `fc-${id}`;
  const cards: Flashcard[] = [];
  const ed = a.editorial;
  const keywords = ed.palavrasChave ?? [];

  keywords.forEach((kw, i) => {
    cards.push({
      id: `${prefix}-kw-${i}`,
      arcanoId: id,
      front: kw,
      back: `Palavra-chave de ${a.nome} (${a.numeral ?? ""}) — ${a.subtitulo ?? ""}`,
      category: "keyword",
    });
  });

  if (ed.arquetipo) {
    cards.push({
      id: `${prefix}-arch`,
      arcanoId: id,
      front: `Qual é o arquétipo de ${a.nome}?`,
      back: ed.arquetipo,
      category: "archetype",
    });
  }
  if (ed.luz) {
    cards.push({
      id: `${prefix}-light`,
      arcanoId: id,
      front: `Qual é a LUZ de ${a.nome}?`,
      back: ed.luz,
      category: "light-shadow",
    });
  }
  if (ed.sombra) {
    cards.push({
      id: `${prefix}-shadow`,
      arcanoId: id,
      front: `Qual é a SOMBRA de ${a.nome}?`,
      back: ed.sombra,
      category: "light-shadow",
    });
  }
  if (ed.essencia) {
    cards.push({
      id: `${prefix}-essence`,
      arcanoId: id,
      front: `Qual é a essência de ${a.nome}?`,
      back: ed.essencia,
      category: "symbol",
    });
  }
  if (ed.simbolosCentrais) {
    cards.push({
      id: `${prefix}-symbols`,
      arcanoId: id,
      front: `Quais são os símbolos centrais de ${a.nome}?`,
      back: ed.simbolosCentrais,
      category: "symbol",
    });
  }
  if (ed.cabala) {
    cards.push({
      id: `${prefix}-cabala`,
      arcanoId: id,
      front: `Qual é a correspondência cabalística de ${a.nome}?`,
      back: ed.cabala,
      category: "cabala",
    });
  }
  return cards;
}

function generateQuickReview(a: ArcanoContent): QuickReviewSummary {
  const ed = a.editorial;
  const keywords = ed.palavrasChave ?? [];
  return {
    arcanoId: arcanoNum(a),
    name: a.nome,
    numeral: a.numeral ?? "",
    keyword: keywords.slice(0, 3).join(" · "),
    light: firstTwoSentences(ed.luz, "Aspecto luminoso ainda em curadoria."),
    shadow: firstTwoSentences(ed.sombra, "Aspecto de sombra ainda em curadoria."),
    lesson: firstTwoSentences(ed.essencia, "Lição central ainda em curadoria."),
    practicalApplication: firstTwoSentences(ed.aprofundamento ?? ed.jornada, "Aplicação prática ainda em curadoria."),
    fixationPhrase: ed.vozDoArcano ?? `Eu sou ${a.nome}.`,
  };
}

function quizToLike(qq: QuizQuestionContent): QuizQuestionLike {
  return {
    ...qq,
    id: qq.id,
    question: qq.enunciado,
    options: qq.alternativas,
    correctIndex: qq.correta,
    explanation: qq.explicacao ?? "",
  };
}

// ─── Public builders (consumidos via useMemo nas páginas) ───

export interface ReviewBundle {
  allFlashcards: Flashcard[];
  allReviewQuizzes: QuizQuestionLike[];
  allQuickReviews: QuickReviewSummary[];
  arcanos: ArcanoContent[];
}

export function buildReviewBundle(arcanos: ArcanoContent[]): ReviewBundle {
  const sorted = [...arcanos].sort((a, b) => arcanoNum(a) - arcanoNum(b));
  return {
    arcanos: sorted,
    allFlashcards: sorted.flatMap(generateFlashcards),
    allReviewQuizzes: sorted.flatMap((a) => (a.quiz ? a.quiz.perguntas.map(quizToLike) : [])),
    allQuickReviews: sorted.map(generateQuickReview),
  };
}

export function getFlashcardsForArcano(bundle: ReviewBundle, arcanoId: number): Flashcard[] {
  return bundle.allFlashcards.filter((f) => f.arcanoId === arcanoId);
}

export function getArcanoNameFromBundle(bundle: ReviewBundle, arcanoId: number): string {
  return bundle.arcanos.find((a) => arcanoNum(a) === arcanoId)?.nome ?? `Arcano ${arcanoId}`;
}

export function getArcanoNumeralFromBundle(bundle: ReviewBundle, arcanoId: number): string {
  return bundle.arcanos.find((a) => arcanoNum(a) === arcanoId)?.numeral ?? String(arcanoId);
}

export function generateDailyChallenge(
  bundle: ReviewBundle,
  dateStr: string,
  completedLessons: string[],
): DailyChallenge | null {
  const studied = bundle.arcanos.filter((a) => completedLessons.includes(`arcano-${arcanoNum(a)}`));
  if (studied.length === 0) return null;

  const dayHash = dateStr.split("-").reduce((acc, n) => acc + parseInt(n, 10), 0);
  const types: DailyChallenge["type"][] = ["flashcard-set", "quick-quiz", "association"];
  const type = types[dayHash % types.length];
  const arcano = studied[dayHash % studied.length];
  const flashcards = getFlashcardsForArcano(bundle, arcanoNum(arcano));
  const quizzes = arcano.quiz?.perguntas ?? [];

  const titles: Record<DailyChallenge["type"], string> = {
    "flashcard-set": "Revisão Relâmpago",
    "quick-quiz": "Desafio Rápido",
    association: "Conexões Simbólicas",
  };
  const subtitles: Record<DailyChallenge["type"], string> = {
    "flashcard-set": `Revise ${arcano.nome} em flashcards`,
    "quick-quiz": `3 perguntas sobre ${arcano.nome}`,
    association: `Conecte símbolos e significados de ${arcano.nome}`,
  };

  return {
    id: `daily-${dateStr}`,
    date: dateStr,
    type,
    title: titles[type],
    subtitle: subtitles[type],
    items: type === "quick-quiz"
      ? quizzes.slice(0, 3).map((q) => q.id)
      : flashcards.slice(0, 5).map((f) => f.id),
    xpReward: 15,
  };
}
