/**
 * ARCANO VIVO — Configurações visuais e atmosféricas por arcano
 * 
 * Cada arcano tem uma "personalidade de animação" única:
 * - cores da aura
 * - partículas simbólicas
 * - ritmo da respiração
 * - intensidade do despertar
 * - atmosfera geral
 */

export interface ArcanoVivoConfig {
  /** HSL color for the primary glow (without hsl() wrapper) */
  glowColor: string;
  /** Secondary ambient color */
  ambientColor: string;
  /** Breathing animation speed in seconds */
  breatheSpeed: number;
  /** Particle symbols that float around the card */
  particles: string[];
  /** Card awakening delay in ms (how long before the card "wakes") */
  awakenDelay: number;
  /** Shimmer sweep delay after awaken */
  shimmerDelay: number;
  /** Voice emergence style */
  voiceStyle: "dramatic" | "gentle" | "mystical";
  /** Background atmosphere gradient stops */
  atmosphere: string[];
  /** Orbit symbols (larger, slower symbols that circle the card) */
  orbitSymbols?: string[];
  /** Intensity: how "alive" the card feels (affects particle count, glow strength) */
  intensity: "subtle" | "moderate" | "intense";
}

/** Default config for arcanos without a specific one */
const DEFAULT_CONFIG: ArcanoVivoConfig = {
  glowColor: "36 45% 58%",
  ambientColor: "42 70% 80%",
  breatheSpeed: 4,
  particles: ["✦", "·", "✧"],
  awakenDelay: 800,
  shimmerDelay: 2200,
  voiceStyle: "dramatic",
  atmosphere: [
    "hsl(36 45% 58% / 0.06)",
    "transparent",
  ],
  intensity: "moderate",
};

/** Arcano-specific configurations */
const ARCANO_CONFIGS: Record<number, Partial<ArcanoVivoConfig>> = {
  // ─── O LOUCO (0) ───
  // Energia: aérea, expansiva, dourada, vibrante
  // O ar antes do primeiro passo
  0: {
    glowColor: "42 70% 65%",
    ambientColor: "200 60% 75%",
    breatheSpeed: 3.5,
    particles: ["✦", "☀", "·", "✧", "〰", "↗"],
    awakenDelay: 600,
    shimmerDelay: 1800,
    voiceStyle: "dramatic",
    atmosphere: [
      "hsl(42 70% 80% / 0.08)",
      "hsl(200 60% 75% / 0.04)",
      "transparent",
    ],
    orbitSymbols: ["☀", "✦"],
    intensity: "intense",
  },

  // ─── O MAGO (1) ───
  // Energia: focalizada, magnética, vermelha e dourada
  // Poder concentrado, mesa dos 4 elementos
  1: {
    glowColor: "36 50% 55%",
    ambientColor: "340 42% 30%",
    breatheSpeed: 4.5,
    particles: ["∞", "◈", "✦", "⚡", "·"],
    awakenDelay: 900,
    shimmerDelay: 2400,
    voiceStyle: "dramatic",
    atmosphere: [
      "hsl(36 45% 58% / 0.08)",
      "hsl(340 42% 30% / 0.04)",
      "transparent",
    ],
    orbitSymbols: ["∞", "◈"],
    intensity: "intense",
  },

  // ─── A SACERDOTISA (2) ───
  // Energia: lunar, silenciosa, azul-prateada
  // Mistério, véu, profundidade interior
  2: {
    glowColor: "220 40% 65%",
    ambientColor: "260 30% 60%",
    breatheSpeed: 6,
    particles: ["☽", "·", "✧", "⊹", "◦"],
    awakenDelay: 1200,
    shimmerDelay: 3000,
    voiceStyle: "mystical",
    atmosphere: [
      "hsl(220 40% 65% / 0.06)",
      "hsl(260 30% 60% / 0.03)",
      "transparent",
    ],
    orbitSymbols: ["☽", "✧"],
    intensity: "subtle",
  },
};

export function getArcanoVivoConfig(arcanoId: number): ArcanoVivoConfig {
  const specific = ARCANO_CONFIGS[arcanoId] || {};
  return { ...DEFAULT_CONFIG, ...specific };
}
