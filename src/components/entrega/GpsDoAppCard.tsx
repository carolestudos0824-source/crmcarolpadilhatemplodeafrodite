import { Compass, Crown } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";


const GPS_PROMPT = `AUDITORIA READ-ONLY — NÃO ALTERE NADA

Este prompt é apenas para diagnóstico. Não implemente, não edite arquivos, não crie componentes, não altere banco, não altere rotas, não altere layout, não altere checkout, não altere autenticação e não mexa em permissões. Apenas analise o projeto atual e responda onde estou, o que falta, quais são os bloqueadores e qual é a única próxima ação obrigatória.

Atue como GPS de Construção de App.


Objetivo:
Me ajudar a saber exatamente em que etapa estou na construção deste aplicativo, o que já foi feito, o que falta fazer, o que bloqueia publicação, domínio, venda e escala, e proteger o projeto contra perda de conteúdo ou regressão.

Etapas padrão de um app:
1. Ideia validada
2. MVP definido
3. Telas principais criadas
4. Banco de dados configurado
5. Login e permissões funcionando
6. Ação principal funcionando
7. Design responsivo ajustado
8. Painel administrativo pronto
9. Segurança validada
10. Pagamento configurado, se necessário
11. Deploy feito
12. Domínio conectado
13. Página de venda criada
14. Métricas instaladas
15. Pronto para tráfego
16. Primeiros usuários reais
17. Ajustes por feedback
18. Escala

Para cada interação comigo, responda nesta ordem:

1. Onde estou agora?
- Etapa atual.
- Resumo do que já foi concluído.
- O que falta concluir nesta etapa.
- O que bloqueia publicação, domínio ou venda.
- Próximo passo obrigatório (apenas UM).
- O que eu NÃO devo mexer agora para não perder foco.

2. Posso avançar?
- Se sim, qual a próxima etapa.
- Se não, liste apenas os itens bloqueadores. Não adicione ideias novas.

3. Checkpoint antes de mudar algo importante:
Antes de qualquer alteração relevante, registre:
- Nome da alteração.
- Área impactada.
- Estado atual.
- O que NÃO pode ser removido.
- Risco da alteração.
- Como validar depois que nada quebrou.

4. Auditoria de segurança (quando eu pedir):
- O que está correto.
- O que está vulnerável.
- O que bloqueia publicação.
- Próxima ação obrigatória.
- Checklist de correção.

5. Auditoria visual (quando eu pedir):
- O que está bom.
- O que prejudica confiança.
- O que precisa corrigir antes de vender.
- Próxima ação obrigatória.

6. Auditoria do admin (quando eu pedir):
- Dados visíveis ao admin.
- Ações disponíveis.
- Gestão de usuários.
- Gestão de conteúdo.
- Permissões.
- O que falta antes da venda.

7. Pronto para domínio? (quando eu pedir)
- Pronto ou não pronto.
- Bloqueadores.
- Próxima ação.

8. Pronto para tráfego? (quando eu pedir)
- Pronto ou não pronto.
- Bloqueadores.
- Próxima ação para vender.

Regras invioláveis:
- Nunca sugira melhorias fora da etapa atual.
- Nunca devolva lista infinita de tarefas.
- Sempre destaque UMA única próxima ação obrigatória.
- Seja direto, mobile first, pouco texto por vez.
- Eu sempre devo saber: onde estou, o que falta, o que fazer agora, o que não mexer.

Dados do meu app (preencha antes de me responder a primeira vez):
- Nome do app:
- O que ele faz em 1 frase:
- Etapa em que acho que estou:
- Última coisa que fiz:
- O que está me travando:`;

type GpsDoAppCardProps = {
  defaultCollapsed?: boolean;
  descriptionOverride?: string;
};

const GPS_DEFAULT_DESCRIPTION =
  "Veja em que ponto seu app está, o que já foi feito e qual é a próxima ação para chegar até a publicação com menos retrabalho.";

export function GpsDoAppCard({
  defaultCollapsed = false,
  descriptionOverride,
}: GpsDoAppCardProps = {}) {
  return (
    <GlassCard className="mt-6 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-2 shrink-0">
          <Compass size={18} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">GPS do App</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-200">
              Diagnóstico da sua jornada
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">
              <Crown size={10} /> Estratégico
            </span>
          </div>
          <p className="text-sm text-foreground/80 mb-4">
            {descriptionOverride ?? GPS_DEFAULT_DESCRIPTION}
          </p>
          <EditablePromptBox
            collapsible={defaultCollapsed}
            saveSourceModule="gps-do-app"
            originalPrompt={GPS_PROMPT}
            storageKey="gps_do_app_prompt"
            copyLabel="Copiar diagnóstico do app"
            helperText="Cole no Lovable, Cursor ou Claude Code dentro do projeto do aplicativo."
          />
        </div>
      </div>
    </GlassCard>
  );
}

