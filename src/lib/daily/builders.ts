export const buildDailyChallenge = () => ({});
export const buildDailyChallenges = () => [];
export const buildCartaDoDia = () => ({});
export const buildPerguntasDoDia = () => ({ questions: [] });
export const buildSimboloDoDia = () => ({});
export const buildCombinacaoDoDia = () => ({});
export const buildMiniInterpretacao = () => ({});
export const DAILY_TOTAL_XP = 100;
export interface DailyChallengeItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  icon: any;
  xp: number;
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
export interface SimboloDoDia {}
export interface CombinacaoDoDia {}
export interface MiniInterpretacao {}
