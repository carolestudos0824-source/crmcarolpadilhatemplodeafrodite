import { Sparkles } from "lucide-react";

/**
 * Preâmbulo natural acrescentado a todo comando que a aluna copia para colar
 * no projeto do APP DELA no Lovable. Garante que o Lovable entenda o contexto
 * sem soar técnico ou agressivo.
 *
 * Esta string NÃO conta como comando novo. Não entra em nenhum array
 * COMMANDS_* e não afeta TOTAL_COMMANDS / commandsDone / progresso global.
 */
export const LOVABLE_PREAMBLE =
  "Contexto: estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable. O projeto que deve ser alterado é este app atual que estou criando no Lovable. Não trate a Fábrica de Apps com IA como o app final — ela é apenas o programa-guia.\n\nAplique a tarefa abaixo neste app. Não explique o comando. Faça a alteração solicitada de forma objetiva e preserve o que já está funcionando.";

/** Monta o texto final que a aluna copia para o Lovable do APP DELA. */
export const wrapLovable = (task: string): string =>
  `${LOVABLE_PREAMBLE}\n\nTarefa:\n${(task ?? "").trim()}`;

type Variant = "lovable" | "agent";

/**
 * Orientação elegante exibida antes da lista de comandos copiáveis.
 * Discreta, integrada ao design, sem cara de alerta ou bronca.
 * Apenas UI — não altera contagem, prefixos, checklist ou progresso.
 */
export const CopyCommandWarning = ({
  variant = "lovable",
}: {
  variant?: Variant;
}) => {
  const iconTone = variant === "agent" ? "text-primary" : "text-accent";

  return (
    <div className="mb-5 rounded-xl border border-accent/20 bg-card/40 p-4 flex items-start gap-3 shadow-sm">
      <Sparkles size={16} className={`${iconTone} shrink-0 mt-0.5`} />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground/95">
          Como usar os comandos
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Abra o projeto do seu aplicativo no Lovable, cole o comando da etapa
          e aguarde a aplicação. Depois volte aqui e marque como feito.
        </p>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          Use um comando por vez. Se o resultado não ficar bom, use a aba
          Corrigir erro.
        </p>
      </div>
    </div>
  );
};

/**
 * Bloco "Antes de avançar" — orientação curta e leve, sem alterar progresso
 * ou navegação. Pode ser usado em qualquer módulo com comandos.
 */
export const BeforeAdvanceTip = () => (
  <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 flex items-start gap-3">
    <span className="text-emerald-300 shrink-0 mt-0.5 text-base">→</span>
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground/95">Antes de avançar</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Avance apenas quando esta etapa estiver clara ou funcionando. Se
        estiver confuso, use o Agente Arquiteto. Se o Lovable errou, use a aba
        Corrigir erro.
      </p>
    </div>
  </div>
);
