-- 1. Rebaixar os 16 críticos para rascunho
WITH demoted AS (
  UPDATE public.cms_arcanos
  SET status = 'draft', validated = false, updated_at = now()
  WHERE type = 'maior'
    AND number BETWEEN 6 AND 21
    AND status = 'published'
    AND validated = false
    AND public.cms_arcanos_essential_count(cms_arcanos) < 6
  RETURNING id, number, name
)
-- 2. Registrar a ação em massa no audit log (admin_id = primeiro admin disponível)
INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_id, target_label, details)
SELECT
  (SELECT user_id FROM public.user_roles WHERE role = 'admin' ORDER BY id LIMIT 1),
  'system@editorial-containment',
  'arcano.bulk_demote_critical',
  'arcano',
  NULL,
  format('%s arcanos críticos rebaixados', (SELECT COUNT(*) FROM demoted)),
  jsonb_build_object(
    'count', (SELECT COUNT(*) FROM demoted),
    'reason', 'Contenção editorial: críticos publicados sem validação e abaixo da régua de 6/10 campos essenciais',
    'arcanos', (SELECT jsonb_agg(jsonb_build_object('id', id, 'number', number, 'name', name)) FROM demoted),
    'rule', 'critico_publicado_sem_validacao_voltou_para_rascunho',
    'exceptions', 0
  )
WHERE EXISTS (SELECT 1 FROM demoted)
  AND (SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1) IS NOT NULL;