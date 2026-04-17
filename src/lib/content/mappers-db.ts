/**
 * Mappers — DB row → tipo canônico.
 *
 * Estes mappers nunca tocam o legado. Para legado: ver `mappers-legacy.ts`.
 */

import type {
  ArcanoContent,
  LessonContent,
  ModuleContent,
  QuizContent,
} from "./types";
import {
  parseEditorialField,
  parseQuizDificuldade,
  parseQuizStatus,
  parseStatus,
  parseStringArray,
  parseTier,
} from "./parser";
import {
  resolveMaiorVisual,
  resolveMenorVisualById,
  resolveMenorSlug,
} from "./visual-registry";

// ─── Arcano ────────────────────────────────────────────────────────

export interface DbArcanoRow {
  id: string;
  type: "maior" | "menor";
  number: number | null;
  numeral: string | null;
  naipe: "copas" | "paus" | "espadas" | "ouros" | null;
  name: string;
  subtitle: string | null;
  image_url: string | null;
  status: string;
  tier: string;
  validated: boolean;
  essencia: string | null;
  luz: string | null;
  sombra: string | null;
  aprofundamento: string | null;
  voz_do_arcano: string | null;
  arquetipos: string | null;
  jornada: string | null;
  amor: string | null;
  trabalho: string | null;
  espiritualidade: string | null;
  simbolos_centrais: string | null;
  revisao_rapida: string | null;
  cabala: string | null;
  keywords: string[] | null;
}

export function mapDbArcanoToUI(row: DbArcanoRow): ArcanoContent {
  const tipo = row.type;
  const numero = row.number;

  // Slug e visual: para Maior = derivado do registry visual; para Menor = derivado do deck.
  let slug = "";
  let visual = { imageKey: null as string | null, imageUrl: null as string | null, resolvedAssetUrl: null as string | null };

  if (tipo === "maior" && numero != null) {
    visual = resolveMaiorVisual(numero);
    slug = visual.imageKey ?? `arcano-${numero}`;
  } else if (tipo === "menor" && row.naipe && numero != null) {
    // numero 11..14 = corte (pajem/cavaleiro/rainha/rei) — banco usa int; deck usa string
    const posicaoKey = numero >= 11
      ? (["pajem", "cavaleiro", "rainha", "rei"][numero - 11] as string)
      : numero;
    const id = `${row.naipe}-${posicaoKey}`;
    visual = resolveMenorVisualById(id);
    slug = resolveMenorSlug(row.naipe, posicaoKey) ?? id;
  }

  // image_url do banco tem precedência sobre asset local (quando existir CDN).
  if (row.image_url) {
    visual = {
      imageKey: visual.imageKey,
      imageUrl: row.image_url,
      resolvedAssetUrl: row.image_url,
    };
  }

  return {
    id: row.id,
    tipo,
    numero,
    numeral: row.numeral,
    naipe: row.naipe,
    nome: row.name,
    slug,
    subtitulo: row.subtitle,
    tier: parseTier(row.tier),
    status: parseStatus(row.status),
    validado: row.validated,
    editorial: {
      essencia: parseEditorialField(row.essencia),
      simbolosCentrais: parseEditorialField(row.simbolos_centrais),
      arquetipo: parseEditorialField(row.arquetipos),
      luz: parseEditorialField(row.luz),
      sombra: parseEditorialField(row.sombra),
      jornada: parseEditorialField(row.jornada),
      amor: parseEditorialField(row.amor),
      trabalho: parseEditorialField(row.trabalho),
      espiritualidade: parseEditorialField(row.espiritualidade),
      vozDoArcano: parseEditorialField(row.voz_do_arcano),
      aprofundamento: parseEditorialField(row.aprofundamento),
      cabala: parseEditorialField(row.cabala),
      revisaoRapida: parseEditorialField(row.revisao_rapida),
      palavrasChave: parseStringArray(row.keywords),
    },
    visual,
    quiz: null, // lazy: hidratado por useQuizContent quando a tela precisar
    metadata: {
      source: "db",
      sourceId: row.id,
    },
  };
}

// ─── Quiz ──────────────────────────────────────────────────────────

export interface DbQuizRow {
  id: string;
  title: string;
  status: string;
  xp_reward: number;
  module_id: string | null;
  linked_to: string | null;
  difficulty?: string | null;
  result_text?: string | null;
}

export interface DbQuizQuestionRow {
  id: string;
  quiz_id: string;
  prompt: string;
  options: unknown; // jsonb → string[]
  correct_index: number;
  explanation: string | null;
  order_index: number;
}

export function mapDbQuizToUI(
  quiz: DbQuizRow,
  questions: DbQuizQuestionRow[],
): QuizContent {
  const vinculo = resolveQuizVinculo(quiz);
  const perguntas = [...questions]
    .sort((a, b) => a.order_index - b.order_index)
    .map((q) => ({
      id: q.id,
      ordem: q.order_index,
      enunciado: q.prompt,
      alternativas: Array.isArray(q.options) ? (q.options as string[]) : [],
      correta: q.correct_index,
      explicacao: q.explanation ?? undefined,
    }));

  return {
    id: quiz.id,
    titulo: quiz.title,
    subtitulo: quiz.result_text ?? undefined,
    status: parseQuizStatus(quiz.status),
    tier: "premium",
    xp: quiz.xp_reward ?? 0,
    dificuldade: parseQuizDificuldade(quiz.difficulty),
    perguntas,
    vinculo,
    metadata: { source: "db", sourceId: quiz.id },
  };
}

function resolveQuizVinculo(q: DbQuizRow): QuizContent["vinculo"] {
  if (q.module_id) return { tipo: "modulo", id: q.module_id };
  const linked = q.linked_to ?? "";
  if (linked.startsWith("arcano-")) {
    return { tipo: "arcano", id: linked.replace(/^arcano-/, "") };
  }
  return { tipo: "licao", id: linked || q.id };
}

// ─── Lesson ────────────────────────────────────────────────────────

export interface DbLessonRow {
  id: string;
  lesson_id: string;
  module_id: string;
  title: string;
  order_index: number;
  // Campos editoriais ainda não existem no schema atual — adicionados na Fase 6.
  subtitle?: string | null;
  intro?: string | null;
  main_content?: string | null;
  deep_dive?: string | null;
  practical_example?: string | null;
  exercise?: string | null;
  quick_review?: string | null;
}

export interface DbLessonContext {
  moduleSlug: string;
  moduleName: string;
  moduleTier: string;
  moduleStatus: string;
}

export function mapDbLessonToUI(
  row: DbLessonRow,
  ctx: DbLessonContext,
): LessonContent {
  return {
    id: row.id,
    slug: row.lesson_id,
    titulo: row.title,
    subtitulo: row.subtitle ?? undefined,
    moduloId: row.module_id,
    moduloSlug: ctx.moduleSlug,
    moduloNome: ctx.moduleName,
    ordem: row.order_index ?? 0,
    tier: parseTier(ctx.moduleTier),
    status: parseStatus(ctx.moduleStatus),
    editorial: {
      intro: parseEditorialField(row.intro),
      conteudoPrincipal: parseEditorialField(row.main_content),
      aprofundamento: parseEditorialField(row.deep_dive),
      exemploPratico: parseEditorialField(row.practical_example),
      exercicio: parseEditorialField(row.exercise),
      revisaoRapida: parseEditorialField(row.quick_review),
      citacao: undefined,
      pratica: undefined,
    },
    quiz: null, // lazy
    metadata: { source: "db", sourceId: row.id },
  };
}

// ─── Module ────────────────────────────────────────────────────────

export interface DbModuleRow {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  short_description: string | null;
  editorial_description: string | null;
  icon: string | null;
  route_prefix: string | null;
  order_index: number;
  status: string;
  tier: string;
  theme_color: string | null;
}

export function mapDbModuleToUI(
  row: DbModuleRow,
  lessons: DbLessonRow[],
): ModuleContent {
  const ctx: DbLessonContext = {
    moduleSlug: row.slug,
    moduleName: row.name,
    moduleTier: row.tier,
    moduleStatus: row.status,
  };
  const moduleTier = parseTier(row.tier);
  const moduleStatus = parseStatus(row.status);
  return {
    id: row.id,
    slug: row.slug,
    nome: row.name,
    categoryLabel: row.category ?? undefined,
    descricaoCurta: row.short_description ?? undefined,
    descricaoEditorial: row.editorial_description ?? undefined,
    editorialIntro: undefined,
    ordem: row.order_index,
    tier: moduleTier,
    status: moduleStatus,
    themeColor: row.theme_color ?? undefined,
    licoes: [...lessons]
      .sort((a, b) => a.order_index - b.order_index)
      .map((l) => ({
        id: l.id,
        slug: l.lesson_id,
        titulo: l.title,
        subtitulo: l.subtitle ?? undefined,
        ordem: l.order_index ?? 0,
        tier: moduleTier,
        status: moduleStatus,
        quizDisponivel: false,
        arcanoSlug: undefined,
      })),
    metadata: { source: "db", sourceId: row.id },
  };
}
