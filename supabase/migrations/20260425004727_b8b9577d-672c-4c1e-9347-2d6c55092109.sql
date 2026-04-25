-- Add Stripe customer linkage on profiles + index for fast webhook lookups.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON public.profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Backfill existing premium users from prior subscription_events.
UPDATE public.profiles p
SET stripe_customer_id = sub.provider_customer_id
FROM (
  SELECT DISTINCT ON (user_id)
         user_id,
         provider_customer_id
  FROM public.subscription_events
  WHERE provider = 'stripe'
    AND user_id IS NOT NULL
    AND provider_customer_id IS NOT NULL
  ORDER BY user_id, occurred_at DESC
) sub
WHERE p.user_id = sub.user_id
  AND p.stripe_customer_id IS NULL;