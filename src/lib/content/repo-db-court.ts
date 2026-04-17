/**
 * Repositório DB do domínio Cartas da Corte pedagógicas (Fase 6.5).
 * Lê de `cms_court_cards`.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  CourtCardContent,
  CourtCardsContent,
} from "./court-types";
import type { ContentStatus } from "./types";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, ContentStatus> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

export async function fetchCourtCardsFromDb(): Promise<CourtCardsContent | null> {
  const { data, error } = await supabase
    .from("cms_court_cards")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const items: CourtCardContent[] = data.map((c) => ({
    id: c.id,
    slug: c.slug,
    nome: c.nome,
    subtitulo: c.subtitulo,
    principio: c.principio,
    simbolo: c.simbolo,
    palavrasChave: (c.palavras_chave ?? []) as string[],
    textoPrincipal: c.texto_principal,
    explicacaoSimbolica: c.explicacao_simbolica,
    leituraPsicologica: c.leitura_psicologica,
    leituraPratica: c.leitura_pratica,
    manifestacao: {
      copas: {
        titulo: c.manifestacao_copas_titulo ?? "",
        texto: c.manifestacao_copas_texto ?? "",
      },
      paus: {
        titulo: c.manifestacao_paus_titulo ?? "",
        texto: c.manifestacao_paus_texto ?? "",
      },
      espadas: {
        titulo: c.manifestacao_espadas_titulo ?? "",
        texto: c.manifestacao_espadas_texto ?? "",
      },
      ouros: {
        titulo: c.manifestacao_ouros_titulo ?? "",
        texto: c.manifestacao_ouros_texto ?? "",
      },
    },
    exemplosInterpretacao: (c.exemplos_interpretacao ?? []) as string[],
    reflexao: c.reflexao,
    ordem: c.order_index ?? 0,
    status: STATUS_PT[(c.status ?? "published") as DbStatus],
  }));

  return { items, metadata: { source: "db" } };
}
