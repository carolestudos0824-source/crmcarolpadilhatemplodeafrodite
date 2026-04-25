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

const log = (stage: string, data: Record<string, unknown> = {}) => {
  console.log(`[stripe-customer-portal] ${stage}`, JSON.stringify(data));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");

  if (!STRIPE_SECRET) {
    log("missing_stripe_secret");
    return json({ error: "Stripe não configurado." }, 503);
  }

  // ── Authenticate caller ──
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    log("missing_auth_header");
    return json({ error: "unauthorized", message: "Você precisa estar autenticado." }, 401);
  }

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    log("auth_failed", { error: userErr?.message });
    return json({ error: "unauthorized", message: "Sessão inválida. Faça login novamente." }, 401);
  }
  const userId = userData.user.id;
  const userEmail = userData.user.email ?? null;
  log("user_authenticated", { userId, userEmail });

  // ── Resolve stripe_customer_id from profiles ──
  const admin = createClient(SUPABASE_URL, SERVICE);
  const { data: profile, error: profErr } = await admin
    .from("profiles")
    .select("stripe_customer_id, is_premium, premium_source")
    .eq("user_id", userId)
    .maybeSingle();

  if (profErr) {
    log("profile_lookup_failed", { error: profErr.message });
    return json({ error: "lookup_failed", message: "Não conseguimos consultar seu perfil." }, 500);
  }

  if (!profile) {
    log("profile_not_found", { userId });
    return json(
      { error: "profile_not_found", message: "Perfil não encontrado. Entre em contato com o suporte." },
      400,
    );
  }

  log("profile_found", {
    userId,
    is_premium: profile.is_premium,
    premium_source: profile.premium_source,
    has_stripe_customer_id: !!profile.stripe_customer_id,
  });

  const customerId = (profile as { stripe_customer_id?: string | null }).stripe_customer_id;
  if (!customerId) {
    log("no_stripe_customer_id", { userId, premium_source: profile.premium_source });
    return json(
      {
        error: "no_customer",
        message: "Não encontramos sua assinatura vinculada. Entre em contato com o suporte.",
      },
      400,
    );
  }

  // ── Build return URL from request origin (or fallback) ──
  let returnUrl = `${new URL(req.url).origin}/perfil`;
  const originHeader = req.headers.get("origin") ?? req.headers.get("referer");
  if (originHeader) {
    try {
      returnUrl = `${new URL(originHeader).origin}/perfil`;
    } catch { /* ignore — keep fallback */ }
  }
  log("return_url_resolved", { returnUrl });

  // ── Create portal session ──
  const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" });
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    log("portal_session_created", { sessionId: session.id, customerId });
    return json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "stripe_error";
    log("portal_create_failed", { customerId, message });
    return json({ error: "portal_failed", message }, 500);
  }
});
