UPDATE public.cms_arcanos
SET status = 'published',
    updated_at = now()
WHERE type = 'maior'
  AND number BETWEEN 0 AND 21
  AND status <> 'published';