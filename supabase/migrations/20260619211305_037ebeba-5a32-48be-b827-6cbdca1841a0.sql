-- Tabela de progresso por aluno
CREATE TABLE public.user_progress_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_module text,
  modules_done jsonb NOT NULL DEFAULT '{}'::jsonb,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  commands_done jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTs: nada para anon. authenticated filtrado por RLS. service_role full.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress_state TO authenticated;
GRANT ALL ON public.user_progress_state TO service_role;

-- RLS
ALTER TABLE public.user_progress_state ENABLE ROW LEVEL SECURITY;

-- Políticas: cada aluno só toca a própria linha
CREATE POLICY "Users can read their own progress"
  ON public.user_progress_state
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress_state
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON public.user_progress_state
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress_state
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger de updated_at reaproveitando a função já existente no projeto
CREATE TRIGGER update_user_progress_state_updated_at
  BEFORE UPDATE ON public.user_progress_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
