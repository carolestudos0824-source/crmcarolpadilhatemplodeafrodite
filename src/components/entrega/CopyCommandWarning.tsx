import { Sparkles, ShieldCheck, Bot } from "lucide-react";

/**
 * Preâmbulo natural acrescentado a todo comando que a pessoa copia para colar
 * no projeto do APP DELA no Lovable. Reforça que a Fábrica é apenas o programa-guia
 * e que o Lovable deve preservar o app atual.
 *
 * Esta string NÃO conta como comando novo. Não entra em nenhum array
 * COMMANDS_* e não afeta TOTAL_COMMANDS / commandsDone / progresso global.
 */
export const LOVABLE_PREAMBLE =
  `Contexto: estou usando a Fábrica de Apps com IA APENAS como programa-guia para criar meu próprio aplicativo no Lovable. O projeto que deve ser alterado é este app atual que estou criando no Lovable. Não trate a Fábrica de Apps com IA como o app final, não copie a marca, telas, área de membros ou estrutura dela.

Aplique a tarefa abaixo neste app. Preserve o que já está funcionando, não altere áreas não pedidas e, se algo estiver ambíguo, faça a escolha mais simples possível.

Antes de terminar, responda de forma objetiva:

1. O que entendi: explique em 1 ou 2 frases o pedido recebido.
2. O que alterei: liste apenas o que foi alterado. Se nada foi alterado, diga: "Nada foi alterado.".
3. O que NÃO alterei: confirme áreas protegidas que não foram tocadas (auth, RLS, banco, checkout, permissões, progresso, regras de acesso), quando aplicável.
4. Como validar: diga como o aluno pode testar se funcionou.
5. Próximo passo único: diga apenas UMA próxima ação dentro da etapa atual.

Regra: não sugira melhorias fora da tarefa atual, não invente roadmap novo, não adicione funcionalidades extras e não altere áreas sensíveis sem autorização explícita.`;

/** Monta o texto final que a pessoa copia para o Lovable do APP DELA. */
export const wrapLovable = (task: string): string =>
  `${LOVABLE_PREAMBLE}\n\nTarefa:\n${(task ?? "").trim()}`;

/**
 * Prompt padrão de AUDITORIA para o Lovable.
 * Usado quando o aluno quer entender o impacto de um pedido ANTES de implementar.
 * O Lovable deve apenas analisar — não alterar código, banco, auth, RLS ou deploy.
 */
export const LOVABLE_AUDIT_PROMPT = (pedido = "[COLAR PEDIDO DO ALUNO]"): string =>
  `Analise este pedido para o app que estou criando.

MODO:
Somente auditoria.
Não implemente nada.
Não altere arquivos.
Não edite código.
Não crie componentes.
Não rode migração.
Não mexa em banco, auth, RLS, checkout, permissões ou deploy.

Contexto:
Estou usando a Fábrica de Apps com IA apenas como programa-guia.
O app em análise é o meu app em construção, descrito no contexto do projeto.

Pedido que quero analisar:
${pedido}

Responda com:
1. O que este pedido quer alterar.
2. Quais arquivos ou áreas seriam impactados.
3. Se isso é seguro para o estágio atual do app.
4. Se mexe em banco, auth, RLS, pagamento, permissões ou dados.
5. Riscos de quebrar algo.
6. O que deve ser cortado ou simplificado.
7. Se recomenda implementar agora ou depois.
8. Prompt seguro de implementação, mas apenas se for aprovado depois.

Importante:
Não implemente nada nesta resposta.
Apenas audite.`;

type Variant = "lovable" | "agent";

/**
 * Orientação elegante exibida antes da lista de comandos copiáveis.
 * Reforça o caminho seguro: revisar com o Agente antes de mandar o Lovable alterar.
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
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground/95">
          Como usar os comandos com segurança
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Caminho seguro para iniciante: cole o comando primeiro no{" "}
          <strong className="text-foreground/90">Agente Arquiteto</strong> para
          uma auditoria. Só depois cole no <strong className="text-foreground/90">Lovable</strong> para
          construir.
        </p>
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
          Você não precisa saber programar. O Agente entende e revisa. O Lovable executa.
          Se algo não ficar bom, use a aba Corrigir erro.
        </p>
      </div>
    </div>
  );
};

/**
 * Aviso curto e elegante para colocar perto de qualquer botão "Copiar para o Lovable".
 * Lembra o aluno de revisar com o Agente antes de mandar implementar.
 */
export const SafePathTip = ({ className = "" }: { className?: string }) => (
  <div
    className={`rounded-lg border border-amber-400/25 bg-amber-400/[0.05] p-3 flex items-start gap-2 ${className}`}
  >
    <ShieldCheck size={14} className="text-amber-300 shrink-0 mt-0.5" />
    <div className="space-y-0.5">
      <p className="text-[12px] font-medium text-foreground/95">
        Caminho seguro: peça uma auditoria antes de implementar
      </p>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Se você está inseguro, revise com o Agente antes de mandar o Lovable
        alterar seu app. Use o Lovable para construir apenas depois de revisar
        o comando.
      </p>
    </div>
  </div>
);

/**
 * Selo compacto "Recomendado" para o botão de revisão com o Agente,
 * deixando claro qual é o caminho seguro sem remover o botão do Lovable.
 */
export const RecommendedAgentBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">
    <Bot size={10} /> Recomendado para iniciantes
  </span>
);

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
