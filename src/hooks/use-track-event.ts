import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Beta validation events:
 * - page_view: user visits a key page
 * - onboarding_started / onboarding_completed
 * - lesson_started / lesson_completed
 * - quiz_started / quiz_completed (with score)
 * - premium_page_viewed / premium_gate_hit
 * - feedback_submitted
 * - return_visit (user comes back on a different day)
 */
export function useTrackEvent() {
  const trackEvent = useCallback(async (eventName: string, eventData: Record<string, unknown> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await (supabase.from("user_events") as any).insert({
        user_id: user.id,
        event_name: eventName,
        event_data: eventData,
      });
    } catch {
      // Silent fail — tracking should never break UX
    }
  }, []);

  return { trackEvent };
}
