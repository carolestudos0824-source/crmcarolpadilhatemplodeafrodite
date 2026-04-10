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
  { id: "amor",              name: "Amor e Relacionamentos",subtitle: "O Tarô do Coração",         description: "Leituras temáticas focadas em amor, vínculo e conexão",             icon: "❤️", symbol: "♡",  order: 8,  category: "practice",      totalLessons: 10, route: "/module/amor",           prerequisiteModuleId: "tiragens" },
  { id: "pratica",           name: "Prática Guiada",        subtitle: "O Tarô Vivo",               description: "Exercícios reais de leitura com feedback e orientação",             icon: "✨", symbol: "★",  order: 9,  category: "practice",      totalLessons: 10, route: "/module/pratica",         prerequisiteModuleId: "tiragens" },
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
