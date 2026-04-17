---
name: Naipes oficiais
description: Definição canônica dos 4 naipes (Copas, Paus, Espadas, Ouros) — essência, atmosfera, função, desafios, potencial, linguagem editorial, cor temática, motion style
type: feature
---

Fonte de verdade: `src/data/arcanos-menores/naipes-oficial.ts` (`NAIPES_OFICIAIS`).

Cada naipe tem 6 pilares editoriais: **essência, atmosfera, função na leitura, desafios, potencial, linguagem editorial** + 5 palavras-âncora + bloco visual (primary/surface/border/onPrimary/gradient/glow + motionStyle).

Palavras-âncora canônicas:
- **Copas (Água 💧)** — Emoção, Vínculo, Sensibilidade, Afeto, Imaginação. Tom poético/sensorial. Motion: fluido-ondulante. HSL 200 60% 45%.
- **Paus (Fogo 🔥)** — Ação, Impulso, Desejo, Expansão, Energia criadora. Tom direto/vibrante/imperativo. Motion: centelha-rapida. HSL 15 70% 50%.
- **Espadas (Ar ⚔️)** — Mente, Conflito, Decisão, Lucidez, Corte. Tom preciso/articulado/honesto. Motion: corte-preciso. HSL 210 40% 50%.
- **Ouros (Terra 💎)** — Matéria, Corpo, Trabalho, Segurança, Concretização. Tom calmo/concreto/paciente. Motion: assentamento-solido. HSL 45 65% 45%.

Ordem canônica: Copas → Paus → Espadas → Ouros.

API: `getNaipeOficial(naipe)`, `getAllNaipesOficiais()`, `naipeHsl(naipe, token?)`.

**Como aplicar:** Admin (badges/filtros), jornada (intro de naipe), lições (cabeçalho + linguagem editorial), quizzes (cor da barra de progresso), cards (border/glow). Sempre consumir deste arquivo para manter coerência.
