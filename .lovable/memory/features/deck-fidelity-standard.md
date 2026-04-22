---
name: deck-fidelity-standard
description: Padrão CONGELADO de fidelidade visual do deck — scan canônico Rider-Waite-Smith para todas as 78 cartas, com UI do app ao redor. Versão v1.0 (validada com O Louco).
type: feature
---

# Padrão CONGELADO do Arcano Vivo (v1.0)

> Padrão validado com O Louco como carta piloto. **Não alterar sem reabrir auditoria.**

## 1. Decisão visual definitiva

O app ensina **Rider-Waite-Smith (1909)**. A imagem da carta é **canônica e imutável**.
**Proibido** usar `imagegen--generate_image` ou `imagegen--edit_image` para gerar/editar arte de carta.

## 2. Regra das camadas (inviolável)

| Camada | Tratamento | Quem manda |
|---|---|---|
| **Carta (asset)** | Scan oficial RWS de Pamela Colman Smith, 1909. PD-US. | Wikimedia Commons |
| **Fundo / atmosfera** | Gradientes radiais, partículas, glow âmbar/dourado | App (config por arcano) |
| **Moldura** | Borda dourada, sombra, corner ornaments | App |
| **Tipografia externa** | Cinzel (heading), Cormorant (accent), Inter (body) | App |
| **Animações** | Respirar, shimmer, spotlights — sempre por cima/ao redor | App |

## 3. Fonte canônica

- Wikimedia Commons — coleção "Rider-Waite Tarot deck" (PD-US, 1909)
- Padrão de URL: `https://upload.wikimedia.org/wikipedia/commons/{a}/{ab}/RWS_Tarot_{NN}_{Name}.jpg`
- Referência confirmada:
  - 0 — `9/90/RWS_Tarot_00_Fool.jpg`
  - 1 — `d/de/RWS_Tarot_01_Magician.jpg`
  - 2 — `8/88/RWS_Tarot_02_High_Priestess.jpg`

## 4. Pipeline de instalação (por carta)

```bash
curl -sSL -A "Mozilla/5.0" -o /tmp/{slug}.jpg "{wikimedia_url}"
```
```python
from PIL import Image
img = Image.open('/tmp/{slug}.jpg').convert('RGB')
w, h = img.size
if w > 800: img = img.resize((800, int(h*800/w)), Image.LANCZOS)
img.save('src/assets/arcano-{NN}-{slug}.jpg', 'JPEG', quality=88, optimize=True, progressive=True)
```
Validar visualmente: numeral, título e composição canônicos.

## 5. Hierarquia tipográfica fixa (intro)

| Elemento | Tamanho | Tracking | Peso/estilo | Cor |
|---|---|---|---|---|
| Numeral (sobre carta) | text-xs (12px) | 0.4em | font-heading | glow accent |
| Nome (sobre carta) | text-2xl (24px) | wide | font-heading | hsl(36 33% 95%) |
| Subtítulo (abaixo) | 10px | 0.4em uppercase | font-heading | hsl(36 38% 36% / 0.85) |
| Keywords (pílulas) | 11px | wide | font-medium | hsl(36 38% 30%) |
| Arquétipo (bloco editorial) | text-base (16px) | normal | italic, leading-1.7 | hsl(230 22% 22% / 0.82) |
| Voz do arcano | text-base/lg (16-18px) | normal | italic, leading-relaxed | hsl(230 28% 14%) |
| Legenda spotlight | 11px | wider | font-heading | glow.color |

## 6. Timing mínimo de leitura (fixo)

| Evento | Duração |
|---|---|
| Spotlight de símbolo visível | **4.2s** |
| Pausa entre último spotlight e voz | **4.8s** |
| Velocidade typewriter (normal) | 34ms/char |
| Velocidade typewriter (gentle) | 38ms/char |
| Velocidade typewriter (mystical) | 42ms/char |
| Botão "Pular animação" | sempre visível em fases não-finais |
| Botão "Revelar" | durante typewriter |

## 7. Regras de mobile (fixas)

- Carta nunca menor que `w-48 h-72` (192×288px)
- Subtítulo + keywords + arquétipo empilhados verticalmente, com gap mínimo de 16px
- Voz do arcano: max-w-md, padding interno mínimo de 20px
- Legendas de spotlight: max-w-220px com `whiteSpace: normal`
- Não permitir overflow horizontal

## 8. Status do roll-out

- [x] **0 — O Louco** (piloto validado, v1.0)
- [x] **1 — O Mago** (asset oficial instalado)
- [x] **2 — A Sacerdotisa** (asset oficial instalado)
- [ ] 3–21 Maiores
- [ ] 56 Menores

## 9. Restrições absolutas

- ❌ IA generativa não toca arte de carta
- ❌ Não desenhar por cima da carta (numerais externos sim, decoração da arte não)
- ❌ Não substituir scan por releitura "moderna"
- ✅ IA pode ser usada para fundos, ícones, decorações da UI
