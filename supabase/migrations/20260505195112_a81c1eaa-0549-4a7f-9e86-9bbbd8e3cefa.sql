-- Create tarot_content table first as it's the core data
CREATE TABLE public.tarot_content (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  arcana_type TEXT NOT NULL CHECK (arcana_type IN ('major', 'minor')),
  suit TEXT CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles')),
  image_url TEXT,
  direct_meaning TEXT NOT NULL,
  reverse_meaning TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  element TEXT,
  astrology TEXT,
  kabalistic_number INTEGER,
  phrases JSONB, -- Array of objects {phrase: string, answer: string}
  situations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for tarot_content (publicly readable)
ALTER TABLE public.tarot_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tarot content is viewable by everyone" ON public.tarot_content FOR SELECT USING (true);

-- Create user_stats table
CREATE TABLE public.user_stats (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  xp_total INTEGER DEFAULT 0,
  xp_hoje INTEGER DEFAULT 0,
  meta_diaria INTEGER DEFAULT 20,
  streak_current INTEGER DEFAULT 0,
  streak_max INTEGER DEFAULT 0,
  last_study_date DATE,
  hearts INTEGER DEFAULT 3,
  last_heart_recharge TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_league TEXT DEFAULT 'areia',
  xp_week INTEGER DEFAULT 0,
  current_week DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert user stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_unit_progress table
CREATE TABLE public.user_unit_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id INTEGER NOT NULL,
  current_level INTEGER DEFAULT 0, -- 0 = locked, 1-5 = completed level
  crowns INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, unit_id)
);

-- Enable RLS for user_unit_progress
ALTER TABLE public.user_unit_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON public.user_unit_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_unit_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_unit_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create lesson_history table
CREATE TABLE public.lesson_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  xp_gained INTEGER DEFAULT 10,
  is_perfect BOOLEAN DEFAULT false,
  errors_count INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for lesson_history
ALTER TABLE public.lesson_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own history" ON public.lesson_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own history" ON public.lesson_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Enable RLS for user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create league_participants table
CREATE TABLE public.league_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  league_name TEXT NOT NULL,
  week_date DATE NOT NULL,
  xp_week INTEGER DEFAULT 0,
  display_name TEXT,
  UNIQUE(user_id, week_date)
);

-- Enable RLS for league_participants
ALTER TABLE public.league_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view league participants" ON public.league_participants FOR SELECT USING (true);
CREATE POLICY "Users can update their own league entry" ON public.league_participants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own league entry" ON public.league_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_user_unit_progress_updated_at BEFORE UPDATE ON public.user_unit_progress FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();