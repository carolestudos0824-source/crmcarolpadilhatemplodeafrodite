
CREATE TABLE IF NOT EXISTS public.user_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  has_access boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_access_user_id_idx ON public.user_access(user_id);
CREATE INDEX IF NOT EXISTS user_access_email_idx ON public.user_access(lower(email));

GRANT SELECT ON public.user_access TO authenticated;
GRANT ALL ON public.user_access TO service_role;

ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own access"
ON public.user_access
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage access"
ON public.user_access
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
