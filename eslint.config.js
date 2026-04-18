import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Padrões legados de conteúdo proibidos fora do content-adapter.
 *
 * Fase 5B — Cleanup do legado ativo:
 *   o app só pode ler conteúdo vivo via `@/lib/content`.
 *   Os arquivos `src/data/**` continuam existindo como backup / seed /
 *   rollback, mas nenhuma página, componente ou hook pode importá-los.
 *
 * Únicos arquivos autorizados a importar `src/data/**` (configurados abaixo
 * em `files` overrides):
 *   - src/lib/content/**          (repo-legacy, mappers-legacy, visual-registry)
 *   - src/data/**                 (relações internas entre datasets)
 *   - src/components/admin/**     (admin lê EDITORIAL_REGISTRY p/ semear)
 *   - **\/*.test.ts(x)            (testes de regressão do legado)
 */
const LEGACY_CONTENT_PATTERNS = [
  {
    group: ["@/data/arcanos", "@/data/arcanos/*"],
    message:
      "[Fase 5B] Não importe arcanos legados direto. Use @/lib/content (getArcanoContent / listArcanosContent).",
  },
  {
    group: ["@/data/arcanos-menores", "@/data/arcanos-menores/*"],
    message:
      "[Fase 5B] Não importe arcanos menores legados direto. Use @/lib/content.",
  },
  {
    group: [
      "@/data/amor",
      "@/data/fundamentos",
      "@/data/pratica",
      "@/data/tiragens",
      "@/data/mesa-taro",
      "@/data/leitura-simbolica",
      "@/data/leitura-aplicada",
      "@/data/espiritualidade",
      "@/data/trabalhar-taro",
      "@/data/combinacoes",
      "@/data/arquitetura-menores",
      "@/data/fool-lesson-content",
      "@/data/arcano-editorial",
      "@/data/arcanos-maiores-oficial",
    ],
    message:
      "[Fase 5B] Conteúdo de lições/módulos só via @/content/lessons ou @/lib/content.",
  },
  {
    group: [
      "@/data/deck-registry",
      "@/data/arcano-vivo-config",
      "@/data/fools-journey-visual",
    ],
    message:
      "[Fase 6.6 — Faxina final] Configs técnicas movidas. Use @/registry/* ou @/config/*.",
  },
  {
    group: [
      "@/data/daily-challenges",
      "@/data/certificates",
      "@/data/symbol-library",
      "@/data/fools-journey",
      "@/data/review-data",
      "@/data/tarot-data",
    ],
    message:
      "[Fase 6.6 — Faxina final] Conteúdo legado. Use @/lib/content (adaptador).",
  },
];

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-imports": [
        "warn",
        { patterns: LEGACY_CONTENT_PATTERNS },
      ],
    },
  },
  // Exceções: arquivos autorizados a tocar o legado.
  {
    files: [
      "src/lib/content/**/*.{ts,tsx}",
      "src/data/**/*.{ts,tsx}",
      "src/components/admin/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
);
