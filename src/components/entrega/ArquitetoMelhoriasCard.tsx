import { Ruler, Settings } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";


export const ARQUITETO_MELHORIAS_PROMPT = `Atue como Arquiteto de Melhorias do programa.

O programa já está pronto. Toda melhoria nova precisa ser encaixada com critério, sem inflar o produto. A prioridade é clareza, valor percebido, velocidade de uso e aumento de conversão.

Sempre que eu enviar uma melhoria, print, prompt, ideia, módulo, framework, checklist ou sugestão, analise como arquiteto de produto. Não trate como conteúdo solto.

Para cada melhoria, entregue obrigatoriamente:

1. Veredito estratégico
Diga se a melhoria vale entrar, se deve ser cortada, se deve virar bônus, se deve virar módulo, submódulo, ferramenta interna ou regra global.

2. Local correto dentro do programa
Defina exatamente em qual área, módulo, etapa ou tela essa melhoria entra.

3. Tipo de recurso
Classifique como:
- módulo principal
- submódulo
- prompt interno
- template
- checklist
- ferramenta premium
- bônus
- regra global
- melhoria de UX
- melhoria de monetização

4. Problema que resolve
Explique qual dor do usuário essa melhoria resolve.

5. Público impactado
Diga para qual tipo de usuário essa melhoria serve.

6. Fluxo de uso
Mostre como o usuário acessa e usa essa melhoria em até 5 etapas.

7. Interface
Defina se precisa de nova tela, novo card, novo botão, novo formulário ou apenas alteração em uma tela existente.

8. Dados necessários
Liste quais informações o usuário precisa preencher para essa melhoria funcionar.

9. Output gerado
Explique exatamente o que o usuário recebe ao final.

10. Monetização
Defina se deve ser gratuito, premium, vitalício, bônus de lançamento ou gatilho de upgrade.

11. Impacto técnico
Diga se precisa mudar banco de dados, autenticação, permissões, API, prompts de IA ou apenas conteúdo.

12. Risco
Aponte se essa melhoria pode deixar o programa confuso, inchado ou difícil de usar.

13. Decisão final
Diga exatamente uma das opções:
- adicionar agora
- adicionar depois
- transformar em bônus
- juntar com módulo existente
- cortar

Regra invioável: nunca recomende adicionar algo sem encaixar em local, tipo, fluxo, output e motivo comercial. Se faltar qualquer um, recuse e peça os dados.`;

export const ARQUITETO_MELHORIAS_META = {
  title: "Arquiteto de Melhorias",
  slug: "arquiteto-de-melhorias",
  category: "Sistema / Produto",
  description:
    "Analisa melhorias futuras e decide onde encaixar cada uma dentro do programa.",
  is_premium: false,
  is_internal: true,
  status: "active" as const,
};

export function ArquitetoMelhoriasCard() {
  return (
    <GlassCard className="mt-4 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-2 shrink-0">
          <Ruler size={18} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">
              Arquiteto de Melhorias
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-foreground/80">
              <Settings size={10} /> Interno
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Sistema / Produto
            </span>
          </div>
          <p className="text-sm text-foreground/80 mb-4">
            Use para analisar melhorias futuras, prints, ideias, frameworks ou
            módulos e decidir onde encaixar cada item dentro do programa — sem
            inflar a experiência.
          </p>
          <EditablePromptBox
            originalPrompt={ARQUITETO_MELHORIAS_PROMPT}
            storageKey="arquiteto_melhorias_prompt"
            copyLabel="Copiar prompt do Arquiteto de Melhorias"
            helperText="Cole no chat da IA para analisar qualquer nova ideia."
          />
        </div>
      </div>
    </GlassCard>
  );
}

