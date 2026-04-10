import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface RedeemResult {
  success: boolean;
  error?: string;
  days?: number;
}

export const useGiftCode = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const redeem = async (code: string): Promise<RedeemResult> => {
    if (!user) return { success: false, error: "Você precisa estar logado para resgatar um código." };
    if (!code.trim()) return { success: false, error: "Informe o código de presente." };

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("redeem_gift_code", {
        _code: code.trim().toUpperCase(),
        _user_id: user.id,
      });

      if (error) return { success: false, error: error.message };
      
      const result = data as unknown as RedeemResult;
      return result;
    } catch {
      return { success: false, error: "Erro inesperado ao resgatar código." };
    } finally {
      setLoading(false);
    }
  };

  return { redeem, loading };
};
