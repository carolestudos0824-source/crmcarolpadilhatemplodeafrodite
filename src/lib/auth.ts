import { supabase } from "@/integrations/supabase/client";

const LEGACY_SESSION_KEY = "fabrica_apps_session";

/**
 * Logout helper. The legacy "fabrica_apps_session" key is no longer used to
 * authenticate anything (Supabase Auth is the single source of truth), but we
 * still remove it here for hygiene in case any old browser still has it.
 */
export const clearSession = async () => {
  try {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    /* noop */
  }
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

export type ProgramAccess = {
  hasAccess: boolean;
  isAdmin: boolean;
  canEnter: boolean;
};

export const checkProgramAccess = async (userId: string): Promise<ProgramAccess> => {
  const [{ data: user }, { data: access }, { data: adminFlag }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("user_access")
      .select("has_access")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.rpc("is_admin"),
  ]);

  const email = user.user?.email?.trim().toLowerCase();
  let hasAccess = !!access?.has_access;

  if (!hasAccess && email) {
    const { data: emailAccess } = await supabase
      .from("user_access")
      .select("has_access")
      .eq("email", email)
      .maybeSingle();
    hasAccess = !!emailAccess?.has_access;
  }

  const isAdmin = !!adminFlag;

  return {
    hasAccess,
    isAdmin,
    canEnter: hasAccess || isAdmin,
  };
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
    return { status: "no_access", email: cleanEmail, userId };
  }

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
      return { status: "error", message: "Este e-mail já está cadastrado. Use a opção 'Tenho uma senha cadastrada' ou receba um link de acesso." };
    }
    if (msg.includes("password")) {
      return { status: "error", message: "Senha muito fraca. Use ao menos 6 caracteres." };
    }
    return { status: "error", message: "Não foi possível criar a conta agora. Tente novamente." };
  }

  const needsConfirmation = !data.session;
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
