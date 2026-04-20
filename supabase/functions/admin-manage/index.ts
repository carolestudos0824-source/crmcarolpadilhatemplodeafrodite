// Admin management edge function — search users, manage admin roles, premium and progress
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

const isAllowedResetRedirect = (value: unknown) => {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname === "/reset-password";
  } catch {
    return false;
  }
};

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

    // STRICT ADMIN GATE: every action exposed by this function is admin-only.
    // Moderators and regular users are rejected here, regardless of UI.
    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const roleSet = new Set((callerRoles ?? []).map((r) => r.role));
    const isAdmin = roleSet.has("admin");

    if (!isAdmin) {
      // Log the unauthorized attempt for audit trail (best-effort; never blocks).
      const attemptedAction = await req.clone().json().then((b) => b?.action ?? "unknown").catch(() => "unknown");
      await admin.from("admin_audit_log").insert({
        admin_id: user.id,
        admin_email: user.email ?? null,
        action: "unauthorized_attempt",
        target_type: "edge_function",
        target_id: "admin-manage",
        target_label: `action=${attemptedAction}`,
        details: {
          caller_roles: Array.from(roleSet),
          reason: roleSet.has("moderator")
            ? "moderator_called_admin_only_function"
            : "non_admin_called_admin_only_function",
        },
      }).then(() => {}, () => {});
      return json({ error: "Forbidden: admin role required" }, 403);
    }

    const body = await req.json();
    const { action, email, target_user_id, days, source, gift_code_id } = body;
    const requestedRole: "admin" | "moderator" = body.role === "moderator" ? "moderator" : "admin";

    if (action === "list") {
      // Returns admins AND moderators with role distinction
      const { data: roles } = await admin
        .from("user_roles")
        .select("id, user_id, role")
        .in("role", ["admin", "moderator"]);

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
            role: r.role,
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
        .insert({ user_id: target_user_id, role: requestedRole });
      if (error && !error.message.includes("duplicate")) return json({ error: error.message }, 500);
      return json({ success: true, role: requestedRole });
    }

    if (action === "demote") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      if (target_user_id === user.id && requestedRole === "admin") {
        return json({ error: "Você não pode remover a si mesmo como admin" }, 400);
      }
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", target_user_id)
        .eq("role", requestedRole);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, role: requestedRole });
    }

    // List all users with email enrichment (paginated)
    if (action === "list_users") {
      const page = body.page ?? 1;
      const perPage = body.perPage ?? 200;
      const { data: authList, error: authErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (authErr) return json({ error: authErr.message }, 500);
      const users = (authList?.users ?? []).map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
      }));
      return json({ users });
    }

    // Get a single user's full details for admin profile view
    if (action === "user_detail") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);

      // Each lookup is isolated so a single failure (missing row, table issue,
      // schema drift) never blocks the whole modal. We collect partial data
      // and report which fragments failed in `warnings`.
      const warnings: { source: string; message: string }[] = [];
      const safe = async <T,>(source: string, fn: () => Promise<{ data: T | null; error: { message: string } | null }>): Promise<T | null> => {
        try {
          const { data, error } = await fn();
          if (error) {
            warnings.push({ source, message: error.message });
            return null;
          }
          return data;
        } catch (err) {
          warnings.push({ source, message: (err as Error).message });
          return null;
        }
      };

      const [authUser, profile, progress, rolesRows, redemptions] = await Promise.all([
        safe("auth", async () => {
          const res = await admin.auth.admin.getUserById(target_user_id);
          return { data: res.data?.user ?? null, error: res.error ? { message: res.error.message } : null };
        }),
        safe("profile", () => admin.from("profiles").select("*").eq("user_id", target_user_id).maybeSingle()),
        safe("progress", () => admin.from("user_progress").select("*").eq("user_id", target_user_id).maybeSingle()),
        safe("roles", () => admin.from("user_roles").select("role").eq("user_id", target_user_id)),
        safe("redemptions", () => admin.from("gift_redemptions").select("redeemed_at, gift_code_id").eq("user_id", target_user_id)),
      ]);

      return json({
        auth: authUser ? { email: authUser.email ?? null, created_at: authUser.created_at ?? null, last_sign_in_at: authUser.last_sign_in_at ?? null } : null,
        profile: profile ?? null,
        progress: progress ?? null,
        roles: Array.isArray(rolesRows) ? rolesRows.map((r: { role: string }) => r.role) : [],
        redemptions: redemptions ?? [],
        warnings,
      });
    }

    if (action === "grant_premium") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      const d = Number(days) > 0 ? Number(days) : 30;
      const src = source === "gift" ? "gift" : "admin";
      const { data: cur } = await admin.from("profiles").select("premium_until").eq("user_id", target_user_id).maybeSingle();
      const base = cur?.premium_until && new Date(cur.premium_until) > new Date() ? new Date(cur.premium_until) : new Date();
      base.setDate(base.getDate() + d);
      const { error } = await admin
        .from("profiles")
        .update({ is_premium: true, premium_source: src, premium_until: base.toISOString() })
        .eq("user_id", target_user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, premium_until: base.toISOString() });
    }

    if (action === "revoke_premium") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      const { error } = await admin
        .from("profiles")
        .update({ is_premium: false, premium_source: null, premium_until: null })
        .eq("user_id", target_user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "reset_progress") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      const { error } = await admin
        .from("user_progress")
        .update({
          completed_lessons: [],
          completed_modules: [],
          completed_quizzes: [],
          completed_exercises: [],
          xp: 0,
          level: 1,
          streak: 0,
        })
        .eq("user_id", target_user_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "generate_password_reset_link") {
      if (!target_user_id) return json({ error: "Usuário obrigatório" }, 400);
      const redirectTo = body.redirect_to;
      if (!isAllowedResetRedirect(redirectTo)) {
        return json({ error: "URL de redefinição inválida" }, 400);
      }

      const { data: targetUserData, error: targetUserError } = await admin.auth.admin.getUserById(target_user_id);
      const targetEmail = targetUserData?.user?.email;

      if (targetUserError || !targetEmail) {
        return json({ error: "Usuário não encontrado para redefinição" }, 404);
      }

      const { data: generated, error } = await admin.auth.admin.generateLink({
        type: "recovery",
        email: targetEmail,
        options: { redirectTo },
      });

      if (error) return json({ error: error.message }, 500);

      const actionLink = generated?.properties?.action_link ?? generated?.action_link ?? null;
      if (!actionLink) return json({ error: "Não foi possível gerar o link de redefinição" }, 500);

      return json({ success: true, action_link: actionLink, email: targetEmail });
    }

    return json({ error: "Ação inválida" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
