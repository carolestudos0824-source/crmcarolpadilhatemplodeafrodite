/**
 * Repositório legacy de Cartas da Corte pedagógicas (fallback — Fase 6.5).
 * Única importação autorizada de `@/data/arcanos-menores/cartas-corte`.
 */

import { CARTAS_CORTE } from "@/content/arcanos-menores/cartas-corte";
import type {
  CourtCardContent,
  CourtCardsContent,
} from "./court-types";

export function fetchCourtCardsFromLegacy(): CourtCardsContent {
  const items: CourtCardContent[] = CARTAS_CORTE.map((c, idx) => ({
    id: `legacy-court-${c.id}`,
    slug: c.id,
    nome: c.nome,
    subtitulo: c.subtitulo,
    principio: c.principio,
    simbolo: c.simbolo,
    palavrasChave: c.palavrasChave,
    textoPrincipal: c.textoPrincipal,
    explicacaoSimbolica: c.explicacaoSimbolica,
    leituraPsicologica: c.leituraPsicologica,
    leituraPratica: c.leituraPratica,
    manifestacao: {
      copas: c.comoSeManifesta.copas,
      paus: c.comoSeManifesta.paus,
      espadas: c.comoSeManifesta.espadas,
      ouros: c.comoSeManifesta.ouros,
    },
    exemplosInterpretacao: c.exemplosInterpretacao,
    reflexao: c.reflexao,
    ordem: idx,
    status: "publicado",
  }));

  return { items, metadata: { source: "legacy", usedFallback: true } };
}
