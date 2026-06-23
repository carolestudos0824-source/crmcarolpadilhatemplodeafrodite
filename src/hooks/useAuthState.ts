import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkProgramAccess } from "@/lib/auth";

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | {
      status: "authed";
      userId: string;
      email: string | null;
      hasAccess: boolean;
      isAdmin: boolean;
    };

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const resolve = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (!cancelled) setState({ status: "anonymous" });
        return;
      }
      try {
        const access = await checkProgramAccess(userId);
        if (cancelled) return;
        setState({
          status: "authed",
          userId,
          email,
          hasAccess: access.hasAccess,
          isAdmin: access.isAdmin,
        });
      } catch {
        if (cancelled) return;
        // Fallback: authenticated but without enriched flags — avoids "loading" forever.
        setState({
          status: "authed",
          userId,
          email,
          hasAccess: false,
          isAdmin: false,
        });
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // Defer supabase calls out of the auth callback to avoid deadlocks
      const uid = session?.user?.id ?? null;
      const email = session?.user?.email ?? null;
      setTimeout(() => {
        void resolve(uid, email);
      }, 0);
    });

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
