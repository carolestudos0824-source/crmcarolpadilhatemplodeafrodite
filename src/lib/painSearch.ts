// Busca Inteligente de Dor e Próximo Passo
// Análise local (sem IA externa) que mapeia uma "dor" digitada pelo usuário
// para um módulo do app, uma ação recomendada e um prompt sugerido.

import type { ModuleId } from "@/data/entregaModules";

export type RecommendedButton = "lovable" | "agent" | "open";

export type PainRecommendation = {
  pain: string;
  moduleId: ModuleId;
  moduleLabel: string;
  action: string;
  button: RecommendedButton;
  buttonLabel: string;
  why: string;
  avoid: string;
  prompt: string;
  checklist: string[];
};

type Rule = {
  id: string;
  keywords: string[];
  build: (raw: string) => PainRecommendation;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const hasAny = (text: string, words: string[]) => {
  const t = norm(text);
  return words.some((w) => t.includes(norm(w)));
};

// Ordem importa: regras mais específicas antes das genéricas.
const RULES: Rule[] = [
  {
    id: "checkout",
    keywords: [
      "vender", "venda", "cobrar", "pagamento", "pagar", "checkout",
      "stripe", "receber dinheiro", "compra", "comprar", "acesso pago",
    ],
    build: () => ({
      pain: "venda ainda não pronta",
      moduleId: "checkout",
      moduleLabel: "Checkout e entrega",
      action: "validar ou corrigir o pagamento real",
      button: "lovable",
      buttonLabel: "Copiar para o Lovable",
      why: "Sem checkout funcionando, nenhuma venda acontece. É o gargalo número um.",
      avoid: "Mexer em página de venda, copy ou layout antes de confirmar que o pagamento funciona.",
      prompt:
        "Implementar checkout Stripe em modo pagamento único (R$47) integrando com a função stripe-create-checkout. Após pagamento aprovado, o webhook deve liberar acesso em user_access.has_access = true para o user_id do comprador. Manter RLS, admin_grant_access_from_sale e a rota /entrega como estão.",
    }),
  },
  {
    id: "monetizacao",
    keywords: [
      "preco", "preço", "monetizar", "monetizacao", "monetização",
      "assinatura", "plano", "planos", "valor", "freemium", "venda unica", "venda única",
    ],
    build: () => ({
      pain: "modelo de monetização ainda indefinido",
      moduleId: "monetizacao",
      moduleLabel: "Monetização",
      action: "decidir o modelo de cobrança antes de mexer no checkout",
      button: "agent",
      buttonLabel: "Planejar com o Agente",
      why: "Definir preço e modelo (único, assinatura ou freemium) é decisão estratégica. Errar aqui custa caro depois.",
      avoid: "Implementar Stripe ou página de venda antes de fechar o modelo de cobrança.",
      prompt:
        "Analisar o app ativo e recomendar o melhor modelo de monetização (venda única, assinatura ou freemium), com preço sugerido, justificativa e próximo passo prático. Não implementar nada agora.",
    }),
  },
  {
    id: "seguranca",
    keywords: [
      "seguranca", "segurança", "login", "acesso", "rls", "permissao",
      "permissão", "dados privados", "vazamento", "autenticacao", "autenticação",
    ],
    build: () => ({
      pain: "dúvida ou risco de segurança no app",
      moduleId: "seguranca",
      moduleLabel: "Segurança do App",
      action: "auditar autenticação, RLS e permissões antes de qualquer outra mudança",
      button: "agent",
      buttonLabel: "Planejar com o Agente",
      why: "Falha de segurança expõe dados de usuários e quebra confiança. Precisa diagnóstico antes de aplicar correção.",
      avoid: "Aplicar correções amplas de RLS sem entender o impacto em login, admin e checkout.",
      prompt:
        "Auditar a segurança do app ativo: autenticação, políticas RLS, permissões por papel, exposição de dados privados e risco de vazamento entre usuários. Entregar diagnóstico com prioridades e próximo passo prático. Não alterar nada agora.",
    }),
  },
  {
    id: "telas",
    keywords: [
      "tela", "telas", "layout", "landing", "visual", "copy", "conversao",
      "conversão", "pagina de venda", "página de venda", "hero", "design",
    ],
    build: () => ({
      pain: "ajuste de tela, landing ou copy",
      moduleId: "venda",
      moduleLabel: "Página de venda",
      action: "planejar a mudança visual ou de copy antes de aplicar",
      button: "agent",
      buttonLabel: "Planejar com o Agente",
      why: "Mexer em tela sem plano gera retrabalho e quebra layout. Decidir antes economiza créditos.",
      avoid: "Refatorar layout inteiro ou trocar fontes/cores sem aprovar o plano.",
      prompt:
        "Analisar a página de venda / tela atual do app ativo e recomendar 3 ajustes objetivos de copy, hierarquia visual ou CTA com maior impacto em conversão. Não implementar agora.",
    }),
  },
  {
    id: "erros",
    keywords: [
      "erro", "bug", "nao funciona", "não funciona", "quebrou", "falha",
      "falhou", "parou de funcionar", "tela branca",
    ],
    build: () => ({
      pain: "erro ou bug ativo no app",
      moduleId: "erros",
      moduleLabel: "Erros comuns",
      action: "diagnosticar a causa antes de pedir correção ao Lovable",
      button: "agent",
      buttonLabel: "Planejar com o Agente",
      why: "Pedir correção sem diagnóstico costuma piorar o bug. Diagnosticar primeiro economiza créditos.",
      avoid: "Mandar 'conserta isso' direto para o Lovable sem descrever sintoma, console e passo a passo.",
      prompt:
        "Diagnosticar o erro relatado no app ativo. Listar causa provável, arquivos envolvidos e correção mínima segura. Depois gerar um prompt para o Lovable que aplique só essa correção, sem mexer em login, banco, checkout ou layout.",
    }),
  },
  {
    id: "proximo-passo",
    keywords: [
      "nao sei o proximo passo", "não sei o próximo passo",
      "estou perdido", "perdido", "o que faço agora", "o que fazer agora",
      "qual prompt usar", "qual prompt copiar", "nao sei qual prompt",
      "não sei qual prompt", "proximo passo", "próximo passo",
    ],
    build: () => ({
      pain: "dúvida de próximo passo",
      moduleId: "planejar",
      moduleLabel: "Próximo Passo",
      action: "deixar o Agente analisar o estado do app e decidir a etapa correta",
      button: "agent",
      buttonLabel: "Planejar com o Agente",
      why: "Antes de executar, o sistema precisa decidir qual é a próxima etapa mais importante do seu app.",
      avoid: "Sair copiando prompts sem saber em que fase do app você está.",
      prompt:
        "Analisar o estado atual do app ativo (o que já existe, o que falta, o que está bloqueando venda) e recomendar a próxima ação mais importante. Indicar qual módulo abrir e se deve usar o Agente ou o Lovable. Não implementar agora.",
    }),
  },
];

export const PAIN_EXAMPLES = [
  "quero vender meu app",
  "não sei o próximo passo",
  "quero monetizar",
  "meu checkout não funciona",
  "quero melhorar a landing",
  "meu login não está seguro",
];

export function analyzePain(input: string): PainRecommendation | null {
  const text = (input ?? "").trim();
  if (text.length < 3) return null;

  // Casos compostos: "vender" + "não sei o próximo passo" → checkout vence,
  // porque ter venda funcional é pré-requisito de qualquer próximo passo.
  for (const rule of RULES) {
    if (hasAny(text, rule.keywords)) {
      return rule.build(text);
    }
  }

  // Fallback: trata como "próximo passo".
  return RULES.find((r) => r.id === "proximo-passo")!.build(text);
}
