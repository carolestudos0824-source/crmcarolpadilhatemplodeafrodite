/**
 * Repositórios legados — leem dos `.ts` em `src/data/*`.
 *
 * Único ponto autorizado a importar `src/data/arcanos*` e os módulos `*_LESSONS`
 * fora dos próprios mappers. Centralizar aqui facilita o cleanup da Fase 8.
 */

import { EDITORIAL_REGISTRY } from "@/data/arcanos";
import { ARCANOS_MENORES, getArcanoMenorByPosition } from "@/data/arcanos-menores";
import type { LegacyArcanoMaior, LegacyArcanoMenor, LegacyLesson } from "./mappers-legacy";

// ─── Arcanos ───────────────────────────────────────────────────────

export function fetchArcanoMaiorFromLegacy(
  numero: number,
): LegacyArcanoMaior | null {
  return (EDITORIAL_REGISTRY[numero] as unknown as LegacyArcanoMaior) ?? null;
}

export function fetchArcanoMenorFromLegacy(
  naipe: "copas" | "paus" | "espadas" | "ouros",
  posicao: number | string,
): LegacyArcanoMenor | null {
  const card = getArcanoMenorByPosition(naipe, posicao as never);
  return (card as unknown as LegacyArcanoMenor) ?? null;
}

export function listArcanosMaioresFromLegacy(): LegacyArcanoMaior[] {
  return Object.values(EDITORIAL_REGISTRY) as unknown as LegacyArcanoMaior[];
}

export function listArcanosMenoresFromLegacy(
  naipe?: "copas" | "paus" | "espadas" | "ouros",
): LegacyArcanoMenor[] {
  const all = ARCANOS_MENORES as unknown as LegacyArcanoMenor[];
  return naipe ? all.filter((c) => c.naipe === naipe) : all;
}

// ─── Quizzes / Lições / Módulos ────────────────────────────────────
//
// Os módulos legados (`espiritualidade`, `amor`, `fundamentos`, etc.) seguem
// shapes muito parecidos. Usamos um registry preguiçoso por slug — só importa
// o módulo quando for solicitado, evitando carregar tudo no bundle do adapter.

type LessonsLoader = () => Promise<{ lessons: LegacyLesson[]; name: string }>;

const LESSONS_REGISTRY: Record<string, LessonsLoader> = {
  espiritualidade: async () => {
    const m = await import("@/content/lessons/espiritualidade");
    return { lessons: m.ESPIRITUALIDADE_LESSONS as unknown as LegacyLesson[], name: "Tarô e Espiritualidade" };
  },
  amor: async () => {
    const m = await import("@/content/lessons/amor");
    return { lessons: m.AMOR_LESSONS as unknown as LegacyLesson[], name: "Tarô e Amor" };
  },
  fundamentos: async () => {
    const m = await import("@/content/lessons/fundamentos");
    return { lessons: m.FUNDAMENTOS_LESSONS as unknown as LegacyLesson[], name: "Fundamentos" };
  },
  pratica: async () => {
    const m = await import("@/content/lessons/pratica");
    return { lessons: m.PRATICA_LESSONS as unknown as LegacyLesson[], name: "Prática Guiada" };
  },
  tiragens: async () => {
    const m = await import("@/content/lessons/tiragens");
    return { lessons: m.TIRAGENS_LESSONS as unknown as LegacyLesson[], name: "Tiragens" };
  },
  "mesa-taro": async () => {
    const m = await import("@/content/lessons/mesa-taro");
    return { lessons: m.MESA_TARO_LESSONS as unknown as LegacyLesson[], name: "A Mesa do Tarô" };
  },
  "leitura-simbolica": async () => {
    const m = await import("@/content/lessons/leitura-simbolica");
    return { lessons: m.LEITURA_SIMBOLICA_LESSONS as unknown as LegacyLesson[], name: "Leitura Simbólica" };
  },
  "leitura-aplicada": async () => {
    const m = await import("@/content/lessons/leitura-aplicada");
    return { lessons: m.LEITURA_APLICADA_LESSONS as unknown as LegacyLesson[], name: "Leitura Aplicada" };
  },
  "trabalhar-taro": async () => {
    const m = await import("@/content/lessons/trabalhar-taro");
    return { lessons: m.TRABALHAR_TARO_LESSONS as unknown as LegacyLesson[], name: "Trabalhar com o Tarô" };
  },
  combinacoes: async () => {
    const m = await import("@/content/lessons/combinacoes");
    return { lessons: m.COMBINACOES_LESSONS as unknown as LegacyLesson[], name: "Combinações" };
  },
  "arquitetura-menores": async () => {
    const m = await import("@/content/lessons/arquitetura-menores");
    return { lessons: m.ARQUITETURA_MENORES_LESSONS as unknown as LegacyLesson[], name: "Arquitetura dos Menores" };
  },
};

export async function fetchModuleFromLegacy(
  slug: string,
): Promise<{ slug: string; name: string; lessons: LegacyLesson[] } | null> {
  const loader = LESSONS_REGISTRY[slug];
  if (!loader) return null;
  const { lessons, name } = await loader();
  return { slug, name, lessons };
}

export async function fetchLessonFromLegacy(
  moduleSlug: string,
  lessonSlug: string,
): Promise<{ lesson: LegacyLesson; moduleSlug: string; moduleName: string } | null> {
  const mod = await fetchModuleFromLegacy(moduleSlug);
  if (!mod) return null;
  const lesson = mod.lessons.find((l) => l.id === lessonSlug);
  if (!lesson) return null;
  return { lesson, moduleSlug: mod.slug, moduleName: mod.name };
}

export async function fetchQuizFromLegacy(params: {
  moduleSlug?: string;
  lessonSlug?: string;
  arcanoNumero?: number;
}): Promise<{ questions: LegacyLesson["quiz"]; vinculoId: string; vinculoTipo: "licao" | "arcano" } | null> {
  if (params.moduleSlug && params.lessonSlug) {
    const found = await fetchLessonFromLegacy(params.moduleSlug, params.lessonSlug);
    if (!found || !found.lesson.quiz) return null;
    return { questions: found.lesson.quiz, vinculoId: params.lessonSlug, vinculoTipo: "licao" };
  }
  if (params.arcanoNumero != null) {
    const a = fetchArcanoMaiorFromLegacy(params.arcanoNumero);
    if (!a) return null;
    const quiz = (a as unknown as { quiz?: unknown }).quiz;
    if (!Array.isArray(quiz) || quiz.length === 0) return null;
    return {
      questions: quiz as LegacyLesson["quiz"],
      vinculoId: String(params.arcanoNumero),
      vinculoTipo: "arcano",
    };
  }
  return null;
}
