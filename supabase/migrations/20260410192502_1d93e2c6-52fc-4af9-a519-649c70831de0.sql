
-- FIX user_progress: prevent users from manipulating xp, streak, level
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can update own progress safely"
ON public.user_progress
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND xp IS NOT DISTINCT FROM (SELECT p.xp FROM public.user_progress p WHERE p.user_id = auth.uid())
  AND streak IS NOT DISTINCT FROM (SELECT p.streak FROM public.user_progress p WHERE p.user_id = auth.uid())
  AND level IS NOT DISTINCT FROM (SELECT p.level FROM public.user_progress p WHERE p.user_id = auth.uid())
);
