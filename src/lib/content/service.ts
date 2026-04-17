/**
 * Serviço unificado.
 *
 * Implementa a regra das flags por domínio:
 *   - 'fallback' → só legado
 *   - 'auto'     → DB primeiro; vazio/erro → legado + telemetria
 *   - 'db'       → só banco; falha = erro real
 *
 * Telemetria: cada vez que cai no legado em modo 'auto', emite warn no console.
 * (Trocar por evento real no `user_events` é decisão da Fase 7.)
 */

import { getFlag, type ContentDomain } from "./flags";
import {
  fetchArcanoMaiorFromDb,
  fetchArcanoMenorFromDb,
  fetchLessonFromDb,
  fetchModuleFromDb,
  fetchQuizByLinkedToFromDb,
  fetchQuizFromDb,
  listArcanosMaioresFromDb,
  listArcanosMenoresFromDb,
} from "./repo-db";
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
  mapDbArcanoToUI,
  mapDbLessonToUI,
  mapDbModuleToUI,
  mapDbQuizToUI,
} from "./mappers-db";
import {
  mapLegacyArcanoMaiorToUI,
  mapLegacyArcanoMenorToUI,
  mapLegacyLessonToUI,
  mapLegacyModuleToUI,
  mapLegacyQuizToUI,
} from "./mappers-legacy";
import { fetchJourneyFromDb } from "./repo-db-journey";
import { fetchJourneyFromLegacy } from "./repo-legacy-journey";
import { fetchSymbolsFromDb } from "./repo-db-symbols";
import { fetchSymbolsFromLegacy } from "./repo-legacy-symbols";
import { fetchCertificatesFromDb } from "./repo-db-certificates";
import { fetchCertificatesFromLegacy } from "./repo-legacy-certificates";
import { fetchNumerologyFromDb } from "./repo-db-numerology";
import { fetchNumerologyFromLegacy } from "./repo-legacy-numerology";
import { fetchSuitsFromDb } from "./repo-db-suits";
import { fetchSuitsFromLegacy } from "./repo-legacy-suits";
import { fetchCourtCardsFromDb } from "./repo-db-court";
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

// ─── Helper genérico ───────────────────────────────────────────────

async function withFallback<T>(
  domain: ContentDomain,
  key: string,
  dbFn: () => Promise<T | null>,
  legacyFn: () => T | null | Promise<T | null>,
): Promise<T | null> {
  const flag = getFlag(domain);

  if (flag === "fallback") {
    return await legacyFn();
  }

  if (flag === "db") {
    return await dbFn();
  }

  // 'auto'
  try {
    const dbResult = await dbFn();
    if (dbResult !== null && dbResult !== undefined) return dbResult;
    // vazio → cai no legado
    const legacyResult = await legacyFn();
    if (legacyResult) {
      // eslint-disable-next-line no-console
      console.warn(`[content-adapter] fallback used`, { domain, key });
    }
    return legacyResult;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[content-adapter] db error → fallback`, { domain, key, err });
    return await legacyFn();
  }
}

// ─── ARCANOS ───────────────────────────────────────────────────────

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
    const numero = params.numero;
    return withFallback(
      "arcanos",
      `maior-${numero}`,
      async () => {
        const row = await fetchArcanoMaiorFromDb(numero);
        return row ? mapDbArcanoToUI(row) : null;
      },
      () => {
        const a = fetchArcanoMaiorFromLegacy(numero);
        return a ? mapLegacyArcanoMaiorToUI(a) : null;
      },
    );
  }

  if (params.tipo === "menor" && params.naipe && params.posicao != null) {
    const naipe = params.naipe;
    const posicao = params.posicao;
    const numero = typeof posicao === "number"
      ? posicao
      : ({ pajem: 11, cavaleiro: 12, rainha: 13, rei: 14 } as Record<string, number>)[String(posicao)];
    return withFallback(
      "arcanos",
      `menor-${naipe}-${posicao}`,
      async () => {
        const row = await fetchArcanoMenorFromDb(naipe, numero);
        return row ? mapDbArcanoToUI(row) : null;
      },
      () => {
        const c = fetchArcanoMenorFromLegacy(naipe, posicao);
        return c ? mapLegacyArcanoMenorToUI(c) : null;
      },
    );
  }

  return null;
}

export async function listArcanosContent(filter: {
  tipo: "maior" | "menor";
  naipe?: "copas" | "paus" | "espadas" | "ouros";
}): Promise<ArcanoContent[]> {
  if (filter.tipo === "maior") {
    const result = await withFallback(
      "arcanos",
      "list-maiores",
      async () => {
        const rows = await listArcanosMaioresFromDb();
        return rows.length > 0 ? rows.map(mapDbArcanoToUI) : null;
      },
      () => listArcanosMaioresFromLegacy().map(mapLegacyArcanoMaiorToUI),
    );
    return result ?? [];
  }
  const naipe = filter.naipe;
  const result = await withFallback(
    "arcanos",
    `list-menores-${naipe ?? "all"}`,
    async () => {
      const rows = await listArcanosMenoresFromDb(naipe);
      return rows.length > 0 ? rows.map(mapDbArcanoToUI) : null;
    },
    () => listArcanosMenoresFromLegacy(naipe).map(mapLegacyArcanoMenorToUI),
  );
  return result ?? [];
}

// ─── QUIZZES ───────────────────────────────────────────────────────

export interface GetQuizParams {
  /** ID direto do quiz no banco (preferido quando conhecido). */
  quizId?: string;
  /** Vinculação por linked_to (slug de lição ou `arcano-{tipo}-{n}`). */
  linkedTo?: string;
  /** Para fallback legado: contexto da lição. */
  moduleSlug?: string;
  lessonSlug?: string;
  /** Para fallback legado: arcano. */
  arcanoNumero?: number;
}

export async function getQuizContent(
  params: GetQuizParams,
): Promise<QuizContent | null> {
  const key = params.quizId ?? params.linkedTo ?? params.lessonSlug ?? `arcano-${params.arcanoNumero}`;

  return withFallback(
    "quizzes",
    String(key),
    async () => {
      let result = null;
      if (params.quizId) result = await fetchQuizFromDb(params.quizId);
      else if (params.linkedTo) result = await fetchQuizByLinkedToFromDb(params.linkedTo);
      return result ? mapDbQuizToUI(result.quiz, result.questions) : null;
    },
    async () => {
      const legacy = await fetchQuizFromLegacy({
        moduleSlug: params.moduleSlug,
        lessonSlug: params.lessonSlug,
        arcanoNumero: params.arcanoNumero,
      });
      if (!legacy || !legacy.questions) return null;
      const vinculo = legacy.vinculoTipo === "arcano"
        ? { tipo: "arcano" as const, id: legacy.vinculoId }
        : { tipo: "licao" as const, id: legacy.vinculoId };
      return mapLegacyQuizToUI(legacy.questions as never, vinculo, legacy.vinculoId);
    },
  );
}

// ─── LESSONS ───────────────────────────────────────────────────────

export interface GetLessonParams {
  moduleSlug: string;
  lessonSlug: string;
}

export async function getLessonContent(
  params: GetLessonParams,
): Promise<LessonContent | null> {
  return withFallback(
    "lessons",
    `${params.moduleSlug}/${params.lessonSlug}`,
    async () => {
      const found = await fetchLessonFromDb(params.lessonSlug);
      if (!found) return null;
      return mapDbLessonToUI(found.lesson, {
        moduleSlug: found.module.slug,
        moduleName: found.module.name,
        moduleTier: found.module.tier,
        moduleStatus: found.module.status,
      });
    },
    async () => {
      const found = await fetchLessonFromLegacy(params.moduleSlug, params.lessonSlug);
      if (!found) return null;
      return mapLegacyLessonToUI(found.lesson, found.moduleSlug, found.moduleName);
    },
  );
}

// ─── MODULES ───────────────────────────────────────────────────────

export async function getModuleContent(
  slug: string,
): Promise<ModuleContent | null> {
  return withFallback(
    "modules",
    slug,
    async () => {
      const found = await fetchModuleFromDb(slug);
      if (!found) return null;
      return mapDbModuleToUI(found.module, found.lessons);
    },
    async () => {
      const found = await fetchModuleFromLegacy(slug);
      if (!found) return null;
      return mapLegacyModuleToUI(found.slug, found.name, found.lessons);
    },
  );
}

// ─── JOURNEY ───────────────────────────────────────────────────────

export async function getJourneyContent(): Promise<JourneyContent | null> {
  return withFallback<JourneyContent>(
    "journey",
    "fools-journey",
    () => fetchJourneyFromDb(),
    () => fetchJourneyFromLegacy(),
  );
}

// ─── SYMBOLS ───────────────────────────────────────────────────────

export async function getSymbolsContent(): Promise<SymbolsContent | null> {
  return withFallback<SymbolsContent>(
    "symbols",
    "library",
    () => fetchSymbolsFromDb(),
    () => fetchSymbolsFromLegacy(),
  );
}

// ─── CERTIFICATES ──────────────────────────────────────────────────

export async function getCertificatesContent(): Promise<CertificatesContent | null> {
  return withFallback<CertificatesContent>(
    "certificates",
    "list",
    () => fetchCertificatesFromDb(),
    () => fetchCertificatesFromLegacy(),
  );
}

// ─── NUMEROLOGY ────────────────────────────────────────────────────

export async function getNumerologyContent(): Promise<NumerologyContent | null> {
  return withFallback<NumerologyContent>(
    "numerology",
    "list",
    () => fetchNumerologyFromDb(),
    () => fetchNumerologyFromLegacy(),
  );
}

// ─── SUITS (Naipe Intro) ───────────────────────────────────────────

export async function getSuitsContent(): Promise<SuitsContent | null> {
  return withFallback<SuitsContent>(
    "suits",
    "list",
    () => fetchSuitsFromDb(),
    () => fetchSuitsFromLegacy(),
  );
}

export async function getSuitContent(
  naipe: "copas" | "paus" | "espadas" | "ouros",
): Promise<SuitContent | null> {
  const all = await getSuitsContent();
  if (!all) return null;
  return all.items.find((s) => s.naipe === naipe) ?? null;
}

// ─── COURT CARDS (pedagógicas) ─────────────────────────────────────

export async function getCourtCardsContent(): Promise<CourtCardsContent | null> {
  return withFallback<CourtCardsContent>(
    "court",
    "list",
    () => fetchCourtCardsFromDb(),
    () => fetchCourtCardsFromLegacy(),
  );
}
