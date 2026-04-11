export interface TrabalharTaroLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
}

export const TRABALHAR_TARO_LESSONS: TrabalharTaroLesson[] = [
  {
    id: "tt-1", order: 0, title: "Quando Estou Pronta para Atender?", subtitle: "Do estudo à prática profissional", icon: "🎯",
    content: `A pergunta mais frequente de quem estuda tarô: "Quando estou pronta para ler para outras pessoas?"

**Não existe diploma obrigatório.** Tarô não é profissão regulamentada. Mas existe uma distância enorme entre estudar e atender bem. Aqui está o mapa:

**Você NÃO está pronta quando:**
- Ainda precisa consultar o significado de cada carta
- Não consegue criar narrativa entre as cartas
- Não sabe reformular perguntas do consulente
- Não consegue separar suas projeções da leitura
- Não tem prática com tiragens variadas

**Você ESTÁ pronta quando:**
- Conhece todas as 78 cartas (essência, não decoradas)
- Consegue interpretar combinações sem hesitar
- Sabe reformular perguntas para leituras mais honestas
- Consegue dar notícias difíceis com empatia
- Praticou pelo menos 50 leituras (para si e para conhecidos)
- Sente confiança — não certeza, confiança

**O caminho recomendado:**
1. Estude todos os módulos desta plataforma
2. Pratique com amigos e familiares (sem cobrar)
3. Faça 30-50 leituras gratuitas
4. Peça feedback honesto
5. Comece a cobrar quando sentir que entrega valor real`,
    keyPoints: ["Não existe diploma — mas existe preparo real", "Conhecer as 78 cartas, criar narrativa, reformular perguntas", "30-50 leituras gratuitas antes de cobrar", "Confiança (não certeza) é o sinal de prontidão"],
    exercise: { instruction: "Faça um autodiagnóstico honesto: dos 5 critérios de prontidão, quantos você já domina? Quais precisa desenvolver?", type: "reflection" },
    quiz: [
      { id: "tt1-q1", question: "Quantas leituras gratuitas são recomendadas antes de cobrar?", options: ["5-10", "10-20", "30-50", "100+"], correctIndex: 2, explanation: "30-50 leituras gratuitas dão a prática necessária e a confiança para entregar leituras de valor." },
    ],
  },
  {
    id: "tt-2", order: 1, title: "A Condução da Leitura", subtitle: "Do acolhimento à síntese", icon: "🗣",
    content: `Uma leitura profissional não é apenas tirar cartas — é uma **experiência completa** para o consulente. A forma como você conduz é tão importante quanto o que as cartas dizem.

**Estrutura de uma sessão (45-60 min):**

**1. Acolhimento (5 min)**
- Receba o consulente com calma
- Explique brevemente como funciona
- Pergunte se já fez leitura antes

**2. Formulação da pergunta (5-10 min)**
- Ouça o que a pessoa traz
- Ajude a reformular perguntas vagas ou fechadas
- Defina juntos: o que queremos clarear?

**3. Leitura (20-30 min)**
- Embaralhe e disponha as cartas
- Interprete carta a carta, depois em conjunto
- Use linguagem acessível — sem jargão esotérico
- Envolva o consulente: "Isso faz sentido para você?"

**4. Síntese (5-10 min)**
- Resuma o tema central em 2-3 frases
- Destaque o conselho mais importante
- Pergunte: "Ficou alguma dúvida?"

**5. Encerramento (5 min)**
- Agradeça a confiança
- Se apropriado, sugira uma reflexão para casa
- Não prometa resultados — convide à ação consciente`,
    keyPoints: ["Sessão de 45-60 min: acolhimento → pergunta → leitura → síntese → encerramento", "Ajudar a reformular perguntas é parte essencial do trabalho", "Linguagem acessível, sem jargão esotérico", "Envolver o consulente: 'Isso faz sentido para você?'"],
    exercise: { instruction: "Simule uma sessão completa com alguém de confiança. Siga os 5 passos. Peça feedback sobre como se sentiu.", type: "practice" },
    quiz: [
      { id: "tt2-q1", question: "Qual é a estrutura recomendada de uma sessão de tarô profissional?", options: ["Tirar cartas e dizer o significado", "Acolhimento → pergunta → leitura → síntese → encerramento", "Embaralhar e entregar ao consulente", "Ler todas as 78 cartas"], correctIndex: 1, explanation: "Uma sessão profissional segue 5 etapas: acolhimento, formulação da pergunta, leitura, síntese e encerramento." },
    ],
  },
  {
    id: "tt-3", order: 2, title: "Postura com o Consulente", subtitle: "Empatia, limites e profissionalismo", icon: "🤝",
    content: `Sua postura define a experiência. O consulente precisa se sentir **seguro, respeitado e empoderado**.

**Princípios de postura:**

**1. Escute mais do que fale.** Muitos tarólogos falam demais. O consulente precisa se sentir ouvido antes de receber orientação.

**2. Não julgue.** Pessoas trazem temas difíceis: traições, vícios, decisões polêmicas. Seu papel não é julgar — é iluminar.

**3. Seja honesta com delicadeza.** Se as cartas mostram algo difícil, não maquie — mas também não brutalize. "As cartas indicam que..." é melhor que "Você vai...".

**4. Não crie dependência.** O objetivo é empoderar. Se alguém volta toda semana com a mesma pergunta, converse sobre isso.

**5. Mantenha limites.** Você não é terapeuta, médica ou advogada. Encaminhe quando necessário.

**6. Cuidado com transferência.** O consulente pode projetar em você figuras de autoridade. Mantenha distância profissional.

**O que NUNCA fazer:**
- Criar pânico ("algo muito ruim vem aí")
- Diagnosticar doenças
- Prometer resultados
- Cobrar mais por "leitura mais profunda" no meio da sessão
- Compartilhar histórias de outros consulentes`,
    keyPoints: ["Escutar mais do que falar — o consulente precisa se sentir ouvido", "Honestidade com delicadeza, nunca pânico", "Não criar dependência — empoderar é o objetivo", "Manter limites profissionais: não é terapeuta"],
    exercise: { instruction: "Escreva sua 'carta de princípios' pessoal: 5 compromissos que você assume com seus futuros consulentes.", type: "writing" },
    quiz: [
      { id: "tt3-q1", question: "O que fazer se um consulente volta toda semana com a mesma pergunta?", options: ["Ler novamente normalmente", "Conversar sobre a dependência e empoderar", "Recusar o atendimento", "Cobrar mais caro"], correctIndex: 1, explanation: "Quando alguém repete a mesma pergunta, é sinal de dependência. Converse sobre isso e ajude a pessoa a confiar em si." },
    ],
  },
  {
    id: "tt-4", order: 3, title: "Ética Profissional", subtitle: "O código de conduta do tarólogo", icon: "⚖️",
    content: `Ética profissional não é opcional — é o fundamento de qualquer prática séria.

**Código de ética sugerido:**

**1. Confidencialidade.** Tudo que é dito na sessão é confidencial. Sem exceções. Nunca use histórias de consulentes em redes sociais, mesmo "anonimizadas".

**2. Transparência.** Seja clara sobre: duração, preço, método e limites. O consulente sabe o que esperar antes de começar.

**3. Consentimento.** Nunca leia sobre terceiros sem o conhecimento deles. Reformule perguntas invasivas.

**4. Honestidade.** Não minta para agradar. Não exagere para impressionar. Não invente significados.

**5. Limites profissionais.** Não ofereça terapia, diagnóstico médico ou conselho legal. Encaminhe.

**6. Não-manipulação.** Nunca use informações da leitura para manipular, chantagear ou criar medo.

**7. Preço justo.** Cobre pelo seu tempo e preparo, não pela "revelação". Evite preços abusivos.

**8. Educação contínua.** Continue estudando. Nunca pare de se aprofundar.

**Situações-limite:**
- Consulente menciona ideação suicida → encaminhe para CVV (188) ou CAPS
- Consulente relata violência doméstica → oriente sobre canais de denúncia
- Consulente quer "amarrar" alguém → recuse. Ética acima de receita`,
    keyPoints: ["Confidencialidade absoluta — sem exceções", "Transparência sobre duração, preço e limites", "Encaminhar quando o tema extrapola o tarô", "Educação contínua: nunca pare de estudar"],
    exercise: { instruction: "Escreva seu código de ética pessoal em 8-10 pontos. Imprima e coloque onde possa vê-lo antes de cada atendimento.", type: "writing" },
    quiz: [
      { id: "tt4-q1", question: "O que fazer se um consulente menciona ideação suicida?", options: ["Fazer uma leitura de proteção", "Encaminhar para CVV (188) ou CAPS", "Continuar a leitura normalmente", "Dar conselhos pessoais"], correctIndex: 1, explanation: "Ideação suicida exige encaminhamento profissional. Oriente sobre o CVV (188) e CAPS. Isso não é papel do tarô." },
    ],
  },
  {
    id: "tt-5", order: 4, title: "Comunicação na Leitura", subtitle: "Como transmitir o que as cartas mostram", icon: "💬",
    content: `A melhor leitura do mundo é inútil se mal comunicada. A forma como você traduz as cartas é uma habilidade treinável.

**Princípios de comunicação:**

**1. Linguagem acessível.** "A carta indica um período de introspecção necessária" é melhor que "O Eremita no caminho de Yod entre Chesed e Tiferet sugere retiro contemplativo".

**2. Fale em possibilidades, não em certezas.** "As cartas indicam que...", "Uma possibilidade é...", "Isso sugere que..." — nunca "Isso VAI acontecer".

**3. Use analogias.** "É como plantar uma semente — ainda não dá para ver o resultado, mas o trabalho invisível está acontecendo."

**4. Envolva o consulente.** "Isso ressoa com algo que você está vivendo?" — a leitura é um diálogo, não um monólogo.

**5. Dê espaço para silêncio.** Depois de uma revelação importante, pause. Deixe a pessoa processar.

**Erros comuns:**
- Falar rápido demais (nervosismo)
- Usar muito jargão técnico
- Não olhar para o consulente (ficar fixada nas cartas)
- Monólogo sem verificar se faz sentido
- Suavizar demais verdades necessárias`,
    keyPoints: ["Linguagem acessível, sem jargão esotérico", "Possibilidades, não certezas: 'as cartas indicam que...'", "Analogias ajudam a traduzir conceitos abstratos", "Silêncio depois de revelações é respeito, não desconforto"],
    exercise: { instruction: "Grave (em áudio) uma interpretação de 3 cartas como se estivesse falando com um consulente. Ouça depois: usou jargão? Falou rápido? Envolveu a pessoa?", type: "practice" },
    quiz: [
      { id: "tt5-q1", question: "Qual é a melhor forma de comunicar uma interpretação?", options: ["'Isso VAI acontecer'", "'As cartas indicam que...' — linguagem de possibilidade", "'O Eremita no caminho de Yod...' — termos técnicos", "'Eu acho que...' — opinião pessoal"], correctIndex: 1, explanation: "Linguagem de possibilidade ('as cartas indicam que...') é mais honesta e menos intimidadora do que certezas absolutas." },
    ],
  },
  {
    id: "tt-6", order: 5, title: "Organização Profissional", subtitle: "Agenda, preço, espaço e presença online", icon: "📋",
    content: `Se você decidiu trabalhar com tarô, precisa de organização profissional — mesmo que comece como atividade complementar.

**Agenda:**
- Defina dias e horários fixos para atendimento
- Tenha um sistema de agendamento (Google Calendar, Calendly, WhatsApp Business)
- Não atenda sem hora marcada — respeite seu tempo

**Preço:**
- Pesquise o mercado da sua cidade/região
- Considere: tempo (preparo + sessão + anotação), estudo, experiência
- Faixas comuns (2024): R$80-200 para sessão de 45-60 min
- Ofereça política clara de cancelamento

**Espaço:**
- Presencial: sala limpa, confortável, privada
- Online: boa iluminação, câmera na altura dos olhos, fundo neutro, boa internet

**Presença online:**
- Instagram: conteúdo educativo sobre tarô (não previsões genéricas)
- Depoimentos: peça a clientes satisfeitos (com permissão)
- Portfólio: não exponha leituras reais — mostre seu método e visão

**Finanças:**
- Registre todos os atendimentos e receitas
- Considere MEI (Microempreendedor Individual) para formalização
- Separe conta pessoal de conta profissional`,
    keyPoints: ["Agenda fixa, sistema de agendamento, política de cancelamento", "Pesquisar preço do mercado local (R$80-200 para 45-60 min)", "Presença online educativa, não previsões genéricas", "Considerar MEI para formalização e registrar finanças"],
    exercise: { instruction: "Monte seu plano profissional: defina horários, pesquise preços na sua região, escolha canais de divulgação. Escreva tudo num documento.", type: "writing" },
    quiz: [
      { id: "tt6-q1", question: "Que tipo de conteúdo postar nas redes sociais como taróloga?", options: ["Previsões genéricas ('Signo de Áries esta semana')", "Conteúdo educativo sobre tarô e método", "Leituras reais de clientes (anonimizadas)", "Promessas de resultados"], correctIndex: 1, explanation: "Conteúdo educativo sobre tarô atrai clientes que valorizam profundidade — não promessas ou previsões genéricas." },
    ],
  },
  {
    id: "tt-7", order: 6, title: "Atendimento Online", subtitle: "Ler tarô à distância com qualidade", icon: "💻",
    content: `O atendimento online se tornou majoritário. Funciona tão bem quanto presencial — se feito com cuidado.

**Plataformas:** Zoom, Google Meet, WhatsApp vídeo. Prefira videochamada — o olho no olho importa.

**Preparação técnica:**
- Teste câmera e microfone antes
- Iluminação frontal (não atrás de você)
- Câmera posicionada para mostrar seu rosto E as cartas
- Internet estável (se possível, cabo)
- Silêncio no ambiente

**Adaptações para online:**
- Mostre as cartas à câmera, uma por uma
- Vá mais devagar — a conexão digital exige mais atenção
- Anuncie o que está fazendo: "Agora vou embaralhar", "Essa é a primeira carta"
- Após a sessão, envie foto das cartas e um resumo por escrito

**Vantagens do online:**
- Alcance geográfico ilimitado
- Comodidade para o consulente
- Gravação da sessão (com consentimento)
- Menor custo operacional (sem sala)`,
    keyPoints: ["Videochamada > áudio — o olho no olho importa", "Câmera mostrando rosto + cartas, iluminação frontal", "Ir mais devagar online e narrar cada ação", "Enviar foto das cartas + resumo após a sessão"],
    exercise: { instruction: "Faça um teste: monte seu setup de atendimento online. Grave um vídeo teste de 3 minutos interpretando 3 cartas. Avalie: a imagem é clara? Dá para ver as cartas?", type: "practice" },
    quiz: [
      { id: "tt7-q1", question: "O que enviar ao consulente após um atendimento online?", options: ["Nada", "Foto das cartas e um resumo por escrito", "Uma lista de livros para estudar", "O vídeo completo sem edição"], correctIndex: 1, explanation: "Enviar foto das cartas e um breve resumo é um toque profissional que agrega valor ao atendimento." },
    ],
  },
  {
    id: "tt-8", order: 7, title: "Crescimento e Educação Contínua", subtitle: "O tarô como caminho vivo", icon: "🌱",
    content: `O estudo do tarô não termina com o último módulo deste curso. Ele **nunca termina** — e essa é a beleza do caminho.

**Como continuar crescendo:**

**1. Pratique diariamente.** O diário do tarô (1 carta/dia) é a prática mais transformadora.

**2. Leia livros.** Recomendações essenciais:
- "78 Degrees of Wisdom" — Rachel Pollack
- "The Tarot" — Robert Place
- "Tarot and the Tree of Life" — Isabel Radow Kliegman
- "Holistic Tarot" — Benebell Wen

**3. Estude outras tradições.** Marselha, Thoth, Lenormand — cada sistema amplia sua compreensão.

**4. Busque supervisão.** Converse com tarólogos mais experientes. Peça que avaliem suas leituras.

**5. Participe de comunidades.** Grupos de estudo, fóruns, encontros presenciais.

**6. Ensine.** Ensinar é a forma mais profunda de aprender. Quando você explica para alguém, consolida o conhecimento.

**7. Volte às cartas.** Periodicamente, releia os módulos deste curso. Você vai notar coisas que não notou antes — porque você mudou.

**O tarô é um espelho.** Quanto mais você cresce, mais ele mostra. A jornada do Louco é eterna — não há linha de chegada, apenas caminho.`,
    keyPoints: ["Prática diária (diário do tarô) é a base do crescimento", "Leia livros de referência e estude outras tradições", "Busque supervisão e participe de comunidades", "Ensinar consolida o conhecimento — volte às cartas periodicamente"],
    exercise: { instruction: "Crie seu plano de educação contínua: defina 1 livro para ler, 1 prática diária e 1 forma de conexão com outros estudiosos. Comece esta semana.", type: "writing" },
    quiz: [
      { id: "tt8-q1", question: "Por que voltar a reler os módulos do curso periodicamente?", options: ["Porque esquecemos tudo", "Porque mudamos e percebemos coisas novas", "Porque os módulos mudam", "Porque é obrigatório"], correctIndex: 1, explanation: "Quando você cresce, o tarô mostra mais. Relendo com novos olhos, percebe camadas que antes eram invisíveis." },
    ],
  },
];
