// Stripe webhook handler — receives billing events, persists them in
// subscription_events, and mirrors premium status to profiles.
//
// Public function (verify_jwt=false). Authenticity verified via Stripe SDK
// using STRIPE_WEBHOOK_SECRET (constructEventAsync — Deno-safe).
//
// Required env:
// - STRIPE_SECRET_KEY
// - STRIPE_WEBHOOK_SECRET

import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Map Stripe event type → our internal event_type enum.
const EVENT_TYPE_MAP: Record<string, string> = {
  "checkout.session.completed": "checkout_completed",
  "customer.subscription.created": "subscription_created",
  "customer.subscription.updated": "subscription_renewed",
  "customer.subscription.deleted": "subscription_cancelled",
  "invoice.paid": "payment_succeeded",
  "invoice.payment_succeeded": "payment_succeeded",
  "invoice.payment_failed": "payment_failed",
  "charge.refunded": "refund_issued",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
  const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    return json(
      { error: "Stripe pendente: STRIPE_SECRET_KEY e/ou STRIPE_WEBHOOK_SECRET não configurados." },
      503,
    );
  }

  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) return json({ error: "Missing Stripe-Signature header" }, 400);

  const rawBody = await req.text();

  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" });

  let event: Stripe.Event;
  try {
    // Deno-safe async verification (uses SubtleCrypto).
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sigHeader,
      WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return json({ error: "Invalid signature" }, 401);
  }

  const internalType = EVENT_TYPE_MAP[event.type];
  if (!internalType) {
    return json({ received: true, ignored: event.type });
  }

  const admin = createClient(SUPABASE_URL, SERVICE);
  const obj = event.data.object as Record<string, unknown>;

  // Best-effort field extraction (shape varies by event type).
  const customerId = (obj.customer as string) ?? null;
  const subscriptionId = (obj.subscription as string) ?? (obj.id as string) ?? null;
  const amountCents =
    (obj.amount_paid as number) ??
    (obj.amount_total as number) ??
    (obj.amount as number) ??
    null;
  const currency = ((obj.currency as string) ?? "brl").toUpperCase();

  // Metadata may live on the object or its parent subscription.
  let userId = ((obj.metadata as { user_id?: string })?.user_id) ?? null;
  let planCode = ((obj.metadata as { plan_code?: string })?.plan_code) ?? null;

  // For invoice events, fetch parent subscription to recover metadata.
  if (!userId && subscriptionId && event.type.startsWith("invoice.")) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      userId = sub.metadata?.user_id ?? null;
      planCode = sub.metadata?.plan_code ?? null;
    } catch (e) {
      console.warn("[stripe-webhook] could not fetch parent subscription", e);
    }
  }

  // Idempotent insert via UNIQUE (provider, provider_event_id).
  const { error: insertErr } = await admin.from("subscription_events").insert({
    user_id: userId,
    provider: "stripe",
    provider_event_id: event.id,
    provider_customer_id: customerId,
    provider_subscription_id: subscriptionId,
    event_type: internalType as
      | "checkout_completed"
      | "subscription_created"
      | "subscription_renewed"
      | "subscription_cancelled"
      | "payment_succeeded"
      | "payment_failed"
      | "refund_issued",
    plan_code: planCode,
    amount_cents: amountCents,
    currency,
    raw_payload: event as unknown as Record<string, unknown>,
  });

  if (insertErr && !insertErr.message.includes("duplicate")) {
    console.error("[stripe-webhook] insert failed", insertErr);
    return json({ error: "DB insert failed" }, 500);
  }

  // Mirror to profiles.is_premium for fast access checks.
  if (userId) {
    if (
      internalType === "subscription_created" ||
      internalType === "subscription_renewed" ||
      internalType === "payment_succeeded" ||
      internalType === "checkout_completed"
    ) {
      const periodEndUnix = (obj.current_period_end as number) ?? null;
      const premium_until = periodEndUnix
        ? new Date(periodEndUnix * 1000).toISOString()
        : null;
      await admin
        .from("profiles")
        .update({
          is_premium: true,
          premium_source: planCode === "annual" ? "store_annual" : "store_monthly",
          ...(premium_until ? { premium_until } : {}),
        })
        .eq("user_id", userId);
    } else if (internalType === "subscription_cancelled") {
      // Don't revoke instantly — let access run until current_period_end.
      // Flip is_premium=false so renewal stops; premium_until preserves grace window.
      const periodEndUnix = (obj.current_period_end as number) ?? null;
      const premium_until = periodEndUnix
        ? new Date(periodEndUnix * 1000).toISOString()
        : null;
      await admin
        .from("profiles")
        .update({
          is_premium: false,
          ...(premium_until ? { premium_until } : {}),
        })
        .eq("user_id", userId);
    }
    // payment_failed: no instant revoke (dunning handled separately).
  }

  return json({ received: true, type: internalType });
});
