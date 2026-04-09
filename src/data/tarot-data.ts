export interface ArcanoData {
  id: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  essence: string;
  light: string;
  shadow: string;
  practicalApplication: string;
  firstPersonIntro: string;
  deepDive: {
    text: string;
    exercise: string;
  };
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

export const THE_FOOL: ArcanoData = {
  id: 0,
  name: "O Louco",
  numeral: "0",
  subtitle: "O Início da Jornada",
  keywords: ["Liberdade", "Espontaneidade", "Novo Começo", "Inocência", "Aventura"],
  essence:
    "Eu sou o sopro antes da primeira palavra, o passo antes do caminho existir. Não sou o início — sou a coragem de iniciar. Carrego tudo o que preciso em minha trouxa: nada além de fé e curiosidade. O abismo à minha frente não me assusta, pois ainda não aprendi a ter medo.",
  light:
    "Em minha luz, sou a liberdade absoluta. Sou o salto de fé que você dá quando decide mudar de vida, largar o emprego seguro, declarar amor sem garantias. Sou a criança que pergunta 'por quê?' sem parar, porque cada resposta abre uma nova porta. Quando me encontra em sua luz, você está pronto para começar algo novo sem a necessidade de saber exatamente onde vai chegar.",
  shadow:
    "Na minha sombra, torno-me imprudência disfarçada de coragem. Sou a fuga travestida de liberdade, a irresponsabilidade que se finge de espontaneidade. Quando me encontra na sombra, talvez esteja evitando compromissos, pulando de projeto em projeto sem terminar nenhum, ou tomando riscos sem reflexão alguma.",
  practicalApplication:
    "Quando O Louco aparece em uma leitura, pergunte-se: 'Onde estou me segurando demais? Que primeiro passo estou adiando?' Se está na posição de conselho, O Louco convida a agir com fé — não cegamente, mas com a confiança de quem sabe que a jornada é mais importante que o destino.",
  firstPersonIntro:
    "Olá, viajante! Eu sou O Louco — o zero, o vazio fértil, o nada que contém tudo. Antes de me julgar pelo nome, saiba: não sou insano, sou livre. Livre de expectativas, livre de medos aprendidos, livre de mapas que outros desenharam. Você me encontra aqui, no precipício entre o mundo conhecido e o desconhecido, pronto para dar o primeiro passo de uma jornada que mudará tudo. Vem comigo?",
  deepDive: {
    text: "O Louco é o Arcano número 0 — e esse zero é significativo. Ele não está no início nem no fim; está em toda parte e em lugar nenhum. Na tradição do Tarot de Marselha, O Louco é o único Arcano Maior sem número fixo, podendo ser colocado antes do Mago (como potencial puro) ou depois do Mundo (como renascimento). Na Cabala, O Louco corresponde à letra hebraica Aleph (א), o sopro silencioso, a respiração primordial. Está ligado ao caminho entre Keter (a Coroa, a unidade divina) e Chokmah (a Sabedoria). É a faísca que desce do mais alto para iniciar toda a criação. Simbolicamente, sua trouxa representa o karma — as experiências que carregamos sem saber conscientemente. O cachorro que o acompanha pode ser tanto um guia instintivo quanto uma advertência. O precipício não é queda: é fé.",
    exercise:
      "Encontre um momento de silêncio. Feche os olhos e imagine-se à beira de um precipício seguro, com um horizonte infinito à frente. Pergunte a si mesmo: 'Se eu não tivesse medo, o que eu faria agora?' Anote a primeira coisa que vier à mente, sem censurar. Esse é o chamado do Louco para você hoje.",
  },
  quiz: [
    {
      id: "fool-q1",
      question: "Qual é o número associado ao arcano O Louco?",
      options: ["I", "0", "XXII", "XIII"],
      correctIndex: 1,
      explanation:
        "O Louco é o arcano número 0 — representando o potencial puro, o vazio fértil antes de qualquer manifestação.",
    },
    {
      id: "fool-q2",
      question: "Na Cabala, a qual letra hebraica O Louco corresponde?",
      options: ["Beth (ב)", "Aleph (א)", "Gimel (ג)", "Daleth (ד)"],
      correctIndex: 1,
      explanation:
        "Aleph (א) é o sopro silencioso, a respiração primordial — conectando O Louco ao caminho entre Keter e Chokmah.",
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
      explanation:
        "Na sombra, O Louco se torna imprudência — fuga travestida de liberdade, irresponsabilidade fingindo espontaneidade.",
    },
    {
      id: "fool-q4",
      question: "O que a trouxa do Louco simboliza?",
      options: ["Riqueza material", "Conhecimento acadêmico", "Karma e experiências inconscientes", "Medo do desconhecido"],
      correctIndex: 2,
      explanation:
        "A trouxa representa o karma — experiências que carregamos sem saber conscientemente, bagagem da alma.",
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
      explanation:
        "O Louco convida a agir com fé — não cegamente, mas com a confiança de que a jornada importa mais que o destino.",
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
  badges: [
    { id: "first-step", name: "Primeiro Passo", description: "Começou a Jornada do Louco", icon: "✦", earned: false },
    { id: "fool-complete", name: "O Louco Revelado", description: "Completou a lição do Louco", icon: "🃏", earned: false },
    { id: "quiz-master", name: "Mestre do Quiz", description: "Acertou 100% em um quiz", icon: "⭐", earned: false },
    { id: "streak-3", name: "Chama Constante", description: "3 dias consecutivos de estudo", icon: "🔥", earned: false },
    { id: "streak-7", name: "Devoto do Tarô", description: "7 dias consecutivos de estudo", icon: "💫", earned: false },
  ],
  currentModule: 0,
};
