import { APP_CONFIG } from "@/config/appConfig";

export type PlanId = "fabrica";

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
    price: "R$47",
    priceNote: "Preço de lançamento",
    description:
      "Para quem quer transformar ideias em aplicativos estruturados usando IA, sem programar e sem começar do zero.",
    highlight: true,
    features: [
      "Acesso ao Agente Arquiteto Supremo de Aplicativos",
      "Prompt Mestre Universal",
      "Manual rápido de uso",
      "Prompt para Lovable",
      "Prompt para Landing Page",
      "Prompt para Página de Preços",
      "Prompt para Checkout",
      "Prompt para Monetização",
      "Prompt para Lançamento",
      "Checklist de MVP",
      "Checklist de Monetização",
      "Checklist de Validação dos 7 Dias",
      "10 ideias de apps validáveis",
    ],
    cta: "Acessar agora por R$47",
    checkoutUrl: () => APP_CONFIG.CHECKOUT_FABRICA_URL,
  },
];

export const getPlan = (_id?: string | null): Plan => PLANS[0];
