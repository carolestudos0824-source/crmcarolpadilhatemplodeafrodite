import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";

const SESSION_FLAG = "tarot-streak-updated-session";

/**
 * Runs once per authenticated session:
 *   - Calls `updateStreak()` exactly one time (guarded by sessionStorage + ref)
 *
 * Mounted inside ProtectedRoute so it only runs for authenticated users
 * and shares the same `useProgress` instance pattern as the rest of the app.
 */
const SessionInitializer = () => {
  const { user } = useAuth();
  const { updateStreak, loading } = useProgress();
  const calledRef = useRef(false);

  useEffect(() => {
    if (!user || loading || calledRef.current) return;
    try {
      if (sessionStorage.getItem(SESSION_FLAG) === user.id) return;
      sessionStorage.setItem(SESSION_FLAG, user.id);
    } catch {
      /* sessionStorage unavailable — still gate via ref */
    }
    calledRef.current = true;
    updateStreak();
  }, [user, loading, updateStreak]);

  return null;
};

export default SessionInitializer;
