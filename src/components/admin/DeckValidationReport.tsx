import { useState } from "react";
import { CheckCircle2, AlertCircle, ChevronDown, Shield } from "lucide-react";
import { validateDeck, DECK_REGISTRY } from "@/data/deck-registry";

/**
 * Relatório oficial de validação do Deck dos 22 Arcanos Maiores.
 * Cruza nome, numeral, imagem e símbolos contra o registro canônico.
 */
export function DeckValidationReport() {
  const [open, setOpen] = useState(true);
  const rows = validateDeck();

  const approved = rows.filter((r) => r.status === "aprovado").length;
  const toFix = rows.length - approved;
  const placeholders = DECK_REGISTRY.filter((e) => e.assetStatus === "placeholder").length;

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-3 hover:bg-card/70 transition-colors"
      >
        <Shield className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-sm font-medium text-foreground">Deck Oficial — Relatório de Validação</h3>
          <p className="text-[11px] text-muted-foreground">
            {approved}/22 aprovados · {toFix} a corrigir · {placeholders} aguardando arte RWS
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border/50">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/30">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Nome</div>
            <div className="col-span-1 text-center">Num.</div>
            <div className="col-span-2 text-center">Imagem</div>
            <div className="col-span-2 text-center">Símbolos</div>
            <div className="col-span-1 text-center">Match</div>
            <div className="col-span-2 text-right pr-2">Status</div>
          </div>

          <div className="divide-y divide-border/30">
            {rows.map((r) => (
              <div key={r.number} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs items-center hover:bg-card/40">
                <div className="col-span-1 text-muted-foreground">{r.number}</div>
                <div className="col-span-3 font-medium text-foreground truncate">{r.name}</div>
                <div className="col-span-1 text-center font-heading text-primary">{r.numeral}</div>
                <div className="col-span-2 text-center">
                  <Cell ok={r.imageValidated} />
                </div>
                <div className="col-span-2 text-center">
                  <Cell ok={r.symbolsValidated} />
                </div>
                <div className="col-span-1 text-center">
                  <Cell ok={r.cardLessonMatch} />
                </div>
                <div className="col-span-2 text-right">
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      r.status === "aprovado"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.notes.length > 0 && (
                  <div className="col-span-12 pl-6 text-[10px] text-muted-foreground/80">
                    {r.notes.map((n, i) => (
                      <div key={i}>· {n}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-3 py-2 text-[10px] text-muted-foreground bg-muted/20 border-t border-border/30">
            Numeração e fonte de imagem são travadas pelo registro canônico em <code>src/data/deck-registry.ts</code>.
            Nenhuma tela pode usar imagem ou numeral diferente do registry.
          </div>
        </div>
      )}
    </div>
  );
}

const Cell = ({ ok }: { ok: boolean }) =>
  ok ? (
    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
  ) : (
    <AlertCircle className="w-3.5 h-3.5 text-amber-500 inline" />
  );
