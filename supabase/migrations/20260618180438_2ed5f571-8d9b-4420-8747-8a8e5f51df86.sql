
-- Ensure digest() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Audit table
CREATE TABLE IF NOT EXISTS public.gift_code_redemption_attempts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL,
  code_hash   text NOT NULL,
  outcome     text NOT NULL,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gift_code_redemption_attempts_outcome_chk
    CHECK (outcome IN ('success','invalid','rate_limited','error'))
);

CREATE INDEX IF NOT EXISTS gcra_user_created_idx
  ON public.gift_code_redemption_attempts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS gcra_code_created_idx
  ON public.gift_code_redemption_attempts (code_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS gcra_outcome_created_idx
  ON public.gift_code_redemption_attempts (outcome, created_at DESC);

-- Grants: only service_role can touch it directly; the SECURITY DEFINER RPC writes via its owner.
GRANT ALL ON public.gift_code_redemption_attempts TO service_role;

ALTER TABLE public.gift_code_redemption_attempts ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated by design (RPC-only writes; admin reads via service_role).

-- 2) Hardened RPC with rate limit + audit
CREATE OR REPLACE FUNCTION public.redeem_gift_code(_code text, _user_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _gift       public.gift_codes%ROWTYPE;
  _uid        uuid := auth.uid();
  _norm_code  text := lower(trim(coalesce(_code, '')));
  _hash       text;
  _generic    json := json_build_object('success', false, 'error', 'Código inválido');
  _ratelimit  json := json_build_object('success', false, 'error', 'Muitas tentativas. Tente novamente em alguns minutos.');
  _recent     integer;
  _updated    integer;
BEGIN
  IF _uid IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Autenticação necessária');
  END IF;

  _hash := encode(digest(_norm_code, 'sha256'), 'hex');

  -- Rate limit: max 10 attempts per 15 min per user
  SELECT count(*) INTO _recent
  FROM public.gift_code_redemption_attempts
  WHERE user_id = _uid
    AND created_at > now() - interval '15 minutes';

  IF _recent >= 10 THEN
    INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome, metadata)
    VALUES (_uid, _hash, 'rate_limited', jsonb_build_object('recent_attempts', _recent));
    RETURN _ratelimit;
  END IF;

  BEGIN
    -- Lock candidate row to serialize concurrent redemptions of the same code
    SELECT * INTO _gift
    FROM public.gift_codes
    WHERE code = _norm_code
      AND is_active = true
    FOR UPDATE;

    IF NOT FOUND
       OR (_gift.expires_at IS NOT NULL AND _gift.expires_at < now())
       OR _gift.current_uses >= _gift.max_uses THEN
      INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome)
      VALUES (_uid, _hash, 'invalid');
      RETURN _generic;
    END IF;

    -- Atomic insert; unique(gift_code_id,user_id) blocks double redemption
    BEGIN
      INSERT INTO public.gift_redemptions (gift_code_id, user_id)
      VALUES (_gift.id, _uid);
    EXCEPTION WHEN unique_violation THEN
      INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome, metadata)
      VALUES (_uid, _hash, 'invalid', jsonb_build_object('reason', 'duplicate'));
      RETURN _generic;
    END;

    UPDATE public.gift_codes
       SET current_uses = current_uses + 1
     WHERE id = _gift.id
       AND current_uses < max_uses;
    GET DIAGNOSTICS _updated = ROW_COUNT;

    IF _updated = 0 THEN
      DELETE FROM public.gift_redemptions
       WHERE gift_code_id = _gift.id AND user_id = _uid;
      INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome, metadata)
      VALUES (_uid, _hash, 'invalid', jsonb_build_object('reason', 'race_lost'));
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

    INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome, metadata)
    VALUES (_uid, _hash, 'success', jsonb_build_object('days', _gift.duration_days));

    RETURN json_build_object(
      'success', true,
      'days', _gift.duration_days,
      'message', 'Código resgatado com sucesso'
    );

  EXCEPTION WHEN OTHERS THEN
    BEGIN
      INSERT INTO public.gift_code_redemption_attempts (user_id, code_hash, outcome, metadata)
      VALUES (_uid, _hash, 'error', jsonb_build_object('sqlstate', SQLSTATE));
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
    RETURN _generic;
  END;
END;
$function$;

REVOKE ALL ON FUNCTION public.redeem_gift_code(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_gift_code(text, uuid) TO authenticated;
