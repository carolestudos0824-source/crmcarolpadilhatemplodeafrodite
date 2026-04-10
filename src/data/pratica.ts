export interface PraticaLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  simulation?: PraticaSimulation;
  comparison?: PraticaComparison;
  exercise: {
    instruction: string;
    type: "reading" | "analysis" | "correction" | "practice";
  };
  quiz: PraticaQuizQuestion[];
}

export interface PraticaSimulation {
  title: string;
  context: string;
  question: string;
  cards: { position: string; card: string }[];
  guidedReading: string;
  commonMistakes: string[];
}

export interface PraticaComparison {
  title: string;
  context: string;
  weakReading: string;
  strongReading: string;
  commentary: string;
}

export interface PraticaQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PRATICA_LESSONS: PraticaLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 1 — O que é uma leitura de verdade
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-1",
    order: 0,
    title: "O Que É uma Leitura de Verdade",
    subtitle: "Diferença entre repetir significados e ler de verdade",
    icon: "🎯",
    content: `Muitas pessoas acham que ler tarô é decorar significados e repeti-los quando a carta aparece. Isso não é leitura — é recitação. Uma leitura de verdade é **interpretação contextual**: a mesma carta muda completamente de sentido dependendo da pergunta, da posição, das cartas vizinhas e da situação da consulente.

**Os 4 Pilares da Leitura Real:**

**1. Pergunta clara.** Sem boa pergunta, não há boa leitura. "O que vai acontecer?" é vaga. "Que energia envolve minha decisão de mudar de emprego?" é específica e aberta.

**2. Contexto.** A mesma carta significa coisas diferentes em contextos diferentes. O 3 de Espadas numa leitura de amor = dor relacional. Numa leitura de trabalho = feedback doloroso mas necessário. Numa leitura espiritual = purificação pela verdade.

**3. Relação entre cartas.** Uma carta sozinha é uma palavra. Duas cartas juntas são uma frase. Três ou mais são um parágrafo. A leitura acontece no ENTRE — no espaço entre as cartas.

**4. Narrativa.** Uma boa leitura conta uma história coerente. Não é uma lista de significados — é uma narrativa que faz sentido para a consulente e revela algo que ela não via antes.

**O teste da boa leitura:** Se a consulente sair da leitura com uma nova perspectiva que não tinha antes — a leitura foi boa. Se sair com as mesmas certezas de antes, foi apenas confirmação.

**A leitora não é tradutora — é intérprete.** Traduzir é mecânico: carta → significado. Interpretar é criativo: carta + contexto + intuição + experiência → narrativa única.`,
    keyPoints: [
      "Leitura ≠ recitação de significados — é interpretação contextual",
      "4 pilares: pergunta clara, contexto, relação entre cartas, narrativa",
      "A mesma carta muda de sentido conforme pergunta e posição",
      "A leitora é intérprete, não tradutora",
      "O teste: a consulente saiu com perspectiva nova?",
    ],
    comparison: {
      title: "O Imperador numa leitura de trabalho",
      context: "A consulente pergunta: 'Devo aceitar a promoção para cargo de gestão?'",
      weakReading: "O Imperador significa autoridade, estrutura e poder. Você vai ter autoridade. É uma carta de liderança. Aceite a promoção.",
      strongReading: "O Imperador aparece exatamente na pergunta sobre gestão — e isso não é coincidência. Essa carta fala de estrutura, mas também de rigidez. Você tem capacidade de liderança, mas pergunte-se: você quer liderar por vocação ou por pressão externa? O Imperador convida a construir com firmeza, mas alerta que autoridade sem flexibilidade se torna tirania. Aceitar a promoção pode ser o caminho — mas só se você estiver disposta a liderar sem perder sua humanidade.",
      commentary: "A leitura fraca traduz; a forte interpreta. A fraca diz o que a carta significa; a forte pergunta o que a carta significa AQUI, AGORA, para ESTA pessoa. Observe como a leitura forte inclui nuance, alerta e devolve responsabilidade à consulente.",
    },
    exercise: {
      instruction: "Tire uma carta para a pergunta: 'Que energia está guiando minha vida agora?' Escreva duas versões: uma 'leitura fraca' (apenas repita o significado da carta) e uma 'leitura forte' (interprete no contexto da sua vida atual). Compare as duas. Onde está a diferença? O que a versão forte acrescenta?",
      type: "practice",
    },
    quiz: [
      {
        id: "prat-1-q1",
        question: "Qual é a diferença entre traduzir e interpretar no tarô?",
        options: ["Não há diferença", "Traduzir é mecânico (carta→significado); interpretar é contextual e criativo", "Interpretar é mais fácil", "Traduzir é melhor"],
        correctIndex: 1,
        explanation: "Traduzir repete significados decorados; interpretar cria narrativa única considerando contexto, posição e relação entre cartas.",
      },
      {
        id: "prat-1-q2",
        question: "O teste de uma boa leitura é:",
        options: ["A consulente ficar feliz", "A consulente sair com perspectiva nova que não tinha antes", "Acertar o futuro", "Usar muitas cartas"],
        correctIndex: 1,
        explanation: "Se a leitura trouxe nova compreensão, cumpriu seu papel. Se apenas confirmou, foi projeção.",
      },
      {
        id: "prat-1-q3",
        question: "Por que 'O que vai acontecer?' é uma pergunta fraca?",
        options: ["Porque é curta", "Porque é vaga e trata o futuro como fixo, tirando agência da consulente", "Porque não usa todas as cartas", "Porque é muito pessoal"],
        correctIndex: 1,
        explanation: "Perguntas vagas geram leituras vagas. Boas perguntas são específicas e abertas.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 2 — Leitura simulada: uma carta
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-2",
    order: 1,
    title: "Leitura Simulada: Uma Carta",
    subtitle: "Praticando interpretação com carta única",
    icon: "🃏",
    content: `A leitura de uma carta é a forma mais simples — e uma das mais poderosas. Ela exige que você extraia profundidade de um único símbolo, sem o apoio de cartas vizinhas. É o exercício fundamental de toda leitora.

**Como ler uma carta só:**

**1. Observe antes de interpretar.** Olhe a imagem por 30 segundos antes de pensar. O que chama sua atenção? Uma cor, um detalhe, um gesto? Comece por aí.

**2. Conecte com a pergunta.** Não diga "essa carta significa X". Diga "essa carta, nesta pergunta, sugere Y". A conexão com a pergunta é tudo.

**3. Leia as camadas.** Toda carta tem pelo menos 3 camadas:
- **Superficial:** o significado mais conhecido
- **Psicológica:** o que revela sobre o estado interno
- **Simbólica:** o que os elementos visuais comunicam além das palavras

**4. Ofereça mais de uma perspectiva.** "Essa carta pode significar A... mas também pode significar B. Qual ressoa mais?" Isso respeita a autonomia da consulente.

**5. Encerre com orientação, não previsão.** Em vez de "Isso vai acontecer", diga "Essa energia convida você a..."

**Erro mais comum:** Tirar uma carta e dizer apenas o significado genérico. "O Sol = alegria, sucesso." Isso é dicionário, não leitura.`,
    keyPoints: [
      "Observe antes de interpretar — 30 segundos olhando a imagem",
      "Conecte SEMPRE com a pergunta específica",
      "3 camadas: superficial, psicológica, simbólica",
      "Ofereça perspectivas, não certezas absolutas",
      "Encerre com orientação, não previsão",
    ],
    simulation: {
      title: "Leitura de 1 Carta: A Lua",
      context: "A consulente está indecisa sobre um relacionamento. Não sabe se confia no parceiro.",
      question: "O que preciso saber sobre essa relação?",
      cards: [{ position: "Carta única", card: "A Lua (XVIII)" }],
      guidedReading: `**Observação:** A Lua mostra um caminho entre duas torres, um cão e um lobo, e um lagostim emergindo da água. A luz é difusa — não é dia nem noite.

**Interpretação:** A Lua nesta pergunta não diz "ele está mentindo" nem "confie nele". Ela diz algo mais profundo: **você não tem toda a informação.** Há algo que ainda está oculto — talvez do parceiro, talvez de você mesma. Os medos (o lobo) e a domesticação (o cão) convivem — parte de você quer confiar, parte de você teme.

O lagostim emergindo da água representa algo do inconsciente que está vindo à tona. Talvez não seja sobre ele — talvez seja sobre um padrão seu de desconfiança.

**Orientação:** "Antes de decidir se confia ou não, pergunte-se: o que exatamente está me gerando insegurança? É algo concreto que ele fez? Ou é um medo antigo meu que estou projetando? A Lua convida a iluminar o que está no escuro — dentro de você, primeiro."`,
      commonMistakes: [
        "Dizer apenas 'A Lua = ilusão, cuidado com mentiras' — isso é tradução, não leitura",
        "Afirmar categoricamente 'ele está escondendo algo' — a Lua fala de nebulosidade, não necessariamente de mentira intencional",
        "Ignorar a dimensão interna — a Lua fala tanto do outro quanto da consulente",
        "Não conectar com a pergunta específica — dar significado genérico",
      ],
    },
    exercise: {
      instruction: "Escolha uma pergunta real sua. Tire uma carta. Antes de interpretar, observe a imagem por 30 segundos e anote o que chama atenção. Depois escreva uma leitura completa com as 3 camadas: superficial, psicológica e simbólica. Encerre com orientação. Releia: sua leitura soa como dicionário ou como interpretação personalizada?",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-2-q1",
        question: "O primeiro passo ao tirar uma carta é:",
        options: ["Dizer o significado imediatamente", "Observar a imagem por 30 segundos antes de interpretar", "Procurar no livro", "Virar outra carta"],
        correctIndex: 1,
        explanation: "A observação ativa a intuição e revela detalhes que o significado decorado não captura.",
      },
      {
        id: "prat-2-q2",
        question: "As 3 camadas de leitura de uma carta são:",
        options: ["Passado, presente, futuro", "Superficial, psicológica e simbólica", "Boa, neutra, ruim", "Amor, trabalho, saúde"],
        correctIndex: 1,
        explanation: "Toda carta tem um significado conhecido (superficial), um insight interno (psicológico) e uma linguagem visual (simbólico).",
      },
      {
        id: "prat-2-q3",
        question: "A Lua numa leitura sobre confiança no parceiro indica:",
        options: ["Ele está mentindo", "Confie nele", "Há nebulosidade — nem tudo está claro, e parte pode vir da própria consulente", "Termine a relação"],
        correctIndex: 2,
        explanation: "A Lua fala de nebulosidade e inconsciente — não afirma mentira nem verdade, convida a iluminar o que está oculto.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 3 — Leitura simulada: três cartas
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-3",
    order: 2,
    title: "Leitura Simulada: Três Cartas",
    subtitle: "Construindo narrativa entre cartas",
    icon: "📖",
    content: `Três cartas criam uma narrativa. É aqui que a leitura começa a se parecer com uma história — com início, desenvolvimento e orientação. A habilidade central é **ler o espaço entre as cartas**, não cada carta isoladamente.

**O método narrativo em 3 passos:**

**Passo 1 — Leia cada carta individualmente** (mas brevemente). Não se aprofunde demais em cada uma. Anote uma palavra-chave para cada.

**Passo 2 — Identifique a relação.** Como a carta 1 se conecta com a 2? A 2 com a 3? A energia flui harmonicamente ou há tensão? Há repetição de naipe ou numerologia?

**Passo 3 — Construa a narrativa.** Una as três em uma frase coerente. A leitura é a FRASE, não as três palavras separadas.

**Exemplo de construção narrativa:**
Cartas: 8 de Espadas → 6 de Copas → Ás de Paus
Palavras-chave: prisão mental → nostalgia → novo impulso
Narrativa fraca: "Você está presa. Sente saudade. Vai começar algo novo."
Narrativa forte: "Você está presa numa narrativa mental antiga (8 de Espadas), alimentada por memórias afetivas do passado que ainda te prendem (6 de Copas). Mas há um impulso vital novo querendo nascer — uma energia criativa que só será liberada quando você soltar essa história antiga (Ás de Paus). A sequência mostra um caminho: da prisão à liberdade, mas o meio do caminho passa por soltar o passado."

**A diferença está na conexão.** Cartas isoladas são ingredientes. A leitura é o prato.`,
    keyPoints: [
      "3 passos: leitura individual → relação entre cartas → narrativa",
      "A leitura acontece no ENTRE — no espaço entre as cartas",
      "Cartas isoladas são ingredientes; a narrativa é o prato",
      "Busque fluxo: a energia é harmônica ou há tensão?",
      "Uma frase coerente > três significados separados",
    ],
    simulation: {
      title: "Tiragem de 3 Cartas: Situação Profissional",
      context: "A consulente está insatisfeita no trabalho e pensa em pedir demissão, mas tem medo.",
      question: "Que energia envolve essa decisão profissional?",
      cards: [
        { position: "Situação atual", card: "10 de Paus" },
        { position: "O que está em jogo", card: "O Julgamento" },
        { position: "Orientação", card: "Cavaleiro de Ouros" },
      ],
      guidedReading: `**Passo 1 — Palavras-chave:**
10 de Paus = sobrecarga, peso, responsabilidade excessiva
O Julgamento = despertar, chamado, hora de decidir
Cavaleiro de Ouros = ação metódica, planejamento, paciência

**Passo 2 — Relações:**
10 de Paus → Julgamento: a sobrecarga está gerando um despertar. O peso que ela carrega não é sustentável — e algo nela sabe disso. O Julgamento confirma: é hora de ouvir o chamado.
Julgamento → Cavaleiro de Ouros: o chamado não pede impulsividade. O Cavaleiro de Ouros é metódico. A orientação é clara: planeje antes de agir.

**Passo 3 — Narrativa:**
"Você está carregando mais do que deveria (10 de Paus) — e lá no fundo, já sabe disso. Algo dentro de você está pedindo mudança (O Julgamento) — não é capricho, é um chamado real. Mas a orientação não é pedir demissão amanhã. É planejar com cuidado (Cavaleiro de Ouros): organize finanças, atualize currículo, explore opções. A saída virá — mas virá melhor se for construída, não improvisada."`,
      commonMistakes: [
        "Ler as 3 cartas separadamente sem conectá-las: 'Sobrecarga. Despertar. Planejamento.' — isso não é narrativa",
        "Ignorar a progressão: as 3 cartas contam uma história com direção — do peso ao despertar à ação",
        "Dar resposta binária: 'Peça demissão' ou 'Não peça' — o tarô não decide pela consulente",
        "Não considerar o naipe do Cavaleiro (Ouros) como indicação de ritmo lento e prático",
      ],
    },
    comparison: {
      title: "Mesma tiragem, duas leituras",
      context: "10 de Paus + O Julgamento + Cavaleiro de Ouros para decisão profissional",
      weakReading: "10 de Paus: sobrecarga. O Julgamento: hora de mudar. Cavaleiro de Ouros: vá com calma. Resumo: está pesado, precisa mudar, mas devagar.",
      strongReading: "Há um peso que você está carregando que já não é seu para carregar. Essa sobrecarga não é apenas trabalho — é lealdade a uma situação que não te serve mais. O Julgamento no centro da leitura é significativo: é um despertar, não um impulso. Algo profundo está te chamando para um novo capítulo. Mas o Cavaleiro de Ouros pede método: não é sobre queimar pontes, é sobre construir a próxima com cuidado. Comece a planejar agora — a decisão virá naturalmente quando estiver pronta.",
      commentary: "A leitura fraca lista; a forte tece. Observe como a leitura forte usa linguagem emocional, identifica camadas (lealdade, não apenas trabalho), respeita o ritmo indicado pelo Cavaleiro e devolve poder à consulente.",
    },
    exercise: {
      instruction: "Tire 3 cartas para a pergunta: 'Que energia envolve meu momento atual?' Siga os 3 passos: (1) anote uma palavra-chave por carta, (2) identifique como se relacionam, (3) escreva a narrativa como um parágrafo coerente. Depois releia: é uma lista de significados ou uma história?",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-3-q1",
        question: "O erro mais comum na leitura de 3 cartas é:",
        options: ["Usar muitas cartas", "Ler cada carta isoladamente sem criar narrativa entre elas", "Demorar muito", "Usar cartas invertidas"],
        correctIndex: 1,
        explanation: "Sem conexão entre as cartas, a leitura vira uma lista — não uma história.",
      },
      {
        id: "prat-3-q2",
        question: "No método narrativo, o passo 2 (relação entre cartas) busca:",
        options: ["O significado de cada carta", "Como as cartas se conectam: fluxo, tensão, progressão", "A carta mais forte", "O naipe dominante"],
        correctIndex: 1,
        explanation: "A relação entre as cartas é onde a leitura acontece — é o 'entre' que cria significado.",
      },
      {
        id: "prat-3-q3",
        question: "O Cavaleiro de Ouros como orientação numa decisão indica:",
        options: ["Ação imediata e impulsiva", "Ação metódica, planejada e paciente", "Não fazer nada", "Pedir opinião de outros"],
        correctIndex: 1,
        explanation: "Cavaleiro de Ouros = método, planejamento, ritmo sustentável. O naipe (Ouros) reforça praticidade.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 4 — Correção comentada
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-4",
    order: 3,
    title: "Correção Comentada",
    subtitle: "Aprendendo com erros comuns de leitura",
    icon: "✏️",
    content: `A melhor forma de aprender a ler bem é analisar leituras ruins — não para julgar, mas para entender onde a interpretação perde qualidade. Aqui estão 5 erros reais (anonimizados) com correção detalhada.

**Erro 1 — A Lista de Significados**
Consulente: "Devo voltar com meu ex?"
Cartas: A Estrela, 5 de Copas, O Carro
Leitura errada: "A Estrela é esperança. 5 de Copas é tristeza. O Carro é movimento. Então tem esperança mas tem tristeza e você vai seguir em frente."
Correção: A leitura lista significados sem conectar. Uma leitura melhor: "Há esperança nessa situação (A Estrela), mas essa esperança precisa ser examinada: é esperança no outro ou em si mesma? Porque o 5 de Copas mostra que ainda há luto não processado. Antes de decidir voltar, processe o que perdeu. O Carro indica que a direção certa vai ficar clara quando você parar de olhar para trás."

**Erro 2 — A Previsão Categórica**
Consulente: "Vou passar no concurso?"
Cartas: O Sol
Leitura errada: "Sim, vai passar. O Sol é sucesso total."
Correção: O tarô não é bola de cristal. O Sol indica energia positiva, clareza e vitalidade — mas não garante resultado específico. Uma leitura melhor: "O Sol mostra que sua energia está no lugar certo. Há clareza, confiança e brilho. Continue nessa direção com confiança — mas lembre: resultado depende de estudo + preparação, não de cartas."

**Erro 3 — A Projeção da Leitora**
Consulente: "Como vai meu relacionamento?"
Cartas: 3 de Espadas
Leitora (recém-separada): "Vai terminar. Sempre termina."
Correção: A leitora projetou sua própria experiência. O 3 de Espadas pode indicar dor necessária, conversa difícil, ou verdade que precisa ser dita — não necessariamente fim.

**Erro 4 — A Complicação Desnecessária**
Leitura com 15 cartas para uma pergunta simples. Quanto mais cartas, mais confusão. Regra: use o mínimo de cartas que responda à pergunta.

**Erro 5 — A Leitura Que Não Diz Nada**
"As cartas mostram que há energia em movimento e transformações podem acontecer." Isso serve para qualquer pessoa em qualquer momento. Se a leitura é genérica o bastante para servir a qualquer um, não é leitura — é horóscopo.`,
    keyPoints: [
      "5 erros: lista de significados, previsão categórica, projeção da leitora, complicação, generalização",
      "Leitura boa conecta cartas com contexto específico",
      "O tarô não garante resultados — indica energias e direções",
      "Use o mínimo de cartas que responda à pergunta",
      "Se serve para qualquer pessoa, não é leitura",
    ],
    comparison: {
      title: "A Leitura Genérica vs. Específica",
      context: "Consulente pergunta: 'Como está minha energia financeira?' — Carta: 7 de Ouros",
      weakReading: "O 7 de Ouros indica que você está esperando resultados. Tenha paciência e os frutos virão. Continue trabalhando duro.",
      strongReading: "O 7 de Ouros mostra alguém olhando para o que plantou — avaliando se o investimento vai dar retorno. Isso sugere que você está num momento de colheita lenta. Não é hora de plantar mais — é hora de avaliar o que já está crescendo. Pergunta para reflexão: dos projetos que você tem em andamento, quais realmente merecem sua energia? O 7 de Ouros pede discernimento, não mais esforço.",
      commentary: "A leitura fraca é genérica e clichê ('tenha paciência, continue trabalhando'). A forte identifica o momento específico (avaliação, não ação), faz uma pergunta que gera reflexão e dá orientação prática.",
    },
    exercise: {
      instruction: "Releia uma leitura antiga sua (ou invente uma). Identifique: caiu em algum dos 5 erros? Qual? Reescreva a leitura corrigindo os erros. Se não tem leitura antiga, tire 3 cartas para 'Que energia envolve meu crescimento como leitora?' — escreva a leitura E depois critique sua própria leitura.",
      type: "correction",
    },
    quiz: [
      {
        id: "prat-4-q1",
        question: "Se uma leitura serve para qualquer pessoa em qualquer momento, ela é:",
        options: ["Profunda", "Genérica — não é leitura real, é horóscopo", "Universal", "Espiritual"],
        correctIndex: 1,
        explanation: "Leitura real é específica ao contexto. Se serve para todos, não serve para ninguém.",
      },
      {
        id: "prat-4-q2",
        question: "Quando a leitora projeta sua experiência pessoal na leitura, isso é:",
        options: ["Empatia", "Projeção — um dos erros mais graves, distorce a interpretação", "Sensibilidade", "Intuição"],
        correctIndex: 1,
        explanation: "Projeção é quando a leitora vê suas próprias questões nas cartas da consulente. É erro, não intuição.",
      },
      {
        id: "prat-4-q3",
        question: "A regra para número de cartas numa leitura é:",
        options: ["Quanto mais melhor", "Use o mínimo que responda à pergunta", "Sempre 10", "Depende do dia"],
        correctIndex: 1,
        explanation: "Mais cartas = mais complexidade e mais chances de confusão. Menos é mais.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 5 — Prática com combinações
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-5",
    order: 4,
    title: "Prática com Combinações",
    subtitle: "Treinando a leitura de pares e tríades",
    icon: "🔗",
    content: `Você já aprendeu teoria de combinações. Agora é hora de praticar. Esta lição apresenta 6 combinações para você interpretar antes de ver a resposta — como treino real.

**Exercício 1 — Par Simples:**
Cartas: 2 de Copas + O Eremita
Contexto: Leitura de relacionamento.
Antes de ler a interpretação, escreva a sua.
Interpretação: Há conexão real entre duas pessoas (2 de Copas), mas um dos dois precisa de espaço para si (O Eremita). Isso não é rejeição — é necessidade de solidão para voltar com mais presença. A combinação sugere amor que respeita a individualidade.

**Exercício 2 — Par com Tensão:**
Cartas: A Torre + 10 de Copas
Contexto: Leitura sobre família.
Interpretação: Uma ruptura (A Torre) que eventualmente leva a uma reconfiguração familiar mais autêntica (10 de Copas). A destruição não é o fim — é o meio para uma família que funciona de verdade, não por obrigação.

**Exercício 3 — Tríade Narrativa:**
Cartas: Rainha de Espadas + 5 de Ouros + A Estrela
Contexto: Leitura sobre carreira.
Interpretação: Uma mulher (ou energia) de mente afiada e decisões claras (Rainha de Espadas) enfrenta um período de precariedade financeira ou profissional (5 de Ouros), mas no horizonte há cura e renovação (A Estrela). A narrativa: a travessia é dura, mas a clareza mental será a ferramenta que a leva até a luz.

**Exercício 4 — Par Sutil:**
Cartas: A Lua + O Sol
Contexto: Leitura sobre autoconhecimento.
Interpretação: A transição do inconsciente (A Lua) para a consciência (O Sol). Algo que estava oculto está vindo à luz. Esse processo pode ser desconfortável — mas é curativo. Os medos que você enfrenta no escuro se dissolvem quando iluminados.

**Exercício 5 — Par Paradoxal:**
Cartas: O Diabo + Os Enamorados
Contexto: Leitura de amor.
Interpretação: Dependência (O Diabo) versus escolha livre (Os Enamorados). A consulente está num ponto de decisão: permanecer no padrão de apego ou escolher conscientemente como quer amar. Ambas as cartas falam de vínculo — mas um é corrente, o outro é aliança.

**Exercício 6 — Tríade com Arcanos Maiores:**
Cartas: A Morte + A Temperança + O Mundo
Contexto: Leitura sobre um ciclo de vida.
Interpretação: Fim (Morte) → integração (Temperança) → completude (O Mundo). O ciclo mais bonito do tarô: algo termina, é integrado com sabedoria, e se completa num novo nível de consciência.`,
    keyPoints: [
      "Pratique interpretando ANTES de ler a resposta — isso treina autonomia",
      "Pares podem ser harmônicos, tensos ou paradoxais",
      "Tríades criam narrativa com início, desenvolvimento e conclusão",
      "Contexto muda completamente o significado da mesma combinação",
      "O 'entre' as cartas é tão importante quanto as cartas em si",
    ],
    exercise: {
      instruction: "Separe 10 cartas aleatórias do baralho. Forme 3 pares e 1 tríade. Para cada combinação, invente um contexto (amor, trabalho ou autoconhecimento) e escreva uma interpretação completa. Depois releia: suas interpretações são narrativas ou listas? Ajuste.",
      type: "practice",
    },
    quiz: [
      {
        id: "prat-5-q1",
        question: "2 de Copas + O Eremita em leitura de relacionamento indica:",
        options: ["Fim do amor", "Amor que respeita individualidade — conexão real com necessidade de espaço", "Solidão eterna", "Traição"],
        correctIndex: 1,
        explanation: "A combinação mostra vínculo genuíno (2 Copas) com espaço pessoal (Eremita) — amor maduro.",
      },
      {
        id: "prat-5-q2",
        question: "A Torre + 10 de Copas em leitura familiar sugere:",
        options: ["Família destruída", "Ruptura que leva a reconfiguração familiar mais autêntica", "Nada muda", "Casamento"],
        correctIndex: 1,
        explanation: "A Torre destrói o que não funciona; 10 de Copas mostra a família que emerge — mais real, menos forçada.",
      },
      {
        id: "prat-5-q3",
        question: "O Diabo + Os Enamorados em leitura de amor revela:",
        options: ["Amor perfeito", "Um ponto de decisão entre dependência e escolha livre de amar", "Traição certa", "Solidão"],
        correctIndex: 1,
        explanation: "Ambas falam de vínculo — mas Diabo é corrente, Enamorados é aliança. A escolha está com a consulente.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 6 — Prática com tiragens
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-6",
    order: 5,
    title: "Prática com Tiragens",
    subtitle: "Leituras guiadas com tiragens estruturadas",
    icon: "🎴",
    content: `Agora você pratica leituras completas com tiragens estruturadas. Cada tiragem tem posições definidas — e cada posição muda o significado da carta que a ocupa.

**Regra fundamental:** A mesma carta numa posição de "obstáculo" significa algo diferente do que numa posição de "conselho". A POSIÇÃO contextualiza a carta.

**Tiragem Guiada 1 — Três Cartas (Passado/Presente/Futuro)**
Pergunta: "Que jornada estou vivendo no trabalho?"
Cartas: Cavaleiro de Paus (Passado) | 4 de Copas (Presente) | 8 de Ouros (Futuro)

Leitura: No passado recente, houve impulso e entusiasmo — você entrou com fogo (Cavaleiro de Paus). Agora, o entusiasmo esfriou. Há apatia, desencanto, a sensação de que as oportunidades não empolgam (4 de Copas). Mas o futuro mostra dedicação ao ofício — um retorno ao trabalho meticuloso e ao aperfeiçoamento (8 de Ouros). A mensagem: o tédio presente não é o fim da jornada — é a transição entre a empolgação inicial e o domínio real.

**Tiragem Guiada 2 — Cruz Simples (4 posições)**
Pergunta: "Que energia envolve minha busca espiritual?"
Posições: Centro (tema) | Cruzada (desafio) | Acima (consciente) | Abaixo (inconsciente)
Cartas: A Sacerdotisa | 7 de Espadas | O Sol | A Lua

Leitura: O tema central é o mistério e a intuição (Sacerdotisa). O desafio é a tendência a buscar atalhos ou esconder a busca dos outros (7 de Espadas — talvez vergonha da própria espiritualidade). Conscientemente, você busca clareza e alegria (O Sol). Inconscientemente, há medos e profundezas que ainda precisam ser explorados (A Lua). A Sacerdotisa cruzada com 7 de Espadas diz: pare de esconder sua busca. Assuma-a.`,
    keyPoints: [
      "A posição contextualiza a carta — mesma carta, posições diferentes = significados diferentes",
      "Tiragem de 3 = narrativa temporal; Cruz = mapa dimensional",
      "O desafio/obstáculo não é negativo — é o ponto de trabalho",
      "Leia a tiragem como unidade, não como cartas soltas",
    ],
    simulation: {
      title: "Tiragem de 3 Cartas: Situação, Obstáculo, Conselho",
      context: "A consulente está esgotada e não sabe como recuperar energia.",
      question: "O que preciso saber para recuperar minha vitalidade?",
      cards: [
        { position: "Situação", card: "10 de Espadas" },
        { position: "Obstáculo", card: "Rainha de Copas invertida" },
        { position: "Conselho", card: "Ás de Ouros" },
      ],
      guidedReading: `**Situação (10 de Espadas):** O esgotamento é total. As espadas nas costas indicam que o sofrimento atingiu o limite — mas o 10 é também o número do fim de ciclo. O pior já passou. O amanhecer no fundo da carta (Rider-Waite) confirma: a escuridão está acabando.

**Obstáculo (Rainha de Copas invertida):** O que impede a recuperação é o excesso de cuidado com os outros em detrimento de si mesma. A Rainha de Copas invertida = nutrição desregulada — dar sem receber, absorver emoções alheias, negligenciar as próprias necessidades.

**Conselho (Ás de Ouros):** Volte ao básico. Cuide do corpo, da alimentação, do sono, do dinheiro. O Ás de Ouros é um novo começo material e prático. Não é sobre espiritualidade agora — é sobre cuidar da base concreta da vida.

**Síntese:** Você atingiu o limite (10 de Espadas) porque cuidou de todos menos de si (Rainha de Copas inv.). A cura começa no básico: corpo, rotina, saúde (Ás de Ouros). Primeiro sobreviva — depois floresça.`,
      commonMistakes: [
        "10 de Espadas = 'tragédia' — sem mencionar que o 10 é fim de ciclo e há esperança",
        "Ignorar o aspecto invertido da Rainha de Copas — a inversão muda a energia de nutrição para auto-negligência",
        "Dar conselho espiritual quando a carta (Ás de Ouros) pede cuidado prático e material",
      ],
    },
    exercise: {
      instruction: "Faça 2 tiragens completas para si mesma: (1) Tiragem de 3 cartas (Passado/Presente/Futuro) para sua vida profissional. (2) Tiragem de 3 cartas (Situação/Obstáculo/Conselho) para sua energia atual. Para cada tiragem, escreva a leitura completa como narrativa. Depois releia: as cartas se conectam? A narrativa faz sentido? A leitura é específica ou genérica?",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-6-q1",
        question: "A mesma carta em posições diferentes (obstáculo vs conselho):",
        options: ["Tem o mesmo significado", "Tem significados diferentes — a posição contextualiza a carta", "Anula a leitura", "Deve ser descartada"],
        correctIndex: 1,
        explanation: "Posição = contexto. O Eremita como obstáculo = isolamento. Como conselho = busque solidão.",
      },
      {
        id: "prat-6-q2",
        question: "O 10 de Espadas como 'Situação' indica:",
        options: ["Morte literal", "Esgotamento total, mas também fim de ciclo — o pior já passou", "Nada grave", "Sucesso"],
        correctIndex: 1,
        explanation: "O 10 é limite E fim de ciclo. Na imagem RWS, o amanhecer no fundo indica que a escuridão acaba.",
      },
      {
        id: "prat-6-q3",
        question: "Quando o conselho é Ás de Ouros, a orientação é:",
        options: ["Meditar mais", "Voltar ao básico: corpo, saúde, finanças, rotina", "Viajar", "Estudar tarô"],
        correctIndex: 1,
        explanation: "Ás de Ouros = novo começo material e prático. Cuide da base concreta.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 7 — Prática: leitura de amor
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-7",
    order: 6,
    title: "Prática: Leitura de Amor",
    subtitle: "Simulação completa de leitura amorosa",
    icon: "❤️",
    content: `Amor é o tema mais pedido — e o mais desafiador. Esta lição simula uma consulta amorosa completa, do acolhimento à orientação final. Acompanhe o processo e note cada decisão da leitora.

**Cenário Simulado:**
A consulente, 32 anos, está num relacionamento de 2 anos. Recentemente sentiu distanciamento do parceiro e suspeita que ele está desinteressado. Está ansiosa e quer saber "se ele ainda a ama".

**Passo 1 — Acolhimento e Reformulação:**
A leitora não responde "sim" ou "não". Reformula: "Vamos ver que energia está circulando entre vocês agora e o que essa dinâmica pede de atenção."

**Passo 2 — Tiragem do Espelho (simplificada):**
Ela (pensa | sente | quer): 9 de Espadas | 2 de Copas | Cavaleiro de Copas
Ele (pensa | sente | quer): 4 de Espadas | 6 de Copas | O Eremita

**Passo 3 — Leitura linha a linha:**
Pensamentos: Ela está cheia de ansiedade e cenários catastróficos (9 de Espadas). Ele está em pausa mental — processando algo internamente (4 de Espadas). Desalinhamento: ela rumina, ele silencia.

Sentimentos: Ela sente conexão e amor (2 de Copas). Ele sente nostalgia pelo que tinham (6 de Copas). Alinhamento parcial: ambos sentem, mas ela está no presente e ele no passado.

Intenções: Ela quer se aproximar, demonstrar amor (Cavaleiro de Copas). Ele quer espaço (O Eremita). Desalinhamento claro: ela avança, ele recua.

**Passo 4 — Síntese para a consulente:**
"Ele não parou de amar — mas está num processo interno que precisa de espaço. Seus sentimentos são reais, mas sua ansiedade está criando cenários que não existem. A dinâmica atual pede: pare de interpretar o silêncio dele como rejeição. Dê espaço. Se o amor é real (e as cartas sugerem que é), ele volta — mas no tempo dele, não no seu."`,
    keyPoints: [
      "Acolha primeiro, reformule a pergunta, depois leia",
      "Tiragem do Espelho: compare linha a linha — alinhamento e desalinhamento",
      "Pensamentos, sentimentos e intenções frequentemente se contradizem",
      "Devolva poder à consulente: ela não é vítima da dinâmica",
      "Silêncio ≠ rejeição; distância ≠ desamor",
    ],
    exercise: {
      instruction: "Imagine que uma amiga te pergunta: 'Ele está interessado em mim ou só está brincando?' Reformule a pergunta (sem 'ele' como sujeito). Tire 3 cartas e faça a leitura completa: acolhimento, interpretação e orientação. Escreva como se estivesse falando com a consulente — tom, palavras, ritmo.",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-7-q1",
        question: "A primeira ação da leitora numa consulta amorosa é:",
        options: ["Tirar as cartas imediatamente", "Acolher a consulente e reformular a pergunta", "Dar a resposta que ela quer", "Pedir mais detalhes sobre o parceiro"],
        correctIndex: 1,
        explanation: "Acolhimento + reformulação = base de toda leitura ética.",
      },
      {
        id: "prat-7-q2",
        question: "No cenário simulado, 4 de Espadas na posição 'O que ele pensa' indica:",
        options: ["Ele não pensa nela", "Ele está em pausa mental, processando algo internamente", "Ele está planejando sair", "Ele está feliz"],
        correctIndex: 1,
        explanation: "4 de Espadas = pausa, recuperação, processamento — não indiferença.",
      },
      {
        id: "prat-7-q3",
        question: "Quando ela quer se aproximar (Cavaleiro de Copas) e ele quer espaço (O Eremita), a orientação é:",
        options: ["Forçar a aproximação", "Respeitar o espaço dele — avanço forçado gera recuo", "Terminar tudo", "Ignorar as cartas"],
        correctIndex: 1,
        explanation: "Quando as intenções são opostas, pressionar só amplifica a distância.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 8 — Prática: leitura de trabalho
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-8",
    order: 7,
    title: "Prática: Leitura de Trabalho",
    subtitle: "Simulação de leitura profissional e financeira",
    icon: "💼",
    content: `Leituras de trabalho e finanças têm uma linguagem própria. A consulente busca clareza prática — não abstracta. O tarô pode ajudar com decisões profissionais, mas de forma responsável.

**Cenário Simulado:**
A consulente, 28 anos, é analista numa empresa grande. Recebeu uma proposta de outra empresa com salário melhor, mas ambiente incerto. Pergunta: "Devo aceitar a proposta?"

**Tiragem de Decisão (5 cartas):**
1. Meu estado agora: 7 de Copas
2. Ficar — energia: 4 de Ouros
3. Ficar — destino: 10 de Paus
4. Ir — energia: Cavaleiro de Paus
5. Ir — destino: Ás de Ouros

**Leitura Guiada:**
**Estado atual (7 de Copas):** Confusão. Muitas opções, fantasias, dificuldade de discernir. Ela está vendo as possibilidades mas não consegue escolher — há idealização em ambas as direções.

**Caminho A — Ficar:**
Energia: 4 de Ouros — segurança, mas também estagnação. Ficar garante estabilidade financeira, mas pode significar "segurar" por medo, não por escolha.
Destino: 10 de Paus — sobrecarga. Se ficar, a tendência é acumular mais responsabilidade sem reconhecimento proporcional.

**Caminho B — Ir:**
Energia: Cavaleiro de Paus — entusiasmo, ação, energia nova. A mudança traria renovação e impulso.
Destino: Ás de Ouros — novo começo material. Uma fundação nova com potencial real de crescimento.

**Síntese:** "As cartas não decidem por você — mas mostram claramente as tendências. Ficar oferece segurança com risco de estagnação e sobrecarga. Ir oferece renovação com risco de instabilidade inicial — mas com potencial de um começo sólido. A pergunta real não é 'qual paga mais' — é 'qual me permite crescer?'"

**Nota ética:** A leitora NUNCA decide pela consulente. Apresenta cenários e devolve a decisão.`,
    keyPoints: [
      "Leituras de trabalho pedem linguagem prática e orientação concreta",
      "Tiragem de Decisão compara dois caminhos lado a lado",
      "A leitora apresenta cenários — nunca decide pela consulente",
      "A pergunta real geralmente não é sobre dinheiro, mas sobre crescimento",
    ],
    comparison: {
      title: "Mesma tiragem, abordagens diferentes",
      context: "7 de Copas + 4 de Ouros + 10 de Paus + Cavaleiro de Paus + Ás de Ouros",
      weakReading: "Confusão. Se ficar, segurança. Se for, aventura. Parece que ir é melhor. Vá.",
      strongReading: "Você está num momento de fantasia e indecisão (7 de Copas) — e isso é natural. Ficar oferece a segurança que você conhece (4 de Ouros), mas com tendência a sobrecarga crescente (10 de Paus). Ir traz energia nova e entusiasmo real (Cavaleiro de Paus), abrindo espaço para um recomeço material promissor (Ás de Ouros). As cartas inclinam para a mudança — mas a decisão é sua, e fatores que o tarô não vê (família, saúde, contexto) também pesam.",
      commentary: "A leitura fraca toma a decisão pela consulente ('Vá'). A forte apresenta as tendências com nuance e devolve a agência. Também reconhece que o tarô não vê tudo — humildade fundamental da boa leitora.",
    },
    exercise: {
      instruction: "Tire 5 cartas para a Tiragem de Decisão sobre uma escolha real sua (não precisa ser trabalho). Posições: (1) Meu estado agora, (2) Opção A — energia, (3) Opção A — destino, (4) Opção B — energia, (5) Opção B — destino. Leia como se estivesse apresentando para uma consulente: tom respeitoso, cenários claros, sem decidir por ela.",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-8-q1",
        question: "Na Tiragem de Decisão, a leitora deve:",
        options: ["Escolher a melhor opção para a consulente", "Apresentar cenários e devolver a decisão", "Sempre recomendar mudança", "Evitar ser clara"],
        correctIndex: 1,
        explanation: "A leitora apresenta as energias de cada caminho — a decisão é da consulente.",
      },
      {
        id: "prat-8-q2",
        question: "4 de Ouros como 'energia de ficar' sugere:",
        options: ["Prosperidade", "Segurança com risco de estagnação — segurar por medo, não por escolha", "Mudança", "Desastre financeiro"],
        correctIndex: 1,
        explanation: "4 de Ouros = estabilidade, mas também retenção excessiva e medo de perder o que tem.",
      },
      {
        id: "prat-8-q3",
        question: "A leitura forte reconhece que:",
        options: ["O tarô vê tudo", "Há fatores que o tarô não vê — humildade fundamental da boa leitora", "A carta sempre está certa", "Não existem fatores externos"],
        correctIndex: 1,
        explanation: "Uma boa leitora sabe os limites do instrumento. Família, saúde e contexto também pesam.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 9 — Prática: leitura espiritual
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-9",
    order: 8,
    title: "Prática: Leitura Espiritual",
    subtitle: "Autoconhecimento, propósito e jornada da alma",
    icon: "🌟",
    content: `Leituras espirituais são as mais livres — e as mais perigosas de se tornarem vagas. O segredo é manter profundidade sem perder concretude. A consulente precisa sair com algo aplicável, não apenas com "bonitas palavras místicas".

**Cenário Simulado:**
A consulente sente que está "num vazio". Não está mal, exatamente — mas sente que algo falta, que a vida perdeu sentido. Pergunta: "Qual é o próximo passo da minha jornada espiritual?"

**Tiragem do Caminho Interior (3 cartas):**
1. Onde estou: O Enforcado
2. O que preciso integrar: A Imperatriz
3. O próximo passo: O Mundo

**Leitura Guiada:**
**Onde estou (O Enforcado):** Você está em suspensão voluntária. O vazio que sente não é depressão — é o espaço entre um ciclo que acabou e outro que ainda não começou. O Enforcado pede que você pare de tentar forçar um sentido e permita que o sentido venha. A rendição é o trabalho espiritual deste momento.

**O que preciso integrar (A Imperatriz):** A Imperatriz é fertilidade, nutrição, corpo, sensualidade. Sua busca espiritual pode estar muito na mente e pouco no corpo. Integre o feminino: cuide do corpo, conecte-se com a natureza, permita prazer. Espiritualidade não é só transcendência — é também presença no corpo.

**O próximo passo (O Mundo):** Completude. O ciclo atual está se fechando. O próximo passo não é "fazer" algo — é reconhecer que você já chegou num patamar. O vazio pode ser a porta para um nível mais profundo de consciência. O Mundo diz: você está mais perto do que pensa.

**Nota importante:** Leituras espirituais tendem ao vago. A leitora responsável traduz o simbólico em aplicável: "Cuide do corpo" é mais útil que "Integre o feminino sagrado do cosmos universal."`,
    keyPoints: [
      "Leituras espirituais precisam de profundidade E concretude",
      "Traduza o simbólico em aplicável — evite misticismo vazio",
      "O vazio pode ser transição, não problema — leia com nuance",
      "Espiritualidade inclui corpo, não apenas mente e espírito",
      "O Enforcado = rendição ativa, não passividade",
    ],
    simulation: {
      title: "Tiragem do Propósito",
      context: "A consulente sente que nasceu para algo mas não sabe o quê. Busca 'missão de vida'.",
      question: "Qual é meu propósito de vida?",
      cards: [
        { position: "Seu dom natural", card: "A Sacerdotisa" },
        { position: "Seu desafio", card: "5 de Paus" },
        { position: "Seu propósito em ação", card: "Rainha de Copas" },
      ],
      guidedReading: `**Dom natural (A Sacerdotisa):** Seu dom é a intuição profunda e o acesso ao mistério. Você percebe o que outros não percebem. Isso pode se manifestar como sensibilidade, capacidade de escuta ou dom artístico/oracular.

**Desafio (5 de Paus):** O desafio é a dispersão. Muitos interesses, muitas direções, muitos conflitos de energia. Você pode estar tentando fazer tudo ao mesmo tempo — ou competindo com versões de si mesma. Foco é seu trabalho.

**Propósito em ação (Rainha de Copas):** Seu propósito se manifesta quando você nutre os outros com sua sensibilidade. Seja como terapeuta, artista, educadora ou leitora de tarô — seu caminho envolve cuidar com profundidade emocional. A Rainha de Copas cuida sem se perder — esse é o equilíbrio a buscar.

**Orientação prática:** Não busque "a grande missão". Busque onde sua intuição (Sacerdotisa) pode ser usada para cuidar dos outros (Rainha de Copas) sem se dispersar (5 de Paus). A missão não é um destino — é uma prática diária.`,
      commonMistakes: [
        "Dar respostas grandiosas: 'Você nasceu para transformar o mundo' — vago e inútil",
        "Ignorar o desafio (5 de Paus) — o desafio é tão informativo quanto o dom",
        "Não traduzir em prática: 'Seja mais intuitiva' — mas COMO, concretamente?",
      ],
    },
    exercise: {
      instruction: "Tire 3 cartas para: (1) Meu dom natural, (2) Meu desafio espiritual, (3) Meu propósito em ação. Escreva a leitura com duas regras: nenhuma frase pode ser vaga o bastante para servir a qualquer pessoa; e cada insight deve incluir uma orientação prática concreta. Se escreveu 'confie na intuição', reescreva como 'pratique 10 minutos de silêncio diário para ouvir sua intuição'.",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-9-q1",
        question: "O maior erro em leituras espirituais é:",
        options: ["Ser direta", "Ser vaga e mística sem traduzir em orientação prática", "Usar poucas cartas", "Falar de corpo"],
        correctIndex: 1,
        explanation: "Misticismo vazio não ajuda ninguém. Boas leituras espirituais são profundas E concretas.",
      },
      {
        id: "prat-9-q2",
        question: "O Enforcado como 'onde estou' indica:",
        options: ["Tragédia", "Suspensão voluntária — o espaço entre ciclos, rendição ativa", "Preguiça", "Fim de tudo"],
        correctIndex: 1,
        explanation: "O Enforcado é rendição ativa — parar de forçar para permitir que o novo venha.",
      },
      {
        id: "prat-9-q3",
        question: "'Seu propósito não é um destino — é uma prática diária' significa:",
        options: ["Não existe propósito", "Propósito se vive no cotidiano, não se 'descobre' num evento único", "Ignore o propósito", "Espere acontecer"],
        correctIndex: 1,
        explanation: "A missão se manifesta nas escolhas diárias, não como revelação mágica.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 10 — Avaliação final: leitura completa
  // ═══════════════════════════════════════════════════════════════
  {
    id: "prat-10",
    order: 9,
    title: "Avaliação Final",
    subtitle: "Prove que você sabe ler — leitura completa com auto-avaliação",
    icon: "🏆",
    content: `Esta é sua prova final como leitora em formação. Não há gabarito — porque uma boa leitura não tem resposta "certa". O que existe é qualidade de interpretação, coerência narrativa e responsabilidade ética.

**Sua Tarefa:**
Faça uma leitura completa para alguém (com consentimento) ou para si mesma, seguindo todos os passos que aprendeu:

**Checklist da Leitura Profissional:**

☐ **1. Pergunta reformulada** — Aberta, específica, centrada na consulente
☐ **2. Tiragem escolhida** — Adequada à pergunta (não use Cruz Celta para "como vai meu dia")
☐ **3. Observação antes da interpretação** — 30 segundos olhando cada carta
☐ **4. Leitura por posição** — Cada carta lida no contexto da sua posição
☐ **5. Relação entre cartas** — Conexões, tensões, fluxo narrativo
☐ **6. Narrativa coerente** — A leitura conta uma história, não lista significados
☐ **7. Nuance** — Não reduziu cartas a "bom" ou "ruim"
☐ **8. Orientação prática** — A consulente sai com algo para fazer/pensar/mudar
☐ **9. Ética respeitada** — Não decidiu pela consulente, não deu falsas esperanças, não projetou
☐ **10. Autocrítica** — Releu e identificou pontos de melhoria

**Critérios de Auto-Avaliação:**
- Se marcou 8-10 itens: sua leitura tem qualidade profissional. Continue praticando.
- Se marcou 5-7: boa base, mas precisa refinar narrativa e nuance.
- Se marcou menos de 5: revise as lições anteriores antes de praticar mais.

**Reflexão Final:**
A formação de uma leitora não termina com um módulo — ela acontece a cada leitura, a cada erro reconhecido, a cada nova camada descoberta. O tarô é um instrumento vivo que cresce com você.

**Compromisso da leitora formada:** "Leio para iluminar, não para impressionar. Para revelar, não para confirmar. Para empoderar, não para criar dependência. Para servir com verdade e amor."`,
    keyPoints: [
      "Checklist de 10 pontos para leitura profissional",
      "Auto-avaliação honesta é a ferramenta de crescimento mais poderosa",
      "A formação não termina — cada leitura é treino",
      "Compromisso: iluminar, revelar, empoderar, servir",
    ],
    deepDive: `A jornada de formação de uma leitora pode ser mapeada em 4 estágios:

**1. Aprendiz (onde você estava):** Decora significados, depende de livros, tem medo de errar. As leituras são rígidas e literais. TUDO BEM — todo mundo começa aqui.

**2. Praticante (onde você está agora):** Conhece os significados mas está aprendendo a interpretar. Começa a perceber relações entre cartas. Ainda tropeça em projeção e generalização, mas reconhece quando erra. As leituras começam a ter narrativa.

**3. Leitora (próximo estágio):** Interpreta com fluidez. A intuição guia a leitura tanto quanto o conhecimento. As leituras são específicas, nuançadas e úteis. Reconhece os próprios limites e encaminha quando necessário.

**4. Mestra (com anos de prática):** A leitura é uma extensão natural de quem ela é. Não "usa" o tarô — dialoga com ele. Cada leitura ensina algo novo. Forma outras leitoras com generosidade.

**Onde você está neste mapa?** Provavelmente entre Aprendiz e Praticante — e isso é exatamente onde deveria estar. O próximo passo é simples: pratique. Muito. Com honestidade. Erre, reconheça, ajuste, repita.

A única leitora que não cresce é a que acha que já sabe tudo.`,
    exercise: {
      instruction: "Faça uma leitura completa seguindo o Checklist de 10 pontos. Pode ser para si ou para alguém (com consentimento). Escreva TUDO: pergunta original, pergunta reformulada, tiragem escolhida, cartas tiradas, interpretação por posição, narrativa, orientação. Depois, marque quantos itens do checklist você cumpriu. Seja honesta. Este é o exercício mais importante de todo o módulo.",
      type: "reading",
    },
    quiz: [
      {
        id: "prat-10-q1",
        question: "O que diferencia uma leitura profissional de uma amadora?",
        options: ["O preço cobrado", "Pergunta reformulada, narrativa coerente, nuance, ética e orientação prática", "Usar mais cartas", "Ter baralho caro"],
        correctIndex: 1,
        explanation: "Qualidade profissional vem do método, não do material. É processo, não status.",
      },
      {
        id: "prat-10-q2",
        question: "O compromisso da leitora formada inclui:",
        options: ["Impressionar a consulente", "Iluminar, revelar, empoderar e servir — sem criar dependência", "Prever o futuro", "Confirmar o que a consulente quer"],
        correctIndex: 1,
        explanation: "Os 4 pilares éticos: iluminar, revelar, empoderar, servir. Sem exceções.",
      },
      {
        id: "prat-10-q3",
        question: "Os 4 estágios de formação de leitora são:",
        options: ["Básico, Médio, Avançado, Expert", "Aprendiz, Praticante, Leitora, Mestra", "Iniciante, Intermediário, Senior, Guru", "Bronze, Prata, Ouro, Diamante"],
        correctIndex: 1,
        explanation: "Aprendiz (decora), Praticante (interpreta), Leitora (flui), Mestra (dialoga). Cada estágio tem anos de prática.",
      },
      {
        id: "prat-10-q4",
        question: "A autocrítica na leitura serve para:",
        options: ["Se punir", "Identificar pontos de melhoria — é a ferramenta de crescimento mais poderosa", "Desistir", "Impressionar outros"],
        correctIndex: 1,
        explanation: "A leitora que reconhece seus erros é a que mais cresce. Autocrítica = combustível de evolução.",
      },
    ],
  },
];

export function getPraticaLessonByOrder(order: number): PraticaLesson | undefined {
  return PRATICA_LESSONS.find((l) => l.order === order);
}
