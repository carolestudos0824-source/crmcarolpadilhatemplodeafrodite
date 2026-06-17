import { APP_CONFIG } from "@/config/appConfig";

export type PlanId = "fabrica" | "blueprint" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  checkoutUrl: () => string;
}

export const PLANS: Plan[] = [
  {
    id: "fabrica",
    name: "Fábrica de Apps com IA",
    price: "R$97",
    description: "Para quem quer criar sozinho com o agente.",
    features: [
      "Acesso ao Agente Arquiteto Supremo de Aplicativos",
      "Prompt mestre completo",
      "Manual rápido de uso",
      "10 ideias de apps validáveis",
      "Checklist de MVP",
      "Checklist de monetização",
      "Checklist de lançamento",
      "Prompts bônus (Lovable, vendas, preços)",
    ],
    cta: "Comprar agora",
    checkoutUrl: () => APP_CONFIG.CHECKOUT_FABRICA_URL,
  },
  {
    id: "blueprint",
    name: "Blueprint do Seu App com IA",
    price: "R$497",
    description: "Para quem quer receber a estrutura pronta do próprio app.",
    highlight: true,
    features: [
      "Diagnóstico personalizado da ideia",
      "MVP estruturado",
      "Fluxo do usuário",
      "Modelo de dados",
      "Design recomendado",
      "Monetização",
      "Prompt Lovable pronto",
    ],
    cta: "Quero meu blueprint",
    checkoutUrl: () => APP_CONFIG.CHECKOUT_BLUEPRINT_URL,
  },
  {
    id: "premium",
    name: "App Estratégico com IA",
    price: "A partir de R$1.500",
    description: "Para quem quer acompanhamento e estrutura completa.",
    features: [
      "Estratégia completa",
      "Página de vendas",
      "Prompt de construção",
      "Monetização",
      "Plano de lançamento",
      "Acompanhamento inicial",
    ],
    cta: "Solicitar proposta no WhatsApp",
    checkoutUrl: () => APP_CONFIG.WHATSAPP_URL,
  },
];

export const getPlan = (id: string | null | undefined): Plan =>
  PLANS.find((p) => p.id === id) ?? PLANS[0];
