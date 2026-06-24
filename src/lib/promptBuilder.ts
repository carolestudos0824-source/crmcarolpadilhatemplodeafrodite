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

const value = (v: string) => (v && v.trim() ? v.trim() : "");
const yesNo = (v: string) => (v === "sim" ? "Sim" : v === "nao" ? "Não" : "");

export const resolveAppName = (c: Pick<ProjectContext, "appName">): string => {
  const n = (c.appName ?? "").trim();
  return n || "app ainda sem nome";
};

/**
 * Identifica quando o "Projeto em foco" é a própria Fábrica de Apps com IA
 * (o admin/criador melhorando o produto principal) versus um app de
 * cliente/aluno. Usado para injetar a orientação conceitual correta no topo
 * do prompt copiado para o Lovable.
 */
export const isFabricaSelfProject = (c: Pick<ProjectContext, "appName">): boolean => {
  const n = (c.appName ?? "").trim().toLowerCase();
  if (!n) return false;
  return /\bf[aá]brica de apps\b/.test(n);
};

const conceptualScopeNote = (c: ProjectContext): string =>
  isFabricaSelfProject(c)
    ? "Aplique esta tarefa ao app atual Fábrica de Apps com IA, que é o produto principal em construção/produção. Preserve o que já funciona e não trate este pedido como app genérico de aluno."
    : "Aplique esta tarefa ao Projeto em Foco selecionado pelo usuário. A Fábrica de Apps com IA é o programa que gera este comando, não o app final do usuário.";

/**
 * Render only filled context fields. Always includes the app name (with a
 * friendly fallback when missing). Appends a single friendly note if any
 * field is empty — never lists "[não preenchido]" multiple times.
 */
const renderContextBlock = (c: ProjectContext): string => {
  const lines: string[] = [`- Nome do app: ${resolveAppName(c)}`];
  const push = (label: string, v: string) => {
    if (v) lines.push(`- ${label}: ${v}`);
  };
  push("O que o app faz", value(c.appDoes));
  push("Público-alvo", value(c.audience));
  push("Problema que resolve", value(c.problem));
  push("Promessa principal", value(c.promise));
  push("Ação principal do usuário", value(c.mainAction));
  push("Produto/serviço vendido", value(c.productSold));
  push("Modelo de cobrança", value(c.pricingModel));
  push("Login", yesNo(c.needsLogin));
  push("Banco de dados", yesNo(c.needsDatabase));
  push("Área paga", yesNo(c.needsPaidArea));
  push("Admin", yesNo(c.needsAdmin));
  push("Checkout", yesNo(c.needsCheckout));
  push("Estilo visual", value(c.visualStyle));
  push("Observações", value(c.notes));

  const totalFields = 14; // sem contar o nome
  const filled = lines.length - 1;
  if (filled < totalFields) {
    lines.push(
      "",
      "Alguns dados do app ainda não foram preenchidos. Assuma hipóteses razoáveis e recomende o melhor caminho.",
    );
  }
  return lines.join("\n");
};


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
  const appName = resolveAppName(context);

  return `${intent.actionTitle}

${conceptualScopeNote(context)}

Use este prompt no projeto Lovable do app: ${appName}.

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

Nota: aplique este prompt somente no projeto Lovable do app ${appName}.`;
};


// ---------- Detecção de intenção do Estúdio (modo Agente) ----------

export type AgentIntent =
  | "monetizacao"
  | "criar_app"
  | "ux_tela"
  | "oferta_vendas"
  | "revisao"
  | "bug"
  | "seguranca"
  | "gerar_prompt"
  | "proximo_passo"
  | "planejar_funcionalidade"
  | "generico";

export const detectAgentIntent = (input: {
  moduleId?: string;
  stepName?: string;
  command?: string;
}): AgentIntent => {
  const hay = `${input.moduleId ?? ""} ${input.stepName ?? ""} ${input.command ?? ""}`.toLowerCase();
  const has = (...words: string[]) => words.some((w) => hay.includes(w));

  if (
    input.moduleId === "monetizacao" ||
    input.moduleId === "checkout" ||
    has("monetiz", "preç", "preco", "cobrar", "cobranç", "assinatura", "plano de cobranç", "pagamento", "checkout", "ticket")
  ) {
    return "monetizacao";
  }
  if (input.moduleId === "venda" || has("oferta", "página de venda", "pagina de venda", "headline", "copy de venda", "vender o app")) {
    return "oferta_vendas";
  }
  if (
    input.moduleId === "seguranca" ||
    has(
      "segurança", "seguranca", " rls", "rls)", "rls.", "rls,",
      "permiss", "autenticaç", "autenticacao",
      "dados privados", "vazamento", "proteção", "protecao",
      "policies", "supabase security",
    )
  ) {
    return "seguranca";
  }
  if (input.moduleId === "erros" || has("bug", "erro", "quebrou", "não funciona", "nao funciona", "tela branca")) {
    return "bug";
  }
  if (input.moduleId === "telas" || has("ux", "tela", "layout", "landing", "seção", "secao", "fluxo da tela")) {
    return "ux_tela";
  }
  if (
    input.moduleId === "comece" ||
    input.moduleId === "mvp" ||
    input.moduleId === "planejar" ||
    has("criar app", "do zero", "novo app", "começar app", "comecar app", "primeira versão", "primeira versao")
  ) {
    return "criar_app";
  }
  if (has("próximo passo", "proximo passo", "o que faço agora", "o que faco agora")) {
    return "proximo_passo";
  }
  if (has("gerar prompt", "prompt para lovable", "prompt pronto")) {
    return "gerar_prompt";
  }
  if (has("revisar", "antes de implementar", "vale a pena", "devo implementar")) {
    return "revisao";
  }
  if (has("funcionalidade", "feature", "recurso novo")) {
    return "planejar_funcionalidade";
  }
  return "generico";
};

const INTENT_BLOCKS: Record<AgentIntent, string> = {
  monetizacao: `Modo Monetização — sua resposta DEVE cobrir, nesta ordem:
1. Diagnóstico comercial do app.
2. Público com maior chance de pagar.
3. Dor ou desejo que gera compra.
4. Modelo de cobrança recomendado.
5. Preço inicial sugerido (faixa realista).
6. O que fica gratuito.
7. O que fica pago.
8. Oferta principal.
9. Upsell futuro, se fizer sentido.
10. O que não usar agora.
11. Justificativa comercial.
12. Próximo passo recomendado.
13. No máximo 3 perguntas finais.`,
  criar_app: `Modo Criação de App do Zero — sua resposta DEVE entregar:
1. Veredito estratégico.
2. MVP com no máximo 5 funcionalidades.
3. Fluxo do usuário.
4. Stack recomendada.
5. Estrutura de páginas.
6. Modelo de dados simples.
7. Monetização inicial.
8. Prompt pronto para Lovable (somente após recomendação).
9. Próximo passo.`,
  ux_tela: `Modo UX/Tela — sua resposta DEVE entregar:
1. Problema da tela.
2. O que está confuso.
3. O que manter.
4. O que cortar.
5. Nova estrutura da tela.
6. Texto sugerido.
7. Prompt para Lovable, somente se eu pedir.`,
  oferta_vendas: `Modo Oferta/Vendas — sua resposta DEVE entregar:
1. Promessa central.
2. Oferta principal.
3. Preço sugerido.
4. Headline.
5. Subheadline.
6. Benefícios.
7. Prova/argumento.
8. CTA.
9. Objeções.
10. Estrutura da página de venda.`,
  revisao: `Modo Revisão — sua resposta DEVE:
1. Analisar a decisão.
2. Apontar riscos.
3. Dar alternativa melhor.
4. Recomendar implementar ou não.
5. Perguntar se deve transformar em prompt para Lovable.`,
  bug: `Modo Correção — sua resposta DEVE:
1. Hipótese da causa provável.
2. Onde provavelmente está o problema.
3. Correção mínima recomendada (sem refazer o app).
4. O que preservar (login, banco, área paga, admin, checkout, layout, dados).
5. O que testar depois.`,
  seguranca: `Modo Segurança — sua resposta DEVE entregar:
1. Diagnóstico dos principais riscos de segurança do app.
2. Quais dados precisam ser protegidos.
3. Quem pode acessar o quê (permissões por papel).
4. Regras de autenticação necessárias.
5. Regras de autorização necessárias.
6. Recomendações de RLS no Supabase, se o app usar Supabase.
7. Riscos de vazamento entre usuários.
8. Cuidados com área paga, admin e dados privados.
9. O que não publicar antes de corrigir.
10. Checklist de testes manuais de segurança.
11. Próximo passo recomendado.
12. No máximo 3 perguntas finais, apenas se forem essenciais.`,
  gerar_prompt: `Modo Geração de Prompt — sua resposta DEVE:
1. Resumir a decisão em uma frase.
2. Entregar um prompt pronto para colar no Lovable, executivo e específico.
3. Listar o que esse prompt preserva e o que não faz.`,
  proximo_passo: `Modo Próximo Passo — sua resposta DEVE:
1. Diagnóstico curto do momento atual do app.
2. Recomendação do próximo passo único e prático.
3. Por que esse passo agora.
4. O que NÃO fazer ainda.`,
  planejar_funcionalidade: `Modo Planejar Funcionalidade — sua resposta DEVE:
1. Avaliar se a funcionalidade vale a pena agora.
2. Versão mínima da funcionalidade.
3. Telas/dados envolvidos.
4. Riscos de quebrar o que já funciona.
5. Próximo passo recomendado.`,
  generico: `Modo Consultivo — sua resposta DEVE:
1. Análise rápida do contexto, com hipóteses se faltar dado.
2. Recomendação prática já decidida.
3. Justificativa curta.
4. Próximo passo concreto.`,
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
  const agentIntent = detectAgentIntent({ moduleId, stepName, command });
  const intentBlock = INTENT_BLOCKS[agentIntent];
  const appName = resolveAppName(context);

  return `CONSULTORIA ANTES DE IMPLEMENTAR — ${intent.actionTitle}

Estou criando o app ${appName}. Quero analisar a etapa ${stepName} antes de implementar.

Não implemente nada.
Não altere arquivos.
Não gere código ainda.
Não escreva como se eu fosse colar isso direto no Lovable.

Dados do app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo da etapa:
${stepObjective?.trim() || "[não informado]"}

O que estou tentando decidir:
${decision || "[não informado]"}

Regra obrigatória de resposta:
Não me devolva apenas perguntas. Primeiro analise o contexto disponível, assuma hipóteses razoáveis e entregue uma recomendação prática. Se faltar informação, faça no máximo 3 perguntas no final, mas não use a falta de dados como desculpa para não orientar.

Formato obrigatório da sua resposta:
1. Análise rápida do contexto (com hipóteses claras quando faltar dado).
2. Recomendação principal já decidida.
3. Justificativa da recomendação.
4. O que você faria agora, na prática.
5. O que eu deveria evitar agora.
6. Próximo passo recomendado.
7. No máximo 3 perguntas finais, só se forem essenciais.

${intentBlock}

Importante:
Responda como consultor de produto, UX e monetização para quem está criando o app ${appName} no Lovable e não sabe programar.
Não execute nada.
Não crie prompt de implementação ainda, a menos que o modo detectado seja "gerar_prompt" ou eu peça explicitamente.
Primeiro me ajude a decidir com uma recomendação clara — não com uma lista de perguntas.
No final, pergunte se eu quero transformar a análise em um prompt pronto para Lovable do app ${appName}.`;
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

Nota: aplique este prompt somente no projeto Lovable do app ${resolveAppName(context)}.`;
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

Aplique esta revisão somente no projeto Lovable do app ${resolveAppName(context)}.`;
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

Nota: aplique este prompt somente no projeto Lovable do app ${resolveAppName(context)}.`;
};
