ALTER TABLE public.cms_suits 
  ADD COLUMN IF NOT EXISTS aplicacoes_leitura text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reflexao text;