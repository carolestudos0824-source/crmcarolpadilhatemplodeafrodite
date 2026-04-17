/**
 * Repositório DB do domínio Certificados.
 * Lê de `cms_certificates`.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  CertificateContent,
  CertificateStatus,
  CertificatesContent,
} from "./certificates-types";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, CertificateStatus> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

export async function fetchCertificatesFromDb(): Promise<CertificatesContent | null> {
  const { data, error } = await supabase
    .from("cms_certificates")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const items: CertificateContent[] = data.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    icon: c.icon,
    completionCheck: c.completion_check,
    accentColor: c.accent_color,
    orderIndex: c.order_index ?? 0,
    status: STATUS_PT[(c.status ?? "published") as DbStatus],
  }));

  return { items, metadata: { source: "db" } };
}
