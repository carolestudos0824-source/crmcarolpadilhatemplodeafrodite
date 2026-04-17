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
  quickReview?: { keyword: string; meaning: string }[];
  reflectionQuestions?: { id: string; question: string }[];
  initiationLesson?: string;
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
  studentName: string;
  certificatesEarned: Record<string, string>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export type ModuleCategory = "foundation" | "major-arcana" | "minor-arcana" | "advanced" | "practice" | "professional";

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

/**
 * @deprecated (Fase 5C) Não importe `MODULES`, `ARCANOS_MAIORES`,
 * `FREE_ARCANO_IDS` ou `isModuleUnlocked` daqui. Use:
 *   import { MODULES_CATALOG, ARCANOS_MAIORES_CATALOG,
 *            FREE_ARCANO_IDS, isModuleUnlocked } from "@/lib/content";
 *
 * Este arquivo permanece apenas como espelho legado consumido internamente
 * pelo catálogo (`@/lib/content/catalog`) e como fonte dos tipos
 * `LearningModule`, `ArcanoSummary`, `ArcanoData`, `UserProgress`,
 * `Badge`, `QuizQuestion`, `ExtraMaterial`, `LessonLayer`, `ModuleCategory`
 * e do `DEFAULT_PROGRESS`. Não é mais lido diretamente por telas/runtime
 * principal.
 */
export const MODULES: LearningModule[] = [
  // ─── Fundação ───
  { id: "fundamentos",         name: "Fundamentos do Tarô",           subtitle: "A Base de Tudo",             description: "O que é o tarô, estrutura do baralho, simbologia, intuição, ética e como estudar",  icon: "📖", symbol: "◈",  order: 0,  category: "foundation",    totalLessons: 10, route: "/module/fundamentos" },
  { id: "leitura-simbolica",   name: "Leitura Simbólica e Método",    subtitle: "O Olhar que Revela",         description: "Como observar uma carta: cor, gesto, direção, postura, cenário e interpretação",    icon: "👁", symbol: "◉",  order: 1,  category: "foundation",    totalLessons: 8,  route: "/module/leitura-simbolica", prerequisiteModuleId: "fundamentos" },

  // ─── Arcanos Maiores ───
  { id: "arcanos-maiores",     name: "Arcanos Maiores",               subtitle: "A Jornada do Louco",         description: "Os 22 arquétipos universais da jornada da alma",                                    icon: "🃏", symbol: "✦",  order: 2,  category: "major-arcana",  totalLessons: 22, route: "/module/arcanos-maiores",    prerequisiteModuleId: "leitura-simbolica" },

  // ─── Arcanos Menores ───
  { id: "arquitetura-menores", name: "Arquitetura dos Menores",       subtitle: "O Mapa dos 56",              description: "Os 4 naipes, a lógica dos números e como ler Menores com profundidade",             icon: "🗺", symbol: "▣",  order: 3,  category: "minor-arcana",  totalLessons: 6,  route: "/module/arquitetura-menores", prerequisiteModuleId: "arcanos-maiores" },
  { id: "copas",               name: "Naipe de Copas",                subtitle: "O Elemento Água",            description: "Emoções, relacionamentos, intuição e o mundo interior",                             icon: "💧", symbol: "☽",  order: 4,  category: "minor-arcana",  totalLessons: 14, route: "/module/copas",              prerequisiteModuleId: "arquitetura-menores" },
  { id: "paus",                name: "Naipe de Paus",                 subtitle: "O Elemento Fogo",            description: "Ação, criatividade, paixão e força vital",                                         icon: "🔥", symbol: "⚡", order: 5,  category: "minor-arcana",  totalLessons: 14, route: "/module/paus",               prerequisiteModuleId: "arquitetura-menores" },
  { id: "espadas",             name: "Naipe de Espadas",              subtitle: "O Elemento Ar",              description: "Mente, conflitos, verdade e comunicação",                                          icon: "⚔️", symbol: "△",  order: 6,  category: "minor-arcana",  totalLessons: 14, route: "/module/espadas",            prerequisiteModuleId: "arquitetura-menores" },
  { id: "ouros",               name: "Naipe de Ouros",                subtitle: "O Elemento Terra",           description: "Material, prosperidade, corpo e manifestação",                                     icon: "💎", symbol: "◆",  order: 7,  category: "minor-arcana",  totalLessons: 14, route: "/module/ouros",              prerequisiteModuleId: "arquitetura-menores" },
  { id: "cartas-corte",        name: "Cartas da Corte",               subtitle: "Pessoas e Posturas",         description: "Pajem, Cavaleiro, Rainha e Rei — como pessoa, postura e estágio energético",        icon: "👑", symbol: "♛",  order: 8,  category: "minor-arcana",  totalLessons: 8,  route: "/module/cartas-corte",       prerequisiteModuleId: "copas" },

  // ─── Avançado ───
  { id: "combinacoes",         name: "Combinações",                   subtitle: "A Arte da Síntese",          description: "Como uma carta altera a outra: pares, tríades, contexto e erros comuns",            icon: "🔗", symbol: "∞",  order: 9,  category: "advanced",      totalLessons: 10, route: "/module/combinacoes",        prerequisiteModuleId: "cartas-corte" },
  { id: "tiragens",            name: "Tiragens",                      subtitle: "Os Métodos de Leitura",      description: "1 carta, 3 cartas, cruz, decisão, autoconhecimento e tiragens temáticas",           icon: "🎴", symbol: "◎",  order: 10, category: "advanced",      totalLessons: 11, route: "/module/tiragens",           prerequisiteModuleId: "combinacoes" },
  { id: "espiritualidade",     name: "Tarô e Espiritualidade",        subtitle: "O Sagrado na Prática",       description: "Preparação, presença, intenção, limpeza do espaço e limites éticos",                icon: "🕯", symbol: "☸",  order: 11, category: "advanced",      totalLessons: 8,  route: "/module/espiritualidade",    prerequisiteModuleId: "tiragens" },
  { id: "mesa-taro",           name: "Como Montar uma Mesa",          subtitle: "O Espaço Sagrado",           description: "Estrutura da mesa, o que usar, o que evitar, mesa de estudo e de atendimento",      icon: "🕯", symbol: "⬡",  order: 12, category: "advanced",      totalLessons: 6,  route: "/module/mesa-taro",          prerequisiteModuleId: "espiritualidade" },

  // ─── Prática ───
  { id: "leitura-aplicada",    name: "Leitura Aplicada por Tema",     subtitle: "O Tarô no Cotidiano",        description: "Amor, trabalho, espiritualidade, família, decisões e bloqueios",                    icon: "🎯", symbol: "◇",  order: 13, category: "practice",      totalLessons: 8,  route: "/module/leitura-aplicada",   prerequisiteModuleId: "tiragens" },
  { id: "pratica",             name: "Prática Guiada",                subtitle: "O Tarô Vivo",                description: "Estudos de caso, interpretação guiada e comparação entre leituras",                 icon: "✨", symbol: "★",  order: 14, category: "practice",      totalLessons: 10, route: "/module/pratica",            prerequisiteModuleId: "leitura-aplicada" },

  // ─── Profissional ───
  { id: "trabalhar-taro",      name: "Como Trabalhar com Tarô",       subtitle: "Do Estudo à Profissão",      description: "Atendimento, condução, postura, ética, comunicação e organização profissional",     icon: "💼", symbol: "⚜",  order: 15, category: "professional",  totalLessons: 8,  route: "/module/trabalhar-taro",     prerequisiteModuleId: "pratica" },
];

/** Arcanos available for free in beta */
export const FREE_ARCANO_IDS = [0];

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

/** Get arcano data by ID — always uses editorial registry */
export function getArcanoById(id: number): ArcanoData | undefined {
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
  studentName: "",
  certificatesEarned: {},
};
