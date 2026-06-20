
CREATE TABLE public.prompt_improvement_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('lovable','agent')),
  module_id TEXT,
  module_title TEXT,
  input_length INTEGER NOT NULL DEFAULT 0,
  output_length INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX prompt_improvement_logs_user_created_idx
  ON public.prompt_improvement_logs (user_id, created_at DESC);

GRANT SELECT ON public.prompt_improvement_logs TO authenticated;
GRANT ALL ON public.prompt_improvement_logs TO service_role;

ALTER TABLE public.prompt_improvement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own improvement logs"
  ON public.prompt_improvement_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all improvement logs"
  ON public.prompt_improvement_logs FOR SELECT
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));
