import type { ProjectContext } from "@/hooks/useProjectContext";

/**
 * Construtores de prompts por intenção. O prompt para Lovable começa pela
 * tarefa real (título de ação forte), seguido do contexto do app, etapa,
 * tarefa específica, regras de preservação, o que não fazer, o que testar
 * e a entrega esperada. A frase "Estou usando a Fábrica de Apps..." só
 * aparece como nota discreta no final, e apenas para o builder do Lovable.
 *
 * Não altera os arrays COMMANDS_* nem TOTAL_COMMANDS. Apenas enriquece o
 * texto copiado.
 */

const value = (v: string) => (v && v.trim() ? v.trim() : "[não preenchido]");
const yesNo = (v: string) =>
  v === "sim" ? "Sim" : v === "nao" ? "Não" : "[não preenchido]";

const renderContextBlock = (c: ProjectContext): string =>
  [
    `- Nome do app: ${value(c.appName)}`,
    `- O que o app faz: ${value(c.appDoes)}`,
    `- Público-alvo: ${value(c.audience)}`,
    `- Problema que resolve: ${value(c.problem)}`,
    `- Promessa principal: ${value(c.promise)}`,
    `- Ação principal do usuário: ${value(c.mainAction)}`,
    `- Produto/serviço vendido: ${value(c.productSold)}`,
    `- Modelo de cobrança: ${value(c.pricingModel)}`,
    `- Login: ${yesNo(c.needsLogin)}`,
    `- Banco de dados: ${yesNo(c.needsDatabase)}`,
    `- Área paga: ${yesNo(c.needsPaidArea)}`,
    `- Admin: ${yesNo(c.needsAdmin)}`,
    `- Checkout: ${yesNo(c.needsCheckout)}`,
    `- Estilo visual: ${value(c.visualStyle)}`,
    `- Observações: ${value(c.notes)}`,
  ].join("\n");

// ---------- Mapa de intenções por módulo ----------

export type ModuleIntent = {
  actionTitle: string;
  directRequest: string;
  mandatoryChecks: string[];
  preserveExtras?: string[];
};

export const MODULE_PROMPT_INTENTS: Record<string, ModuleIntent> = {
  fundamentos: {
    actionTitle: "ORIENTAÇÃO INICIAL DO APP NO LOVABLE",
    directRequest:
      "Oriente como aplicar o aprendizado desta aula ao meu app atual no Lovable.",
    mandatoryChecks: [
      "Explicar o que isso muda no meu app.",
      "Sugerir o próximo passo concreto.",
    ],
  },
  comece: {
    actionTitle: "DEFINIÇÃO DA PRIMEIRA VERSÃO DO APP",
    directRequest:
      "Ajude a definir a primeira versão do meu app com clareza de público, dor e promessa.",
    mandatoryChecks: [
      "Validar ideia, público e dor.",
      "Definir promessa principal.",
      "Recomendar primeiro passo no Lovable.",
    ],
  },
  ideias: {
    actionTitle: "USO DE IDEIA PRONTA COMO BASE DO APP",
    directRequest:
      "Adapte a ideia pronta selecionada ao meu app atual no Lovable.",
    mandatoryChecks: [
      "Adaptar ao público e dor do meu app.",
      "Cortar o que não faz parte do MVP.",
      "Sugerir próximo prompt para construir.",
    ],
  },
  planejar: {
    actionTitle: "PLANO ESTRATÉGICO DO APP",
    directRequest:
      "Crie um plano enxuto do meu app antes de construir no Lovable.",
    mandatoryChecks: [
      "Público, dor e promessa.",
      "MVP com no máximo 5 funcionalidades.",
      "Fluxo do usuário e telas mínimas.",
      "Banco mínimo necessário.",
      "Riscos técnicos.",
    ],
  },
  mvp: {
    actionTitle: "CRIAÇÃO DO MVP INICIAL DO APP",
    directRequest:
      "Defina ou refine a primeira versão funcional do meu app com no máximo 5 funcionalidades essenciais.",
    mandatoryChecks: [
      "Definir usuário principal.",
      "Definir ação principal.",
      "Definir telas mínimas.",
      "Definir banco mínimo.",
      "Cortar o que pode ficar para depois.",
      "Manter simples, funcional e testável.",
    ],
  },
  telas: {
    actionTitle: "PLANO DE TELAS E FLUXO DO APP",
    directRequest:
      "Organize as telas e o fluxo do usuário no meu app antes de construir.",
    mandatoryChecks: [
      "Mapear telas públicas e restritas.",
      "Definir CTA principal de cada tela.",
      "Definir caminho do usuário até a ação principal.",
      "Indicar telas de erro e estado vazio.",
    ],
  },
  construir: {
    actionTitle: "CONSTRUÇÃO DA PRIMEIRA VERSÃO DO APP",
    directRequest:
      "Construa ou ajuste a primeira versão funcional do meu app no Lovable.",
    mandatoryChecks: [
      "Implementar somente o MVP.",
      "Priorizar mobile first.",
      "Usar dados reais de exemplo, sem lorem ipsum.",
      "Garantir que a ação principal funcione.",
      "Indicar como testar.",
    ],
  },
  login: {
    actionTitle: "ESTRUTURA DE LOGIN E BANCO DO APP",
    directRequest:
      "Estruture ou revise login, banco de dados e permissões do meu app.",
    mandatoryChecks: [
      "Verificar cadastro, login, logout e redirecionamento.",
      "Verificar tabelas necessárias e relações.",
      "Verificar permissões e RLS.",
      "Garantir que usuário comum não acesse dados de outro usuário.",
      "Garantir que admin tenha acesso separado.",
      "Informar o que testar depois.",
    ],
  },
  seguranca: {
    actionTitle: "AUDITORIA DE SEGURANÇA DO APP",
    directRequest:
      "Analise a segurança do meu app no Lovable antes de eu publicar ou vender.",
    mandatoryChecks: [
      "Verificar rotas públicas e privadas.",
      "Verificar login e logout.",
      "Verificar proteção da área paga.",
      "Verificar separação entre usuário comum e admin.",
      "Verificar se usuário sem acesso consegue burlar conteúdo pago.",
      "Verificar se dados de um usuário aparecem para outro.",
      "Verificar se chaves secretas aparecem no frontend.",
      "Verificar se banco, RLS e policies estão seguros.",
      "Verificar redirecionamentos após login e logout.",
      "Listar riscos antes da publicação.",
    ],
  },
  venda: {
    actionTitle: "MELHORIA DA PÁGINA DE VENDA DO APP",
    directRequest:
      "Analise e melhore a página de venda do meu app para deixar a oferta mais clara, confiável e orientada à conversão.",
    mandatoryChecks: [
      "Verificar promessa principal.",
      "Verificar dor do público.",
      "Verificar benefício do app.",
      "Verificar clareza da oferta.",
      "Verificar CTA.",
      "Verificar preço ou chamada para compra.",
      "Verificar prova ou argumento de confiança.",
      "Verificar clareza no mobile.",
      "Remover promessa exagerada.",
      "Garantir que o usuário entenda o que está comprando.",
    ],
    preserveExtras: [
      "layout do app atual",
      "identidade visual já aprovada",
      "qualquer checkout ou link de pagamento existente",
    ],
  },
  monetizacao: {
    actionTitle: "PLANO DE MONETIZAÇÃO DO APP",
    directRequest:
      "Crie ou refine o plano de monetização do meu app com base no produto/serviço, modelo de cobrança, público e promessa.",
    mandatoryChecks: [
      "Confirmar produto ou serviço vendido.",
      "Confirmar modelo de cobrança.",
      "Adequar a oferta ao público-alvo.",
      "Alinhar com a promessa principal.",
      "Sugerir faixa de valor inicial realista.",
      "Sugerir teste de oferta com pessoas reais.",
    ],
  },
  checkout: {
    actionTitle: "CONFIGURAÇÃO DE CHECKOUT E ENTREGA",
    directRequest:
      "Configure ou revise o checkout e a entrega do meu app sem quebrar pagamento ou acesso.",
    mandatoryChecks: [
      "Verificar fluxo de pagamento.",
      "Verificar página de obrigado.",
      "Verificar liberação de acesso.",
      "Verificar área de entrega protegida.",
      "Testar como comprador real.",
    ],
  },
  legal: {
    actionTitle: "REVISÃO LEGAL E DE CONFIANÇA DO APP",
    directRequest:
      "Revise termos, privacidade, suporte e promessas do meu app para reduzir risco e aumentar confiança.",
    mandatoryChecks: [
      "Revisar termos de uso.",
      "Revisar política de privacidade.",
      "Incluir aviso de responsabilidade.",
      "Conferir conformidade básica com LGPD.",
      "Listar quais dados são coletados e por quê.",
      "Conferir clareza sobre checkout, pagamento e reembolso.",
      "Remover promessas exageradas ou garantia de resultado.",
      "Conferir links legais acessíveis no rodapé e no checkout.",
    ],
  },
  publicar: {
    actionTitle: "PUBLICAÇÃO E DOMÍNIO DO APP",
    directRequest:
      "Prepare a publicação do meu app e revise domínio, metadados e abertura em diferentes dispositivos.",
    mandatoryChecks: [
      "Conferir domínio configurado e acessível.",
      "Conferir favicon.",
      "Conferir imagem social/OG.",
      "Conferir título e descrição da página.",
      "Testar abertura no mobile.",
      "Conferir links principais (home, checkout, login, suporte).",
      "Fazer teste pós-publicação em aba anônima.",
    ],
  },
  teste: {
    actionTitle: "TESTE FINAL DO APP ANTES DE PUBLICAR",
    directRequest:
      "Faça um teste final do meu app simulando visitante, usuário logado e comprador.",
    mandatoryChecks: [
      "Testar fluxo público.",
      "Testar fluxo logado.",
      "Testar fluxo de compra e entrega.",
      "Conferir mobile.",
      "Listar bugs e prioridades.",
    ],
  },
  seo: {
    actionTitle: "SEO E GEO DO APP",
    directRequest:
      "Estruture SEO e GEO do meu app sem criar páginas vazias.",
    mandatoryChecks: [
      "Definir palavra-chave principal.",
      "Confirmar nicho do app.",
      "Revisar título da página.",
      "Revisar meta descrição.",
      "Estruturar headings (h1, h2) com hierarquia.",
      "Garantir conteúdo rastreável e útil.",
      "Garantir clareza para mecanismos de busca e IA (GEO).",
    ],
  },
  campanhas: {
    actionTitle: "CAMPANHAS PARA VENDER O APP",
    directRequest:
      "Crie ou refine uma campanha para divulgar e vender o meu app.",
    mandatoryChecks: [
      "Definir canal principal.",
      "Definir oferta da campanha.",
      "Sugerir copy e CTA.",
      "Indicar como medir resultado.",
    ],
  },
  criativos: {
    actionTitle: "CRIATIVOS PARA DIVULGAR O APP",
    directRequest:
      "Crie criativos para divulgar o meu app no formato escolhido.",
    mandatoryChecks: [
      "Sugerir variação para anúncio pago.",
      "Sugerir variação para story.",
      "Sugerir variação para reels.",
      "Sugerir criativo estático.",
      "Escrever headline forte.",
      "Incluir chamada para ação clara.",
      "Manter promessa coerente com o app, sem exagero.",
    ],
  },
  metricas: {
    actionTitle: "MÉTRICAS PARA ACOMPANHAR O APP",
    directRequest:
      "Defina as métricas essenciais para acompanhar o meu app.",
    mandatoryChecks: [
      "Definir ação principal.",
      "Escolher poucas métricas relevantes.",
      "Mapear funil.",
      "Identificar pontos de abandono.",
    ],
  },
  validacao: {
    actionTitle: "ANÁLISE DE VIABILIDADE DA IDEIA",
    directRequest:
      "Analise a viabilidade da minha ideia de app antes de eu gastar créditos construindo no Lovable.",
    mandatoryChecks: [
      "Avaliar mercado e concorrência.",
      "Avaliar dor real do público.",
      "Avaliar promessa e diferencial.",
      "Avaliar possíveis modelos de monetização.",
      "Sugerir versão mínima viável.",
      "Sinalizar riscos antes de construir.",
    ],
  },
  melhorias: {
    actionTitle: "PLANO DE MELHORIAS E NOVAS VERSÕES DO APP",
    directRequest:
      "Analise o app atual e proponha melhorias organizadas por prioridade, sem refazer o app inteiro e sem quebrar o que já funciona.",
    mandatoryChecks: [
      "Identificar o que já está funcionando bem.",
      "Identificar melhorias de experiência do usuário.",
      "Identificar melhorias de layout e clareza.",
      "Identificar melhorias de performance ou estabilidade, se houver.",
      "Separar melhorias urgentes, importantes e futuras.",
      "Evitar adicionar funcionalidades grandes demais sem validação.",
      "Manter o MVP simples e funcional.",
      "Preservar login, banco, área paga, admin, checkout, layout aprovado e dados do usuário.",
      "Sugerir uma próxima versão realista.",
      "Informar o que testar depois de cada melhoria.",
    ],
    preserveExtras: [
      "prompts e estrutura atual do app",
    ],
  },
  checklist: {
    actionTitle: "PAINEL DE PRONTIDÃO DO APP",
    directRequest:
      "Revise se o meu app está pronto para venda pública com base no estado atual.",
    mandatoryChecks: [
      "Conferir MVP funcional.",
      "Conferir venda e entrega.",
      "Conferir segurança e legal.",
      "Listar bloqueadores.",
    ],
  },
  erros: {
    actionTitle: "CORREÇÃO CIRÚRGICA DE ERRO NO APP",
    directRequest:
      "Corrija o erro descrito sem refazer o app inteiro e sem quebrar o que já funciona.",
    mandatoryChecks: [
      "Identificar causa provável antes de alterar.",
      "Corrigir apenas o necessário.",
      "Preservar login, banco, admin, checkout, área paga e layout aprovado.",
      "Explicar o que foi corrigido.",
      "Informar exatamente o que testar depois.",
    ],
  },
  ativar: {
    actionTitle: "ATIVAÇÃO DE ACESSO AO PROGRAMA",
    directRequest:
      "Confirme a ativação do meu acesso e me oriente sobre o próximo passo.",
    mandatoryChecks: [
      "Conferir e-mail correto usado na compra.",
      "Confirmar login com Google funcionando.",
      "Indicar liberação manual via admin quando necessário.",
      "Sugerir mensagem para enviar ao cliente após liberação.",
      "Explicar o que fazer se o acesso não aparecer.",
      "Conferir status do pagamento e do acesso antes de liberar.",
    ],
  },
};

const FALLBACK_INTENT: ModuleIntent = {
  actionTitle: "TAREFA NO APP",
  directRequest:
    "Execute esta tarefa no meu app atual no Lovable, mantendo a qualidade da etapa.",
  mandatoryChecks: [
    "Aplicar apenas o que a tarefa pede.",
    "Preservar o que já funciona.",
    "Indicar o que testar depois.",
  ],
};

const getIntent = (moduleId?: string): ModuleIntent => {
  if (!moduleId) return FALLBACK_INTENT;
  return MODULE_PROMPT_INTENTS[moduleId] ?? FALLBACK_INTENT;
};

// ---------- Substituição de placeholders ----------

const PLACEHOLDER_MAP: { pattern: RegExp; key: keyof ProjectContext }[] = [
  { pattern: /\[(?:descreva\s+)?(?:a\s+)?sua\s+ideia\]/gi, key: "appDoes" },
  { pattern: /\[descreva o app\]/gi, key: "appDoes" },
  { pattern: /\[descreva\]/gi, key: "appDoes" },
  { pattern: /\[nome do app\]/gi, key: "appName" },
  { pattern: /\[descreva o público\]/gi, key: "audience" },
  { pattern: /\[quem vai usar\]/gi, key: "audience" },
  { pattern: /\[público\]/gi, key: "audience" },
  { pattern: /\[descreva a dor\]/gi, key: "problem" },
  { pattern: /\[problema\]/gi, key: "problem" },
  { pattern: /\[promessa\]/gi, key: "promise" },
  { pattern: /\[ação principal\]/gi, key: "mainAction" },
  { pattern: /\[produto(?:\s+ou\s+serviço)?\]/gi, key: "productSold" },
  { pattern: /\[modelo de cobrança\]/gi, key: "pricingModel" },
];

export const applyContextPlaceholders = (
  text: string,
  c: ProjectContext,
): string => {
  let out = text;
  for (const { pattern, key } of PLACEHOLDER_MAP) {
    const v = (c[key] || "").trim();
    if (v) out = out.replace(pattern, v);
  }
  return out;
};

// ---------- Builders ----------

export type PromptBuildInput = {
  context: ProjectContext;
  stepName: string;
  stepObjective?: string;
  command: string;
  moduleId?: string;
};

const PRESERVE_BASE = [
  "o que já está funcionando",
  "layout aprovado",
  "identidade visual existente",
  "textos aprovados",
  "rotas existentes",
  "login, banco, acesso, admin, checkout e entrega, se não forem parte da tarefa",
  "dados do usuário",
  "progresso existente",
];

const DONT_DO = [
  "não refaça o app inteiro",
  "não mude o escopo da etapa",
  "não invente funcionalidades fora do MVP",
  "não altere checkout, pagamento ou preço se não for pedido",
  "não quebre fluxos já funcionando",
  "não remova funcionalidades aprovadas",
  "não use promessas garantidas",
];

const EXPECTED = [
  "o que foi feito",
  "o que mudou",
  "o que preciso testar",
  "riscos encontrados",
  "próximo comando recomendado, se necessário",
];

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

export const buildLovablePrompt = ({
  context,
  stepName,
  stepObjective,
  command,
  moduleId,
}: PromptBuildInput): string => {
  const intent = getIntent(moduleId);
  const preserve = [...PRESERVE_BASE, ...(intent.preserveExtras ?? [])];
  const task = applyContextPlaceholders(command.trim(), context);

  return `${intent.actionTitle}

Pedido direto:
${intent.directRequest}

Dados do app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

Tarefa específica:
${task}

Faça obrigatoriamente:
${bullets(intent.mandatoryChecks)}

Regras de preservação:
${bullets(preserve)}

O que não fazer:
${bullets(DONT_DO)}

O que testar depois:
- siga o "Faça obrigatoriamente" como roteiro de teste
- valide a ação principal do usuário
- valide o mobile

Entrega esperada:
${bullets(EXPECTED)}

Nota: aplique este comando ao app atual no Lovable, não à plataforma Fábrica de Apps.`;
};

export const buildAgentPrompt = ({
  context,
  stepName,
  stepObjective,
  command,
  moduleId,
}: PromptBuildInput): string => {
  const intent = getIntent(moduleId);
  const decision = applyContextPlaceholders(command.trim(), context);

  return `CONSULTORIA ANTES DE IMPLEMENTAR — ${intent.actionTitle}

Quero pensar antes de aplicar qualquer mudança no meu app.

Não implemente nada.
Não altere arquivos.
Não gere código ainda.
Não escreva como se eu fosse colar isso direto no Lovable.

Analise esta etapa do meu app e me explique:

1. Qual é o objetivo real desta etapa?
2. Essa etapa faz sentido para o usuário final?
3. Onde ela deveria entrar no fluxo ou na página?
4. O que está bom?
5. O que está confuso?
6. O que pode prejudicar conversão ou clareza?
7. Qual texto você sugere?
8. Qual estrutura visual você recomenda?
9. Quais riscos existem se eu implementar isso agora?
10. O que você cortaria para deixar mais simples?
11. Depois da análise, me dê uma recomendação final.
12. Só depois da minha aprovação, transforme isso em um prompt pronto para Lovable.

Dados do app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo da etapa:
${stepObjective?.trim() || "[não informado]"}

O que estou tentando decidir:
${decision || "[não informado]"}

Regra obrigatória de resposta:
Não me devolva apenas perguntas. Primeiro analise o contexto, assuma hipóteses razoáveis e me entregue uma recomendação prática. Se faltar informação, faça no máximo 3 perguntas no final, mas não use a falta de dados como desculpa para não orientar.

Formato obrigatório da sua resposta:
1. Análise rápida do contexto (com hipóteses claras quando faltar dado).
2. Recomendação principal já decidida.
3. Justificativa da recomendação.
4. O que você faria agora, na prática.
5. O que eu deveria evitar agora.
6. No máximo 3 perguntas finais, só se forem essenciais.
${moduleId === "monetizacao" || moduleId === "venda" || moduleId === "checkout"
    ? `
Para decisões de monetização, oferta ou checkout, sua recomendação deve cobrir obrigatoriamente:
- Modelo de monetização recomendado
- Preço inicial sugerido (faixa realista)
- O que fica gratuito
- O que fica pago
- Melhor gatilho de compra
- Oferta principal
- Upsell futuro, se fizer sentido
- O que não usar agora
- Justificativa comercial
- Próximo passo recomendado
`
    : ""}
Importante:
Responda como consultor de produto, UX e monetização.
Não execute nada.
Não crie prompt de implementação ainda.
Primeiro me ajude a decidir com uma recomendação clara — não com uma lista de perguntas.
No final, pergunte se eu quero transformar a análise em um prompt pronto para Lovable.`;
};

// ---------- Builders de revisão (Revisar etapa) ----------

export type ReviewBuildInput = {
  context: ProjectContext;
  stepName: string;
  stepObjective?: string;
  isSecurity?: boolean;
  moduleId?: string;
};

const securityAnalysisBlock = `Analise especificamente:

1. Rotas públicas e rotas restritas do app atual.
2. Como o login protege a área paga deste projeto.
3. Se usuário sem login consegue chegar em conteúdo restrito.
4. Se usuário logado sem acesso consegue ver conteúdo premium.
5. Se o admin do app está protegido contra usuário comum.
6. Como os dados do usuário estão sendo protegidos.
7. Se existe risco de chave secreta exposta no frontend.
8. Se as regras de banco/RLS/policies reduzem risco de acesso indevido.
9. Se existe risco de alguém burlar o acesso pago.
10. O que precisa testar antes de publicar para deixar o app mais seguro e reduzir risco.`;

const standardAnalysisBlock = `Analise:

1. O que esta etapa deveria ter implementado, organizado ou ajustado.
2. Onde isso aparece no app atual.
3. Se existe algo incompleto, quebrado, duplicado, confuso ou desalinhado.
4. Se a experiência funciona no desktop e no mobile.
5. Se há risco de quebrar login, banco, acesso, admin, checkout, entrega, progresso ou layout.
6. O que ainda precisa ser corrigido antes de avançar.`;

export const buildReviewLovablePrompt = ({
  context,
  stepName,
  stepObjective,
  isSecurity,
  moduleId,
}: ReviewBuildInput): string => {
  const intent = getIntent(moduleId);
  return `REVISÃO DA ETAPA — ${intent.actionTitle}

Pedido direto:
Revise se tudo que esta etapa pediu foi realmente aplicado no meu app atual no Lovable.

Dados do app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

${isSecurity ? securityAnalysisBlock : standardAnalysisBlock}

Regras de preservação:
${bullets(PRESERVE_BASE)}

Não altere nada automaticamente sem explicar antes.

Entregue:
- o que está correto
- o que está faltando
- o que precisa testar
- riscos encontrados
- próximo comando recomendado, se necessário

Nota: revise o app atual no Lovable, não a plataforma Fábrica de Apps.`;
};

export const buildReviewAgentPrompt = ({
  context,
  stepName,
  stepObjective,
  isSecurity,
  moduleId,
}: ReviewBuildInput): string => {
  const intent = getIntent(moduleId);
  return `REVISÃO DE ETAPA COM O AGENTE — ${intent.actionTitle}

Me ajude a revisar se tudo que esta etapa pediu foi realmente aplicado no meu projeto no Lovable.

Dados do app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

${isSecurity ? securityAnalysisBlock : standardAnalysisBlock}

Depois, me sugira o próximo comando que eu deveria enviar ao Lovable se algo estiver faltando.

Não revise a plataforma Fábrica de Apps. O app revisado é o meu projeto no Lovable.`;
};

// ---------- Wrapper para "Erros comuns" ----------

/**
 * Envolve o comando de um erro comum no padrão "CORREÇÃO CIRÚRGICA DE ERRO".
 * Mantém o comando original como descrição do problema e adiciona regras de
 * preservação. Não altera COMMON_ERRORS nem TOTAL_COMMANDS.
 */
export const wrapErrorCorrection = (input: {
  context: ProjectContext;
  errorTitle: string;
  errorExplanation: string;
  command: string;
}): string => {
  const { context, errorTitle, errorExplanation, command } = input;
  const task = applyContextPlaceholders(command.trim(), context);
  return `CORREÇÃO CIRÚRGICA DE ERRO NO APP

Corrija este problema sem refazer o app inteiro e sem quebrar o que já funciona.

Problema:
${errorTitle}

Sintoma:
${errorExplanation}

Dados do app:
${renderContextBlock(context)}

Comando base:
${task}

Preserve:
${bullets(PRESERVE_BASE)}

Antes de alterar:
Explique a causa provável.

Depois:
Corrija apenas o necessário e diga exatamente o que testar.

Nota: aplique no app atual no Lovable, não na plataforma Fábrica de Apps.`;
};
