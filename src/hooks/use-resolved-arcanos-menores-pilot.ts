/**
 * Adapter hook — Fase 3 (piloto controlado dos Arcanos Menores).
 *
 * Liga 8 itens-piloto (4 numeradas + 4 cortes) ao content-adapter SEM
 * alterar layout, deck-registry visual, premium ou continuidade.
 *
 * Estratégia minimamente invasiva (mesmo padrão de 2A/2B/2C):
 *   1. Resolve cada item via `useArcanoContent({ tipo: 'menor', naipe, posicao })`.
 *   2. Expõe `sourceUsed` / `usedFallback` para telemetria.
 *   3. Em DEV, emite log para validar que a leitura via DB efetivamente acontece.
 *   4. A UI continua consumindo o objeto legado (NaipePage, CartasCortePage)
 *      para preservar acordeões, manifestações por naipe, símbolos e
 *      progressão visual que ainda não foram migrados ao schema canônico.
 *
 * Escopo autorizado do piloto:
 *   - Numeradas: copas-1 (Ás), paus-5 (Cinco), espadas-6 (Seis), ouros-10 (Dez)
 *   - Cortes:    ouros-pajem, copas-cavaleiro, espadas-rainha, paus-rei
 */

import { useEffect } from "react";
import { useArcanoContent } from "./use-content";
import type { GetArcanoParams } from "@/lib/content/service";
import type { ArcanoContent, ContentNaipe, ContentSource } from "@/lib/content/types";

export type CortePosicao = "pajem" | "cavaleiro" | "rainha" | "rei";

export interface PilotMenorTarget {
  naipe: ContentNaipe;
  posicao: number | CortePosicao;
  /** Identificador legível para logs/telemetria (ex.: "copas-1", "ouros-pajem"). */
  key: string;
}

/**
 * Fase 3B — escopo expandido para os 56 Menores (40 numeradas + 16 cortes).
 * Gerado proceduralmente: 4 naipes × (1..10 + pajem, cavaleiro, rainha, rei).
 */
const NAIPES_ALL: ContentNaipe[] = ["copas", "paus", "espadas", "ouros"];
const CORTES_ALL: CortePosicao[] = ["pajem", "cavaleiro", "rainha", "rei"];

export const PILOT_MENORES: readonly PilotMenorTarget[] = NAIPES_ALL.flatMap(
  (naipe) => [
    ...Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
      naipe,
      posicao: n as number,
      key: `${naipe}-${n}`,
    })),
    ...CORTES_ALL.map((c) => ({ naipe, posicao: c, key: `${naipe}-${c}` })),
  ],
);

export function isPilotTarget(_naipe: ContentNaipe, _posicao: number | string): boolean {
  // Fase 3B: todos os 56 Menores estão no escopo do adaptador.
  return true;
}

export interface UseResolvedArcanoMenorPilotResult {
  data: ArcanoContent | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
  /** Indica se este alvo faz parte do piloto da Fase 3 (caso contrário, hook fica inerte). */
  isPilot: boolean;
}

/**
 * Resolve um Arcano Menor via adaptador APENAS se for um dos 8 itens-piloto.
 * Para itens fora do piloto, o hook não dispara query (mantém zero impacto).
 */
export function useResolvedArcanoMenorPilot(
  naipe: ContentNaipe | null | undefined,
  posicao: number | string | null | undefined,
): UseResolvedArcanoMenorPilotResult {
  const isPilot =
    naipe != null && posicao != null && isPilotTarget(naipe, posicao);

  const params: GetArcanoParams | null =
    isPilot && naipe != null && posicao != null
      ? { tipo: "menor", naipe, posicao: posicao as number | CortePosicao }
      : null;

  const { data, isLoading, sourceUsed, usedFallback } = useArcanoContent(params);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!isPilot || isLoading || !sourceUsed) return;
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] menor-pilot=${naipe}-${posicao} source=${sourceUsed} fallback=${usedFallback}`,
    );
  }, [isPilot, naipe, posicao, sourceUsed, usedFallback, isLoading]);

  return { data, isLoading, sourceUsed, usedFallback, isPilot };
}
