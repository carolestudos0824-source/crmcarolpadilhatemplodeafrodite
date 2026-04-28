/**
 * Platform detection + payment policy gating.
 *
 * Used to prepare the app for Google Play Store distribution where, per Play
 * billing policy, digital content purchases inside the Android app must NOT
 * route to external payment processors like Stripe Checkout.
 *
 * The web build keeps Stripe checkout enabled. A future Android wrapper
 * (TWA / Capacitor) should set `window.__IS_ANDROID_APP__ = true` (or
 * `localStorage["platform.isAndroidApp"] = "1"`) so we can hide Stripe CTAs
 * and route to Google Play Billing / RevenueCat instead.
 */

declare global {
  interface Window {
    __IS_ANDROID_APP__?: boolean;
  }
}

export const isAndroidApp = (): boolean => {
  if (typeof window === "undefined") return false;
  if (window.__IS_ANDROID_APP__ === true) return true;
  try {
    if (window.localStorage?.getItem("platform.isAndroidApp") === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
};

/** Whether external (Stripe) checkout for digital content is allowed in this build. */
export const isWebCheckoutAllowed = (): boolean => !isAndroidApp();

export const platformLabel = (): "android" | "web" => (isAndroidApp() ? "android" : "web");
