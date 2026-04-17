-- Two partial unique indexes for stable idempotent upsert
CREATE UNIQUE INDEX IF NOT EXISTS cms_arcanos_maior_key
  ON public.cms_arcanos (number)
  WHERE type = 'maior';

CREATE UNIQUE INDEX IF NOT EXISTS cms_arcanos_menor_key
  ON public.cms_arcanos (naipe, number)
  WHERE type = 'menor';