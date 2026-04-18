/**
 * Repositório legacy de Naipe Intro (fallback de emergência — Fase 6.5).
 * Única importação autorizada de `@/data/arcanos-menores/naipes-pedagogico`.
 */

import { NAIPES_PEDAGOGICO } from "@/content/arcanos-menores/naipes-pedagogico";
import type { ContentNaipe } from "./types";
import type { SuitContent, SuitsContent } from "./suits-types";

const NAIPES: ContentNaipe[] = ["copas", "paus", "espadas", "ouros"];

const NOMES: Record<ContentNaipe, string> = {
  copas: "Naipe de Copas",
  paus: "Naipe de Paus",
  espadas: "Naipe de Espadas",
  ouros: "Naipe de Ouros",
};

export function fetchSuitsFromLegacy(): SuitsContent {
  const items: SuitContent[] = NAIPES.map((naipe) => {
    const ped = NAIPES_PEDAGOGICO[naipe];
    return {
      id: `legacy-suit-${naipe}`,
      naipe,
      nome: NOMES[naipe],
      subtitulo: null,
      fraseAbertura: ped.fraseAbertura,
      essencia: ped.textoPrincipal,
      atmosfera: ped.eixoElemental.texto,
      linguagemEditorial: ped.aprofundamentoSimbolico,
      potencial: ped.eixoPsicologico.texto,
      desafios: null,
      funcaoNaLeitura: ped.eixoPratico.texto,
      palavrasAncora: [],
      aplicacoesLeitura: ped.aplicacoesLeitura,
      reflexao: ped.reflexao,
      elemento: null,
      simboloElemento: null,
      icone: null,
      status: "publicado",
    };
  });

  return { items, metadata: { source: "legacy", usedFallback: true } };
}
