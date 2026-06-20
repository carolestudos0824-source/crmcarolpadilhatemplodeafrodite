import type { ProjectContext } from "@/hooks/useProjectContext";

/**
 * Construtores de prompts enriquecidos. Envolvem o comando base com:
 * - contexto do app da pessoa (preenchido em "Contexto do meu app")
 * - etapa atual e objetivo
 * - regras de preservação
 *
 * Não alteram os arrays COMMANDS_* nem TOTAL_COMMANDS. Apenas enriquecem
 * o texto copiado.
 */

const value = (v: string) => (v && v.trim() ? v.trim() : "[não preenchido]");
const yesNo = (v: string) =>
  v === "sim" ? "Sim" : v === "nao" ? "Não" : "[não preenchido]";

const renderContextBlock = (c: ProjectContext): string => {
  return [
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
};

export type PromptBuildInput = {
  context: ProjectContext;
  stepName: string;
  stepObjective?: string;
  command: string;
};

export const buildLovablePrompt = ({
  context,
  stepName,
  stepObjective,
  command,
}: PromptBuildInput): string => {
  return `Contexto:
Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

A Fábrica é apenas o programa-guia. O app que deve ser criado, ajustado ou revisado é o projeto atual que estou construindo no Lovable.

Contexto do meu app:
${renderContextBlock(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

Tarefa:
${command.trim()}

Regras:
- Aplique a tarefa no app atual que estou criando no Lovable.
- Preserve o que já está funcionando.
- Não altere checkout, login, banco, admin, rotas, textos ou estilos fora do escopo desta tarefa, a menos que seja necessário e seguro.
- Não trate a Fábrica de Apps com IA como o app final.
- Se faltar informação, use o contexto acima e faça a melhor implementação possível.
- Ao final, informe o que foi feito e o que preciso testar.`;
};

export const buildAgentPrompt = ({
  context,
  stepName,
  command,
}: PromptBuildInput): string => {
  return `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

Etapa atual:
${stepName}

Contexto do meu app:
${renderContextBlock(context)}

Comando que pretendo enviar ao Lovable:
${command.trim()}

Quero que você revise este comando antes de eu enviar ao Lovable.

Analise:
1. Se o comando está claro.
2. Se está completo.
3. Se está adequado para o app que estou criando.
4. Se falta alguma regra de segurança, banco, login, acesso, checkout ou admin.
5. Se existe risco de quebrar algo que já funciona.
6. Como deixar o comando mais direto e funcional.

Depois, me entregue uma versão final pronta para colar no Lovable.

Não revise a plataforma Fábrica de Apps. Use a Fábrica apenas como guia da etapa. O app revisado é o meu projeto no Lovable.`;
};

const renderContextBlockExternal = (c: ProjectContext) =>
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

export type ReviewBuildInput = {
  context: ProjectContext;
  stepName: string;
  stepObjective?: string;
  isSecurity?: boolean;
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
10. O que precisa testar antes de publicar para deixar o app mais seguro e reduzir risco.

Use linguagem realista: "mais seguro", "reduzir risco", "proteger acesso", "testar antes de publicar". Não prometa app 100% seguro nem impossível de invadir.`;

const standardAnalysisBlock = `Analise:

1. O que esta etapa deveria ter implementado, organizado ou ajustado.
2. Onde isso aparece no app atual.
3. Se existe algo incompleto, quebrado, duplicado, confuso ou desalinhado.
4. Se a experiência funciona no desktop e no mobile.
5. Se há risco de quebrar login, banco, acesso, admin, checkout, entrega, progresso ou layout, quando fizer sentido.
6. O que ainda precisa ser corrigido antes de avançar.`;

export const buildReviewLovablePrompt = ({
  context,
  stepName,
  stepObjective,
  isSecurity,
}: ReviewBuildInput): string => {
  return `Contexto:
Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

A Fábrica é apenas o programa-guia. O app que deve ser revisado é o projeto atual que estou construindo no Lovable.

Contexto do meu app:
${renderContextBlockExternal(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

Pedido de revisão:
Revise se tudo que esta etapa pediu foi realmente aplicado no app atual.

${isSecurity ? securityAnalysisBlock : standardAnalysisBlock}

Não altere nada automaticamente sem explicar antes.

Entregue um relatório objetivo com:

- o que está correto
- o que está faltando
- o que precisa testar
- riscos encontrados
- próximo comando recomendado, se necessário.`;
};

export const buildReviewAgentPrompt = ({
  context,
  stepName,
  stepObjective,
  isSecurity,
}: ReviewBuildInput): string => {
  return `Estou usando a Fábrica de Apps com IA como guia para criar meu próprio aplicativo no Lovable.

A Fábrica é apenas o programa-guia. O app que deve ser revisado é o projeto atual que estou construindo no Lovable.

Contexto do meu app:
${renderContextBlockExternal(context)}

Etapa atual:
${stepName}

Objetivo desta etapa:
${stepObjective?.trim() || "[não informado]"}

Pedido:
Me ajude a revisar se tudo que esta etapa pediu foi realmente aplicado no meu projeto no Lovable.

${isSecurity ? securityAnalysisBlock : standardAnalysisBlock}

Depois, me sugira o próximo comando que eu deveria enviar ao Lovable se algo estiver faltando.

Não revise a plataforma Fábrica de Apps. Use a Fábrica apenas como guia da etapa. O app revisado é o meu projeto no Lovable.`;
};
