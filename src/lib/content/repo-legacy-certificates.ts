/**
 * Fallback legado do domínio Certificados.
 * Lê de `src/data/certificates.ts` apenas em emergência (flag = 'fallback'
 * ou erro/vazio do DB em modo 'auto').
 */

// eslint-disable-next-line no-restricted-imports
import { CERTIFICATES } from "@/data/certificates";
import type { CertificatesContent } from "./certificates-types";

export function fetchCertificatesFromLegacy(): CertificatesContent | null {
  if (!CERTIFICATES || CERTIFICATES.length === 0) return null;
  return {
    items: CERTIFICATES.map((c, idx) => ({
      id: c.id,
      slug: c.id,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      icon: c.icon,
      completionCheck: c.completionCheck,
      accentColor: c.accentColor,
      orderIndex: idx,
      status: "publicado" as const,
    })),
    metadata: { source: "legacy" },
  };
}
