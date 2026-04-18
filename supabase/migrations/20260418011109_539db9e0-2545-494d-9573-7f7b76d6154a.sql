UPDATE public.cms_arcanos
SET validated = true
WHERE status = 'published'
  AND validated = false
  AND ((type = 'maior' AND number BETWEEN 0 AND 5) OR type = 'menor');