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
    price: "R$197",
    priceNote: "à vista. Parcelamento no cartão.",
    description:
      "Acesso completo à plataforma guiada para sair da ideia, organizar o MVP, criar prompts melhores e construir no Lovable com mais clareza e menos retrabalho.",
    highlight: true,
    features: [
      "Acesso à plataforma guiada",
      "Projeto em foco com contexto personalizado",
      "Próximo passo recomendado em cada etapa",
      "Prompts estruturados prontos para o Lovable",
      "Checklists de avanço por módulo",
      "Jornada para começar do zero",
      "Jornada para construir por versões",
      "Jornada para auditar app existente",
      "Módulos: Planejamento, MVP, Telas e Fluxo, Login e Banco",
      "Módulos: Monetização, Checkout, Auditoria de Segurança",
      "Módulo Melhorias e Versões + Estado Atual do Projeto",
      "Agente Arquiteto de Aplicativos",
      "Garantia de 7 dias para conhecer por dentro",
    ],
    cta: "Quero acessar por R$197",
    checkoutUrl: () => APP_CONFIG.CHECKOUT_FABRICA_URL,
  },
];

export const getPlan = (_id?: string | null): Plan => PLANS[0];
