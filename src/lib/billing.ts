/**
 * Single source of truth for plan pricing.
 *
 * IMPORTANT: These values are used ONLY for internal UI estimates
 * (MRR/ARR projections, conversion math). Real charged amounts must come
 * from Stripe transactions once the integration is live.
 *
 * When Stripe is enabled, server-side checkout MUST recalculate
 * `unit_amount` from this table — never trust client-supplied prices.
 */

export type PlanCode = "monthly" | "annual";

export interface PlanDefinition {
  code: PlanCode;
  label: string;
  /** Price in BRL (display currency). */
  priceBRL: number;
  /** Billing interval in months — used to normalize MRR. */
  intervalMonths: 1 | 12;
  /** Stripe Price ID — null until Stripe integration is live. */
  stripePriceId: string | null;
}

export const PLAN_PRICES: Record<PlanCode, PlanDefinition> = {
  monthly: {
    code: "monthly",
    label: "Mensal",
    priceBRL: 29.9,
    intervalMonths: 1,
    stripePriceId: null,
  },
  annual: {
    code: "annual",
    label: "Anual",
    priceBRL: 197,
    intervalMonths: 12,
    stripePriceId: null,
  },
};

/** Normalized monthly value for a plan (used for MRR estimates). */
export const monthlyValue = (code: PlanCode): number => {
  const p = PLAN_PRICES[code];
  return p.priceBRL / p.intervalMonths;
};

/** Whether real revenue tracking is wired up (Stripe connected). */
export const REAL_REVENUE_ENABLED = false;
