-- Status enum for modules
CREATE TYPE public.module_status AS ENUM ('empty', 'partial', 'draft', 'published');
CREATE TYPE public.module_tier AS ENUM ('free', 'premium');

-- Modules table (CMS-managed)
CREATE TABLE public.cms_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  short_description TEXT,
  editorial_description TEXT,
  icon TEXT,
  theme_color TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status public.module_status NOT NULL DEFAULT 'empty',
  tier public.module_tier NOT NULL DEFAULT 'premium',
  route_prefix TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_cms_modules_order ON public.cms_modules(order_index);
CREATE INDEX idx_cms_modules_status ON public.cms_modules(status);

ALTER TABLE public.cms_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published modules"
ON public.cms_modules FOR SELECT
TO authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage modules"
ON public.cms_modules FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cms_modules_updated_at
BEFORE UPDATE ON public.cms_modules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Module lessons (linked references)
CREATE TABLE public.cms_module_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.cms_modules(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (module_id, lesson_id)
);

CREATE INDEX idx_cms_module_lessons_module ON public.cms_module_lessons(module_id, order_index);

ALTER TABLE public.cms_module_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published modules"
ON public.cms_module_lessons FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cms_modules m
    WHERE m.id = module_id
      AND (m.status = 'published' OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admins manage module lessons"
ON public.cms_module_lessons FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));