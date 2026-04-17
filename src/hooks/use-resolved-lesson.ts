/**
 * Adapter hook — Fase 4A do refactor de conteúdo.
 *
 * Liga a tela individual de lição ao novo content-adapter SEM alterar
 * fases (lesson/exercise/deepdive/quiz), progresso ou continuidade.
 *
 * Padrão idêntico ao adopt das fases anteriores:
 *   1. Resolve via `useLessonContent({ moduleSlug, lessonSlug })`.
 *   2. Expõe `sourceUsed` / `usedFallback` para telemetria.
 *   3. A UI continua consumindo o objeto legado (FUNDAMENTOS_LESSONS) para
 *      preservar layout das fases, deepDive, exercise e visual.
 *   4. Em DEV emite log para validar leitura via DB.
 */

import { useEffect } from "react";
import { useLessonContent } from "./use-content";
import type { ContentSource, LessonContent } from "@/lib/content/types";

export interface UseResolvedLessonResult {
  data: LessonContent | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
}

export function useResolvedLesson(
  moduleSlug: string | null,
  lessonSlug: string | null,
): UseResolvedLessonResult {
  const params =
    moduleSlug && lessonSlug ? { moduleSlug, lessonSlug } : null;
  const { data, isLoading, sourceUsed, usedFallback } = useLessonContent(params);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!params || isLoading || !sourceUsed) return;
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] lesson=${moduleSlug}/${lessonSlug} source=${sourceUsed} fallback=${usedFallback}`,
    );
  }, [moduleSlug, lessonSlug, params, sourceUsed, usedFallback, isLoading]);

  return { data, isLoading, sourceUsed, usedFallback };
}
