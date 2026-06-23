import { supabase } from "@/integrations/supabase/client";

export type SavePromptInput = {
  userId: string;
  title: string;
  content: string;
  sourceModule?: string | null;
};

export type SavePromptResult =
  | { status: "ok"; id: string }
  | { status: "duplicate" }
  | { status: "empty" }
  | { status: "error" };

/**
 * Save a prompt for the authenticated user.
 * - Trims content; empty content returns "empty".
 * - Checks for an existing row with same user_id + content + source_module
 *   (matching NULL explicitly via .is()).
 * - Inserts a new row in public.saved_prompts otherwise.
 * - Relies on RLS as primary security; never bypasses it.
 */
export async function savePromptForUser({
  userId,
  title,
  content,
  sourceModule,
}: SavePromptInput): Promise<SavePromptResult> {
  const normalizedContent = (content ?? "").trim();
  if (!normalizedContent) return { status: "empty" };

  const normalizedTitle = (title ?? "").trim() || normalizedContent.slice(0, 60);
  const normalizedSource = sourceModule?.trim() ? sourceModule.trim() : null;

  try {
    let dupQuery = supabase
      .from("saved_prompts")
      .select("id")
      .eq("user_id", userId)
      .eq("content", normalizedContent)
      .limit(1);

    dupQuery = normalizedSource
      ? dupQuery.eq("source_module", normalizedSource)
      : dupQuery.is("source_module", null);

    const { data: existing, error: dupError } = await dupQuery.maybeSingle();
    if (dupError) return { status: "error" };
    if (existing) return { status: "duplicate" };

    const { data, error } = await supabase
      .from("saved_prompts")
      .insert({
        user_id: userId,
        title: normalizedTitle,
        content: normalizedContent,
        source_module: normalizedSource,
      })
      .select("id")
      .single();

    if (error || !data) return { status: "error" };
    return { status: "ok", id: data.id };
  } catch {
    return { status: "error" };
  }
}
