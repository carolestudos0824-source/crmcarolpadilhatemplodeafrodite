import { describe, expect, it } from "vitest";
import {
  flattenStructuredText,
  parseEditorialField,
  parseQuizStatus,
  parseStatus,
  parseTier,
} from "../parser";

describe("content/parser", () => {
  describe("parseStatus", () => {
    it("traduz enum DB para PT", () => {
      expect(parseStatus("published")).toBe("publicado");
      expect(parseStatus("draft")).toBe("rascunho");
      expect(parseStatus("partial")).toBe("parcial");
      expect(parseStatus("empty")).toBe("vazio");
      expect(parseStatus(null)).toBe("vazio");
      expect(parseStatus(undefined)).toBe("vazio");
    });
  });

  describe("parseQuizStatus", () => {
    it("usa o mesmo conjunto de status canônicos", () => {
      expect(parseQuizStatus("published")).toBe("publicado");
      expect(parseQuizStatus("draft")).toBe("rascunho");
      expect(parseQuizStatus("partial")).toBe("parcial");
      expect(parseQuizStatus("empty")).toBe("vazio");
      expect(parseQuizStatus(null)).toBe("vazio");
    });
  });

  describe("parseTier", () => {
    it("free vs premium", () => {
      expect(parseTier("free")).toBe("free");
      expect(parseTier("premium")).toBe("premium");
      expect(parseTier(null)).toBe("premium");
    });
  });

  describe("flattenStructuredText", () => {
    it("voice { intro, fullText } → markdown", () => {
      const out = flattenStructuredText({ intro: "Sou o Louco.", fullText: "Saio para a estrada." });
      expect(out).toContain("Sou o Louco.");
      expect(out).toContain("Saio para a estrada.");
    });

    it("interpretation { light, shadow } → markdown", () => {
      const out = flattenStructuredText({ light: "amor novo", shadow: "ilusão" });
      expect(out).toContain("Luz:");
      expect(out).toContain("Sombra:");
    });

    it("array de symbols → bullets", () => {
      const out = flattenStructuredText([
        { name: "rosa branca", meaning: "pureza" },
        { name: "cão", meaning: "instinto" },
      ]);
      expect(out).toContain("rosa branca");
      expect(out).toContain("instinto");
    });

    it("string passa direto", () => {
      expect(flattenStructuredText("já é texto")).toBe("já é texto");
    });

    it("null/vazio → undefined", () => {
      expect(flattenStructuredText(null)).toBeUndefined();
      expect(flattenStructuredText("")).toBeUndefined();
    });
  });

  describe("parseEditorialField", () => {
    it("aceita JSON-string e achata", () => {
      const json = JSON.stringify({ light: "L", shadow: "S" });
      const out = parseEditorialField(json);
      expect(out).toContain("Luz:");
    });

    it("string normal passa direto", () => {
      expect(parseEditorialField("texto puro")).toBe("texto puro");
    });
  });
});
