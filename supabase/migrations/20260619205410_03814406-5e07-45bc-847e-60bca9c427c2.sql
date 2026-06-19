CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'novo'
);

GRANT INSERT ON public.support_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a support message"
  ON public.support_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read support messages"
  ON public.support_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update support messages"
  ON public.support_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete support messages"
  ON public.support_messages
  FOR DELETE
  TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));