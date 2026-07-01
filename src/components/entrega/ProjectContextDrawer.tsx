import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Save, RotateCcw, FolderPlus, FolderCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  EMPTY_PROJECT_CONTEXT,
  useProjectContext,
  type ProjectContext,
  type YesNo,
} from "@/hooks/useProjectContext";
import { useAppProjects } from "@/hooks/useAppProjects";
import { supabase } from "@/integrations/supabase/client";
import {
  isContextEqual,
  readDraft,
  removeDraft,
  writeDraft,
  type DraftScope,
} from "@/lib/contextDraftStorage";

/**
 * Drawer "Contexto do meu app". Salva tudo apenas no navegador
 * (localStorage), via useProjectContext. Não toca em banco/auth.
 *
 * Camada adicional de RASCUNHO local (contextDraftStorage) garante que a
* pessoa usuária não perca o que digitou se fechar o painel sem salvar.
 */


const Field = ({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium text-foreground/90">
      {label}
      {required && <span className="text-accent ml-0.5">*</span>}
    </span>
    {children}
    {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
  </label>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40";

const YesNoSelect = ({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as YesNo)}
    className={inputClass}
  >
    <option value="">Selecionar…</option>
    <option value="sim">Sim</option>
    <option value="nao">Não</option>
  </select>
);

export const ProjectContextDrawer = () => {
  const { context, setContext, setRuntimeContext, clearTemporaryContext, isEditorOpen, closeEditor } = useProjectContext();
  const {
    activeProject,
    saveContextToActiveProject,
    createProjectFromContext,
  } = useAppProjects();
  const [draft, setDraft] = useState<ProjectContext>(context);
  const [baseline, setBaseline] = useState<ProjectContext>(context);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const skipHydrationRef = useRef(false);
  const hydratedRef = useRef(false);
  const draftToastShownRef = useRef(false);

  const scope: DraftScope = useMemo(
    () => ({ userId, appId: activeProject?.id ?? null }),
    [userId, activeProject?.id],
  );

  // Carrega userId uma vez (read-only — não altera auth).
  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUserId(data.session?.user?.id ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUserId(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // Hidratação ao abrir: contexto oficial/app ativo + restauração de rascunho.
  useEffect(() => {
    if (!isEditorOpen) {
      skipHydrationRef.current = false;
      hydratedRef.current = false;
      draftToastShownRef.current = false;
      return;
    }

    if (skipHydrationRef.current) {
      hydratedRef.current = true;
      return;
    }

    const initial: ProjectContext = activeProject ? activeProject.context : context;
    setBaseline(initial);
    setDraft(initial);

    const savedDraft = readDraft(scope);
    if (savedDraft && !isContextEqual(savedDraft, initial)) {
      setDraft(savedDraft);
      if (!draftToastShownRef.current) {
        draftToastShownRef.current = true;
        toast("Rascunho recuperado. Suas alterações anteriores foram restauradas.");
      }
    }

    // Marca hidratação concluída no próximo tick, evitando autosave de draft vazio.
    const t = window.setTimeout(() => {
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(t);
  }, [isEditorOpen, activeProject, context, scope]);

  // Autosave do rascunho (debounce 500ms). Só dispara após hidratação.
  useEffect(() => {
    if (!isEditorOpen) return;
    if (!hydratedRef.current) return;
    if (isContextEqual(draft, baseline)) return;

    const t = window.setTimeout(() => {
      writeDraft(scope, draft);
    }, 500);
    return () => window.clearTimeout(t);
  }, [draft, baseline, isEditorOpen, scope]);

  const isDirty = useMemo(
    () => !isContextEqual(draft, baseline),
    [draft, baseline],
  );

  const attemptClose = useCallback(() => {
    if (isDirty) {
      setConfirmClose(true);
      return;
    }
    closeEditor();
  }, [isDirty, closeEditor]);

  // ESC passa pelo guard.
  useEffect(() => {
    if (!isEditorOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmReset || confirmClose) return; // sub-modais lidam por conta própria
      e.preventDefault();
      e.stopPropagation();
      attemptClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isEditorOpen, attemptClose, confirmReset, confirmClose]);

  if (!isEditorOpen) return null;

  const update = <K extends keyof ProjectContext>(key: K, val: ProjectContext[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const save = async () => {
    if (activeProject) {
      const ok = await saveContextToActiveProject(draft);
      if (!ok) {
        toast.error("Não foi possível salvar neste app.");
        return;
      }
      setRuntimeContext(draft);
    } else {
      setContext(draft);
    }
    removeDraft(scope);
    setBaseline(draft);
    toast.success("Contexto salvo. Os próximos prompts usarão essas informações.");
    closeEditor();
  };

  const saveAsNewApp = async () => {
    const name = draft.appName.trim() || "Meu app";
    const created = await createProjectFromContext(draft, name);
    if (created) {
      removeDraft(scope);
      // Também remove a chave "temporary" caso o draft tenha vindo de lá.
      if (scope.appId !== null) removeDraft({ userId: scope.userId, appId: null });
      setBaseline(draft);
      toast.success("Novo app criado. Este contexto agora está vinculado ao projeto.");
    } else {
      toast.error("Faça login para salvar este app na sua conta.");
      return;
    }
    closeEditor();
  };

  const reset = () => {
    skipHydrationRef.current = true;
    setDraft(EMPTY_PROJECT_CONTEXT);
    setBaseline(EMPTY_PROJECT_CONTEXT);
    clearTemporaryContext();
    removeDraft(scope);
    if (activeProject) setRuntimeContext(activeProject.context);
    setConfirmReset(false);
    toast("Contexto limpo. Os campos voltaram ao estado inicial.");
  };


  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={attemptClose}
    >
      <div
        className="bg-background border-l border-white/10 w-full max-w-xl h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-background/95 backdrop-blur">
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-lg">Contexto do projeto em foco</h2>
            <p className="text-xs text-muted-foreground">
              Preencha uma vez. Os prompts copiados ficam mais precisos para o
              app que você está criando.
            </p>
            <p className="text-[11px] mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground max-w-full">
              <FolderCheck size={11} className="text-accent shrink-0" />
              <span className="truncate">
                {activeProject
                  ? `App ativo: ${activeProject.name}`
                  : "Contexto temporário — salve como app para guardar na sua conta"}
              </span>
            </p>
          </div>
          <button
            onClick={attemptClose}
            className="p-2 rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 pb-32">
          <Section title="Essência do app">
            <p className="text-[11px] text-muted-foreground -mt-1">
              Preencha pelo menos os campos marcados com * para gerar prompts
              mais precisos.
            </p>
            <Field label="Nome do app" required>
              <input
                className={inputClass}
                value={draft.appName}
                onChange={(e) => update("appName", e.target.value)}
                placeholder="Ex.: Meu App de Finanças"
              />
            </Field>
            <Field label="O que o app faz" required>
              <textarea
                className={inputClass}
                rows={2}
                value={draft.appDoes}
                onChange={(e) => update("appDoes", e.target.value)}
                placeholder="Ex.: ajuda pessoas a resolverem um problema específico com rapidez"
              />
            </Field>
            <Field label="Público-alvo" required>
              <input
                className={inputClass}
                value={draft.audience}
                onChange={(e) => update("audience", e.target.value)}
                placeholder="Ex.: profissionais autônomos, pequenos negócios ou usuários finais"
              />
            </Field>
            <Field label="Problema que resolve" required>
              <textarea
                className={inputClass}
                rows={2}
                value={draft.problem}
                onChange={(e) => update("problem", e.target.value)}
                placeholder="Ex.: dificuldade de organizar, vender, decidir ou acompanhar algo"
              />
            </Field>
            <Field label="Promessa principal">
              <input
                className={inputClass}
                value={draft.promise}
                onChange={(e) => update("promise", e.target.value)}
                placeholder="Ex.: chegar ao resultado desejado em menos tempo e com menos esforço"
              />
            </Field>
            <Field label="Ação principal do usuário" required>
              <input
                className={inputClass}
                value={draft.mainAction}
                onChange={(e) => update("mainAction", e.target.value)}
                placeholder="Ex.: preencher dados e receber uma recomendação personalizada"
              />
            </Field>
          </Section>

          <Section title="Oferta e monetização">
            <Field label="Produto/serviço vendido">
              <input
                className={inputClass}
                value={draft.productSold}
                onChange={(e) => update("productSold", e.target.value)}
                placeholder="Ex.: assinatura, plano premium, consultoria, acesso vitalício ou produto digital"
              />
            </Field>
            <Field label="Modelo de cobrança">
              <input
                className={inputClass}
                value={draft.pricingModel}
                onChange={(e) => update("pricingModel", e.target.value)}
                placeholder="Ex.: assinatura mensal, pagamento único, freemium ou comissão"
              />
            </Field>
            <Field label="Precisa de checkout">
              <YesNoSelect
                value={draft.needsCheckout}
                onChange={(v) => update("needsCheckout", v)}
              />
            </Field>
            <Field label="Precisa de área paga">
              <YesNoSelect
                value={draft.needsPaidArea}
                onChange={(v) => update("needsPaidArea", v)}
              />
            </Field>
          </Section>

          <Section title="Construção">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precisa de login">
                <YesNoSelect
                  value={draft.needsLogin}
                  onChange={(v) => update("needsLogin", v)}
                />
              </Field>
              <Field label="Precisa de banco de dados">
                <YesNoSelect
                  value={draft.needsDatabase}
                  onChange={(v) => update("needsDatabase", v)}
                />
              </Field>
              <Field label="Precisa de admin">
                <YesNoSelect
                  value={draft.needsAdmin}
                  onChange={(v) => update("needsAdmin", v)}
                />
              </Field>
            </div>
            <Field label="Estilo visual desejado">
              <input
                className={inputClass}
                value={draft.visualStyle}
                onChange={(e) => update("visualStyle", e.target.value)}
                placeholder="Ex.: clean, dark, minimalista"
              />
            </Field>
            <Field label="Observações importantes">
              <textarea
                className={inputClass}
                rows={3}
                value={draft.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Ex.: regras de negócio, integrações específicas, restrições"
              />
            </Field>
          </Section>
        </div>

        <div className="sticky bottom-0 p-4 border-t border-white/10 bg-background/95 backdrop-blur space-y-2">
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-muted-foreground"
              type="button"
            >
              <RotateCcw size={14} /> Limpar
            </button>
            <button
              onClick={saveAsNewApp}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs"
              type="button"
              title="Cria um app em construção salvo na sua conta."
            >
              <FolderPlus size={14} /> Salvar como novo app
            </button>
            <button
              onClick={save}
              className="btn-primary text-xs"
              type="button"
              title="Atualiza os prompts com estas informações."
            >
              <Save size={14} /> Salvar contexto
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground text-right">
            "Salvar contexto" atualiza os prompts. "Salvar como novo app" cria
            um projeto na sua conta.
          </p>
        </div>

        {confirmReset && (
          <div
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmReset(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-background p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Limpar contexto temporário?
                </h3>
                <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
                  Isso vai apagar os dados preenchidos nesta gaveta e remover o
                  contexto temporário salvo neste navegador. Apps salvos na sua
                  conta não serão apagados.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 text-xs inline-flex items-center gap-2"
                  type="button"
                >
                  <RotateCcw size={14} /> Limpar contexto
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmClose && (
          <div
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmClose(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-amber-400/30 bg-background p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Você tem alterações não salvas
                  </h3>
                  <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
                    Se sair agora, suas alterações ficam guardadas como rascunho
                    neste navegador, mas ainda não serão aplicadas como contexto
                    oficial do app.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setConfirmClose(false)}
                  className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-xs"
                  type="button"
                >
                  Continuar editando
                </button>
                <button
                  onClick={() => {
                    setConfirmClose(false);
                    closeEditor();
                  }}
                  className="px-3 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 text-xs"
                  type="button"
                >
                  Sair e manter rascunho
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

