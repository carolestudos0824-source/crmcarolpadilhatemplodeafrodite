/**
 * Tipos canônicos do domínio Naipe Intro (Fase 6.5).
 *
 * Conteúdo editorial introdutório dos 4 naipes: essência, atmosfera,
 * função na leitura, palavras-âncora, etc. NÃO inclui visual config
 * (cores, ícones, keywords) — esses permanecem em `NAIPES` local.
 */

import type { ContentNaipe, ContentSource, ContentStatus } from "./types";

export interface SuitContent {
  id: string;
  naipe: ContentNaipe;
  nome: string;
  subtitulo: string | null;
  fraseAbertura: string | null;
  essencia: string | null;
  atmosfera: string | null;
  linguagemEditorial: string | null;
  potencial: string | null;
  desafios: string | null;
  funcaoNaLeitura: string | null;
  palavrasAncora: string[];
  aplicacoesLeitura: string[];
  reflexao: string | null;
  elemento: string | null;
  simboloElemento: string | null;
  icone: string | null;
  status: ContentStatus;
}

export interface SuitsContent {
  items: SuitContent[];
  metadata: {
    source: ContentSource;
    usedFallback?: boolean;
  };
}
