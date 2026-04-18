/**
 * Repositório legacy de Numerologia (fallback de emergência — Fase 6.5).
 * Única importação autorizada de `@/data/arcanos-menores/numerologia`.
 */

import { NUMEROLOGIA } from "@/content/arcanos-menores/numerologia";
import type {
  NumerologyContent,
  NumerologyItemContent,
} from "./numerology-types";

export function fetchNumerologyFromLegacy(): NumerologyContent {
  const items: NumerologyItemContent[] = NUMEROLOGIA.map((n) => ({
    id: `legacy-num-${n.numero}`,
    numero: n.numero,
    nome: n.nome,
    subtitulo: n.subtitulo,
    principio: n.principio,
    simbolo: n.simbolo,
    descricao: n.descricao,
    aprofundamento: n.aprofundamento,
    manifestacao: {
      copas: n.comoAfetaCadaNaipe.copas,
      paus: n.comoAfetaCadaNaipe.paus,
      espadas: n.comoAfetaCadaNaipe.espadas,
      ouros: n.comoAfetaCadaNaipe.ouros,
    },
    palavrasChave: n.palavrasChave,
    reflexao: n.reflexao,
    status: "publicado",
  }));

  return { items, metadata: { source: "legacy", usedFallback: true } };
}
