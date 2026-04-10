/**
 * Daily Challenge System
 * Deterministic daily content based on date seed.
 */

import { ARCANOS_MAIORES, getArcanoById, type ArcanoData } from "./tarot-data";
import { SYMBOL_CATEGORIES } from "./symbol-library";

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

// ─── Helper to get full arcano data ───

function getFullArcano(seed: number, offset: number): ArcanoData | undefined {
  const summary = seededPick(ARCANOS_MAIORES, seed, offset);
  return getArcanoById(summary.id);
}

// ─── Generators ───

export function getCartaDoDia(date = getTodayStr()): CartaDoDia {
  const seed = dateSeed(date);
  const summary = seededPick(ARCANOS_MAIORES, seed, 0);
  const full = getArcanoById(summary.id);
  return {
    arcanoId: summary.id,
    name: summary.name,
    numeral: summary.numeral,
    subtitle: summary.subtitle,
    keywords: full?.keywords || [],
    essence: full?.layers.main.essence || "",
    reflection: `Como ${summary.name} se manifesta na sua vida hoje? Observe os padrões do dia com a lente deste arcano.`,
  };
}

export function getPerguntasDoDia(date = getTodayStr()): PerguntasDoDia {
  const seed = dateSeed(date);
  const questions: PerguntasDoDia["questions"] = [];

  for (let i = 0; i < 3; i++) {
    const full = getFullArcano(seed, i * 7 + 3);
    if (full && full.quiz && full.quiz.length > 0) {
      const q = seededPick(full.quiz, seed, i * 13);
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
  const s1 = seededPick(ARCANOS_MAIORES, seed, 5);
  const s2 = seededPick(ARCANOS_MAIORES, seed, 17);
  const f1 = getArcanoById(s1.id);
  const f2 = getArcanoById(s2.id);
  
  const contexts = [
    "num contexto afetivo",
    "numa decisão profissional",
    "numa reflexão espiritual",
    "sobre o momento presente",
    "como conselho do dia",
  ];
  const ctx = seededPick(contexts, seed, 23);
  const kw1 = f1?.keywords[0]?.toLowerCase() || "transformação";
  const kw2 = f2?.keywords[0]?.toLowerCase() || "sabedoria";

  return {
    card1: { name: s1.name, numeral: s1.numeral },
    card2: { name: s2.name, numeral: s2.numeral },
    prompt: `Imagine que ${s1.name} e ${s2.name} aparecem lado a lado ${ctx}. O que essa combinação conta?`,
    insight: `${s1.name} traz a energia de ${kw1}, enquanto ${s2.name} adiciona ${kw2}. Juntas, sugerem ${ctx === "num contexto afetivo" ? "uma dinâmica relacional complexa" : ctx === "numa decisão profissional" ? "uma encruzilhada de ação e reflexão" : "um convite ao autoconhecimento profundo"}.`,
  };
}

export function getMiniInterpretacao(date = getTodayStr()): MiniInterpretacao {
  const seed = dateSeed(date);
  const summary = seededPick(ARCANOS_MAIORES, seed, 31);
  const full = getArcanoById(summary.id);
  const keywords = full?.keywords || [];
  
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
  const essenceStart = full?.layers.main.essence.split(".")[0].toLowerCase() || "uma energia de transformação se apresenta";

  return {
    context: ctx,
    card: { name: summary.name, numeral: summary.numeral, keywords },
    position: pos,
    guidedQuestions: [
      `O que ${summary.name} na posição de ${pos} sugere sobre a situação?`,
      `Quais palavras-chave se conectam ao contexto da pergunta?`,
      `Qual seria a mensagem principal para o consulente?`,
    ],
    sampleReading: `${summary.name} na posição de ${pos} sugere que ${essenceStart}. No contexto apresentado, isso aponta para ${keywords.slice(0, 2).join(" e ").toLowerCase() || "reflexão e transformação"} como temas centrais da resposta.`,
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
