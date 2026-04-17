-- ─── cms_certificates ────────────────────────────────────────────
CREATE TABLE public.cms_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  icon text,
  completion_check text NOT NULL,
  accent_color text,
  order_index integer NOT NULL DEFAULT 0,
  status module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published certificates" ON public.cms_certificates
  FOR SELECT TO authenticated USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage certificates" ON public.cms_certificates
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_certificates_updated_at BEFORE UPDATE ON public.cms_certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── cms_numerologia ─────────────────────────────────────────────
CREATE TABLE public.cms_numerologia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL UNIQUE,
  nome text NOT NULL,
  subtitulo text,
  principio text,
  simbolo text,
  descricao text NOT NULL,
  aprofundamento text,
  manifestacao_copas text,
  manifestacao_paus text,
  manifestacao_espadas text,
  manifestacao_ouros text,
  palavras_chave text[] NOT NULL DEFAULT '{}',
  reflexao text,
  status module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_numerologia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published numerologia" ON public.cms_numerologia
  FOR SELECT TO authenticated USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage numerologia" ON public.cms_numerologia
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_numerologia_updated_at BEFORE UPDATE ON public.cms_numerologia
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── cms_suits ───────────────────────────────────────────────────
CREATE TABLE public.cms_suits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naipe arcano_naipe NOT NULL UNIQUE,
  nome text NOT NULL,
  subtitulo text,
  elemento text,
  simbolo_elemento text,
  icone text,
  palavras_ancora text[] NOT NULL DEFAULT '{}',
  frase_abertura text,
  essencia text,
  atmosfera text,
  funcao_na_leitura text,
  desafios text,
  potencial text,
  linguagem_editorial text,
  status module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_suits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published suits" ON public.cms_suits
  FOR SELECT TO authenticated USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage suits" ON public.cms_suits
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_suits_updated_at BEFORE UPDATE ON public.cms_suits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── cms_court_cards ─────────────────────────────────────────────
CREATE TABLE public.cms_court_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  subtitulo text,
  principio text,
  simbolo text,
  palavras_chave text[] NOT NULL DEFAULT '{}',
  texto_principal text NOT NULL,
  explicacao_simbolica text,
  leitura_psicologica text,
  leitura_pratica text,
  manifestacao_copas_titulo text,
  manifestacao_copas_texto text,
  manifestacao_paus_titulo text,
  manifestacao_paus_texto text,
  manifestacao_espadas_titulo text,
  manifestacao_espadas_texto text,
  manifestacao_ouros_titulo text,
  manifestacao_ouros_texto text,
  exemplos_interpretacao text[] NOT NULL DEFAULT '{}',
  reflexao text,
  order_index integer NOT NULL DEFAULT 0,
  status module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_court_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published court cards" ON public.cms_court_cards
  FOR SELECT TO authenticated USING (status = 'published' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage court cards" ON public.cms_court_cards
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_court_cards_updated_at BEFORE UPDATE ON public.cms_court_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();