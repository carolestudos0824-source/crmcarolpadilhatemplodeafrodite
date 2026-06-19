export const APP_CONFIG = {
  // ====== Configuração comercial obrigatória ======
  // Preencher com URL real do checkout (gateway de pagamento) ou link de WhatsApp (https://wa.me/...).
  // Enquanto estiver com o valor placeholder abaixo, os botões de pagamento mostram aviso amigável.
  CHECKOUT_FABRICA_URL: "COLE_AQUI_A_URL_REAL",
  SUPORTE_EMAIL: "carolestudos0824@gmail.com",
  GPT_AGENT_URL: "https://chatgpt.com/g/g-6a331f876adc8191a174b85fa0aac1bf-arquiteto-de-aplicativos",

  // ====== Dados legais — preencher antes da venda pública ======
  // Se vazios, /termos e /privacidade exibem aviso de "dados em atualização".
  COMPANY_NAME: "",
  COMPANY_DOCUMENT: "",
  RESPONSIBLE_NAME: "",

  // ====== Faixa de anúncio ======
  SHOW_ANNOUNCEMENT_BAR: true,
  ANNOUNCEMENT_TEXT: "⚡ Oferta de lançamento ativa — Acesso completo por R$47 · Liberação após confirmação do pagamento",
  ANNOUNCEMENT_CTA_TEXT: "Garantir acesso por R$47 →",
  ANNOUNCEMENT_CTA_LINK: "/checkout?plano=fabrica",
  SUPPORT_EMAIL_SUBJECT: "Suporte — Fábrica de Apps com IA",
  CHECKOUT_INITIATED_FLAG: "fabrica_checkout_initiated",
};
