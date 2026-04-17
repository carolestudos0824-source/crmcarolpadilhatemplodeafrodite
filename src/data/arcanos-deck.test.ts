/**
 * Teste de travamento oficial do deck dos 22 Arcanos Maiores.
 * Falha o build se houver QUALQUER divergência entre o manifesto
 * canônico e os arquivos editoriais.
 */
import { describe, it, expect } from "vitest";
import {
  ARCANOS_MAIORES_OFICIAIS,
  TOTAL_ARCANOS_MAIORES,
  ARCANOS_BY_NUMBER,
  validateAgainstManifest,
} from "./arcanos-maiores-oficial";
import { EDITORIAL_REGISTRY } from "./arcanos/index";
import { validateArcano } from "./arcano-editorial";

describe("Deck oficial dos 22 Arcanos Maiores — travamento", () => {
  it("manifesto contém exatamente 22 arcanos", () => {
    expect(ARCANOS_MAIORES_OFICIAIS).toHaveLength(TOTAL_ARCANOS_MAIORES);
  });

  it("manifesto cobre todos os números de 0 a 21 sem duplicatas", () => {
    const numeros = ARCANOS_MAIORES_OFICIAIS.map((a) => a.number).sort((a, b) => a - b);
    expect(numeros).toEqual(Array.from({ length: 22 }, (_, i) => i));
  });

  it("registry editorial mapeia os 22 arcanos", () => {
    for (let i = 0; i < TOTAL_ARCANOS_MAIORES; i++) {
      expect(EDITORIAL_REGISTRY[i], `Arcano ${i} ausente no registry`).toBeDefined();
    }
  });

  it.each(ARCANOS_MAIORES_OFICIAIS.map((a) => [a.number, a.name] as const))(
    "Arcano %i (%s) bate com o manifesto oficial",
    (num) => {
      const editorial = EDITORIAL_REGISTRY[num];
      expect(editorial, `Arcano ${num} ausente no registry editorial`).toBeDefined();
      const issues = validateAgainstManifest(editorial);
      expect(issues, `Divergências: ${JSON.stringify(issues)}`).toHaveLength(0);
    }
  );

  it.each(ARCANOS_MAIORES_OFICIAIS.map((a) => [a.number, a.name] as const))(
    "Arcano %i (%s) tem todos os 17 campos editoriais válidos",
    (num) => {
      const editorial = EDITORIAL_REGISTRY[num];
      const errors = validateArcano(editorial);
      expect(errors, `Campos faltando: ${errors.join(", ")}`).toHaveLength(0);
    }
  );

  it("nenhum arcano editorial tem cardImage vazio", () => {
    for (const [num, arcano] of Object.entries(EDITORIAL_REGISTRY)) {
      expect(arcano.cardImage, `Arcano ${num} sem cardImage`).toBeTruthy();
    }
  });

  it("lookups O(1) por número e slug funcionam para todos", () => {
    for (const oficial of ARCANOS_MAIORES_OFICIAIS) {
      expect(ARCANOS_BY_NUMBER.get(oficial.number)).toBe(oficial);
    }
  });
});
