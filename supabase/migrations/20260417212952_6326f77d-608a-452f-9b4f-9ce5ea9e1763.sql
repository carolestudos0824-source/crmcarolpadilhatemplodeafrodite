-- ─── Tabelas ───────────────────────────────────────────────────────

CREATE TABLE public.cms_symbol_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '◎',
  description text,
  order_index integer NOT NULL DEFAULT 0,
  status public.module_status NOT NULL DEFAULT 'published',
  tier public.module_tier NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

CREATE TABLE public.cms_symbols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category_slug text NOT NULL REFERENCES public.cms_symbol_categories(slug) ON UPDATE CASCADE,
  name text NOT NULL,
  explanation text NOT NULL,
  readings text[] NOT NULL DEFAULT '{}',
  cards text[] NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  status public.module_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cms_symbols_category ON public.cms_symbols(category_slug);

-- ─── Triggers updated_at ───────────────────────────────────────────

CREATE TRIGGER trg_cms_symbol_categories_updated
  BEFORE UPDATE ON public.cms_symbol_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_cms_symbols_updated
  BEFORE UPDATE ON public.cms_symbols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── RLS ───────────────────────────────────────────────────────────

ALTER TABLE public.cms_symbol_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_symbols           ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published symbol categories"
  ON public.cms_symbol_categories FOR SELECT TO authenticated
  USING (status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage symbol categories"
  ON public.cms_symbol_categories FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view symbols of published categories"
  ON public.cms_symbols FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.cms_symbol_categories c
    WHERE c.slug = cms_symbols.category_slug
      AND (c.status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role))
  ) AND (status = 'published'::module_status OR has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Admins manage symbols"
  ON public.cms_symbols FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ─── Seed: categorias ──────────────────────────────────────────────

INSERT INTO public.cms_symbol_categories (slug, order_index, name, icon, description) VALUES
('luas',       0,  'Luas',                    '☽',  'Ciclos, intuição, feminino e inconsciente'),
('sois',       1,  'Sóis',                    '☀',  'Consciência, vitalidade, verdade e clareza'),
('aguas',      2,  'Águas',                   '💧', 'Emoções, inconsciente, fluidez e purificação'),
('flores',     3,  'Flores',                  '🌹', 'Beleza, crescimento, amor e impermanência'),
('montanhas',  4,  'Montanhas',               '⛰',  'Desafios, conquistas, elevação e permanência'),
('animais',    5,  'Animais',                 '🐾', 'Instintos, guias interiores e forças naturais'),
('cores',      6,  'Cores',                   '🎨', 'Vibração energética, emoções e estados de consciência'),
('vestes',     7,  'Vestes',                  '👘', 'Identidade, papel social e estado interior'),
('objetos',    8,  'Objetos',                 '⚱️', 'Ferramentas, poder e instrumentos de transformação'),
('astrologia', 9,  'Elementos Astrológicos',  '♈',  'Planetas, signos e correspondências celestes'),
('numeros',    10, 'Números',                 '🔢', 'Numerologia sagrada e significados ocultos'),
('gestos',     11, 'Gestos e Posturas',       '🤲', 'Linguagem corporal simbólica e posições rituais');

-- ─── Seed: símbolos ────────────────────────────────────────────────

INSERT INTO public.cms_symbols (slug, category_slug, order_index, name, explanation, readings, cards) VALUES
-- Luas
('lua-crescente',   'luas', 0, 'Lua Crescente', 'Representa o crescimento, a intuição em desenvolvimento e o potencial que ainda não se manifestou por completo. É a fase de gestação — ideias, sentimentos e projetos que estão amadurecendo no silêncio.', ARRAY['Algo está crescendo internamente','Confie no processo — ainda não é hora de revelar','Intuição em expansão'], ARRAY['A Sacerdotisa','A Lua']),
('lua-cheia',       'luas', 1, 'Lua Cheia', 'Plenitude emocional, revelação e iluminação do inconsciente. O que estava oculto agora se mostra. É o ápice de um ciclo, onde verdades emergem e emoções transbordam.', ARRAY['Momento de clareza emocional','Revelação importante','Culminação de um processo'], ARRAY['A Lua','A Estrela']),
('lua-minguante',   'luas', 2, 'Lua Minguante', 'Fase de soltar, liberar e desapegar. O que já cumpriu seu ciclo precisa ser deixado para trás. É o convite para o recolhimento consciente.', ARRAY['Hora de soltar o que não serve mais','Período de introspecção','Encerramento de ciclos'], ARRAY['A Morte','O Eremita']),
-- Sóis
('sol-radiante',    'sois', 0, 'Sol Radiante', 'Consciência plena, alegria genuína e vitalidade. O sol ilumina sem distinção — representa a verdade que não se esconde e a energia vital que sustenta toda a criação.', ARRAY['Momento de clareza e otimismo','Sucesso visível e merecido','Energia vital em alta'], ARRAY['O Sol','O Louco']),
('sol-nascente',    'sois', 1, 'Sol Nascente', 'Novos começos iluminados pela consciência. O amanhecer simboliza esperança renovada, o fim de um período obscuro e o início de uma nova fase com mais clareza.', ARRAY['Um novo começo se anuncia','Esperança após período difícil','Despertar espiritual'], ARRAY['O Julgamento','A Estrela']),
-- Águas
('rio',             'aguas', 0, 'Rio ou Corrente', 'O fluxo contínuo das emoções e do tempo. Rios representam o caminho natural da vida, a necessidade de fluir sem resistência e a jornada que segue independente da nossa vontade.', ARRAY['Deixe as coisas fluírem','Não resista ao curso natural','Emoções em movimento'], ARRAY['A Temperança','A Estrela','A Imperatriz']),
('mar',             'aguas', 1, 'Mar ou Oceano', 'O vasto inconsciente coletivo, as emoções profundas e primordiais. O mar pode ser calmo (paz interior) ou tempestuoso (emoções avassaladoras).', ARRAY['Emoções profundas e intensas','Conexão com o inconsciente coletivo','Mergulho interior necessário'], ARRAY['A Lua','Dois de Copas']),
('chuva',           'aguas', 2, 'Chuva', 'Purificação emocional, lágrimas que limpam e renovação. A chuva fertiliza a terra, assim como as emoções processadas nutrem o crescimento pessoal.', ARRAY['Período de limpeza emocional','Lágrimas que curam','Renovação após tristeza'], ARRAY['A Temperança','Cinco de Copas']),
-- Flores
('rosa-vermelha',   'flores', 0, 'Rosa Vermelha', 'Paixão, desejo e amor terreno. A rosa vermelha é o símbolo universal do amor romântico, mas também carrega os espinhos — lembrando que o amor verdadeiro envolve risco e vulnerabilidade.', ARRAY['Paixão intensa','Amor com profundidade','Desejo que deve ser honrado'], ARRAY['O Mago','A Imperatriz']),
('rosa-branca',     'flores', 1, 'Rosa Branca', 'Pureza de intenção, inocência espiritual e amor incondicional. Diferente da rosa vermelha, a branca transcende o desejo — é o amor que não pede nada em troca.', ARRAY['Pureza de intenções','Amor espiritual','Inocência protegida'], ARRAY['O Louco','A Morte']),
('lirio',           'flores', 2, 'Lírio', 'Pureza espiritual, conexão com o divino e transcendência. O lírio cresce na lama e floresce na superfície — símbolo de que a beleza espiritual pode nascer das experiências mais difíceis.', ARRAY['Crescimento espiritual','Beleza que nasce da dificuldade','Conexão com o sagrado'], ARRAY['O Mago','A Temperança']),
-- Montanhas
('montanha-nevada', 'montanhas', 0, 'Montanha Nevada', 'Desafios elevados, conquistas espirituais e a frieza do isolamento necessário. O pico nevado representa tanto a meta mais alta quanto o custo de alcançá-la — solidão, esforço e perseverança.', ARRAY['Grande desafio à frente','Conquista que exige sacrifício','Solidão como parte do caminho'], ARRAY['O Eremita','O Louco']),
('colina',          'montanhas', 1, 'Colina ou Morro', 'Desafios menores, perspectiva elevada e progresso gradual. Diferente da montanha, a colina é acessível — representa os obstáculos do cotidiano que, uma vez superados, oferecem nova visão.', ARRAY['Progresso constante','Obstáculo superável','Nova perspectiva a caminho'], ARRAY['O Carro','Seis de Espadas']),
-- Animais
('cachorro',        'animais', 0, 'Cachorro', 'Lealdade, instinto protetor e companheirismo. O cachorro é o guia fiel que alerta sobre perigos sem julgar — representa a intuição animal, a parte nossa que sente antes de pensar.', ARRAY['Confie em seus instintos','Lealdade presente','Alerta intuitivo'], ARRAY['O Louco','A Lua']),
('leao',            'animais', 1, 'Leão', 'Força interior, coragem e domínio sobre os instintos. O leão não é apenas poder bruto — é o poder domesticado pela compaixão, a força que se expressa com gentileza.', ARRAY['Coragem para enfrentar','Força interior subestimada','Domínio compassivo'], ARRAY['A Força']),
('aguia',           'animais', 2, 'Águia', 'Visão elevada, liberdade e conexão com o divino. A águia voa acima de tudo — vê o quadro completo, sem se perder nos detalhes do chão.', ARRAY['Visão ampla necessária','Liberdade espiritual','Elevar a perspectiva'], ARRAY['O Mundo','A Roda da Fortuna']),
-- Cores
('dourado',         'cores', 0, 'Dourado / Ouro', 'Sabedoria divina, iluminação, valor espiritual e realização. O ouro não enferruja — representa o que é eterno e incorruptível na alma.', ARRAY['Sabedoria conquistada','Valor real e duradouro','Conexão com o divino'], ARRAY['O Sol','O Imperador','A Roda da Fortuna']),
('vermelho',        'cores', 1, 'Vermelho', 'Paixão, força vital, ação e desejo. O vermelho é a cor do sangue e do fogo — energia pura que tanto cria quanto destrói.', ARRAY['Paixão intensa','Energia para agir','Atenção ao excesso'], ARRAY['O Imperador','A Força','A Torre']),
('azul',            'cores', 2, 'Azul', 'Espiritualidade, calma, verdade e comunicação. O azul do céu e do mar conecta o visível ao infinito — é a cor da meditação e da fé.', ARRAY['Paz interior','Comunicação verdadeira','Conexão espiritual'], ARRAY['A Sacerdotisa','O Eremita']),
('branco',          'cores', 3, 'Branco', 'Pureza, potencial ilimitado e início. O branco contém todas as cores — é a tela em branco, o espaço de possibilidade antes de qualquer manifestação.', ARRAY['Novo começo puro','Potencial não manifestado','Inocência espiritual'], ARRAY['O Louco','A Temperança']),
-- Vestes
('manto-azul',      'vestes', 0, 'Manto Azul', 'Sabedoria espiritual, proteção divina e conhecimento oculto. O manto azul reveste quem guarda verdades profundas — é a veste do sacerdote interior.', ARRAY['Sabedoria protegida','Conhecimento que não se exibe','Espiritualidade ativa'], ARRAY['A Sacerdotisa','O Eremita']),
('armadura',        'vestes', 1, 'Armadura', 'Proteção, defesa e preparação para conflitos. A armadura pode ser necessária ou excessiva — depende se o perigo é real ou imaginário.', ARRAY['Proteção necessária','Defesas emocionais ativas','Questione se a armadura ainda serve'], ARRAY['O Carro','O Imperador']),
('nudez',           'vestes', 2, 'Nudez', 'Vulnerabilidade, autenticidade e liberdade. Estar nu nas cartas é estar sem máscaras — é a verdade crua, a aceitação total de si.', ARRAY['Autenticidade radical','Vulnerabilidade como força','Liberdade das convenções'], ARRAY['O Sol','A Estrela','O Julgamento']),
-- Objetos
('varinha',         'objetos', 0, 'Varinha / Bastão', 'Vontade direcionada, poder criativo e canal de energia. A varinha é a extensão da intenção — transforma pensamento em ação, desejo em realidade.', ARRAY['Poder de manifestar','Intenção clara e focada','Energia criativa disponível'], ARRAY['O Mago','O Mundo']),
('calice',          'objetos', 1, 'Cálice / Taça', 'Receptividade emocional, amor e o feminino sagrado. O cálice recebe sem forçar — é a capacidade de acolher emoções, experiências e graça.', ARRAY['Abra-se para receber','Emoções precisam de espaço','Amor como receptividade'], ARRAY['A Temperança','A Estrela','O Mago']),
('espada',          'objetos', 2, 'Espada', 'Verdade, discernimento e poder mental. A espada corta — ilusões, mentiras e confusões. É o instrumento da clareza, mas também pode ferir.', ARRAY['Verdade precisa ser dita','Decisão mental necessária','Cuidado com a crueldade da razão'], ARRAY['A Justiça','O Mago']),
('chave',           'objetos', 3, 'Chave', 'Conhecimento que abre portas, revelação e acesso ao oculto. A chave é o símbolo do poder de desvendar mistérios e acessar novos níveis de compreensão.', ARRAY['Solução está ao seu alcance','Conhecimento que liberta','Acesso a novas dimensões'], ARRAY['O Hierofante','A Sacerdotisa']),
-- Astrologia
('lemniscata',          'astrologia', 0, 'Lemniscata (∞)', 'Infinito, eternidade e ciclo perpétuo de criação. O símbolo do infinito aparece sobre a cabeça daqueles que dominam os ciclos — não como prisioneiros, mas como mestres.', ARRAY['Domínio sobre os ciclos','Consciência eterna','Poder que se renova'], ARRAY['O Mago','A Força']),
('estrela-seis-pontas', 'astrologia', 1, 'Estrela de Seis Pontas', 'União dos opostos, equilíbrio entre espírito e matéria. Os dois triângulos entrelaçados — um apontando para cima (espírito) e outro para baixo (matéria) — representam a integração total.', ARRAY['Equilíbrio entre mundos','Integração de opostos','Harmonia alcançada'], ARRAY['Os Enamorados','A Temperança']),
('zodiac',              'astrologia', 2, 'Roda Zodiacal', 'Os 12 signos como fases da experiência humana. A roda zodiacal no Tarô aparece como lembrete de que tudo é cíclico e que cada fase tem seu propósito.', ARRAY['Ciclos naturais em ação','Cada fase tem seu tempo','Padrão cósmico revelado'], ARRAY['A Roda da Fortuna','O Mundo']),
-- Números
('zero',  'numeros', 0, 'Zero (0)', 'O vazio fértil, o potencial puro, o ponto antes de toda manifestação. O zero não é ausência — é plenitude em estado latente, o útero cósmico.', ARRAY['Potencial ilimitado','Momento antes da criação','Liberdade total'], ARRAY['O Louco']),
('um',    'numeros', 1, 'Um (I)',   'Início, unidade, vontade e individualidade. O número um é a primeira manifestação — o ponto que gera a linha, a semente que contém a árvore inteira.', ARRAY['Novo começo consciente','Foco e determinação','Poder individual'], ARRAY['O Mago']),
('dois',  'numeros', 2, 'Dois (II)','Dualidade, polaridade, escolha e receptividade. O dois é o espelho — o momento em que a consciência se percebe refletida e precisa integrar os opostos.', ARRAY['Escolha entre caminhos','Equilíbrio de polaridades','Receptividade necessária'], ARRAY['A Sacerdotisa','Os Enamorados']),
('tres',  'numeros', 3, 'Três (III)','Criação, expressão, síntese e abundância. O três é o filho da dualidade — quando dois opostos se encontram, nasce algo novo. É a criatividade pura.', ARRAY['Criatividade em fluxo','Expressão necessária','Abundância chegando'], ARRAY['A Imperatriz']),
-- Gestos
('mao-erguida',     'gestos', 0, 'Mão Erguida ao Céu',          'Canal entre o divino e o humano, invocação e recepção de energia cósmica. A mão que aponta para cima busca orientação, sabedoria e poder do alto.', ARRAY['Conexão com o divino ativa','Invocação de forças superiores','Abertura para receber'], ARRAY['O Mago','O Hierofante']),
('mao-abaixada',    'gestos', 1, 'Mão Apontando para Baixo',    'Manifestação, ancoragem e transmissão de energia do alto para a terra. Complemento da mão erguida — é o gesto de ''como acima, assim abaixo''.', ARRAY['Manifestar o que recebeu','Ancorar no material','Trazer o espiritual para o concreto'], ARRAY['O Mago']),
('olhos-fechados',  'gestos', 2, 'Olhos Fechados',              'Introspecção, meditação e confiança no mundo interior. Fechar os olhos é abrir a visão interna — escolher ver com a alma em vez de com a mente.', ARRAY['Momento de introspecção','Confie na visão interior','Pare de buscar fora'], ARRAY['A Sacerdotisa','O Eremita']),
('sentada',         'gestos', 3, 'Postura Sentada / Trono',     'Autoridade, estabilidade, domínio e presença. Quem senta não precisa se mover para provar poder — a presença basta.', ARRAY['Estabilidade conquistada','Autoridade natural','Poder que não precisa gritar'], ARRAY['A Sacerdotisa','A Imperatriz','O Imperador','A Justiça']);