import { useEffect, useState } from "react";
import { X, Save, RotateCcw, FolderPlus, FolderCheck } from "lucide-react";
import { toast } from "sonner";
import {
  EMPTY_PROJECT_CONTEXT,
  useProjectContext,
  type ProjectContext,
  type YesNo,
} from "@/hooks/useProjectContext";
import { useAppProjects } from "@/hooks/useAppProjects";

/**
 * Drawer "Contexto do meu app". Salva tudo apenas no navegador
 * (localStorage), via useProjectContext. Não toca em banco/auth.
 */

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-medium text-foreground/90">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
  </label>
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
  const { context, setContext, isEditorOpen, closeEditor } = useProjectContext();
  const { activeProject, saveActiveFromCurrent, createProject } = useAppProjects();
  const [draft, setDraft] = useState<ProjectContext>(context);

  useEffect(() => {
    if (isEditorOpen) setDraft(context);
  }, [isEditorOpen, context]);

  if (!isEditorOpen) return null;

  const update = <K extends keyof ProjectContext>(key: K, val: ProjectContext[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const save = () => {
    setContext(draft);
    toast.success("Contexto do seu app salvo.");
    closeEditor();
  };

  const saveInActiveApp = () => {
    setContext(draft);
    // saveActiveFromCurrent lê o contexto do useProjectContext, que acabou de
    // ser atualizado de forma síncrona via setState; mas como a leitura aqui
    // ocorre antes do re-render, passamos o draft direto atualizando o projeto
    // pelo próximo ciclo. Para garantir, salvamos contexto e depois persistimos.
    setTimeout(() => {
      const ok = saveActiveFromCurrent();
      if (ok) toast.success(`Salvo em "${activeProject?.name}".`);
    }, 0);
    closeEditor();
  };

  const saveAsNewApp = () => {
    const name = draft.appName.trim() || "Meu app";
    setContext(draft);
    createProject({ name, context: draft });
    toast.success(`App "${name}" criado a partir deste contexto.`);
    closeEditor();
  };

  const reset = () => {
    setDraft(EMPTY_PROJECT_CONTEXT);
    toast("Campos limpos. Clique em salvar para aplicar.");
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={closeEditor}
    >
      <div
        className="bg-background border-l border-white/10 w-full max-w-xl h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-background/95 backdrop-blur">
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-lg">Contexto do meu app</h2>
            <p className="text-xs text-muted-foreground">
              Preencha uma vez. Os prompts copiados ficam mais precisos para o app
              que você está criando no Lovable.
            </p>
            <p className="text-[11px] mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground max-w-full">
              <FolderCheck size={11} className="text-accent shrink-0" />
              <span className="truncate">
                {activeProject ? `App ativo: ${activeProject.name}` : "App ativo: contexto temporário"}
              </span>
            </p>
          </div>
          <button
            onClick={closeEditor}
            className="p-2 rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>


        <div className="p-5 space-y-4">
          <Field label="Nome do app">
            <input
              className={inputClass}
              value={draft.appName}
              onChange={(e) => update("appName", e.target.value)}
              placeholder="Ex.: Cardápio Fácil"
            />
          </Field>
          <Field label="O que o app faz">
            <textarea
              className={inputClass}
              rows={2}
              value={draft.appDoes}
              onChange={(e) => update("appDoes", e.target.value)}
              placeholder="Ex.: gera cardápios digitais para restaurantes"
            />
          </Field>
          <Field label="Público-alvo">
            <input
              className={inputClass}
              value={draft.audience}
              onChange={(e) => update("audience", e.target.value)}
              placeholder="Ex.: donos de restaurantes pequenos"
            />
          </Field>
          <Field label="Problema que resolve">
            <textarea
              className={inputClass}
              rows={2}
              value={draft.problem}
              onChange={(e) => update("problem", e.target.value)}
            />
          </Field>
          <Field label="Promessa principal">
            <input
              className={inputClass}
              value={draft.promise}
              onChange={(e) => update("promise", e.target.value)}
            />
          </Field>
          <Field label="Ação principal do usuário">
            <input
              className={inputClass}
              value={draft.mainAction}
              onChange={(e) => update("mainAction", e.target.value)}
              placeholder="Ex.: criar um cardápio em 2 minutos"
            />
          </Field>
          <Field label="Produto/serviço vendido">
            <input
              className={inputClass}
              value={draft.productSold}
              onChange={(e) => update("productSold", e.target.value)}
            />
          </Field>
          <Field label="Modelo de cobrança">
            <input
              className={inputClass}
              value={draft.pricingModel}
              onChange={(e) => update("pricingModel", e.target.value)}
              placeholder="Ex.: assinatura mensal, pagamento único"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precisa de login">
              <YesNoSelect value={draft.needsLogin} onChange={(v) => update("needsLogin", v)} />
            </Field>
            <Field label="Precisa de banco de dados">
              <YesNoSelect
                value={draft.needsDatabase}
                onChange={(v) => update("needsDatabase", v)}
              />
            </Field>
            <Field label="Precisa de área paga">
              <YesNoSelect
                value={draft.needsPaidArea}
                onChange={(v) => update("needsPaidArea", v)}
              />
            </Field>
            <Field label="Precisa de admin">
              <YesNoSelect value={draft.needsAdmin} onChange={(v) => update("needsAdmin", v)} />
            </Field>
            <Field label="Precisa de checkout">
              <YesNoSelect
                value={draft.needsCheckout}
                onChange={(v) => update("needsCheckout", v)}
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
            />
          </Field>
        </div>

        <div className="sticky bottom-0 flex flex-wrap gap-2 justify-end p-4 border-t border-white/10 bg-background/95 backdrop-blur">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
            type="button"
          >
            <RotateCcw size={14} /> Limpar
          </button>
          <button
            onClick={save}
            className="btn-primary text-sm"
            type="button"
          >
            <Save size={14} /> Salvar contexto
          </button>
        </div>
      </div>
    </div>
  );
};
