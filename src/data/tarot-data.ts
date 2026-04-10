import { type LessonSection } from "@/data/fool-lesson-content";
import { getArcanoAsLegacy } from "./arcanos/index";

export type { LessonSection };

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
  archetype: string;
  firstPersonIntro: string;
  voiceText: string;
  lessonSections: LessonSection[];
  cardImage: string;
  layers: LessonLayer;
  quiz: QuizQuestion[];
  unlocked: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
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
  completedModules: string[];
  badges: Badge[];
  currentModule: string;
  onboardingCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export type ModuleCategory = "foundation" | "major-arcana" | "minor-arcana" | "advanced" | "practice";

export interface LearningModule {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  symbol: string;
  order: number;
  category: ModuleCategory;
  totalLessons: number;
  prerequisiteModuleId?: string;
  route: string;
}

export const MODULES: LearningModule[] = [
  { id: "fundamentos",      name: "Fundamentos do Tarô",   subtitle: "A Base de Tudo",            description: "História, estrutura e linguagem simbólica do Tarô",                 icon: "📖", symbol: "◈",  order: 0,  category: "foundation",    totalLessons: 10, route: "/module/fundamentos" },
  { id: "arcanos-maiores",   name: "Arcanos Maiores",       subtitle: "A Jornada do Louco",        description: "Os 22 arquétipos universais da jornada da alma",                    icon: "🃏", symbol: "✦",  order: 1,  category: "major-arcana",  totalLessons: 22, route: "/module/arcanos-maiores",  prerequisiteModuleId: "fundamentos" },
  { id: "copas",             name: "Naipe de Copas",        subtitle: "O Elemento Água",           description: "Emoções, relacionamentos, intuição e o mundo interior",             icon: "💧", symbol: "☽",  order: 2,  category: "minor-arcana",  totalLessons: 14, route: "/module/copas",           prerequisiteModuleId: "arcanos-maiores" },
  { id: "paus",              name: "Naipe de Paus",         subtitle: "O Elemento Fogo",           description: "Ação, criatividade, paixão e força vital",                         icon: "🔥", symbol: "⚡", order: 3,  category: "minor-arcana",  totalLessons: 14, route: "/module/paus",            prerequisiteModuleId: "arcanos-maiores" },
  { id: "espadas",           name: "Naipe de Espadas",      subtitle: "O Elemento Ar",             description: "Mente, conflitos, verdade e comunicação",                          icon: "⚔️", symbol: "△",  order: 4,  category: "minor-arcana",  totalLessons: 14, route: "/module/espadas",         prerequisiteModuleId: "arcanos-maiores" },
  { id: "ouros",             name: "Naipe de Ouros",        subtitle: "O Elemento Terra",          description: "Material, prosperidade, corpo e manifestação",                     icon: "💎", symbol: "◆",  order: 5,  category: "minor-arcana",  totalLessons: 14, route: "/module/ouros",           prerequisiteModuleId: "arcanos-maiores" },
  { id: "combinacoes",       name: "Combinações",           subtitle: "A Arte da Síntese",         description: "Como ler cartas em conjunto e criar narrativas integradas",         icon: "🔗", symbol: "∞",  order: 6,  category: "advanced",      totalLessons: 10, route: "/module/combinacoes",     prerequisiteModuleId: "copas" },
  { id: "tiragens",          name: "Tiragens",              subtitle: "Os Métodos de Leitura",     description: "Cruz Celta, Ferradura, Três Cartas e outros layouts clássicos",     icon: "🎴", symbol: "◎",  order: 7,  category: "advanced",      totalLessons: 8,  route: "/module/tiragens",       prerequisiteModuleId: "combinacoes" },
  { id: "amor",              name: "Amor e Relacionamentos",subtitle: "O Tarô do Coração",         description: "Leituras temáticas focadas em amor, vínculo e conexão",             icon: "❤️", symbol: "♡",  order: 8,  category: "practice",      totalLessons: 6,  route: "/module/amor",           prerequisiteModuleId: "tiragens" },
  { id: "pratica",           name: "Prática Guiada",        subtitle: "O Tarô Vivo",               description: "Exercícios reais de leitura com feedback e orientação",             icon: "✨", symbol: "★",  order: 9,  category: "practice",      totalLessons: 10, route: "/module/pratica",         prerequisiteModuleId: "tiragens" },
];

/** Get module by ID */
export function getModuleById(id: string): LearningModule | undefined {
  return MODULES.find(m => m.id === id);
}

/** Check if module is unlocked based on progress — fundamentos and arcanos-maiores start unlocked */
export function isModuleUnlocked(moduleId: string, completedModules: string[]): boolean {
  const mod = getModuleById(moduleId);
  if (!mod) return false;
  if (!mod.prerequisiteModuleId) return true;
  return completedModules.includes(mod.prerequisiteModuleId);
}

export const THE_FOOL: ArcanoData = {
  id: 0,
  name: "O Louco",
  numeral: "0",
  subtitle: "O Início da Jornada",
  keywords: ["Liberdade", "Coragem", "Travessia", "Impulso", "Desapego"],
  archetype: "O Buscador, o Viajante, o Inocente Sábio — aquele que caminha sem mapa, guiado pela fé no desconhecido.",
  firstPersonIntro:
    "Eu sou o Louco. Sou o primeiro passo antes da certeza. Sou o impulso que nasce antes da garantia. Em mim existe liberdade, abertura, risco e movimento. Eu não prometo segurança. Eu ensino travessia.",
  voiceText: `Eu sou o Louco.\nSou o primeiro passo antes da certeza.\nSou o impulso que nasce antes da garantia.\nEm mim existe liberdade, abertura, risco e movimento.\nEu apareço quando a vida pede travessia.\nNa minha luz, eu trago coragem, espontaneidade e começo.\nNa minha sombra, eu viro imprudência, fuga e instabilidade.\nEu não prometo segurança.\nEu ensino o salto.`,
  cardImage: "/assets/the-fool-card.jpg",
  lessonSections: [
    { id: "essencia", title: "Essência", icon: "✦", content: "O Louco é o Arcano Zero — o vazio fértil, o potencial puro antes de qualquer manifestação. Ele não é o início; é a coragem de iniciar. É o sopro antes da primeira palavra, o passo antes do caminho existir. Carrega consigo a energia da possibilidade infinita, do momento em que tudo ainda pode ser. Quando o Louco aparece, ele convida a soltar o controle e confiar no desconhecido." },
    { id: "simbolos", title: "Símbolos Centrais", icon: "◎", content: "A trouxa sobre o ombro representa o karma — experiências que carregamos sem consciência. O cachorro branco pode ser guia instintivo ou advertência. O precipício não é queda: é fé. As montanhas ao fundo são os desafios superados ou os que virão. A rosa branca na mão simboliza pureza e apreciação pela beleza. O sol dourado ao fundo ilumina sem revelar o caminho — é a confiança cósmica." },
    { id: "luz", title: "Luz", icon: "☀", accent: "gold", content: "Na luz, o Louco é coragem para começar, espontaneidade genuína, fé no processo e desapego saudável. É o salto de fé que você dá quando decide mudar de vida, declarar amor sem garantias, recomeçar sem mapa. Quando encontrado na luz, indica prontidão para o novo — sem precisar saber exatamente o destino. Ele é a criança interior que ainda acredita na magia do caminho." },
    { id: "sombra", title: "Sombra", icon: "☾", accent: "plum", content: "Na sombra, o Louco se torna imprudência disfarçada de coragem, fuga travestida de liberdade, irresponsabilidade fingindo espontaneidade. É pular de projeto em projeto sem terminar nenhum, evitar compromissos usando a desculpa da liberdade, ignorar consequências reais. Na sombra, ele pergunta: você está sendo livre ou está fugindo?" },
    { id: "licao", title: "Lição Iniciática", icon: "⟡", content: "A lição do Louco é aprender que a jornada importa mais do que o destino. Ele nos ensina que todo grande mestre já foi aprendiz, que todo caminho começa com um passo incerto, e que a sabedoria não é a ausência de risco, mas a capacidade de caminhar com o risco. O Louco nos convida a abandonar o controle excessivo e permitir que a vida nos surpreenda." },
    { id: "amor", title: "O Louco no Amor", icon: "♡", accent: "wine", content: "No amor, o Louco indica começos emocionantes, paixão espontânea e abertura para o inesperado. Pode representar um novo relacionamento que chega sem aviso, uma fase de redescoberta a dois, ou a coragem de se declarar sem saber a resposta. Na sombra amorosa, avisa sobre idealização excessiva, relações sem profundidade ou medo de compromisso real." },
    { id: "trabalho", title: "O Louco no Trabalho", icon: "◈", content: "No trabalho, o Louco fala de novos projetos, mudanças de carreira, empreendedorismo e ideias fora da caixa. É a energia de quem decide largar o emprego seguro para seguir um chamado interior. Na sombra profissional, alerta sobre planos sem estrutura, riscos mal calculados ou falta de comprometimento com o processo." },
    { id: "espiritualidade", title: "O Louco na Espiritualidade", icon: "❋", content: "Na espiritualidade, o Louco é o buscador eterno — aquele que não se prende a dogmas e está sempre aberto a novas formas de conexão com o sagrado. Ele representa o início de uma jornada espiritual, o despertar da curiosidade mística e a disposição para explorar o desconhecido interior. Na Cabala, corresponde à letra Aleph (א), o sopro silencioso entre Keter e Chokmah." },
  ],
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
      type: "multiple-choice",
      question: "Qual é o número associado ao arcano O Louco?",
      options: ["I", "0", "XXII", "XIII"],
      correctIndex: 1,
      explanation: "O Louco é o arcano número 0 — representando o potencial puro, o vazio fértil antes de qualquer manifestação.",
    },
    {
      id: "fool-q2",
      type: "multiple-choice",
      question: "Na Cabala, a qual letra hebraica O Louco corresponde?",
      options: ["Beth (ב)", "Aleph (א)", "Gimel (ג)", "Daleth (ד)"],
      correctIndex: 1,
      explanation: "Aleph (א) é o sopro silencioso, a respiração primordial — conectando O Louco ao caminho entre Keter e Chokmah.",
    },
    {
      id: "fool-q3",
      type: "multiple-choice",
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
      id: "fool-tf1",
      type: "true-false",
      question: "O Louco representa o final da Jornada dos Arcanos Maiores.",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 1,
      explanation: "O Louco é o início (0) e o eterno viajante — ele pode aparecer em qualquer ponto, mas simboliza o começo da jornada.",
    },
    {
      id: "fool-q4",
      type: "multiple-choice",
      question: "O que a trouxa do Louco simboliza?",
      options: ["Riqueza material", "Conhecimento acadêmico", "Karma e experiências inconscientes", "Medo do desconhecido"],
      correctIndex: 2,
      explanation: "A trouxa representa o karma — experiências que carregamos sem saber conscientemente, bagagem da alma.",
    },
    {
      id: "fool-tf2",
      type: "true-false",
      question: "O cachorro na carta do Louco representa perigo iminente.",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 1,
      explanation: "O cachorro é o instinto protetor e a lealdade — ele alerta, não ameaça. Representa nossa intuição animal.",
    },
    {
      id: "fool-q5",
      type: "multiple-choice",
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

export const THE_MAGICIAN: ArcanoData = {
  id: 1,
  name: "O Mago",
  numeral: "I",
  subtitle: "O Poder da Vontade",
  keywords: ["Vontade", "Manifestação", "Domínio", "Ação Consciente", "Poder Criativo"],
  archetype: "O Canal, o Alquimista, o Manifestador — aquele que conecta o céu à terra e transforma intenção em realidade.",
  firstPersonIntro:
    "Eu sou o Mago. Sou a vontade que se torna ação. Sou a ponte entre o invisível e o visível. Em mim, pensamento vira gesto, desejo vira forma. Eu não espero que o mundo mude — eu o transformo.",
  voiceText: `Eu sou o Mago.\nSou a vontade que se torna ação.\nSou a ponte entre o invisível e o visível.\nEm mim, pensamento vira gesto, desejo vira forma.\nEu domino os quatro elementos — fogo, água, ar e terra.\nNa minha luz, eu trago maestria, foco e poder criativo.\nNa minha sombra, eu viro manipulação, ilusão e engano.\nEu não espero que o mundo mude.\nEu o transformo.`,
  cardImage: "/assets/the-magician-card.jpg",
  lessonSections: [
    { id: "essencia", title: "Essência", icon: "✦", content: "O Mago é o Arcano I — a primeira manifestação consciente da vontade. Enquanto O Louco é potencial puro, O Mago é o potencial canalizado. Ele é o momento em que a intenção se torna ação, em que o desejo ganha forma. Com uma mão apontando para o céu e outra para a terra, ele é o canal perfeito entre o divino e o material. Quando O Mago aparece, ele diz: você tem tudo o que precisa — agora use." },
    { id: "simbolos", title: "Símbolos Centrais", icon: "◎", content: "A mesa diante dele contém os quatro elementos: a espada (ar/mente), o cálice (água/emoções), o bastão (fogo/vontade) e o pentáculo (terra/matéria). O lemniscata (∞) sobre sua cabeça representa domínio infinito e consciência eterna. A mão direita erguida com a varinha canaliza energia cósmica; a mão esquerda aponta para baixo, manifestando-a na terra. As rosas vermelhas representam paixão e desejo; os lírios brancos, pureza de intenção." },
    { id: "luz", title: "Luz", icon: "☀", accent: "gold", content: "Na luz, O Mago é maestria, concentração, habilidade e poder de realização. É a capacidade de transformar ideias em projetos concretos, sonhos em planos, intenções em resultados. Quando encontrado na luz, indica que você tem todos os recursos necessários — internos e externos — para manifestar o que deseja. É o momento de agir com clareza e propósito." },
    { id: "sombra", title: "Sombra", icon: "☾", accent: "plum", content: "Na sombra, O Mago se torna manipulação, charlatanismo, uso do poder para enganar. É a inteligência a serviço do ego, a habilidade usada para controlar os outros, a eloquência que seduz sem verdade. Na sombra, ele pergunta: você está usando seus dons para criar ou para dominar? Está sendo autêntico ou está performando uma versão falsa de si?" },
    { id: "licao", title: "Lição Iniciática", icon: "⟡", content: "A lição do Mago é aprender que poder verdadeiro vem do alinhamento entre intenção, ação e verdade interior. Ele nos ensina que manifestar não é forçar — é canalizar. Que dominar os elementos não é controlá-los, mas compreendê-los e trabalhar com eles. O Mago nos convida a reconhecer nossos recursos, alinhar nosso propósito e agir com maestria consciente." },
    { id: "amor", title: "O Mago no Amor", icon: "♡", accent: "wine", content: "No amor, O Mago indica comunicação magnética, atração consciente e poder de conquista. Pode representar alguém carismático que sabe exatamente o que dizer, uma fase de encantamento mútuo, ou a capacidade de criar a relação que deseja. Na sombra amorosa, avisa sobre sedução manipuladora, promessas vazias, alguém que usa charme como ferramenta de controle." },
    { id: "trabalho", title: "O Mago no Trabalho", icon: "◈", content: "No trabalho, O Mago fala de competência, iniciativa e domínio técnico. É a energia do empreendedor que transforma uma ideia em negócio, do profissional que domina suas ferramentas. Indica que você tem tudo o que precisa para realizar o projeto. Na sombra profissional, alerta sobre vender uma imagem que não corresponde à realidade, prometer mais do que pode entregar." },
    { id: "espiritualidade", title: "O Mago na Espiritualidade", icon: "❋", content: "Na espiritualidade, O Mago é o praticante consciente — aquele que compreende as leis do universo e trabalha com elas. Ele representa o domínio das práticas esotéricas, a capacidade de ritualizar com intenção e a compreensão de que 'como acima, assim abaixo'. Na Cabala, corresponde à letra Beth (ב), a casa — o primeiro ato de criação, a estrutura que abriga o espírito." },
  ],
  layers: {
    main: {
      essence:
        "Eu sou a vontade que se torna ação. Sou a ponte entre o invisível e o visível. Enquanto O Louco é potencial puro, eu sou o potencial canalizado — o momento em que a intenção ganha forma. Com uma mão no céu e outra na terra, eu conecto o divino ao material.",
      light:
        "Na minha luz, eu falo de maestria, foco, habilidade e poder de realização. Sou a capacidade de transformar ideias em projetos concretos, sonhos em planos, intenções em resultados. Quando me encontra na luz, você tem todos os recursos — agora é hora de agir com clareza e propósito.",
      shadow:
        "Na minha sombra, eu aviso sobre manipulação, charlatanismo e uso do poder para enganar. Torno-me a inteligência a serviço do ego, a habilidade usada para controlar. Quando me encontra na sombra, pergunte: estou usando meus dons para criar ou para dominar?",
      practicalApplication:
        "Quando apareço em uma leitura, posso indicar habilidade, domínio, iniciativa ou manipulação. Tudo depende do contexto. Pergunte-se: 'Que ferramentas já tenho e não estou usando? Minha intenção está alinhada com minha ação?' Eu convido a agir com maestria — não com força bruta, mas com a precisão de quem conhece seus recursos.",
    },
    deepDive: {
      text: "O Mago é o Arcano I — o primeiro número, a primeira manifestação. Se O Louco é o zero (potencial), O Mago é o um (ação). Na tradição hermética, ele é chamado de 'O Magus' e representa o domínio da vontade sobre a matéria. A frase 'como acima, assim abaixo', atribuída à Tábua de Esmeralda de Hermes Trismegisto, é a essência deste arcano.",
      symbolism: "Os quatro objetos sobre a mesa — espada, cálice, bastão e pentáculo — representam os quatro elementos e os quatro naipes do Tarô. Eles mostram que O Mago tem domínio sobre todas as dimensões da experiência humana: mente (ar), emoções (água), vontade (fogo) e matéria (terra). O lemniscata (∞) sobre sua cabeça indica que este domínio não é temporário — é um ciclo eterno de criação.",
      cabala: "Na Cabala, O Mago corresponde à letra Beth (ב), que significa 'casa'. É o primeiro ato de criação — Deus criou uma casa (o universo) para habitar. O caminho de Beth conecta Keter (a Coroa) a Binah (o Entendimento), representando a descida da vontade divina para a estrutura da compreensão.",
      history: "Nas cartas mais antigas do Tarô, O Mago aparecia como um prestidigitador de feira — alguém que fazia truques de mão para o público. Com o tempo, a tradição esotérica elevou sua figura ao de um verdadeiro adepto, alguém que compreende e domina as forças ocultas da natureza. A versão de Pamela Colman Smith no Rider-Waite transformou definitivamente o charlatão em iniciado.",
    },
    extras: [
      {
        id: "mago-extra-1",
        title: "O Mago como Arquétipo do Manifestador",
        type: "text",
        description: "Como a energia do Mago se manifesta na vida contemporânea",
        content: "Na vida moderna, O Mago se manifesta como o empreendedor visionário, o artista que transforma inspiração em obra, o terapeuta que canaliza energia de cura. É qualquer pessoa que compreende que entre o desejo e a realização existe um processo — e que domina esse processo com maestria. O Mago nos lembra que manifestar não é magia no sentido infantil: é alinhamento entre vontade, conhecimento e ação.",
      },
      {
        id: "mago-extra-2",
        title: "Meditação Guiada — A Mesa dos Elementos",
        type: "audio",
        description: "12 minutos de meditação com a energia do Mago",
        url: "#",
        duration: "12 min",
      },
      {
        id: "mago-extra-3",
        title: "Artigo: Hermes Trismegisto e a Tábua de Esmeralda",
        type: "pdf",
        description: "As raízes herméticas do Mago no Tarô",
        url: "#",
      },
    ],
    exercise: {
      instruction:
        "Escolha um objetivo que você deseja manifestar. Pegue quatro objetos que representem os elementos: algo cortante (ar/mente), um copo com água (emoções), uma vela (fogo/vontade) e uma pedra ou moeda (terra/matéria). Coloque-os diante de você. Feche os olhos e visualize seu objetivo tomando forma enquanto toca cada objeto. Escreva depois: 'Que ferramentas já tenho para manifestar isso?'",
      type: "practice",
      duration: "15 min",
    },
  },
  quiz: [
    {
      id: "mago-q1",
      type: "multiple-choice",
      question: "Qual é o número associado ao arcano O Mago?",
      options: ["0", "I", "II", "III"],
      correctIndex: 1,
      explanation: "O Mago é o arcano número I — a primeira manifestação consciente da vontade, o potencial do Louco agora canalizado em ação.",
    },
    {
      id: "mago-q2",
      type: "multiple-choice",
      question: "Quais são os quatro objetos sobre a mesa do Mago?",
      options: [
        "Livro, chave, espelho e coroa",
        "Espada, cálice, bastão e pentáculo",
        "Rosa, lírio, serpente e pomba",
        "Anel, cetro, globo e manto",
      ],
      correctIndex: 1,
      explanation: "Os quatro objetos representam os quatro elementos: espada (ar), cálice (água), bastão (fogo) e pentáculo (terra) — os quatro naipes do Tarô.",
    },
    {
      id: "mago-q3",
      type: "multiple-choice",
      question: "O que o lemniscata (∞) sobre a cabeça do Mago simboliza?",
      options: [
        "Tempo limitado",
        "Dualidade entre bem e mal",
        "Domínio infinito e consciência eterna",
        "O ciclo das estações",
      ],
      correctIndex: 2,
      explanation: "O lemniscata (∞) representa o domínio infinito — a maestria que transcende o tempo e conecta O Mago à consciência eterna.",
    },
    {
      id: "mago-tf1",
      type: "true-false",
      question: "Na Cabala, O Mago corresponde à letra Aleph (א).",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 1,
      explanation: "O Mago corresponde à letra Beth (ב), que significa 'casa' — o primeiro ato de criação. Aleph corresponde ao Louco.",
    },
    {
      id: "mago-q4",
      type: "multiple-choice",
      question: "Qual é o aspecto SOMBRA do Mago?",
      options: [
        "Falta de habilidade",
        "Preguiça e inação",
        "Manipulação e charlatanismo",
        "Medo do desconhecido",
      ],
      correctIndex: 2,
      explanation: "Na sombra, O Mago se torna manipulação — o uso da inteligência e do carisma para enganar, controlar ou dominar.",
    },
    {
      id: "mago-tf2",
      type: "true-false",
      question: "A frase 'como acima, assim abaixo' está associada ao Mago.",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 0,
      explanation: "Sim! Esta frase da Tábua de Esmeralda de Hermes Trismegisto é a essência do Mago — a conexão entre o plano divino e o material.",
    },
    {
      id: "mago-q5",
      type: "multiple-choice",
      question: "Quando O Mago aparece no amor, na sua luz, ele indica:",
      options: [
        "Fim de um relacionamento",
        "Comunicação magnética e atração consciente",
        "Solidão necessária",
        "Dependência emocional",
      ],
      correctIndex: 1,
      explanation: "Na luz, O Mago no amor indica comunicação magnética, atração consciente e poder de conquista — a capacidade de criar a relação que deseja.",
    },
  ],
  unlocked: false,
};

export const THE_HIGH_PRIESTESS: ArcanoData = {
  id: 2,
  name: "A Sacerdotisa",
  numeral: "II",
  subtitle: "O Véu do Mistério",
  keywords: ["Intuição", "Mistério", "Silêncio", "Sabedoria Oculta", "Receptividade"],
  archetype: "A Guardiã do Véu, a Mestra Silenciosa, a Sacerdotisa Lunar — aquela que conhece os segredos sem precisar revelá-los.",
  firstPersonIntro:
    "Eu sou a Sacerdotisa. Sou o silêncio que fala, o véu entre o visível e o invisível. Em mim mora a intuição, o mistério e a sabedoria que não se ensina — se sente. Eu não dou respostas. Eu ensino a ouvir.",
  voiceText: `Eu sou a Sacerdotisa.\nSou o silêncio que fala, o véu entre o visível e o invisível.\nEm mim mora a intuição, o mistério e a sabedoria que não se ensina — se sente.\nEu guardo os segredos do inconsciente, as memórias da alma.\nNa minha luz, eu trago intuição profunda, paciência e sabedoria interior.\nNa minha sombra, eu viro frieza, isolamento e segredos destrutivos.\nEu não dou respostas.\nEu ensino a ouvir.`,
  cardImage: "/assets/the-high-priestess-card.jpg",
  lessonSections: [
    { id: "essencia", title: "Essência", icon: "✦", content: "A Sacerdotisa é o Arcano II — o portal entre o consciente e o inconsciente, entre o que se sabe e o que se intui. Ela não age; ela percebe. Não fala; escuta. É a guardiã do conhecimento oculto, da sabedoria que habita o silêncio. Sentada entre as duas colunas — Boaz (força) e Jachin (estabelecimento) — ela representa o equilíbrio entre polaridades: luz e sombra, razão e intuição, revelado e velado. Quando a Sacerdotisa aparece, ela convida a parar, silenciar e escutar o que já se sabe por dentro." },
    { id: "simbolos", title: "Símbolos Centrais", icon: "◎", content: "As duas colunas B e J representam as polaridades do Templo de Salomão — dualidade que a Sacerdotisa equilibra sem escolher lados. O véu entre as colunas, adornado com romãs e palmeiras, separa o mundo visível do invisível — e só os iniciados passam. A lua crescente a seus pés simboliza o ciclo, a feminilidade e o domínio sobre as marés emocionais. O rolo da Torá em suas mãos (parcialmente oculto) representa a sabedoria que não se revela por completo — há sempre mais a descobrir. A cruz solar em seu peito une o divino masculino e feminino." },
    { id: "luz", title: "Luz", icon: "☀", accent: "gold", content: "Na luz, a Sacerdotisa é intuição afinada, paciência profunda, conexão com o inconsciente e sabedoria que vem do silêncio. É aquele momento em que você 'simplesmente sabe' sem precisar de provas. Quando encontrada na luz, indica que a resposta não está fora — está dentro. É hora de meditar, contemplar e confiar na voz interior. Ela é a mestra que ensina sem palavras." },
    { id: "sombra", title: "Sombra", icon: "☾", accent: "plum", content: "Na sombra, a Sacerdotisa se torna frieza emocional, isolamento excessivo, passividade paralisante e segredos que corroem. É guardar informações por poder, usar o silêncio como arma, ou se desconectar do mundo sob a desculpa da espiritualidade. Na sombra, ela pergunta: você está em contato com sua intuição ou está usando o mistério para evitar a vulnerabilidade?" },
    { id: "licao", title: "Lição Iniciática", icon: "⟡", content: "A lição da Sacerdotisa é aprender que nem tudo precisa ser dito, feito ou explicado. Ela nos ensina que há uma sabedoria no silêncio, que a paciência é uma forma de poder, e que a intuição é tão válida quanto a razão. A Sacerdotisa nos convida a desenvolver a escuta interior — aquela voz sutil que fala antes do pensamento, que sente antes da análise." },
    { id: "amor", title: "A Sacerdotisa no Amor", icon: "♡", accent: "wine", content: "No amor, a Sacerdotisa indica uma fase de introspecção, mistério e conexão profunda não-verbal. Pode representar uma atração magnética e silenciosa, um amor que se desenvolve nas entrelinhas, ou a necessidade de ouvir o coração antes de agir. Na sombra amorosa, avisa sobre frieza emocional, jogos de poder pelo silêncio, ou guardar sentimentos que precisam ser expressos." },
    { id: "trabalho", title: "A Sacerdotisa no Trabalho", icon: "◈", content: "No trabalho, a Sacerdotisa fala de pesquisa, estudo, planejamento silencioso e conhecimento especializado. É a fase de observar antes de agir, de estudar o cenário antes de se posicionar. Indica que há informações ocultas ou não reveladas que precisam ser consideradas. Na sombra profissional, alerta sobre passividade excessiva, guardar conhecimento por insegurança ou perder oportunidades por esperar demais." },
    { id: "espiritualidade", title: "A Sacerdotisa na Espiritualidade", icon: "❋", content: "Na espiritualidade, a Sacerdotisa é a mestra interior — a conexão com o divino feminino, com os ciclos lunares e com a sabedoria ancestral. Ela representa o desenvolvimento da intuição, a prática da meditação e a disposição para acessar dimensões mais sutis da consciência. Na Cabala, corresponde à letra Gimel (ג), o camelo que atravessa o deserto — o caminho entre Keter (a Coroa) e Tiferet (a Beleza), a ponte entre o divino e o humano." },
  ],
  layers: {
    main: {
      essence:
        "Eu sou o silêncio que fala, o véu entre o visível e o invisível. Sentada entre as duas colunas — Boaz e Jachin — eu represento o equilíbrio entre polaridades. Não ajo; percebo. Não falo; escuto. Sou a guardiã do conhecimento oculto, da sabedoria que habita o silêncio.",
      light:
        "Na minha luz, eu falo de intuição afinada, paciência profunda e sabedoria interior. Sou aquele momento em que você 'simplesmente sabe' sem precisar de provas. Quando me encontra na luz, a resposta não está fora — está dentro de você. É hora de silenciar e confiar.",
      shadow:
        "Na minha sombra, eu aviso sobre frieza emocional, isolamento e segredos que corroem. Torno-me passividade paralisante, o silêncio usado como arma, a desconexão disfarçada de espiritualidade. Quando me encontra na sombra, pergunte: estou ouvindo minha intuição ou estou me escondendo?",
      practicalApplication:
        "Quando apareço em uma leitura, posso indicar intuição, segredos, paciência ou passividade. Tudo depende do contexto. Pergunte-se: 'O que meu silêncio interior está tentando me dizer? Há algo que sei mas não estou admitindo?' Eu convido a escutar antes de agir — não por medo, mas por sabedoria.",
    },
    deepDive: {
      text: "A Sacerdotisa é o Arcano II — o segundo passo na Jornada do Louco. Se O Louco é o potencial e O Mago é a ação, a Sacerdotisa é a reflexão. Ela nos ensina que entre o impulso e a ação existe um espaço sagrado: o espaço da contemplação. Na tradição hermética, ela é associada à Lua e ao princípio feminino receptivo — o contraponto necessário ao princípio masculino ativo do Mago.",
      symbolism: "As duas colunas B (Boaz) e J (Jachin) são as colunas do Templo de Salomão, representando força e estabilidade. A Sacerdotisa senta entre elas, em equilíbrio perfeito. O véu com romãs (fertilidade, abundância) e palmeiras (vitória, triunfo) separa o mundo profano do sagrado. A lua crescente a seus pés mostra seu domínio sobre os ciclos naturais e as marés emocionais.",
      cabala: "Na Cabala, a Sacerdotisa corresponde à letra Gimel (ג), que significa 'camelo'. O camelo é o animal que atravessa o deserto — um símbolo de perseverança e da capacidade de sustentar a vida em territórios áridos. O caminho de Gimel conecta Keter (a Coroa divina) a Tiferet (a Beleza e o equilíbrio), representando a transmissão da sabedoria divina para o coração humano.",
      history: "Historicamente, a Sacerdotisa foi chamada de 'A Papisa' — uma referência à lendária Papa Joana, que teria governado a Igreja disfarçada de homem. Nas cartas de tarô mais antigas, ela aparecia com a tiara papal. Com o tempo, a tradição esotérica transformou-a na Grande Sacerdotisa dos mistérios, guardiã do templo interior e do conhecimento oculto. Pamela Colman Smith a desenhou com serenidade absoluta, cercada de símbolos lunares e aquáticos.",
    },
    extras: [
      {
        id: "sacerdotisa-extra-1",
        title: "A Sacerdotisa e o Divino Feminino",
        type: "text",
        description: "Como o arquétipo da Sacerdotisa se conecta ao feminino sagrado",
        content: "A Sacerdotisa é talvez a carta mais profundamente conectada ao Divino Feminino no Tarô. Ela representa não a feminilidade social ou cultural, mas o princípio feminino universal: a receptividade, a intuição, a gestação silenciosa, os ciclos naturais. Em uma era que valoriza a ação constante e a produtividade, a Sacerdotisa nos lembra que há poder no silêncio, na espera, na observação. Ela é a contraparte necessária do Mago: ele age, ela contempla; ele manifesta, ela concebe; ele fala, ela escuta.",
      },
      {
        id: "sacerdotisa-extra-2",
        title: "Meditação Guiada — O Templo Interior",
        type: "audio",
        description: "15 minutos de meditação com a energia da Sacerdotisa",
        url: "#",
        duration: "15 min",
      },
      {
        id: "sacerdotisa-extra-3",
        title: "Artigo: Lua, Ciclos e Feminino na Tradição Esotérica",
        type: "pdf",
        description: "A relação entre a Sacerdotisa, a Lua e os ciclos femininos",
        url: "#",
      },
    ],
    exercise: {
      instruction:
        "Escolha um momento de silêncio absoluto — sem música, sem telas, sem estímulos. Sente-se confortavelmente e feche os olhos. Respire lentamente por 5 minutos. Depois, pergunte mentalmente: 'O que eu já sei mas não estou admitindo?' Espere. Não force uma resposta — deixe que ela surja. Anote a primeira impressão que vier, por mais sutil que seja. Essa é a voz da sua Sacerdotisa interior.",
      type: "meditation",
      duration: "15 min",
    },
  },
  quiz: [
    {
      id: "sacerdotisa-q1",
      type: "multiple-choice",
      question: "Qual é o número associado ao arcano A Sacerdotisa?",
      options: ["0", "I", "II", "III"],
      correctIndex: 2,
      explanation: "A Sacerdotisa é o arcano número II — o portal entre o consciente e o inconsciente.",
    },
    {
      id: "sacerdotisa-q2",
      type: "multiple-choice",
      question: "O que as colunas B e J na carta da Sacerdotisa representam?",
      options: [
        "Bem e mal",
        "As colunas do Templo de Salomão (Boaz e Jachin)",
        "Masculino e feminino",
        "Passado e futuro",
      ],
      correctIndex: 1,
      explanation: "As colunas B (Boaz = força) e J (Jachin = estabelecimento) são as colunas do Templo de Salomão, representando as polaridades que a Sacerdotisa equilibra.",
    },
    {
      id: "sacerdotisa-q3",
      type: "multiple-choice",
      question: "Qual é o aspecto SOMBRA da Sacerdotisa?",
      options: [
        "Imprudência e falta de limites",
        "Frieza emocional e segredos destrutivos",
        "Manipulação e charlatanismo",
        "Excesso de ação sem reflexão",
      ],
      correctIndex: 1,
      explanation: "Na sombra, a Sacerdotisa se torna frieza emocional, isolamento excessivo e segredos que corroem — o silêncio usado como arma.",
    },
    {
      id: "sacerdotisa-tf1",
      type: "true-false",
      question: "A Sacerdotisa corresponde à letra hebraica Beth (ב) na Cabala.",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 1,
      explanation: "A Sacerdotisa corresponde à letra Gimel (ג), que significa 'camelo'. Beth corresponde ao Mago.",
    },
    {
      id: "sacerdotisa-q4",
      type: "multiple-choice",
      question: "O que a lua crescente aos pés da Sacerdotisa simboliza?",
      options: [
        "Tempo passando rapidamente",
        "Domínio sobre os ciclos e as marés emocionais",
        "Iluminação espiritual completa",
        "Início de uma nova fase material",
      ],
      correctIndex: 1,
      explanation: "A lua crescente simboliza o domínio da Sacerdotisa sobre os ciclos naturais, a feminilidade e as marés emocionais.",
    },
    {
      id: "sacerdotisa-tf2",
      type: "true-false",
      question: "A Sacerdotisa convida a agir imediatamente diante de um dilema.",
      options: ["Verdadeiro", "Falso"],
      correctIndex: 1,
      explanation: "A Sacerdotisa convida ao silêncio e à contemplação — escutar antes de agir, não por medo, mas por sabedoria.",
    },
    {
      id: "sacerdotisa-q5",
      type: "multiple-choice",
      question: "Quando a Sacerdotisa aparece no amor, na sua luz, ela indica:",
      options: [
        "Ação impulsiva e declarações ousadas",
        "Mistério, conexão profunda e introspecção",
        "Fim definitivo de um relacionamento",
        "Dependência emocional e ciúmes",
      ],
      correctIndex: 1,
      explanation: "Na luz, a Sacerdotisa no amor indica mistério, conexão profunda não-verbal e a necessidade de ouvir o coração antes de agir.",
    },
  ],
  unlocked: false,
};

/** Registry: lookup full arcano data by ID — legacy hardcoded entries */
const ARCANOS_REGISTRY_LEGACY: Record<number, ArcanoData> = {
  0: THE_FOOL,
  1: THE_MAGICIAN,
  2: THE_HIGH_PRIESTESS,
};

/** Get arcano data by ID — uses editorial registry with legacy fallback */
export function getArcanoById(id: number): ArcanoData | undefined {
  if (ARCANOS_REGISTRY_LEGACY[id]) return ARCANOS_REGISTRY_LEGACY[id];
  return getArcanoAsLegacy(id, true);
}

export interface ArcanoSummary {
  id: number;
  name: string;
  numeral: string;
  subtitle: string;
  slug: string;
  order: number;
  category: "arcanos-maiores";
  unlocked: boolean;
}

export const ARCANOS_MAIORES: ArcanoSummary[] = [
  { id: 0,  name: "O Louco",            numeral: "0",    subtitle: "O Início da Travessia",     slug: "o-louco",            order: 0,  category: "arcanos-maiores", unlocked: true },
  { id: 1,  name: "O Mago",             numeral: "I",    subtitle: "O Poder da Vontade",        slug: "o-mago",             order: 1,  category: "arcanos-maiores", unlocked: false },
  { id: 2,  name: "A Sacerdotisa",      numeral: "II",   subtitle: "O Véu do Mistério",         slug: "a-sacerdotisa",      order: 2,  category: "arcanos-maiores", unlocked: false },
  { id: 3,  name: "A Imperatriz",       numeral: "III",  subtitle: "A Abundância Criativa",     slug: "a-imperatriz",       order: 3,  category: "arcanos-maiores", unlocked: false },
  { id: 4,  name: "O Imperador",        numeral: "IV",   subtitle: "A Estrutura e a Ordem",     slug: "o-imperador",        order: 4,  category: "arcanos-maiores", unlocked: false },
  { id: 5,  name: "O Hierofante",       numeral: "V",    subtitle: "A Tradição Sagrada",        slug: "o-hierofante",       order: 5,  category: "arcanos-maiores", unlocked: false },
  { id: 6,  name: "Os Enamorados",      numeral: "VI",   subtitle: "A Escolha do Coração",      slug: "os-enamorados",      order: 6,  category: "arcanos-maiores", unlocked: false },
  { id: 7,  name: "O Carro",            numeral: "VII",  subtitle: "A Vontade em Movimento",    slug: "o-carro",            order: 7,  category: "arcanos-maiores", unlocked: false },
  { id: 8,  name: "A Justiça",          numeral: "VIII", subtitle: "O Equilíbrio Kármico",      slug: "a-justica",          order: 8,  category: "arcanos-maiores", unlocked: false },
  { id: 9,  name: "O Eremita",          numeral: "IX",   subtitle: "A Luz Interior",            slug: "o-eremita",          order: 9,  category: "arcanos-maiores", unlocked: false },
  { id: 10, name: "A Roda da Fortuna",  numeral: "X",    subtitle: "Os Ciclos do Destino",      slug: "a-roda-da-fortuna",  order: 10, category: "arcanos-maiores", unlocked: false },
  { id: 11, name: "A Força",            numeral: "XI",   subtitle: "O Poder Interior",          slug: "a-forca",            order: 11, category: "arcanos-maiores", unlocked: false },
  { id: 12, name: "O Enforcado",        numeral: "XII",  subtitle: "A Rendição Sagrada",        slug: "o-enforcado",        order: 12, category: "arcanos-maiores", unlocked: false },
  { id: 13, name: "A Morte",            numeral: "XIII", subtitle: "A Grande Transformação",    slug: "a-morte",            order: 13, category: "arcanos-maiores", unlocked: false },
  { id: 14, name: "A Temperança",       numeral: "XIV",  subtitle: "A Alquimia Interior",       slug: "a-temperanca",       order: 14, category: "arcanos-maiores", unlocked: false },
  { id: 15, name: "O Diabo",            numeral: "XV",   subtitle: "As Correntes da Ilusão",    slug: "o-diabo",            order: 15, category: "arcanos-maiores", unlocked: false },
  { id: 16, name: "A Torre",            numeral: "XVI",  subtitle: "A Revelação Súbita",        slug: "a-torre",            order: 16, category: "arcanos-maiores", unlocked: false },
  { id: 17, name: "A Estrela",          numeral: "XVII", subtitle: "A Esperança Renovada",      slug: "a-estrela",          order: 17, category: "arcanos-maiores", unlocked: false },
  { id: 18, name: "A Lua",              numeral: "XVIII",subtitle: "O Caminho da Intuição",     slug: "a-lua",              order: 18, category: "arcanos-maiores", unlocked: false },
  { id: 19, name: "O Sol",              numeral: "XIX",  subtitle: "A Alegria Radiante",        slug: "o-sol",              order: 19, category: "arcanos-maiores", unlocked: false },
  { id: 20, name: "O Julgamento",       numeral: "XX",   subtitle: "O Despertar Final",         slug: "o-julgamento",       order: 20, category: "arcanos-maiores", unlocked: false },
  { id: 21, name: "O Mundo",            numeral: "XXI",  subtitle: "A Completude Sagrada",      slug: "o-mundo",            order: 21, category: "arcanos-maiores", unlocked: false },
];

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
  completedLessons: [],
  completedQuizzes: [],
  completedExercises: [],
  completedModules: [],
  badges: [
    { id: "first-step", name: "Primeiro Passo", description: "Começou a Jornada do Louco", icon: "✦", earned: false },
    { id: "fool-complete", name: "O Louco Revelado", description: "Completou a lição do Louco", icon: "🃏", earned: false },
    { id: "quiz-master", name: "Mestre do Quiz", description: "Acertou 100% em um quiz", icon: "⭐", earned: false },
    { id: "deep-diver", name: "Mergulho Profundo", description: "Explorou todo o aprofundamento", icon: "🔮", earned: false },
    { id: "streak-3", name: "Chama Constante", description: "3 dias consecutivos de estudo", icon: "🔥", earned: false },
    { id: "streak-7", name: "Devoto do Tarô", description: "7 dias consecutivos de estudo", icon: "💫", earned: false },
    { id: "library-explorer", name: "Exploradora", description: "Acessou 3 materiais extras", icon: "📚", earned: false },
  ],
  currentModule: "fundamentos",
  onboardingCompleted: false,
};
