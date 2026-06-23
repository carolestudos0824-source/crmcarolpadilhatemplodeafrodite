import { Ruler, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";


export const ARQUITETO_MELHORIAS_PROMPT = `Atue como Arquiteto de Melhorias do meu app.

Objetivo:
Me ajudar a decidir se uma nova ideia, funcionalidade, tela, checklist, automação ou melhoria deve entrar no app que estou criando agora, ficar para depois, virar versão premium ou ser cortada.

O app em análise é o app descrito no contexto do meu projeto. Não analise a Fábrica de Apps com IA. A Fábrica é apenas o programa-guia que estou usando para construir meu app.

Sempre que eu enviar uma ideia, print, prompt, funcionalidade, checklist ou sugestão, analise como arquiteto de produto do meu app. Não trate como conteúdo solto.

Para cada melhoria, entregue obrigatoriamente:

1. Veredito estratégico
Diga se a melhoria vale entrar agora, depois, virar premium, virar bônus, juntar com algo existente ou cortar.

2. Local correto dentro do app
Defina exatamente em qual tela, fluxo, menu, dashboard ou etapa do app essa melhoria entra.

3. Tipo de recurso
Classifique como:
- funcionalidade principal
- melhoria de UX
- automação
- checklist
- template
- recurso premium
- bônus
- ajuste visual
- melhoria de monetização
- melhoria de retenção

4. Problema que resolve
Explique qual dor do usuário final do app essa melhoria resolve.

5. Público impactado
Diga para qual tipo de usuário do app essa melhoria serve.

6. Fluxo de uso
Mostre como o usuário acessa e usa essa melhoria em até 5 etapas.

7. Interface
Defina se precisa de:
- nova tela
- novo card
- novo botão
- novo formulário
- nova tabela
- novo filtro
- alteração em tela existente

8. Dados necessários
Liste quais informações o app precisa coletar ou salvar para essa melhoria funcionar.

9. Output gerado
Explique exatamente o que o usuário recebe ao final.

10. Monetização
Defina se deve ser:
- gratuito
- premium
- limite do plano gratuito
- bônus
- upsell
- recurso pago
- parte do plano principal

11. Impacto técnico
Diga se precisa mudar:
- banco de dados
- autenticação
- permissões
- API
- prompts de IA
- componentes de UI
- apenas texto/design

12. Risco
Aponte se essa melhoria pode deixar o app:
- confuso
- inchado
- difícil de usar
- caro de manter
- difícil de vender

13. Decisão final
Escolha exatamente uma:
- adicionar agora
- adicionar depois
- transformar em premium
- juntar com funcionalidade existente
- cortar

14. Próxima ação obrigatória
Diga apenas uma ação:
- implementar
- simplificar
- pedir mais dados
- validar com usuários
- deixar para próxima versão
- cortar

Regra inviolável:
Nunca recomende adicionar algo sem definir local, tipo, fluxo, output e motivo comercial.
MVP com mais de 5 funcionalidades principais não é MVP.
Se a melhoria não ajudar o usuário a concluir a ação principal do app, ela deve ser cortada ou deixada para depois.`;

export const ARQUITETO_MELHORIAS_META = {
  title: "Arquiteto de Melhorias do App",
  slug: "arquiteto-de-melhorias-do-app",
  category: "Decisão de produto do seu app",
  description:
    "Analise melhorias antes de adicionar ao seu app.",
  is_premium: false,
  is_internal: false,
  status: "active" as const,
};

type ArquitetoMelhoriasCardProps = {
  defaultCollapsed?: boolean;
  descriptionOverride?: string;
};

const ARQUITETO_DEFAULT_DESCRIPTION =
  "Use este prompt para avaliar uma ideia, print, sugestão, funcionalidade, checklist ou melhoria antes de colocar no app que você está criando.";

export function ArquitetoMelhoriasCard({
  defaultCollapsed = false,
  descriptionOverride,
}: ArquitetoMelhoriasCardProps = {}) {
  return (
    <GlassCard className="mt-4 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-2 shrink-0">
          <Ruler size={18} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">
              Arquiteto de Melhorias do App
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              <Sparkles size={10} /> Para o seu app
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Analise melhorias antes de adicionar ao seu app
            </span>
          </div>
          <p className="text-sm text-foreground/80 mb-4">
            {descriptionOverride ?? ARQUITETO_DEFAULT_DESCRIPTION}
          </p>
          <EditablePromptBox
            collapsible={defaultCollapsed}
            saveSourceModule="arquiteto-melhorias"
            originalPrompt={ARQUITETO_MELHORIAS_PROMPT}
            storageKey="arquiteto_melhorias_prompt"
            copyLabel="Analisar melhoria do meu app"
            helperText="Cole no chat da IA do seu projeto para decidir se a melhoria entra agora, depois ou é cortada."
          />
        </div>
      </div>
    </GlassCard>
  );
}
