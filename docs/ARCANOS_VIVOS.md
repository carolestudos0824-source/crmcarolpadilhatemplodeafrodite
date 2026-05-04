# Arcanos Vivos - Padrão de Vídeos e Documentação

Este documento registra o padrão técnico e estético para os vídeos dos 22 Arcanos Maiores do app Tarô 78 Chaves.

## 1. PADRÃO DOS VÍDEOS
- **Formato:** Vertical 9:16
- **Duração:** 8 a 12 segundos
- **Texto:** Sem texto na tela
- **Legenda:** Sem legenda
- **Logo:** Sem logo
- **Voz:** Português do Brasil (PT-BR)
- **Tom:** Oracular, adulto e elegante
- **Estética:** Cinematográfica, mística, ritualística e premium
- **Conceito:** 
  - A carta "desperta"
  - O arcano atravessa a moldura
  - O arcano fala uma frase curta
  - Fundo escuro ritualístico, velas, fumaça sutil, partículas douradas

## 2. NOMES DOS ARQUIVOS
Os arquivos devem ser salvos em `public/videos/arcanos/` seguindo exatamente esta nomenclatura:

- `arcano-0-louco.mp4`
- `arcano-1-mago.mp4`
- `arcano-2-sacerdotisa.mp4`
- `arcano-3-imperatriz.mp4`
- `arcano-4-imperador.mp4`
- `arcano-5-hierofante.mp4`
- `arcano-6-enamorados.mp4`
- `arcano-7-carro.mp4`
- `arcano-8-forca.mp4`
- `arcano-9-eremita.mp4`
- `arcano-10-roda-da-fortuna.mp4`
- `arcano-11-justica.mp4`
- `arcano-12-enforcado.mp4`
- `arcano-13-morte.mp4`
- `arcano-14-temperanca.mp4`
- `arcano-15-diabo.mp4`
- `arcano-16-torre.mp4`
- `arcano-17-estrela.mp4`
- `arcano-18-lua.mp4`
- `arcano-19-sol.mp4`
- `arcano-20-julgamento.mp4`
- `arcano-21-mundo.mp4`

## 3. STATUS DE IMPLEMENTAÇÃO
- **Arcano XV, O Diabo:** Publicado e aprovado ✅
- **Todos os demais:** Pendente de vídeo ⏳

## 4. CHECKLIST DE VALIDAÇÃO
Para cada novo vídeo inserido, validar os seguintes pontos:

- VÍDEO INSERIDO NO CAMINHO CORRETO: SIM ou NÃO
- ARCANO USA VÍDEO NO LUGAR DA CARTA ESTÁTICA: SIM ou NÃO
- POSTER APARECE ANTES DO PLAY: SIM ou NÃO
- BOTÃO DE PLAY FUNCIONA: SIM ou NÃO
- VÍDEO TOCA NO DESKTOP: SIM ou NÃO
- VÍDEO TOCA NO MOBILE: SIM ou NÃO
- ÁUDIO TOCA APÓS INTERAÇÃO: SIM ou NÃO
- FALLBACK PARA CARTA ESTÁTICA FUNCIONA: SIM ou NÃO
- EXPERIÊNCIA VISUAL APROVADA: SIM ou NÃO
