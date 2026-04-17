/**
 * Repositórios brutos — DB. Cada função faz UMA query e retorna a row crua.
 * Não traduz para tipo canônico — isso é trabalho dos mappers.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  DbArcanoRow,
  DbLessonRow,
  DbModuleRow,
  DbQuizQuestionRow,
  DbQuizRow,
} from "./mappers-db";

// ─── Arcanos ───────────────────────────────────────────────────────

export async function fetchArcanoMaiorFromDb(
  numero: number,
): Promise<DbArcanoRow | null> {
  const { data, error } = await supabase
    .from("cms_arcanos")
    .select("*")
    .eq("type", "maior")
    .eq("number", numero)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as DbArcanoRow) ?? null;
}

export async function fetchArcanoMenorFromDb(
  naipe: "copas" | "paus" | "espadas" | "ouros",
  numero: number,
): Promise<DbArcanoRow | null> {
  const { data, error } = await supabase
    .from("cms_arcanos")
    .select("*")
    .eq("type", "menor")
    .eq("naipe", naipe)
    .eq("number", numero)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as DbArcanoRow) ?? null;
}

export async function listArcanosMaioresFromDb(): Promise<DbArcanoRow[]> {
  const { data, error } = await supabase
    .from("cms_arcanos")
    .select("*")
    .eq("type", "maior")
    .order("number", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbArcanoRow[]) ?? [];
}

export async function listArcanosMenoresFromDb(
  naipe?: "copas" | "paus" | "espadas" | "ouros",
): Promise<DbArcanoRow[]> {
  let q = supabase.from("cms_arcanos").select("*").eq("type", "menor");
  if (naipe) q = q.eq("naipe", naipe);
  const { data, error } = await q.order("number", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbArcanoRow[]) ?? [];
}

// ─── Quizzes ───────────────────────────────────────────────────────

export interface QuizWithQuestions {
  quiz: DbQuizRow;
  questions: DbQuizQuestionRow[];
}

export async function fetchQuizFromDb(
  quizId: string,
): Promise<QuizWithQuestions | null> {
  const { data: quiz, error: e1 } = await supabase
    .from("cms_quizzes")
    .select("*")
    .eq("id", quizId)
    .maybeSingle();
  if (e1) throw e1;
  if (!quiz) return null;

  const { data: questions, error: e2 } = await supabase
    .from("cms_quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });
  if (e2) throw e2;

  return {
    quiz: quiz as unknown as DbQuizRow,
    questions: (questions as unknown as DbQuizQuestionRow[]) ?? [],
  };
}

export async function fetchQuizByLinkedToFromDb(
  linkedTo: string,
): Promise<QuizWithQuestions | null> {
  const { data: quiz, error } = await supabase
    .from("cms_quizzes")
    .select("*")
    .eq("linked_to", linkedTo)
    .maybeSingle();
  if (error) throw error;
  if (!quiz) return null;
  return fetchQuizFromDb((quiz as { id: string }).id);
}

// ─── Lessons ───────────────────────────────────────────────────────

export async function fetchLessonFromDb(
  lessonSlug: string,
): Promise<{ lesson: DbLessonRow; module: DbModuleRow } | null> {
  const { data: lesson, error: e1 } = await supabase
    .from("cms_module_lessons")
    .select("*")
    .eq("lesson_id", lessonSlug)
    .maybeSingle();
  if (e1) throw e1;
  if (!lesson) return null;

  const lessonRow = lesson as unknown as DbLessonRow;
  const { data: mod, error: e2 } = await supabase
    .from("cms_modules")
    .select("*")
    .eq("id", lessonRow.module_id)
    .maybeSingle();
  if (e2) throw e2;
  if (!mod) return null;

  return { lesson: lessonRow, module: mod as unknown as DbModuleRow };
}

// ─── Modules ───────────────────────────────────────────────────────

export async function fetchModuleFromDb(
  slug: string,
): Promise<{ module: DbModuleRow; lessons: DbLessonRow[] } | null> {
  const { data: mod, error: e1 } = await supabase
    .from("cms_modules")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (e1) throw e1;
  if (!mod) return null;

  const moduleRow = mod as unknown as DbModuleRow;
  const { data: lessons, error: e2 } = await supabase
    .from("cms_module_lessons")
    .select("*")
    .eq("module_id", moduleRow.id)
    .order("order_index", { ascending: true });
  if (e2) throw e2;

  return {
    module: moduleRow,
    lessons: (lessons as unknown as DbLessonRow[]) ?? [],
  };
}

export async function listModulesFromDb(): Promise<DbModuleRow[]> {
  const { data, error } = await supabase
    .from("cms_modules")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbModuleRow[]) ?? [];
}
