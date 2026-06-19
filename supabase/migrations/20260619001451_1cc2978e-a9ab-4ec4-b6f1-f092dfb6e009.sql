
-- 1) Função is_admin(uuid) — versão parametrizada (segurança definer)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  )
$$;

-- 2) admin_users: leitura apenas por admins autenticados
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;
CREATE POLICY "Only admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 3) subscription_events: usuário vê apenas os próprios eventos
DROP POLICY IF EXISTS "Users can view own subscription events" ON public.subscription_events;
CREATE POLICY "Users can view own subscription events"
ON public.subscription_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4) user_progress: trocar policies {public} por {authenticated}
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress"
ON public.user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5) profiles: tirar role public das policies próprias
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- A policy "Users can update own safe fields" já existe com WITH CHECK robusto;
-- só trocamos o role para authenticated.
DROP POLICY IF EXISTS "Users can update own safe fields" ON public.profiles;
CREATE POLICY "Users can update own safe fields"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  (auth.uid() = user_id)
  AND (NOT (is_premium IS DISTINCT FROM (SELECT p.is_premium FROM public.profiles p WHERE p.user_id = auth.uid())))
  AND (NOT (premium_until IS DISTINCT FROM (SELECT p.premium_until FROM public.profiles p WHERE p.user_id = auth.uid())))
  AND (NOT (premium_source IS DISTINCT FROM (SELECT p.premium_source FROM public.profiles p WHERE p.user_id = auth.uid())))
);

-- 6) beta_feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.beta_feedback;
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.beta_feedback;

CREATE POLICY "Users can view own feedback"
ON public.beta_feedback
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
ON public.beta_feedback
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 7) quiz_responses
DROP POLICY IF EXISTS "Users can view own quiz responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Users can insert own quiz responses" ON public.quiz_responses;

CREATE POLICY "Users can view own quiz responses"
ON public.quiz_responses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
ON public.quiz_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8) daily_challenge_completions
DROP POLICY IF EXISTS "Users can view own challenge completions" ON public.daily_challenge_completions;
DROP POLICY IF EXISTS "Users can insert own challenge completions" ON public.daily_challenge_completions;

CREATE POLICY "Users can view own challenge completions"
ON public.daily_challenge_completions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge completions"
ON public.daily_challenge_completions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 9) atendimentos
DROP POLICY IF EXISTS "Users can manage their own atendimentos" ON public.atendimentos;
CREATE POLICY "Users can manage their own atendimentos"
ON public.atendimentos
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 10) clientes
DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clientes;
CREATE POLICY "Users can manage their own clients"
ON public.clientes
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
