-- ─── Tabelas ───────────────────────────────────────────────────────

CREATE TABLE public.cms_journey_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  order_index integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  subtitle text,
  symbol text,
  description text,
  theme text NOT NULL DEFAULT 'gold',
  arcano_ids integer[] NOT NULL DEFAULT '{}',
  status public.module_status NOT NULL DEFAULT 'published',
  tier public.module_tier NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

CREATE TABLE public.cms_journey_arcanos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arcano_number integer NOT NULL UNIQUE,
  numeral text NOT NULL,
  name text NOT NULL,
  journey_role text NOT NULL,
  narrative_text text NOT NULL,
  phase_slug text NOT NULL REFERENCES public.cms_journey_phases(slug) ON UPDATE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  status public.module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cms_journey_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  intro_title text NOT NULL,
  intro_subtitle text,
  intro_epigraph text,
  intro_body text[] NOT NULL DEFAULT '{}',
  closing_title text NOT NULL,
  closing_body text,
  closing_invitation text,
  status public.module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── Triggers updated_at ───────────────────────────────────────────

CREATE TRIGGER trg_cms_journey_phases_updated
  BEFORE UPDATE ON public.cms_journey_phases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cms_journey_arcanos_updated
  BEFORE UPDATE ON public.cms_journey_arcanos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cms_journey_meta_updated
  BEFORE UPDATE ON public.cms_journey_meta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── RLS ───────────────────────────────────────────────────────────

ALTER TABLE public.cms_journey_phases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_journey_arcanos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_journey_meta    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published phases"
  ON public.cms_journey_phases FOR SELECT TO authenticated
  USING (status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage phases"
  ON public.cms_journey_phases FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view arcanos of published phases"
  ON public.cms_journey_arcanos FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.cms_journey_phases p
    WHERE p.slug = cms_journey_arcanos.phase_slug
      AND (p.status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Admins manage journey arcanos"
  ON public.cms_journey_arcanos FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view journey meta"
  ON public.cms_journey_meta FOR SELECT TO authenticated
  USING (status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage journey meta"
  ON public.cms_journey_meta FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ─── Seed: fases ───────────────────────────────────────────────────

INSERT INTO public.cms_journey_phases (slug, order_index, title, subtitle, symbol, description, theme, arcano_ids) VALUES
('mundo-material', 0, 'O Mundo Material', 'Formação da identidade e encontro com os mestres', '◈',
 'O Louco desperta para o mundo. Encontra seus primeiros mestres — o poder da vontade (O Mago), a sabedoria interior (A Sacerdotisa), a abundância criativa (A Imperatriz), a estrutura necessária (O Imperador), a tradição e o sagrado (O Hierofante), e as primeiras escolhas do coração (Os Enamorados). É a fase de formação: quem sou eu? O que posso? Em quem confio?',
 'gold', ARRAY[0,1,2,3,4,5,6]),
('mundo-interior', 1, 'O Mundo Interior', 'Confronto com as forças internas e o destino', '☽',
 'Agora o viajante olha para dentro. Precisa encontrar sua força interior (O Carro), fazer justiça consigo mesmo (A Justiça), buscar respostas na solidão (O Eremita), aceitar os ciclos da vida (A Roda da Fortuna) e descobrir que a verdadeira força é gentileza (A Força). É o estágio do autoconhecimento profundo — o mundo como espelho.',
 'wine', ARRAY[7,8,9,10,11]),
('travessia-sombria', 2, 'A Travessia Sombria', 'Morte, destruição e renascimento', '✝',
 'A jornada exige sacrifício. O Enforcado convida a soltar o controle. A Morte transforma o que precisa acabar. A Temperança ensina equilíbrio após a perda. O Diabo revela as cadeias que criamos. A Torre destrói o que era falso. Essa é a noite escura da alma — o momento em que tudo desmorona para que algo verdadeiro possa nascer.',
 'plum', ARRAY[12,13,14,15,16]),
('iluminacao', 3, 'A Iluminação', 'Renovação, clareza e integração', '☀',
 'Após a travessia, a luz retorna. A Estrela traz esperança e cura. A Lua ilumina o inconsciente com suas verdades ocultas. O Sol revela a alegria essencial de existir. O Julgamento convoca ao despertar final — ouvir o chamado da alma. E O Mundo celebra a completude: o Louco chegou ao fim do ciclo, pronto para recomeçar com sabedoria.',
 'moonlight', ARRAY[17,18,19,20,21]);

-- ─── Seed: arcanos da jornada ──────────────────────────────────────

INSERT INTO public.cms_journey_arcanos (arcano_number, numeral, name, journey_role, narrative_text, phase_slug, order_index) VALUES
(0,  '0',     'O Louco',           'O viajante que inicia a jornada',                      'Tudo começa com um salto de fé. O Louco é o potencial puro antes de qualquer forma — a coragem de caminhar sem mapa. Ele carrega apenas a confiança de que o caminho se revela a quem ousa começar.',                                  'mundo-material', 0),
(1,  'I',     'O Mago',            'O primeiro mestre: a vontade criadora',                'O Louco encontra seu primeiro poder: a capacidade de manifestar. O Mago ensina que os quatro elementos estão disponíveis — basta a vontade focada e a consciência desperta para transformar potencial em realidade.',                  'mundo-material', 1),
(2,  'II',    'A Sacerdotisa',     'O véu entre o consciente e o mistério',                'Após a ação, o silêncio. A Sacerdotisa ensina que nem tudo se manifesta pela força — há um saber que mora no silêncio, na intuição, no que está oculto. O Louco aprende a escutar antes de agir.',                                  'mundo-material', 2),
(3,  'III',   'A Imperatriz',      'A abundância criativa e o feminino sagrado',           'O viajante descobre a fertilidade do mundo. A Imperatriz é a mãe de todas as formas — criatividade, nutrição, beleza e abundância. Aqui, o Louco aprende que criar é um ato de amor.',                                              'mundo-material', 3),
(4,  'IV',    'O Imperador',       'A estrutura e a autoridade necessárias',               'Toda criação precisa de forma. O Imperador traz ordem, limites e responsabilidade. O Louco aprende que liberdade sem estrutura é caos — e que liderar começa por governar a si mesmo.',                                             'mundo-material', 4),
(5,  'V',     'O Hierofante',      'O mestre da tradição e do sagrado',                    'O viajante encontra a tradição. O Hierofante é a ponte entre o divino e o humano — rituais, ensinamentos, valores compartilhados. O Louco aprende que pertencer a algo maior é parte do caminho.',                                  'mundo-material', 5),
(6,  'VI',    'Os Enamorados',     'A primeira escolha do coração',                        'Agora o Louco precisa escolher. Os Enamorados representam o momento em que valores, desejos e caminhos se cruzam. Não é apenas sobre amor romântico — é sobre alinhar a vida com o que é verdadeiro.',                              'mundo-material', 6),
(7,  'VII',   'O Carro',           'A determinação de seguir em frente',                   'Com a escolha feita, o Louco precisa de força para avançar. O Carro é a vontade em movimento, a determinação de superar obstáculos. Mas a vitória exige disciplinar forças opostas dentro de si.',                                 'mundo-interior', 0),
(8,  'VIII',  'A Justiça',         'O equilíbrio entre ação e consequência',               'Toda ação tem seu peso. A Justiça ensina que o universo responde com exatidão — e que ser justo consigo mesmo é tão importante quanto ser justo com os outros. O Louco aprende a responsabilidade kármica.',                       'mundo-interior', 1),
(9,  'IX',    'O Eremita',         'A busca solitária pela verdade interior',              'O viajante se recolhe. O Eremita é o momento em que o Louco precisa se afastar do mundo para encontrar sua própria luz. A lanterna ilumina apenas o próximo passo — e isso é suficiente.',                                          'mundo-interior', 2),
(10, 'X',     'A Roda da Fortuna', 'O ciclo inevitável da mudança',                        'Nada permanece. A Roda ensina que subidas e descidas fazem parte do percurso. O Louco compreende que não controla o destino — mas pode escolher como responder a cada giro.',                                                       'mundo-interior', 3),
(11, 'XI',    'A Força',           'A coragem gentil que domina o instinto',               'Não é força bruta — é a força da alma. O Louco descobre que domar seus medos e instintos exige compaixão, não violência. A mulher que acaricia o leão ensina que o poder verdadeiro é suave.',                                     'mundo-interior', 4),
(12, 'XII',   'O Enforcado',       'A rendição que transforma a perspectiva',              'O Louco precisa parar. O Enforcado é a inversão voluntária — soltar o controle, ver o mundo de cabeça para baixo. Nessa entrega, surge uma sabedoria que a ação jamais alcançaria.',                                                'travessia-sombria', 0),
(13, 'XIII',  'A Morte',           'O fim necessário para o renascimento',                 'Algo precisa morrer. A Morte não é destruição — é transformação profunda. O Louco aprende que segurar o que já passou impede o que precisa nascer. Soltar é o ato mais corajoso da jornada.',                                      'travessia-sombria', 1),
(14, 'XIV',   'A Temperança',      'A cura e o equilíbrio após a transformação',           'Após a morte simbólica, vem a cura. A Temperança mistura opostos com paciência — fogo e água, consciente e inconsciente. O Louco aprende que integração exige tempo, presença e fé no processo.',                                  'travessia-sombria', 2),
(15, 'XV',    'O Diabo',           'O confronto com as cadeias que criamos',               'O viajante encontra suas sombras. O Diabo revela os apegos, vícios e ilusões que nos prendem — mas a verdade perturbadora é que as correntes estão frouxas. O Louco pode se libertar a qualquer momento.',                         'travessia-sombria', 3),
(16, 'XVI',   'A Torre',           'A destruição do que era falso',                        'O raio cai. A Torre destrói estruturas construídas sobre mentiras, ego ou medo. É violento, é assustador — mas é necessário. O Louco aprende que só sobre ruínas verdadeiras se constrói algo autêntico.',                          'travessia-sombria', 4),
(17, 'XVII',  'A Estrela',         'A esperança que nasce após a destruição',              'Após a tempestade, a estrela brilha. A Estrela é a cura profunda, a fé restaurada, a vulnerabilidade como força. O Louco, nu e aberto, finalmente confia no fluxo da vida sem precisar de armaduras.',                              'iluminacao', 0),
(18, 'XVIII', 'A Lua',             'A travessia pelo inconsciente e seus medos',           'O caminho escurece. A Lua ilumina com luz difusa — revelando medos, ilusões e verdades que a razão esconde. O Louco precisa atravessar essa noite sem fugir, confiando na intuição como bússola.',                                   'iluminacao', 1),
(19, 'XIX',   'O Sol',             'A alegria essencial e a clareza reconquistada',        'A luz retorna em plenitude. O Sol é a alegria inocente, a vitalidade restaurada, a clareza após a confusão. O Louco redescobre a criança interior — aquela que celebra a vida sem condições.',                                     'iluminacao', 2),
(20, 'XX',    'O Julgamento',      'O chamado final da alma',                              'A trombeta soa. O Julgamento não é punição — é despertar. O Louco ouve o chamado de sua vocação mais profunda e decide responder. É o momento em que todas as experiências ganham sentido.',                                          'iluminacao', 3),
(21, 'XXI',   'O Mundo',           'A completude e o recomeço consciente',                 'O ciclo se completa. O Mundo é a dança da integração — o Louco que percorreu todos os estágios e agora celebra a totalidade de quem se tornou. Mas o fim é também um novo início: a espiral continua.',                              'iluminacao', 4);

-- ─── Seed: meta (singleton) ────────────────────────────────────────

INSERT INTO public.cms_journey_meta (
  intro_title, intro_subtitle, intro_epigraph, intro_body,
  closing_title, closing_body, closing_invitation
) VALUES (
  'A Jornada do Louco',
  'O percurso iniciático dos 22 Arcanos Maiores',
  'O Louco não é o início nem o fim — é a coragem de caminhar.',
  ARRAY[
    'Os 22 Arcanos Maiores do Tarô não são cartas soltas. São capítulos de uma única grande história — a história da consciência humana em busca de si mesma.',
    'Essa história começa com O Louco (0), o viajante inocente que dá um salto de fé no desconhecido, e termina com O Mundo (XXI), a integração plena de tudo o que foi vivido, aprendido e transformado.',
    'Entre o salto e a completude, há mestres, provas, espelhos, abismos e renascimentos. Cada arcano é um estágio dessa jornada — e cada estágio vive dentro de você.',
    'Estudar os Arcanos Maiores nessa sequência não é apenas aprender significados: é percorrer um mapa da alma.'
  ],
  'O Ciclo Continua',
  'A Jornada do Louco não é linear — é uma espiral. Cada vez que você a percorre, descobre camadas mais profundas. Os mesmos arcanos falam coisas diferentes em momentos diferentes da vida. O Louco que chega ao Mundo não é o mesmo que saltou do precipício — e, ainda assim, carrega a mesma centelha de coragem que o fez começar.',
  'Agora é a sua vez de caminhar.'
);