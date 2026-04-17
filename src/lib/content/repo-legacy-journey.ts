/**
 * Repositório legacy do domínio Jornada — lê de `src/data/fools-journey.ts`.
 *
 * Esta é a ÚNICA importação autorizada de `@/data/fools-journey`.
 * Telas e componentes nunca devem importar dali diretamente.
 */

import {
  JOURNEY_INTRO,
  JOURNEY_PHASES,
  JOURNEY_ARCANOS,
  JOURNEY_CLOSING,
} from "@/data/fools-journey";
import type {
  JourneyArcanoContent,
  JourneyContent,
  JourneyPhaseContent,
} from "./journey-types";

export function fetchJourneyFromLegacy(): JourneyContent {
  const fases: JourneyPhaseContent[] = JOURNEY_PHASES.map((p, i) => ({
    id: `legacy-phase-${p.id}`,
    slug: p.id,
    ordem: i,
    titulo: p.title,
    subtitulo: p.subtitle,
    simbolo: p.symbol,
    descricao: p.description,
    theme: p.theme,
    arcanoIds: p.arcanoIds,
    status: "publicado",
    tier: "free",
  }));

  // mapa arcanoId → faseSlug
  const arcanoToPhase = new Map<number, string>();
  for (const p of JOURNEY_PHASES) {
    for (const id of p.arcanoIds) arcanoToPhase.set(id, p.id);
  }

  const arcanos: JourneyArcanoContent[] = JOURNEY_ARCANOS.map((a) => ({
    id: `legacy-arcano-${a.id}`,
    arcanoNumero: a.id,
    numeral: a.numeral,
    nome: a.name,
    papel: a.journeyRole,
    textoNarrativo: a.narrativeText,
    faseSlug: arcanoToPhase.get(a.id) ?? "mundo-material",
    ordem: a.id,
    status: "publicado",
  }));

  return {
    meta: {
      introTitulo: JOURNEY_INTRO.title,
      introSubtitulo: JOURNEY_INTRO.subtitle,
      introEpigrafe: JOURNEY_INTRO.epigraph,
      introCorpo: JOURNEY_INTRO.body,
      encerramentoTitulo: JOURNEY_CLOSING.title,
      encerramentoCorpo: JOURNEY_CLOSING.body,
      encerramentoConvite: JOURNEY_CLOSING.invitation,
    },
    fases,
    arcanos,
    metadata: { source: "legacy", usedFallback: true },
  };
}
