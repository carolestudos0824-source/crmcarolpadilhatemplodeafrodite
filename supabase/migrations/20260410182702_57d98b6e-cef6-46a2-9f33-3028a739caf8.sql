
-- 1. Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Gift codes table
CREATE TABLE public.gift_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  duration_days INTEGER NOT NULL DEFAULT 30,
  max_uses INTEGER NOT NULL DEFAULT 1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage gift codes"
ON public.gift_codes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can read active codes (for redemption validation)
CREATE POLICY "Users can read active codes"
ON public.gift_codes FOR SELECT
TO authenticated
USING (is_active = true);

-- 3. Gift redemptions table
CREATE TABLE public.gift_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_code_id UUID NOT NULL REFERENCES public.gift_codes(id),
  user_id UUID NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
ON public.gift_redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem codes"
ON public.gift_redemptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions"
ON public.gift_redemptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Admin can view all profiles for dashboard
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Admin can update any profile (to grant premium manually)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Admin can view all progress
CREATE POLICY "Admins can view all progress"
ON public.user_progress FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Admin can view all quiz responses
CREATE POLICY "Admins can view all quiz responses"
ON public.quiz_responses FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Function to redeem a gift code
CREATE OR REPLACE FUNCTION public.redeem_gift_code(_code TEXT, _user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _gift gift_codes%ROWTYPE;
  _result JSON;
BEGIN
  -- Find the code
  SELECT * INTO _gift FROM gift_codes WHERE code = _code AND is_active = true;
  
  IF _gift IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Código inválido ou expirado');
  END IF;

  -- Check expiry
  IF _gift.expires_at IS NOT NULL AND _gift.expires_at < now() THEN
    RETURN json_build_object('success', false, 'error', 'Código expirado');
  END IF;

  -- Check uses
  IF _gift.current_uses >= _gift.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'Código já foi utilizado o máximo de vezes');
  END IF;

  -- Check if user already redeemed this code
  IF EXISTS (SELECT 1 FROM gift_redemptions WHERE gift_code_id = _gift.id AND user_id = _user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Você já resgatou este código');
  END IF;

  -- Redeem: insert redemption, update uses, update profile
  INSERT INTO gift_redemptions (gift_code_id, user_id) VALUES (_gift.id, _user_id);
  
  UPDATE gift_codes SET current_uses = current_uses + 1 WHERE id = _gift.id;
  
  UPDATE profiles SET
    is_premium = true,
    premium_source = 'gift',
    premium_until = COALESCE(
      CASE WHEN premium_until > now() THEN premium_until ELSE now() END,
      now()
    ) + (_gift.duration_days || ' days')::INTERVAL
  WHERE user_id = _user_id;

  RETURN json_build_object('success', true, 'days', _gift.duration_days);
END;
$$;
