
-- Quiz responses: track individual quiz answers per user
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz responses"
  ON public.quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
  ON public.quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_quiz_responses_user ON public.quiz_responses (user_id, quiz_id);

-- Daily challenge completions
CREATE TABLE public.daily_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id TEXT NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id, challenge_date)
);

ALTER TABLE public.daily_challenge_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge completions"
  ON public.daily_challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge completions"
  ON public.daily_challenge_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_daily_challenges_user ON public.daily_challenge_completions (user_id, challenge_date);
