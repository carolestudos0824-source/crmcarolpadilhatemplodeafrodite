
-- Subscription events: source-of-truth log for real billing events.
-- Will be populated by Stripe webhook handler once integration is live.
-- Until then, table stays empty and UI shows "Aguardando Stripe".

CREATE TYPE public.subscription_event_type AS ENUM (
  'checkout_completed',
  'subscription_created',
  'subscription_renewed',
  'subscription_cancelled',
  'subscription_expired',
  'payment_succeeded',
  'payment_failed',
  'refund_issued'
);

CREATE TYPE public.billing_provider AS ENUM ('stripe', 'paddle', 'revenuecat', 'manual');

CREATE TABLE public.subscription_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  provider public.billing_provider NOT NULL,
  provider_event_id TEXT,
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  event_type public.subscription_event_type NOT NULL,
  plan_code TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'BRL',
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE INDEX subscription_events_user_idx ON public.subscription_events (user_id, occurred_at DESC);
CREATE INDEX subscription_events_type_idx ON public.subscription_events (event_type, occurred_at DESC);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Only admins can read. Inserts will only ever happen via service-role from
-- the future webhook edge function — no client-side insert policy on purpose.
CREATE POLICY "Admins can view subscription events"
  ON public.subscription_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
