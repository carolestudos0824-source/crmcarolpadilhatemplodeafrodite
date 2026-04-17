CREATE TYPE public.arcano_type AS ENUM ('maior', 'menor');
CREATE TYPE public.arcano_naipe AS ENUM ('copas', 'ouros', 'espadas', 'paus');

CREATE TABLE public.cms_arcanos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type public.arcano_type NOT NULL,
  naipe public.arcano_naipe,
  number INTEGER NOT NULL,
  numeral TEXT,
  name TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  status public.module_status NOT NULL DEFAULT 'empty',
  tier public.module_tier NOT NULL DEFAULT 'premium',
  validated BOOLEAN NOT NULL DEFAULT false,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  -- 17 editorial fields
  essencia TEXT,
  simbolos_centrais TEXT,
  luz TEXT,
  sombra TEXT,
  amor TEXT,
  trabalho TEXT,
  espiritualidade TEXT,
  voz_do_arcano TEXT,
  aprofundamento TEXT,
  arquetipos TEXT,
  numerologia TEXT,
  astrologia TEXT,
  elemento TEXT,
  cabala TEXT,
  jornada TEXT,
  pratica TEXT,
  citacao TEXT,
  -- Quiz + quick review
  quiz_id TEXT,
  revisao_rapida TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE (type, naipe, number)
);

CREATE INDEX idx_cms_arcanos_type ON public.cms_arcanos(type);
CREATE INDEX idx_cms_arcanos_status ON public.cms_arcanos(status);
CREATE INDEX idx_cms_arcanos_naipe ON public.cms_arcanos(naipe);

ALTER TABLE public.cms_arcanos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published arcanos"
ON public.cms_arcanos FOR SELECT
TO authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage arcanos"
ON public.cms_arcanos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_cms_arcanos_updated_at
BEFORE UPDATE ON public.cms_arcanos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();