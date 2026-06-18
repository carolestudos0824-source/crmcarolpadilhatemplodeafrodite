import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authed"; userId: string; email: string | null; hasAccess: boolean };

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const resolve = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (!cancelled) setState({ status: "anonymous" });
        return;
      }
      const { data } = await supabase
        .from("user_access")
        .select("has_access")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;
      setState({
        status: "authed",
        userId,
        email,
        hasAccess: !!data?.has_access,
      });
    };

    // Listener first
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      void resolve(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    // Initial check
    supabase.auth.getSession().then(({ data }) => {
      void resolve(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
};
