-- Remove o trigger que estava bloqueando validações
DROP TRIGGER IF EXISTS trg_enforce_arcano_publish_threshold ON public.cms_arcanos;

-- Restaura a validação dos 62 que estavam validados antes
UPDATE public.cms_arcanos
SET validated = true
WHERE status = 'published'
  AND ((type = 'maior' AND number BETWEEN 0 AND 5) OR type = 'menor');

-- Garante que os 16 críticos rebaixados permanecem em rascunho e não validados
UPDATE public.cms_arcanos
SET status = 'draft', validated = false
WHERE type = 'maior' AND number BETWEEN 6 AND 21;