-- 1. user_access.user_id NOT NULL (fecha o aviso de exposição via linhas com user_id NULL)
ALTER TABLE public.user_access ALTER COLUMN user_id SET NOT NULL;

-- 2. Bloqueia INSERT direto em gift_redemptions; resgate continua via RPC redeem_gift_code (SECURITY DEFINER)
DROP POLICY IF EXISTS "Users can redeem codes" ON public.gift_redemptions;