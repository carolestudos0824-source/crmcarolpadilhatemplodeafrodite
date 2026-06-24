import { describe, it, expect } from "vitest";
import { COMMANDS_CONSTRUIR } from "@/data/entregaModules";

describe("COMMANDS_CONSTRUIR Etapa 1 — construção (não plano)", () => {
  const etapa1 = COMMANDS_CONSTRUIR[0];
  const content = etapa1.content;

  it("título é executivo de construção", () => {
    expect(etapa1.title).toMatch(/Criar base inicial do app/i);
  });

  it("contém token [nome do app ativo] para injeção", () => {
    expect(content).toContain("[nome do app ativo]");
  });

  it("ordena o Lovable a construir, não a planejar", () => {
    expect(content).toMatch(/^Construa a primeira versão do app/);
  });

  it("não contém frases de planejamento proibidas", () => {
    expect(content).not.toMatch(/Não escreva código ainda/i);
    expect(content).not.toMatch(/Não crie telas ainda/i);
    expect(content).not.toMatch(/Primeiro entregue o plano/i);
    expect(content).not.toMatch(/Antes de construir, gere um plano/i);
  });

  it("não contém placeholders de descrição manual", () => {
    expect(content).not.toContain("[descreva sua ideia]");
    expect(content).not.toContain("[descreva o público]");
    expect(content).not.toContain("[descreva a dor]");
  });

  it("não usa 'Fábrica de Apps' como app-alvo", () => {
    expect(content).not.toMatch(/Fábrica de Apps/i);
  });

  it("substitui [nome do app ativo] pelo nome real selecionado", () => {
    const text = content.split("[nome do app ativo]").join("Clube de Receitas");
    expect(text).toContain("Construa a primeira versão do app Clube de Receitas");
    expect(text).not.toContain("[nome do app ativo]");
  });
});
