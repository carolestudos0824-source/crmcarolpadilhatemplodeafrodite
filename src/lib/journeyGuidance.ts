/**
 * Camada global de inteligência por jornada.
 *
 * Centraliza a adaptação de hero, microcopy, prompts do Agente e prompts para
 * o Lovable conforme a jornada escolhida no Projeto em foco. Helpers podem ser
 * usados por qualquer módulo de /entrega sem duplicar texto.
 *
 * Não altera banco, auth, RLS, checkout, admin, área paga, promptBuilder,
 * MODULE_ORDER, TOTAL_COMMANDS ou progresso. Apenas injeta orientação textual.
 */
import { JOURNEY_LABELS, type JourneyId } from "@/lib/journey";

export type JourneyAwareModuleId =
  | "comece"
  | "ideias"
  | "planejar"
  | "mvp"
  | "telas"
  | "fundamentos"
  | "construir"
  | "login"
  | "seguranca"
  | "venda"
  | "monetizacao"
  | "checkout"
  | "legal"
  | "publicar"
  | "teste"
  | "seo"
  | "campanhas"
  | "criativos"
  | "metricas"
  | "validacao"
  | "melhorias"
  | "checklist"
  | "erros"
  | "ativar";

export type JourneyGuidance = {
  /** Subtítulo / hero adaptado à jornada. */
  heroSubtitle: string;
  /** Orientação curta injetada no prompt do Agente. */
  agentDirective: string;
  /** Restrição cirúrgica injetada nos prompts para o Lovable. */
  lovableDirective: string;
  /** Microcopy de preservação exibida na UI das etapas. */
  preservationNote: string;
  /** Sugestão para o critério "quando avançar". */
  advanceHint: string;
  /** Nota de orientação para checklists finais. */
  checklistNote: string;
  /** Próximo passo recomendado (hint curto). */
  nextStepHint: string;
};

/** Frase-base universal por jornada (não específica do módulo). */
export const JOURNEY_BASE_PROMPT: Record<JourneyId, string> = {
  comecando_do_zero:
    "Este projeto está começando do zero. Priorize uma primeira versão funcional, simples e testável. Corte funcionalidades extras e deixe melhorias para versões futuras.",
  app_completo_por_versoes:
    "O usuário quer um app completo, mas a Fábrica constrói por versões. Separe o plano em V1, V2 e V3. Execute apenas a etapa atual no Lovable.",
  ja_tenho_um_app:
    "O usuário já tem um app. Antes de sugerir mudanças, audite o que existe, preserve o que funciona e recomende apenas ajustes cirúrgicos necessários.",
};

/** Regra global de preservação por jornada. */
export const getJourneyPreservationRule = (journey: JourneyId | null): string => {
  if (!journey) {
    return "Preserve layout aprovado, login, banco, admin, checkout e área paga existentes. Faça alterações cirúrgicas.";
  }
  switch (journey) {
    case "comecando_do_zero":
      return "Foco V1: não criar login, admin, checkout ou área paga 'só por garantia'. Mantenha apenas o que valida a ação principal.";
    case "app_completo_por_versoes":
      return "Construção por versões: implementar APENAS a versão atual. Não antecipar telas/funcionalidades de V2 ou V3. Listar o que ficou planejado para próximas versões.";
    case "ja_tenho_um_app":
      return "App existente: preservar rotas, layout, dados, login, banco, admin, checkout e área paga. Não apagar telas. Não recriar do zero. Alterações cirúrgicas somente.";
  }
};

/** Diretivas detalhadas por módulo + jornada. */
const MODULE_GUIDANCE: Record<JourneyAwareModuleId, Record<JourneyId, JourneyGuidance>> = {
  telas: {
    comecando_do_zero: {
      heroSubtitle:
        "Você está começando do zero. Vamos mapear só as telas mínimas da V1 — tela inicial, ação principal e resultado/entrega. Extras ficam para depois.",
      agentDirective:
        "Você está começando do zero. Desenhe apenas o fluxo mínimo da primeira versão. Corte telas que não sejam necessárias para validar a ação principal. Não invente área avançada, admin ou checkout cedo demais. Separe o que é extra para uma próxima versão.",
      lovableDirective:
        "Implemente APENAS a V1 mínima descrita no Mapa: tela inicial, tela da ação principal e tela de resultado/entrega, mais telas mínimas de apoio. Não crie telas extras, admin, checkout ou área paga fora do Mapa.",
      preservationNote:
        "Foco V1: comece pelo essencial. Sem telas decorativas, sem admin, sem checkout — a menos que estejam no Mapa.",
      advanceHint:
        "Avance quando a V1 tiver tela inicial, ação principal e resultado/entrega claros.",
      checklistNote:
        "Você escolheu começar do zero — marque um item só quando ele estiver claro para a V1, não para um app inteiro.",
      nextStepHint: "Próximo passo: validar a V1 das telas com o Agente antes do Lovable.",
    },
    app_completo_por_versoes: {
      heroSubtitle:
        "Você quer um app completo, mas a Fábrica constrói por versões. Vamos separar telas em V1, V2 e V3 — só a V1 vira prompt para o Lovable agora.",
      agentDirective:
        "Você quer um app completo, mas a Fábrica constrói por versões. Separe as telas em V1, V2 e V3. A V1 deve ser funcional, simples e testável. Para cada tela, diga em qual versão ela entra e por quê.",
      lovableDirective:
        "Implemente APENAS as telas marcadas como V1 no Mapa. NÃO crie agora telas de V2 ou V3. No final, liste o que foi entregue (V1) e o que ficou planejado para V2/V3.",
      preservationNote:
        "Construção por versões: V1 agora, V2 e V3 depois. Não mande o Lovable construir o app inteiro de uma vez.",
      advanceHint:
        "Avance quando você souber o que é V1, V2 e V3 — e a V1 estiver pronta para virar prompt.",
      checklistNote:
        "Você escolheu construir por versões — só marque quando a definição valer para a V1 atual. V2/V3 ficam fora desta marcação.",
      nextStepHint: "Próximo passo: fechar V1 do Mapa antes de gerar prompt Lovable.",
    },
    ja_tenho_um_app: {
      heroSubtitle:
        "Você já tem um app. Antes de mudar qualquer coisa, vamos auditar as telas existentes e só recomendar ajustes cirúrgicos onde fizer diferença.",
      agentDirective:
        "Você já tem um app. Primeiro audite as telas existentes, preserve o que funciona e só recomende mudanças necessárias para melhorar clareza, fluxo, conversão ou entrega. Identifique telas quebradas, ausentes, confusas ou fora do fluxo. Saída esperada: diagnóstico + mapa corrigido + prioridades de ajuste.",
      lovableDirective:
        "Faça APENAS ajustes cirúrgicos nas telas existentes. PRESERVE layout, rotas, dados, login, banco, checkout, admin e área paga. Não apague telas. Não recrie do zero. Liste o que foi alterado tela por tela e o que testar.",
      preservationNote:
        "App existente: preservar layout, rotas, dados, login, banco, checkout, admin e área paga. Só mudar o que estiver claramente quebrado ou confuso.",
      advanceHint:
        "Avance quando tiver diagnóstico das telas atuais, mapa corrigido e prioridades de ajuste.",
      checklistNote:
        "Você já tem um app — marque cada item como auditoria/ajuste, não como criação do zero.",
      nextStepHint: "Próximo passo: validar o diagnóstico do app existente com o Agente.",
    },
  },
  construir: buildModuleGuidance({
    zeroHero: "Construa apenas a base e a ação principal da V1.",
    completoHero: "Construa por fases — apenas a versão atual no Lovable.",
    existenteHero: "Implemente melhorias cirúrgicas sem quebrar o app existente.",
    moduleNoun: "construção",
  }),
  login: buildModuleGuidance({
    zeroHero: "Só ative login e banco se forem necessários para o MVP.",
    completoHero: "Planeje login e banco por fases — implemente o necessário para a versão atual.",
    existenteHero: "Audite auth, tabelas, user_id e RLS antes de mexer em qualquer fluxo de login.",
    moduleNoun: "login e banco",
  }),
  seguranca: buildModuleGuidance({
    zeroHero: "Valide segurança mínima para o beta. Sem promessas de segurança 100%.",
    completoHero: "Mapeie camadas de segurança por fases. Cada versão fortalece uma camada.",
    existenteHero: "Audite rotas, RLS, policies, admin, área paga e dados sensíveis antes de qualquer alteração.",
    moduleNoun: "segurança",
  }),
  checkout: buildModuleGuidance({
    zeroHero: "Valide se checkout real é necessário agora — talvez WhatsApp ou formulário resolva a V1.",
    completoHero: "Separe checkout, liberação, obrigado e entrega por fases.",
    existenteHero: "Audite pagamento, acesso, entrega e área protegida sem quebrar o fluxo existente.",
    moduleNoun: "checkout e entrega",
  }),
  venda: buildModuleGuidance({
    zeroHero: "Página simples para validar a oferta — sem excesso de seções.",
    completoHero: "Estrutura pronta para evoluir, mas publicada com o essencial primeiro.",
    existenteHero: "Audite promessa, CTA, confiança e conversão sem refazer a página.",
    moduleNoun: "página de venda",
  }),
  melhorias: buildModuleGuidance({
    zeroHero: "Liste o que NÃO entra na V1 — guarde para a V2 depois do beta.",
    completoHero: "Organize as melhorias por versão (V1, V2, V3) e execute uma por vez.",
    existenteHero: "Priorize correções cirúrgicas no app existente, não refatoração ampla.",
    moduleNoun: "melhorias e versões",
  }),
  validacao: buildModuleGuidance({
    zeroHero: "Valide a ideia com poucas pessoas antes de gastar tempo construindo.",
    completoHero: "Valide cada versão antes de avançar para a próxima.",
    existenteHero: "Valide melhorias com usuários reais antes de aplicar no app existente.",
    moduleNoun: "validação",
  }),
  monetizacao: buildModuleGuidance({
    zeroHero: "Decida monetização só quando a V1 entregar valor real.",
    completoHero: "Planeje modelo de receita por fases — cobrança mais simples primeiro.",
    existenteHero: "Audite monetização atual antes de mudar — não quebre receita existente.",
    moduleNoun: "monetização",
  }),
  publicar: buildModuleGuidance({
    zeroHero: "Publique o MVP com domínio simples — refinar depois.",
    completoHero: "Publique a V1 com domínio próprio e prepare deploy para próximas versões.",
    existenteHero: "Mantenha domínio e deploy existentes. Só mexer se houver problema real.",
    moduleNoun: "publicação e domínio",
  }),
  seo: buildModuleGuidance({
    zeroHero: "SEO básico para o beta: title, description, og:image, sitemap.",
    completoHero: "SEO por fases: técnico primeiro, conteúdo na V2, GEO na V3.",
    existenteHero: "Audite SEO existente antes de mexer — não quebre rankings já conquistados.",
    moduleNoun: "SEO e GEO",
  }),
  teste: buildModuleGuidance({
    zeroHero: "Teste o fluxo principal da V1 ponta a ponta antes de publicar.",
    completoHero: "Teste a versão atual ponta a ponta antes de liberar a próxima fase.",
    existenteHero: "Teste regressão das telas existentes antes e depois de qualquer ajuste.",
    moduleNoun: "teste final",
  }),
  checklist: buildModuleGuidance({
    zeroHero: "Marque apenas itens da V1 — V2 e V3 ficam fora deste painel agora.",
    completoHero: "Marque itens da versão atual; itens das próximas versões ficam pendentes propositalmente.",
    existenteHero: "Use o painel como auditoria do app existente, não como criação do zero.",
    moduleNoun: "prontidão",
  }),
  campanhas: buildModuleGuidance({
    zeroHero: "Campanha pequena para validar oferta — sem queimar verba antes de provar valor.",
    completoHero: "Planeje campanhas por fase de lançamento — beta, lançamento, escala.",
    existenteHero: "Audite campanhas existentes antes de criar novas — preserve o que está funcionando.",
    moduleNoun: "campanhas",
  }),
  criativos: buildModuleGuidance({
    zeroHero: "Poucos criativos focados na promessa principal da V1.",
    completoHero: "Crie kit base de criativos para evoluir junto com as versões.",
    existenteHero: "Audite criativos existentes antes de produzir novos.",
    moduleNoun: "criativos",
  }),
  metricas: buildModuleGuidance({
    zeroHero: "Configure só métricas essenciais da V1: acessos, ação principal, conversão.",
    completoHero: "Métricas por fase — cada versão acompanha um conjunto novo.",
    existenteHero: "Audite tracking existente antes de mexer — não quebre eventos já enviados.",
    moduleNoun: "métricas",
  }),
  legal: buildModuleGuidance({
    zeroHero: "Termos e política básicos para o beta sair com segurança jurídica mínima.",
    completoHero: "Documentos legais por fase — beta, lançamento, escala.",
    existenteHero: "Audite documentos legais existentes antes de substituir.",
    moduleNoun: "legal e confiança",
  }),
  erros: buildModuleGuidance({
    zeroHero: "Evite os erros mais comuns de quem começa do zero.",
    completoHero: "Evite os erros mais comuns de quem quer fazer tudo de uma vez.",
    existenteHero: "Evite os erros mais comuns de quem mexe em app existente sem auditar.",
    moduleNoun: "erros comuns",
  }),
  ativar: buildModuleGuidance({
    zeroHero: "Ative seu acesso para destravar a jornada do zero.",
    completoHero: "Ative seu acesso para destravar a construção por versões.",
    existenteHero: "Ative seu acesso para destravar a auditoria do app existente.",
    moduleNoun: "ativação",
  }),
  comece: buildModuleGuidance({
    zeroHero: "Bem-vindo. Você vai construir uma V1 funcional passo a passo.",
    completoHero: "Bem-vindo. Você vai construir um app completo por versões.",
    existenteHero: "Bem-vindo. Você vai auditar e melhorar seu app existente.",
    moduleNoun: "início",
  }),
  ideias: buildModuleGuidance({
    zeroHero: "Escolha uma ideia simples para virar V1.",
    completoHero: "Escolha uma ideia que aceite construção por versões.",
    existenteHero: "Use ideias prontas como referência para melhorias do app existente.",
    moduleNoun: "ideias",
  }),
  planejar: buildModuleGuidance({
    zeroHero: "Planeje a V1 — problema, público, promessa e ação principal.",
    completoHero: "Planeje V1, V2 e V3 antes de começar.",
    existenteHero: "Planeje a próxima evolução do app existente sem refazer planejamento antigo.",
    moduleNoun: "planejamento",
  }),
  mvp: buildModuleGuidance({
    zeroHero: "Defina o Blueprint do MVP — primeira versão funcional.",
    completoHero: "Defina o Blueprint da V1 e antecipe o que vai para V2/V3.",
    existenteHero: "Audite arquitetura existente antes de propor novo MVP.",
    moduleNoun: "MVP e arquitetura",
  }),
  fundamentos: buildModuleGuidance({
    zeroHero: "Aprenda o básico do Lovable para construir sua V1.",
    completoHero: "Aprenda o básico do Lovable para construir por versões.",
    existenteHero: "Aprenda o básico do Lovable para auditar e ajustar com segurança.",
    moduleNoun: "fundamentos",
  }),
};

/**
 * Gera um guidance genérico (hero + diretivas) baseado em frases curtas por
 * jornada e no nome do módulo. Usado para módulos onde não há ainda copy
 * dedicado — pode ser refinado por módulo conforme cada um for revisado.
 */
function buildModuleGuidance(args: {
  zeroHero: string;
  completoHero: string;
  existenteHero: string;
  moduleNoun: string;
}): Record<JourneyId, JourneyGuidance> {
  const { zeroHero, completoHero, existenteHero, moduleNoun } = args;
  return {
    comecando_do_zero: {
      heroSubtitle: zeroHero,
      agentDirective: `${JOURNEY_BASE_PROMPT.comecando_do_zero} Aplique isso ao módulo de ${moduleNoun}: corte excesso, foque na V1.`,
      lovableDirective: `Implemente apenas o necessário para a V1 deste módulo (${moduleNoun}). Não adicione recursos avançados, admin, checkout ou área paga fora do escopo da V1.`,
      preservationNote: "Foco V1. Sem extras 'só por garantia' neste módulo.",
      advanceHint: "Avance quando a V1 deste módulo estiver simples e funcional.",
      checklistNote: "Você escolheu começar do zero — marque itens válidos para a V1, não para um app completo.",
      nextStepHint: `Próximo passo: fechar a V1 de ${moduleNoun} antes de avançar.`,
    },
    app_completo_por_versoes: {
      heroSubtitle: completoHero,
      agentDirective: `${JOURNEY_BASE_PROMPT.app_completo_por_versoes} Aplique isso ao módulo de ${moduleNoun}: separe o que entra na V1, V2 e V3.`,
      lovableDirective: `Para este módulo (${moduleNoun}), implemente APENAS a versão atual. Liste o que ficou planejado para V2/V3 sem executar agora.`,
      preservationNote: "Construção por versões: só a versão atual entra no Lovable agora.",
      advanceHint: "Avance quando a versão atual deste módulo estiver pronta.",
      checklistNote: "Você escolheu construir por versões — marque itens da versão atual; próximas versões ficam pendentes.",
      nextStepHint: `Próximo passo: fechar a versão atual de ${moduleNoun} antes da próxima fase.`,
    },
    ja_tenho_um_app: {
      heroSubtitle: existenteHero,
      agentDirective: `${JOURNEY_BASE_PROMPT.ja_tenho_um_app} Aplique isso ao módulo de ${moduleNoun}: audite primeiro, recomende ajustes cirúrgicos depois.`,
      lovableDirective: `Para este módulo (${moduleNoun}), faça APENAS ajustes cirúrgicos no app existente. PRESERVE layout, rotas, dados, login, banco, checkout, admin e área paga. Não apague nada. Liste o que foi alterado e o que testar.`,
      preservationNote: "App existente: preservar o que funciona. Só mexer no que estiver claramente quebrado ou confuso.",
      advanceHint: "Avance quando tiver diagnóstico claro e prioridades cirúrgicas definidas.",
      checklistNote: "Você já tem um app — marque cada item como auditoria/ajuste, não como criação do zero.",
      nextStepHint: `Próximo passo: validar o diagnóstico de ${moduleNoun} com o Agente.`,
    },
  };
}

/** Helper principal: orientação completa por módulo + jornada. */
export const getJourneyGuidance = (
  journey: JourneyId | null,
  moduleId: JourneyAwareModuleId,
): JourneyGuidance | null => {
  if (!journey) return null;
  return MODULE_GUIDANCE[moduleId]?.[journey] ?? null;
};

/** Bloco de instrução para anexar em prompts (Agente ou Lovable). */
export const getJourneyPromptInstruction = (
  journey: JourneyId | null,
  moduleId: JourneyAwareModuleId,
  target: "agent" | "lovable",
): string => {
  if (!journey) {
    return `\n\nJornada escolhida na Fábrica: [não escolhida]\nPergunte a jornada (Começando do zero, Quero um app completo, Já tenho um app) antes de propor mudanças — ela muda o escopo.`;
  }
  const g = MODULE_GUIDANCE[moduleId]?.[journey];
  if (!g) return "";
  const directive = target === "agent" ? g.agentDirective : g.lovableDirective;
  return `\n\nJornada escolhida na Fábrica:\n${JOURNEY_LABELS[journey]}\n\nComo isso muda esta tarefa:\n${directive}`;
};

/** Hint curto de próximo passo por módulo + jornada. */
export const getJourneyNextStepHint = (
  journey: JourneyId | null,
  moduleId: JourneyAwareModuleId,
): string | null => {
  if (!journey) return null;
  return MODULE_GUIDANCE[moduleId]?.[journey]?.nextStepHint ?? null;
};

/** Texto curto exibido quando jornada não está escolhida. */
export const JOURNEY_MISSING_HINT =
  "Escolha uma jornada para a Fábrica adaptar os prompts ao seu momento.";
