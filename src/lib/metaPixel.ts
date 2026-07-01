/**
 * Meta Pixel helper — tipagem e wrapper seguro.
 *
 * O script base do Pixel é carregado uma única vez em index.html.
 * Aqui apenas expomos `trackPixel` para uso pontual (ex.: InitiateCheckout),
 * sem enviar dados pessoais nem PII.
 */

type FbqParams = Record<string, unknown>;
type FbqFn = (
  command: "track" | "trackCustom" | "init" | "consent",
  eventOrId: string,
  params?: FbqParams,
) => void;

declare global {
  interface Window {
    fbq?: FbqFn & { queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: unknown;
  }
}

export function trackPixel(event: string, params?: FbqParams): void {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", event, params);
  } catch {
    /* fail-silent — Pixel nunca deve quebrar o app */
  }
}

export {};
