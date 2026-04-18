/**
 * Resolução visual local — NUNCA migra para o banco.
 *
 * Imagens de cartas (Maiores e Menores) vivem como assets do bundle.
 * Slug → cardImage path. Usado por todos os mappers para preencher
 * `ArcanoContent.visual`.
 *
 * Para Menores: usa `DECK_MENORES_REGISTRY` (já oficial).
 * Para Maiores: tabela mínima derivada de EDITORIAL_REGISTRY.
 */

import { DECK_BY_ID, DECK_BY_SLUG, type DeckEntry } from "@/content/arcanos-menores/deck-registry";
import { EDITORIAL_REGISTRY } from "@/content/arcanos-maiores";
import type { ContentNaipe } from "./types";

export interface VisualResolution {
  imageKey: string | null;
  imageUrl: string | null;
  resolvedAssetUrl: string | null;
}

const EMPTY: VisualResolution = {
  imageKey: null,
  imageUrl: null,
  resolvedAssetUrl: null,
};

/** Resolve visual de Arcano Maior por número (0–21). */
export function resolveMaiorVisual(numero: number | null | undefined): VisualResolution {
  if (numero == null) return EMPTY;
  const arcano = EDITORIAL_REGISTRY[numero];
  if (!arcano) return EMPTY;
  return {
    imageKey: arcano.slug,
    imageUrl: arcano.cardImage,
    resolvedAssetUrl: arcano.cardImage,
  };
}

/** Resolve visual de Arcano Menor por id canônico (ex.: "copas-1"). */
export function resolveMenorVisualById(id: string | null | undefined): VisualResolution {
  if (!id) return EMPTY;
  const entry: DeckEntry | undefined = DECK_BY_ID.get(id);
  if (!entry) return EMPTY;
  return {
    imageKey: entry.slug,
    imageUrl: entry.cardImage,
    resolvedAssetUrl: entry.cardImage,
  };
}

/** Resolve visual de Arcano Menor por slug URL-safe (ex.: "as-de-copas"). */
export function resolveMenorVisualBySlug(slug: string | null | undefined): VisualResolution {
  if (!slug) return EMPTY;
  const entry = DECK_BY_SLUG.get(slug);
  if (!entry) return EMPTY;
  return {
    imageKey: entry.slug,
    imageUrl: entry.cardImage,
    resolvedAssetUrl: entry.cardImage,
  };
}

/** Resolve slug canônico de Menor a partir de naipe + posição. */
export function resolveMenorSlug(
  naipe: ContentNaipe,
  posicao: number | string,
): string | null {
  const id = `${naipe}-${posicao}`;
  return DECK_BY_ID.get(id)?.slug ?? null;
}
