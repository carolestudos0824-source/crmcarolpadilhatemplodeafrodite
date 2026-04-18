
CREATE OR REPLACE FUNCTION public.enforce_quiz_publish_threshold()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  valid_count integer;
BEGIN
  IF NEW.status = 'published' THEN
    SELECT COUNT(*) INTO valid_count
    FROM public.cms_quiz_questions qq
    WHERE qq.quiz_id = NEW.id
      AND jsonb_array_length(qq.options) >= 2
      AND qq.correct_index >= 0
      AND qq.correct_index < jsonb_array_length(qq.options);

    IF valid_count < 3 OR NEW.linked_to IS NULL OR NEW.xp_reward <= 0 THEN
      NEW.status := 'draft';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_quiz_publish_threshold ON public.cms_quizzes;
CREATE TRIGGER trg_enforce_quiz_publish_threshold
BEFORE INSERT OR UPDATE OF status, linked_to, xp_reward ON public.cms_quizzes
FOR EACH ROW
EXECUTE FUNCTION public.enforce_quiz_publish_threshold();
