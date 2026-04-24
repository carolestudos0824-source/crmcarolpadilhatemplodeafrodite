---
name: Régua de completude editorial dos arcanos no CMS
description: Fonte de verdade canônica, campos obrigatórios e regra automática de status para os 78 arcanos no admin
type: feature
---

## Fonte de verdade oficial

- **Maiores (22)**: `src/content/arcanos-maiores/index.ts` → `EDITORIAL_REGISTRY`
- **Menores (56)**: `src/content/arcanos-menores/index.ts` → `ARCANOS_MENORES`
- O painel admin (`cms_arcanos`) é **espelho** dessa fonte. Sincronização via `scripts/backfill-cms-arcanos.mjs` + `scripts/run-backfill.mjs` que chamam `apply_arcano_backfill(jsonb)` (RPC, service role ou admin).

## 10 campos essenciais (régua mínima)

Cada carta é avaliada por `cms_arcanos_essential_count(row)`:
1. `essencia`
2. `simbolos_centrais`
3. `luz`
4. `sombra`
5. `amor`
6. `trabalho`
7. `espiritualidade`
8. `voz_do_arcano`
9. `revisao_rapida`
10. `keywords` (≥ 3 entradas)

## Regra automática de status (trigger `enforce_arcano_editorial_status`)

| filled | status forçado | validated |
|--------|---------------|-----------|
| 0      | `empty`       | false     |
| 1–5    | `partial`     | false     |
| 6–9    | `draft` (rebaixa `published`) | false |
| 10     | livre (admin escolhe) | livre |

Carta com qualquer essencial vazio **não pode** ser publicada nem validada.

## Como rodar o backfill

```bash
bun run scripts/backfill-cms-arcanos.mjs   # gera /tmp/backfill-payload.json
bun -e '...'                                # POST /rest/v1/rpc/apply_arcano_backfill com service role
```

## Estado atual (auditoria pós-backfill)

- 22 Maiores: 100% completos, publicados, validados
- 56 Menores: 100% completos, publicados, validados
- 0 incompletos, 0 vazios
