import { describe, expect, it } from "vitest";
import { analyzePain } from "./painSearch";

describe("analyzePain", () => {
  it("recomenda Checkout para dor de venda", () => {
    const r = analyzePain("quero vender meu app");
    expect(r?.moduleId).toBe("checkout");
    expect(r?.button).toBe("lovable");
  });

  it("recomenda Próximo Passo quando o usuário está perdido", () => {
    const r = analyzePain("não sei o próximo passo");
    expect(r?.moduleId).toBe("planejar");
    expect(r?.button).toBe("agent");
  });

  it("recomenda Monetização para dúvida de preço/plano", () => {
    const r = analyzePain("quero monetizar e definir preço");
    // 'vender'/'cobrar' não estão presentes; deve cair em monetização
    expect(r?.moduleId).toBe("monetizacao");
    expect(r?.button).toBe("agent");
  });

  it("recomenda Segurança quando o login está em risco", () => {
    const r = analyzePain("meu login não está seguro");
    expect(r?.moduleId).toBe("seguranca");
  });

  it("recomenda Página de venda / Telas para melhorias visuais", () => {
    const r = analyzePain("quero melhorar a landing");
    expect(r?.moduleId).toBe("venda");
    expect(r?.button).toBe("agent");
  });

  it("recomenda Erros comuns para bug", () => {
    const r = analyzePain("um botão quebrou e não funciona");
    expect(r?.moduleId).toBe("erros");
  });

  it("retorna null para input muito curto", () => {
    expect(analyzePain("")).toBeNull();
    expect(analyzePain("ok")).toBeNull();
  });

  it("usa fallback de próximo passo para texto não reconhecido", () => {
    const r = analyzePain("blablabla qualquer coisa aleatoria");
    expect(r?.moduleId).toBe("planejar");
  });

  it("prioriza Checkout quando o texto fala em vender E está perdido", () => {
    const r = analyzePain("quero vender meu app mas não sei o próximo passo");
    expect(r?.moduleId).toBe("checkout");
  });
});
