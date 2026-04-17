// Admin management edge function — search users by email and manage admin roles
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

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE);

    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdminData } = await admin
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!isAdminData) return json({ error: "Forbidden" }, 403);

    const { action, email, target_user_id } = await req.json();

    if (action === "list") {
      const { data: roles } = await admin
        .from("user_roles")
        .select("id, user_id, role")
        .eq("role", "admin");

      const ids = (roles ?? []).map((r) => r.user_id);
      const { data: profiles } = await admin
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

      const enriched = await Promise.all(
        (roles ?? []).map(async (r) => {
          const { data: u } = await admin.auth.admin.getUserById(r.user_id);
          const profile = profiles?.find((p) => p.user_id === r.user_id);
          return {
            id: r.id,
            user_id: r.user_id,
            email: u?.user?.email ?? null,
            display_name: profile?.display_name ?? null,
            created_at: u?.user?.created_at ?? null,
            is_principal: r.user_id === user.id,
          };
        })
      );
      return json({ admins: enriched, current_user_id: user.id });
    }

    if (action === "search") {
      if (!email || typeof email !== "string") return json({ error: "Email obrigatório" }, 400);
      // Search auth users by email substring
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 500);
      const q = email.toLowerCase().trim();
      const matches = (data?.users ?? [])
        .filter((u) => (u.email ?? "").toLowerCase().includes(q))
        .slice(0, 10)
        .map((u) => ({ id: u.id, email: u.email, created_at: u.created_at }));
      return json({ users: matches });
    }

    if (action === "promote") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      const { error } = await admin
        .from("user_roles")
        .insert({ user_id: target_user_id, role: "admin" });
      if (error && !error.message.includes("duplicate")) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "demote") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      if (target_user_id === user.id) return json({ error: "Você não pode remover a si mesmo" }, 400);
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", target_user_id)
        .eq("role", "admin");
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    return json({ error: "Ação inválida" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
