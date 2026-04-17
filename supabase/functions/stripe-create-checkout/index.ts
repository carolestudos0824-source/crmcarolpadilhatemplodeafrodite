// stripe-create-checkout — creates a Stripe Checkout Session for monthly/annual plans.
//
// Auth: requires logged-in user (validates JWT in code, verify_jwt=false in config).
// Returns: { url } — frontend redirects window.location.href to it.
//
// Required env:
// - STRIPE_SECRET_KEY
// - STRIPE_PRICE_MONTHLY (Stripe Price ID for the monthly plan)
// - STRIPE_PRICE_ANNUAL  (Stripe Price ID for the annual plan)

import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
  const PRICE_MONTHLY = Deno.env.get("STRIPE_PRICE_MONTHLY");
  const PRICE_ANNUAL = Deno.env.get("STRIPE_PRICE_ANNUAL");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

  if (!STRIPE_SECRET) {
    return json({ error: "Stripe pendente: STRIPE_SECRET_KEY não configurado." }, 503);
  }

  // Auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }
  const supabase = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
  if (claimsErr || !claims?.claims) return json({ error: "Unauthorized" }, 401);

  const userId = claims.claims.sub as string;
  const userEmail = (claims.claims.email as string) ?? undefined;

  // Body
  let plan: "monthly" | "annual";
  try {
    const body = await req.json();
    plan = body.plan === "annual" ? "annual" : "monthly";
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const priceId = plan === "annual" ? PRICE_ANNUAL : PRICE_MONTHLY;
  if (!priceId) {
    return json(
      { error: `Stripe pendente: STRIPE_PRICE_${plan.toUpperCase()} não configurado.` },
      503,
    );
  }

  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" });

  // Reuse existing customer when possible
  let customerId: string | undefined;
  if (userEmail) {
    const existing = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (existing.data.length > 0) customerId = existing.data[0].id;
  }

  const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "";
  const successUrl = `${origin}/profile?checkout=success`;
  const cancelUrl = `${origin}/premium?checkout=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    customer_email: customerId ? undefined : userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    // Metadata flows to subscription via subscription_data — webhook reads it.
    subscription_data: {
      metadata: { user_id: userId, plan_code: plan, origin: "lovable_web" },
    },
    metadata: { user_id: userId, plan_code: plan, origin: "lovable_web" },
  });

  return json({ url: session.url, id: session.id });
});
