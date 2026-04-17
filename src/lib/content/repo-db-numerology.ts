/**
 * Repositório DB do domínio Numerologia (Fase 6.5).
 * Lê de `cms_numerologia`.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  NumerologyContent,
  NumerologyItemContent,
} from "./numerology-types";
import type { ContentStatus } from "./types";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, ContentStatus> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

export async function fetchNumerologyFromDb(): Promise<NumerologyContent | null> {
  const { data, error } = await supabase
    .from("cms_numerologia")
    .select("*")
    .order("numero", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const items: NumerologyItemContent[] = data.map((n) => ({
    id: n.id,
    numero: n.numero,
    nome: n.nome,
    subtitulo: n.subtitulo ?? "",
    principio: n.principio ?? "",
    simbolo: n.simbolo ?? "",
    descricao: n.descricao,
    aprofundamento: n.aprofundamento ?? "",
    manifestacao: {
      copas: n.manifestacao_copas ?? "",
      paus: n.manifestacao_paus ?? "",
      espadas: n.manifestacao_espadas ?? "",
      ouros: n.manifestacao_ouros ?? "",
    },
    palavrasChave: (n.palavras_chave ?? []) as string[],
    reflexao: n.reflexao ?? "",
    status: STATUS_PT[(n.status ?? "published") as DbStatus],
  }));

  return { items, metadata: { source: "db" } };
}
