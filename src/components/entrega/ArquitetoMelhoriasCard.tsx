import { Ruler, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import type { ModuleId } from "@/data/entregaModules";
import { JOURNEY_LABELS, JOURNEY_ARQUITETO_HINTS, type JourneyId } from "@/lib/journey";

// ---------- Escopo contextual por módulo (foco de decisão de melhoria) ----------

const MODULE_SCOPES: Partial<Record<ModuleId, string>> = {
  seo: "Analisar melhorias ligadas a SEO técnico, GEO/AI search, metadados, Open Graph, canonical, sitemap, robots, conteúdo pesquisável, indexação, clareza para mecanismos de busca e tráfego orgânico. Ignorar melhorias fora desse escopo.",
  checkout:
    "Analisar melhorias ligadas a pagamento, gateway, confirmação de pagamento, página de obrigado, liberação de acesso, entrega do produto, e-mail/instrução pós-compra e redução de falha no fluxo de compra. Ignorar melhorias fora desse escopo.",
  publicar:
    "Analisar melhorias ligadas a deploy, domínio, DNS, redirects, ambiente publicado, links públicos, favicon, Open Graph, validação pós-publicação e confiabilidade da publicação. Ignorar melhorias fora desse escopo.",
  seguranca:
    "Analisar melhorias ligadas a RLS, policies, permissões, rotas públicas/privadas, autenticação, dados sensíveis, isolamento por usuário, admin, área paga, chaves expostas e risco de burlar acesso. Ignorar melhorias fora desse escopo.",
  login:
    "Analisar melhorias ligadas a cadastro, login, logout, recuperação de acesso, redirecionamentos, tabelas principais, user_id, dados por usuário e permissões básicas. Ignorar melhorias fora desse escopo.",
  venda:
    "Analisar melhorias ligadas a promessa, público, dor, oferta, benefícios, prova, objeções, CTA, preço exibido, confiança e clareza comercial. Ignorar melhorias fora desse escopo.",
  metricas:
    "Analisar melhorias ligadas a eventos essenciais, funil, conversão, ativação, retenção, uso da ação principal, origem de tráfego e dados mínimos para decisão. Ignorar melhorias fora desse escopo.",
  construir:
    "Analisar melhorias ligadas à construção da primeira versão do app no Lovable: funcionalidades essenciais, ação principal, telas básicas e estabilidade. Ignorar SEO, checkout, tráfego e marketing nesta etapa.",
  teste: "Analisar melhorias ligadas ao teste final ponta a ponta antes de publicar, checklist de prontidão e bloqueadores de release.",
  monetizacao: "Analisar melhorias ligadas ao plano de monetização do app, preço, limites do plano gratuito e upsell.",
  legal: "Analisar melhorias ligadas a termos de uso, política de privacidade, páginas de confiança e dados de empresa/responsável.",
  campanhas: "Analisar melhorias ligadas a campanhas iniciais, canais, segmentação e mensagens — sem prometer resultado garantido.",
  criativos: "Analisar melhorias ligadas a criativos coerentes com a promessa do app e clareza visual.",
  validacao: "Analisar melhorias ligadas à validação do app com usuários reais antes de escalar.",
  melhorias: "Analisar melhorias ligadas à próxima versão do app sem quebrar o que já funciona.",
  checklist: "Analisar melhorias ligadas ao painel de prontidão antes de ativar o acesso.",
  ativar: "Analisar melhorias ligadas à liberação de acesso à área paga sem expor dados ou quebrar permissões.",
  comece: "Analisar melhorias ligadas a orientar o usuário a escolher o caminho correto antes de avançar.",
  ideias: "Analisar melhorias ligadas a escolha ou adaptação de ideia de app simples e viável.",
  planejar: "Analisar melhorias ligadas a estratégia, público, problema, promessa, ação principal e escopo antes de construir.",
  mvp: "Analisar melhorias ligadas ao MVP enxuto com no máximo 5 funcionalidades essenciais.",
  telas: "Analisar melhorias ligadas a telas, fluxo de navegação e ações principais antes de implementar no Lovable.",
  erros: "Analisar melhorias ligadas a diagnóstico de erros comuns e correção cirúrgica sem quebrar o app.",
};

const DEFAULT_SCOPE =
  "Analisar apenas melhorias relacionadas ao módulo atual. Recusar ou adiar melhorias fora do escopo do módulo.";

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

const buildArquitetoPrompt = (params: {
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

  return `ANÁLISE DE MELHORIA — NÃO IMPLEMENTE NADA AINDA.

Atue como Arquiteto de Melhorias do meu app. Sua função é decidir se uma ideia, funcionalidade, tela, checklist, automação ou melhoria deve entrar agora no app que estou criando, ficar para depois, virar versão premium, virar bônus, juntar com algo existente ou ser cortada. Não implemente nada. Apenas analise e recomende.

O app em análise é o app descrito no contexto do meu projeto. Não analise a Fábrica de Apps com IA. A Fábrica é apenas o programa-guia que estou usando para construir meu app.

Foco atual da análise:
- Módulo atual: ${title}
- Objetivo do módulo: ${objective}
- Escopo permitido: ${scope}
- A decisão deve considerar apenas melhorias relacionadas a este módulo.

Sempre que eu enviar uma ideia, print, prompt, funcionalidade, checklist ou sugestão, analise como arquiteto de produto do meu app, dentro do foco atual acima. Não trate como conteúdo solto.

Para cada melhoria, entregue obrigatoriamente:

1. Veredito estratégico
Diga se a melhoria vale entrar agora, depois, virar premium, virar bônus, juntar com algo existente ou cortar.

2. Local correto dentro do app
Defina exatamente em qual tela, fluxo, menu, dashboard ou etapa do app essa melhoria entra.

3. Tipo de recurso
Classifique como: funcionalidade principal, melhoria de UX, automação, checklist, template, recurso premium, bônus, ajuste visual, melhoria de monetização ou melhoria de retenção.

4. Problema que resolve
Explique qual dor do usuário final do app essa melhoria resolve.

5. Público impactado
Diga para qual tipo de usuário do app essa melhoria serve.

6. Fluxo de uso
Mostre como o usuário acessa e usa essa melhoria em até 5 etapas.

7. Interface necessária
Defina se precisa de nova tela, novo card, novo botão, novo formulário, nova tabela, novo filtro ou alteração em tela existente.

8. Dados necessários
Liste quais informações o app precisa coletar ou salvar para essa melhoria funcionar.

9. Output gerado
Explique exatamente o que o usuário recebe ao final.

10. Monetização
Defina se deve ser gratuito, premium, limite do plano gratuito, bônus, upsell, recurso pago ou parte do plano principal.

11. Impacto técnico
Diga se precisa mudar banco de dados, autenticação, permissões, API, prompts de IA, componentes de UI ou apenas texto/design.

12. Risco
Aponte se essa melhoria pode deixar o app confuso, inchado, difícil de usar, caro de manter ou difícil de vender.

13. Decisão final
Escolha exatamente uma: adicionar agora, adicionar depois, transformar em premium, juntar com funcionalidade existente, ou cortar.

14. Próxima ação obrigatória
Diga apenas uma ação: implementar, simplificar, pedir mais dados, validar com usuários, deixar para próxima versão ou cortar.

Regras invioláveis:
- Não implemente nada. Apenas analise e recomende.
- Se a melhoria não tiver relação com o módulo atual, recomende deixar para depois ou cortar.
- MVP com mais de 5 funcionalidades principais não é MVP.
- Nunca recomende adicionar algo sem definir local, tipo, fluxo, output e motivo comercial.
- Se a melhoria não ajudar o usuário a concluir a ação principal do app, ela deve ser cortada ou deixada para depois.
- Não prometa venda garantida, resultado garantido ou segurança 100%.

Use linguagem de arquiteto de produto: direto, técnico, objetivo, sem inflar valor.`;
};

/**
 * Prompt estático mantido para compatibilidade externa (referências/imports).
 * O card em si agora monta o prompt contextual via buildArquitetoPrompt.
 */
export const ARQUITETO_MELHORIAS_PROMPT = buildArquitetoPrompt({});

export const ARQUITETO_MELHORIAS_META = {
  title: "Arquiteto de Melhorias do App",
  slug: "arquiteto-de-melhorias-do-app",
  category: "Decisão de produto do seu app",
  description: "Analise melhorias antes de adicionar ao seu app.",
  is_premium: false,
  is_internal: false,
  status: "active" as const,
};

type ArquitetoMelhoriasCardProps = {
  defaultCollapsed?: boolean;
  descriptionOverride?: string;
  moduleId?: ModuleId;
  moduleTitle?: string;
  moduleObjective?: string;
};

const ARQUITETO_DEFAULT_DESCRIPTION =
  "Cole uma ideia, print, sugestão ou melhoria e descubra se isso deve entrar agora no MVP ou ficar para depois.";

export function ArquitetoMelhoriasCard({
  defaultCollapsed = false,
  descriptionOverride,
  moduleId,
  moduleTitle,
  moduleObjective,
}: ArquitetoMelhoriasCardProps = {}) {
  const prompt = buildArquitetoPrompt({ moduleId, moduleTitle, moduleObjective });
  const storageKey = moduleId
    ? `arquiteto_melhorias_prompt__${moduleId}`
    : "arquiteto_melhorias_prompt";
  const resolvedTitle = moduleTitle?.trim() || RESOLVED_TITLE_FALLBACK;
  const expectedSignature = `Módulo atual: ${resolvedTitle}`;

  return (
    <GlassCard className="mt-4 p-4 sm:p-5">
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
          </div>
          <p className="text-sm text-foreground/80 mb-4">
            {descriptionOverride ?? ARQUITETO_DEFAULT_DESCRIPTION}
          </p>
          <EditablePromptBox
            key={storageKey}
            collapsible={defaultCollapsed}
            saveSourceModule="arquiteto-melhorias"
            originalPrompt={prompt}
            storageKey={storageKey}
            expectedSignature={expectedSignature}
            copyLabel="Analisar melhoria do meu app"
            helperText="Cole no chat da IA do seu projeto para decidir se a melhoria entra agora, depois ou é cortada."
          />
        </div>
      </div>
    </GlassCard>
  );
}
