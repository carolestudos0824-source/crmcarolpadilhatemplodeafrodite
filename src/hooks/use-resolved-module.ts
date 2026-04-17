/**
 * Adapter hook — Fase 4A do refactor de conteúdo.
 *
 * Liga a tela de módulo ao novo content-adapter SEM trocar layout, ordem
 * de lições ou progresso.
 *
 * Padrão idêntico ao adopt das fases anteriores:
 *   1. Resolve via `useModuleContent(slug)` (DB → fallback automático).
 *   2. Expõe `sourceUsed` / `usedFallback` para telemetria.
 *   3. A UI continua consumindo o objeto legado (FUNDAMENTOS_LESSONS etc.)
 *      para preservar ícones, ordem, ações de continuidade e visual.
 *   4. Em DEV emite log para validar leitura via DB.
 */

import { useEffect } from "react";
import { useModuleContent } from "./use-content";
import type { ContentSource, ModuleContent } from "@/lib/content/types";

export interface UseResolvedModuleResult {
  data: ModuleContent | null;
  isLoading: boolean;
  sourceUsed: ContentSource | null;
  usedFallback: boolean;
}

export function useResolvedModule(slug: string | null): UseResolvedModuleResult {
  const { data, isLoading, sourceUsed, usedFallback } = useModuleContent(slug);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!slug || isLoading || !sourceUsed) return;
    // eslint-disable-next-line no-console
    console.info(
      `[content-adapter] module=${slug} source=${sourceUsed} fallback=${usedFallback}`,
    );
  }, [slug, sourceUsed, usedFallback, isLoading]);

  return { data, isLoading, sourceUsed, usedFallback };
}
