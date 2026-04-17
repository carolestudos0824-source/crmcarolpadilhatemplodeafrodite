/**
 * Hooks TanStack Query — interface única para a UI consumir conteúdo.
 *
 * Todos retornam o mesmo wrapper `UseContentResult<T>`:
 *   { data, isLoading, isError, error, sourceUsed, usedFallback, refetch, isFetching }
 */

import { useQuery } from "@tanstack/react-query";
import {
  getArcanoContent,
  getCertificatesContent,
  getCourtCardsContent,
  getJourneyContent,
  getLessonContent,
  getModuleContent,
  getNumerologyContent,
  getQuizContent,
  getSuitContent,
  getSuitsContent,
  getSymbolsContent,
  listArcanosContent,
  type GetArcanoParams,
  type GetLessonParams,
  type GetQuizParams,
} from "@/lib/content/service";
import type {
  ArcanoContent,
  ContentNaipe,
  LessonContent,
  ModuleContent,
  QuizContent,
  UseContentResult,
} from "@/lib/content/types";
import type { JourneyContent } from "@/lib/content/journey-types";
import type { SymbolsContent } from "@/lib/content/symbols-types";
import type { CertificatesContent } from "@/lib/content/certificates-types";
import type { NumerologyContent } from "@/lib/content/numerology-types";
import type { SuitContent, SuitsContent } from "@/lib/content/suits-types";
import type { CourtCardsContent } from "@/lib/content/court-types";

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

// ─── Journey ───────────────────────────────────────────────────────

export function useJourneyContent(): UseContentResult<JourneyContent | null> {
  const query = useQuery<JourneyContent | null>({
    queryKey: ["content", "journey"],
    queryFn: () => getJourneyContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Symbols ───────────────────────────────────────────────────────

export function useSymbolsContent(): UseContentResult<SymbolsContent | null> {
  const query = useQuery<SymbolsContent | null>({
    queryKey: ["content", "symbols"],
    queryFn: () => getSymbolsContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Certificates ──────────────────────────────────────────────────

export function useCertificatesContent(): UseContentResult<CertificatesContent | null> {
  const query = useQuery<CertificatesContent | null>({
    queryKey: ["content", "certificates"],
    queryFn: () => getCertificatesContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Numerology ────────────────────────────────────────────────────

export function useNumerologyContent(): UseContentResult<NumerologyContent | null> {
  const query = useQuery<NumerologyContent | null>({
    queryKey: ["content", "numerology"],
    queryFn: () => getNumerologyContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

// ─── Suits (Naipe Intro) ───────────────────────────────────────────

export function useSuitsContent(): UseContentResult<SuitsContent | null> {
  const query = useQuery<SuitsContent | null>({
    queryKey: ["content", "suits"],
    queryFn: () => getSuitsContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}

export function useSuitIntroContent(
  naipe: ContentNaipe | null,
): UseContentResult<SuitContent | null> {
  const query = useQuery<SuitContent | null>({
    queryKey: ["content", "suit", naipe],
    queryFn: () => (naipe ? getSuitContent(naipe) : Promise.resolve(null)),
    enabled: !!naipe,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  // SuitContent não tem metadata; usamos o wrapper da lista para sourceUsed.
  const data = (query.data ?? null) as SuitContent | null;
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: (query.error as Error | null) ?? null,
    sourceUsed: data ? "db" : null,
    usedFallback: false,
    refetch: () => query.refetch(),
    isFetching: query.isFetching,
  };
}

// ─── Court Cards (pedagógicas) ─────────────────────────────────────

export function useCourtCardsContent(): UseContentResult<CourtCardsContent | null> {
  const query = useQuery<CourtCardsContent | null>({
    queryKey: ["content", "court-cards"],
    queryFn: () => getCourtCardsContent(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
  return wrap(query);
}
