/**
 * Adapter hook — Phase 1 of content refactor.
 *
 * Liga a UI legada (`<QuizSection questions={QuizQuestion[]}>` e quiz inline em
 * FundamentosLessonPage) ao novo content-adapter SEM trocar layout nem props.
 *
 * Fluxo:
 *   1. Tenta resolver o quiz via `useQuizContent` (DB → fallback automático).
 *   2. Converte `QuizContent.perguntas` para o shape legado `QuizQuestion[]`.
 *   3. Expõe `sourceUsed` e `usedFallback` para telemetria/admin.
 *   4. Se a resolução falhar, devolve o `legacyQuiz` cru fornecido pelo caller
 *      (último anel de segurança — UI nunca quebra).
 */

import { useMemo } from "react";
import { useQuizContent } from "./use-content";
import type { QuizQuestion } from "@/data/tarot-data";
import type { GetQuizParams } from "@/lib/content/service";
import type { ContentSource } from "@/lib/content/types";

export interface UseResolvedQuizOptions {
  params: GetQuizParams | null;
  /** Fallback final caso adapter retorne null (ex.: arcano sem quiz no DB nem no legado mapeado). */
  legacyQuiz?: QuizQuestion[] | null;
}

export interface UseResolvedQuizResult {
  questions: QuizQuestion[] | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
}

export function useResolvedQuiz({
  params,
  legacyQuiz,
}: UseResolvedQuizOptions): UseResolvedQuizResult {
  const { data, isLoading, sourceUsed, usedFallback } = useQuizContent(params);

  const questions = useMemo<QuizQuestion[] | null>(() => {
    if (data?.perguntas?.length) {
      return data.perguntas.map((p) => ({
        id: p.id,
        question: p.enunciado,
        type: p.alternativas.length === 2 ? "true-false" : "multiple-choice",
        options: p.alternativas,
        correctIndex: p.correta,
        explanation: p.explicacao ?? "",
      }));
    }
    return legacyQuiz ?? null;
  }, [data, legacyQuiz]);

  return {
    questions,
    isLoading,
    sourceUsed,
    usedFallback: usedFallback || (!data && !!legacyQuiz),
  };
}
