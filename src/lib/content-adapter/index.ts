/**
 * Alias oficial da camada adaptadora de conteúdo (Fase 0).
 *
 * Toda a implementação vive em `src/lib/content/`. Este arquivo existe
 * porque o nome canônico aprovado para a fundação é `content-adapter`.
 *
 * REGRA DE OURO PARA AS TELAS:
 * importe sempre daqui (ou de `@/hooks/use-content`).
 * NUNCA importe direto de `src/data/arcanos*` ou `src/data/*_LESSONS`.
 */

export * from "@/lib/content";
