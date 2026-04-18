/**
 * Repositório DB do domínio Jornada.
 * Lê das tabelas cms_journey_phases, cms_journey_arcanos, cms_journey_meta.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  JourneyArcanoContent,
  JourneyContent,
  JourneyMetaContent,
  JourneyPhaseContent,
} from "./journey-types";
import type { JourneyTheme } from "@/config/journey-visual";
import { isJourneyTheme } from "@/config/journey-visual";

type DbStatus = "empty" | "partial" | "draft" | "published";

const STATUS_PT: Record<DbStatus, JourneyPhaseContent["status"]> = {
  empty: "vazio",
  partial: "parcial",
  draft: "rascunho",
  published: "publicado",
};

function safeTheme(value: string | null | undefined): JourneyTheme {
  return value && isJourneyTheme(value) ? value : "gold";
}

export async function fetchJourneyFromDb(): Promise<JourneyContent | null> {
  const [phasesRes, arcanosRes, metaRes] = await Promise.all([
    supabase
      .from("cms_journey_phases")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("cms_journey_arcanos")
      .select("*")
      .order("arcano_number", { ascending: true }),
    supabase
      .from("cms_journey_meta")
      .select("*")
      .eq("singleton", true)
      .maybeSingle(),
  ]);

  if (phasesRes.error) throw phasesRes.error;
  if (arcanosRes.error) throw arcanosRes.error;
  if (metaRes.error) throw metaRes.error;

  const phases = phasesRes.data ?? [];
  const arcanos = arcanosRes.data ?? [];
  const meta = metaRes.data;

  if (phases.length === 0 || arcanos.length === 0 || !meta) return null;

  const fases: JourneyPhaseContent[] = phases.map((p) => ({
    id: p.id,
    slug: p.slug,
    ordem: p.order_index ?? 0,
    titulo: p.title,
    subtitulo: p.subtitle ?? "",
    simbolo: p.symbol ?? "",
    descricao: p.description ?? "",
    theme: safeTheme(p.theme),
    arcanoIds: (p.arcano_ids ?? []) as number[],
    status: STATUS_PT[(p.status ?? "published") as DbStatus],
    tier: (p.tier ?? "free") as JourneyPhaseContent["tier"],
  }));

  const arcanosUI: JourneyArcanoContent[] = arcanos.map((a) => ({
    id: a.id,
    arcanoNumero: a.arcano_number,
    numeral: a.numeral,
    nome: a.name,
    papel: a.journey_role,
    textoNarrativo: a.narrative_text,
    faseSlug: a.phase_slug,
    ordem: a.order_index ?? 0,
    status: STATUS_PT[(a.status ?? "published") as DbStatus],
  }));

  const metaUI: JourneyMetaContent = {
    introTitulo: meta.intro_title,
    introSubtitulo: meta.intro_subtitle ?? "",
    introEpigrafe: meta.intro_epigraph ?? "",
    introCorpo: (meta.intro_body ?? []) as string[],
    encerramentoTitulo: meta.closing_title,
    encerramentoCorpo: meta.closing_body ?? "",
    encerramentoConvite: meta.closing_invitation ?? "",
  };

  return {
    meta: metaUI,
    fases,
    arcanos: arcanosUI,
    metadata: { source: "db" },
  };
}
