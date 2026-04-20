import { supabase } from "@/integrations/supabase/client";

export type AdminAction =
  // Premium
  | "premium.grant"
  | "premium.revoke"
  | "auth.password_reset_email"
  // Gift codes
  | "gift_code.create"
  | "gift_code.deactivate"
  | "gift_code.activate"
  // Roles
  | "role.promote"
  | "role.demote"
  // Modules
  | "module.create"
  | "module.update"
  | "module.delete"
  | "module.publish"
  | "module.unpublish"
  | "module.tier_change"
  | "module.reorder"
  // Module lessons
  | "module_lesson.create"
  | "module_lesson.update"
  | "module_lesson.delete"
  // Arcanos
  | "arcano.create"
  | "arcano.update"
  | "arcano.delete"
  | "arcano.publish"
  | "arcano.unpublish"
  | "arcano.tier_change"
  | "arcano.validate"
  | "arcano.bulk_demote_critical"
  // Quizzes
  | "quiz.create"
  | "quiz.update"
  | "quiz.delete"
  | "quiz.publish"
  | "quiz.unpublish"
  // Quiz questions
  | "quiz_question.create"
  | "quiz_question.update"
  | "quiz_question.delete"
  | "quiz_question.reorder"
  // Feedback / support
  | "feedback.note"
  | "feedback.reopen"
  | "feedback.in_progress"
  | "feedback.resolve";

export type AdminTargetType =
  | "user"
  | "gift_code"
  | "module"
  | "module_lesson"
  | "arcano"
  | "quiz"
  | "quiz_question"
  | "feedback";

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
  "auth.password_reset_email": "Enviou e-mail de redefinição de senha",
  "gift_code.create": "Criou código presente",
  "gift_code.deactivate": "Desativou código presente",
  "gift_code.activate": "Reativou código presente",
  "role.promote": "Promoveu papel",
  "role.demote": "Rebaixou papel",
  "module.create": "Criou módulo",
  "module.update": "Editou módulo",
  "module.delete": "Removeu módulo",
  "module.publish": "Publicou módulo",
  "module.unpublish": "Despublicou módulo",
  "module.tier_change": "Alterou tier do módulo",
  "module.reorder": "Reordenou módulos",
  "module_lesson.create": "Criou lição",
  "module_lesson.update": "Editou lição",
  "module_lesson.delete": "Removeu lição",
  "arcano.create": "Criou arcano",
  "arcano.update": "Editou arcano",
  "arcano.delete": "Removeu arcano",
  "arcano.publish": "Publicou arcano",
  "arcano.unpublish": "Despublicou arcano",
  "arcano.tier_change": "Alterou tier do arcano",
  "arcano.validate": "Alterou validação do arcano",
  "arcano.bulk_demote_critical": "Rebaixou arcanos críticos em massa",
  "quiz.create": "Criou quiz",
  "quiz.update": "Editou quiz",
  "quiz.delete": "Removeu quiz",
  "quiz.publish": "Publicou quiz",
  "quiz.unpublish": "Despublicou quiz",
  "quiz_question.create": "Criou pergunta",
  "quiz_question.update": "Editou pergunta",
  "quiz_question.delete": "Removeu pergunta",
  "quiz_question.reorder": "Reordenou perguntas",
  "feedback.note": "Anotou ticket",
  "feedback.reopen": "Reabriu ticket",
  "feedback.in_progress": "Marcou ticket em andamento",
  "feedback.resolve": "Resolveu ticket",
};
