/**
 * Jornada do projeto na Fábrica de Apps com IA.
 *
 * Persistência: localStorage por `projectId` (chave `fabrica_project_journey__<id>`).
 * Não altera schema do banco. Eventos `storage` e um `CustomEvent` interno
 * (`fabrica:journey-change`) permitem sincronização entre componentes na mesma aba.
 */

export type JourneyId =
  | "comecando_do_zero"
  | "app_completo_por_versoes"
  | "ja_tenho_um_app";

export const JOURNEY_LABELS: Record<JourneyId, string> = {
  comecando_do_zero: "Começando do zero",
  app_completo_por_versoes: "Quero um app completo",
  ja_tenho_um_app: "Já tenho um app",
};

/**
 * Rótulo da "Fase atual" exibida nos cards de Estado do Projeto.
 * Fonte ÚNICA de verdade: jornada escolhida pelo usuário no projeto ativo.
 * Quando não houver jornada salva, o chamador pode aplicar seu fallback.
 */
export const JOURNEY_PHASE_LABELS: Record<JourneyId, string> = {
  comecando_do_zero: "Começando do zero",
  app_completo_por_versoes: "Construindo por versões",
  ja_tenho_um_app: "Já tenho um app",
};

/**
 * Tipo de "fase" usado internamente por recomendadores (sem string PT-BR).
 */
export type JourneyPhase = "scratch" | "versioning" | "ready";

export const JOURNEY_TO_PHASE: Record<JourneyId, JourneyPhase> = {
  comecando_do_zero: "scratch",
  app_completo_por_versoes: "versioning",
  ja_tenho_um_app: "ready",
};


/**
 * Orientação curta injetada nos prompts de GPS e Arquiteto.
 * Mantém o foco do prompt do módulo intacto — apenas adiciona contexto de perfil.
 */
export const JOURNEY_GPS_HINTS: Record<JourneyId, string> = {
  comecando_do_zero:
    "Priorize clareza de ideia, MVP, telas essenciais e primeira versão funcional. Evite recomendar funcionalidades avançadas cedo demais.",
  app_completo_por_versoes:
    "Priorize construção por versões (MVP, V2, V3). Evite recomendar construir tudo de uma vez.",
  ja_tenho_um_app:
    "Priorize auditoria, correção, segurança, melhorias e prontidão antes de novas funcionalidades. Não recomende refazer o app.",
};

export const JOURNEY_ARQUITETO_HINTS: Record<JourneyId, string> = {
  comecando_do_zero:
    "Corte excesso, proteja o MVP e adie funcionalidades avançadas. Se a melhoria não cabe na primeira versão funcional, recomende deixar para depois.",
  app_completo_por_versoes:
    "Classifique cada melhoria por versão (MVP, V2, V3). Recomende a fase correta em vez de adicionar tudo agora.",
  ja_tenho_um_app:
    "Preserve o app existente. Priorize auditoria, correção cirúrgica e melhorias por risco/impacto. Não recomende reescrita.",
};

const STORAGE_PREFIX = "fabrica_project_journey__";
const EVENT_NAME = "fabrica:journey-change";

const isJourneyId = (v: unknown): v is JourneyId =>
  v === "comecando_do_zero" ||
  v === "app_completo_por_versoes" ||
  v === "ja_tenho_um_app";

export const getJourney = (projectId: string | null | undefined): JourneyId | null => {
  if (!projectId || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
    return isJourneyId(raw) ? raw : null;
  } catch {
    return null;
  }
};

export const setJourney = (
  projectId: string | null | undefined,
  journey: JourneyId | null,
): void => {
  if (!projectId || typeof window === "undefined") return;
  try {
    const key = `${STORAGE_PREFIX}${projectId}`;
    if (journey === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, journey);
    }
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { projectId, journey } }),
    );
  } catch {
    /* noop */
  }
};

// React hook (kept in a separate import path-free helper to allow tree shaking).
import { useEffect, useState } from "react";

export const useProjectJourney = (
  projectId: string | null | undefined,
): [JourneyId | null, (j: JourneyId | null) => void] => {
  const [value, setValue] = useState<JourneyId | null>(() => getJourney(projectId));

  useEffect(() => {
    setValue(getJourney(projectId));
    if (typeof window === "undefined") return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ projectId?: string }>).detail;
      if (!detail || detail.projectId === projectId) {
        setValue(getJourney(projectId));
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (!projectId) return;
      if (e.key === `${STORAGE_PREFIX}${projectId}`) {
        setValue(getJourney(projectId));
      }
    };
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [projectId]);

  const update = (j: JourneyId | null) => {
    setJourney(projectId, j);
    setValue(j);
  };
  return [value, update];
};
