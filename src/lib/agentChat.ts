import { supabase } from "@/integrations/supabase/client";

export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  module_key: string | null;
  step_key: string | null;
};

/** Carrega (ou cria implicitamente ao primeiro envio) as mensagens de uma conversa
 *  associada ao projeto. Retorna [] se ainda não existe nenhuma. */
export async function loadProjectMessages(projectId: string): Promise<AgentMessage[]> {
  const { data: conv } = await supabase
    .from("agent_conversations")
    .select("id")
    .eq("project_id", projectId)
    .maybeSingle();
  if (!conv?.id) return [];
  const { data, error } = await supabase
    .from("agent_messages")
    .select("id, role, content, created_at, module_key, step_key")
    .eq("conversation_id", conv.id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AgentMessage[];
}

export type SendArgs = {
  projectId: string;
  userMessage: string;
  moduleKey?: string | null;
  stepKey?: string | null;
};

export type SendResult = {
  conversationId: string;
  assistant: { id: string; content: string; created_at: string };
};

export async function sendAgentMessage(args: SendArgs): Promise<SendResult> {
  const { data, error } = await supabase.functions.invoke("agent-chat", { body: args });
  if (error) throw error;
  if (data?.error) throw new Error(data.detail || data.error);
  return data as SendResult;
}

export type SaveDecisionArgs = {
  projectId: string;
  moduleKey: string;
  stepKey?: string | null;
  title?: string | null;
  content: string;
};

/** Salva como "decisão do projeto": grava em project_outputs e atualiza project_contexts. */
export async function saveAsProjectDecision(args: SaveDecisionArgs) {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes?.user?.id;
  if (!userId) throw new Error("not_authenticated");

  const { error: outErr } = await supabase.from("project_outputs").insert({
    project_id: args.projectId,
    user_id: userId,
    module_key: args.moduleKey,
    step_key: args.stepKey ?? null,
    title: args.title ?? null,
    content: args.content,
    approved: true,
  });
  if (outErr) throw outErr;

  // Upsert contexto: append do título no summary + merge no context_json
  const { data: existing } = await supabase
    .from("project_contexts")
    .select("id, summary, context_json")
    .eq("project_id", args.projectId)
    .maybeSingle();

  const titleLine = args.title ? `• ${args.title}` : `• Decisão em ${args.moduleKey}`;
  const newSummary = [(existing?.summary ?? "").trim(), titleLine]
    .filter(Boolean)
    .join("\n")
    .slice(-2000);
  const prevJson = (existing?.context_json as Record<string, unknown>) ?? {};
  const moduleBucket = (prevJson[args.moduleKey] as Record<string, unknown>) ?? {};
  const stepK = args.stepKey ?? "_default";
  const newJson = {
    ...prevJson,
    [args.moduleKey]: { ...moduleBucket, [stepK]: args.content.slice(0, 1200) },
  };

  if (existing?.id) {
    const { error: updErr } = await supabase
      .from("project_contexts")
      .update({ summary: newSummary, context_json: newJson })
      .eq("id", existing.id);
    if (updErr) throw updErr;
  } else {
    const { error: insErr } = await supabase.from("project_contexts").insert({
      project_id: args.projectId,
      user_id: userId,
      summary: newSummary,
      context_json: newJson,
    });
    if (insErr) throw insErr;
  }
}
