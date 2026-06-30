
-- 1. Add id column (new PK) if not exists
ALTER TABLE public.user_progress_state
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

UPDATE public.user_progress_state SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE public.user_progress_state ALTER COLUMN id SET NOT NULL;

-- 2. Swap primary key from (user_id) to (id)
ALTER TABLE public.user_progress_state DROP CONSTRAINT IF EXISTS user_progress_state_pkey;
ALTER TABLE public.user_progress_state ADD PRIMARY KEY (id);

-- 3. Add project_id referencing user_app_projects
ALTER TABLE public.user_progress_state
  ADD COLUMN IF NOT EXISTS project_id uuid
  REFERENCES public.user_app_projects(id) ON DELETE CASCADE;

-- 4. Unique constraint (user_id, project_id) — NULLs are allowed multiple times
--    so we add a partial unique index for the legacy row separately.
ALTER TABLE public.user_progress_state
  DROP CONSTRAINT IF EXISTS user_progress_state_user_project_unique;
ALTER TABLE public.user_progress_state
  ADD CONSTRAINT user_progress_state_user_project_unique UNIQUE (user_id, project_id);

-- 5. Index for project_id lookups
CREATE INDEX IF NOT EXISTS user_progress_state_project_id_idx
  ON public.user_progress_state (project_id);

-- 6. Partial unique to keep at most one legacy row per user_id (project_id NULL)
CREATE UNIQUE INDEX IF NOT EXISTS user_progress_state_user_id_legacy_unique
  ON public.user_progress_state (user_id)
  WHERE project_id IS NULL;

-- 7. RLS policies: tighten to require project ownership when project_id is set
DROP POLICY IF EXISTS "Users can read their own progress" ON public.user_progress_state;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress_state;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress_state;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress_state;

CREATE POLICY "Users can read their own progress"
  ON public.user_progress_state
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress_state
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      project_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.user_app_projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own progress"
  ON public.user_progress_state
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (
      project_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.user_app_projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress_state
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
