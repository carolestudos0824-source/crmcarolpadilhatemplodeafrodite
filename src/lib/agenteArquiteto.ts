// Constante e helper únicos para abrir o Agente Arquiteto de Aplicativos.
// Usado por todos os botões "Revisar com o Agente" no programa.
export const AGENTE_ARQUITETO_URL =
  "https://chatgpt.com/g/g-6a331f876adc8191a174b85fa0aac1bf-agente-arquiteto-de-aplicativos";

export const openAgenteArquiteto = () => {
  if (typeof window === "undefined") return;
  window.open(AGENTE_ARQUITETO_URL, "_blank", "noopener,noreferrer");
};
