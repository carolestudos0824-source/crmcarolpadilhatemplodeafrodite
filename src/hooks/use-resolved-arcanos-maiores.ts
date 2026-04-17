/**
 * Adapter hook — Fase 2C do refactor de conteúdo.
 *
 * Liga a Jornada dos Tolos (lista agregada dos 22 Arcanos Maiores) ao novo
 * content-adapter SEM trocar layout, ordem ou estados visuais.
 *
 * Estratégia minimamente invasiva (mesmo padrão da Fase 2A):
 *   1. Resolve a lista via `useArcanosList({ tipo: 'maior' })` (DB → fallback).
 *   2. Expõe `sourceUsed` / `usedFallback` para telemetria.
 *   3. A UI continua consumindo `JOURNEY_ARCANOS` (legado) para preservar
 *      `journeyRole`, `narrativeText`, ordenação narrativa por fases e
 *      campos editoriais ainda não migrados ao schema canônico.
 *   4. Quando esses campos forem migrados, basta trocar a fonte no caller —
 *      a forma de chamada do hook não muda.
 *
 * Em DEV emite log para validar que a leitura via DB efetivamente acontece.
 */

import { useEffect } from "react";
import { useArcanosList } from "./use-content";
import type { ArcanoContent, ContentSource } from "@/lib/content/types";

export interface UseResolvedArcanosMaioresResult {
  data: ArcanoContent[] | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
  count: number;
}

export function useResolvedArcanosMaiores(): UseResolvedArcanosMaioresResult {
  const { data, isLoading, sourceUsed, usedFallback } = useArcanosList({
    tipo: "maior",
  });

  // Ordenação canônica por número (0..21) — fonte da verdade para a Jornada.
  const sorted = data
    ? [...data].sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0))
    : null;
  const count = sorted?.length ?? 0;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (isLoading || !sourceUsed) return;
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] arcanos-maiores-list count=${count} source=${sourceUsed} fallback=${usedFallback}`,
    );
  }, [count, sourceUsed, usedFallback, isLoading]);

  return { data: sorted, isLoading, sourceUsed, usedFallback, count };
}
