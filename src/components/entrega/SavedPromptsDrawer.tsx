import { X, Bookmark } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SavedPromptsDrawer = ({ open, onClose }: Props) => {
  if (!open) return null;

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

        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <Bookmark size={28} className="mx-auto text-accent/70 mb-3" />
            <div className="text-sm font-medium text-foreground">
              Você ainda não salvou nenhum prompt.
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-snug">
              Em breve, você poderá guardar aqui os prompts mais importantes para reutilizar durante a construção do seu app.
            </p>
          </div>
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
    </>
  );
};
