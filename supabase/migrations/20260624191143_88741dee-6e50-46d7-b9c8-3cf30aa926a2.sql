-- Memória do Agente Arquiteto por projeto

CREATE TABLE public.agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_app_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Conversa principal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_conversations TO authenticated;
GRANT ALL ON public.agent_conversations TO service_role;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own agent_conversations" ON public.agent_conversations
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.user_app_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  module_key text,
  step_key text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX agent_messages_conv_created_idx ON public.agent_messages(conversation_id, created_at);
CREATE INDEX agent_messages_project_idx ON public.agent_messages(project_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_messages TO authenticated;
GRANT ALL ON public.agent_messages TO service_role;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own agent_messages" ON public.agent_messages
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.project_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_app_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  module_key text NOT NULL,
  step_key text,
  title text,
  content text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX project_outputs_project_module_idx ON public.project_outputs(project_id, module_key, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_outputs TO authenticated;
GRANT ALL ON public.project_outputs TO service_role;
ALTER TABLE public.project_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own project_outputs" ON public.project_outputs
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.project_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.user_app_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  summary text NOT NULL DEFAULT '',
  context_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_contexts TO authenticated;
GRANT ALL ON public.project_contexts TO service_role;
ALTER TABLE public.project_contexts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own project_contexts" ON public.project_contexts
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Trigger de updated_at (usa função pública já existente public.update_updated_at_column)
CREATE TRIGGER trg_agent_conversations_updated_at
  BEFORE UPDATE ON public.agent_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_project_contexts_updated_at
  BEFORE UPDATE ON public.project_contexts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();