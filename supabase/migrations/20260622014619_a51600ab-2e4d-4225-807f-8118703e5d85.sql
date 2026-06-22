-- 1) prompt_improvement_logs: add explicit INSERT policy scoping to auth.uid()
CREATE POLICY "Users can insert their own improvement logs"
ON public.prompt_improvement_logs
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2) waitlist: replace misleading USING(false) SELECT policy with admin-only read
DROP POLICY IF EXISTS "No public read access" ON public.waitlist;

CREATE POLICY "Admins can read waitlist"
ON public.waitlist
FOR SELECT TO authenticated
USING (public.is_admin() OR public.has_role(auth.uid(), 'admin'::app_role));

-- 3) support_messages: tighten INSERT WITH CHECK (true) to require non-empty message
DROP POLICY IF EXISTS "Anyone can submit a support message" ON public.support_messages;

CREATE POLICY "Anyone can submit a support message"
ON public.support_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  message IS NOT NULL
  AND length(trim(message)) BETWEEN 1 AND 5000
);