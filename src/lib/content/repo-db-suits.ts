/**
 * Repositório DB do domínio Naipe Intro (Fase 6.5).
 * Lê de `cms_suits`.
 */

import { supabase } from "@/integrations/supabase/client";
import type { SuitContent, SuitsContent } from "./suits-types";
import type { ContentStatus } from "./types";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, ContentStatus> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

export async function fetchSuitsFromDb(): Promise<SuitsContent | null> {
  const { data, error } = await supabase
    .from("cms_suits")
    .select("*")
    .order("naipe", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const items: SuitContent[] = data.map((s) => ({
    id: s.id,
    naipe: s.naipe,
    nome: s.nome,
    subtitulo: s.subtitulo,
    fraseAbertura: s.frase_abertura,
    essencia: s.essencia,
    atmosfera: s.atmosfera,
    linguagemEditorial: s.linguagem_editorial,
    potencial: s.potencial,
    desafios: s.desafios,
    funcaoNaLeitura: s.funcao_na_leitura,
    palavrasAncora: (s.palavras_ancora ?? []) as string[],
    aplicacoesLeitura: (s.aplicacoes_leitura ?? []) as string[],
    reflexao: s.reflexao,
    elemento: s.elemento,
    simboloElemento: s.simbolo_elemento,
    icone: s.icone,
    status: STATUS_PT[(s.status ?? "published") as DbStatus],
  }));

  return { items, metadata: { source: "db" } };
}
