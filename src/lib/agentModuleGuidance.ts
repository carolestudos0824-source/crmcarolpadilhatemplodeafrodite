/**
 * Microcopy centralizada do Agente Arquiteto oficial por módulo crítico.
 *
 * Usado por cards contextuais (`AgentArchitectCard`) no corpo dos módulos
 * do Lote P1 da /entrega. Apenas dados — sem JSX, sem lógica sensível,
 * sem chamadas a banco/auth/RLS.
 *
 * Todos os CTAs apontam para o Agente Arquiteto oficial (ChatGPT),
 * usando `copyPromptAndOpenAgent` do helper já existente. O drawer interno
 * "Assistente rápido da Fábrica" NÃO é usado aqui.
 */

export type AgentModuleGuidance = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  prompt: string;
  successMessage?: string;
};

export const AGENT_MODULE_GUIDANCE = {
  comece: {
    eyebrow: "Comece aqui · guia inicial",
    title: "Comece pelo Agente Arquiteto se estiver em dúvida",
    subtitle:
      "O Agente te ajuda a entender a Fábrica, escolher sua rota e decidir se você começa por ideia, planejamento ou app existente.",
    ctaLabel: "Abrir Agente Arquiteto",
    prompt: `Estou começando na Fábrica de Apps com IA e preciso de ajuda para entender minha melhor rota. Me ajude a decidir se devo começar por ideias prontas, planejamento do app ou diagnóstico de um app que já existe. Faça perguntas simples e me entregue um próximo passo claro.`,
    successMessage:
      "Prompt copiado. Abra o Agente Arquiteto oficial e cole para começar.",
  },
  planejar: {
    eyebrow: "Planejar o App · antes do Lovable",
    title: "Planeje seu app com o Agente antes de gerar prompt",
    subtitle:
      "O Agente ajuda a transformar ideia solta em problema, público, promessa, ação principal, funcionalidades e escopo seguro.",
    ctaLabel: "Planejar com o Agente Arquiteto",
    prompt: `Quero planejar meu aplicativo antes de pedir qualquer coisa ao Lovable. Me ajude a definir público-alvo, problema, promessa principal, ação principal do usuário, funcionalidades essenciais, o que cortar agora e qual deve ser o próximo passo.`,
    successMessage:
      "Prompt copiado. Abra o Agente Arquiteto oficial e cole para planejar.",
  },
  login: {
    eyebrow: "Login e Banco · ação crítica",
    title: "Revise login e dados com o Agente antes de mexer no app",
    subtitle:
      "O Agente ajuda a pensar em cadastro, login, logout, dados por usuário, tabelas, permissões e riscos antes de pedir alterações ao Lovable.",
    ctaLabel: "Revisar com o Agente Arquiteto",
    prompt: `Vou trabalhar em login e banco de dados do meu app. Antes de pedir alterações ao Lovable, me ajude a revisar o que preciso preservar, quais dados são por usuário, quais tabelas podem existir, quais permissões preciso considerar e quais riscos devo evitar.`,
    successMessage:
      "Prompt copiado. Abra o Agente Arquiteto oficial e cole antes de mexer em login/banco.",
  },
  seguranca: {
    eyebrow: "Segurança do App · revise antes de alterar",
    title: "Antes de mexer em segurança, pergunte ao Agente",
    subtitle:
      "O Agente ajuda a revisar rotas privadas, área paga, admin, RLS, policies, dados sensíveis e possíveis formas de burlar acesso.",
    ctaLabel: "Revisar segurança com o Agente Arquiteto",
    prompt: `Quero revisar a segurança do meu app antes de pedir mudanças ao Lovable. Me ajude a analisar rotas públicas e privadas, dados sensíveis, login, área paga, admin, RLS, policies, permissões e riscos de acesso indevido. Não prometa segurança 100%, apenas me ajude a reduzir riscos.`,
    successMessage:
      "Prompt copiado. Abra o Agente Arquiteto oficial e cole antes de mexer em segurança.",
  },
  checkout: {
    eyebrow: "Checkout e Entrega · antes de configurar pagamento",
    title: "Revise seu fluxo de checkout com o Agente",
    subtitle:
      "O Agente ajuda a revisar pagamento, confirmação, liberação de acesso, página de obrigado e entrega do produto sem quebrar o que já funciona.",
    ctaLabel: "Revisar checkout com o Agente Arquiteto",
    prompt: `Quero revisar o fluxo de checkout e entrega do meu app antes de pedir alterações ao Lovable. Me ajude a pensar em pagamento, confirmação, liberação de acesso, área paga, página de obrigado, e-mails ou mensagens pós-compra, riscos e o que não devo alterar agora.`,
    successMessage:
      "Prompt copiado. Abra o Agente Arquiteto oficial e cole antes de configurar checkout.",
  },
} as const satisfies Record<string, AgentModuleGuidance>;

export type AgentModuleKey = keyof typeof AGENT_MODULE_GUIDANCE;
