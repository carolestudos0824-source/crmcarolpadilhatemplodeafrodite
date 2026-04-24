---
name: Arcano Menor — modelo de lição-piloto
description: Mapeamento canônico dos 18 campos editoriais dos Menores em 5 camadas pedagógicas (multi-fase carrossel), congelado a partir do Ás de Copas
type: feature
---

# Modelo pedagógico oficial — Arcanos Menores

Estrutura **multi-fase carrossel** (igual aos Maiores), com carta animada leve.
Os 18 campos do `ArcanoMenorEditorial` são mapeados nas 5 camadas das lições:

| Camada      | Fases na tela                         | Campos do editorial consumidos                                              |
| ----------- | ------------------------------------- | --------------------------------------------------------------------------- |
| **main**    | 1. Apresentação · 2. Símbolos · 3. Luz & Sombra | nome, subtitulo, essencia, simbolosCentrais, arquetipo, luz, sombra, licaoPratica |
| **deepDive**| 4. Voz da Carta · 5. Aprofundamento   | vozDaCarta, aprofundamento                                                  |
| **extras**  | 6. Aplicações                         | interpretacaoAmor, interpretacaoTrabalho, interpretacaoEspiritualidade      |
| **exercise**| 7. Reflexão guiada                    | perguntasReflexao                                                           |
| **quiz**    | 8. Quiz · 9. Revisão rápida           | quiz[], revisaoRapida                                                       |

Regras:
- Carta sempre visível no header da fase, com motion leve (fade + sutil scale-in, sem loops).
- Avanço linear entre fases; quiz é obrigatório para concluir a lição.
- Conclusão grava `card.id` em `completedLessons` e dá XP padrão de lição.
- Tela única reaproveitável para todas as 56 cartas (numeradas + corte).
