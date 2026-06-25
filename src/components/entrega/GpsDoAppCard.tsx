import { Compass, Crown } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import type { ModuleId } from "@/data/entregaModules";

// ---------- Escopo contextual por módulo ----------

const MODULE_SCOPES: Partial<Record<ModuleId, string>> = {
  seo: "Neste módulo SEO e GEO, analise apenas: SEO técnico, títulos e descrições, metadados, Open Graph, canonical, sitemap, robots, estrutura de páginas públicas, conteúdo pesquisável, indexação, GEO/AI search, clareza para mecanismos de busca, bloqueadores antes de tráfego orgânico e próxima ação única para melhorar SEO/GEO.",
  checkout:
    "Neste módulo Checkout e entrega, analise apenas: link/gateway de pagamento, confirmação de pagamento, página de obrigado, liberação de acesso, área protegida, entrega do produto, e-mail ou instrução pós-compra, riscos de fluxo quebrado, riscos de promessa não cumprida e próxima ação única para validar checkout e entrega.",
  publicar:
    "Neste módulo Publicar e Domínio, analise apenas: deploy, ambiente publicado, domínio, DNS, redirects, links públicos, favicon, Open Graph, robots/sitemap quando aplicável, teste em aba anônima, validação pós-publicação, riscos de página fora do ar e próxima ação única para publicar ou conectar domínio.",
  seguranca:
    "Neste módulo Segurança do App, analise apenas: rotas públicas e privadas, autenticação, permissões, RLS, policies, RPCs, dados sensíveis, isolamento por usuário, área paga, admin, chaves expostas, riscos de burlar acesso e próxima ação única para reduzir risco antes de publicar.",
  login:
    "Neste módulo Login e Banco, analise apenas: cadastro, login, logout, recuperação de acesso, redirecionamentos, tabelas principais, user_id, dados por usuário, permissões básicas, RLS quando aplicável, perfil do usuário, persistência e próxima ação única para estabilizar login e dados.",
  venda:
    "Neste módulo Página de venda, analise apenas: promessa, público, dor, oferta, benefícios, prova, objeções, CTA, preço exibido, confiança, clareza da entrega, riscos de promessa exagerada, riscos de conversão e próxima ação única para melhorar a página antes de tráfego.",
  metricas:
    "Neste módulo Métricas do App, analise apenas: eventos essenciais, funil, conversão, ativação, retenção, uso da ação principal, origem de tráfego, métricas mínimas antes de campanha, privacidade dos dados, riscos de medir demais e próxima ação única para instalar ou validar métricas.",
};


const DEFAULT_SCOPE =
  "Analise o estado deste módulo, o que já parece concluído, o que falta concluir neste módulo, o que bloqueia avanço e qual é a próxima ação única dentro deste módulo.";

const MODULE_OBJECTIVES: Partial<Record<ModuleId, string>> = {
  seo: "Tornar o app encontrável em buscadores e em mecanismos de IA (GEO) antes de investir em tráfego.",
  construir: "Construir as funcionalidades principais do app no Lovable, sem quebrar o que já existe.",
  checkout: "Configurar e validar o fluxo de checkout e a liberação de acesso após compra.",
  publicar: "Publicar o app em domínio próprio com metadados e abertura correta em todos os dispositivos.",
  login: "Configurar login, banco e permissões de forma segura.",
  seguranca: "Validar segurança do app antes de abrir para usuários reais.",
  teste: "Fazer o teste final ponta a ponta antes de publicar.",
  venda: "Construir a página de venda do app com clareza e sem promessa exagerada.",
  monetizacao: "Definir o plano de monetização do app.",
  legal: "Revisar termos, privacidade e confiança antes de vender.",
  metricas: "Instalar e validar métricas básicas do app.",
  campanhas: "Planejar campanhas iniciais sem promessa de resultado garantido.",
  criativos: "Gerar criativos coerentes com a promessa do app.",
  validacao: "Validar o app com usuários reais antes de escalar.",
  melhorias: "Decidir o que entra na próxima versão sem quebrar o que já funciona.",
  checklist: "Conferir o painel de prontidão antes de ativar o acesso.",
  ativar: "Liberar acesso à área paga sem expor dados ou quebrar permissões.",
  comece: "Orientar o usuário a escolher o caminho correto e entender como usar a Fábrica antes de avançar.",
  ideias: "Ajudar o usuário a escolher ou adaptar uma ideia de app simples, viável e adequada ao MVP.",
  planejar: "Definir estratégia, público, problema, promessa, ação principal e escopo antes de construir.",
  mvp: "Transformar a ideia em um MVP enxuto com no máximo 5 funcionalidades essenciais.",
  telas: "Mapear telas, fluxo de navegação e ações principais antes de implementar no Lovable.",
  erros: "Diagnosticar erros comuns, entender a causa provável e orientar correção cirúrgica sem quebrar o app.",
};


const RESOLVED_TITLE_FALLBACK = "Módulo atual";

const buildGpsPrompt = (params: {
  moduleId?: ModuleId;
  moduleTitle?: string;
  moduleObjective?: string;
}): string => {
  const { moduleId, moduleTitle, moduleObjective } = params;
  const scope = (moduleId && MODULE_SCOPES[moduleId]) ?? DEFAULT_SCOPE;
  const objective =
    moduleObjective?.trim() ||
    (moduleId ? MODULE_OBJECTIVES[moduleId] : undefined) ||
    "[não informado]";
  const title = moduleTitle?.trim() || RESOLVED_TITLE_FALLBACK;

  return `AUDITORIA READ-ONLY — NÃO ALTERE CÓDIGO, NÃO EDITE ARQUIVOS, NÃO CRIE TABELAS E NÃO MUDE CONFIGURAÇÕES.

Este prompt é apenas para diagnóstico. Não implemente, não edite arquivos, não crie componentes, não altere banco, não altere rotas, não altere layout, não altere checkout, não altere autenticação e não mexa em permissões. Apenas analise o projeto atual e responda onde estou, o que falta, quais são os bloqueadores e qual é a única próxima ação obrigatória.

Foco atual do diagnóstico:
- Módulo atual: ${title}
- Objetivo do módulo: ${objective}
- Escopo da análise: ${scope}
- A próxima ação obrigatória deve ficar limitada a este módulo.

Atue como GPS de Construção de App, dentro do foco atual acima.

Objetivo geral:
Me ajudar a saber exatamente em que ponto estou dentro deste módulo, o que já foi feito neste módulo, o que falta concluir aqui, o que bloqueia o avanço deste módulo e proteger o projeto contra perda de conteúdo ou regressão.

Para cada interação comigo, responda nesta ordem, sempre dentro do foco atual:

1. Onde estou agora neste módulo?
- Resumo do que já parece concluído neste módulo.
- O que falta concluir neste módulo.
- O que bloqueia o avanço deste módulo.
- Próximo passo obrigatório (apenas UM), dentro deste módulo.
- O que eu NÃO devo mexer agora para não perder foco.

2. Posso avançar para o próximo módulo?
- Se sim, qual seria.
- Se não, liste apenas os bloqueadores deste módulo. Não adicione ideias novas.

3. Checkpoint antes de mudar algo importante:
- Nome da alteração.
- Área impactada.
- Estado atual.
- O que NÃO pode ser removido.
- Risco da alteração.
- Como validar depois que nada quebrou.

Regras invioláveis:
- Nunca sugira melhorias fora do módulo atual.
- Nunca devolva lista infinita de tarefas.
- Sempre destaque UMA única próxima ação obrigatória.
- Seja direto, mobile first, pouco texto por vez.
- Eu sempre devo saber: onde estou neste módulo, o que falta aqui, o que fazer agora, o que não mexer.

Contexto secundário — etapas padrão de um app (use apenas para se situar, não para responder fora do foco):
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

Dados do meu app (preencha antes de me responder a primeira vez):
- Nome do app:
- O que ele faz em 1 frase:
- Última coisa que fiz dentro do módulo "${title}":
- O que está me travando neste módulo:`;
};

type GpsDoAppCardProps = {
  defaultCollapsed?: boolean;
  descriptionOverride?: string;
  moduleId?: ModuleId;
  moduleTitle?: string;
  moduleObjective?: string;
};

const GPS_DEFAULT_DESCRIPTION =
  "Veja em que ponto seu app está, o que já foi feito e qual é a próxima ação para chegar até a publicação com menos retrabalho.";

export function GpsDoAppCard({
  defaultCollapsed = false,
  descriptionOverride,
  moduleId,
  moduleTitle,
  moduleObjective,
}: GpsDoAppCardProps = {}) {
  const prompt = buildGpsPrompt({ moduleId, moduleTitle, moduleObjective });
  const storageKey = moduleId
    ? `gps_do_app_prompt__${moduleId}`
    : "gps_do_app_prompt";
  const resolvedTitle = moduleTitle?.trim() || RESOLVED_TITLE_FALLBACK;
  const expectedSignature = `Módulo atual: ${resolvedTitle}`;

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
            key={storageKey}
            collapsible={defaultCollapsed}
            saveSourceModule="gps-do-app"
            originalPrompt={prompt}
            storageKey={storageKey}
            expectedSignature={expectedSignature}
            copyLabel="Copiar diagnóstico do app"
            helperText="Cole no Lovable apenas para diagnóstico. O Lovable deve analisar e não implementar nada."
          />

        </div>
      </div>
    </GlassCard>
  );
}
