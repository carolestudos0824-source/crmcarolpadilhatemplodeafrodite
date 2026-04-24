// Seed/refresh a preview-only auditor account.
// SECURITY: Only allowed for requests originating from *.lovable.app preview hosts
// (NOT the production custom domain apptaro.lovable.app).
// The created account is given premium + beta tester for visual audit purposes only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AUDITOR_EMAIL = "auditor@preview.lovable.local";
const AUDITOR_PASSWORD = "AuditorPreview2026!";

const isPreviewOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    // Block production custom domain
    if (host === "apptaro.lovable.app") return false;
    // Allow lovable preview/sandbox hosts
    return (
      host.endsWith(".lovable.app") ||
      host.endsWith(".lovableproject.com") ||
      host.endsWith(".lovable.dev") ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch {
    return false;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!isPreviewOrigin(origin)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Auditor access disabled in production." }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE);

    // Try to find existing auditor
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let user = list?.users?.find((u) => u.email === AUDITOR_EMAIL) ?? null;

    if (!user) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: AUDITOR_EMAIL,
        password: AUDITOR_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: "Auditor (Preview)" },
      });
      if (createErr) throw createErr;
      user = created.user;
    } else {
      // Reset password to known value (in case it changed)
      await admin.auth.admin.updateUserById(user.id, {
        password: AUDITOR_PASSWORD,
        email_confirm: true,
      });
    }

    if (!user) throw new Error("Failed to provision auditor user");

    // Grant premium + beta on profile
    const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    await admin
      .from("profiles")
      .update({
        is_premium: true,
        is_beta_tester: true,
        premium_source: "preview-auditor",
        premium_until: farFuture,
        display_name: "Auditor (Preview)",
      })
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({
        ok: true,
        email: AUDITOR_EMAIL,
        password: AUDITOR_PASSWORD,
        user_id: user.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
