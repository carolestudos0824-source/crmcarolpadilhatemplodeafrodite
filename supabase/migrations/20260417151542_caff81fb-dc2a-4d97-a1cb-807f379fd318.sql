CREATE TYPE public.quiz_difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE public.cms_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  module_id UUID REFERENCES public.cms_modules(id) ON DELETE SET NULL,
  linked_to TEXT,
  status public.module_status NOT NULL DEFAULT 'draft',
  xp_reward INTEGER NOT NULL DEFAULT 10,
  difficulty public.quiz_difficulty NOT NULL DEFAULT 'medium',
  result_text TEXT,
  review_link TEXT,
  external_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_cms_quizzes_module ON public.cms_quizzes(module_id);
CREATE INDEX idx_cms_quizzes_status ON public.cms_quizzes(status);

ALTER TABLE public.cms_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published quizzes"
ON public.cms_quizzes FOR SELECT
TO authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage quizzes"
ON public.cms_quizzes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cms_quizzes_updated_at
BEFORE UPDATE ON public.cms_quizzes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cms_quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.cms_quizzes(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_cms_quiz_questions_quiz ON public.cms_quiz_questions(quiz_id, order_index);

ALTER TABLE public.cms_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions of published quizzes"
ON public.cms_quiz_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cms_quizzes q
    WHERE q.id = quiz_id
      AND (q.status = 'published' OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admins manage quiz questions"
ON public.cms_quiz_questions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cms_quiz_questions_updated_at
BEFORE UPDATE ON public.cms_quiz_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();