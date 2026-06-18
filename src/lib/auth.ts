import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "fabrica_apps_session";

export interface Session {
  email: string;
  userId: string;
  createdAt: string;
}

export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

export const setSession = (email: string, userId = "") => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email, userId, createdAt: new Date().toISOString() }),
  );
};

export const clearSession = async () => {
  localStorage.removeItem(SESSION_KEY);
  try {
    await supabase.auth.signOut();
  } catch {
    /* noop */
  }
};

export type LoginResult =
  | { status: "ok"; email: string; userId: string }
  | { status: "no_access" }
  | { status: "invalid" }
  | { status: "error"; message: string };

export const loginWithPassword = async (
  email: string,
  password: string,
): Promise<LoginResult> => {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error || !data.user) return { status: "invalid" };

  const userId = data.user.id;

  const { data: access } = await supabase
    .from("user_access")
    .select("has_access")
    .eq("user_id", userId)
    .maybeSingle();

  if (!access || !access.has_access) {
    await supabase.auth.signOut();
    return { status: "no_access" };
  }

  setSession(cleanEmail, userId);
  return { status: "ok", email: cleanEmail, userId };
};

export const requestPasswordRecovery = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();
  return supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/login`,
  });
};
