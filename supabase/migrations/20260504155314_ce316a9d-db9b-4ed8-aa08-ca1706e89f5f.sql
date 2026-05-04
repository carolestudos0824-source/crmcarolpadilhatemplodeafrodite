ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_level text,
ADD COLUMN IF NOT EXISTS onboarding_goal text;