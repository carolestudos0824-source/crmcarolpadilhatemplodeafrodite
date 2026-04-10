/**
 * Daily Challenge System
 * Deterministic daily content based on date seed.
 */

import { ARCANOS_MAIORES, getArcanoById } from "./tarot-data";
import { SYMBOL_CATEGORIES } from "./symbol-library";
import { ARCANOS_MENORES } from "./arcanos-menores";

// ─── Types ───

export interface DailyChallengeItem {
  id: string;
  type: "carta-do-dia" | "revisao-rapida" | "perguntas-do-dia" | "simbolo-do-dia" | "combinacao-do-dia" | "mini-interpretacao";
  title: string;
  subtitle: string;
  icon: string;
  xp: number;
  completed: boolean;
}

export interface CartaDoDia {
  arcanoId: number;
  name: string;
  numeral: string;
  subtitle: string;
  keywords: string[];
  essence: string;
  reflection: string;
}

export interface PerguntasDoDia {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SimboloDoDia {
  name: string;
  explanation: string;
  readings: string[];
  cards: string[];
}

export interface CombinacaoDoDia {
  card1: { name: string; numeral: string };
  card2: { name: string; numeral: string };
  prompt: string;
  insight: string;
}

export interface MiniInterpretacao {
  context: string;
  card: { name: string; numeral: string; keywords: string[] };
  position: string;
  guidedQuestions: string[];
  sampleReading: string;
}

// ─── Seed-based deterministic random ───

function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededPick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Generators ───

export function getCartaDoDia(date = getTodayStr()): CartaDoDia {
  const seed = dateSeed(date);
  const arcano = seededPick(ARCANOS_MAIORES, seed, 0);
  return {
    arcanoId: arcano.id,
    name: arcano.name,
    numeral: arcano.numeral,
    subtitle: arcano.subtitle,
    keywords: arcano.keywords,
    essence: arcano.layers.main.essence,
    reflection: `Como ${arcano.name} se manifesta na sua vida hoje? Observe os padrões do dia com a lente deste arcano.`,
  };
}

export function getPerguntasDoDia(date = getTodayStr()): PerguntasDoDia {
  const seed = dateSeed(date);
  const questions: PerguntasDoDia["questions"] = [];

  for (let i = 0; i < 3; i++) {
    const arcano = seededPick(ARCANOS_MAIORES, seed, i * 7 + 3);
    if (arcano.quiz && arcano.quiz.length > 0) {
      const q = seededPick(arcano.quiz, seed, i * 13);
      questions.push({
        id: `daily-${date}-q${i}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }
  }

  return { questions };
}

export function getSimboloDoDia(date = getTodayStr()): SimboloDoDia {
  const seed = dateSeed(date);
  const allSymbols = SYMBOL_CATEGORIES.flatMap(c => c.symbols);
  const symbol = seededPick(allSymbols, seed, 11);
  return {
    name: symbol.name,
    explanation: symbol.explanation,
    readings: symbol.readings,
    cards: symbol.cards,
  };
}

export function getCombinacaoDoDia(date = getTodayStr()): CombinacaoDoDia {
  const seed = dateSeed(date);
  const a1 = seededPick(ARCANOS_MAIORES, seed, 5);
  const a2 = seededPick(ARCANOS_MAIORES, seed, 17);
  
  const contexts = [
    "num contexto afetivo",
    "numa decisão profissional",
    "numa reflexão espiritual",
    "sobre o momento presente",
    "como conselho do dia",
  ];
  const ctx = seededPick(contexts, seed, 23);

  return {
    card1: { name: a1.name, numeral: a1.numeral },
    card2: { name: a2.name, numeral: a2.numeral },
    prompt: `Imagine que ${a1.name} e ${a2.name} aparecem lado a lado ${ctx}. O que essa combinação conta?`,
    insight: `${a1.name} traz a energia de ${a1.keywords[0]?.toLowerCase() || "transformação"}, enquanto ${a2.name} adiciona ${a2.keywords[0]?.toLowerCase() || "sabedoria"}. Juntas, sugerem ${ctx === "num contexto afetivo" ? "uma dinâmica relacional complexa" : ctx === "numa decisão profissional" ? "uma encruzilhada de ação e reflexão" : "um convite ao autoconhecimento profundo"}.`,
  };
}

export function getMiniInterpretacao(date = getTodayStr()): MiniInterpretacao {
  const seed = dateSeed(date);
  const arcano = seededPick(ARCANOS_MAIORES, seed, 31);
  
  const positions = ["Passado", "Presente", "Futuro", "Conselho", "Obstáculo", "Resultado"];
  const pos = seededPick(positions, seed, 41);

  const contexts = [
    "Uma mulher pergunta sobre uma mudança de carreira.",
    "Alguém busca clareza sobre um relacionamento difícil.",
    "Uma estudante quer orientação sobre seu próximo passo na vida.",
    "Uma pessoa sente-se estagnada e quer entender o que bloqueia seu progresso.",
    "Alguém está iniciando um projeto e quer saber as energias ao redor.",
  ];
  const ctx = seededPick(contexts, seed, 51);

  return {
    context: ctx,
    card: { name: arcano.name, numeral: arcano.numeral, keywords: arcano.keywords },
    position: pos,
    guidedQuestions: [
      `O que ${arcano.name} na posição de ${pos} sugere sobre a situação?`,
      `Quais palavras-chave se conectam ao contexto da pergunta?`,
      `Qual seria a mensagem principal para o consulente?`,
    ],
    sampleReading: `${arcano.name} na posição de ${pos} sugere que ${arcano.layers.main.essence.split(".")[0].toLowerCase()}. No contexto apresentado, isso aponta para ${arcano.keywords.slice(0, 2).join(" e ").toLowerCase()} como temas centrais da resposta.`,
  };
}

// ─── Daily challenge list ───

export function getDailyChallenges(date = getTodayStr()): DailyChallengeItem[] {
  return [
    { id: `${date}-carta`, type: "carta-do-dia", title: "Carta do Dia", subtitle: "Receba e contemple o arcano de hoje", icon: "🃏", xp: 10, completed: false },
    { id: `${date}-revisao`, type: "revisao-rapida", title: "Revisão Rápida", subtitle: "Relembre um conceito essencial", icon: "⚡", xp: 15, completed: false },
    { id: `${date}-perguntas`, type: "perguntas-do-dia", title: "3 Perguntas do Dia", subtitle: "Teste seu conhecimento em 3 questões", icon: "✦", xp: 20, completed: false },
    { id: `${date}-simbolo`, type: "simbolo-do-dia", title: "Símbolo do Dia", subtitle: "Descubra um símbolo e seu significado", icon: "◎", xp: 10, completed: false },
    { id: `${date}-combinacao`, type: "combinacao-do-dia", title: "Combinação do Dia", subtitle: "Interprete duas cartas juntas", icon: "🔗", xp: 15, completed: false },
    { id: `${date}-interpretacao`, type: "mini-interpretacao", title: "Mini Interpretação", subtitle: "Pratique uma leitura guiada", icon: "📖", xp: 25, completed: false },
  ];
}

export const DAILY_TOTAL_XP = 95;
