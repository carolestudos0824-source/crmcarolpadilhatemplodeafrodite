/**
 * Hooks TanStack Query — interface única para a UI consumir conteúdo.
 *
 * Todos retornam o mesmo wrapper `UseContentResult<T>`:
 *   { data, isLoading, isError, error, sourceUsed, usedFallback, refetch, isFetching }
 */

import { useQuery } from "@tanstack/react-query";
import {
  getArcanoContent,
  getJourneyContent,
  getLessonContent,
  getModuleContent,
  getQuizContent,
  listArcanosContent,
  type GetArcanoParams,
  type GetLessonParams,
  type GetQuizParams,
} from "@/lib/content/service";
import type {
  ArcanoContent,
  LessonContent,
  ModuleContent,
  QuizContent,
  UseContentResult,
} from "@/lib/content/types";
import type { JourneyContent } from "@/lib/content/journey-types";

const STALE_MS = 5 * 60 * 1000;
const GC_MS = 30 * 60 * 1000;

function wrap<T extends { metadata: { source: "db" | "legacy" } } | null>(
  query: ReturnType<typeof useQuery<T>>,
): UseContentResult<T> {
  const data = (query.data ?? null) as T;
  const sourceUsed = data?.metadata.source ?? null;
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: (query.error as Error | null) ?? null,
    sourceUsed,
    usedFallback: sourceUsed === "legacy",
    refetch: () => query.refetch(),
    isFetching: query.isFetching,
  };
}

function wrapList<T extends { metadata: { source: "db" | "legacy" } }>(
  query: ReturnType<typeof useQuery<T[]>>,
): UseContentResult<T[]> {
  const data = (query.data ?? null) as T[] | null;
  const sourceUsed = data && data.length > 0 ? data[0].metadata.source : null;
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: (query.error as Error | null) ?? null,
    sourceUsed,
    usedFallback: sourceUsed === "legacy",
    refetch: () => query.refetch(),
    isFetching: query.isFetching,
  };
}

// ─── Arcano ────────────────────────────────────────────────────────

export function useArcanoContent(
  params: GetArcanoParams | null,
): UseContentResult<ArcanoContent | null> {
  const query = useQuery<ArcanoContent | null>({
    queryKey: ["content", "arcano", params],
    queryFn: () => (params ? getArcanoContent(params) : Promise.resolve(null)),
    enabled: !!params,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

export function useArcanosList(
  filter: { tipo: "maior" | "menor"; naipe?: "copas" | "paus" | "espadas" | "ouros" },
): UseContentResult<ArcanoContent[]> {
  const query = useQuery<ArcanoContent[]>({
    queryKey: ["content", "arcanos-list", filter],
    queryFn: () => listArcanosContent(filter),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrapList(query);
}

// ─── Quiz ──────────────────────────────────────────────────────────

export function useQuizContent(
  params: GetQuizParams | null,
): UseContentResult<QuizContent | null> {
  const query = useQuery<QuizContent | null>({
    queryKey: ["content", "quiz", params],
    queryFn: () => (params ? getQuizContent(params) : Promise.resolve(null)),
    enabled: !!params,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Lesson ────────────────────────────────────────────────────────

export function useLessonContent(
  params: GetLessonParams | null,
): UseContentResult<LessonContent | null> {
  const query = useQuery<LessonContent | null>({
    queryKey: ["content", "lesson", params],
    queryFn: () => (params ? getLessonContent(params) : Promise.resolve(null)),
    enabled: !!params,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Module ────────────────────────────────────────────────────────

export function useModuleContent(
  slug: string | null,
): UseContentResult<ModuleContent | null> {
  const query = useQuery<ModuleContent | null>({
    queryKey: ["content", "module", slug],
    queryFn: () => (slug ? getModuleContent(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}
