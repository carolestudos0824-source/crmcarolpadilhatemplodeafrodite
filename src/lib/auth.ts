const SESSION_KEY = "fabrica_apps_session";

export interface Session { email: string; createdAt: string; }

export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch { return null; }
};

export const setSession = (email: string) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, createdAt: new Date().toISOString() }));
};

export const clearSession = () => localStorage.removeItem(SESSION_KEY);
