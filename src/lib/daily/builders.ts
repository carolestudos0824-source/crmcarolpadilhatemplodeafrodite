export const buildDailyChallenge = () => ({});
export const buildDailyChallenges = () => [];
export const buildCartaDoDia = () => ({
  numeral: "", name: "", subtitle: "", keywords: [], essence: "", reflection: ""
});
export const buildPerguntasDoDia = () => ({ questions: [] });
export const buildSimboloDoDia = () => ({ name: "", explanation: "", readings: "", cards: [] });
export const buildCombinacaoDoDia = () => ({ card1: {}, card2: {}, prompt: "", insight: "" });
export const buildMiniInterpretacao = () => ({ context: "", position: "", card: {}, guidedQuestions: [], sampleReading: "" });
export const DAILY_TOTAL_XP = 100;
export interface DailyChallengeItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  icon: any;
  xp: number;
  xpReward?: number;
  completed: boolean;
}
export interface CartaDoDia {
  numeral: string;
  name: string;
  subtitle: string;
  keywords: string[];
  essence: string;
  reflection: string;
}
export interface PerguntasDoDia {
  questions: any[];
}
export interface SimboloDoDia {
  name: string;
  explanation: string;
  readings: string;
  cards: any[];
}
export interface CombinacaoDoDia {
  card1: any;
  card2: any;
  prompt: string;
  insight: string;
}
export interface MiniInterpretacao {
  context: string;
  position: string;
  card: any;
  guidedQuestions: string[];
  sampleReading: string;
}
