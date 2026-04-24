---
name: Régua de completude editorial dos arcanos no CMS
description: Duas réguas separadas (essencial de publicação 8/8 e editorial total 17/17) e backfill canônico dos 78 arcanos no admin
type: feature
---

## Fonte de verdade oficial

- **Maiores (22)**: `src/content/arcanos-maiores/index.ts` → `EDITORIAL_REGISTRY`
- **Menores (56)**: `src/content/arcanos-menores/index.ts` → `ARCANOS_MENORES`
- O painel admin (`cms_arcanos`) é **espelho** dessa fonte. Sincronização via `scripts/backfill-cms-arcanos-v2.mjs` + RPC `apply_arcano_backfill(jsonb)` (service role ou admin).

## Duas réguas oficiais

### Régua A — ESSENCIAL DE PUBLICAÇÃO (8 campos + revisão + keywords)
Avaliada por `cms_arcanos_essential_count(row)`. Trigger `enforce_arcano_editorial_status` força status:

| filled | status forçado | validated |
|--------|---------------|-----------|
| 0      | `empty`       | false     |
| 1–5    | `partial`     | false     |
| 6–9    | `draft` (rebaixa `published`) | false |
| 10     | livre (admin escolhe) | livre |

Campos: `essencia, simbolos_centrais, luz, sombra, amor, trabalho, espiritualidade, voz_do_arcano, revisao_rapida, keywords≥3`.

### Régua B — EDITORIAL TOTAL (17 campos · contador completo do admin)
Exibida em `AdminArcanos.tsx` como `EDITORIAL_FIELDS`:

1. essencia ★
2. simbolos_centrais ★
3. luz ★
4. sombra ★
5. amor ★
6. trabalho ★
7. espiritualidade ★
8. voz_do_arcano ★
9. aprofundamento
10. arquetipos
11. numerologia
12. astrologia
13. elemento
14. cabala
15. jornada
16. pratica
17. citacao

★ = essenciais (régua A). UI mostra "Ess 8/8 · Ed 17/17" em cada card e marca os essenciais com ★ no formulário.

## Como rodar o backfill 17/17

```bash
bun run scripts/backfill-cms-arcanos-v2.mjs   # gera /tmp/backfill-payload-v2.json
curl -X POST .../rest/v1/rpc/apply_arcano_backfill \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d "$(jq -c '{_payload: .}' /tmp/backfill-payload-v2.json)"
```

Os 9 campos não-essenciais são derivados de:
- **Maiores**: `archetype` → arquetipos; `deepDive.cabala` → cabala (com fallback Golden Dawn); `deepDive.text+symbolism+history` → aprofundamento; `voice.intro` → citacao; `initiationLesson + reflectionQuestions[0]` → pratica; tabela canônica RWS/Golden Dawn → numerologia/astrologia/elemento/jornada.
- **Menores**: `arquetipo` → arquetipos; `aprofundamento`; `vozDaCarta` (1ª frase) → citacao; `licaoPratica + perguntasReflexao[0]` → pratica; tabelas por naipe/posição → numerologia/astrologia/elemento/cabala/jornada.

## Estado atual (auditoria pós-backfill v2)

- 22 Maiores: 17/17 completos, 8/8 essenciais, publicados, validados
- 56 Menores: 17/17 completos, 8/8 essenciais, publicados, validados
- 0 incompletos no contador admin
