-- Função de contagem essencial unificada (Maiores + Menores)
CREATE OR REPLACE FUNCTION public.cms_arcanos_essential_count(a public.cms_arcanos)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT
    (CASE WHEN a.essencia IS NOT NULL AND a.essencia <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.simbolos_centrais IS NOT NULL AND a.simbolos_centrais <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.luz IS NOT NULL AND a.luz <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.sombra IS NOT NULL AND a.sombra <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.amor IS NOT NULL AND a.amor <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.trabalho IS NOT NULL AND a.trabalho <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.espiritualidade IS NOT NULL AND a.espiritualidade <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.voz_do_arcano IS NOT NULL AND a.voz_do_arcano <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN a.revisao_rapida IS NOT NULL AND a.revisao_rapida <> '' THEN 1 ELSE 0 END)
  + (CASE WHEN array_length(a.keywords, 1) >= 3 THEN 1 ELSE 0 END);
$$;

-- Trigger de hidratação editorial: rebaixa status quando faltam essenciais.
-- Régua oficial:
--   filled = 0          -> status = 'empty'
--   1..5                -> status = 'partial'   + validated = false
--   6..9                -> status = 'draft'     + validated = false
--   10                  -> mantém status (admin pode publicar) e permite validated = true
CREATE OR REPLACE FUNCTION public.enforce_arcano_editorial_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  filled integer;
BEGIN
  filled := public.cms_arcanos_essential_count(NEW);

  IF filled = 0 THEN
    NEW.status := 'empty'::module_status;
    NEW.validated := false;
  ELSIF filled <= 5 THEN
    NEW.status := 'partial'::module_status;
    NEW.validated := false;
  ELSIF filled <= 9 THEN
    -- Se admin tentou publicar sem completude total, rebaixa para draft
    IF NEW.status = 'published' THEN
      NEW.status := 'draft'::module_status;
    END IF;
    NEW.validated := false;
  ELSE
    -- filled = 10: editorialmente completa. Mantém status escolhido pelo admin.
    NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Substituir trigger anterior (que só mexia em validated)
DROP TRIGGER IF EXISTS trg_enforce_arcano_publish_threshold ON public.cms_arcanos;
DROP TRIGGER IF EXISTS trg_enforce_arcano_editorial_status ON public.cms_arcanos;

CREATE TRIGGER trg_enforce_arcano_editorial_status
BEFORE INSERT OR UPDATE ON public.cms_arcanos
FOR EACH ROW
EXECUTE FUNCTION public.enforce_arcano_editorial_status();