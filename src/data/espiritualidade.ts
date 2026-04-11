export interface EspiritualidadeLesson {
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

export const ESPIRITUALIDADE_LESSONS: EspiritualidadeLesson[] = [
  {
    id: "esp-1", order: 0, title: "O Tarô como Instrumento Sagrado", subtitle: "Além da técnica, a dimensão espiritual", icon: "🕯",
    content: `O tarô não é apenas um sistema de interpretação — é um **instrumento simbólico e espiritual**. Ao longo dos séculos, tradições herméticas, cabalísticas, junguianas e contemporâneas reconheceram no tarô uma ferramenta de conexão com dimensões mais profundas da consciência.

Isso não significa que você precisa aderir a uma religião ou crença específica para usar o tarô. Significa que, quando tratado com respeito e intenção, o tarô se torna mais do que cartas — ele vira um espelho da alma.

**O que torna o tarô "espiritual":**
- Ele trabalha com **símbolos universais** (arquétipos) que transcendem culturas.
- Ele convida à **introspecção** — olhar para dentro antes de buscar respostas fora.
- Ele opera num **espaço liminar** — entre o consciente e o inconsciente.
- Ele exige **presença** — estar inteiro no momento da leitura.

**O que NÃO é espiritualidade no tarô:**
- Não é adivinhação determinística ("isso VAI acontecer").
- Não é submissão às cartas ("as cartas mandaram").
- Não é teatro místico (velas, incensos e jargão sem substância).
- Não é superioridade ("eu sei o que as cartas dizem e você não").

A espiritualidade no tarô é **honestidade profunda** — com você, com o consulente e com o sagrado que habita o silêncio entre as perguntas.`,
    keyPoints: ["O tarô é instrumento simbólico e espiritual, não apenas técnico", "Trabalha com arquétipos universais que transcendem culturas", "Espiritualidade no tarô = presença + introspecção + honestidade", "Não é adivinhação, submissão ou teatro místico"],
    exercise: { instruction: "Antes da próxima leitura, sente-se em silêncio por 2 minutos. Respire. Pergunte-se: 'Estou presente?' Depois, faça a leitura. Note a diferença.", type: "practice" },
    quiz: [
      { id: "esp1-q1", question: "O que torna o tarô um instrumento espiritual?", options: ["Usar velas e incenso", "Trabalhar com símbolos universais e exigir presença", "Fazer previsões precisas", "Seguir uma religião específica"], correctIndex: 1, explanation: "O tarô é espiritual porque trabalha com símbolos universais e exige presença, introspecção e honestidade." },
    ],
  },
  {
    id: "esp-2", order: 1, title: "Preparação Interior", subtitle: "Como se preparar antes de uma leitura", icon: "🧘",
    content: `Uma leitura de tarô começa antes de tocar nas cartas. A **preparação interior** é o que separa uma leitura superficial de uma leitura profunda.

**Por que preparar-se:**
- Sua mente precisa sair do modo automático (trabalho, redes sociais, preocupações) e entrar no modo receptivo.
- Sua energia precisa estar limpa — não carregada de ansiedade, projeções ou expectativas.
- Seu ego precisa recuar — você não lê para confirmar o que quer ouvir.

**Ritual simples de preparação (5 minutos):**

1. **Silêncio** — Desligue notificações. Sente-se. Feche os olhos. 1 minuto.
2. **Respiração** — 3 ciclos de respiração profunda: inspira em 4, segura em 4, solta em 6.
3. **Intenção** — Declare internamente: "Que esta leitura traga clareza e verdade."
4. **Presença** — Abra os olhos. Toque nas cartas. Sinta o peso, a textura.
5. **Pergunta** — Formule a pergunta com clareza antes de embaralhar.

**O que evitar antes de ler:**
- Ler quando está emocionalmente abalada sobre o tema.
- Ler repetidamente a mesma pergunta até conseguir a resposta que quer.
- Ler por obrigação, pressa ou para impressionar.
- Ler sem formular uma pergunta clara.`,
    keyPoints: ["Preparação interior separa leitura superficial de profunda", "Ritual simples: silêncio → respiração → intenção → presença → pergunta", "Evitar ler sob emoção, pressa ou para confirmar desejos", "O ego precisa recuar para que a leitura seja honesta"],
    exercise: { instruction: "Pratique o ritual de 5 minutos descrito acima antes de uma leitura real. Depois escreva: como a preparação mudou a qualidade da leitura?", type: "practice" },
    quiz: [
      { id: "esp2-q1", question: "Por que se preparar antes de uma leitura?", options: ["Para impressionar o consulente", "Para sair do modo automático e entrar no modo receptivo", "Porque é obrigatório no tarô", "Para ativar poderes sobrenaturais"], correctIndex: 1, explanation: "A preparação ajuda a sair do modo automático e entrar no modo receptivo, limpando a mente de projeções." },
    ],
  },
  {
    id: "esp-3", order: 2, title: "Limpeza do Espaço", subtitle: "Criar um ambiente propício para a leitura", icon: "✨",
    content: `O espaço onde você lê tarô importa. Não porque exista uma regra mística obrigatória, mas porque o **ambiente influencia a qualidade da presença**.

**Princípios da limpeza do espaço:**

**1. Organização** — Uma mesa limpa e organizada ajuda a mente a focar. Retire objetos desnecessários.

**2. Iluminação** — Luz suave é ideal. Nem escuridão total (que dificulta ver as cartas), nem luz fluorescente (que quebra a atmosfera).

**3. Silêncio ou som intencional** — Desligue o que distrai. Se quiser música, escolha algo instrumental e suave.

**4. Objetos de intenção** — Opcional, mas poderoso: uma vela acesa pode marcar o "início" do espaço sagrado. Um cristal, um tecido bonito para as cartas, um incenso leve.

**5. Limpeza energética** — Se você trabalha com esse conceito: bater palmas nos cantos do espaço, acender sálvia ou palo santo, passar as cartas pela fumaça.

**O que realmente importa:**
O espaço precisa comunicar: "Aqui, algo diferente acontece." Não precisa ser elaborado — precisa ser intencional. Uma mesa limpa com uma vela acesa já é um espaço sagrado.

**Para atendimento profissional:** O espaço precisa transmitir respeito e acolhimento. O consulente deve se sentir seguro, não intimidado.`,
    keyPoints: ["O ambiente influencia a qualidade da presença", "Princípios: organização, iluminação suave, silêncio, intenção", "Não precisa ser elaborado — precisa ser intencional", "Para atendimento: o espaço deve transmitir respeito e acolhimento"],
    exercise: { instruction: "Monte seu espaço de leitura ideal. Limpe a mesa, acenda uma vela, escolha uma música. Faça uma leitura nesse espaço e compare com leituras feitas na pressa.", type: "practice" },
    quiz: [
      { id: "esp3-q1", question: "O que é mais importante num espaço de leitura?", options: ["Muitas velas e incensos", "Escuridão total", "Intenção e presença", "Decoração elaborada"], correctIndex: 2, explanation: "O espaço não precisa ser elaborado — precisa ser intencional. Uma mesa limpa com uma vela já basta." },
    ],
  },
  {
    id: "esp-4", order: 3, title: "Presença e Intenção", subtitle: "O coração de toda leitura verdadeira", icon: "💎",
    content: `**Presença** é estar inteira no momento da leitura — não pensando no passado, não ansioso pelo futuro, não projetando desejos nas cartas.

**Intenção** é a direção que você dá à leitura — o "para quê". Sem intenção, as cartas são imagens bonitas. Com intenção, tornam-se espelhos.

**Como cultivar presença:**
- Respire antes de olhar para as cartas.
- Observe a carta por 5 segundos antes de pensar no significado.
- Quando perceber que está raciocinando demais, volte à imagem.
- Confie no que vem primeiro — a primeira impressão costuma ser a mais honesta.

**Como definir intenção:**
- Antes de embaralhar, declare (em voz alta ou mentalmente): "Que esta leitura traga clareza sobre [tema]."
- A intenção não determina o resultado — ela direciona o foco.
- Uma intenção honesta produz uma leitura honesta. Uma intenção enviesada produz uma leitura distorcida.

**O paradoxo da leitura:** Quanto mais você tenta controlar o resultado, pior a leitura fica. Quanto mais se rende à verdade das cartas — mesmo quando incomoda — melhor a leitura se torna.`,
    keyPoints: ["Presença = estar inteira no momento, sem projeções", "Intenção = direção da leitura, não controle do resultado", "A primeira impressão costuma ser a mais honesta", "Quanto mais se rende à verdade, melhor a leitura"],
    exercise: { instruction: "Faça uma leitura sobre algo que você deseja muito. Observe: você está lendo as cartas ou tentando fazê-las dizer o que quer ouvir?", type: "reflection" },
    quiz: [
      { id: "esp4-q1", question: "O que é 'intenção' no contexto de uma leitura?", options: ["Controlar o resultado", "Direcionar o foco sem determinar o resultado", "Pedir às cartas o que quer ouvir", "Repetir até conseguir a resposta certa"], correctIndex: 1, explanation: "Intenção direciona o foco da leitura sem tentar controlar o resultado — ela abre, não força." },
    ],
  },
  {
    id: "esp-5", order: 4, title: "Limites Éticos na Leitura", subtitle: "O que ler, o que não ler, e como proteger", icon: "⚖️",
    content: `A ética no tarô não é um conjunto de regras arbitrárias — é a estrutura que protege tanto quem lê quanto quem consulta.

**Princípios éticos fundamentais:**

**1. Não diagnosticar.** Tarô não é medicina, psicologia ou direito. Se as cartas sugerem saúde frágil, diga "as cartas indicam cuidado com a saúde" — não "você está doente".

**2. Não prever morte ou tragédia.** Mesmo que as cartas pareçam "pesadas", A Morte é transformação, A Torre é revelação. Nunca use o tarô para criar pânico.

**3. Não ler sobre terceiros sem consentimento.** "O que meu ex está pensando?" é uma pergunta invasiva. Redirecione: "O que eu preciso saber sobre essa dinâmica?"

**4. Não criar dependência.** O objetivo é empoderar o consulente, não torná-lo dependente de suas leituras. Ensine-o a confiar em si.

**5. Confidencialidade absoluta.** O que é dito durante uma leitura é sagrado. Nunca compartilhe histórias de consulentes.

**6. Honestidade com delicadeza.** As cartas às vezes mostram verdades difíceis. Seu papel é comunicá-las com honestidade E com cuidado. Verdade sem empatia é crueldade.

**7. Saber quando não ler.** Se você está emocionalmente envolvida no tema, passe a leitura para outra pessoa. Se o consulente está em crise aguda, encaminhe para profissional adequado.`,
    keyPoints: ["Não diagnosticar, não prever tragédias, não invadir terceiros", "Confidencialidade absoluta é inegociável", "Verdade com empatia — honestidade sem crueldade", "Saber quando não ler e quando encaminhar"],
    exercise: { instruction: "Escreva 3 perguntas que você NÃO leria no tarô e explique por quê. Depois escreva como reformularia cada uma de forma ética.", type: "writing" },
    quiz: [
      { id: "esp5-q1", question: "Se as cartas sugerem problemas de saúde, o que fazer?", options: ["Diagnosticar a doença", "Dizer que as cartas indicam cuidado com a saúde e sugerir consultar um médico", "Ignorar a carta", "Prever o pior cenário"], correctIndex: 1, explanation: "Tarô não diagnostica. Indique cuidado e sugira que o consulente procure um profissional de saúde." },
    ],
  },
  {
    id: "esp-6", order: 5, title: "O Tarô e Tradições Espirituais", subtitle: "Cabala, hermetismo, psicologia e além", icon: "📿",
    content: `O tarô dialoga com diversas tradições espirituais sem pertencer exclusivamente a nenhuma:

**Cabala** — O sistema da Árvore da Vida conecta cada Arcano Maior a um caminho entre os Sephiroth. Cada carta numerada dos Menores se liga a um Sephirah. Esta é a conexão mais profunda e sistemática.

**Hermetismo** — A tradição de Hermes Trismegisto ("como acima, assim abaixo") permeia o tarô. O Mago é a encarnação deste princípio.

**Astrologia** — Cada Arcano Maior está associado a um signo ou planeta. A Lua = Câncer/Lua. O Sol = Leão/Sol. A roda zodiacal e o tarô se espelham.

**Psicologia Junguiana** — Carl Jung via o tarô como expressão dos arquétipos do inconsciente coletivo. Cada carta é um padrão psíquico universal.

**Alquimia** — A transformação do chumbo em ouro é análoga à jornada do Louco ao Mundo — de matéria bruta a consciência plena.

**Você não precisa dominar todas as tradições.** Escolha a que ressoa com você e use-a para aprofundar sua compreensão. O tarô é grande o suficiente para acolher múltiplas perspectivas.`,
    keyPoints: ["O tarô dialoga com Cabala, hermetismo, astrologia, Jung e alquimia", "Nenhuma tradição 'possui' o tarô — ele acolhe múltiplas perspectivas", "Cabala oferece a conexão mais sistemática (Árvore da Vida)", "Escolha a tradição que ressoa e use para aprofundar"],
    exercise: { instruction: "Releia a seção 'Cabala' de O Louco, O Mago e A Sacerdotisa. Trace as conexões: como os caminhos na Árvore da Vida refletem a jornada dos arcanos?", type: "reflection" },
    quiz: [
      { id: "esp6-q1", question: "Qual tradição conecta sistematicamente cada Arcano Maior a um caminho na Árvore da Vida?", options: ["Astrologia", "Cabala", "Alquimia", "Psicologia junguiana"], correctIndex: 1, explanation: "A Cabala conecta cada Arcano Maior a um caminho entre os Sephiroth na Árvore da Vida." },
    ],
  },
  {
    id: "esp-7", order: 6, title: "Meditação com as Cartas", subtitle: "Pathworking e contemplação visual", icon: "🌀",
    content: `Uma das práticas espirituais mais poderosas com o tarô é a **meditação visual** — também chamada de pathworking na tradição da Golden Dawn.

**Como praticar:**

**1. Escolha uma carta.** Comece com cartas que te atraem. O Louco é excelente para iniciantes.

**2. Prepare o espaço.** Silêncio, conforto, sem interrupções. 15-20 minutos.

**3. Observe a carta.** Fique 3-5 minutos apenas olhando, memorizando cada detalhe.

**4. Feche os olhos.** Recrie a imagem mentalmente. Veja as cores, os objetos, a paisagem.

**5. Entre na carta.** Imagine que a imagem cresce até se tornar uma paisagem real. Você está lá. O que vê? O que sente? O que ouve?

**6. Converse com a figura.** Pergunte algo. Espere a resposta sem forçar. O que vier, registre.

**7. Retorne.** Quando sentir que é hora, saia da imagem. Abra os olhos. Anote tudo imediatamente.

**Esta prática treina:**
- Intuição visual
- Memória simbólica
- Conexão pessoal com os arquétipos
- Capacidade de leitura profunda

Não é "imaginação" — é diálogo com o inconsciente usando a linguagem que ele melhor compreende: imagens.`,
    keyPoints: ["Pathworking = entrar na carta em meditação visual", "Treina intuição, memória simbólica e conexão com arquétipos", "Não é imaginação — é diálogo com o inconsciente", "Prática regular transforma a profundidade das leituras"],
    exercise: { instruction: "Faça a meditação com O Louco seguindo os 7 passos. Anote tudo que viu, sentiu e ouviu. Compare com o conteúdo editorial da carta.", type: "practice" },
    quiz: [
      { id: "esp7-q1", question: "O que é pathworking no contexto do tarô?", options: ["Decorar significados", "Meditação visual onde se 'entra' na carta", "Estudo acadêmico das cartas", "Tiragem de cartas em sequência"], correctIndex: 1, explanation: "Pathworking é a prática de meditação visual onde o praticante 'entra' na carta e dialoga com seus elementos." },
    ],
  },
  {
    id: "esp-8", order: 7, title: "Diário do Tarô", subtitle: "A prática contemplativa diária", icon: "📓",
    content: `O **diário do tarô** é a prática espiritual mais simples e mais transformadora que existe. Consiste em tirar uma carta por dia e registrar a experiência.

**Como praticar:**

**Manhã:** Tire 1 carta. Sem consultar significados, registre: impressão, emoção, intuição.

**Noite:** Releia sua anotação da manhã. Pergunte: como essa carta se manifestou no meu dia? O que ela anunciou? O que ela refletiu?

**Formato sugerido:**
- Data
- Carta tirada
- Primeira impressão (1 frase)
- Como se manifestou (1-3 frases, à noite)
- O que aprendi (1 frase)

**Por que funciona:**
- Cria vocabulário pessoal com as cartas.
- Treina o olhar simbólico no cotidiano.
- Desenvolve a intuição pela repetição.
- Constrói uma biblioteca viva de experiências com cada carta.

**Depois de 78 dias** (um ciclo completo), você terá pelo menos uma vivência pessoal com cada carta — isso vale mais do que qualquer livro.`,
    keyPoints: ["Tirar 1 carta/dia e registrar impressão + manifestação", "Cria vocabulário pessoal e treina olhar simbólico", "78 dias = uma vivência com cada carta do baralho", "A prática mais simples e mais transformadora"],
    exercise: { instruction: "Comece seu diário do tarô hoje. Tire 1 carta, registre sua impressão. À noite, complete: como ela se manifestou?", type: "writing" },
    quiz: [
      { id: "esp8-q1", question: "Por que o diário do tarô é tão eficaz?", options: ["Porque decora significados", "Porque cria vocabulário pessoal e treina intuição pela repetição", "Porque substitui livros de estudo", "Porque prevê o futuro do dia"], correctIndex: 1, explanation: "O diário cria vocabulário pessoal com as cartas e treina a intuição pela repetição e reflexão diária." },
    ],
  },
];
