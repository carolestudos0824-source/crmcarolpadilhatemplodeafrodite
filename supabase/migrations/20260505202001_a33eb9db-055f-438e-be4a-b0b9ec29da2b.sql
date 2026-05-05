-- Drop the tables created in the last prompt
DROP TABLE IF EXISTS public.user_unit_progress CASCADE;
DROP TABLE IF EXISTS public.lesson_history CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.league_participants CASCADE;

-- Also dropping CMS tables if they were part of that specific "Duolingo" prompt's database setup
-- Note: Some might have existed before, but the prompt asked for a "Complete Learning System".
-- Based on the user's "undo" request, I'll remove the tables that clearly belong to this new system.
DROP TABLE IF EXISTS public.cms_module_lessons CASCADE;
DROP TABLE IF EXISTS public.cms_modules CASCADE;
DROP TABLE IF EXISTS public.cms_journey_arcanos CASCADE;
DROP TABLE IF EXISTS public.cms_journey_meta CASCADE;
DROP TABLE IF EXISTS public.cms_journey_phases CASCADE;
DROP TABLE IF EXISTS public.cms_quiz_questions CASCADE;
DROP TABLE IF EXISTS public.cms_quizzes CASCADE;
DROP TABLE IF EXISTS public.cms_symbol_categories CASCADE;
DROP TABLE IF EXISTS public.cms_symbols CASCADE;
DROP TABLE IF EXISTS public.cms_arcanos CASCADE;
DROP TABLE IF EXISTS public.cms_numerologia CASCADE;
DROP TABLE IF EXISTS public.cms_court_cards CASCADE;
DROP TABLE IF EXISTS public.cms_suits CASCADE;
DROP TABLE IF EXISTS public.cms_certificates CASCADE;
