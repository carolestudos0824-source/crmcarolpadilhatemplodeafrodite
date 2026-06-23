import { useEffect, useState, useCallback } from "react";
import { X, Bookmark, Copy, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

type Props = {
  open: boolean;
  onClose: () => void;
};

type SavedPrompt = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  source_module: string | null;
  created_at: string;
};

type Status = "idle" | "loading" | "ready" | "error";

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const today = new Date();
    const sameDay =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    if (sameDay) return "Salvo hoje";
    return `Salvo em ${new Intl.DateTimeFormat("pt-BR").format(d)}`;
  } catch {
    return "Salvo recentemente";
  }
};

const deriveTitle = (p: SavedPrompt) => {
  if (p.title && p.title.trim()) return p.title.trim();
  const snippet = p.content.trim().replace(/\s+/g, " ").slice(0, 60);
  return snippet.length === 60 ? `${snippet}…` : snippet || "Prompt sem título";
};

export const SavedPromptsDrawer = ({ open, onClose }: Props) => {
  const auth = useAuthState();
  const userId = auth.status === "authed" ? auth.userId : null;

  const [status, setStatus] = useState<Status>("idle");
  const [items, setItems] = useState<SavedPrompt[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPrompts = useCallback(
    async (signal: { cancelled: boolean }) => {
      if (!userId) return;
      setStatus("loading");
      const { data, error } = await supabase
        .from("saved_prompts")
        .select("id, user_id, title, content, source_module, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (signal.cancelled) return;
      if (error) {
        setStatus("error");
        setItems([]);
        return;
      }
      setItems((data ?? []) as SavedPrompt[]);
      setStatus("ready");
    },
    [userId],
  );

  useEffect(() => {
    if (!open) return;
    if (!userId) {
      setStatus("idle");
      setItems([]);
      return;
    }
    const signal = { cancelled: false };
    void fetchPrompts(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [open, userId, fetchPrompts]);

  useEffect(() => {
    if (!open) {
      setConfirmingId(null);
      setDeletingId(null);
    }
  }, [open]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Prompt copiado.");
    } catch {
      toast.error("Não foi possível copiar o prompt.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmingId || !userId) return;
    const id = confirmingId;
    setDeletingId(id);
    const { error } = await supabase
      .from("saved_prompts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    setDeletingId(null);
    if (error) {
      toast.error("Não foi possível excluir o prompt. Tente novamente.");
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
    setConfirmingId(null);
    toast.success("Prompt excluído.");
  };

  const handleRetry = () => {
    const signal = { cancelled: false };
    void fetchPrompts(signal);
  };

  if (!open) return null;

  const confirmingPrompt = confirmingId
    ? items.find((p) => p.id === confirmingId) ?? null
    : null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Prompts salvos"
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#0B1020] border-l border-white/10 shadow-2xl flex flex-col"
      >
        <header className="flex items-start justify-between gap-3 p-4 border-b border-white/10">
          <div className="flex items-start gap-2">
            <Bookmark size={18} className="text-accent mt-0.5 shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-foreground">Prompts salvos</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                Guarde aqui os prompts importantes que você quer reutilizar durante a construção do seu app.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!userId && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <Bookmark size={28} className="mx-auto text-accent/70 mb-3" />
              <div className="text-sm font-medium text-foreground">
                Entre na sua conta para ver seus prompts salvos.
              </div>
            </div>
          )}

          {userId && status === "loading" && (
            <div className="text-xs text-muted-foreground text-center py-6">
              Carregando prompts salvos…
            </div>
          )}

          {userId && status === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-center">
              <AlertTriangle size={24} className="mx-auto text-red-400 mb-3" />
              <div className="text-sm font-medium text-foreground">
                Não foi possível carregar seus prompts salvos.
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique sua conexão e tente novamente.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-xs font-medium text-foreground"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {userId && status === "ready" && items.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
              <Bookmark size={28} className="mx-auto text-accent/70 mb-3" />
              <div className="text-sm font-medium text-foreground">
                Você ainda não salvou nenhum prompt.
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-snug">
                Quando estiver usando os comandos, poderá salvar aqui os prompts que quiser reutilizar.
              </p>
            </div>
          )}

          {userId && status === "ready" &&
            items.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <header className="mb-2">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {deriveTitle(p)}
                  </h3>
                  <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                    <span>{formatDate(p.created_at)}</span>
                    {p.source_module && (
                      <>
                        <span aria-hidden>•</span>
                        <span>Módulo: {p.source_module}</span>
                      </>
                    )}
                  </div>
                </header>
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-auto rounded-md bg-black/30 p-3 border border-white/5">
{p.content}
                </pre>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(p.content)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-foreground"
                  >
                    <Copy size={13} />
                    Copiar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(p.id)}
                    disabled={deletingId === p.id}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={13} />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
        </div>

        <footer className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5 text-sm font-medium text-foreground"
          >
            Fechar
          </button>
        </footer>
      </aside>

      {confirmingPrompt && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Excluir prompt salvo"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1020] p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-foreground">
              Excluir prompt salvo?
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-snug">
              Essa ação remove este prompt da sua lista. Você não poderá recuperá-lo depois.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingId(null)}
                disabled={deletingId === confirmingPrompt.id}
                className="px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 text-sm text-foreground disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingId === confirmingPrompt.id}
                className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === confirmingPrompt.id ? "Excluindo…" : "Excluir prompt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
