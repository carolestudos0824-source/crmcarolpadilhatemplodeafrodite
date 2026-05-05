export const buildReview = () => ({ questions: [] });
export const buildReviewBundle = () => ({ allFlashcards: [], allReviewQuizzes: [], allQuickReviews: [] });
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
export interface Flashcard {
  id: string;
  arcanoId: number;
  category: string;
  front: string;
  back: string;
}
