import {
  fetchArcanoMaiorFromLegacy,
  fetchArcanoMenorFromLegacy,
  fetchLessonFromLegacy,
  fetchModuleFromLegacy,
  fetchQuizFromLegacy,
  listArcanosMaioresFromLegacy,
  listArcanosMenoresFromLegacy,
} from "./repo-legacy";
import {
  mapLegacyArcanoMaiorToUI,
  mapLegacyArcanoMenorToUI,
  mapLegacyLessonToUI,
  mapLegacyModuleToUI,
  mapLegacyQuizToUI,
} from "./mappers-legacy";
import { fetchJourneyFromLegacy } from "./repo-legacy-journey";
import { fetchSymbolsFromLegacy } from "./repo-legacy-symbols";
import { fetchCertificatesFromLegacy } from "./repo-legacy-certificates";
import { fetchNumerologyFromLegacy } from "./repo-legacy-numerology";
import { fetchSuitsFromLegacy } from "./repo-legacy-suits";
import { fetchCourtCardsFromLegacy } from "./repo-legacy-court";
import type {
  ArcanoContent,
  LessonContent,
  ModuleContent,
  QuizContent,
} from "./types";
import type { JourneyContent } from "./journey-types";
import type { SymbolsContent } from "./symbols-types";
import type { CertificatesContent } from "./certificates-types";
import type { NumerologyContent } from "./numerology-types";
import type { SuitContent, SuitsContent } from "./suits-types";
import type { CourtCardsContent } from "./court-types";

export interface GetArcanoParams {
  tipo: "maior" | "menor";
  numero?: number;
  naipe?: "copas" | "paus" | "espadas" | "ouros";
  posicao?: number | string;
}

export async function getArcanoContent(
  params: GetArcanoParams,
): Promise<ArcanoContent | null> {
  if (params.tipo === "maior" && params.numero != null) {
    const a = fetchArcanoMaiorFromLegacy(params.numero);
    return a ? mapLegacyArcanoMaiorToUI(a) : null;
  }
  if (params.tipo === "menor" && params.naipe && params.posicao != null) {
    const c = fetchArcanoMenorFromLegacy(params.naipe, params.posicao);
    return c ? mapLegacyArcanoMenorToUI(c) : null;
  }
  return null;
}

export async function listArcanosContent(filter: {
  tipo: "maior" | "menor";
  naipe?: "copas" | "paus" | "espadas" | "ouros";
}): Promise<ArcanoContent[]> {
  if (filter.tipo === "maior") {
    return listArcanosMaioresFromLegacy().map(mapLegacyArcanoMaiorToUI);
  }
  return listArcanosMenoresFromLegacy(filter.naipe).map(mapLegacyArcanoMenorToUI);
}

export interface GetQuizParams {
  quizId?: string;
  linkedTo?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  arcanoNumero?: number;
}

export async function getQuizContent(
  params: GetQuizParams,
): Promise<QuizContent | null> {
  const legacy = await fetchQuizFromLegacy({
    moduleSlug: params.moduleSlug,
    lessonSlug: params.lessonSlug,
    arcanoNumero: params.arcanoNumero,
  });
  if (!legacy || !legacy.questions) return null;
  const vinculo = legacy.vinculoTipo === "arcano"
    ? { tipo: "arcano" as const, id: legacy.vinculoId }
    : { tipo: "licao" as const, id: legacy.vinculoId };
  return mapLegacyQuizToUI(legacy.questions as any, vinculo, legacy.vinculoId);
}

export async function getLessonContent(
  params: { moduleSlug: string; lessonSlug: string },
): Promise<LessonContent | null> {
  const found = await fetchLessonFromLegacy(params.moduleSlug, params.lessonSlug);
  if (!found) return null;
  return mapLegacyLessonToUI(found.lesson, found.moduleSlug, found.moduleName);
}

export async function getModuleContent(slug: string): Promise<ModuleContent | null> {
  const found = await fetchModuleFromLegacy(slug);
  if (!found) return null;
  return mapLegacyModuleToUI(found.slug, found.name, found.lessons);
}

export async function getJourneyContent(): Promise<JourneyContent | null> {
  return fetchJourneyFromLegacy();
}

export async function getSymbolsContent(): Promise<SymbolsContent | null> {
  return fetchSymbolsFromLegacy();
}

export async function getCertificatesContent(): Promise<CertificatesContent | null> {
  return fetchCertificatesFromLegacy();
}

export async function getNumerologyContent(): Promise<NumerologyContent | null> {
  return fetchNumerologyFromLegacy();
}

export async function getSuitsContent(): Promise<SuitsContent | null> {
  return fetchSuitsFromLegacy();
}

export async function getSuitContent(
  naipe: "copas" | "paus" | "espadas" | "ouros",
): Promise<SuitContent | null> {
  const all = await getSuitsContent();
  if (!all) return null;
  return all.items.find((s) => s.naipe === naipe) ?? null;
}

export async function getCourtCardsContent(): Promise<CourtCardsContent | null> {
  return fetchCourtCardsFromLegacy();
}
