-- ============================================================
-- Fase 2A — Seed dos quizzes dos 3 arcanos piloto
-- O Louco (0), O Mago (1), A Sacerdotisa (2)
-- ============================================================

DO $$
DECLARE
  _louco_quiz_id UUID;
  _mago_quiz_id UUID;
  _sacer_quiz_id UUID;
BEGIN
  -- ─── O LOUCO ───────────────────────────────────────────────
  -- Idempotência: external_id único por arcano
  SELECT id INTO _louco_quiz_id FROM cms_quizzes WHERE external_id = 'arcano-0-quiz';

  IF _louco_quiz_id IS NULL THEN
    INSERT INTO cms_quizzes (title, status, xp_reward, difficulty, linked_to, external_id, result_text)
    VALUES (
      'O Louco — Quiz Editorial',
      'published',
      15,
      'easy',
      'arcano-maior-0',
      'arcano-0-quiz',
      'Você completou o quiz do Louco — o primeiro passo da Jornada está dado.'
    )
    RETURNING id INTO _louco_quiz_id;

    INSERT INTO cms_quiz_questions (quiz_id, prompt, options, correct_index, explanation, order_index) VALUES
      (_louco_quiz_id, 'Qual é o número associado ao arcano O Louco?',
        '["I", "0", "XXII", "XIII"]'::jsonb, 1,
        'O Louco é o arcano número 0 — representando o potencial puro, o vazio fértil antes de qualquer manifestação.', 0),
      (_louco_quiz_id, 'Na Cabala, a qual letra hebraica O Louco corresponde?',
        '["Beth (ב)", "Aleph (א)", "Gimel (ג)", "Daleth (ד)"]'::jsonb, 1,
        'Aleph (א) é o sopro silencioso, a respiração primordial — conectando O Louco ao caminho entre Keter e Chokmah.', 1),
      (_louco_quiz_id, 'Qual é o aspecto SOMBRA do Louco?',
        '["Coragem para novos começos", "Imprudência disfarçada de coragem", "Sabedoria interior", "Conexão espiritual profunda"]'::jsonb, 1,
        'Na sombra, O Louco se torna imprudência — fuga travestida de liberdade, irresponsabilidade fingindo espontaneidade.', 2),
      (_louco_quiz_id, 'O Louco representa o final da Jornada dos Arcanos Maiores.',
        '["Verdadeiro", "Falso"]'::jsonb, 1,
        'O Louco é o início (0) e o eterno viajante — ele pode aparecer em qualquer ponto, mas simboliza o começo da jornada.', 3),
      (_louco_quiz_id, 'O que a trouxa do Louco simboliza?',
        '["Riqueza material", "Conhecimento acadêmico", "Karma e experiências inconscientes", "Medo do desconhecido"]'::jsonb, 2,
        'A trouxa representa o karma — experiências que carregamos sem saber conscientemente, bagagem da alma.', 4),
      (_louco_quiz_id, 'O cachorro na carta do Louco representa perigo iminente.',
        '["Verdadeiro", "Falso"]'::jsonb, 1,
        'O cachorro é o instinto protetor e a lealdade — ele alerta, não ameaça. Representa nossa intuição animal.', 5),
      (_louco_quiz_id, 'Quando O Louco aparece como conselho em uma leitura, ele convida a:',
        '["Planejar cada detalhe antes de agir", "Desistir do que não funciona", "Agir com fé, confiando na jornada", "Esperar o momento perfeito"]'::jsonb, 2,
        'O Louco convida a agir com fé — não cegamente, mas com a confiança de que a jornada importa mais que o destino.', 6);
  END IF;

  -- ─── O MAGO ────────────────────────────────────────────────
  SELECT id INTO _mago_quiz_id FROM cms_quizzes WHERE external_id = 'arcano-1-quiz';

  IF _mago_quiz_id IS NULL THEN
    INSERT INTO cms_quizzes (title, status, xp_reward, difficulty, linked_to, external_id, result_text)
    VALUES (
      'O Mago — Quiz Editorial',
      'published',
      15,
      'medium',
      'arcano-maior-1',
      'arcano-1-quiz',
      'Você dominou os mistérios do Mago — vontade, foco e manifestação consciente.'
    )
    RETURNING id INTO _mago_quiz_id;

    INSERT INTO cms_quiz_questions (quiz_id, prompt, options, correct_index, explanation, order_index) VALUES
      (_mago_quiz_id, 'Qual é o número associado ao arcano O Mago?',
        '["0", "I", "II", "III"]'::jsonb, 1,
        'O Mago é o arcano número I — a primeira manifestação consciente da vontade.', 0),
      (_mago_quiz_id, 'Quais são os quatro objetos sobre a mesa do Mago?',
        '["Livro, chave, espelho e coroa", "Espada, cálice, bastão e pentáculo", "Rosa, lírio, serpente e pomba", "Anel, cetro, globo e manto"]'::jsonb, 1,
        'Os quatro objetos representam os quatro elementos: espada (ar), cálice (água), bastão (fogo) e pentáculo (terra).', 1),
      (_mago_quiz_id, 'O que o lemniscata (∞) sobre a cabeça do Mago simboliza?',
        '["Tempo limitado", "Dualidade entre bem e mal", "Domínio infinito e consciência eterna", "O ciclo das estações"]'::jsonb, 2,
        'O lemniscata (∞) representa o domínio infinito — a maestria que transcende o tempo.', 2),
      (_mago_quiz_id, 'Na Cabala, O Mago corresponde à letra Aleph (א).',
        '["Verdadeiro", "Falso"]'::jsonb, 1,
        'O Mago corresponde à letra Beth (ב), que significa ''casa''. Aleph corresponde ao Louco.', 3),
      (_mago_quiz_id, 'Qual é o aspecto SOMBRA do Mago?',
        '["Falta de habilidade", "Preguiça e inação", "Manipulação e charlatanismo", "Medo do desconhecido"]'::jsonb, 2,
        'Na sombra, O Mago se torna manipulação — o uso da inteligência e do carisma para enganar.', 4),
      (_mago_quiz_id, 'A frase ''como acima, assim abaixo'' está associada ao Mago.',
        '["Verdadeiro", "Falso"]'::jsonb, 0,
        'Sim! Esta frase da Tábua de Esmeralda de Hermes Trismegisto é a essência do Mago.', 5),
      (_mago_quiz_id, 'Quando O Mago aparece no amor, na sua luz, ele indica:',
        '["Fim de um relacionamento", "Comunicação magnética e atração consciente", "Solidão necessária", "Dependência emocional"]'::jsonb, 1,
        'Na luz, O Mago no amor indica comunicação magnética e atração consciente.', 6);
  END IF;

  -- ─── A SACERDOTISA ─────────────────────────────────────────
  SELECT id INTO _sacer_quiz_id FROM cms_quizzes WHERE external_id = 'arcano-2-quiz';

  IF _sacer_quiz_id IS NULL THEN
    INSERT INTO cms_quizzes (title, status, xp_reward, difficulty, linked_to, external_id, result_text)
    VALUES (
      'A Sacerdotisa — Quiz Editorial',
      'published',
      15,
      'medium',
      'arcano-maior-2',
      'arcano-2-quiz',
      'Você atravessou o véu da Sacerdotisa — escutou o silêncio e compreendeu o mistério.'
    )
    RETURNING id INTO _sacer_quiz_id;

    INSERT INTO cms_quiz_questions (quiz_id, prompt, options, correct_index, explanation, order_index) VALUES
      (_sacer_quiz_id, 'Qual é o número associado ao arcano A Sacerdotisa?',
        '["0", "I", "II", "III"]'::jsonb, 2,
        'A Sacerdotisa é o arcano número II — o portal entre o consciente e o inconsciente.', 0),
      (_sacer_quiz_id, 'O que as colunas B e J na carta da Sacerdotisa representam?',
        '["Bem e mal", "As colunas do Templo de Salomão (Boaz e Jachin)", "Masculino e feminino", "Passado e futuro"]'::jsonb, 1,
        'As colunas B (Boaz = força) e J (Jachin = estabelecimento) são do Templo de Salomão.', 1),
      (_sacer_quiz_id, 'Qual é o aspecto SOMBRA da Sacerdotisa?',
        '["Imprudência e falta de limites", "Frieza emocional e segredos destrutivos", "Manipulação e charlatanismo", "Excesso de ação sem reflexão"]'::jsonb, 1,
        'Na sombra, a Sacerdotisa se torna frieza emocional e segredos que corroem.', 2),
      (_sacer_quiz_id, 'A Sacerdotisa corresponde à letra hebraica Beth (ב) na Cabala.',
        '["Verdadeiro", "Falso"]'::jsonb, 1,
        'Corresponde à letra Gimel (ג). Beth corresponde ao Mago.', 3),
      (_sacer_quiz_id, 'O que a lua crescente aos pés da Sacerdotisa simboliza?',
        '["Tempo passando rapidamente", "Domínio sobre os ciclos e as marés emocionais", "Iluminação espiritual completa", "Início de uma nova fase material"]'::jsonb, 1,
        'A lua crescente simboliza o domínio sobre os ciclos naturais e as marés emocionais.', 4),
      (_sacer_quiz_id, 'A Sacerdotisa convida a agir imediatamente diante de um dilema.',
        '["Verdadeiro", "Falso"]'::jsonb, 1,
        'A Sacerdotisa convida ao silêncio e à contemplação — escutar antes de agir.', 5),
      (_sacer_quiz_id, 'Quando a Sacerdotisa aparece no amor, na sua luz, ela indica:',
        '["Ação impulsiva e declarações ousadas", "Mistério, conexão profunda e introspecção", "Fim definitivo de um relacionamento", "Dependência emocional e ciúmes"]'::jsonb, 1,
        'Na luz, indica mistério, conexão profunda não-verbal e ouvir o coração antes de agir.', 6);
  END IF;
END $$;