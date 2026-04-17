/**
 * Tipos canônicos do domínio Cartas da Corte pedagógicas (Fase 6.5).
 *
 * Estes itens descrevem as 4 figuras (Pajem, Cavaleiro, Rainha, Rei) de
 * forma transversal aos 4 naipes — o conteúdo das 16 cartas individuais
 * continua vindo de `cms_arcanos`.
 */

import type { ContentNaipe, ContentSource, ContentStatus } from "./types";

export interface CourtSuitManifestation {
  titulo: string;
  texto: string;
}

export interface CourtCardContent {
  id: string;
  slug: string;
  nome: string;
  subtitulo: string | null;
  principio: string | null;
  simbolo: string | null;
  palavrasChave: string[];
  textoPrincipal: string;
  explicacaoSimbolica: string | null;
  leituraPsicologica: string | null;
  leituraPratica: string | null;
  manifestacao: Record<ContentNaipe, CourtSuitManifestation>;
  exemplosInterpretacao: string[];
  reflexao: string | null;
  ordem: number;
  status: ContentStatus;
}

export interface CourtCardsContent {
  items: CourtCardContent[];
  metadata: {
    source: ContentSource;
    usedFallback?: boolean;
  };
}
