CREATE OR REPLACE FUNCTION public.apply_arcano_backfill(_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _item jsonb;
  _updated integer := 0;
  _missed integer := 0;
  _missing_list jsonb := '[]'::jsonb;
  _affected integer;
  _is_service_role boolean;
BEGIN
  -- service_role chamando via PostgREST tem role 'service_role'
  _is_service_role := (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'service_role';

  IF NOT _is_service_role AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin or service_role only';
  END IF;

  FOR _item IN SELECT * FROM jsonb_array_elements(_payload)
  LOOP
    UPDATE public.cms_arcanos SET
      name              = COALESCE(_item->>'name', name),
      subtitle          = _item->>'subtitle',
      numeral           = _item->>'numeral',
      essencia          = _item->>'essencia',
      simbolos_centrais = _item->>'simbolos',
      luz               = _item->>'luz',
      sombra            = _item->>'sombra',
      amor              = _item->>'amor',
      trabalho          = _item->>'trabalho',
      espiritualidade   = _item->>'espiritualidade',
      voz_do_arcano     = _item->>'voz',
      revisao_rapida    = _item->>'revisao',
      aprofundamento    = _item->>'aprofundamento',
      cabala            = _item->>'cabala',
      arquetipos        = _item->>'arquetipos',
      numerologia       = _item->>'numerologia',
      astrologia        = _item->>'astrologia',
      elemento          = _item->>'elemento',
      jornada           = _item->>'jornada',
      keywords          = COALESCE(ARRAY(SELECT jsonb_array_elements_text(_item->'keywords')), keywords),
      tags              = COALESCE(ARRAY(SELECT jsonb_array_elements_text(_item->'tags')), tags),
      status            = COALESCE((_item->>'status')::module_status, status),
      updated_at        = now()
    WHERE type = (_item->>'type')::arcano_type
      AND number = (_item->>'number')::int
      AND ((_item->>'naipe' IS NULL AND naipe IS NULL) OR (naipe = (_item->>'naipe')::arcano_naipe));

    GET DIAGNOSTICS _affected = ROW_COUNT;
    IF _affected > 0 THEN
      _updated := _updated + _affected;
    ELSE
      _missed := _missed + 1;
      _missing_list := _missing_list || jsonb_build_object(
        'type', _item->>'type', 'naipe', _item->>'naipe',
        'number', _item->>'number', 'name', _item->>'name'
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object('updated', _updated, 'missed', _missed, 'missing', _missing_list);
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_arcano_backfill(jsonb) TO service_role;