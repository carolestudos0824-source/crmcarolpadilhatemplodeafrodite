export const buildReview = () => ({ questions: [] });
export const buildReviewBundle = () => ({});
export const generateDailyChallenge = () => ({});
export const getArcanoNameFromBundle = () => "";
export const getArcanoNumeralFromBundle = () => "";
export const getFlashcardsForArcano = () => [];
export interface QuickReviewSummary {
  numeral: string;
  name: string;
  keyword: string;
  light: string;
  shadow: string;
  lesson: string;
  practicalApplication: string;
  fixationPhrase: string;
}
export interface Flashcard {}
