/**
 * Tipos canônicos do domínio Jornada (Fase 5D).
 *
 * Como nas demais áreas do adapter, a UI nunca depende da forma do banco
 * nem do `.ts` legado — sempre destes tipos.
 */

import type { ContentSource, ContentStatus, ContentTier } from "./types";
import type { JourneyTheme } from "@/config/journey-visual";

export interface JourneyPhaseContent {
  id: string;
  slug: string;
  ordem: number;
  titulo: string;
  subtitulo: string;
  simbolo: string;
  descricao: string;
  theme: JourneyTheme;
  arcanoIds: number[];
  status: ContentStatus;
  tier: ContentTier;
}

export interface JourneyArcanoContent {
  id: string;
  arcanoNumero: number;
  numeral: string;
  nome: string;
  papel: string;
  textoNarrativo: string;
  faseSlug: string;
  ordem: number;
  status: ContentStatus;
}

export interface JourneyMetaContent {
  introTitulo: string;
  introSubtitulo: string;
  introEpigrafe: string;
  introCorpo: string[];
  encerramentoTitulo: string;
  encerramentoCorpo: string;
  encerramentoConvite: string;
}

export interface JourneyContent {
  meta: JourneyMetaContent;
  fases: JourneyPhaseContent[];
  arcanos: JourneyArcanoContent[];
  metadata: {
    source: ContentSource;
    usedFallback?: boolean;
  };
}
