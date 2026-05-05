import { usePremium } from "@/hooks/use-premium";

/**
 * Hook de acesso simplificado (restaurado).
 */
export function useAccess() {
  const { isPremium, subscriptionStatus, loading: premiumLoading } = usePremium();

  return {
    isAdmin: false,
    isPremium,
    isAuditor: false,
    subscriptionStatus,
    hasFullAccess: isPremium,
    bypassLocks: isPremium,
    loading: premiumLoading,
  };
}
