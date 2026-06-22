import { describe, it, expect } from "vitest";
import { buildAgentPrompt, detectAgentIntent } from "./promptBuilder";
import { EMPTY_PROJECT_CONTEXT } from "@/hooks/useProjectContext";

const ctx = {
  ...EMPTY_PROJECT_CONTEXT,
  appName: "Agenda Terapêutica",
  appDoes: "Organiza atendimentos e vendas",
  audience: "Terapeutas",
  problem: "Vendas perdidas no WhatsApp",
  promise: "Atender e vender em um só app",
};

describe("buildAgentPrompt — modo consultivo inteligente", () => {
  it("nunca instrui a responder apenas com perguntas", () => {
    const p = buildAgentPrompt({
      context: ctx,
      stepName: "Definir monetização",
      command: "Como devo cobrar pelo meu app?",
      moduleId: "monetizacao",
    });
    expect(p).toMatch(/Não me devolva apenas perguntas/i);
    expect(p).toMatch(/no máximo 3 perguntas/i);
    expect(p).toMatch(/Recomendação principal/i);
    expect(p).toMatch(/assuma hipóteses razoáveis/i);
  });

  it("modo Monetização inclui blocos obrigatórios (preço, gratuito, pago, oferta, upsell)", () => {
    const p = buildAgentPrompt({
      context: ctx,
      stepName: "Definir monetização",
      command: "Quero definir preço e modelo de cobrança",
      moduleId: "monetizacao",
    });
    expect(p).toMatch(/Modo Monetização/);
    expect(p).toMatch(/Preço inicial sugerido/i);
    expect(p).toMatch(/O que fica gratuito/i);
    expect(p).toMatch(/O que fica pago/i);
    expect(p).toMatch(/Oferta principal/i);
    expect(p).toMatch(/Upsell futuro/i);
    expect(p).toMatch(/Justificativa comercial/i);
  });

  it("proíbe implementação e fecha pedindo virar prompt Lovable", () => {
    const p = buildAgentPrompt({
      context: ctx,
      stepName: "Melhorar tela inicial",
      command: "O hero está confuso",
      moduleId: "telas",
    });
    expect(p).toMatch(/Não implemente nada/);
    expect(p).toMatch(/Não gere código ainda/);
    expect(p).toMatch(/transformar a análise em um prompt pronto para Lovable/i);
  });

  it("detectAgentIntent reconhece monetização, ux_tela, criar_app e oferta", () => {
    expect(detectAgentIntent({ command: "preciso definir preço e assinatura" })).toBe("monetizacao");
    expect(detectAgentIntent({ moduleId: "telas" })).toBe("ux_tela");
    expect(detectAgentIntent({ command: "vou criar um app do zero" })).toBe("criar_app");
    expect(detectAgentIntent({ moduleId: "venda" })).toBe("oferta_vendas");
    expect(detectAgentIntent({ command: "estou com um bug, tela branca" })).toBe("bug");
  });
});
