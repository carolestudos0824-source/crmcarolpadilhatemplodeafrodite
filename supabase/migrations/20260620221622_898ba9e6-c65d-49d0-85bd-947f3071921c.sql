
-- 1. user_app_projects
CREATE TABLE public.user_app_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name text NOT NULL,
  app_description text,
  target_audience text,
  problem_solved text,
  main_promise text,
  main_user_action text,
  product_or_service text,
  pricing_model text,
  needs_login boolean NOT NULL DEFAULT false,
  needs_database boolean NOT NULL DEFAULT false,
  needs_paid_area boolean NOT NULL DEFAULT false,
  needs_admin boolean NOT NULL DEFAULT false,
  needs_checkout boolean NOT NULL DEFAULT false,
  visual_style text,
  notes text,
  status text NOT NULL DEFAULT 'ideia',
  current_module_id text,
  completed_module_ids text[] NOT NULL DEFAULT '{}',
  last_opened_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_app_projects_status_check CHECK (status IN (
    'ideia','planejando','construindo','revisando','publicado','vendendo','escalando','pausado','arquivado'
  ))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_app_projects TO authenticated;
GRANT ALL ON public.user_app_projects TO service_role;

ALTER TABLE public.user_app_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uap_select_own" ON public.user_app_projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "uap_insert_own" ON public.user_app_projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uap_update_own" ON public.user_app_projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "uap_delete_own" ON public.user_app_projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_uap_user_id ON public.user_app_projects(user_id);
CREATE INDEX idx_uap_status ON public.user_app_projects(status);
CREATE INDEX idx_uap_last_opened_at ON public.user_app_projects(last_opened_at DESC);
CREATE INDEX idx_uap_created_at ON public.user_app_projects(created_at DESC);
CREATE INDEX idx_uap_archived_at ON public.user_app_projects(archived_at);

CREATE TRIGGER trg_uap_updated_at
  BEFORE UPDATE ON public.user_app_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. user_app_project_prompts
CREATE TABLE public.user_app_project_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.user_app_projects(id) ON DELETE CASCADE,
  module_id text,
  module_title text,
  prompt_type text NOT NULL,
  title text,
  prompt_text text NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uapp_prompt_type_check CHECK (prompt_type IN (
    'lovable','agent','review_lovable','review_agent','improved','manual'
  )),
  CONSTRAINT uapp_source_check CHECK (source IN (
    'command_card','module_review','prompt_studio','manual'
  ))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_app_project_prompts TO authenticated;
GRANT ALL ON public.user_app_project_prompts TO service_role;

ALTER TABLE public.user_app_project_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uapp_select_own" ON public.user_app_project_prompts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "uapp_insert_own" ON public.user_app_project_prompts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.user_app_projects p
      WHERE p.id = project_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "uapp_update_own" ON public.user_app_project_prompts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.user_app_projects p
      WHERE p.id = project_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "uapp_delete_own" ON public.user_app_project_prompts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_uapp_user_id ON public.user_app_project_prompts(user_id);
CREATE INDEX idx_uapp_project_id ON public.user_app_project_prompts(project_id);
CREATE INDEX idx_uapp_module_id ON public.user_app_project_prompts(module_id);
CREATE INDEX idx_uapp_prompt_type ON public.user_app_project_prompts(prompt_type);
CREATE INDEX idx_uapp_created_at ON public.user_app_project_prompts(created_at DESC);

CREATE TRIGGER trg_uapp_updated_at
  BEFORE UPDATE ON public.user_app_project_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
