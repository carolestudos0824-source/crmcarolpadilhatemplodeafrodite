import { useState } from "react";
import { Copy, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import type { AppModel } from "@/data/entregaModules";

export const AppModelCard = ({ model }: { model: AppModel }) => {
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(model.command);
      toast.success("Comando copiado. Agora cole no Lovable.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <>
      <GlassCard className="p-5 space-y-3 flex flex-col h-full">
        <h3 className="font-heading font-semibold text-lg">{model.name}</h3>
        <div className="space-y-2 text-sm flex-1">
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">
              Público
            </span>
            <br />
            {model.audience}
          </p>
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">
              Dor
            </span>
            <br />
            {model.pain}
          </p>
          <p>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">
              Monetização
            </span>
            <br />
            {model.monetization}
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
          >
            <Eye size={14} /> Ver detalhes
          </button>
          <button
            onClick={copy}
            className="flex-1 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Copy size={14} /> Copiar
          </button>
        </div>
      </GlassCard>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-background">
              <h3 className="font-heading font-bold text-xl">{model.name}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Público
                  </div>
                  {model.audience}
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Dor
                  </div>
                  {model.pain}
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Monetização
                  </div>
                  {model.monetization}
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Telas
                  </div>
                  {model.screens.join(", ")}
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-3 sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Banco
                  </div>
                  {model.database.join(", ")}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Comando completo
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 max-h-64 overflow-auto">
                  <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
                    {model.command}
                  </pre>
                </div>
                <button onClick={copy} className="btn-primary mt-3 text-sm">
                  <Copy size={14} /> Copiar comando
                </button>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Checklist de teste
                </div>
                <ul className="space-y-1.5 text-sm">
                  {model.checklist.map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
