CREATE POLICY "gcra_self_select"
  ON public.gift_code_redemption_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "uae_self_insert"
  ON public.user_activity_events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "up_self_insert"
  ON public.user_presence
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "up_self_update"
  ON public.user_presence
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);