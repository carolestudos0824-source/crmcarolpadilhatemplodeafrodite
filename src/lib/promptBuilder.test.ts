import { describe, it, expect } from "vitest";
import { buildAgentPrompt, buildLovablePrompt, detectAgentIntent } from "./promptBuilder";
import { EMPTY_PROJECT_CONTEXT } from "@/hooks/useProjectContext";

const ctx = {
  ...EMPTY_PROJECT_CONTEXT,
  appName: "Agenda Terapêutica",
  appDoes: "Organiza atendimentos e vendas",
  audience: "Terapeutas",
  problem: "Vendas perdidas no WhatsApp",
  promise: "Atender e vender em um só app",
};

const jogoDoAmor = {
  ...EMPTY_PROJECT_CONTEXT,
  appName: "Clube de Receitas",
  appDoes: "Receitas e cardápios para famílias",
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

  it("moduleId 'seguranca' gera intenção 'seguranca' com bloco específico", () => {
    expect(detectAgentIntent({ moduleId: "seguranca" })).toBe("seguranca");
    expect(detectAgentIntent({ command: "preciso revisar RLS e permissões" })).toBe("seguranca");
    expect(detectAgentIntent({ command: "tem risco de vazamento entre usuários" })).toBe("seguranca");

    const p = buildAgentPrompt({
      context: ctx,
      stepName: "Revisar segurança",
      command: "Quero auditar a segurança do app",
      moduleId: "seguranca",
    });
    expect(p).toMatch(/Modo Segurança/);
    expect(p).toMatch(/RLS/);
    expect(p).toMatch(/permiss/i);
    expect(p).toMatch(/autenticaç/i);
    expect(p).toMatch(/autorizaç/i);
    expect(p).toMatch(/dados privados/i);
    expect(p).toMatch(/vazamento entre usuários/i);
    expect(p).toMatch(/testes manuais de segurança/i);
    expect(p).toMatch(/Próximo passo/i);
    expect(p).toMatch(/no máximo 3 perguntas/i);
  });

  it("formato obrigatório do agente tem 7 passos, incluindo próximo passo", () => {
    const p = buildAgentPrompt({
      context: ctx,
      stepName: "Etapa qualquer",
      command: "Me ajude a decidir",
      moduleId: "legal",
    });
    // Verifica os 7 itens numerados do formato obrigatório
    for (const n of [1, 2, 3, 4, 5, 6, 7]) {
      expect(p).toMatch(new RegExp(`\\n${n}\\. `));
    }
    expect(p).toMatch(/Próximo passo recomendado/);
  });
});

describe("contexto do app ativo — separação plataforma × app-alvo", () => {
  it("Prompt para Lovable usa o nome do app ativo, não 'Fábrica de Apps'", () => {
    const p = buildLovablePrompt({
      context: jogoDoAmor,
      stepName: "Definir telas",
      command: "Crie as telas iniciais",
      moduleId: "telas",
    });
    expect(p).toMatch(/Clube de Receitas/);
    expect(p).toMatch(/Use este prompt no projeto Lovable do app: Clube de Receitas/);
    expect(p).not.toMatch(/projeto Lovable do app: Fábrica de Apps/i);
    expect(p).not.toMatch(/não a plataforma/i);
  });

  it("Prompt para o Agente usa o nome do app ativo", () => {
    const p = buildAgentPrompt({
      context: jogoDoAmor,
      stepName: "Definir monetização",
      command: "Como cobrar pelo Clube de Receitas?",
      moduleId: "monetizacao",
    });
    expect(p).toMatch(/Estou criando o app Clube de Receitas/);
    expect(p).toMatch(/Clube de Receitas/);
    expect(p).not.toMatch(/Fábrica de Apps/i);
  });

  it("não mostra [não preenchido] em massa quando faltam dados", () => {
    const sparse = { ...EMPTY_PROJECT_CONTEXT, appName: "Clube de Receitas", appDoes: "App para receitas" };
    const p = buildLovablePrompt({
      context: sparse,
      stepName: "MVP",
      command: "Defina o MVP",
      moduleId: "mvp",
    });
    // Não deve repetir "[não preenchido]" dezenas de vezes
    const matches = p.match(/\[não preenchido\]/g) ?? [];
    expect(matches.length).toBe(0);
    // Mas deve incluir a nota amigável (contexto parcial — só 1 campo essencial preenchido)
    expect(p).toMatch(/Contexto parcial/);
  });

  it("fallback de nome do app quando appName está vazio", () => {
    const sem = { ...EMPTY_PROJECT_CONTEXT };
    const p = buildAgentPrompt({
      context: sem,
      stepName: "Qualquer",
      command: "Me ajude",
    });
    expect(p).toMatch(/app ainda sem nome/);
    expect(p).not.toMatch(/Fábrica de Apps/i);
  });

  it("nenhum prompt confunde a Fábrica de Apps com o app-alvo do usuário", () => {
    const pL = buildLovablePrompt({ context: ctx, stepName: "X", command: "Y", moduleId: "telas" });
    const pA = buildAgentPrompt({ context: ctx, stepName: "X", command: "Y", moduleId: "telas" });
    expect(pL).not.toMatch(/não a plataforma Fábrica de Apps/i);
    expect(pA).not.toMatch(/não a plataforma Fábrica de Apps/i);
    // O app-alvo do prompt deve ser o do usuário, não a Fábrica.
    expect(pL).toMatch(/projeto Lovable do app: Agenda Terapêutica/);
    expect(pL).not.toMatch(/projeto Lovable do app: Fábrica de Apps/i);
    expect(pA).not.toMatch(/projeto Lovable do app: Fábrica de Apps/i);
  });
});

