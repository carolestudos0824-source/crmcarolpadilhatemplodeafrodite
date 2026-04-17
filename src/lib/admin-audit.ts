import { supabase } from "@/integrations/supabase/client";

export type AdminAction =
  | "premium.grant"
  | "premium.revoke"
  | "gift_code.create"
  | "gift_code.deactivate"
  | "arcano.publish"
  | "arcano.unpublish"
  | "module.update"
  | "quiz.update"
  | "role.promote"
  | "role.demote";

export type AdminTargetType = "user" | "gift_code" | "arcano" | "module" | "quiz";

interface LogParams {
  action: AdminAction;
  targetType: AdminTargetType;
  targetId?: string | null;
  targetLabel?: string | null;
  details?: Record<string, unknown>;
}

/**
 * Persist an admin action to the audit log.
 * Silently logs errors — never blocks the underlying admin operation.
 */
export const logAdminAction = async ({
  action,
  targetType,
  targetId,
  targetLabel,
  details = {},
}: LogParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("admin_audit_log").insert({
    admin_id: user.id,
    admin_email: user.email ?? null,
    action,
    target_type: targetType,
    target_id: targetId ?? null,
    target_label: targetLabel ?? null,
    details: details as never,
  });

  if (error) console.error("[admin-audit] insert failed", error);
};

export const ACTION_LABELS: Record<AdminAction, string> = {
  "premium.grant": "Concedeu premium",
  "premium.revoke": "Removeu premium",
  "gift_code.create": "Criou código presente",
  "gift_code.deactivate": "Desativou código presente",
  "arcano.publish": "Publicou arcano",
  "arcano.unpublish": "Despublicou arcano",
  "module.update": "Editou módulo",
  "quiz.update": "Editou quiz",
  "role.promote": "Promoveu admin/moderador",
  "role.demote": "Rebaixou admin/moderador",
};
