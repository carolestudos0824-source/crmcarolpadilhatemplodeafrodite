/**
 * Adapter hook — Phase 2A do refactor de conteúdo.
 *
 * Liga as telas dos arcanos piloto (Louco, Mago, Sacerdotisa) ao novo
 * content-adapter SEM trocar layout, animação ou estrutura legada.
 *
 * Estratégia minimamente invasiva:
 *   1. Tenta resolver o arcano via `useArcanoContent` (DB → fallback).
 *   2. Expõe `sourceUsed`/`usedFallback` para telemetria e admin.
 *   3. A UI continua consumindo o objeto legado (`getArcanoById`) — preserva
 *      animações cinematográficas, voz, deepDive, símbolos e quickReview que
 *      ainda não estão 100% no schema canônico DB.
 *   4. Quando estes campos forem migrados, basta trocar a fonte no caller —
 *      a forma de chamada do hook não muda.
 *
 * Em DEV emite log para validar que a leitura via DB efetivamente acontece.
 */

import { useEffect } from "react";
import { useArcanoContent } from "./use-content";
import type { GetArcanoParams } from "@/lib/content/service";
import type { ArcanoContent, ContentSource } from "@/lib/content/types";

export interface UseResolvedArcanoResult {
  data: ArcanoContent | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
}

export function useResolvedArcano(
  params: GetArcanoParams | null,
): UseResolvedArcanoResult {
  const { data, isLoading, sourceUsed, usedFallback } = useArcanoContent(params);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isLoading || !sourceUsed || !params) return;
    const key =
      params.tipo === "maior"
        ? `maior-${params.numero}`
        : `menor-${params.naipe}-${params.posicao}`;
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] arcano=${key} source=${sourceUsed} fallback=${usedFallback}`,
    );
  }, [params, sourceUsed, usedFallback, isLoading]);

  return { data, isLoading, sourceUsed, usedFallback };
}
