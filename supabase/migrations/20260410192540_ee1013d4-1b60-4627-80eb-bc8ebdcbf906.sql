
-- Revert: allow client to update progress (including xp/streak/level for now)
-- The FlutterFlow implementation should move xp/streak/level to server-side functions
DROP POLICY IF EXISTS "Users can update own progress safely" ON public.user_progress;

CREATE POLICY "Users can update own progress"
ON public.user_progress
FOR UPDATE
TO public
USING (auth.uid() = user_id);
