// Stripe Customer Portal session generator.
//
// POST (authenticated). Resolves the caller via Authorization Bearer token,
// looks up profiles.stripe_customer_id, and returns a one-time portal URL.
//
// Required env:
// - STRIPE_SECRET_KEY
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - SUPABASE_ANON_KEY
//
// Returns:
//   200 { url }
//   400 { error: "no_customer" }   when the user has never had a Stripe customer
//   401 { error: "unauthorized" }  when the JWT is missing/invalid
//   503 { error: ... }             when Stripe secret is not configured

import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");

  if (!STRIPE_SECRET) {
    return json({ error: "Stripe não configurado." }, 503);
  }

  // ── Authenticate caller ──
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "unauthorized" }, 401);
  }

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return json({ error: "unauthorized" }, 401);
  }
  const userId = userData.user.id;

  // ── Resolve stripe_customer_id from profiles ──
  const admin = createClient(SUPABASE_URL, SERVICE);
  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (profErr) {
    console.error("[stripe-customer-portal] profile lookup failed", profErr);
    return json({ error: "lookup_failed" }, 500);
  }

  const customerId = (profile as { stripe_customer_id?: string | null } | null)?.stripe_customer_id;
  if (!customerId) {
    return json(
      { error: "no_customer", message: "Nenhuma assinatura Stripe vinculada a esta conta." },
      400,
    );
  }

  // ── Build return URL from request origin (or fallback) ──
  let returnUrl = `${new URL(req.url).origin}/premium`;
  const originHeader = req.headers.get("origin") ?? req.headers.get("referer");
  if (originHeader) {
    try {
      returnUrl = `${new URL(originHeader).origin}/premium`;
    } catch { /* ignore — keep fallback */ }
  }

  // ── Create portal session ──
  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" });
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "stripe_error";
    console.error("[stripe-customer-portal] portal create failed", message);
    return json({ error: "portal_failed", message }, 500);
  }
});
