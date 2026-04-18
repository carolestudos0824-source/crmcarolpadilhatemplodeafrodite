-- Replace the over-aggressive trigger with a softer rule:
-- Only block validated=true when DB content is insufficient. Do not auto-demote published status.
CREATE OR REPLACE FUNCTION public.enforce_arcano_publish_threshold()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  filled integer;
BEGIN
  IF NEW.validated = true THEN
    filled := public.cms_arcanos_essential_count(NEW);
    -- Only enforce when there is *some* content in the DB; if the row is empty (filled=0),
    -- we assume editorial content lives in source files and validation is a manual editorial decision.
    IF filled > 0 AND filled < 6 THEN
      NEW.validated := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Restore the prior state: all 78 published.
UPDATE public.cms_arcanos SET status = 'published';

-- Restore validated=true for the 62 that were previously validated:
-- - Maiores #0-5 (O Louco through O Hierofante)
-- - All 56 menores
UPDATE public.cms_arcanos SET validated = true
WHERE (type = 'maior' AND number BETWEEN 0 AND 5)
   OR (type = 'menor');

-- Keep the 16 críticos explicitly unvalidated (Maiores #6-21)
UPDATE public.cms_arcanos SET validated = false
WHERE type = 'maior' AND number BETWEEN 6 AND 21;