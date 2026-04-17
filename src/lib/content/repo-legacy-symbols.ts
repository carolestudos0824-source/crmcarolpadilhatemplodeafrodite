/**
 * Repositório legacy do domínio Símbolos.
 * Única importação autorizada de `@/data/symbol-library`.
 */

import { SYMBOL_CATEGORIES } from "@/data/symbol-library";
import type {
  SymbolCategoryContent,
  SymbolItemContent,
  SymbolsContent,
} from "./symbols-types";

export function fetchSymbolsFromLegacy(): SymbolsContent {
  const categorias: SymbolCategoryContent[] = SYMBOL_CATEGORIES.map((c, ci) => ({
    id: `legacy-cat-${c.id}`,
    slug: c.id,
    nome: c.name,
    icone: c.icon,
    descricao: c.description,
    ordem: ci,
    status: "publicado",
    tier: "free",
    simbolos: c.symbols.map<SymbolItemContent>((s, si) => ({
      id: `legacy-sym-${s.id}`,
      slug: s.id,
      categoriaSlug: c.id,
      nome: s.name,
      explicacao: s.explanation,
      leituras: s.readings,
      cartas: s.cards,
      ordem: si,
      status: "publicado",
    })),
  }));

  return { categorias, metadata: { source: "legacy", usedFallback: true } };
}
