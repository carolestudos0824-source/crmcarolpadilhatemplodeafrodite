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
];
