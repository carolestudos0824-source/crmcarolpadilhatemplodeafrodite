REVOKE INSERT, UPDATE, DELETE ON public.user_access FROM authenticated;
GRANT SELECT ON public.user_access TO authenticated;
GRANT ALL ON public.user_access TO service_role;