export interface ExtraMaterial {
  id: string;
  title: string;
  type: "text" | "audio" | "pdf" | "video" | "link";
  description: string;
  content?: string; // for text type
  url?: string; // for audio/pdf/video/link
  duration?: string; // for audio/video
}

export interface LessonLayer {
  /** Short, gamified main content — required to advance */
  main: {
    essence: string;
    light: string;
    shadow: string;
    practicalApplication: string;
  };
  /** Optional deeper content — NOT required to advance */
  deepDive: {
    text: string;
    symbolism?: string;
    history?: string;
    cabala?: string;
  };
  /** Extra materials — library items per card */
  extras: ExtraMaterial[];
  /** Reflective exercise */
  exercise: {
    instruction: string;
    type: "reflection" | "journaling" | "meditation" | "practice";
    duration?: string;
  };
}

export interface ArcanoData {
  id: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  firstPersonIntro: string;
  layers: LessonLayer;
  quiz: QuizQuestion[];
  unlocked: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  completedQuizzes: string[];
  completedExercises: string[];
  badges: Badge[];
  currentModule: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface LearningModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  unlocked: boolean;
  cards: number[]; // arcano IDs
}

export const MODULES: LearningModule[] = [
  { id: "fundamentos", name: "Fundamentos do Tarô", description: "A base de tudo", icon: "📖", order: 0, unlocked: true, cards: [] },
  { id: "arcanos-maiores", name: "Arcanos Maiores", description: "A Jornada do Louco", icon: "🃏", order: 1, unlocked: true, cards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { id: "copas", name: "Naipe de Copas", description: "Emoções e relacionamentos", icon: "💧", order: 2, unlocked: false, cards: [] },
  { id: "paus", name: "Naipe de Paus", description: "Ação e criatividade", icon: "🔥", order: 3, unlocked: false, cards: [] },
  { id: "espadas", name: "Naipe de Espadas", description: "Mente e conflitos", icon: "⚔️", order: 4, unlocked: false, cards: [] },
  { id: "ouros", name: "Naipe de Ouros", description: "Material e prosperidade", icon: "💎", order: 5, unlocked: false, cards: [] },
  { id: "combinacoes", name: "Combinações", description: "Leitura integrada", icon: "🔗", order: 6, unlocked: false, cards: [] },
  { id: "tiragens", name: "Tiragens", description: "Métodos de leitura", icon: "🎴", order: 7, unlocked: false, cards: [] },
  { id: "amor", name: "Amor e Relacionamentos", description: "Foco temático", icon: "❤️", order: 8, unlocked: false, cards: [] },
  { id: "pratica", name: "Prática Guiada", description: "Exercícios reais", icon: "✨", order: 9, unlocked: false, cards: [] },
];

export const THE_FOOL: ArcanoData = {
  id: 0,
  name: "O Louco",
  numeral: "0",
  subtitle: "O Início da Jornada",
  keywords: ["Liberdade", "Coragem", "Travessia", "Impulso", "Desapego"],
  firstPersonIntro:
    "Eu sou o Louco. Sou o primeiro passo antes da certeza. Sou o impulso que nasce antes da garantia. Em mim existe liberdade, abertura, risco e movimento. Eu não prometo segurança. Eu ensino travessia.",
  layers: {
    main: {
      essence:
        "Eu sou o primeiro passo antes da certeza. Sou o impulso que nasce antes da garantia. Em mim existe liberdade, abertura, risco e movimento. Não sou o início — sou a coragem de iniciar, o sopro antes da primeira palavra, o passo antes do caminho existir.",
      light:
        "Na minha luz, eu falo de coragem para começar, espontaneidade, fé e desapego. Sou o salto de fé que você dá quando decide mudar de vida, declarar amor sem garantias, recomeçar sem mapa. Quando me encontra na luz, você está pronta para o novo — sem precisar saber exatamente onde vai chegar.",
      shadow:
        "Na minha sombra, eu aviso sobre imprudência, confusão, fuga e falta de direção. Torno-me a irresponsabilidade que se finge de espontaneidade, a fuga travestida de liberdade. Quando me encontra na sombra, talvez esteja evitando compromissos, pulando de projeto em projeto sem terminar nenhum.",
      practicalApplication:
        "Quando apareço em uma leitura, posso indicar começo, aventura, descoberta ou instabilidade. Tudo depende do contexto, da pergunta e das cartas ao redor. Pergunte-se: 'Onde estou me segurando demais? Que primeiro passo estou adiando?' Eu convido a agir com fé — não cegamente, mas com a confiança de quem sabe que a jornada importa mais que o destino.",
    },
    deepDive: {
      text: "O Louco é o Arcano número 0 — e esse zero é significativo. Ele não está no início nem no fim; está em toda parte e em lugar nenhum. Na tradição do Tarot de Marselha, O Louco é o único Arcano Maior sem número fixo, podendo ser colocado antes do Mago (como potencial puro) ou depois do Mundo (como renascimento).",
      symbolism: "A trouxa representa o karma — experiências que carregamos sem saber conscientemente. O cachorro que o acompanha pode ser tanto um guia instintivo quanto uma advertência. O precipício não é queda: é fé. As montanhas ao fundo representam os desafios que ficaram para trás — ou os que virão.",
      cabala: "Na Cabala, O Louco corresponde à letra hebraica Aleph (א), o sopro silencioso, a respiração primordial. Está ligado ao caminho entre Keter (a Coroa, a unidade divina) e Chokmah (a Sabedoria). É a faísca que desce do mais alto para iniciar toda a criação.",
      history: "Historicamente, O Louco era visto como o bobo da corte — alguém que podia dizer verdades incômodas ao rei sem punição. Nas cartas de tarô mais antigas, ele aparecia como um mendigo ou um vagabundo, mas ao longo dos séculos foi transformado em um símbolo de liberdade espiritual.",
    },
    extras: [
      {
        id: "fool-extra-1",
        title: "O Louco no Tarot de Marselha vs. Rider-Waite",
        type: "text",
        description: "Comparação entre as duas tradições mais influentes",
        content: "No Tarot de Marselha, O Louco aparece sendo perseguido por um animal que morde suas roupas — um aviso para prestar atenção. Já no Rider-Waite, criado por Arthur Edward Waite e ilustrado por Pamela Colman Smith, o tom é mais otimista: o jovem caminha alegremente à beira do precipício, com um pequeno cão branco como companheiro fiel. As flores em sua mão representam a apreciação da beleza, e a montanha branca ao fundo simboliza as alturas espirituais que o aguardam.",
      },
      {
        id: "fool-extra-2",
        title: "Meditação Guiada — O Salto de Fé",
        type: "audio",
        description: "10 minutos de meditação com a energia do Louco",
        url: "#",
        duration: "10 min",
      },
      {
        id: "fool-extra-3",
        title: "Artigo: O Arquétipo do Louco na Psicologia Junguiana",
        type: "pdf",
        description: "Como Carl Jung interpretava a figura do Louco",
        url: "#",
      },
    ],
    exercise: {
      instruction:
        "Encontre um momento de silêncio. Feche os olhos e imagine-se à beira de um precipício seguro, com um horizonte infinito à frente. Pergunte a si mesmo: 'Se eu não tivesse medo, o que eu faria agora?' Anote a primeira coisa que vier à mente, sem censurar. Esse é o chamado do Louco para você hoje.",
      type: "reflection",
      duration: "10 min",
    },
  },
  quiz: [
    {
      id: "fool-q1",
      question: "Qual é o número associado ao arcano O Louco?",
      options: ["I", "0", "XXII", "XIII"],
      correctIndex: 1,
      explanation: "O Louco é o arcano número 0 — representando o potencial puro, o vazio fértil antes de qualquer manifestação.",
    },
    {
      id: "fool-q2",
      question: "Na Cabala, a qual letra hebraica O Louco corresponde?",
      options: ["Beth (ב)", "Aleph (א)", "Gimel (ג)", "Daleth (ד)"],
      correctIndex: 1,
      explanation: "Aleph (א) é o sopro silencioso, a respiração primordial — conectando O Louco ao caminho entre Keter e Chokmah.",
    },
    {
      id: "fool-q3",
      question: "Qual é o aspecto SOMBRA do Louco?",
      options: [
        "Coragem para novos começos",
        "Imprudência disfarçada de coragem",
        "Sabedoria interior",
        "Conexão espiritual profunda",
      ],
      correctIndex: 1,
      explanation: "Na sombra, O Louco se torna imprudência — fuga travestida de liberdade, irresponsabilidade fingindo espontaneidade.",
    },
    {
      id: "fool-q4",
      question: "O que a trouxa do Louco simboliza?",
      options: ["Riqueza material", "Conhecimento acadêmico", "Karma e experiências inconscientes", "Medo do desconhecido"],
      correctIndex: 2,
      explanation: "A trouxa representa o karma — experiências que carregamos sem saber conscientemente, bagagem da alma.",
    },
    {
      id: "fool-q5",
      question: "Quando O Louco aparece como conselho em uma leitura, ele convida a:",
      options: [
        "Planejar cada detalhe antes de agir",
        "Desistir do que não funciona",
        "Agir com fé, confiando na jornada",
        "Esperar o momento perfeito",
      ],
      correctIndex: 2,
      explanation: "O Louco convida a agir com fé — não cegamente, mas com a confiança de que a jornada importa mais que o destino.",
    },
  ],
  unlocked: true,
};

export const ARCANOS_MAIORES: Pick<ArcanoData, "id" | "name" | "numeral" | "subtitle" | "unlocked">[] = [
  { id: 0, name: "O Louco", numeral: "0", subtitle: "O Início da Jornada", unlocked: true },
  { id: 1, name: "O Mago", numeral: "I", subtitle: "O Poder da Vontade", unlocked: false },
  { id: 2, name: "A Sacerdotisa", numeral: "II", subtitle: "O Véu do Mistério", unlocked: false },
  { id: 3, name: "A Imperatriz", numeral: "III", subtitle: "A Abundância Criativa", unlocked: false },
  { id: 4, name: "O Imperador", numeral: "IV", subtitle: "A Estrutura e Ordem", unlocked: false },
  { id: 5, name: "O Hierofante", numeral: "V", subtitle: "A Tradição Sagrada", unlocked: false },
  { id: 6, name: "Os Enamorados", numeral: "VI", subtitle: "A Escolha do Coração", unlocked: false },
  { id: 7, name: "O Carro", numeral: "VII", subtitle: "A Vontade em Movimento", unlocked: false },
  { id: 8, name: "A Força", numeral: "VIII", subtitle: "O Poder Interior", unlocked: false },
  { id: 9, name: "O Eremita", numeral: "IX", subtitle: "A Luz Interior", unlocked: false },
  { id: 10, name: "A Roda da Fortuna", numeral: "X", subtitle: "Os Ciclos do Destino", unlocked: false },
  { id: 11, name: "A Justiça", numeral: "XI", subtitle: "O Equilíbrio Kármico", unlocked: false },
  { id: 12, name: "O Enforcado", numeral: "XII", subtitle: "A Rendição Sagrada", unlocked: false },
  { id: 13, name: "A Morte", numeral: "XIII", subtitle: "A Grande Transformação", unlocked: false },
  { id: 14, name: "A Temperança", numeral: "XIV", subtitle: "A Alquimia Interior", unlocked: false },
  { id: 15, name: "O Diabo", numeral: "XV", subtitle: "As Correntes da Ilusão", unlocked: false },
  { id: 16, name: "A Torre", numeral: "XVI", subtitle: "A Revelação Súbita", unlocked: false },
  { id: 17, name: "A Estrela", numeral: "XVII", subtitle: "A Esperança Renovada", unlocked: false },
  { id: 18, name: "A Lua", numeral: "XVIII", subtitle: "O Caminho da Intuição", unlocked: false },
  { id: 19, name: "O Sol", numeral: "XIX", subtitle: "A Alegria Radiante", unlocked: false },
  { id: 20, name: "O Julgamento", numeral: "XX", subtitle: "O Despertar Final", unlocked: false },
  { id: 21, name: "O Mundo", numeral: "XXI", subtitle: "A Completude", unlocked: false },
];

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  completedExercises: [],
  badges: [
    { id: "first-step", name: "Primeiro Passo", description: "Começou a Jornada do Louco", icon: "✦", earned: false },
    { id: "fool-complete", name: "O Louco Revelado", description: "Completou a lição do Louco", icon: "🃏", earned: false },
    { id: "quiz-master", name: "Mestre do Quiz", description: "Acertou 100% em um quiz", icon: "⭐", earned: false },
    { id: "deep-diver", name: "Mergulho Profundo", description: "Explorou todo o aprofundamento", icon: "🔮", earned: false },
    { id: "streak-3", name: "Chama Constante", description: "3 dias consecutivos de estudo", icon: "🔥", earned: false },
    { id: "streak-7", name: "Devoto do Tarô", description: "7 dias consecutivos de estudo", icon: "💫", earned: false },
    { id: "library-explorer", name: "Exploradora", description: "Acessou 3 materiais extras", icon: "📚", earned: false },
  ],
  currentModule: 0,
};
