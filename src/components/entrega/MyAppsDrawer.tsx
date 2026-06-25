import { useState } from "react";
import {
  X,
  FolderKanban,
  Plus,
  Check,
  Copy,
  Trash2,
  Settings2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import {
  useAppProjects,
  APP_PROJECT_STATUSES,
  type AppProjectStatus,
} from "@/hooks/useAppProjects";
import { useProjectContext } from "@/hooks/useProjectContext";

const STATUS_LABEL: Record<AppProjectStatus, string> = {
  ideia: "Ideia",
  planejando: "Planejando",
  construindo: "Construindo",
  revisando: "Revisando",
  publicado: "Publicado",
  vendendo: "Vendendo",
  escalando: "Escalando",
  pausado: "Pausado",
  arquivado: "Arquivado",
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  } catch {
    return "—";
  }
}

export const MyAppsDrawer = () => {
  const {
    projects,
    activeId,
    isDrawerOpen,
    closeDrawer,
    createProject,
    selectProject,
    duplicateProject,
    deleteProject,
    updateProject,
    loading,
    error,
    hasLocalProjectsToImport,
    hasLocalContextToImport,
    importLocalProjects,
    createProjectFromLocalContext,
  } = useAppProjects();
  const { openEditor } = useProjectContext();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  if (!isDrawerOpen) return null;

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Dê um nome para o app.");
      return;
    }
    const created = await createProject({ name });
    if (!created) {
      toast.error("Não foi possível criar. Faça login e tente novamente.");
      return;
    }
    setNewName("");
    setCreating(false);
    toast.success(`App "${name}" criado e definido como ativo.`);
    closeDrawer();
    openEditor();
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={closeDrawer}
    >
      <div
        className="bg-background border-l border-white/10 w-full max-w-xl h-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-background/95 backdrop-blur">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FolderKanban size={16} className="text-accent" />
              <h2 className="font-heading font-bold text-lg">Projetos em construção</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Organize os apps que você está criando. Cada app mantém seu
              próprio contexto, etapa atual e status.
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[12px] text-muted-foreground">
            Cada projeto fica salvo na sua conta com seu próprio contexto, jornada, etapa e progresso.
          </div>

          {loading && (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[12px] text-muted-foreground">
              Carregando seus apps…
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[12px] text-rose-200">
              {error}
            </div>
          )}

          {hasLocalProjectsToImport && (
            <div className="rounded-lg border border-accent/30 bg-accent/[0.06] p-3 text-[12px] text-foreground/90 space-y-2">
              <p>Encontramos apps salvos neste navegador. Deseja salvar esses apps na sua conta?</p>
              <button
                onClick={async () => {
                  const n = await importLocalProjects();
                  if (n > 0) toast.success(`${n} app(s) salvos na sua conta.`);
                }}
                className="px-3 py-1.5 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-xs"
              >
                Salvar na minha conta
              </button>
            </div>
          )}

          {creating && (
            <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4 space-y-3">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-foreground/90">Nome do app</span>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Ex.: Agenda Terapêutica"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <p className="text-[11px] text-muted-foreground">
                Depois de criar, abrimos o "Contexto do projeto em foco" para você
                preencher os outros campos.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setCreating(false);
                    setNewName("");
                  }}
                  className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-xs"
                >
                  Cancelar
                </button>
                <button onClick={handleCreate} className="btn-primary text-xs">
                  <Check size={12} /> Criar app
                </button>
              </div>
            </div>
          )}

          {projects.length === 0 && !creating && hasLocalContextToImport && (
            <div className="rounded-xl border border-accent/40 bg-accent/[0.08] p-5 space-y-3">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Contexto salvo encontrado
                </h3>
                <p className="text-[12px] text-muted-foreground mt-1 leading-snug">
                  Encontramos informações do seu app neste navegador. Você pode
                  transformar esse contexto em um app em construção.
                </p>
              </div>
              <button
                onClick={async () => {
                  const created = await createProjectFromLocalContext();
                  if (created) {
                    toast.success(`App "${created.name}" criado a partir do contexto.`);
                  }
                }}
                className="btn-primary text-sm w-full justify-center"
              >
                Criar app com este contexto
              </button>
              <button
                onClick={() => setCreating(true)}
                className="w-full text-[12px] text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Criar app do zero
              </button>
            </div>
          )}

          {projects.length === 0 && !creating && !hasLocalContextToImport && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Você ainda não criou nenhum app. Comece criando seu primeiro
                projeto.
              </p>
              <button
                onClick={() => setCreating(true)}
                className="btn-primary text-sm"
              >
                <Plus size={14} /> Criar meu primeiro app
              </button>
            </div>
          )}

          {projects.length > 0 && !creating && (
            <button
              onClick={() => setCreating(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-sm font-semibold"
            >
              <Plus size={14} /> Novo app
            </button>
          )}

          {projects.length > 0 && (
            <ul className="space-y-2">
              {projects.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <li
                    key={p.id}
                    className={`rounded-xl border p-3 ${
                      isActive
                        ? "border-accent/50 bg-accent/[0.08]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {p.name}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/40">
                              ativo
                            </span>
                          )}
                          <select
                            value={p.status}
                            onChange={(e) =>
                              updateProject(p.id, {
                                status: e.target.value as AppProjectStatus,
                              })
                            }
                            className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5"
                          >
                            {APP_PROJECT_STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-background">
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Módulo atual: {p.currentModuleId ?? "—"} · Última
                          edição: {fmtDate(p.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mt-3">
                      {!isActive && (
                        <button
                          onClick={() => {
                            selectProject(p.id);
                            toast.success(`App ativo: ${p.name}`);
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-[11px] inline-flex items-center gap-1"
                        >
                          <Check size={11} /> Selecionar
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!isActive) selectProject(p.id);
                          closeDrawer();
                          openEditor();
                        }}
                        className="px-2.5 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-[11px] inline-flex items-center gap-1"
                      >
                        <Pencil size={11} /> Editar
                      </button>
                      <button
                        onClick={async () => {
                          const copy = await duplicateProject(p.id);
                          if (copy) toast.success(`Duplicado: ${copy.name}`);
                        }}
                        className="px-2.5 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-[11px] inline-flex items-center gap-1"
                      >
                        <Copy size={11} /> Duplicar
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Excluir o app "${p.name}"? Esta ação não pode ser desfeita.`,
                            )
                          ) {
                            deleteProject(p.id);
                            toast("App excluído.");
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-md border border-rose-500/30 text-rose-200 hover:bg-rose-500/10 text-[11px] inline-flex items-center gap-1 ml-auto"
                      >
                        <Trash2 size={11} /> Excluir
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[11px] text-muted-foreground flex items-start gap-2">
            <Settings2 size={12} className="mt-0.5 shrink-0" />
            <span>
              Para alterar público, problema, promessa, checkout e outros
              dados do projeto em foco, abra o Contexto do projeto em foco.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
