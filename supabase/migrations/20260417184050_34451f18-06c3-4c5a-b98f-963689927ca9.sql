-- Add unique external_id to cms_quizzes so we can upsert/idempotently seed quizzes
-- and reference them from cms_quiz_questions inserts.
CREATE UNIQUE INDEX IF NOT EXISTS cms_quizzes_external_id_uniq
  ON public.cms_quizzes (external_id)
  WHERE external_id IS NOT NULL;