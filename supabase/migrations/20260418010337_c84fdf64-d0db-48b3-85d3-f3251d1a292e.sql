-- Containment rule: auto-demote published arcanos with insufficient editorial content to 'draft'.
-- Essential fields threshold: at least 6 of 10 must be filled to remain published.

CREATE OR REPLACE FUNCTION public.cms_arcanos_essential_count(a public.cms_arcanos)
RETURNS integer
LANGUAGE sql
IMMUTABLE
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

CREATE OR REPLACE FUNCTION public.enforce_arcano_publish_threshold()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  filled integer;
BEGIN
  IF NEW.status = 'published' THEN
    filled := public.cms_arcanos_essential_count(NEW);
    IF filled < 6 THEN
      NEW.status := 'draft';
      NEW.validated := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_arcano_publish_threshold ON public.cms_arcanos;
CREATE TRIGGER trg_enforce_arcano_publish_threshold
  BEFORE INSERT OR UPDATE ON public.cms_arcanos
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_arcano_publish_threshold();

-- Apply the rule retroactively: demote the 16 critical arcanos.
UPDATE public.cms_arcanos
SET status = 'draft', validated = false
WHERE status = 'published'
  AND public.cms_arcanos_essential_count(cms_arcanos) < 6;