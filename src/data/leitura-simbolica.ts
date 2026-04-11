export interface LeituraSimbolica {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
}

export const LEITURA_SIMBOLICA_LESSONS: LeituraSimbolica[] = [
  {
    id: "ls-1",
    order: 0,
    title: "O Olhar Simbólico",
    subtitle: "Aprender a ver antes de interpretar",
    icon: "👁",
    content: `Antes de interpretar uma carta, você precisa aprender a **olhar** para ela. Parece óbvio, mas a maioria dos estudantes de tarô pula essa etapa: vai direto ao significado, sem observar a imagem.

O tarô Rider-Waite-Smith foi desenhado com intenção. Cada cor, cada gesto, cada objeto, cada direção tem significado. Pamela Colman Smith não colocou nada por acaso — e Arthur Edward Waite supervisionou cada detalhe simbólico.

**O olhar simbólico é uma habilidade treinável.** Não é dom, não é intuição mística — é atenção educada. Quando você aprende a olhar de verdade, começa a ver coisas que antes passavam despercebidas: a direção de um olhar, a cor de um manto, a posição das mãos, o que está no chão.

**Três camadas do olhar:**

**1. Impressão geral.** O que você sente ao ver a carta? Leve, pesada, alegre, tensa? Antes de analisar, registre a sensação.

**2. Inventário visual.** O que está na carta? Liste tudo: pessoas, objetos, animais, paisagem, cores, céu. Não interprete — apenas observe.

**3. Relações.** Como os elementos se conectam? O que está acima e abaixo? O que está à esquerda e à direita? Quem olha para quem?

Este módulo vai te ensinar a transformar seu olhar — de passivo para ativo, de superficial para profundo.`,
    keyPoints: [
      "Olhar vem antes de interpretar — é uma habilidade treinável",
      "Três camadas: impressão geral, inventário visual, relações",
      "O RWS foi desenhado com intenção — nada é decorativo",
      "Registrar a sensação inicial é tão importante quanto a análise",
    ],
    deepDive: `Na tradição da Ordem Hermética da Aurora Dourada, a prática de meditação sobre as cartas era central ao treinamento esotérico. O estudante era instruído a sentar com uma única carta por 20-30 minutos, observando cada detalhe até que a imagem se tornasse viva na mente. Esta prática, chamada de "pathworking", continua sendo uma das formas mais poderosas de estudo do tarô.

Pamela Colman Smith era sinesteta — ela via cores quando ouvia música. Esta capacidade sensorial única influenciou profundamente suas ilustrações, criando uma linguagem visual onde cada cor não apenas representa, mas evoca sensações específicas.`,
    reflection: "Pegue uma carta qualquer do baralho. Antes de pensar no significado, fique 2 minutos apenas olhando. O que você nota que nunca tinha percebido?",
    exercise: { instruction: "Escolha O Louco. Faça um inventário completo: liste todos os objetos, cores, gestos e elementos que consegue identificar. Depois compare com a lista de símbolos da lição do arcano.", type: "observation" },
    quiz: [
      { id: "ls1-q1", question: "Qual é a primeira camada do olhar simbólico?", options: ["Análise cabalística", "Impressão geral — o que você sente", "Memorização de significados", "Comparação com outras cartas"], correctIndex: 1, explanation: "A impressão geral — a sensação inicial — é a primeira camada do olhar simbólico." },
      { id: "ls1-q2", question: "Quem ilustrou o baralho Rider-Waite-Smith?", options: ["Arthur Edward Waite", "Aleister Crowley", "Pamela Colman Smith", "Éliphas Lévi"], correctIndex: 2, explanation: "Pamela Colman Smith ilustrou todas as 78 cartas do RWS sob supervisão de Arthur Edward Waite." },
    ],
  },
  {
    id: "ls-2",
    order: 1,
    title: "A Linguagem das Cores",
    subtitle: "O que cada cor revela no RWS",
    icon: "🎨",
    content: `No Rider-Waite-Smith, as cores não são decoração — são **linguagem**. Cada cor carrega um significado simbólico consistente ao longo de todas as 78 cartas.

**Amarelo/Dourado** — Consciência, energia solar, intelecto, iluminação divina. Aparece em fundos (O Sol, A Estrela), halos e coroas. Sempre que o fundo é amarelo, a energia é de clareza e consciência.

**Azul** — Intuição, profundidade, água, inconsciente, espiritualidade. O manto da Sacerdotisa, o céu em muitas cartas, a água de Copas. Azul é receptivo — escuta antes de falar.

**Vermelho** — Paixão, vontade, ação, desejo, poder. O manto do Mago, as rosas, o sangue. Vermelho é ativo — age antes de pensar.

**Branco** — Pureza, inocência, potencial, verdade. A rosa do Louco, o cavalo da Morte, o lírio do Mago. Branco é o que ainda não foi manchado pela experiência.

**Preto** — Mistério, inconsciente profundo, o desconhecido, poder oculto. A coluna B da Sacerdotisa, o fundo do Diabo. Preto não é "negativo" — é o que ainda não foi iluminado.

**Verde** — Natureza, crescimento, fertilidade, ciclos. A vegetação da Imperatriz, os campos nas cartas de Ouros. Verde é vida em expansão.

**Cinza** — Neutralidade, sabedoria discreta, transição, nevoeiro. As nuvens, as armaduras, os castelos ao fundo. Cinza é o espaço entre o preto e o branco.

Quando você domina a linguagem das cores, começa a ler cartas que nunca estudou — porque a paleta já conta a história.`,
    keyPoints: [
      "Amarelo = consciência; Azul = intuição; Vermelho = ação",
      "Branco = pureza; Preto = mistério; Verde = crescimento",
      "As cores são consistentes em todas as 78 cartas do RWS",
      "Dominar cores permite ler cartas desconhecidas pela paleta",
    ],
    deepDive: `Na tradição da Golden Dawn, cada cor era associada a um dos quatro mundos cabalísticos e a um planeta ou elemento. Waite e Smith usaram esse sistema como base, mas simplificaram-no para criar uma linguagem visual acessível. O vermelho, por exemplo, está ligado a Marte (ação, conflito) e ao elemento Fogo. O azul conecta-se à Lua (intuição, ciclos) e ao elemento Água.`,
    reflection: "Compare O Mago (vermelho/branco) com A Sacerdotisa (azul/branco). Como as cores expressam a diferença entre ação e contemplação?",
    exercise: { instruction: "Separe 5 cartas do baralho. Para cada uma, liste as cores dominantes e tente deduzir o significado APENAS pelas cores, sem ler o nome da carta.", type: "observation" },
    quiz: [
      { id: "ls2-q1", question: "No RWS, o que a cor azul geralmente simboliza?", options: ["Ação e poder", "Intuição e profundidade", "Riqueza material", "Perigo e alerta"], correctIndex: 1, explanation: "Azul simboliza intuição, profundidade, água e espiritualidade no RWS." },
      { id: "ls2-q2", question: "O que a cor vermelha no manto do Mago representa?", options: ["Perigo iminente", "Vontade ativa e poder de realização", "Raiva e conflito", "Amor romântico"], correctIndex: 1, explanation: "O vermelho no Mago representa vontade ativa, paixão e poder de realização." },
    ],
  },
  {
    id: "ls-3",
    order: 2,
    title: "Gestos, Postura e Direção",
    subtitle: "O corpo fala nas cartas",
    icon: "🤲",
    content: `No RWS, cada figura tem uma postura específica — e essa postura **é** o significado.

**Mãos erguidas** — Receber do alto (canalizar), invocar, abrir-se. O Mago ergue a mão direita com um bastão. O Hierofante ergue dois dedos em bênção.

**Mãos para baixo** — Manifestar na terra, dar, oferecer. A mão esquerda do Mago aponta para baixo. A Estrela derrama água.

**De frente** — Consciência, presença, confronto direto. O Diabo olha para você. A Justiça olha para você. Quando a figura está de frente, ela exige que você a encare.

**De perfil** — Movimento, transição, jornada. O Louco caminha para a direita. O Carro avança. Perfil indica processo, não chegada.

**De costas** — Mistério, introspecção, despedida. O 8 de Copas mostra alguém partindo. As costas indicam algo que não quer ser visto — ou que precisa ser deixado para trás.

**Sentado** — Estabilidade, autoridade, domínio, espera. O Imperador senta no trono. A Sacerdotisa senta entre as colunas. Sentar é ter poder sem precisar se mover.

**Direção do olhar** — Para onde a figura olha é para onde sua energia flui. Figuras que olham para a esquerda contemplam o passado; para a direita, movem-se para o futuro; para cima, conectam-se com o divino; para baixo, com o material ou inconsciente.

Ler postura é ler intenção. Antes de saber "o que a carta significa", observe: o que ela está **fazendo**?`,
    keyPoints: [
      "Mãos erguidas = receber; mãos para baixo = manifestar",
      "De frente = confronto; perfil = movimento; costas = despedida",
      "Sentado = autoridade e estabilidade sem movimento",
      "Direção do olhar indica fluxo de energia e atenção temporal",
    ],
    exercise: { instruction: "Compare O Imperador (sentado, de frente, olhando para você) com O Louco (de perfil, caminhando). Como a postura expressa a diferença entre estrutura e liberdade?", type: "observation" },
    quiz: [
      { id: "ls3-q1", question: "No RWS, o que geralmente significa uma figura de costas?", options: ["Força e poder", "Mistério, introspecção ou despedida", "Alegria e celebração", "Liderança"], correctIndex: 1, explanation: "Figuras de costas indicam mistério, introspecção ou algo que precisa ser deixado para trás." },
      { id: "ls3-q2", question: "Se uma figura olha para a esquerda, o que isso sugere?", options: ["Medo do futuro", "Contemplação do passado", "Desatenção", "Ação imediata"], correctIndex: 1, explanation: "Olhar para a esquerda geralmente indica contemplação do passado ou revisão interior." },
    ],
  },
  {
    id: "ls-4",
    order: 3,
    title: "O Cenário como Mensagem",
    subtitle: "Paisagem, céu e ambiente nas cartas",
    icon: "🏔",
    content: `O fundo de uma carta não é decoração — é **contexto emocional e simbólico**.

**Montanhas** — Desafios, conquistas, obstáculos ou sabedoria distante. Montanhas atrás de uma figura sugerem que ela superou algo. Montanhas à frente indicam o que ainda virá.

**Água** — Emoções, inconsciente, fluxo. Água calma = paz interior. Água agitada = turbulência emocional. Rio = emoções em movimento. Mar = profundidade do inconsciente.

**Céu limpo** — Clareza, consciência, abertura. O Sol brilha sem nuvens. A Estrela brilha em céu noturno claro.

**Nuvens** — Pensamento, abstração, confusão ou revelação divina. As nuvens no Ás de cada naipe são mãos divinas oferecendo presentes. Nuvens cinzas podem indicar incerteza.

**Deserto/terreno árido** — Purificação, solidão necessária, isolamento. O Eremita caminha em terreno austero.

**Jardim/vegetação** — Abundância, crescimento, fertilidade. A Imperatriz é cercada de natureza exuberante.

**Cidade/castelo ao fundo** — Civilização, estrutura social, o mundo material deixado para trás ou a ser conquistado.

**Noite vs. dia** — Noite = inconsciente, mistério, mundo interior. Dia = consciência, clareza, mundo exterior. Crepúsculo = transição.`,
    keyPoints: [
      "Montanhas = desafios ou conquistas; Água = emoções e inconsciente",
      "Céu limpo = clareza; Nuvens = pensamento ou confusão",
      "Vegetação = abundância; Deserto = purificação",
      "Noite = inconsciente; Dia = consciência; Crepúsculo = transição",
    ],
    exercise: { instruction: "Compare o cenário de A Estrela (água, noite, natureza) com o de A Torre (noite, raio, queda). Como o fundo expressa energias completamente diferentes?", type: "observation" },
    quiz: [
      { id: "ls4-q1", question: "O que a água calma geralmente simboliza no RWS?", options: ["Perigo", "Paz interior e equilíbrio emocional", "Estagnação", "Riqueza"], correctIndex: 1, explanation: "Água calma simboliza paz interior, equilíbrio emocional e tranquilidade." },
      { id: "ls4-q2", question: "Quando montanhas aparecem atrás de uma figura, o que sugerem?", options: ["Medo de alturas", "Desafios superados ou sabedoria alcançada", "Isolamento social", "Viagem física"], correctIndex: 1, explanation: "Montanhas atrás de uma figura sugerem desafios já superados ou sabedoria distante alcançada." },
    ],
  },
  {
    id: "ls-5",
    order: 4,
    title: "Números e Geometria Sagrada",
    subtitle: "O que os números revelam nas cartas",
    icon: "🔢",
    content: `Cada número no tarô carrega uma frequência. De Ás a 10, os números contam uma história de ciclo — do nascimento à completude.

**1 (Ás)** — Começo puro, semente, potencial. É a oferta divina — a mão que sai das nuvens.

**2** — Dualidade, escolha, equilíbrio, parceria. Duas forças que podem se complementar ou se opor.

**3** — Criação, expansão, primeiro resultado. O triângulo — a forma mais estável.

**4** — Estrutura, fundação, estabilidade, pausa. O quadrado — seguro, mas potencialmente rígido.

**5** — Conflito, crise, mudança, desequilíbrio. O número que sacode a estrutura do 4.

**6** — Harmonia, equilíbrio restaurado, generosidade, beleza. Depois do conflito do 5, o 6 traz resolução.

**7** — Reflexão, avaliação, mistério, busca interior. Pausa contemplativa antes do próximo passo.

**8** — Movimento, poder, domínio, fluxo. Energia canalizada — o lemniscata (∞) em ação.

**9** — Culminação, quase-completude, isolamento ou realização. O último passo antes do fim do ciclo.

**10** — Completude, fim de ciclo, herança, peso ou plenitude. O 10 contém todos os números — e prepara o retorno ao 1.

Quando você combina o número com o naipe, a carta praticamente se lê sozinha: 5 de Espadas = conflito mental. 3 de Copas = expansão emocional. 10 de Ouros = plenitude material.`,
    keyPoints: [
      "Ás = começo; 5 = crise; 10 = completude",
      "Números pares tendem à estabilidade; ímpares ao movimento",
      "Número + naipe = leitura natural dos Arcanos Menores",
      "Os números contam uma jornada do nascimento à plenitude",
    ],
    exercise: { instruction: "Organize os 10 Ouros em sequência. Leia a jornada do Ás (semente) ao 10 (plenitude material). Que história os números contam?", type: "practice" },
    quiz: [
      { id: "ls5-q1", question: "O que o número 5 geralmente representa no tarô?", options: ["Estabilidade", "Harmonia", "Conflito e desequilíbrio", "Completude"], correctIndex: 2, explanation: "O 5 é o número do conflito, crise e desequilíbrio — ele sacode a estrutura do 4." },
      { id: "ls5-q2", question: "Como ler '3 de Copas' usando número + naipe?", options: ["Conflito emocional", "Expansão e criação emocional", "Fim de relacionamento", "Estabilidade material"], correctIndex: 1, explanation: "3 = expansão/criação + Copas = emoções → Expansão emocional, celebração, amizade." },
    ],
  },
  {
    id: "ls-6",
    order: 5,
    title: "Símbolos Universais do RWS",
    subtitle: "A gramática visual que atravessa todas as cartas",
    icon: "🔑",
    content: `Alguns símbolos aparecem repetidamente ao longo do RWS. Conhecê-los é aprender a gramática visual do tarô.

**Rosas** — Desejo, paixão, beleza. Vermelhas = desejo ativo. Brancas = pureza de intenção. Aparecem no Mago, Morte, Louco, Força.

**Lírios** — Pureza, inocência, espiritualidade. Frequentes no Mago e em Copas. Contraponto das rosas.

**Coroas** — Autoridade, domínio, consciência elevada. Coroas reais (Imperador, Imperatriz), coroas de louros (Mundo), coroas de estrelas (Imperatriz).

**Colunas** — Dualidade, portal, limiar. B e J da Sacerdotisa, os portais do Hierofante. Colunas marcam a passagem entre mundos.

**Serpente/Ouroboros** — Ciclos, eternidade, sabedoria, tentação. O cinto do Mago, a serpente do Mundo.

**Lemniscata (∞)** — Infinito, domínio eterno, ciclos sem fim. Mago (sobre a cabeça), Força (sobre a cabeça), 2 de Pentáculos.

**Anjo/Figura alada** — Mensageiro divino, revelação, julgamento. O anjo da Temperança, os querubins dos Ases.

**Lua** — Intuição, ciclos, feminino, inconsciente. Aparece nos pés da Sacerdotisa, na carta da Lua, em várias cartas de Copas.

**Sol** — Consciência, clareza, verdade, energia masculina. Fundo do Louco, carta do Sol, ases.

**Chave** — Conhecimento oculto, acesso, mistério revelado. As chaves do Hierofante.

Dominar estes símbolos é dominar o vocabulário visual do tarô.`,
    keyPoints: [
      "Rosas = desejo; Lírios = pureza — são opostos complementares",
      "Lemniscata (∞) aparece no Mago, Força e 2 de Pentáculos",
      "Colunas marcam portais entre mundos (Sacerdotisa, Hierofante)",
      "Lua = intuição/feminino; Sol = consciência/masculino",
    ],
    exercise: { instruction: "Encontre o símbolo do lemniscata (∞) em pelo menos 3 cartas diferentes. O que ele significa em cada contexto?", type: "observation" },
    quiz: [
      { id: "ls6-q1", question: "O que as rosas vermelhas simbolizam no RWS?", options: ["Perigo", "Desejo ativo e paixão", "Luto", "Inocência"], correctIndex: 1, explanation: "Rosas vermelhas simbolizam desejo ativo, paixão e beleza no RWS." },
      { id: "ls6-q2", question: "Em quais cartas o lemniscata (∞) aparece?", options: ["Louco e Sacerdotisa", "Mago e Força", "Imperador e Imperatriz", "Sol e Lua"], correctIndex: 1, explanation: "O lemniscata aparece sobre a cabeça do Mago e da Força, indicando domínio infinito." },
    ],
  },
  {
    id: "ls-7",
    order: 6,
    title: "Luz, Sombra e Contexto",
    subtitle: "Nenhuma carta é só boa ou só ruim",
    icon: "☯",
    content: `Uma das armadilhas mais comuns no estudo do tarô é dividir as cartas em "boas" e "ruins". O Sol é bom? A Torre é ruim? A Morte é negativa?

**Nenhuma carta é absolutamente positiva ou negativa.** Cada uma contém luz e sombra — e o contexto da leitura determina qual aspecto se manifesta.

**Luz** é a expressão mais elevada da energia da carta. É quando o arquétipo funciona a favor do consulente.

**Sombra** é a expressão distorcida, excessiva ou bloqueada. É quando a mesma energia se volta contra a pessoa — por excesso, falta ou negação.

**Exemplo — O Sol:**
- Luz: Alegria genuína, clareza, vitalidade, sucesso.
- Sombra: Ego inflado, arrogância, exposição excessiva, superficialidade.

**Exemplo — A Morte:**
- Luz: Transformação profunda, renascimento, fim necessário.
- Sombra: Resistência à mudança, agarrar-se ao que já morreu, destruição sem reconstrução.

**O contexto que define:**
- A posição na tiragem (conselho vs. obstáculo)
- A pergunta feita (amor vs. trabalho)
- As cartas vizinhas (amenizam ou intensificam)
- O momento da consulente (o que ela está vivendo)

**A leitura madura não julga cartas — interpreta contextos.** Isso é o que separa quem decora de quem realmente lê.`,
    keyPoints: [
      "Nenhuma carta é absolutamente positiva ou negativa",
      "Luz = expressão elevada; Sombra = distorção ou bloqueio",
      "O contexto (posição, pergunta, vizinhança) define qual aspecto se manifesta",
      "Leitura madura interpreta contextos, não julga cartas",
    ],
    exercise: { instruction: "Pegue A Torre. Escreva 3 situações em que ela seria positiva (luz) e 3 em que seria desafiadora (sombra). Perceba como o contexto muda tudo.", type: "writing" },
    quiz: [
      { id: "ls7-q1", question: "O que determina se uma carta se manifesta na luz ou na sombra?", options: ["O naipe da carta", "O número da carta", "O contexto: posição, pergunta e cartas vizinhas", "A intuição do leitor"], correctIndex: 2, explanation: "O contexto — posição na tiragem, pergunta, cartas vizinhas e momento — determina qual aspecto se manifesta." },
      { id: "ls7-q2", question: "Qual é a sombra possível de O Sol?", options: ["Depressão", "Ego inflado e arrogância", "Falta de energia", "Medo da luz"], correctIndex: 1, explanation: "Na sombra, O Sol pode indicar ego inflado, arrogância e exposição excessiva." },
    ],
  },
  {
    id: "ls-8",
    order: 7,
    title: "Interpretar sem Decorar",
    subtitle: "Do significado fixo à leitura viva",
    icon: "🌊",
    content: `O objetivo final deste módulo é que você nunca precise "decorar" o significado de uma carta. Em vez disso, você vai **ler** a carta — como se lê uma cena, uma pintura, um sonho.

**O método em 5 passos:**

**1. Olhar** — Observe a imagem sem pressa. O que salta aos olhos? Que sensação ela provoca?

**2. Identificar** — Quais são os símbolos centrais? Cores dominantes? Postura da figura? Cenário?

**3. Sentir** — Qual é a emoção da carta? Pesada? Leve? Tensa? Serena? Confie na sua percepção.

**4. Contextualizar** — Onde essa carta apareceu? Em resposta a qual pergunta? Ao lado de quais outras cartas? Na posição de conselho, obstáculo, passado ou futuro?

**5. Narrar** — Una tudo numa frase que faça sentido para a situação. Não recite definições — crie uma interpretação viva, que responda à pergunta.

**Exemplo prático:**
Carta: 9 de Espadas. Posição: obstáculo. Pergunta: "Por que não consigo avançar na carreira?"

Leitura mecânica: "9 de Espadas = ansiedade e medo."
Leitura viva: "O obstáculo não é externo — é interno. Pensamentos repetitivos e medo do fracasso estão paralisando sua ação. A carta mostra alguém sozinha no escuro, coberta: você está se isolando com seus medos em vez de confrontá-los."

Esse é o salto. E ele começa com a forma como você **olha**.`,
    keyPoints: [
      "5 passos: olhar, identificar, sentir, contextualizar, narrar",
      "Leitura viva responde à pergunta; leitura mecânica recita definições",
      "Confiar na percepção é parte do método, não um atalho",
      "O objetivo é ler imagens, não repetir textos memorizados",
    ],
    exercise: { instruction: "Tire 1 carta aleatória. Aplique os 5 passos com a pergunta: 'O que eu preciso saber hoje?' Escreva sua interpretação completa em 3-5 frases.", type: "practice" },
    quiz: [
      { id: "ls8-q1", question: "Qual é a diferença entre leitura mecânica e leitura viva?", options: ["A mecânica usa mais cartas", "A viva ignora os símbolos", "A mecânica recita definições; a viva responde ao contexto", "Não há diferença real"], correctIndex: 2, explanation: "A leitura mecânica recita significados decorados; a viva interpreta no contexto da pergunta e situação." },
      { id: "ls8-q2", question: "Qual dos 5 passos vem antes de 'identificar'?", options: ["Narrar", "Contextualizar", "Olhar", "Sentir"], correctIndex: 2, explanation: "Olhar é o primeiro passo — observar sem pressa antes de identificar símbolos." },
    ],
  },
];
