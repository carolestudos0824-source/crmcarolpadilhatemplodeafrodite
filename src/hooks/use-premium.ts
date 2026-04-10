import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface PremiumState {
  isPremium: boolean;
  premiumUntil: string | null;
  premiumSource: string | null;
  loading: boolean;
}

export const usePremium = (): PremiumState => {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumState>({
    isPremium: false,
    premiumUntil: null,
    premiumSource: null,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isPremium: false, premiumUntil: null, premiumSource: null, loading: false });
      return;
    }

    const fetchPremium = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_premium, premium_until, premium_source")
        .eq("user_id", user.id)
        .single();

      if (data) {
        const now = new Date();
        const until = data.premium_until ? new Date(data.premium_until) : null;
        // Premium ativo: is_premium=true e não expirou
        // Cancelado com acesso: is_premium=false mas premium_until ainda no futuro
        const isActive = data.is_premium
          ? (!until || until > now)
          : (until != null && until > now);

        setState({
          isPremium: isActive,
          premiumUntil: data.premium_until,
          premiumSource: data.premium_source,
          loading: false,
        });
      } else {
        setState({ isPremium: false, premiumUntil: null, premiumSource: null, loading: false });
      }
    };

    fetchPremium();
  }, [user]);

  return state;
};
