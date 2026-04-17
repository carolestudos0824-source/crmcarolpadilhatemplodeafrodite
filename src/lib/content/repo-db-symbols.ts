/**
 * Repositório DB do domínio Símbolos.
 * Lê de `cms_symbol_categories` + `cms_symbols`.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  SymbolCategoryContent,
  SymbolItemContent,
  SymbolsContent,
} from "./symbols-types";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, SymbolItemContent["status"]> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

export async function fetchSymbolsFromDb(): Promise<SymbolsContent | null> {
  const [catsRes, symsRes] = await Promise.all([
    supabase
      .from("cms_symbol_categories")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("cms_symbols")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  if (catsRes.error) throw catsRes.error;
  if (symsRes.error) throw symsRes.error;

  const cats = catsRes.data ?? [];
  const syms = symsRes.data ?? [];
  if (cats.length === 0) return null;

  const symbolsByCat = new Map<string, SymbolItemContent[]>();
  for (const s of syms) {
    const item: SymbolItemContent = {
      id: s.id,
      slug: s.slug,
      categoriaSlug: s.category_slug,
      nome: s.name,
      explicacao: s.explanation,
      leituras: (s.readings ?? []) as string[],
      cartas: (s.cards ?? []) as string[],
      ordem: s.order_index ?? 0,
      status: STATUS_PT[(s.status ?? "published") as DbStatus],
    };
    const list = symbolsByCat.get(s.category_slug) ?? [];
    list.push(item);
    symbolsByCat.set(s.category_slug, list);
  }

  const categorias: SymbolCategoryContent[] = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    nome: c.name,
    icone: c.icon,
    descricao: c.description ?? "",
    ordem: c.order_index ?? 0,
    status: STATUS_PT[(c.status ?? "published") as DbStatus],
    tier: (c.tier ?? "free") as SymbolCategoryContent["tier"],
    simbolos: symbolsByCat.get(c.slug) ?? [],
  }));

  return { categorias, metadata: { source: "db" } };
}
