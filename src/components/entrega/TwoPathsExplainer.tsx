import { Code2, Bot } from "lucide-react";

/**
 * Bloco premium que explica os dois caminhos de construção:
 * 1) usar prompts direto no Lovable
 * 2) revisar com o Agente Arquiteto antes
 *
 * Apenas UI explicativa. Não altera comandos, contagem, progresso, módulos.
 */
export const TwoPathsExplainer = () => {
  return (
    <section
      aria-label="Escolha como quer construir"
      className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/[0.07] via-white/[0.02] to-primary/[0.05] p-4 md:p-5"
    >
      <div className="mb-3">
        <h2 className="font-heading font-bold text-base md:text-lg">
          Escolha como quer construir
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Você pode usar os comandos de duas formas: copiar direto para o Lovable
          ou conversar com o Agente Arquiteto antes para alinhar melhor o prompt.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3 flex items-start gap-2.5">
          <Code2 size={16} className="text-accent shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Caminho direto no Lovable
            </h3>
            <p className="text-[12px] text-muted-foreground leading-snug mt-1">
              Use quando você já sabe o que quer aplicar. Copie o prompt completo
              e cole no projeto do seu app no Lovable.
            </p>
            <span className="inline-block mt-2 text-[11px] px-2 py-1 rounded-md border border-accent/40 bg-accent/10 text-accent">
              Copiar para o Lovable
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3 flex items-start gap-2.5">
          <Bot size={16} className="text-amber-300 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Caminho com Agente Arquiteto
            </h3>
            <p className="text-[12px] text-muted-foreground leading-snug mt-1">
              Use quando quiser pensar melhor, adaptar o prompt ao seu app ou
              revisar antes de enviar ao Lovable.
            </p>
            <span className="inline-block mt-2 text-[11px] px-2 py-1 rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-200">
              Revisar com o Agente Arquiteto
            </span>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/80 mt-3">
        O iniciante pode alternar entre Agente e Lovable quantas vezes precisar. O Programa organiza a jornada e mostra quando avançar.
      </p>
    </section>
  );
};
