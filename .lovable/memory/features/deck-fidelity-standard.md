---
name: deck-fidelity-standard
description: Padrão oficial de fidelidade visual do deck — scan canônico Rider-Waite-Smith para todas as 78 cartas, com UI do app ao redor
type: feature
---

# Padrão de Fidelidade do Deck (Rider-Waite-Smith)

## Decisão definitiva

O app ensina **Rider-Waite-Smith (1909)**. A imagem da carta é **canônica**, nunca reilustrada por IA.

## Regra das camadas

| Camada | Tratamento |
|---|---|
| **Carta** (asset) | Scan oficial RWS de Pamela Colman Smith, 1909. Domínio público nos EUA. NUNCA reilustrar. |
| **Fundo / atmosfera** | Identidade do app: gradientes radiais, partículas, glow âmbar/dourado. Pode variar por arcano. |
| **Moldura da carta** | UI do app: borda dourada, sombra, corner ornaments. Não desenhar sobre a arte. |
| **Tipografia externa** | Fontes do app (Cinzel, Cormorant Garamond, Inter). Numeral e título exibidos FORA da carta também, como reforço pedagógico. |
| **Animações** | Vivência simbólica do app: respirar, shimmer, spotlights. Sempre por cima/ao redor — nunca alterando a arte. |

## Fonte canônica

- **Wikimedia Commons** — coleção `Rider-Waite Tarot deck` (PD-US, 1909)
- URL base: `https://upload.wikimedia.org/wikipedia/commons/`
- O Louco (piloto): `9/90/RWS_Tarot_00_Fool.jpg`

## Pipeline de instalação (por carta)

1. `curl` do scan original
2. Resize para 800px de largura (Pillow LANCZOS)
3. `JPEG quality=88, optimize, progressive` → ~350KB
4. Salvar em `src/assets/arcano-{NN}-{slug}.jpg` (Maiores) ou padrão equivalente para Menores
5. Verificar visualmente: numeral correto, título correto, composição canônica

## Tempos de leitura (intro cinematográfica)

- Spotlight de símbolo: **4.2s** mínimo (antes 2s — não dava tempo de ler)
- Pausa entre fim do último spotlight e voz do arcano: **4.8s**
- Velocidade de digitação: **34ms/char** (normal) / 38 (gentle) / 42 (mystical)
- Botão "Pular animação" sempre visível durante fases não-finais
- Botão "Revelar" (skip typing) durante a digitação

## Hierarquia visual (intro)

1. **Carta** — protagonista, centralizada, com glow
2. **Numeral + Nome** — sobreposto na carta (bottom)
3. **Subtítulo** — 10px, tracking 0.4em, opacidade 0.85 — discreto
4. **Keywords** — 11px, pílulas com fundo translúcido
5. **Arquétipo** — 16px italic, leading 1.7 — bloco editorial com respiro
6. **Voz do arcano** — card destacado, 16-18px, leading relaxed

## Status do roll-out

- [x] **0 — O Louco** (piloto, scan oficial instalado)
- [ ] 1–21 Maiores (a aplicar mesmo pipeline)
- [ ] 56 Menores (a aplicar mesmo pipeline)

## Restrições

- Não usar `imagegen--generate_image` ou `edit_image` para gerar/editar arte de carta
- Reservar IA generativa apenas para: fundos atmosféricos, decorações da UI, ícones
