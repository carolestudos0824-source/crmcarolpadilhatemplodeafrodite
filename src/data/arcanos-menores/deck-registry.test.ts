import { describe, it, expect } from "vitest";
import {
  DECK_MENORES_REGISTRY,
  validateDeckIntegrity,
  getDeckByTipo,
  getDeckByNaipe,
  getDeckEntryBySlug,
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
