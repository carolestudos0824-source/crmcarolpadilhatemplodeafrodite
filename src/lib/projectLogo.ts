import { supabase } from "@/integrations/supabase/client";

const BUCKET = "logotipos";

function sanitizeExt(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "png";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "png";
}

export function buildLogoPath(userId: string, projectId: string, fileName: string): string {
  return `${userId}/${projectId}/logo.${sanitizeExt(fileName)}`;
}

export async function uploadProjectLogo(
  userId: string,
  projectId: string,
  file: File,
): Promise<{ path: string }> {
  if (!userId || !projectId) throw new Error("userId e projectId são obrigatórios.");
  if (!file) throw new Error("Arquivo inválido.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Logotipo deve ter no máximo 5MB.");

  const path = buildLogoPath(userId, projectId, file.name);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/png" });
  if (error) throw error;
  return { path };
}

export async function getProjectLogoSignedUrl(
  path: string,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function removeProjectLogo(path: string): Promise<void> {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
