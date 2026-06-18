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
  | { status: "no_access"; email: string; userId: string }
  | { status: "invalid" }
  | { status: "error"; message: string };

export const checkUserAccess = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("user_access")
    .select("has_access")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data?.has_access;
};

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
  const hasAccess = await checkUserAccess(userId);

  if (!hasAccess) {
    setSession(cleanEmail, userId);
    return { status: "no_access", email: cleanEmail, userId };
  }

  setSession(cleanEmail, userId);
  return { status: "ok", email: cleanEmail, userId };
};

export type SignUpResult =
  | { status: "ok"; needsConfirmation: boolean; userId?: string; email: string }
  | { status: "error"; message: string };

export const signUpWithPassword = async (
  name: string,
  email: string,
  password: string,
): Promise<SignUpResult> => {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { name, display_name: name },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("registered") || msg.includes("exists")) {
      return { status: "error", message: "Este e-mail já está cadastrado. Use a aba Entrar." };
    }
    if (msg.includes("password")) {
      return { status: "error", message: "Senha muito fraca. Use ao menos 6 caracteres." };
    }
    return { status: "error", message: "Não foi possível criar a conta agora. Tente novamente." };
  }

  const needsConfirmation = !data.session;
  if (data.session && data.user) {
    setSession(cleanEmail, data.user.id);
  }
  return {
    status: "ok",
    needsConfirmation,
    userId: data.user?.id,
    email: cleanEmail,
  };
};

export const requestPasswordRecovery = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();
  return supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};
