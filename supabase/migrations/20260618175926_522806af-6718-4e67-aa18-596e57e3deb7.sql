
-- 1) Prevent double redemption at the data layer (race-safe)
CREATE UNIQUE INDEX IF NOT EXISTS gift_redemptions_code_user_unique
  ON public.gift_redemptions (gift_code_id, user_id);

-- 2) Harden the RPC
CREATE OR REPLACE FUNCTION public.redeem_gift_code(_code text, _user_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _gift     public.gift_codes%ROWTYPE;
  _uid      uuid := auth.uid();
  _generic  json := json_build_object('success', false, 'error', 'Código inválido');
  _updated  integer;
BEGIN
  -- Require an authenticated caller; ignore any _user_id supplied by the client.
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Autenticação necessária');
  END IF;

  -- Lock the candidate row to serialize concurrent redemptions of the same code.
  SELECT * INTO _gift
  FROM public.gift_codes
  WHERE code = _code
    AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN _generic;
  END IF;

  IF _gift.expires_at IS NOT NULL AND _gift.expires_at < now() THEN
    RETURN _generic;
  END IF;

  IF _gift.current_uses >= _gift.max_uses THEN
    RETURN _generic;
  END IF;

  -- Atomic insert: unique index blocks double redemption by the same user.
  BEGIN
    INSERT INTO public.gift_redemptions (gift_code_id, user_id)
    VALUES (_gift.id, _uid);
  EXCEPTION WHEN unique_violation THEN
    RETURN _generic;
  END;

  -- Atomic counter bump guarded by max_uses to prevent over-redemption.
  UPDATE public.gift_codes
     SET current_uses = current_uses + 1
   WHERE id = _gift.id
     AND current_uses < max_uses;
  GET DIAGNOSTICS _updated = ROW_COUNT;

  IF _updated = 0 THEN
    -- Race lost: roll back the redemption row.
    DELETE FROM public.gift_redemptions
     WHERE gift_code_id = _gift.id AND user_id = _uid;
    RETURN _generic;
  END IF;

  UPDATE public.profiles SET
    is_premium = true,
    premium_source = 'gift',
    premium_until = COALESCE(
      CASE WHEN premium_until > now() THEN premium_until ELSE now() END,
      now()
    ) + (_gift.duration_days || ' days')::INTERVAL
  WHERE user_id = _uid;

  RETURN json_build_object('success', true, 'days', _gift.duration_days);
END;
$function$;

-- 3) Lock down execute privileges (drop the legacy 2-arg signature, keep authenticated on the new one)
REVOKE ALL ON FUNCTION public.redeem_gift_code(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) TO authenticated;
