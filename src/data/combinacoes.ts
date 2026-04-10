export interface CombinacoesLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  /** Visual examples showing card combinations */
  examples?: CombinationExample[];
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: CombinacoesQuizQuestion[];
}

export interface CombinationExample {
  cards: string[];
  title: string;
  description: string;
  interpretation: string;
}

export interface CombinacoesQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const COMBINACOES_LESSONS: CombinacoesLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 1 — O que é uma combinação
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-1",
    order: 0,
    title: "O que é uma Combinação",
    subtitle: "Da carta isolada ao diálogo entre cartas",
    icon: "🔗",
    content: `Até agora, você aprendeu cada carta como uma entidade independente — com seus símbolos, arquétipos, luz e sombra. Isso é fundamental. Mas uma leitura de tarô nunca acontece com uma carta sozinha.

Na prática, **as cartas conversam entre si**. Cada carta que aparece ao lado de outra modifica, amplifica, corrige ou tensiona seu significado. Isso é o que chamamos de **combinação**: a arte de ler cartas em conjunto, criando uma narrativa maior do que a soma das partes.

Pense assim: uma palavra tem significado próprio. Mas uma frase — que combina palavras — cria um sentido completamente novo. "Amor" significa uma coisa. "Amor perdido" significa outra. "Amor reconquistado" outra completamente diferente. As cartas funcionam da mesma forma.

**Combinação não é fórmula.** Não existe uma tabela fixa dizendo "Carta A + Carta B = Significado X". Combinação é **leitura contextual** — a habilidade de observar como as energias interagem naquele momento, naquela pergunta, naquela posição.

Este módulo vai te ensinar a sair da leitura mecânica e entrar na leitura fluida — onde as cartas se tornam uma história viva.`,
    keyPoints: [
      "Uma carta sozinha tem significado — mas cartas juntas criam narrativa",
      "Combinação é leitura contextual, não fórmula fixa",
      "As cartas se ampliam, corrigem, tensionam ou complementam mutuamente",
      "A habilidade de combinar é o que separa estudante de leitora",
    ],
    deepDive: `Na tradição do tarô, a leitura de combinações é chamada de "síntese" — a capacidade de unir informações aparentemente separadas num todo coerente. É considerada a habilidade mais avançada e mais difícil de dominar.

Historicamente, os primeiros tarólogos liam cartas isoladamente, dando significados fixos. Foi com a tradição da Golden Dawn (século XIX) e depois com os leitores psicológicos do século XX que a leitura combinada se tornou central. Rachel Pollack, Mary K. Greer e outros autores contemporâneos enfatizam que **a leitura é um ato criativo** — não uma tradução mecânica.

Na psicologia junguiana, a síntese de símbolos é chamada de "amplificação": tomar um símbolo e expandir seu significado através da conexão com outros. É exatamente o que fazemos quando combinamos cartas — amplificamos o significado de cada uma pela presença da outra.

A metáfora musical é útil: uma nota sozinha é um som. Duas notas juntas podem ser harmonia ou dissonância. Três notas criam um acorde — um universo emocional inteiro. Combinar cartas é fazer música com símbolos.`,
    reflection: "Pense numa leitura que você já fez ou recebeu. Que cartas apareceram juntas? Você consegue perceber como elas se modificaram mutuamente — ou foram lidas como itens separados de uma lista?",
    exercise: {
      instruction: "Embaralhe seu baralho e tire duas cartas aleatórias. Antes de consultar significados, observe-as lado a lado e anote: que história essas duas imagens contam juntas? Que emoção surge ao vê-las em conjunto? Faça isso com 3 pares diferentes.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-1-q1",
        question: "O que diferencia a leitura de uma carta isolada da leitura de uma combinação?",
        options: ["A combinação é mais difícil", "Na combinação, as cartas modificam e contextualizam o significado umas das outras", "Combinações só funcionam em tiragens grandes", "Não há diferença — o significado é fixo"],
        correctIndex: 1,
        explanation: "Combinação é leitura contextual: cada carta altera o significado da outra, criando narrativa.",
      },
      {
        id: "comb-1-q2",
        question: "Combinação de cartas funciona como:",
        options: ["Uma tabela fixa de significados", "Uma fórmula matemática", "Uma conversa entre símbolos que cria narrativa contextual", "Um dicionário que se consulta"],
        correctIndex: 2,
        explanation: "Combinação é diálogo, não fórmula — as cartas conversam e criam sentido contextual.",
      },
      {
        id: "comb-1-q3",
        question: "Na psicologia junguiana, o processo de expandir o significado de um símbolo conectando-o a outros se chama:",
        options: ["Redução", "Amplificação", "Simplificação", "Neutralização"],
        correctIndex: 1,
        explanation: "Amplificação é exatamente o que fazemos ao combinar cartas — expandir significados pela conexão.",
      },
      {
        id: "comb-1-q4",
        question: "A metáfora musical para combinações sugere que:",
        options: ["Cartas sempre combinam bem", "Duas cartas juntas podem criar harmonia OU dissonância", "Só músicos leem tarô bem", "Todas as combinações são harmônicas"],
        correctIndex: 1,
        explanation: "Assim como notas musicais, cartas juntas podem ser harmônicas (complementares) ou dissonantes (tensionantes).",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 2 — Os 5 tipos de interação entre cartas
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-2",
    order: 1,
    title: "Os 5 Tipos de Interação",
    subtitle: "Como as cartas se modificam mutuamente",
    icon: "⚡",
    content: `Quando duas ou mais cartas aparecem juntas, elas interagem de uma das cinco formas fundamentais. Reconhecer qual tipo de interação está acontecendo é a chave para uma leitura precisa.

**1. Amplificação** — As cartas reforçam a mesma energia. Ex: O Sol + Ás de Copas = alegria emocional intensa. A energia se multiplica.

**2. Complementação** — As cartas trazem aspectos diferentes que se completam. Ex: A Imperatriz + O Imperador = equilíbrio entre nutrição e estrutura. Uma preenche o que falta na outra.

**3. Correção** — Uma carta suaviza ou redireciona a outra. Ex: A Torre + A Estrela = destruição seguida de esperança. A segunda carta corrige o tom da primeira.

**4. Tensão** — As cartas apontam direções opostas, criando conflito. Ex: O Eremita + 3 de Copas = necessidade de solidão vs. desejo de socializar. O conflito É a mensagem.

**5. Progressão** — As cartas contam uma sequência temporal ou causal. Ex: 5 de Ouros + 6 de Ouros = da escassez à generosidade. Uma leva à outra.

Estes cinco tipos não são categorias rígidas — uma mesma dupla pode ser lida como amplificação OU como tensão, dependendo da pergunta e do contexto.`,
    keyPoints: [
      "Amplificação: mesma energia, intensificada",
      "Complementação: aspectos diferentes que se completam",
      "Correção: uma carta suaviza ou redireciona a outra",
      "Tensão: energias opostas que criam conflito significativo",
      "Progressão: sequência temporal ou causal entre cartas",
    ],
    examples: [
      {
        cards: ["O Sol", "Ás de Copas"],
        title: "Amplificação",
        description: "Duas energias luminosas se reforçam",
        interpretation: "Alegria emocional intensa, início de amor abençoado pela vitalidade",
      },
      {
        cards: ["A Torre", "A Estrela"],
        title: "Correção",
        description: "A segunda carta redireciona o tom da primeira",
        interpretation: "Após a destruição, vem a esperança — a crise não é o fim, é transição",
      },
      {
        cards: ["O Eremita", "3 de Copas"],
        title: "Tensão",
        description: "Energias opostas que criam conflito significativo",
        interpretation: "Conflito entre necessidade de solidão e desejo de conexão social",
      },
    ],
    deepDive: `Os cinco tipos de interação são uma simplificação pedagógica de algo muito mais fluido. Na prática, uma combinação pode conter elementos de múltiplos tipos simultaneamente.

Por exemplo, A Lua + O Sol pode ser lida como:
- **Progressão**: da escuridão para a luz
- **Complementação**: inconsciente + consciente = totalidade
- **Tensão**: medo vs. clareza, intuição vs. razão

A leitura "correta" depende do contexto da pergunta, da posição na tiragem e da intuição da leitora.

Na tradição hermenêutica (a arte da interpretação), isso se chama "polissemia" — a capacidade de um mesmo signo carregar múltiplos significados simultâneos. O tarô é polissêmico por natureza — e as combinações multiplicam essa polissemia.

Uma dica prática: quando em dúvida sobre qual tipo de interação está acontecendo, **volte à pergunta original**. A pergunta é o filtro que determina qual leitura faz sentido naquele momento.`,
    exercise: {
      instruction: "Tire 3 pares de cartas do seu baralho. Para cada par, identifique qual dos 5 tipos de interação parece mais presente: Amplificação, Complementação, Correção, Tensão ou Progressão. Anote sua análise — sem consultar significados prontos.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-2-q1",
        question: "Quando duas cartas reforçam a mesma energia, a interação é:",
        options: ["Tensão", "Correção", "Amplificação", "Progressão"],
        correctIndex: 2,
        explanation: "Amplificação é quando as cartas intensificam a mesma energia — a força se multiplica.",
      },
      {
        id: "comb-2-q2",
        question: "A Torre seguida de A Estrela é um exemplo de:",
        options: ["Amplificação", "Tensão", "Correção", "Complementação"],
        correctIndex: 2,
        explanation: "A Estrela corrige o tom da Torre — após a destruição, vem a esperança e a cura.",
      },
      {
        id: "comb-2-q3",
        question: "Quando as cartas apontam direções opostas, criando conflito, a interação é:",
        options: ["Complementação", "Amplificação", "Progressão", "Tensão"],
        correctIndex: 3,
        explanation: "Tensão é quando energias opostas criam conflito — e o conflito É a mensagem.",
      },
      {
        id: "comb-2-q4",
        question: "O que determina qual tipo de interação está acontecendo numa combinação?",
        options: ["O significado fixo das cartas", "O contexto da pergunta e da tiragem", "A ordem alfabética", "A cor das cartas"],
        correctIndex: 1,
        explanation: "O contexto — pergunta, posição, intuição — é o filtro que determina a leitura.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 3 — Como ler pares de cartas
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-3",
    order: 2,
    title: "Leitura de Pares",
    subtitle: "O diálogo entre duas cartas",
    icon: "🎴",
    content: `A leitura de pares é a unidade fundamental da combinação. Se você dominar a leitura de duas cartas juntas, poderá ler qualquer tiragem — porque toda tiragem é, essencialmente, uma sequência de pares sobrepostos.

**O Método dos 4 Passos para Ler Pares:**

**Passo 1 — Observe separadamente.** Olhe cada carta individualmente. Qual é sua energia principal? Luz ou sombra? Ação ou receptividade?

**Passo 2 — Observe juntas.** Agora olhe as duas cartas como uma cena única. Se fossem personagens de uma peça, que cena estariam vivendo? Se fossem cores, que cor resultaria da mistura?

**Passo 3 — Identifique a interação.** Qual dos 5 tipos de interação predomina? As cartas se ampliam? Se corrigem? Se tensionam?

**Passo 4 — Conecte à pergunta.** Volte à pergunta original. Como essa interação responde ao que foi perguntado? Que conselho emerge do diálogo?

**Regra de ouro:** A carta que vem DEPOIS geralmente indica a direção, o resultado ou o conselho. A primeira é o contexto; a segunda é o desdobramento.

Nunca leia um par como "Carta A significa isso E Carta B significa aquilo". Leia como: "A história dessas duas cartas juntas é..."`,
    keyPoints: [
      "Toda tiragem é uma sequência de pares sobrepostos",
      "4 passos: observar separado → observar junto → identificar interação → conectar à pergunta",
      "A segunda carta geralmente indica direção ou resultado",
      "Nunca leia como lista — leia como história única",
    ],
    examples: [
      {
        cards: ["A Imperatriz", "5 de Espadas"],
        title: "A nutrição ferida",
        description: "Energia de cuidado encontra conflito mental",
        interpretation: "Uma figura maternal envolvida em conflito — mãe que briga, criatividade prejudicada por disputas intelectuais, generosidade que encontra ingratidão",
      },
      {
        cards: ["2 de Copas", "4 de Ouros"],
        title: "Amor e possessividade",
        description: "Conexão emocional encontra controle material",
        interpretation: "Relacionamento com dinâmica de posse — amor que se agarra, parceiro que controla, vínculo forte mas com risco de sufocamento",
      },
    ],
    deepDive: `A leitura de pares tem raízes na prática de "lenormand" (outro sistema de cartomancia), onde cada carta só faz sentido em relação à vizinha. No tarô, o método é mais flexível, mas o princípio é o mesmo: o significado está ENTRE as cartas, não dentro delas.

Uma técnica avançada é a **ponte visual**: observe os elementos visuais que "conectam" as duas cartas quando colocadas lado a lado. Uma figura olha para a outra? Uma espada aponta para um cálice? Uma paisagem de uma carta continua na outra? Esses detalhes visuais são pistas de como as energias interagem.

Outra técnica é a **fusão de arquétipos**: combine os arquétipos das duas cartas em um único personagem. O Eremita + A Imperatriz = "A Mãe Sábia que se retira para nutrir em silêncio". Este personagem fusionado É o significado da combinação.

Leitores experientes fazem isso instintivamente — mas no início, é útil praticar os 4 passos de forma deliberada até que se torne natural.`,
    exercise: {
      instruction: "Escolha uma pergunta simples sobre sua semana. Tire duas cartas. Aplique os 4 Passos sistematicamente: (1) observe cada carta separadamente, (2) observe juntas como cena única, (3) identifique o tipo de interação, (4) conecte à sua pergunta. Escreva a leitura em forma de história — não como lista de significados.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-3-q1",
        question: "Na leitura de pares, a segunda carta geralmente indica:",
        options: ["O problema", "A causa", "A direção, resultado ou conselho", "O passado"],
        correctIndex: 2,
        explanation: "A primeira carta é contexto; a segunda indica a direção ou o desdobramento.",
      },
      {
        id: "comb-3-q2",
        question: "O Método dos 4 Passos começa por:",
        options: ["Consultar significados", "Observar cada carta separadamente", "Identificar a interação", "Tirar mais cartas"],
        correctIndex: 1,
        explanation: "Primeiro observe cada carta individualmente, depois em conjunto.",
      },
      {
        id: "comb-3-q3",
        question: "A 'ponte visual' é uma técnica que consiste em:",
        options: ["Colocar uma carta sobre a outra", "Observar elementos visuais que conectam as cartas quando lado a lado", "Virar as cartas de cabeça para baixo", "Comparar os números"],
        correctIndex: 1,
        explanation: "Figuras se olhando, espadas apontando, paisagens continuando — pistas visuais da interação.",
      },
      {
        id: "comb-3-q4",
        question: "A 'fusão de arquétipos' cria:",
        options: ["Confusão", "Um único personagem que combina os arquétipos das duas cartas", "Uma nova carta", "Um problema"],
        correctIndex: 1,
        explanation: "Combinar os arquétipos em um personagem único revela o significado da combinação.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 4 — Como ler tríades
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-4",
    order: 3,
    title: "Leitura de Tríades",
    subtitle: "A narrativa de três cartas",
    icon: "🔮",
    content: `Se o par é um diálogo, a tríade é uma **história completa** — com começo, meio e fim. A leitura de três cartas é a tiragem mais poderosa e versátil do tarô, e dominar tríades é dominar a base de todas as tiragens complexas.

**Três Formas de Ler Tríades:**

**1. Temporal:** Passado → Presente → Futuro
A primeira carta é de onde a pessoa vem, a segunda é onde está agora, a terceira é para onde vai.

**2. Causal:** Causa → Situação → Resultado
A primeira carta explica POR QUE, a segunda mostra O QUE está acontecendo, a terceira revela PARA ONDE vai.

**3. Narrativa:** Contexto → Desafio → Conselho
A primeira carta define o cenário, a segunda mostra o obstáculo, a terceira oferece orientação.

**A carta central é sempre a protagonista.** Nas tríades, a carta do meio é a mais importante — ela é modificada pela carta à esquerda (que a contextualiza) e pela carta à direita (que a direciona).

**Técnica do Fluxo:** Leia as três cartas como uma frase: "Porque [Carta 1], a situação é [Carta 2], e o caminho é [Carta 3]." Se a frase fizer sentido com a pergunta, a leitura está certa.`,
    keyPoints: [
      "Tríades têm 3 formas: Temporal, Causal e Narrativa",
      "A carta central é a protagonista — modificada pelas laterais",
      "Use a Técnica do Fluxo: 'Porque X, a situação é Y, o caminho é Z'",
      "Tríades são a base de TODAS as tiragens mais complexas",
    ],
    examples: [
      {
        cards: ["8 de Copas", "A Lua", "A Estrela"],
        title: "Tríade Temporal",
        description: "Passado → Presente → Futuro",
        interpretation: "Ela partiu de algo que não funcionava mais (8 de Copas), agora vive confusão e medo (A Lua), mas a esperança e a cura estão chegando (A Estrela).",
      },
      {
        cards: ["O Diabo", "7 de Espadas", "A Justiça"],
        title: "Tríade Causal",
        description: "Causa → Situação → Resultado",
        interpretation: "Uma dependência ou obsessão (O Diabo) levou a ações desonestas (7 de Espadas), e o resultado será enfrentar as consequências (A Justiça).",
      },
    ],
    deepDive: `A tríade é a estrutura narrativa mais antiga da humanidade. Na retórica clássica, toda história tem três atos. Na filosofia hegeliana, tese-antítese-síntese. Na psicologia, passado-presente-futuro. O tarô utiliza essa mesma estrutura universal.

Uma técnica avançada para tríades é a **leitura do eixo**: a carta central é o eixo ao redor do qual as outras giram. Pergunte:
- O que a carta da esquerda ACRESCENTA à central?
- O que a carta da direita TRANSFORMA na central?

Outra técnica é a **sobreposição de pares**: numa tríade A-B-C, leia primeiro o par A-B, depois o par B-C, e finalmente o arco A-C. Isso gera três micro-leituras que, juntas, formam a leitura completa.

Leitores muito experientes conseguem "sentir" o tom da tríade instantaneamente — como um músico que ouve um acorde e sabe se é maior (alegre) ou menor (melancólico). Esse instinto se desenvolve com prática deliberada.`,
    exercise: {
      instruction: "Formule uma pergunta sobre um desafio atual. Tire 3 cartas e faça três leituras diferentes: (1) Temporal — passado/presente/futuro, (2) Causal — causa/situação/resultado, (3) Narrativa — contexto/desafio/conselho. Compare as três interpretações. Qual ressoa mais com sua situação?",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-4-q1",
        question: "Na leitura de tríades, a carta central funciona como:",
        options: ["A menos importante", "A protagonista — modificada pelas laterais", "Sempre o presente", "Decoração"],
        correctIndex: 1,
        explanation: "A carta do meio é a protagonista, contextualizada pela esquerda e direcionada pela direita.",
      },
      {
        id: "comb-4-q2",
        question: "A Técnica do Fluxo sugere ler as cartas como:",
        options: ["Três itens de uma lista", "'Porque X, a situação é Y, o caminho é Z'", "Três perguntas separadas", "Em ordem reversa"],
        correctIndex: 1,
        explanation: "A Técnica do Fluxo transforma a tríade numa frase que conecta causa, situação e direção.",
      },
      {
        id: "comb-4-q3",
        question: "Na sobreposição de pares, uma tríade A-B-C é lida como:",
        options: ["Apenas A-B-C", "Par A-B, par B-C, e arco A-C", "Apenas B", "C-B-A"],
        correctIndex: 1,
        explanation: "Três micro-leituras (A-B, B-C, A-C) formam juntas a leitura completa.",
      },
      {
        id: "comb-4-q4",
        question: "As três formas de ler tríades são:",
        options: ["Rápida, Média, Lenta", "Temporal, Causal e Narrativa", "Positiva, Negativa, Neutra", "Fácil, Média, Difícil"],
        correctIndex: 1,
        explanation: "Temporal (passado/presente/futuro), Causal (causa/situação/resultado), Narrativa (contexto/desafio/conselho).",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 5 — Elementos em diálogo
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-5",
    order: 4,
    title: "Elementos em Diálogo",
    subtitle: "Fogo, Água, Ar e Terra em combinação",
    icon: "🌊",
    content: `Os quatro elementos — Fogo (Paus), Água (Copas), Ar (Espadas) e Terra (Ouros) — são o primeiro filtro para entender combinações. Quando cartas de naipes diferentes aparecem juntas, seus elementos interagem de formas previsíveis.

**Combinações Elementais:**

**Fogo + Água** = Tensão criativa. O fogo evapora a água, a água apaga o fogo. Paixão vs. emoção. Ação vs. reflexão. É intenso, transformador e volátil. Ex: Cavaleiro de Paus + Rainha de Copas = desejo ardente encontra profundidade emocional.

**Fogo + Ar** = Amplificação. O ar alimenta o fogo. Ação + pensamento = estratégia brilhante. Pode ser genial ou explosivo. Ex: 3 de Paus + Ás de Espadas = visão criativa encontra clareza mental.

**Fogo + Terra** = Manifestação. O fogo transforma a terra (cerâmica, metalurgia). Desejo + matéria = construção. Ex: Ás de Paus + 3 de Ouros = inspiração que se torna obra concreta.

**Água + Ar** = Flutuação. Sentimento + pensamento = análise emocional. Pode ser insight ou confusão. Ex: 2 de Copas + 7 de Espadas = conexão emocional com suspeitas intelectuais.

**Água + Terra** = Nutrição. A água fertiliza a terra. Emoção + matéria = crescimento orgânico. Ex: 9 de Copas + 10 de Ouros = satisfação emocional que gera abundância concreta.

**Ar + Terra** = Planejamento. Pensamento + matéria = estratégia prática. Ex: Rei de Espadas + 8 de Ouros = liderança intelectual aplicada ao trabalho meticuloso.

**Quando o mesmo elemento se repete**, a energia é intensificada. Muita Água = excessivamente emocional. Muito Fogo = esgotamento por excesso de ação. Muito Ar = paralisia por excesso de análise. Muita Terra = estagnação por excesso de pragmatismo.`,
    keyPoints: [
      "Fogo + Água = tensão criativa e transformação volátil",
      "Fogo + Ar = amplificação mútua, pode ser genial ou explosivo",
      "Água + Terra = nutrição e crescimento orgânico",
      "Elementos iguais repetidos = intensificação (bônus ou excesso)",
    ],
    deepDive: `A teoria elemental no tarô vem da tradição hermética e da filosofia grega clássica (Empédocles, Aristóteles). Na tradição da Golden Dawn, cada naipe corresponde a um dos quatro elementos e a um dos quatro mundos cabalísticos:

- **Paus/Fogo** → Atziluth (Emanação) — o mundo da vontade pura
- **Copas/Água** → Briah (Criação) — o mundo emocional e formativo  
- **Espadas/Ar** → Yetzirah (Formação) — o mundo mental e intelectual
- **Ouros/Terra** → Assiah (Ação) — o mundo material e concreto

Quando cartas de mundos diferentes se combinam, é como se diferentes planos de realidade se encontrassem. Uma combinação Fogo-Terra, por exemplo, é a vontade pura (Atziluth) descendo ao mundo material (Assiah) — manifestação.

Na alquimia, os elementos se combinam para criar transformação:
- Fogo + Água = Vapor (sublimação, transformação)
- Fogo + Terra = Metal/Cerâmica (forja, criação)
- Água + Terra = Lama/Argila (fundação, fertilidade)
- Ar + Fogo = Relâmpago (insight, revelação)

Essas correspondências alquímicas adicionam profundidade à leitura de combinações elementais.`,
    exercise: {
      instruction: "Separe seu baralho pelos 4 naipes (sem Arcanos Maiores). Tire uma carta de cada naipe e coloque as 4 em linha. Observe: quais pares de elementos criam harmonia? Quais criam tensão? Escreva uma narrativa que conecte todas as 4 cartas usando a linguagem dos elementos.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-5-q1",
        question: "A combinação Fogo + Água tende a criar:",
        options: ["Calma total", "Tensão criativa e transformação volátil", "Tédio", "Confusão pura"],
        correctIndex: 1,
        explanation: "Fogo evapora água, água apaga fogo — intenso, transformador e volátil.",
      },
      {
        id: "comb-5-q2",
        question: "Quando o mesmo elemento se repete muito numa leitura, isso indica:",
        options: ["Equilíbrio", "Intensificação — pode ser bônus ou excesso", "Erro de leitura", "Nada"],
        correctIndex: 1,
        explanation: "Elementos repetidos intensificam a energia — muita água = emocional demais, etc.",
      },
      {
        id: "comb-5-q3",
        question: "Na tradição cabalística, Fogo (Paus) corresponde ao mundo de:",
        options: ["Assiah", "Briah", "Yetzirah", "Atziluth"],
        correctIndex: 3,
        explanation: "Fogo = Atziluth (Emanação), o mundo da vontade pura e do impulso divino.",
      },
      {
        id: "comb-5-q4",
        question: "Água + Terra em combinação simboliza:",
        options: ["Destruição", "Nutrição e crescimento orgânico", "Conflito", "Paralisia"],
        correctIndex: 1,
        explanation: "A água fertiliza a terra — emoção + matéria = crescimento natural e sustentável.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 6 — Arcanos Maiores + Menores
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-6",
    order: 5,
    title: "Maiores e Menores Juntos",
    subtitle: "Quando o arquétipo encontra o cotidiano",
    icon: "⚡",
    content: `Uma das combinações mais poderosas no tarô é quando um **Arcano Maior** aparece ao lado de um **Arcano Menor**. Entender essa dinâmica é crucial para leituras precisas.

**A regra fundamental:** Arcanos Maiores representam energias arquetípicas — forças universais, kármicas e transformadoras. Arcanos Menores representam situações cotidianas — eventos, emoções e desafios do dia a dia.

Quando aparecem juntos, o Arcano Maior **enquadra** o Menor. Ele dá peso, profundidade e significado maior a uma situação que poderia parecer comum.

**Ex: A Morte + 3 de Ouros**
Isoladamente, o 3 de Ouros é sobre trabalho em equipe. Mas ao lado d'A Morte, se torna: "uma transformação profunda no ambiente de trabalho" — fim de um projeto, reestruturação da equipe, morte simbólica de um modo antigo de trabalhar.

**Ex: A Sacerdotisa + 7 de Copas**
O 7 de Copas é fantasia e ilusão. Ao lado da Sacerdotisa, se torna: "use a intuição para discernir quais fantasias são visões verdadeiras e quais são ilusões" — o mistério interno guia a escolha.

**Regra prática:**
- **2+ Arcanos Maiores juntos** = momento kármico, transformação de vida
- **Todos Arcanos Menores** = questão prática e cotidiana
- **Mistura** = o destino toca o cotidiano — preste atenção`,
    keyPoints: [
      "Arcanos Maiores = forças arquetípicas; Menores = cotidiano",
      "Quando juntos, o Maior ENQUADRA o Menor — dá peso e profundidade",
      "2+ Maiores juntos = momento kármico importante",
      "Todos Menores = questão prática e cotidiana",
    ],
    examples: [
      {
        cards: ["A Morte", "3 de Ouros"],
        title: "Arquétipo enquadra cotidiano",
        description: "Transformação profunda no contexto do trabalho",
        interpretation: "Não é apenas trabalho em equipe — é o fim de um modo antigo de trabalhar e o nascimento de algo novo.",
      },
      {
        cards: ["O Julgamento", "Ás de Copas"],
        title: "Chamado kármico + novo início",
        description: "Despertar que abre uma nova realidade emocional",
        interpretation: "Um chamado profundo e transformador que inicia um novo ciclo emocional — renascimento no amor.",
      },
    ],
    exercise: {
      instruction: "Tire 3 cartas. Identifique quais são Arcanos Maiores e quais são Menores. Se houver mistura, observe como os Maiores 'enquadram' os Menores. Escreva a leitura mostrando como a presença de um Arcano Maior muda completamente o tom da narrativa.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-6-q1",
        question: "Quando um Arcano Maior aparece ao lado de um Menor, ele:",
        options: ["Anula o Menor", "Enquadra o Menor — dá peso e profundidade", "É menos importante", "Não muda nada"],
        correctIndex: 1,
        explanation: "O Maior enquadra o Menor, transformando uma situação cotidiana em algo arquetípico.",
      },
      {
        id: "comb-6-q2",
        question: "Dois ou mais Arcanos Maiores juntos indicam:",
        options: ["Erro de leitura", "Momento kármico e transformação de vida", "Questão simples", "Nada especial"],
        correctIndex: 1,
        explanation: "Múltiplos Maiores juntos indicam que forças universais e kármicas estão atuando.",
      },
      {
        id: "comb-6-q3",
        question: "Uma leitura com todos os Arcanos Menores indica:",
        options: ["Momento espiritual", "Questão prática e cotidiana", "Crise existencial", "Nada"],
        correctIndex: 1,
        explanation: "Todos Menores = a questão é do dia a dia, sem peso kármico especial.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 7 — Números em diálogo
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-7",
    order: 6,
    title: "Números em Diálogo",
    subtitle: "A numerologia como ferramenta de combinação",
    icon: "🔢",
    content: `Os números das cartas são uma camada adicional de leitura nas combinações. Quando cartas com o mesmo número ou números sequenciais aparecem juntas, isso amplifica padrões específicos.

**Números iguais — eco e intensificação:**
Quando dois ou mais cartões têm o mesmo número, o tema daquele número é enfatizado:
- Dois Ases = início poderoso, dupla oportunidade
- Dois 5s = crise em múltiplas áreas, instabilidade generalizada
- Dois 10s = ciclos se completando, transição de era
- Dois Reis = autoridade, decisão de poder, liderança

**Números sequenciais — progressão:**
Cartas em sequência numérica (3→4→5) contam uma história de evolução:
- Ascendente (3→4→5) = crescimento, desenvolvimento, complexidade crescente
- Descendente (5→4→3) = simplificação, retorno às bases, descomplicação

**Números espelhados — reflexo:**
Pares como 2-8, 3-7, 4-6 criam espelhamentos que somam 10 (completude):
- 2+8 = escolha + poder — decidir com autoridade
- 3+7 = criação + busca — criar algo que se investiga
- 4+6 = estabilidade + harmonia — fundação para equilíbrio

**A soma dos números** pode revelar o tom geral: some os números das cartas e reduza a um dígito. Esse número indica o "tom energético" da combinação.`,
    keyPoints: [
      "Números iguais = intensificação do tema daquele número",
      "Sequência ascendente = crescimento e complexidade",
      "Sequência descendente = simplificação e retorno",
      "Pares que somam 10 = espelhamento e completude",
    ],
    exercise: {
      instruction: "Separe do baralho todos os 4s e todos os 7s (ou seja, 4 de Copas, 4 de Paus, 4 de Espadas, 4 de Ouros + 7 de Copas, 7 de Paus, etc.). Forme pares mistos (um 4 e um 7) e observe como o tema de estabilidade (4) e busca (7) interagem em cada combinação elemental diferente.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-7-q1",
        question: "Quando duas cartas com o mesmo número aparecem, isso indica:",
        options: ["Coincidência", "Intensificação do tema daquele número", "Erro", "Neutralização"],
        correctIndex: 1,
        explanation: "Números iguais amplificam o tema — dois 5s = crise multiplicada, dois Ases = oportunidade dobrada.",
      },
      {
        id: "comb-7-q2",
        question: "Cartas em sequência numérica ascendente (3→4→5) indicam:",
        options: ["Retrocesso", "Crescimento e complexidade crescente", "Estagnação", "Fim"],
        correctIndex: 1,
        explanation: "Sequência ascendente conta uma história de evolução e desenvolvimento.",
      },
      {
        id: "comb-7-q3",
        question: "Pares que somam 10 (como 3+7, 4+6) criam:",
        options: ["Conflito", "Espelhamento e senso de completude", "Confusão", "Nada"],
        correctIndex: 1,
        explanation: "Pares que somam 10 criam espelhamentos — temas complementares que formam um todo.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 8 — Erros comuns em combinações
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-8",
    order: 7,
    title: "Erros Comuns em Combinações",
    subtitle: "As armadilhas da leitura mecânica",
    icon: "⚠️",
    content: `Aprender a combinar cartas é poderoso — mas também é onde muitos erros se enraízam. Reconhecer esses erros é tão importante quanto aprender as técnicas.

**Erro 1 — A Lista de Significados**
O erro mais comum: ler um par como "Carta A significa X e Carta B significa Y". Isso NÃO é combinação — é uma lista. Combinação é "A e B juntas significam Z" — um terceiro significado que não existe em nenhuma das duas isoladamente.

**Erro 2 — A Fórmula Fixa**
Memorizar que "Carta A + Carta B = sempre isso" é criar uma camisa de força para o tarô. O mesmo par pode significar coisas completamente diferentes dependendo da pergunta, da posição e do momento.

**Erro 3 — Ignorar o Contexto**
A combinação mais bela é inútil se não responde à pergunta. Sempre volte à pergunta original. Se a leitura não dialoga com o que foi perguntado, algo está errado na síntese.

**Erro 4 — Forçar a Narrativa**
Às vezes, as cartas parecem não fazer sentido juntas. Em vez de forçar uma interpretação, reconheça a ambiguidade. "As cartas mostram uma tensão que ainda não tem resolução" é uma leitura válida.

**Erro 5 — Ler Demais**
Nem tudo é profundo. Às vezes, 3 de Ouros + 8 de Ouros simplesmente significa "trabalhe com outros e pratique com disciplina". Não transforme tudo em revelação cósmica.`,
    keyPoints: [
      "Não leia como lista — crie um terceiro significado",
      "Não use fórmulas fixas — o contexto determina tudo",
      "Sempre volte à pergunta original",
      "Reconheça a ambiguidade — nem tudo precisa ser 'resolvido'",
      "Nem toda leitura é profunda — simplicidade também é sabedoria",
    ],
    reflection: "Pense em uma leitura que você fez recentemente. Você caiu em algum desses 5 erros? Qual deles é mais difícil de evitar para você — e por quê?",
    exercise: {
      instruction: "Tire 3 cartas. Faça duas leituras: (1) uma leitura ERRADA — liste os significados separados, sem conectar. (2) uma leitura CORRETA — conte a história integrada das 3 cartas como uma narrativa única. Compare as duas e observe como são diferentes.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-8-q1",
        question: "O erro de 'Lista de Significados' consiste em:",
        options: ["Ler muito rápido", "Listar o significado de cada carta separadamente em vez de criar uma narrativa integrada", "Usar poucos significados", "Ler devagar demais"],
        correctIndex: 1,
        explanation: "Combinação cria um TERCEIRO significado — não é a soma, é a síntese.",
      },
      {
        id: "comb-8-q2",
        question: "Quando as cartas parecem não fazer sentido juntas, você deve:",
        options: ["Tirar mais cartas", "Forçar uma interpretação", "Reconhecer a ambiguidade como leitura válida", "Desistir da leitura"],
        correctIndex: 2,
        explanation: "Reconhecer tensão sem resolução é uma leitura honesta e válida.",
      },
      {
        id: "comb-8-q3",
        question: "O 'antídoto' para todos os 5 erros é:",
        options: ["Memorizar mais significados", "Sempre voltar à pergunta original e ao contexto", "Ignorar as cartas", "Tirar mais cartas"],
        correctIndex: 1,
        explanation: "O contexto e a pergunta original são o filtro que evita todos os erros comuns.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 9 — Leitura de contexto
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-9",
    order: 8,
    title: "Leitura de Contexto",
    subtitle: "A arte de ler o que está entre as cartas",
    icon: "👁️",
    content: `Contexto é tudo no tarô. A mesma combinação de cartas pode ter significados opostos dependendo de quatro fatores:

**1. A Pergunta**
"O que sinto por essa pessoa?" e "O que devo fazer sobre essa situação?" são perguntas diferentes — e as mesmas cartas responderão de forma diferente a cada uma.

**2. A Posição na Tiragem**
Uma carta na posição "passado" tem função diferente da mesma carta na posição "conselho". A posição MODIFICA o significado.

**3. O Momento do Consulente**
Uma pessoa em luto e uma pessoa recém-apaixonada receberão o mesmo par de cartas de formas completamente diferentes. A situação de vida é um filtro real.

**4. As Cartas Vizinhas**
Numa tiragem de 5+ cartas, cada carta é influenciada pelas que estão ao lado — não apenas pelo par imediato, mas pelo "ambiente" geral.

**Técnica da Temperatura:** Antes de interpretar, observe o "clima" geral da tiragem. Há mais cartas "frias" (Espadas, Ouros) ou "quentes" (Paus, Copas)? Mais claras ou escuras? Essa temperatura é o contexto emocional da leitura.

**Técnica da Minoria:** A carta que "não combina" com as outras é frequentemente a mais importante. Ela é a exceção — e a exceção carrega a mensagem principal.`,
    keyPoints: [
      "4 fatores de contexto: pergunta, posição, momento do consulente, vizinhança",
      "Temperatura geral = clima emocional da tiragem (fria/quente, clara/escura)",
      "A carta que não combina (a minoria) é frequentemente a mais importante",
      "O mesmo par muda de significado conforme o contexto muda",
    ],
    deepDive: `Na hermenêutica (ciência da interpretação), o conceito de "círculo hermenêutico" é central: o todo se entende pelas partes, e as partes se entendem pelo todo. No tarô, isso significa que:

- Cada carta só faz sentido no contexto da tiragem inteira
- A tiragem inteira só faz sentido quando cada carta é compreendida
- A leitura é um processo circular, não linear

O filósofo Hans-Georg Gadamer chamou isso de "fusão de horizontes" — o momento em que o horizonte do texto (as cartas) se encontra com o horizonte do leitor (a leitora e o consulente). A leitura genuína acontece nesse encontro.

Na prática, isso significa que a mesma tiragem, lida por duas leitoras diferentes para a mesma pessoa, pode gerar interpretações diferentes — e ambas podem estar corretas. Isso não é falha do sistema; é a natureza polissêmica do tarô.

Leitores que insistem em significados fixos ("essa carta SEMPRE significa isso") estão resistindo à natureza fundamental do tarô como linguagem viva e contextual.`,
    exercise: {
      instruction: "Peça a alguém que formule uma pergunta (sem te contar). Tire 5 cartas. Primeiro, faça uma leitura 'genérica' — sem saber a pergunta. Depois, peça que a pessoa revele a pergunta e refaça a leitura. Compare: como o conhecimento da pergunta mudou completamente sua interpretação?",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-9-q1",
        question: "A 'Técnica da Minoria' diz que:",
        options: ["Descarte cartas que não combinam", "A carta que não combina com as outras frequentemente carrega a mensagem principal", "Só leia a maioria", "Ignore exceções"],
        correctIndex: 1,
        explanation: "A carta exceção é frequentemente a mais importante — ela carrega a mensagem central.",
      },
      {
        id: "comb-9-q2",
        question: "Os 4 fatores de contexto são:",
        options: ["Cor, número, naipe, posição", "Pergunta, posição na tiragem, momento do consulente, cartas vizinhas", "Passado, presente, futuro, conselho", "Elemento, número, corte, arcano"],
        correctIndex: 1,
        explanation: "Esses 4 fatores determinam como a mesma carta é interpretada em diferentes situações.",
      },
      {
        id: "comb-9-q3",
        question: "O 'círculo hermenêutico' no tarô significa que:",
        options: ["A leitura é circular e nunca termina", "Cada carta se entende pela tiragem e a tiragem se entende por cada carta", "Deve-se ler em círculo", "As cartas devem ser dispostas em círculo"],
        correctIndex: 1,
        explanation: "Parte e todo se iluminam mutuamente — a leitura é circular, não linear.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 10 — Praticando a síntese
  // ═══════════════════════════════════════════════════════════════
  {
    id: "comb-10",
    order: 9,
    title: "A Arte da Síntese",
    subtitle: "Unindo tudo numa leitura fluida",
    icon: "✨",
    content: `Esta última lição não traz técnicas novas — traz integração. A síntese é o momento em que todos os conceitos que você aprendeu se dissolvem e se tornam instinto. Não é mais "estou aplicando a Técnica do Fluxo" — é "estou lendo".

**O Processo da Síntese:**

**1. Respire antes de ler.** O silêncio antes da leitura é tão importante quanto a leitura em si. Limpe a mente.

**2. Observe ANTES de pensar.** Olhe as cartas por 30 segundos sem tentar interpretá-las. Que emoção surge? Que cor predomina? Que figura chama atenção? Essa primeira impressão é ouro.

**3. Conte uma história.** Não explique as cartas — narre. "Eu vejo alguém que..." em vez de "Esta carta significa...". A narrativa é mais precisa que a explicação.

**4. Permita o não-saber.** Nem tudo precisa ser claro imediatamente. Às vezes, a leitura precisa de tempo para "assentar". Deixe espaço para a compreensão que vem depois.

**5. Termine com uma ação.** Toda boa leitura termina com algo que o consulente pode FAZER. Não apenas compreender — agir.

**O sinal de que você dominou combinações:** quando você olha para uma tiragem e vê uma história — não cartas individuais. Quando a narrativa surge naturalmente — sem esforço, sem fórmula. Isso vem com prática. Muita prática.`,
    keyPoints: [
      "Respire antes, observe antes de pensar, narre em vez de explicar",
      "A primeira impressão emocional é informação valiosa",
      "Permita o não-saber — nem tudo precisa ser claro imediatamente",
      "Toda leitura deve terminar com uma ação concreta",
      "Domínio = ver história, não cartas individuais",
    ],
    reflection: "Olhe para trás neste módulo inteiro. Qual técnica mais transformou sua forma de ler? Qual erro você reconheceu que cometia? E o que ainda precisa de mais prática? Anote — essa auto-avaliação é parte da maestria.",
    exercise: {
      instruction: "Faça uma leitura completa para si mesma ou para alguém. Tire 5 cartas. Aplique TUDO que aprendeu neste módulo: observe antes de pensar, identifique tipos de interação, note elementos e números, leia a temperatura geral, encontre a carta da minoria, e conte uma história — não uma lista. Grave ou escreva a leitura inteira. Esta é sua avaliação final.",
      type: "practice",
    },
    quiz: [
      {
        id: "comb-10-q1",
        question: "O sinal de que você dominou combinações é quando:",
        options: ["Memorizou todos os significados", "Olha para uma tiragem e vê uma história — não cartas individuais", "Nunca erra", "Lê muito rápido"],
        correctIndex: 1,
        explanation: "Domínio é quando a narrativa surge naturalmente — sem esforço, sem fórmula.",
      },
      {
        id: "comb-10-q2",
        question: "Os 30 segundos de observação ANTES de interpretar servem para:",
        options: ["Perder tempo", "Captar a primeira impressão emocional — que é informação valiosa", "Decorar as cartas", "Nada"],
        correctIndex: 1,
        explanation: "A primeira impressão emocional é ouro — o inconsciente processa antes do consciente.",
      },
      {
        id: "comb-10-q3",
        question: "Toda boa leitura de tarô deve terminar com:",
        options: ["Uma previsão exata", "Uma ação concreta que o consulente pode fazer", "Mais perguntas", "Medo"],
        correctIndex: 1,
        explanation: "O tarô não é apenas compreensão — é orientação para ação.",
      },
      {
        id: "comb-10-q4",
        question: "A diferença entre 'explicar' e 'narrar' uma leitura é:",
        options: ["Nenhuma", "Explicar lista significados; narrar conta uma história viva e integrada", "Narrar é mais difícil", "Explicar é melhor"],
        correctIndex: 1,
        explanation: "'Eu vejo alguém que...' é mais preciso e poderoso que 'Esta carta significa...'.",
      },
    ],
  },
];

export function getCombinacoesLessonByOrder(order: number): CombinacoesLesson | undefined {
  return COMBINACOES_LESSONS.find((l) => l.order === order);
}
