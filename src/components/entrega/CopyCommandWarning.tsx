import { AlertTriangle, Bot } from "lucide-react";

/**
 * Preâmbulo padrão acrescentado a todo comando que o aluno copia para colar
 * no projeto do APP DELE no Lovable. Evita que o Lovable interprete o texto
 * como pedido para alterar a própria Fábrica de Apps.
 *
 * Esta string NÃO conta como comando novo. Não entra em nenhum array
 * COMMANDS_* e não afeta TOTAL_COMMANDS / commandsDone / progresso global.
 */
export const LOVABLE_PREAMBLE =
  "Você está no projeto do aplicativo que estou criando. Execute a tarefa abaixo neste app. Não explique o comando. Não responda dizendo que este texto é conteúdo de um módulo ou programa. Aplique a orientação no app atual.";

/** Monta o texto final que o aluno copia para o Lovable do APP DELE. */
export const wrapLovable = (task: string): string =>
  `${LOVABLE_PREAMBLE}\n\nTarefa:\n${(task ?? "").trim()}`;

type Variant = "lovable" | "agent";

/**
 * Aviso visual exibido antes da lista de comandos copiáveis em cada módulo.
 * Apenas UI. Não altera contagem, prefixos, checklist ou progresso.
 */
export const CopyCommandWarning = ({
  variant = "lovable",
}: {
  variant?: Variant;
}) => {
  if (variant === "agent") {
    return (
      <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 flex items-start gap-3">
        <Bot size={18} className="text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-200">
            Importante: estes comandos são para o Agente Arquiteto
          </p>
          <p className="text-xs text-amber-100/80 leading-relaxed">
            Estes comandos são para você colar no chat do Agente Arquiteto e
            pensar sua estratégia. Não cole dentro do Lovable do seu app, e
            não cole dentro da Fábrica de Apps com IA.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-amber-300 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-amber-200">
          Importante: onde colar estes comandos
        </p>
        <p className="text-xs text-amber-100/85 leading-relaxed">
          Estes comandos são para você copiar e colar no projeto do aplicativo
          que está criando no Lovable. Não cole dentro da Fábrica de Apps com
          IA, porque este programa é apenas o guia.
        </p>
        <p className="text-[11px] text-amber-100/60 leading-relaxed">
          Se você colar o comando aqui dentro da Fábrica de Apps, o Lovable
          pode entender que você quer alterar este programa, e não o seu app.
        </p>
      </div>
    </div>
  );
};
