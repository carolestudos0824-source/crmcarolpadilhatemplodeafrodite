# `src/data/**` — Conteúdo legado (DEPRECATED para runtime)

**Status:** Fase 5B concluída. Estes arquivos **não são mais lidos diretamente
pelo runtime**. Toda a UI consome conteúdo via `@/lib/content`.

## Por que ainda existem

1. **Backup imutável** — referência fiel da curadoria editorial inicial.
2. **Seed** — base oficial para popular `cms_arcanos`, `cms_modules`,
   `cms_module_lessons`, `cms_quizzes` e `cms_quiz_questions`.
3. **Rollback** — se `CONTENT_FLAGS` voltar para `"fallback"` em qualquer
   domínio, o adapter reativa estes arquivos via `repo-legacy.ts`.

## Quem ainda pode importar daqui

Apenas estes caminhos (regra ESLint `no-restricted-imports`):

| Caminho | Motivo |
|---|---|
| `src/lib/content/repo-legacy.ts` | Único repositório autorizado |
| `src/lib/content/mappers-legacy.ts` | Tipagens de bridge |
| `src/lib/content/visual-registry.ts` | Mapa visual de cartas |
| `src/data/**` | Relações internas entre datasets |
| `src/components/admin/**` | Painel admin (semente / preview) |
| `**/*.test.{ts,tsx}` | Testes de regressão |

Qualquer outro `import "@/data/..."` em `src/pages`, `src/components` ou
`src/hooks` é **bloqueado por lint** e deve ser substituído por:

```ts
import { getModuleContent, getLessonContent, getArcanoContent } from "@/lib/content";
```

## Como reativar o legado (rollback)

Edite `src/lib/content/flags.ts` e troque o domínio para `"fallback"`:

```ts
export const CONTENT_FLAGS = {
  arcanos:  "fallback", // ← rollback total deste domínio
  quizzes:  "auto",
  lessons:  "auto",
  modules:  "auto",
};
```

## Quando deletar

Só após a Fase 6 (áreas especiais migradas) e Fase 7 (telemetria confirma
zero `usedFallback=true` em produção por 30 dias). Até lá: **NÃO REMOVER**.
