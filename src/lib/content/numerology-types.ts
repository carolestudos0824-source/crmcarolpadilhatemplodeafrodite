/**
 * Tipos canônicos do domínio Numerologia (Fase 6.5).
 *
 * Representa os 10 números (Ás a 10) dos Arcanos Menores e como cada
 * número se manifesta em cada um dos 4 naipes.
 */

import type { ContentNaipe, ContentSource, ContentStatus } from "./types";

export interface NumerologyManifestation {
  copas: string;
  paus: string;
  espadas: string;
  ouros: string;
}

export interface NumerologyItemContent {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string;
  principio: string;
  simbolo: string;
  descricao: string;
  aprofundamento: string;
  manifestacao: NumerologyManifestation;
  palavrasChave: string[];
  reflexao: string;
  status: ContentStatus;
}

export interface NumerologyContent {
  items: NumerologyItemContent[];
  metadata: {
    source: ContentSource;
    usedFallback?: boolean;
  };
}

export type { ContentNaipe };
