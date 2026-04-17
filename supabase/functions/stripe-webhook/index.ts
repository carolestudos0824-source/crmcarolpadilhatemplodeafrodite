// Stripe webhook handler — receives billing events and writes them to
// subscription_events + updates profiles.is_premium accordingly.
//
// STATE: scaffolding. Will only run end-to-end once STRIPE_WEBHOOK_SECRET
// is configured. Until then, every request returns 503 with a clear reason.
//
// This function is PUBLIC (verify_jwt=false) — Stripe calls it with no JWT.
// Authenticity is verified via Stripe-Signature HMAC.

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

// Minimal HMAC-SHA256 verification of Stripe-Signature header.
// Stripe format: t=timestamp,v1=signature
async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const signedPayload = `${t}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expected === v1;
}

// Map Stripe event type → our internal event_type enum.
const EVENT_TYPE_MAP: Record<string, string> = {
  "checkout.session.completed": "checkout_completed",
  "customer.subscription.created": "subscription_created",
  "customer.subscription.updated": "subscription_renewed",
  "customer.subscription.deleted": "subscription_cancelled",
  "invoice.payment_succeeded": "payment_succeeded",
  "invoice.payment_failed": "payment_failed",
  "charge.refunded": "refund_issued",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!WEBHOOK_SECRET) {
    // Honest failure — no fake success, no silent drop.
    return json(
      { error: "Stripe integration pending: STRIPE_WEBHOOK_SECRET not configured." },
      503,
    );
  }

  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) return json({ error: "Missing Stripe-Signature header" }, 400);

  const rawBody = await req.text();

  const valid = await verifyStripeSignature(rawBody, sigHeader, WEBHOOK_SECRET).catch(() => false);
  if (!valid) return json({ error: "Invalid signature" }, 401);

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const stripeEventId = event.id as string;
  const stripeType = event.type as string;
  const internalType = EVENT_TYPE_MAP[stripeType];

  if (!internalType) {
    // Acknowledge unhandled event types so Stripe stops retrying.
    return json({ received: true, ignored: stripeType });
  }

  const admin = createClient(SUPABASE_URL, SERVICE);
  const data = (event.data as { object?: Record<string, unknown> })?.object ?? {};

  // Best-effort field extraction (shape varies by event type).
  const customerId = (data.customer as string) ?? null;
  const subscriptionId = (data.subscription as string) ?? (data.id as string) ?? null;
  const amountCents = (data.amount_paid as number) ?? (data.amount_total as number) ?? (data.amount as number) ?? null;
  const currency = ((data.currency as string) ?? "brl").toUpperCase();
  const userId = ((data.metadata as { user_id?: string })?.user_id) ?? null;
  const planCode = ((data.metadata as { plan_code?: string })?.plan_code) ?? null;

  // Idempotent insert via UNIQUE (provider, provider_event_id).
  const { error: insertErr } = await admin.from("subscription_events").insert({
    user_id: userId,
    provider: "stripe",
    provider_event_id: stripeEventId,
    provider_customer_id: customerId,
    provider_subscription_id: subscriptionId,
    event_type: internalType,
    plan_code: planCode,
    amount_cents: amountCents,
    currency,
    raw_payload: event,
  });

  if (insertErr && !insertErr.message.includes("duplicate")) {
    console.error("[stripe-webhook] insert failed", insertErr);
    return json({ error: "DB insert failed" }, 500);
  }

  // Mirror to profiles.is_premium for fast access checks.
  // Only applies when we know the user_id (Stripe metadata.user_id).
  if (userId) {
    if (internalType === "subscription_created" || internalType === "subscription_renewed" || internalType === "payment_succeeded") {
      const periodEndUnix = (data.current_period_end as number) ?? null;
      const premium_until = periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;
      await admin.from("profiles").update({
        is_premium: true,
        premium_source: "stripe",
        ...(premium_until ? { premium_until } : {}),
      }).eq("user_id", userId);
    } else if (internalType === "subscription_cancelled" || internalType === "payment_failed") {
      // Cancellation: respect current_period_end — don't revoke instantly on cancel.
      // For payment_failed we also don't revoke instantly (dunning window handled elsewhere).
      // This is intentionally a no-op until a dunning policy is implemented.
    }
  }

  return json({ received: true, type: internalType });
});
