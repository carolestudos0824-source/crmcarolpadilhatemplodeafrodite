import { supabase } from "@/integrations/supabase/client";

export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  module_key: string | null;
  step_key: string | null;
};

export type ProjectConversationMessages = {
  conversationId: string | null;
  messages: AgentMessage[];
};

export type ProjectScopeGuard = {
  assertCurrentProject?: () => void;
};

const assertProjectId = (projectId: string) => {
  if (!projectId || !projectId.trim()) throw new Error("missing_project_id");
};

const assertStillCurrent = (guard?: ProjectScopeGuard) => {
  guard?.assertCurrentProject?.();
};

/** Carrega as mensagens da conversa associada explicitamente ao projeto atual. */
export async function loadProjectMessages(projectId: string): Promise<ProjectConversationMessages> {
  assertProjectId(projectId);
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes?.user?.id;
  if (!userId) return { conversationId: null, messages: [] };
  const { data: conv } = await supabase
    .from("agent_conversations")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!conv?.id) return { conversationId: null, messages: [] };
  const { data, error } = await supabase
    .from("agent_messages")
    .select("id, role, content, created_at, module_key, step_key")
    .eq("conversation_id", conv.id)
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return { conversationId: conv.id, messages: (data ?? []) as AgentMessage[] };
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
  assertProjectId(args.projectId);
  const { data, error } = await supabase.functions.invoke("agent-chat", {
    body: {
      project_id: args.projectId,
      user_message: args.userMessage,
      module_key: args.moduleKey ?? null,
      step_key: args.stepKey ?? null,
    },
  });
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
export async function saveAsProjectDecision(args: SaveDecisionArgs, guard?: ProjectScopeGuard) {
  assertProjectId(args.projectId);
  assertStillCurrent(guard);
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes?.user?.id;
  if (!userId) throw new Error("not_authenticated");

  assertStillCurrent(guard);
  const { data: project, error: projectErr } = await supabase
    .from("user_app_projects")
    .select("id")
    .eq("id", args.projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (projectErr) throw projectErr;
  if (!project?.id) throw new Error("project_not_found");

  assertStillCurrent(guard);
  const { data: insertedOutput, error: outErr } = await supabase
    .from("project_outputs")
    .insert({
      project_id: args.projectId,
      user_id: userId,
      module_key: args.moduleKey,
      step_key: args.stepKey ?? null,
      title: args.title ?? null,
      content: args.content,
      approved: true,
    })
    .select("id")
    .single();
  if (outErr) throw outErr;
  try {
    assertStillCurrent(guard);
  } catch (e) {
    if (insertedOutput?.id) {
      await supabase
        .from("project_outputs")
        .delete()
        .eq("id", insertedOutput.id)
        .eq("project_id", args.projectId)
        .eq("user_id", userId);
    }
    throw e;
  }

  // Upsert contexto: append do título no summary + merge no context_json
  assertStillCurrent(guard);
  const { data: existing } = await supabase
    .from("project_contexts")
    .select("id, summary, context_json")
    .eq("project_id", args.projectId)
    .eq("user_id", userId)
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

  assertStillCurrent(guard);
  if (existing?.id) {
    const { error: updErr } = await supabase
      .from("project_contexts")
      .update({ summary: newSummary, context_json: newJson })
      .eq("id", existing.id)
      .eq("project_id", args.projectId)
      .eq("user_id", userId);
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
