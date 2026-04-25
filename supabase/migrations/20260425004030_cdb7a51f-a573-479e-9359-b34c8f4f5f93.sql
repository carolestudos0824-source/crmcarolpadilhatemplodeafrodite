-- Add user-state columns previously stored only in localStorage so they sync across devices.

-- 1. badges, certificates_earned, current_module on user_progress
ALTER TABLE public.user_progress
  ADD COLUMN IF NOT EXISTS badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certificates_earned jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS current_module text NOT NULL DEFAULT 'fools-journey';

-- 2. student_name on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS student_name text;