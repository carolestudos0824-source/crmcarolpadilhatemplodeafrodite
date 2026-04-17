/**
 * Tipos canônicos do domínio Símbolos (Fase 6.1).
 */

import type { ContentSource, ContentStatus, ContentTier } from "./types";

export interface SymbolItemContent {
  id: string;
  slug: string;
  categoriaSlug: string;
  nome: string;
  explicacao: string;
  leituras: string[];
  cartas: string[];
  ordem: number;
  status: ContentStatus;
}

export interface SymbolCategoryContent {
  id: string;
  slug: string;
  nome: string;
  icone: string;
  descricao: string;
  ordem: number;
  status: ContentStatus;
  tier: ContentTier;
  simbolos: SymbolItemContent[];
}

export interface SymbolsContent {
  categorias: SymbolCategoryContent[];
  metadata: {
    source: ContentSource;
    usedFallback?: boolean;
  };
}
