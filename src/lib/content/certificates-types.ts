/**
 * Tipos públicos do domínio Certificados.
 * Schema editorial governável (DB-first).
 *
 * A lógica técnica (avaliação, emissão, vínculo com progresso) permanece
 * na UI / hooks. Aqui só vivem dados editoriais.
 */

export type CertificateStatus = "vazio" | "parcial" | "rascunho" | "publicado";

export interface CertificateContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  /** Critério/requisito de emissão — string opaca consumida pela camada local. */
  completionCheck: string;
  /** Cor decorativa (HSL livre, controlada via CMS). */
  accentColor: string | null;
  orderIndex: number;
  status: CertificateStatus;
}

export interface CertificatesContent {
  items: CertificateContent[];
  metadata: { source: "db" | "legacy" };
}
