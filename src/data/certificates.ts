/**
 * @deprecated [Fase 6.6 — Faxina final]
 * Arquivo legado mantido apenas como SEED / BACKUP / ROLLBACK.
 * NÃO importar no runtime (páginas, componentes, hooks).
 * Runtime principal: @/lib/content (DB) + @/content/** + @/config/** + @/registry/**.
 * Importação fora de src/lib/content/**, src/data/** ou src/components/admin/** é bloqueada por ESLint.
 */
/**
 * Certificate System — Types & Definitions (LEGADO / FALLBACK)
 *
 * ⚠️ Fase 6.4 — este arquivo NÃO é mais lido pelo runtime principal.
 *    A fonte editorial oficial é `cms_certificates`, consumida via
 *    `useCertificatesContent()` e `getCertificatesContent()`. Este
 *    módulo permanece apenas como fallback de emergência (em
 *    `src/lib/content/repo-legacy-certificates.ts`) e como seed/backup.
 */

export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  /** Which progress keys must be completed */
  completionCheck: string;
  /** Decorative accent color (HSL) */
  accentColor: string;
}

export interface EarnedCertificate extends Certificate {
  earnedAt: string;
  studentName: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    id: "cert-arcanos-maiores",
    title: "Mestra dos Arcanos Maiores",
    subtitle: "Os 22 Portais da Alma",
    description: "Concluiu o estudo completo dos 22 Arcanos Maiores, dominando arquétipos, simbolismo e interpretação.",
    icon: "🏛️",
    completionCheck: "arcanos-maiores",
    accentColor: "hsl(36 45% 58%)",
  },
  {
    id: "cert-copas",
    title: "Guardiã de Copas",
    subtitle: "O Naipe da Água",
    description: "Completou o estudo do Naipe de Copas — 14 cartas de emoção, amor e intuição.",
    icon: "💧",
    completionCheck: "naipe-copas",
    accentColor: "hsl(200 60% 45%)",
  },
  {
    id: "cert-paus",
    title: "Guardiã de Paus",
    subtitle: "O Naipe do Fogo",
    description: "Completou o estudo do Naipe de Paus — 14 cartas de ação, criatividade e vontade.",
    icon: "🔥",
    completionCheck: "naipe-paus",
    accentColor: "hsl(15 70% 50%)",
  },
  {
    id: "cert-espadas",
    title: "Guardiã de Espadas",
    subtitle: "O Naipe do Ar",
    description: "Completou o estudo do Naipe de Espadas — 14 cartas de mente, verdade e clareza.",
    icon: "⚔️",
    completionCheck: "naipe-espadas",
    accentColor: "hsl(210 40% 50%)",
  },
  {
    id: "cert-ouros",
    title: "Guardiã de Ouros",
    subtitle: "O Naipe da Terra",
    description: "Completou o estudo do Naipe de Ouros — 14 cartas de matéria, prosperidade e corpo.",
    icon: "💎",
    completionCheck: "naipe-ouros",
    accentColor: "hsl(45 65% 45%)",
  },
  {
    id: "cert-combinacoes",
    title: "Tecelã de Combinações",
    subtitle: "A Arte de Conectar Cartas",
    description: "Dominou as técnicas de combinação entre cartas, criando narrativas complexas e coesas.",
    icon: "🔗",
    completionCheck: "combinacoes",
    accentColor: "hsl(280 35% 45%)",
  },
  {
    id: "cert-tiragens",
    title: "Mestra das Tiragens",
    subtitle: "Os Layouts Sagrados",
    description: "Completou o módulo de Tiragens — layouts, estruturas e métodos de leitura.",
    icon: "✦",
    completionCheck: "tiragens",
    accentColor: "hsl(340 42% 30%)",
  },
  {
    id: "cert-amor",
    title: "Oráculo do Amor",
    subtitle: "Amor e Relacionamentos no Tarô",
    description: "Completou o módulo de Amor e Relacionamentos — interpretação afetiva e emocional.",
    icon: "♡",
    completionCheck: "amor",
    accentColor: "hsl(350 55% 50%)",
  },
  {
    id: "cert-pratica",
    title: "Leitora Formada",
    subtitle: "Prática Guiada Concluída",
    description: "Completou a Prática Guiada — leituras simuladas, estudos de caso e interpretação real.",
    icon: "🎴",
    completionCheck: "pratica",
    accentColor: "hsl(25 60% 50%)",
  },
  {
    id: "cert-curso-completo",
    title: "Mestra do Tarô",
    subtitle: "Formação Completa em Tarô",
    description: "Concluiu toda a formação — Arcanos Maiores, Menores, Combinações, Tiragens, Amor e Prática.",
    icon: "👑",
    completionCheck: "curso-completo",
    accentColor: "hsl(36 50% 50%)",
  },
];

/** Check if a certificate is earned based on completed modules */
export function isCertificateEarned(cert: Certificate, completedModules: string[]): boolean {
  if (cert.completionCheck === "curso-completo") {
    const required = ["arcanos-maiores", "naipe-copas", "naipe-paus", "naipe-espadas", "naipe-ouros", "combinacoes", "tiragens", "amor", "pratica"];
    return required.every(r => completedModules.includes(r));
  }
  return completedModules.includes(cert.completionCheck);
}