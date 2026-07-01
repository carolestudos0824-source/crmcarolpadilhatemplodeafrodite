import { EMPTY_PROJECT_CONTEXT, type ProjectContext, type YesNo } from "@/hooks/useProjectContext";

/**
 * Camada local de RASCUNHO do "Contexto do meu app".
 *
 * Esta camada vive APENAS dentro do ProjectContextDrawer. Não substitui o
 * contexto oficial (`fabrica_apps_project_context`) nem grava em banco.
 * Serve apenas para que a pessoa usuária não perca o que digitou se fechar o painel
 * sem clicar em "Salvar contexto" ou "Salvar como novo app".
 */

export const DRAFT_KEY_PREFIX = "fabrica_apps_context_draft";
export const DRAFT_SCHEMA_VERSION = 1;

export type DraftScope = {
  userId: string | null;
  appId: string | null;
};

export type DraftRecord = {
  kind: "draft";
  version: number;
  userId: string;
  appId: string;
  updatedAt: string;
  data: ProjectContext;
};

const safeUserId = (userId: string | null | undefined) =>
  userId && userId.trim() ? userId : "anonymous";

const safeAppId = (appId: string | null | undefined) =>
  appId && appId.trim() ? appId : "temporary";

export function buildDraftKey({ userId, appId }: DraftScope): string {
  return `${DRAFT_KEY_PREFIX}:${safeUserId(userId)}:${safeAppId(appId)}`;
}

const normalizeYesNo = (v: unknown): YesNo =>
  v === "sim" || v === "nao" ? v : "";

const normalizeString = (v: unknown): string => (typeof v === "string" ? v : "");

const normalizeContext = (raw: unknown): ProjectContext => {
  const r = (raw ?? {}) as Partial<Record<keyof ProjectContext, unknown>>;
  return {
    appName: normalizeString(r.appName),
    appDoes: normalizeString(r.appDoes),
    audience: normalizeString(r.audience),
    problem: normalizeString(r.problem),
    promise: normalizeString(r.promise),
    mainAction: normalizeString(r.mainAction),
    productSold: normalizeString(r.productSold),
    pricingModel: normalizeString(r.pricingModel),
    needsLogin: normalizeYesNo(r.needsLogin),
    needsDatabase: normalizeYesNo(r.needsDatabase),
    needsPaidArea: normalizeYesNo(r.needsPaidArea),
    needsAdmin: normalizeYesNo(r.needsAdmin),
    needsCheckout: normalizeYesNo(r.needsCheckout),
    visualStyle: normalizeString(r.visualStyle),
    notes: normalizeString(r.notes),
  };
};

export function normalizeProjectContext(ctx: ProjectContext): ProjectContext {
  return normalizeContext(ctx);
}

export function isContextEmpty(ctx: ProjectContext): boolean {
  return Object.values(ctx).every((v) => typeof v !== "string" || v.trim() === "");
}

export function isContextEqual(a: ProjectContext, b: ProjectContext): boolean {
  const na = normalizeContext(a);
  const nb = normalizeContext(b);
  return (Object.keys(EMPTY_PROJECT_CONTEXT) as (keyof ProjectContext)[]).every(
    (k) => na[k] === nb[k],
  );
}

function devWarn(message: string, err: unknown) {
  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[contextDraftStorage] ${message}`, err);
  }
}

export function readDraft(scope: DraftScope): ProjectContext | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(buildDraftKey(scope));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftRecord> | null;
    if (
      !parsed ||
      parsed.kind !== "draft" ||
      parsed.version !== DRAFT_SCHEMA_VERSION ||
      typeof parsed.data !== "object" ||
      parsed.data === null
    ) {
      removeDraft(scope);
      return null;
    }
    const data = normalizeContext(parsed.data);
    if (isContextEmpty(data)) return null;
    return data;
  } catch (err) {
    devWarn("readDraft falhou", err);
    try {
      window.localStorage.removeItem(buildDraftKey(scope));
    } catch {
      /* ignore */
    }
    return null;
  }
}

export function writeDraft(scope: DraftScope, data: ProjectContext): void {
  try {
    if (typeof window === "undefined") return;
    const record: DraftRecord = {
      kind: "draft",
      version: DRAFT_SCHEMA_VERSION,
      userId: safeUserId(scope.userId),
      appId: safeAppId(scope.appId),
      updatedAt: new Date().toISOString(),
      data: normalizeContext(data),
    };
    window.localStorage.setItem(buildDraftKey(scope), JSON.stringify(record));
  } catch (err) {
    devWarn("writeDraft falhou (localStorage indisponível?)", err);
  }
}

export function removeDraft(scope: DraftScope): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(buildDraftKey(scope));
  } catch (err) {
    devWarn("removeDraft falhou", err);
  }
}
