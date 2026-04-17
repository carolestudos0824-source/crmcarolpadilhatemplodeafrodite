/**
 * Camada visual e cinemática da Jornada do Louco.
 *
 * Aqui mora APENAS o que é técnico/visual:
 *  - paleta por fase (CORES_FASE)
 *  - presets de motion / animação
 *  - configuração de transições
 *
 * Conteúdo editorial (títulos, descrições, papel de cada arcano,
 * introdução, encerramento) NÃO mora aqui — vem do CMS via
 * `useJourneyContent()`.
 */

export type JourneyTheme = "gold" | "wine" | "plum" | "moonlight";

export interface JourneyPhaseColors {
  main: string;
  soft: string;
  border: string;
  gradient: string;
}

export const CORES_FASE: Record<JourneyTheme, JourneyPhaseColors> = {
  gold: {
    main: "hsl(36 42% 42%)",
    soft: "hsl(36 42% 44% / 0.10)",
    border: "hsl(36 42% 44% / 0.25)",
    gradient: "linear-gradient(135deg, hsl(36 42% 42%), hsl(36 45% 55%))",
  },
  wine: {
    main: "hsl(340 42% 28%)",
    soft: "hsl(340 42% 28% / 0.08)",
    border: "hsl(340 42% 28% / 0.20)",
    gradient: "linear-gradient(135deg, hsl(340 42% 22%), hsl(340 42% 35%))",
  },
  plum: {
    main: "hsl(280 30% 30%)",
    soft: "hsl(280 30% 30% / 0.08)",
    border: "hsl(280 30% 30% / 0.18)",
    gradient: "linear-gradient(135deg, hsl(280 30% 25%), hsl(280 30% 40%))",
  },
  moonlight: {
    main: "hsl(210 35% 35%)",
    soft: "hsl(210 35% 35% / 0.08)",
    border: "hsl(210 35% 35% / 0.18)",
    gradient: "linear-gradient(135deg, hsl(210 35% 30%), hsl(210 45% 50%))",
  },
};

/** Presets de motion das transições da página. */
export const JOURNEY_MOTION = {
  phaseEnter: {
    animation: "fade-up 0.5s ease-out both",
    staggerMs: 100,
  },
  intro: {
    animation: "fade-up 0.6s ease-out",
  },
  closing: {
    animation: "fade-up 0.6s ease-out",
  },
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/** Aliases legados — o arquivo `src/data/fools-journey.ts` exportava
 * `PHASE_COLORS` com a mesma forma. Mantemos o nome em PT como oficial,
 * mas exportamos o alias para conforto local. */
export const PHASE_COLORS = CORES_FASE;

export function isJourneyTheme(value: string): value is JourneyTheme {
  return value === "gold" || value === "wine" || value === "plum" || value === "moonlight";
}
