import { describe, it, expect } from "vitest";
import {
  DECK_MENORES_REGISTRY,
  validateDeckIntegrity,
  getDeckByTipo,
  getDeckByNaipe,
  getDeckEntryBySlug,
  DECK_OFICIAL_FLAG,
  FROZEN_DECK,
  FROZEN_DECK_VERSION,
  DECK_MENORES_OFICIAL,
} from "./deck-registry";

describe("Deck Menores — registry oficial", () => {
  it("contém exatamente 56 cartas", () => {
    expect(DECK_MENORES_REGISTRY).toHaveLength(56);
  });

  it("tem 40 numeradas e 16 cortes", () => {
    expect(getDeckByTipo("numerada")).toHaveLength(40);
    expect(getDeckByTipo("corte")).toHaveLength(16);
  });

  it("tem 14 cartas por naipe", () => {
    for (const n of ["copas", "paus", "espadas", "ouros"] as const) {
      expect(getDeckByNaipe(n)).toHaveLength(14);
    }
  });

  it("não tem nenhuma inconsistência estrutural", () => {
    const issues = validateDeckIntegrity();
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
  });

  it("resolve por slug canônico", () => {
    expect(getDeckEntryBySlug("as-de-copas")?.id).toBe("copas-1");
    expect(getDeckEntryBySlug("rainha-de-espadas")?.id).toBe("espadas-rainha");
    expect(getDeckEntryBySlug("dez-de-ouros")?.id).toBe("ouros-10");
  });
});

describe("Deck Menores — FREEZE oficial", () => {
  it("o deck está marcado como oficial", () => {
    expect(DECK_MENORES_OFICIAL).toBe(true);
    expect(DECK_OFICIAL_FLAG.oficial).toBe(true);
    expect(DECK_OFICIAL_FLAG.total).toBe(56);
    expect(FROZEN_DECK_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("a tabela congelada tem 56 cartas únicas (id, slug, nome)", () => {
    expect(FROZEN_DECK).toHaveLength(56);
    const ids = new Set(FROZEN_DECK.map(c => c.id));
    const slugs = new Set(FROZEN_DECK.map(c => c.slug));
    const nomes = new Set(FROZEN_DECK.map(c => c.nome));
    expect(ids.size).toBe(56);
    expect(slugs.size).toBe(56);
    expect(nomes.size).toBe(56);
  });

  it("é imutável em runtime (Object.freeze)", () => {
    expect(Object.isFrozen(FROZEN_DECK)).toBe(true);
    expect(Object.isFrozen(FROZEN_DECK[0])).toBe(true);
  });

  it("registry e freeze concordam em id, nome, slug, naipe, posição e imagem", () => {
    for (const f of FROZEN_DECK) {
      const e = DECK_MENORES_REGISTRY.find(x => x.id === f.id);
      expect(e, `Carta ${f.id} faltando no registry`).toBeDefined();
      expect(e!.nome).toBe(f.nome);
      expect(e!.slug).toBe(f.slug);
      expect(e!.naipe).toBe(f.naipe);
      expect(String(e!.posicao)).toBe(String(f.posicao));
      expect(e!.cardImage).toBe(f.cardImage);
    }
  });
});

