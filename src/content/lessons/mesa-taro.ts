export interface MesaTaroLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
}

export const MESA_TARO_LESSONS: MesaTaroLesson[] = [
  {
    id: "mesa-1", order: 0, title: "A Estrutura da Mesa", subtitle: "O espaço onde a leitura acontece", icon: "🕯",
    content: `A mesa de tarô é mais do que uma superfície — é o **palco onde a leitura acontece**. Assim como um teatro precisa de cenário, iluminação e acústica, sua mesa precisa de elementos que favoreçam a presença e a leitura.

**Elementos essenciais:**

**1. Superfície limpa e ampla.** As cartas precisam de espaço. Uma tiragem de Cruz Celta usa 10 cartas — você precisa de pelo menos 60cm × 60cm.

**2. Pano de leitura.** Um tecido macio protege as cartas, delimita o espaço sagrado e cria uma base visual neutra. Cores recomendadas: preto (concentração), roxo (espiritualidade), branco (clareza), bordô (profundidade).

**3. Iluminação.** Luz suave e indireta. Uma vela complementa, mas não substitui a iluminação funcional — você precisa ver as cartas claramente.

**4. O baralho.** Sempre limpo, organizado, embrulhado em pano ou guardado em caixa dedicada.

**5. Caderno e caneta.** Para anotar a leitura. Anotar é parte do processo.

**Elementos opcionais mas poderosos:**
- Cristal (quartzo para clareza, ametista para intuição)
- Incenso leve (sálvia, alecrim, palo santo)
- Objeto pessoal de intenção (talismã, imagem, símbolo)

**A mesa comunica:** Para o consulente, a mesa diz "aqui é sério". Para você, diz "aqui eu entro em modo de leitura".`,
    keyPoints: ["Superfície limpa e ampla é o mínimo (60cm × 60cm)", "Pano de leitura protege cartas e delimita o espaço sagrado", "Iluminação suave + funcional: precisa ver as cartas", "Caderno e caneta fazem parte do processo de leitura"],
    deepDive: `A tradição de usar panos específicos para leitura de tarô remonta ao século XVIII. Na Golden Dawn, cores tinham correspondências precisas: preto para concentração e banimento, púrpura para espiritualidade e conexão com o divino, branco para clareza e purificação. O importante não é seguir regras rígidas, mas criar um espaço que comunique intenção.`,
    reflection: `Como é o seu espaço de leitura atual? Se não tem um, imagine: como seria o ambiente ideal para você se conectar com as cartas?`,
    exercise: { instruction: "Monte sua mesa de leitura com o que tem disponível. Tire uma foto. Identifique o que falta e o que já funciona.", type: "practice" },
    quiz: [
      { id: "mesa1-q1", question: "Qual é o tamanho mínimo recomendado para uma mesa de tarô?", options: ["30cm × 30cm", "60cm × 60cm", "1m × 1m", "O tamanho não importa"], correctIndex: 1, explanation: "Uma tiragem de Cruz Celta precisa de 10 cartas dispostas — 60cm × 60cm é o mínimo funcional." },
    ],
  },
  {
    id: "mesa-2", order: 1, title: "O que Usar e o que Evitar", subtitle: "Guia prático de materiais", icon: "✅",
    content: `**O que USAR:**

**Pano de leitura** — Algodão, seda ou veludo. Cores sóbrias. Lavável. Um pano dedicado exclusivamente ao tarô cria o hábito de "abrir o espaço".

**Baralho adequado** — Rider-Waite-Smith para estudo. Se trabalha com clientes, um baralho em bom estado, sem cartas dobradas ou manchadas.

**Caderno do tarô** — Dedicado apenas a leituras. Anote data, pergunta, cartas, interpretação. Com o tempo, vira sua bíblia pessoal.

**Bolsa ou caixa para o baralho** — Protege as cartas e marca a separação entre "o tarô guardado" e "o tarô em uso".

**O que EVITAR:**

**Mesa bagunçada** — Comida, celular, papéis de trabalho. A mesa de tarô é espaço limpo.

**Luz fria/fluorescente** — Quebra a atmosfera e cansa os olhos. Prefira luz quente.

**Excesso de objetos** — Cristais, velas, incensos, estátuas, quadros, plantas, pedras... A mesa pode virar um altar caótico. Menos é mais.

**Baralhos emprestados sem limpeza** — Se usar o baralho de alguém, limpe antes (embaralhe 7 vezes com intenção, passe por fumaça ou deixe ao luar).

**Música com letra** — Letras competem pela atenção. Se quiser som, use instrumental.`,
    keyPoints: ["Pano dedicado, baralho em bom estado, caderno exclusivo", "Evitar bagunça, luz fria, excesso de objetos", "Menos é mais — a mesa não é um altar caótico", "Baralhos emprestados devem ser limpos antes do uso"],
    deepDive: `A questão de quem pode tocar o baralho é uma das superstições mais persistentes do tarô. Na prática profissional moderna, muitos tarólogos pedem que o consulente embaralhe — isso cria envolvimento e conexão pessoal com a leitura. O que importa não é a "pureza energética" do baralho, mas a intenção e presença de quem o usa.`,
    reflection: `Você tem alguma superstição sobre seu baralho? Reflita: ela serve à sua prática ou a limita?`,
    exercise: { instruction: "Faça um inventário: o que você tem e o que falta? Liste 3 itens essenciais que precisa adquirir ou organizar.", type: "writing" },
    quiz: [
      { id: "mesa2-q1", question: "Por que evitar música com letra durante uma leitura?", options: ["É proibido no tarô", "Letras competem pela atenção verbal", "Música não combina com tarô", "Porque é tradição"], correctIndex: 1, explanation: "Letras competem pela atenção verbal, que você precisa para interpretar as cartas. Instrumental é preferível." },
    ],
  },
  {
    id: "mesa-3", order: 2, title: "Mesa para Estudo", subtitle: "Seu espaço de aprendizado pessoal", icon: "📖",
    content: `A mesa de estudo é diferente da mesa de atendimento. Aqui, o foco é **aprender**, não consultar.

**Como montar:**

**1. Boa iluminação.** Você vai precisar ver detalhes das cartas e anotar. Luz clara, natural se possível.

**2. Material de apoio acessível.** Este curso, livros, caderno, cartas. Tudo à mão.

**3. Uma carta de cada vez.** No estudo, não embaralhe — escolha a carta que vai estudar, coloque-a à frente e dedique 15-30 minutos a ela.

**4. Caderno aberto.** Anote observações, dúvidas, conexões. O estudo sem anotação se perde.

**Rotina de estudo sugerida:**
- 15 min de leitura da lição na plataforma
- 10 min observando a carta física (se tiver o baralho)
- 5 min anotando suas observações pessoais
- Quiz da lição

**Frequência ideal:** 3-4 sessões por semana de 30 minutos é mais eficaz do que uma sessão de 3 horas por mês. Regularidade supera intensidade.`,
    keyPoints: ["Mesa de estudo ≠ mesa de atendimento", "Boa iluminação, material acessível, uma carta por vez", "Anotar é essencial — estudo sem anotação se perde", "Regularidade (3-4×/semana, 30min) supera intensidade"],
    deepDive: `O método de estudar uma carta por vez — em vez de tentar absorver o baralho inteiro — reflete o princípio pedagógico do "espaçamento": a memória de longo prazo se forma melhor com sessões curtas e frequentes do que com maratonas. Estudar 1 carta por dia durante 78 dias é mais eficaz do que estudar 78 cartas em um fim de semana.`,
    reflection: `Como você estuda atualmente? Maratonas esporádicas ou sessões regulares? A resposta afeta diretamente a profundidade do seu aprendizado.`,
    exercise: { instruction: "Monte seu espaço de estudo. Estude uma carta por 30 minutos usando a rotina sugerida. Anote o que descobriu.", type: "practice" },
    quiz: [
      { id: "mesa3-q1", question: "O que é mais eficaz para o estudo do tarô?", options: ["Uma sessão longa por mês", "Estudar todas as cartas de uma vez", "3-4 sessões de 30 minutos por semana", "Estudar apenas quando sentir vontade"], correctIndex: 2, explanation: "Regularidade supera intensidade. 3-4 sessões curtas por semana são mais eficazes que sessões longas esporádicas." },
    ],
  },
  {
    id: "mesa-4", order: 3, title: "Mesa para Atendimento", subtitle: "Quando você lê para outras pessoas", icon: "👥",
    content: `Ler para outra pessoa exige um espaço diferente — que transmita **profissionalismo, acolhimento e respeito**.

**Princípios do espaço de atendimento:**

**1. Privacidade.** O consulente vai compartilhar questões íntimas. O espaço precisa garantir que ninguém ouça.

**2. Conforto.** Cadeiras confortáveis, temperatura agradável, sem pressa. O consulente precisa se sentir à vontade.

**3. Neutralidade visual.** Evite excesso de símbolos religiosos que possam intimidar ou afastar. O espaço deve ser acolhedor para qualquer pessoa.

**4. Posicionamento.** Sente-se de frente para o consulente, com a mesa entre vocês. As cartas devem ser visíveis para ambos.

**5. Água.** Ofereça um copo d'água. É hospitalidade básica e ajuda a criar confiança.

**6. Tempo definido.** Comunique no início: "Nossa sessão tem X minutos." Respeite o limite.

**Layout profissional da mesa:**
- Pano de leitura no centro
- Baralho à sua esquerda
- Caderno à sua direita
- Nada entre você e o consulente além das cartas
- Celulares desligados (dos dois)`,
    keyPoints: ["Privacidade, conforto e neutralidade visual são essenciais", "Cartas visíveis para ambos, frente a frente", "Ofereça água, defina tempo, desligue celulares", "O espaço deve ser acolhedor para qualquer pessoa"],
    deepDive: `O conceito de "neutralidade visual" no espaço de atendimento é especialmente importante num país religiosamente diverso como o Brasil. Um consulente evangélico pode se sentir desconfortável cercado de imagens de santos; um ateu pode se sentir alienado por excesso de misticismo. O espaço profissional deve acolher sem impor — o tarô é universal.`,
    reflection: `Quando você imagina seu espaço de atendimento ideal, quem é seu consulente? Que tipo de pessoa precisa se sentir acolhida ali?`,
    exercise: { instruction: "Simule um atendimento: convide alguém de confiança para uma leitura curta (3 cartas). Monte a mesa como profissional. Peça feedback sobre o ambiente.", type: "practice" },
    quiz: [
      { id: "mesa4-q1", question: "Por que evitar excesso de símbolos religiosos no espaço de atendimento?", options: ["Porque são proibidos", "Para manter neutralidade e acolher qualquer pessoa", "Porque atrapalham a leitura", "Porque não combinam com tarô"], correctIndex: 1, explanation: "Neutralidade visual garante que qualquer consulente — independente de crenças — se sinta acolhido." },
    ],
  },
  {
    id: "mesa-5", order: 4, title: "Cuidado com o Baralho", subtitle: "Como tratar suas cartas", icon: "🎴",
    content: `O baralho é sua ferramenta principal. Tratá-lo com cuidado não é superstição — é respeito pela ferramenta e pelo ofício.

**Cuidados básicos:**

**Armazenamento** — Guarde em pano, bolsa ou caixa dedicada. Longe de umidade e luz solar direta.

**Limpeza física** — Se as cartas ficarem sujas, limpe com pano levemente úmido. Cartas plastificadas duram mais.

**Limpeza energética** — Se você trabalha com esse conceito:
- Embaralhe 7 vezes com intenção de limpeza
- Passe pela fumaça de sálvia ou palo santo
- Deixe ao luar (especialmente lua cheia)
- Bata suavemente o monte na mesa 3 vezes

**Quando trocar de baralho:**
- Quando cartas estão danificadas (dobradas, rasgadas, desbotadas)
- Quando você sente que o baralho "não responde" mais
- Quando quer experimentar uma arte diferente

**Ter mais de um baralho** é normal e saudável. Muitos tarólogos têm um para estudo, um para uso pessoal e um para atendimento.

**Superstições a abandonar:**
- "Ninguém pode tocar seu baralho" — Se o consulente quer embaralhar, tudo bem.
- "Só funciona se foi presente" — Comprar seu próprio baralho é perfeitamente válido.
- "Cartas usadas têm energia ruim" — Baralhos de segunda mão são completamente utilizáveis após limpeza.`,
    keyPoints: ["Guardar em pano/caixa dedicada, longe de umidade e sol", "Limpeza energética: embaralhar com intenção, fumaça ou luar", "Ter mais de um baralho é normal (estudo, pessoal, atendimento)", "Abandonar superstições: qualquer pessoa pode tocar, pode comprar o próprio"],
    deepDive: `Na tradição, "limpar" o baralho entre leituras serve para marcar o fim de uma sessão e o início de outra — é uma fronteira psicológica. Algumas práticas de limpeza têm base na psicologia dos rituais: embaralhar 7 vezes é estatisticamente o mínimo para randomizar completamente um baralho de 78 cartas (pesquisa de Persi Diaconis, matemático de Stanford).`,
    reflection: `Qual é a sua relação com o seu baralho? Você o trata como ferramenta profissional ou como objeto sagrado? Ambas as atitudes são válidas — o importante é que haja respeito.`,
    exercise: { instruction: "Limpe seu baralho hoje (física e energeticamente). Guarde-o de forma adequada. Se não tem um baralho físico, pesquise opções de Rider-Waite-Smith para comprar.", type: "practice" },
    quiz: [
      { id: "mesa5-q1", question: "É verdade que ninguém pode tocar seu baralho?", options: ["Sim, é regra sagrada", "Não — é superstição. O consulente pode embaralhar se quiser", "Depende da tradição", "Só familiares podem"], correctIndex: 1, explanation: "É superstição. Se o consulente quer embaralhar, está tudo bem. O importante é a intenção, não a exclusividade." },
    ],
  },
  {
    id: "mesa-6", order: 5, title: "Rituais de Abertura e Fechamento", subtitle: "Criar e encerrar o espaço de leitura", icon: "🔮",
    content: `Rituais de abertura e fechamento são práticas que **marcam o início e o fim** do espaço de leitura. Não são obrigatórios, mas são extremamente úteis.

**Ritual de abertura (antes de ler):**
1. Limpe a mesa. Coloque o pano.
2. Acenda uma vela (se desejar).
3. Respire 3 vezes profundamente.
4. Declare sua intenção: "Que esta leitura traga clareza e verdade."
5. Embaralhe as cartas com presença.

**Ritual de fechamento (depois de ler):**
1. Recolha as cartas. Embaralhe novamente com intenção de limpeza.
2. Anote a leitura no caderno.
3. Apague a vela (se acendeu).
4. Guarde o baralho.
5. Se atendeu alguém: lave as mãos (simbólico — encerrar a energia do atendimento).

**Por que ritualizar:**
- Marca fronteira clara entre "vida normal" e "leitura".
- Ajuda o cérebro a entrar em modo de concentração.
- Cria rotina — e rotina gera profundidade.
- Para o consulente, o ritual comunica respeito e seriedade.

**O ritual é seu.** Não copie de livros — crie algo que faça sentido para você. O melhor ritual é aquele que você pratica, não o mais elaborado.`,
    keyPoints: ["Rituais marcam início e fim do espaço de leitura", "Abertura: limpar, respirar, declarar intenção, embaralhar", "Fechamento: recolher, anotar, guardar, encerrar", "O melhor ritual é aquele que você pratica — crie o seu"],
    deepDive: `O ritual de lavar as mãos após um atendimento aparece em diversas tradições de cura — do xamanismo indígena à medicina ocidental. No contexto do tarô, é um gesto de fronteira: marca o fim do espaço de leitura e o retorno à vida pessoal. Tarólogos que não criam essa fronteira frequentemente relatam "carregar" a energia dos atendimentos — não por razões místicas, mas por falta de separação psicológica.`,
    reflection: `Você tem um ritual de encerramento depois de ler tarô? Se não, crie um simples — pode ser lavar as mãos, respirar 3 vezes, ou simplesmente dizer "encerrado". A fronteira protege.`,
    exercise: { instruction: "Crie seus próprios rituais de abertura e fechamento. Pratique-os por 1 semana. Ajuste o que não funcionar.", type: "practice" },
    quiz: [
      { id: "mesa6-q1", question: "Por que lavar as mãos depois de um atendimento?", options: ["Higiene obrigatória", "Gesto simbólico de encerrar a energia do atendimento", "Tradição religiosa", "Para limpar a tinta das cartas"], correctIndex: 1, explanation: "Lavar as mãos é um gesto simbólico que marca o encerramento da energia do atendimento — separar a sessão da vida pessoal." },
    ],
  },
  {
    id: "mesa-7", order: 6, title: "A Mesa Portátil", subtitle: "Ler tarô fora do seu espaço habitual", icon: "🎒",
    content: `Nem sempre você lê em casa. Eventos, viagens, atendimentos externos, encontros em cafés ou na casa do consulente — sua mesa precisa ser **portátil sem perder identidade**.

**O kit mínimo portátil:**

**1. Pano de leitura dobrável.** Tecido que não amasse muito (algodão grosso, feltro, veludo curto). Tamanho 50cm × 50cm é suficiente.

**2. Baralho em estojo rígido.** Caixa de madeira, metal ou couro que proteja as cartas no transporte. Evite caixas de papelão originais — elas se desgastam.

**3. Caderno pequeno + caneta.** Moleskine ou similar. A caneta deve ser confiável — nada pior que ficar sem tinta no meio de uma anotação.

**4. Vela de viagem (opcional).** Vela LED a pilha é segura em qualquer ambiente — útil quando velas reais não são permitidas (hotéis, eventos corporativos).

**5. Lenço ou pano para improviso.** Para limpar a superfície antes de montar.

**Adaptações ao espaço alheio:**
- Chegue 15 minutos antes para reconhecer o ambiente.
- Identifique a melhor superfície disponível (mesa, bancada, chão com almofada).
- Posicione-se de costas para a parede sempre que possível — dá segurança psicológica.
- Negocie iluminação se a do local não for adequada (pedir abajur emprestado, mudar de cômodo).

**O que NÃO levar:**
- Excesso de objetos rituais que dependem do seu espaço.
- Múltiplos baralhos — escolha um e domine.
- Itens frágeis (cristais grandes, vela de cera derretível em local inadequado).

**Lembre:** sua presença é o elemento mais importante da mesa. O resto é apoio.`,
    keyPoints: ["Kit portátil: pano dobrável, baralho protegido, caderno, caneta", "Vela LED é alternativa segura em ambientes externos", "Chegar 15 min antes para reconhecer e adaptar o espaço", "Sua presença é o elemento essencial — o resto é apoio"],
    deepDive: `Tarólogos itinerantes da Idade Média carregavam baralhos enrolados em panos de seda dentro de bolsas de couro — o equivalente medieval do kit portátil moderno. A ideia de "espaço sagrado portátil" não é nova: é uma adaptação prática de quem precisa exercer o ofício onde a vida pede. Hoje, com eventos corporativos contratando tarólogos, feiras esotéricas e atendimentos a domicílio, dominar a mesa portátil é parte do repertório profissional.`,
    reflection: `Se alguém te chamasse para um atendimento externo amanhã, o que levaria? O exercício mental de montar o kit revela o que você considera essencial e o que é apenas hábito.`,
    exercise: { instruction: "Monte seu kit portátil. Faça uma leitura fora de casa (na casa de uma amiga, num café tranquilo). Note: o que funcionou? O que faltou?", type: "practice" },
    quiz: [
      { id: "mesa7-q1", question: "Qual é o elemento mais importante de uma mesa portátil?", options: ["Vela acesa", "Baralho raro", "Sua presença", "Cristais"], correctIndex: 2, explanation: "Sua presença é o elemento essencial. Todos os objetos são apoio — sem presença, nenhum kit funciona." },
    ],
  },
  {
    id: "mesa-8", order: 7, title: "A Mesa para Grupos", subtitle: "Quando você lê para mais de uma pessoa", icon: "👥",
    content: `Atendimentos em grupo (rodas de tarô, eventos, oficinas) exigem uma mesa pensada para **visibilidade coletiva e segurança individual**.

**Tipos de atendimento em grupo:**

**1. Roda de tarô.** Várias pessoas em círculo, cada uma recebe uma leitura curta (1-3 cartas) na frente das outras. Funciona para temas leves e iniciantes.

**2. Oficina prática.** Você ensina e os participantes praticam entre si. A mesa serve de demonstração, não de atendimento.

**3. Atendimentos paralelos em evento.** Várias pessoas aguardam, cada uma é atendida individualmente por 10-15 minutos. Cada sessão é privada, mas o ritmo é intenso.

**Princípios para mesa coletiva:**

**1. Visibilidade.** Todos precisam ver as cartas. Use uma mesa central elevada ou disponha as cartas na vertical (apoiadas em suporte) para grupos grandes.

**2. Privacidade modular.** Em rodas, combine antes: "Vamos falar sobre temas leves — relacionamento profundo ou crise pessoal pedem leitura individual depois." Isso protege quem está vulnerável.

**3. Tempo controlado.** Roda de tarô: 5-7 minutos por pessoa. Sem isso, vira maratona exaustiva.

**4. Materiais extras.** Em grupos, leve baralho reserva (caso alguém queira tocar), cadernos pequenos para os participantes anotarem, água disponível.

**Erros comuns em grupo:**
- Tocar temas íntimos diante de estranhos.
- Permitir que um participante domine o tempo.
- Ler como se fosse atendimento individual (não é — o foco e a intimidade são diferentes).
- Não preparar o ambiente para que todos se sintam acolhidos (não só o consulente da vez).`,
    keyPoints: ["3 formatos: roda, oficina, atendimentos paralelos — cada um pede mesa diferente", "Visibilidade coletiva + privacidade modular: combinar antes o que será tratado", "Tempo controlado (5-7 min/pessoa em roda)", "Atendimento em grupo ≠ atendimento individual: foco e intimidade diferem"],
    deepDive: `As rodas de tarô modernas têm raízes nos círculos de cura ancestrais — práticas em que a comunidade testemunha a passagem de cada membro. O testemunho coletivo tem poder terapêutico documentado (estudos sobre grupos de apoio mostram que ser ouvida em grupo amplifica o impacto da fala). Mas exige cuidado redobrado com vulnerabilidade: o que se diz no grupo permanece visível, ao contrário da sessão individual.`,
    reflection: `Você se sentiria à vontade liderando uma roda de tarô para 8 pessoas? Se a resposta for "não", o que falta — técnica, presença ou prática? Identificar o que falta é o primeiro passo.`,
    exercise: { instruction: "Convide 3-4 amigas para uma mini-roda de tarô. Tema leve (energia da semana, intenção do mês). Cada uma recebe 3 cartas em 5 minutos. Pratique o controle de tempo.", type: "practice" },
    quiz: [
      { id: "mesa8-q1", question: "Qual é a duração ideal de uma leitura por pessoa numa roda de tarô?", options: ["1-2 minutos", "5-7 minutos", "20-30 minutos", "Sem limite"], correctIndex: 1, explanation: "5-7 minutos por pessoa mantém o ritmo da roda viva sem virar maratona exaustiva para você ou para o grupo." },
    ],
  },
  {
    id: "mesa-9", order: 8, title: "A Mesa Online", subtitle: "Adaptar a mesa física para a videochamada", icon: "💻",
    content: `Atender online não é "atender pior" — é atender diferente. A mesa online tem suas próprias regras, e quem domina essas regras entrega leituras tão boas (ou melhores) que as presenciais.

**Setup técnico essencial:**

**1. Câmera dedicada.** Webcam externa ou celular em tripé. Câmera de notebook geralmente fica baixa demais.

**2. Posicionamento da câmera.** Na altura dos seus olhos, mostrando rosto E cartas. Teste antes: o consulente deve ver as duas coisas sem você precisar inclinar a tela.

**3. Iluminação frontal.** Luz natural de janela à frente, ou ring light. Nunca janela atrás (vira silhueta).

**4. Microfone separado.** Microfone de lapela ou headset elimina ruído ambiente. Áudio ruim cansa mais que vídeo ruim.

**5. Internet estável.** Cabo de rede sempre que possível. Wifi cai no meio da leitura — é constrangedor.

**Setup visual:**

**1. Fundo neutro.** Parede limpa, livros organizados, ou tecido suspenso. Evite cama desfeita, cozinha ou bagunça.

**2. Mesa enquadrada.** O pano de leitura precisa caber no enquadramento. Pano menor (40cm × 40cm) funciona melhor que pano grande.

**3. Cartas grandes ou viradas para a câmera.** Cartas pequenas ficam ilegíveis na tela. Use baralho de tamanho padrão e mostre cada carta de perto quando interpretar.

**Adaptações na condução:**
- Vá mais devagar — a conexão digital exige mais atenção.
- Narre o que está fazendo: "Agora vou embaralhar", "Essa é a carta da posição central".
- Pause depois de cada interpretação: "Isso ressoa com você?"
- Após a sessão, envie foto das cartas + resumo escrito por WhatsApp ou e-mail.

**Vantagens do atendimento online:**
- Alcance geográfico ilimitado.
- Sem deslocamento (você ou consulente).
- Gravação opcional (com consentimento).
- Custos operacionais menores.`,
    keyPoints: ["Câmera externa na altura dos olhos, iluminação frontal, microfone dedicado", "Fundo neutro + mesa enquadrada (pano menor funciona melhor)", "Mostrar cartas de perto, narrar ações, ir mais devagar", "Após sessão: enviar foto das cartas + resumo por escrito"],
    deepDive: `A pandemia de 2020 acelerou a profissionalização do atendimento online em todas as áreas — incluindo o tarô. Estudos sobre videoterapia mostram que a eficácia clínica é equivalente à presencial quando o setup é bem planejado. O mesmo se aplica ao tarô: o que muda é o canal, não a profundidade. Tarólogos que dominam o online relatam expansão real de público — alcançam clientes em outras cidades, países e fusos horários.`,
    reflection: `Se você precisasse atender online amanhã, seu setup estaria pronto? O que faltaria? Listar o que falta é o primeiro passo para construir.`,
    exercise: { instruction: "Faça uma chamada de teste com alguém de confiança. Posicione câmera, teste iluminação, mostre cartas. Peça feedback sobre imagem, áudio e clareza visual.", type: "practice" },
    quiz: [
      { id: "mesa9-q1", question: "Por que evitar luz vinda da janela atrás de você na videochamada?", options: ["Atrai energia ruim", "Vira silhueta — você fica escura no vídeo", "Cansa os olhos do consulente", "É proibido nas plataformas"], correctIndex: 1, explanation: "Luz atrás vira silhueta — sua imagem fica escura. A luz frontal (janela ou ring light na sua frente) ilumina o rosto adequadamente." },
    ],
  },
  {
    id: "mesa-10", order: 9, title: "Manutenção e Renovação da Mesa", subtitle: "A mesa viva: o que muda com o tempo", icon: "🔄",
    content: `Sua mesa não é um setup fixo — ela **evolui com você**. Tarólogas iniciantes tendem a querer "a mesa perfeita" e congelar o setup. Tarólogas experientes sabem que a mesa é viva.

**O que muda naturalmente com o tempo:**

**1. O baralho.** Você pode começar com Rider-Waite-Smith e, anos depois, descobrir Marselha, Thoth ou edições contemporâneas. Cada baralho amplia sua linguagem.

**2. O pano.** Pode trocar de cor conforme sua fase. Bordô para profundidade emocional, branco para fase de clareza, preto para foco e proteção.

**3. Os objetos auxiliares.** Cristais, velas, incensos vão e vêm. Algumas práticas se mantêm por anos; outras passam.

**4. O caderno.** Cadernos de leitura se acumulam. Guarde os antigos — relê-los anos depois é uma das experiências mais reveladoras do percurso.

**Sinais de que a mesa precisa renovação:**
- Você não sente mais conexão ao montar.
- O ritual virou automático e perdeu significado.
- Mudou de fase pessoal e o setup não acompanha (ex.: virou mãe, mudou de cidade, mudou o tipo de consulente).
- Está cansada do pano, do baralho, da disposição.

**Como renovar sem perder identidade:**
1. Mude um elemento por vez (não refaça tudo).
2. Teste por 30 dias antes de decidir se vale a pena.
3. Mantenha o que funciona — só substitua o que não comunica mais.
4. Documente: tire foto da mesa atual antes de mudar. Permite voltar se a renovação não funcionar.

**A mesa como espelho:** A forma como sua mesa muda ao longo dos anos reflete sua jornada como leitora. Olhar fotos antigas da própria mesa é como olhar fotos antigas de si mesma — você reconhece quem era, e percebe quem se tornou.`,
    keyPoints: ["A mesa evolui — baralho, pano, objetos, caderno mudam com o tempo", "Sinais de renovação: perda de conexão, ritual automático, mudança de fase", "Renovar um elemento por vez, testar 30 dias, documentar antes", "A mesa é espelho da jornada — releia cadernos antigos para ver quem você era"],
    deepDive: `O conceito de "praxis viva" — prática que evolui em vez de se cristalizar — vem das tradições contemplativas orientais (zen, sufismo). Aplicado ao tarô, significa que a mesa é menos um altar fixo e mais um organismo. Tarólogas com 20+ anos de prática frequentemente dizem que sua mesa atual é irreconhecível em relação à dos primeiros anos — e isso é sinal de saúde, não de inconstância. O que se mantém é a essência (presença, intenção, ética); o que muda é a forma.`,
    reflection: `Olhe sua mesa atual (real ou imaginária). Que elemento você ama profundamente? Qual está ali só por hábito? A resposta honesta orienta a próxima renovação.`,
    exercise: { instruction: "Tire uma foto da sua mesa atual. Daqui a 6 meses, tire outra. Compare: o que mudou? O que se manteve? O que isso revela sobre você?", type: "practice" },
    quiz: [
      { id: "mesa10-q1", question: "Qual é o melhor sinal de uma mesa saudável ao longo dos anos?", options: ["Ela permanece idêntica desde o início", "Ela evolui acompanhando suas fases", "Ela tem cada vez mais objetos", "Ela é igual à mesa de outras tarólogas"], correctIndex: 1, explanation: "Uma mesa saudável evolui com você. Mantém a essência (presença, intenção, ética) e adapta a forma conforme suas fases." },
    ],
  },
];
