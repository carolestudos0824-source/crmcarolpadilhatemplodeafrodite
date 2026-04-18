export interface AmorLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
  deepDive?: string;
  reflection?: string;
  caseStudy?: AmorCaseStudy;
  loveCombs?: AmorCombination[];
  exercise: {
    instruction: string;
    type: "reflection" | "practice" | "observation" | "writing";
  };
  quiz: AmorQuizQuestion[];
}

export interface AmorCaseStudy {
  title: string;
  context: string;
  cards: { position: string; card: string }[];
  analysis: string;
  lesson: string;
}

export interface AmorCombination {
  cards: string[];
  meaning: string;
  warning?: string;
}

export interface AmorQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AMOR_LESSONS: AmorLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 1 — A dinâmica afetiva no tarô
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-1",
    order: 0,
    title: "A Dinâmica Afetiva no Tarô",
    subtitle: "Como o tarô lê relações — sem romantizar nem distorcer",
    icon: "💞",
    content: `Amor é o tema mais pedido em leituras de tarô. E também o mais distorcido. Muitas leitoras — e muitas consulentes — projetam desejos nas cartas e transformam o tarô num oráculo de confirmação: "Ele vai voltar? Ela me ama? Vai dar certo?"

Este módulo não ensina a dizer o que a consulente quer ouvir. Ensina a **ler dinâmicas afetivas com honestidade, profundidade e responsabilidade**.

**O tarô não lê a mente de outra pessoa.** Ele lê a **energia da dinâmica** — o campo relacional entre as pessoas envolvidas. Quando uma consulente pergunta "O que ele sente por mim?", o tarô responde com a energia que circula entre os dois — não com os pensamentos exatos da outra pessoa.

**3 Princípios da Leitura Amorosa:**

**1. Centralidade na consulente.** A leitura é sobre ela — não sobre o outro. Mesmo perguntas sobre "ele" devem ser redirecionadas: "O que eu preciso saber sobre essa dinâmica?"

**2. Energia, não evento.** "Vai dar certo?" não é uma boa pergunta. "Que energia sustenta essa relação?" é. O tarô mostra padrões, não desfechos fixos.

**3. Responsabilidade com o símbolo.** A Imperatriz numa leitura de amor não significa automaticamente "gravidez". O Diabo não significa "traição". Cada carta mantém sua riqueza simbólica — não se reduz a clichês amorosos.

**O perigo da leitura de confirmação:** Quando a consulente quer desesperadamente ouvir que "vai dar certo", qualquer carta pode ser distorcida para confirmar. Uma boa leitora resiste a essa pressão — com gentileza, mas com verdade.`,
    keyPoints: [
      "O tarô lê a energia da dinâmica, não a mente de outra pessoa",
      "Centralidade na consulente — a leitura é sobre ela",
      "Energia, não evento — padrões, não desfechos fixos",
      "Cada carta mantém sua riqueza simbólica no contexto amoroso",
      "Resistir à leitura de confirmação — gentileza com verdade",
    ],
    deepDive: `A projeção é o conceito psicológico mais importante para leituras amorosas. Na psicologia junguiana, projeção é quando atribuímos a outra pessoa qualidades que existem em nós — positivas ou negativas.

Numa leitura de amor, a projeção opera em dois níveis:
1. **A consulente projeta** — ela vê no outro o que quer ver (ou teme ver)
2. **A leitora projeta** — se não estiver atenta, a leitora projeta suas próprias experiências afetivas na leitura

O conceito de **anima/animus** (Jung) é central: cada pessoa carrega uma imagem interior do parceiro ideal. Quando nos apaixonamos, frequentemente estamos vendo essa imagem projetada — não a pessoa real. O tarô pode ajudar a distinguir entre projeção e percepção.

Na tradição esotérica, o amor é visto como uma força que opera em múltiplos planos:
- **Físico** (atração, desejo) — Ouros e Paus
- **Emocional** (vínculo, cuidado) — Copas
- **Mental** (compatibilidade, comunicação) — Espadas
- **Espiritual** (destino, karma, crescimento) — Arcanos Maiores

Uma leitura amorosa completa examina todos esses planos — não apenas o emocional.`,
    reflection: "Pense na sua última pergunta sobre amor ao tarô. Você estava buscando verdade ou confirmação? Se pudesse refazer a pergunta agora, como a formularia?",
    exercise: {
      instruction: "Escreva 5 perguntas sobre amor que você já fez ou gostaria de fazer ao tarô. Reescreva cada uma seguindo os 3 princípios: centralize na consulente, busque energia (não evento), e mantenha respeito pelo símbolo. Compare as versões original e revisada.",
      type: "writing",
    },
    quiz: [
      {
        id: "amor-1-q1",
        question: "Quando uma consulente pergunta 'O que ele sente por mim?', o tarô responde com:",
        options: ["Os pensamentos exatos da outra pessoa", "A energia da dinâmica entre os dois", "Uma previsão do futuro", "O que a consulente quer ouvir"],
        correctIndex: 1,
        explanation: "O tarô lê a energia do campo relacional — não a mente de outra pessoa.",
      },
      {
        id: "amor-1-q2",
        question: "O Diabo numa leitura amorosa significa automaticamente 'traição'?",
        options: ["Sim, sempre", "Não — cada carta mantém sua riqueza simbólica e não se reduz a clichês", "Depende do baralho", "Só se estiver invertida"],
        correctIndex: 1,
        explanation: "O Diabo pode indicar dependência, paixão intensa, padrão obsessivo — não apenas traição.",
      },
      {
        id: "amor-1-q3",
        question: "A 'leitura de confirmação' é perigosa porque:",
        options: ["Demora muito", "Distorce qualquer carta para confirmar o que a consulente quer ouvir", "É complicada", "Usa muitas cartas"],
        correctIndex: 1,
        explanation: "Quando queremos ouvir algo específico, qualquer carta pode ser distorcida — isso não é leitura, é projeção.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 2 — Pensamentos, sentimentos e intenções
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-2",
    order: 1,
    title: "Pensamentos, Sentimentos e Intenções",
    subtitle: "As três camadas da energia afetiva",
    icon: "🧠",
    content: `Toda relação opera em três camadas simultâneas: o que a pessoa **pensa**, o que **sente** e o que **pretende fazer**. Essas três camadas nem sempre estão alinhadas — e é exatamente esse desalinhamento que cria a complexidade dos relacionamentos.

**Como o tarô revela cada camada:**

**Pensamentos (Espadas):**
O que a pessoa pensa sobre a relação. Cálculos, análises, julgamentos, dúvidas. Espadas no contexto amoroso revelam a narrativa mental — o que a mente diz sobre o coração.
- Ás de Espadas = clareza sobre o que quer
- 7 de Espadas = pensamentos ocultos, estratégia
- Rainha de Espadas = distanciamento emocional consciente

**Sentimentos (Copas):**
O que a pessoa sente de verdade — às vezes em contradição com o que pensa. Copas revelam o estado emocional profundo.
- Ás de Copas = novo sentimento genuíno
- 5 de Copas = luto por algo perdido na relação
- Cavaleiro de Copas = romantismo e idealização

**Intenções (Paus + Ouros):**
O que a pessoa pretende fazer — ação e compromisso. Paus = impulso e desejo de agir. Ouros = compromisso concreto e investimento real.
- Ás de Paus = desejo de iniciar algo
- 4 de Ouros = retenção, não quer se comprometer
- Cavaleiro de Paus = ação impulsiva, paixão em movimento

**A Tiragem das 3 Camadas:**
Posição 1 = O que pensa | Posição 2 = O que sente | Posição 3 = O que pretende
Compare: as três estão alinhadas? Se não — o desalinhamento É a mensagem.`,
    keyPoints: [
      "3 camadas: Pensamentos (Espadas), Sentimentos (Copas), Intenções (Paus/Ouros)",
      "O desalinhamento entre camadas É a mensagem mais importante",
      "Espadas = narrativa mental; Copas = estado emocional; Paus/Ouros = ação/compromisso",
      "A Tiragem das 3 Camadas compara pensamento, sentimento e intenção",
    ],
    caseStudy: {
      title: "O Namorado que Pensa uma Coisa e Sente Outra",
      context: "A consulente pergunta: 'O que ele realmente sente por mim? Ele diz que me ama mas age com distância.'",
      cards: [
        { position: "Pensamentos", card: "7 de Espadas" },
        { position: "Sentimentos", card: "Cavaleiro de Copas" },
        { position: "Intenções", card: "4 de Ouros" },
      ],
      analysis: "Ele pensa de forma estratégica e oculta parte do que sente (7 de Espadas — há algo não dito). Emocionalmente, sente romantismo real (Cavaleiro de Copas — o sentimento é genuíno). Mas sua intenção é reter, não se entregar (4 de Ouros — segura o que tem sem investir mais). O desalinhamento é claro: sente amor mas pensa em se proteger e age retendo.",
      lesson: "Quando as 3 camadas não se alinham, a camada de INTENÇÃO (o que a pessoa faz) é a que mais importa na prática. Sentimentos sem ação são potencial não realizado.",
    },
    exercise: {
      instruction: "Pense numa relação importante (amorosa ou não). Tire 3 cartas para as 3 camadas: Pensamentos, Sentimentos, Intenções. As cartas estão alinhadas ou desalinhadas? Onde está a tensão? Escreva uma análise de 3 parágrafos — um para cada camada.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-2-q1",
        question: "Espadas numa leitura amorosa revelam:",
        options: ["Sentimentos profundos", "A narrativa mental — o que a mente diz sobre o coração", "Ações concretas", "Nada relevante"],
        correctIndex: 1,
        explanation: "Espadas = pensamentos, análises, julgamentos e dúvidas sobre a relação.",
      },
      {
        id: "amor-2-q2",
        question: "Quando pensamentos, sentimentos e intenções NÃO estão alinhados:",
        options: ["A leitura está errada", "O desalinhamento é a mensagem mais importante", "Ignore a diferença", "Tire mais cartas"],
        correctIndex: 1,
        explanation: "O desalinhamento revela a complexidade real da dinâmica — é a informação mais valiosa.",
      },
      {
        id: "amor-2-q3",
        question: "Na prática, qual camada é a mais importante para avaliar uma relação?",
        options: ["Pensamentos", "Sentimentos", "Intenções — o que a pessoa faz de fato", "Todas igualmente"],
        correctIndex: 2,
        explanation: "Sentimentos sem ação são potencial não realizado. A intenção (ação) é o que se manifesta.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 3 — Bloqueios emocionais
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-3",
    order: 2,
    title: "Bloqueios Emocionais",
    subtitle: "O que impede o amor de fluir",
    icon: "🔒",
    content: `Muitas consulentes chegam com a mesma queixa: "Por que não consigo me conectar de verdade?" ou "Por que repito sempre o mesmo padrão?" A resposta geralmente está em **bloqueios emocionais** — mecanismos de defesa que, ao proteger do sofrimento, também impedem a intimidade.

**Os 7 Bloqueios Mais Comuns (e suas Cartas):**

**1. Medo de Abandono** — 5 de Copas, A Lua, 9 de Espadas
Medo de ser deixada. Gera apego ansioso, ciúme, necessidade constante de validação.

**2. Medo de Engolfamento** — O Eremita, 4 de Espadas, 2 de Espadas
Medo de perder a si mesma na relação. Gera distanciamento, evitação de compromisso.

**3. Ferida de Rejeição** — 5 de Ouros, 3 de Espadas, A Torre
Experiência passada de rejeição que faz a pessoa se fechar. "Se não me aproximo, não sou rejeitada."

**4. Padrão de Controle** — O Imperador (sombra), 4 de Ouros, Rei de Espadas (sombra)
Necessidade de controlar a relação para sentir segurança. Sufoca o outro.

**5. Idealização/Fantasia** — 7 de Copas, Cavaleiro de Copas (sombra), A Lua
Apaixonar-se pela fantasia, não pela pessoa real. Decepção recorrente.

**6. Autossabotagem** — O Diabo, 10 de Espadas, A Torre
Destruir inconscientemente o que está funcionando. Medo do que acontece se der certo.

**7. Lealdade ao Sofrimento** — 8 de Espadas, O Enforcado (sombra), 10 de Paus
Crença inconsciente de que amor = sofrimento. "Se não dói, não é amor de verdade."

**A Tiragem do Bloqueio:**
Posição 1 = O bloqueio | Posição 2 = Sua origem | Posição 3 = Como liberá-lo`,
    keyPoints: [
      "Bloqueios protegem do sofrimento mas impedem intimidade",
      "7 bloqueios: abandono, engolfamento, rejeição, controle, idealização, autossabotagem, lealdade ao sofrimento",
      "Cada bloqueio tem cartas-assinatura que o revelam",
      "A Tiragem do Bloqueio: bloqueio → origem → como liberar",
    ],
    deepDive: `A teoria do apego (John Bowlby, Mary Ainsworth) é a base psicológica mais importante para leituras amorosas. Os quatro estilos de apego são:

**Seguro** — confortável com intimidade e autonomia. Comunicação aberta, confiança. Cartas: A Imperatriz, 2 de Copas, 10 de Copas, O Mundo.

**Ansioso** — medo de abandono, necessidade de proximidade constante, ciúme. Cartas: 5 de Copas, 9 de Espadas, A Lua, Cavaleiro de Copas.

**Evitante** — medo de intimidade, valoriza independência acima de tudo. Cartas: O Eremita, 4 de Espadas, Cavaleiro de Espadas, 7 de Espadas.

**Desorganizado** — oscila entre buscar e fugir de intimidade. Trauma relacional. Cartas: A Torre, A Lua, O Diabo, 10 de Espadas.

Quando uma leitura amorosa revela um padrão de apego inseguro, a leitora pode orientar com gentileza: "As cartas mostram um padrão que talvez valha a pena explorar com mais profundidade — talvez com um terapeuta."

O tarô não substitui terapia — mas pode ser a porta que abre a consciência.`,
    caseStudy: {
      title: "A Mulher que Sempre Escolhe Quem Não a Escolhe",
      context: "A consulente pergunta: 'Por que sempre me apaixono por quem não me quer?'",
      cards: [
        { position: "O Bloqueio", card: "5 de Copas" },
        { position: "A Origem", card: "6 de Copas" },
        { position: "Como Liberar", card: "A Estrela" },
      ],
      analysis: "O bloqueio é o luto não processado — ela ainda chora por algo que perdeu (5 de Copas). A origem está na infância ou em padrões antigos de afeto (6 de Copas — amor condicional na infância, figura parental emocionalmente indisponível). A liberação vem da esperança e da cura (A Estrela) — ela precisa acreditar que merece amor disponível, não apenas amor que precisa ser conquistado.",
      lesson: "Padrões de repetição afetiva geralmente têm raiz na história familiar. O tarô pode iluminar esse padrão — mas a cura real acontece quando a pessoa reconhece e trabalha conscientemente para mudá-lo.",
    },
    exercise: {
      instruction: "Faça a Tiragem do Bloqueio para si mesma: (1) Qual é meu bloqueio emocional principal? (2) De onde ele vem? (3) Como posso liberá-lo? Leia com gentileza — sem julgamento. Se a resposta for desconfortável, isso é sinal de que tocou em algo real. Escreva uma reflexão honesta.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-3-q1",
        question: "O 'Medo de Engolfamento' faz a pessoa:",
        options: ["Buscar proximidade", "Distanciar-se para não perder a si mesma na relação", "Ser muito romântica", "Ficar com ciúme"],
        correctIndex: 1,
        explanation: "Quem teme engolfamento evita intimidade para preservar sua identidade — foge antes de se perder.",
      },
      {
        id: "amor-3-q2",
        question: "'Lealdade ao Sofrimento' é a crença inconsciente de que:",
        options: ["Amor é fácil", "Amor = sofrimento — se não dói, não é real", "O amor não existe", "Todo mundo sofre"],
        correctIndex: 1,
        explanation: "Essa crença faz a pessoa buscar ou criar sofrimento na relação para 'validar' que é amor.",
      },
      {
        id: "amor-3-q3",
        question: "Os 4 estilos de apego são:",
        options: ["Bom, Ruim, Médio, Neutro", "Seguro, Ansioso, Evitante e Desorganizado", "Ativo, Passivo, Neutro, Misto", "Fogo, Água, Ar, Terra"],
        correctIndex: 1,
        explanation: "Seguro, Ansioso, Evitante e Desorganizado — cada um com cartas-assinatura no tarô.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 4 — Padrões de vínculo e repetição afetiva
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-4",
    order: 3,
    title: "Padrões de Vínculo",
    subtitle: "Por que repetimos as mesmas histórias de amor",
    icon: "🔄",
    content: `Repetição afetiva é quando a pessoa vive o mesmo tipo de relação — com pessoas diferentes mas com dinâmicas idênticas. "Sempre encontro narcisistas", "Sempre sou a que dá mais", "Sempre acabo sendo traída". Esses padrões não são azar — são scripts inconscientes.

**O Conceito de Script Relacional:**
Um script é uma narrativa interna que define "como o amor funciona para mim". Ele é formado na infância e reforçado por cada relação que confirma o padrão. O tarô pode revelar o script — e ao torná-lo consciente, permitir que a pessoa o reescreva.

**Scripts comuns e suas assinaturas no tarô:**

**"Eu salvo, o outro é salvo"** — A Temperança + 6 de Copas + O Enforcado
A cuidadora eterna. Sempre escolhe parceiros que "precisam de ajuda". Se sente necessária mas nunca cuidada.

**"Eu conquisto, depois perco o interesse"** — Cavaleiro de Copas + 4 de Copas + 8 de Copas
A conquistadora crônica. A paixão está na conquista, não na manutenção. Quando o outro se entrega, ela perde o interesse.

**"Eu me anulo para ser amada"** — 8 de Espadas + A Lua + 6 de Copas
A camaleoa. Muda de personalidade para agradar o parceiro. Perde a si mesma e depois ressente.

**"Amo quem me machuca"** — O Diabo + 3 de Espadas + 5 de Copas
O vínculo traumático. Confunde intensidade com profundidade. Dor com paixão.

**A Tiragem do Padrão:**
Posição 1 = Meu padrão de vínculo | Posição 2 = O que ganho com ele | Posição 3 = O que perco | Posição 4 = Como transformar`,
    keyPoints: [
      "Repetição afetiva = scripts inconscientes, não azar",
      "Scripts são formados na infância e reforçados por cada relação",
      "O tarô revela o script — torná-lo consciente permite reescrevê-lo",
      "Tiragem do Padrão: padrão → ganho → perda → transformação",
    ],
    loveCombs: [
      {
        cards: ["O Diabo", "2 de Copas"],
        meaning: "Relação com dependência emocional mútua — vínculo forte mas potencialmente tóxico. A atração é real mas há desequilíbrio de poder.",
        warning: "Não reduza a 'relação ruim' — pode ser paixão transformadora se consciente.",
      },
      {
        cards: ["A Imperatriz", "O Imperador"],
        meaning: "Parceria equilibrada entre nutrição e estrutura. Complementaridade saudável. Relação madura com papéis claros.",
      },
      {
        cards: ["A Lua", "Cavaleiro de Copas"],
        meaning: "Romantismo fundado em ilusão. Sentimento bonito mas desconectado da realidade. Idealização do parceiro.",
        warning: "O sentimento pode ser genuíno — mas está direcionado a uma fantasia, não à pessoa real.",
      },
    ],
    exercise: {
      instruction: "Liste seus últimos 3 relacionamentos significativos. Para cada um, escreva: qual era a dinâmica? Como começou? Como terminou? O que se repetiu? Depois tire 4 cartas para a Tiragem do Padrão e compare com sua análise. O tarô confirma o padrão? Surpreende?",
      type: "writing",
    },
    quiz: [
      {
        id: "amor-4-q1",
        question: "Repetição afetiva é causada por:",
        options: ["Azar", "Scripts inconscientes formados na infância", "Destino", "Falta de opções"],
        correctIndex: 1,
        explanation: "Scripts relacionais são padrões internos que atraem e recriam as mesmas dinâmicas.",
      },
      {
        id: "amor-4-q2",
        question: "O script 'Eu salvo, o outro é salvo' indica:",
        options: ["Generosidade pura", "A cuidadora eterna que se sente necessária mas nunca cuidada", "Amor incondicional", "Parceria equilibrada"],
        correctIndex: 1,
        explanation: "Esse script cria relações desequilibradas onde um cuida e o outro recebe — mas ninguém cuida de quem cuida.",
      },
      {
        id: "amor-4-q3",
        question: "A Tiragem do Padrão inclui a posição 'O que ganho com ele' porque:",
        options: ["Todo padrão tem um benefício secundário inconsciente que o mantém ativo", "É curiosidade", "Não é importante", "É decoração"],
        correctIndex: 0,
        explanation: "Padrões se repetem porque oferecem algo (segurança, familiaridade, controle) — mesmo que custem mais do que dão.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 5 — Reciprocidade e afastamento
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-5",
    order: 4,
    title: "Sinais de Reciprocidade e Afastamento",
    subtitle: "Lendo a direção da energia entre duas pessoas",
    icon: "🔍",
    content: `Uma das perguntas mais dolorosas no amor é: "Essa pessoa está comigo de verdade?" O tarô não lê mentes — mas lê a **direção da energia**. E a direção conta tudo.

**Sinais de Reciprocidade no Tarô:**

**Cartas que apontam para conexão:**
- 2 de Copas — vínculo mútuo, troca emocional real
- Ás de Copas — novo sentimento genuíno surgindo
- 10 de Copas — plenitude emocional compartilhada
- Os Enamorados — escolha consciente de estar junto
- 4 de Paus — celebração de algo construído juntos
- 10 de Ouros — compromisso concreto e estabilidade

**Cartas que indicam presença e investimento:**
- Cavaleiro de Copas — alguém vindo em sua direção com sentimento
- 3 de Ouros — trabalho conjunto na relação
- O Mundo — ciclo se completando, relação evoluindo

**Sinais de Afastamento no Tarô:**

**Cartas que apontam para distância:**
- 8 de Copas — partida emocional, desistência silenciosa
- 4 de Copas — apatia, desinteresse
- 5 de Copas — luto, foco no que se perdeu
- O Eremita — recolhimento, necessidade de solidão
- 7 de Espadas — ações ocultas, desonestidade
- 4 de Espadas — paralisação, necessidade de distância

**Atenção crítica:** Afastamento nem sempre é rejeição. O Eremita pode indicar que a pessoa precisa de tempo — não que não ama. 4 de Espadas pode ser necessidade de processar, não indiferença. **Leia com nuance, não com pânico.**`,
    keyPoints: [
      "Reciprocidade: 2 de Copas, Ás de Copas, Os Enamorados, 10 de Copas",
      "Afastamento: 8 de Copas, 4 de Copas, O Eremita, 7 de Espadas",
      "Afastamento ≠ rejeição — pode ser necessidade de tempo ou processamento",
      "Leia a direção da energia, não apenas o conteúdo isolado de cada carta",
    ],
    loveCombs: [
      {
        cards: ["2 de Copas", "10 de Ouros"],
        meaning: "Conexão emocional real que evolui para compromisso concreto. Sinal forte de reciprocidade com futuro.",
      },
      {
        cards: ["8 de Copas", "O Eremita"],
        meaning: "Partida emocional seguida de recolhimento. A pessoa está se afastando — não necessariamente para sempre, mas agora precisa de solidão.",
        warning: "Não tente 'trazer de volta' quem está nesse processo. Respeite o espaço.",
      },
      {
        cards: ["Cavaleiro de Copas", "7 de Espadas"],
        meaning: "Romantismo com algo oculto. Alguém vem com declarações de amor mas esconde uma parte da história.",
        warning: "O sentimento pode ser real — mas há informação faltando. Investigue antes de se entregar.",
      },
    ],
    caseStudy: {
      title: "Ela Pergunta: 'Ele Está Se Afastando?'",
      context: "A consulente sente que o parceiro está mais distante e pergunta: 'O que está acontecendo entre nós?'",
      cards: [
        { position: "A energia entre vocês", card: "4 de Espadas" },
        { position: "O que ele sente", card: "6 de Copas" },
        { position: "O que está acontecendo", card: "O Eremita" },
      ],
      analysis: "A energia entre eles está em pausa (4 de Espadas — paralisação, não fim). Ele sente nostalgia e conexão com o que viveram (6 de Copas — os sentimentos são sobre o passado juntos). Ele está num momento de recolhimento pessoal (O Eremita — precisa de solidão para processar algo interno). Isso não é afastamento definitivo — é pausa. Mas a consulente precisa respeitar esse espaço sem interpretar como rejeição.",
      lesson: "Nem todo afastamento é rejeição. Às vezes as pessoas precisam de espaço para voltar com mais presença. O tarô pode ajudar a consulente a não entrar em pânico e a respeitar o processo do outro.",
    },
    exercise: {
      instruction: "Pense numa relação em que sentiu afastamento. Tire 3 cartas: (1) A energia entre nós, (2) O que a outra pessoa sente, (3) O que está realmente acontecendo. Antes de interpretar, note: as cartas indicam reciprocidade ou afastamento? Nuance: o afastamento é permanente ou temporário? Escreva sua análise com honestidade.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-5-q1",
        question: "O 2 de Copas numa leitura amorosa indica:",
        options: ["Solidão", "Vínculo mútuo e troca emocional real", "Fim da relação", "Fantasia"],
        correctIndex: 1,
        explanation: "O 2 de Copas é o sinal mais claro de reciprocidade — conexão emocional genuína entre duas pessoas.",
      },
      {
        id: "amor-5-q2",
        question: "O Eremita numa leitura de amor sempre significa rejeição?",
        options: ["Sim", "Não — pode indicar necessidade de tempo e processamento, não indiferença", "Depende do baralho", "Só se invertido"],
        correctIndex: 1,
        explanation: "O Eremita pode significar que a pessoa precisa de solidão para processar — não que não ama.",
      },
      {
        id: "amor-5-q3",
        question: "Quando as cartas indicam afastamento, a melhor orientação é:",
        options: ["Insistir e buscar o outro", "Respeitar o espaço e não interpretar como rejeição imediata", "Terminar tudo", "Ignorar as cartas"],
        correctIndex: 1,
        explanation: "Respeitar o processo do outro é maduro — e frequentemente leva a uma reconexão mais saudável.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 6 — Futuro próximo da relação
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-6",
    order: 5,
    title: "Futuro Próximo da Relação",
    subtitle: "Tendências afetivas — sem falsas promessas",
    icon: "🔮",
    content: `"Vai dar certo?" — a pergunta mais feita e a mais perigosa. Perigosa porque transforma o tarô em bola de cristal e tira o poder da consulente. Mas há formas responsáveis de ler tendências amorosas.

**Reformulações poderosas:**
- ❌ "Ele vai voltar?" → ✅ "Que energia cerca essa possível reconexão?"
- ❌ "Vamos ficar juntos?" → ✅ "Que tendência a relação está seguindo?"
- ❌ "Ela é a pessoa certa?" → ✅ "Que energia sustenta essa conexão?"

**A Tiragem de Tendência Amorosa (4 posições):**

**1. Onde estamos agora** — O estado atual da dinâmica
**2. Que energia se aproxima** — O que está vindo (não "o que vai acontecer")
**3. O que depende de mim** — A ação que está nas mãos da consulente
**4. A tendência geral** — Para onde a energia flui SE nada mudar

**Regra de ouro:** SEMPRE inclua uma posição de agência — "O que depende de mim". Isso devolve poder à consulente. Ela não é vítima do destino; ela é co-criadora da relação.

**Cartas de futuro promissor:**
A Estrela, O Sol, 10 de Copas, Ás de Copas, Os Enamorados, O Mundo

**Cartas de alerta:**
A Torre, 10 de Espadas, 3 de Espadas, 8 de Copas, O Diabo

**Cartas de transição:**
A Morte (transformação), O Julgamento (renascimento), A Roda (mudança de ciclo)

**Importante:** Cartas de "alerta" não são sentenças de morte para a relação. São sinais de que algo precisa de atenção, mudança ou cura. O futuro não está escrito — está sendo co-criado.`,
    keyPoints: [
      "Reformule 'Vai dar certo?' para perguntas de energia e tendência",
      "Sempre inclua posição de agência — 'O que depende de mim'",
      "Cartas de alerta = necessidade de atenção, não sentença",
      "O futuro é co-criado — a consulente tem poder de influenciá-lo",
    ],
    exercise: {
      instruction: "Pense numa relação que te importa. Faça a Tiragem de Tendência Amorosa (4 cartas). Foque especialmente na posição 3 (O que depende de mim): que ação concreta você pode tomar esta semana? Transforme a leitura em um compromisso real — não apenas em compreensão.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-6-q1",
        question: "Por que incluir a posição 'O que depende de mim' na tiragem?",
        options: ["Porque é bonito", "Porque devolve poder à consulente — ela é co-criadora, não vítima", "Não é necessário", "Porque ocupa espaço"],
        correctIndex: 1,
        explanation: "Agência é fundamental — a consulente precisa saber o que está em suas mãos.",
      },
      {
        id: "amor-6-q2",
        question: "A Torre numa leitura de futuro amoroso significa:",
        options: ["O relacionamento acabou", "Algo precisa de atenção ou transformação — não é sentença definitiva", "Tragédia certa", "Nada"],
        correctIndex: 1,
        explanation: "Cartas de alerta pedem ação e consciência — não são profecias inevitáveis.",
      },
      {
        id: "amor-6-q3",
        question: "A melhor reformulação de 'Ele vai voltar?' é:",
        options: ["'Quando ele vai voltar?'", "'Que energia cerca essa possível reconexão?'", "'Ele me ama?'", "'Devo esperar?'"],
        correctIndex: 1,
        explanation: "Foca na energia em vez de exigir previsão — abre a leitura em vez de limitá-la.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 7 — Combinações amorosas
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-7",
    order: 6,
    title: "Combinações Amorosas",
    subtitle: "Pares e tríades que revelam a verdade do coração",
    icon: "💕",
    content: `Certas combinações de cartas aparecem repetidamente em leituras amorosas. Conhecê-las acelera sua leitura — mas lembre-se: contexto sempre supera fórmula.

**Combinações de Amor Saudável:**
- **2 de Copas + Os Enamorados** = Escolha consciente de amor mútuo. O amor mais saudável do tarô.
- **A Imperatriz + O Imperador** = Parceria complementar. Nutrição + estrutura. Equilíbrio de poder.
- **10 de Copas + 10 de Ouros** = Plenitude emocional E material. Família, estabilidade, casa.
- **Ás de Copas + A Estrela** = Novo amor abençoado por esperança. Início luminoso.

**Combinações de Paixão e Desejo:**
- **O Diabo + Ás de Paus** = Desejo intenso e urgente. Paixão que consome. Pode ser transformador ou destrutivo.
- **Cavaleiro de Paus + Rainha de Copas** = Fogo encontra água. Desejo ardente encontra profundidade emocional.
- **A Torre + Ás de Copas** = Paixão que destrói o antigo para criar o novo. Amor revolucionário.

**Combinações de Alerta:**
- **3 de Espadas + 7 de Espadas** = Traição ou descoberta dolorosa. Alguém não está sendo honesto.
- **8 de Copas + 4 de Copas** = Desistência por desencanto. A pessoa desistiu emocionalmente.
- **O Diabo + A Lua** = Relação tóxica baseada em ilusão e dependência. Perigo real.
- **5 de Copas + 10 de Espadas** = Luto profundo. Fim doloroso que precisa ser processado.

**Combinações de Transformação:**
- **A Morte + 2 de Copas** = Morte do antigo padrão, nascimento de conexão nova. Renascimento no amor.
- **A Torre + A Estrela** = Após a destruição, cura. O amor que sobrevive à crise é o mais forte.
- **O Julgamento + Os Enamorados** = Despertar que leva a uma nova escolha de amor. Segunda chance.`,
    keyPoints: [
      "Combinações saudáveis: 2 Copas + Enamorados, Imperatriz + Imperador, 10 Copas + 10 Ouros",
      "Combinações de alerta: 3 Espadas + 7 Espadas, Diabo + Lua",
      "Combinações de transformação: Morte + 2 Copas, Torre + Estrela",
      "Contexto sempre supera fórmula — as mesmas cartas mudam com a pergunta",
    ],
    loveCombs: [
      { cards: ["2 de Copas", "Os Enamorados"], meaning: "O amor mais saudável do tarô — escolha consciente de vínculo mútuo. Conexão que honra a individualidade." },
      { cards: ["O Diabo", "A Lua"], meaning: "Relação baseada em ilusão e dependência. Intensidade confundida com profundidade.", warning: "Essa combinação pede muita atenção — pode haver manipulação ou vínculo tóxico." },
      { cards: ["A Morte", "2 de Copas"], meaning: "Transformação profunda que abre espaço para amor genuíno. O antigo morre para o novo nascer." },
      { cards: ["A Torre", "A Estrela"], meaning: "Crise que leva à cura. O amor que sobrevive à destruição renasce mais forte." },
      { cards: ["3 de Espadas", "7 de Espadas"], meaning: "Dor causada por desonestidade. Descoberta de algo que estava sendo escondido." },
    ],
    exercise: {
      instruction: "Separe do seu baralho as 10 cartas que mais aparecem em leituras de amor (use a lista desta lição como referência). Forme 5 pares e interprete cada um como combinação amorosa. Depois, mude o contexto: imagine que a mesma combinação apareceu numa pergunta sobre trabalho — como muda a interpretação? Isso treina flexibilidade.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-7-q1",
        question: "A combinação 2 de Copas + Os Enamorados indica:",
        options: ["Traição", "Escolha consciente de amor mútuo — o amor mais saudável do tarô", "Fim da relação", "Solidão"],
        correctIndex: 1,
        explanation: "Essa é a combinação mais positiva possível — vínculo genuíno com escolha consciente.",
      },
      {
        id: "amor-7-q2",
        question: "A combinação O Diabo + A Lua em contexto amoroso alerta para:",
        options: ["Amor verdadeiro", "Relação baseada em ilusão e dependência — possível toxicidade", "Romance perfeito", "Casamento"],
        correctIndex: 1,
        explanation: "Intensidade + ilusão = perigo. Pode haver manipulação ou vínculo baseado em fantasia.",
      },
      {
        id: "amor-7-q3",
        question: "A Morte + 2 de Copas indica:",
        options: ["Fim do amor", "Transformação profunda que abre espaço para amor genuíno", "Morte literal", "Nada"],
        correctIndex: 1,
        explanation: "A Morte é transformação — quando aparece com 2 de Copas, o antigo morre para o amor verdadeiro nascer.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 8 — Interpretação no contexto amoroso
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-8",
    order: 7,
    title: "Interpretação sem Distorção",
    subtitle: "Como ler cartas de amor sem cair em armadilhas",
    icon: "⚠️",
    content: `O contexto amoroso é onde mais se distorce o tarô. A emoção é tão intensa que tanto a consulente quanto a leitora podem cair em armadilhas interpretativas. Aqui estão as 7 mais comuns — e como evitá-las.

**Armadilha 1 — "Tudo é sobre ele/ela"**
A consulente quer que cada carta fale sobre a outra pessoa. Mas o tarô fala principalmente sobre a consulente. Redirecione: "O que VOCÊ pode fazer?"

**Armadilha 2 — "Carta positiva = vai dar certo"**
O Sol não significa que o relacionamento vai funcionar. Pode significar que a consulente encontrará clareza — mesmo que a clareza seja perceber que precisa sair.

**Armadilha 3 — "Carta negativa = tragédia"**
A Torre não significa traição certa. 10 de Espadas não significa fim absoluto. Cartas "negativas" são chamados de atenção, não sentenças.

**Armadilha 4 — "Tirar mais cartas para confirmar"**
Quando a resposta não agrada, a tentação é tirar mais cartas. Isso dilui a mensagem original e gera confusão. Uma leitura, uma resposta.

**Armadilha 5 — "O Cavaleiro de Copas é ELE"**
Nem toda figura da corte é uma pessoa específica. Pode ser uma energia, uma atitude, um aspecto da própria consulente.

**Armadilha 6 — "Se não faz sentido, é porque é espiritual"**
Às vezes a leitura não faz sentido — e a resposta correta é "não sei". Inventar explicações místicas para cobrir confusão não é leitura — é enrolação.

**Armadilha 7 — "A leitura prova que ele me ama"**
Se a consulente sai da leitura convicta do que JÁ acreditava antes, a leitura não acrescentou nada. Uma boa leitura desafia — não apenas confirma.`,
    keyPoints: [
      "7 armadilhas: tudo sobre o outro, positivo = sucesso, negativo = tragédia, tirar mais cartas, figuras = pessoas, 'é espiritual', confirmação",
      "O tarô fala sobre a consulente — não sobre a mente do outro",
      "Uma leitura, uma resposta — não tire mais cartas para 'confirmar'",
      "Uma boa leitura desafia — não apenas confirma o que se queria ouvir",
    ],
    exercise: {
      instruction: "Faça uma leitura sobre amor para si mesma. Depois, releia carta por carta e pergunte: caí em alguma das 7 armadilhas? Fui honesta ou distorci alguma carta para confirmar o que queria ouvir? Reescreva a leitura eliminando as distorções. Compare as duas versões.",
      type: "writing",
    },
    quiz: [
      {
        id: "amor-8-q1",
        question: "Quando a consulente não gosta da resposta, a leitora deve:",
        options: ["Tirar mais cartas", "Mudar a interpretação", "Manter a leitura — uma leitura, uma resposta", "Dar outra versão"],
        correctIndex: 2,
        explanation: "Tirar mais cartas dilui a mensagem. Uma leitura, uma resposta — com gentileza mas com verdade.",
      },
      {
        id: "amor-8-q2",
        question: "O Cavaleiro de Copas numa leitura amorosa é SEMPRE uma pessoa específica?",
        options: ["Sim, sempre o parceiro", "Não — pode ser uma energia, atitude ou aspecto da própria consulente", "Sim, sempre um homem", "Sim, o ex"],
        correctIndex: 1,
        explanation: "Figuras da corte podem representar pessoas, energias ou aspectos internos — depende do contexto.",
      },
      {
        id: "amor-8-q3",
        question: "Uma boa leitura de amor deve:",
        options: ["Confirmar o que a consulente quer ouvir", "Desafiar, revelar e ampliar a compreensão — não apenas confirmar", "Ser sempre positiva", "Prever o futuro exato"],
        correctIndex: 1,
        explanation: "A leitura mais valiosa é a que traz nova perspectiva — não a que repete o que já se sabia.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 9 — Tiragens especializadas para amor
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-9",
    order: 8,
    title: "Tiragens Especializadas para Amor",
    subtitle: "Ferramentas práticas para leituras amorosas",
    icon: "📋",
    content: `Nesta lição, você aprende 4 tiragens criadas especificamente para questões amorosas — cada uma para um tipo de pergunta diferente.

**Tiragem 1 — O Espelho do Casal (6 cartas)**
Coluna A (Pessoa 1): Pensa | Sente | Quer
Coluna B (Pessoa 2): Pensa | Sente | Quer
Leitura: compare linha a linha. As duas pensam parecido? Sentem parecido? Querem a mesma coisa? O desalinhamento revela onde o trabalho relacional é necessário.

**Tiragem 2 — O Caminho do Coração (5 cartas)**
1. O que meu coração carrega agora
2. O que me impede de amar plenamente
3. O que preciso curar
4. O que estou pronta para receber
5. O próximo passo do meu coração
Ideal para: solteiras, transições, pós-separação.

**Tiragem 3 — A Verdade da Relação (4 cartas)**
1. O que sustenta essa relação
2. O que ameaça essa relação
3. O que nenhum dos dois está vendo
4. O que a relação está pedindo
Ideal para: casais em crise ou questionamento.

**Tiragem 4 — Decisão Amorosa (5 cartas)**
1. Meu estado emocional agora
2. Ficar — que energia traz
3. Ficar — onde leva
4. Partir — que energia traz
5. Partir — onde leva
Ideal para: quando a consulente precisa decidir se fica ou vai.

**Dica:** Combine essas tiragens com a Tiragem das 3 Camadas (Lição 2) para uma leitura amorosa completa e profunda.`,
    keyPoints: [
      "Espelho do Casal: compara o que cada pessoa pensa, sente e quer",
      "Caminho do Coração: jornada interna — ideal para solteiras e transições",
      "Verdade da Relação: diagnóstico de casal — o que sustenta, ameaça e está oculto",
      "Decisão Amorosa: ficar ou partir — cenários comparados",
    ],
    caseStudy: {
      title: "A Verdade da Relação de 8 Anos",
      context: "Casal junto há 8 anos, mas a consulente sente que algo mudou. Pergunta: 'O que está realmente acontecendo entre nós?'",
      cards: [
        { position: "O que sustenta", card: "10 de Ouros" },
        { position: "O que ameaça", card: "4 de Copas" },
        { position: "O que ninguém vê", card: "Ás de Espadas" },
        { position: "O que a relação pede", card: "Os Enamorados" },
      ],
      analysis: "A relação é sustentada pela estabilidade material e pela rotina construída (10 de Ouros — casa, família, conforto). O que a ameaça é o desencanto emocional (4 de Copas — tédio, dar tudo por garantido). O que nenhum dos dois vê é que existe uma verdade que precisa ser dita (Ás de Espadas — clareza cortante, uma conversa necessária). O que a relação pede é uma nova escolha — consciente e deliberada — de estar junto (Os Enamorados — reescolher o parceiro, renovar o compromisso).",
      lesson: "Relações longas frequentemente precisam ser 're-escolhidas'. O conforto pode virar zona morta. A Verdade da Relação revela o que precisa de atenção antes que se torne irrecuperável.",
    },
    exercise: {
      instruction: "Escolha uma das 4 tiragens especializadas e faça para uma situação amorosa real (sua ou de alguém que consentiu). Registre toda a leitura por escrito, incluindo: a pergunta, as cartas, a interpretação de cada posição, e a síntese final. Este é um exercício de prática profissional.",
      type: "practice",
    },
    quiz: [
      {
        id: "amor-9-q1",
        question: "O 'Espelho do Casal' compara:",
        options: ["Passado e futuro", "O que cada pessoa pensa, sente e quer — linha a linha", "Arcanos Maiores e Menores", "Naipes diferentes"],
        correctIndex: 1,
        explanation: "Linha a linha: ambos pensam parecido? Sentem parecido? Querem a mesma coisa?",
      },
      {
        id: "amor-9-q2",
        question: "A tiragem 'Caminho do Coração' é ideal para:",
        options: ["Casais em crise", "Solteiras, transições e pós-separação", "Previsão de casamento", "Questões de trabalho"],
        correctIndex: 1,
        explanation: "É uma jornada interna — foca no que a consulente carrega, precisa curar e está pronta para receber.",
      },
      {
        id: "amor-9-q3",
        question: "A posição 'O que nenhum dos dois está vendo' é frequentemente:",
        options: ["Irrelevante", "A mais reveladora — traz o ponto cego que precisa de atenção", "Sempre positiva", "Decoração"],
        correctIndex: 1,
        explanation: "O que está oculto para ambos é frequentemente a chave — revela o ponto cego relacional.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LIÇÃO 10 — Ética e responsabilidade na leitura amorosa
  // ═══════════════════════════════════════════════════════════════
  {
    id: "amor-10",
    order: 9,
    title: "Ética na Leitura Amorosa",
    subtitle: "Responsabilidade, limites e cuidado com quem consulta",
    icon: "🛡️",
    content: `A leitura amorosa é a que mais pode ajudar — e a que mais pode machucar. Encerrar este módulo com ética não é formalidade: é necessidade.

**Os 7 Princípios Éticos da Leitura Amorosa:**

**1. Não leia sobre terceiros sem consentimento.**
"O que ele sente?" é sobre outra pessoa. Reformule: "Que energia circula nessa dinâmica?" Isso respeita a privacidade do outro.

**2. Não dê falsas esperanças.**
Se as cartas indicam afastamento, diga com gentileza — mas diga. Falsa esperança é crueldade disfarçada de gentileza.

**3. Não crie dependência.**
Se a consulente volta toda semana com a mesma pergunta, algo está errado. Encoraje autonomia: "O que VOCÊ sente sobre isso?"

**4. Reconheça seus limites.**
Violência doméstica, abuso, transtornos mentais — não são território do tarô. Encaminhe para profissionais. "O tarô ilumina, mas essa situação pede ajuda especializada."

**5. Não julgue escolhas afetivas.**
Relacionamentos abertos, relações queer, idade, classe — a leitora não é juíza moral. Leia a energia, não o modelo de relação.

**6. Cuide de si mesma.**
Leituras amorosas são emocionalmente pesadas. Tenha rituais de limpeza energética. Não carregue o peso emocional das consulentes.

**7. A verdade com amor.**
A verdade sem amor é crueldade. O amor sem verdade é manipulação. A leitura ética une os dois: diz o que precisa ser dito, da forma mais respeitosa possível.

**O compromisso da leitora:** "Eu leio para iluminar, não para controlar. Para empoderar, não para criar dependência. Para revelar, não para confirmar. Para servir, não para impressionar."`,
    keyPoints: [
      "7 princípios: consentimento, honestidade, não dependência, limites, não julgamento, autocuidado, verdade com amor",
      "Não leia sobre terceiros sem consentimento — reformule a pergunta",
      "Encaminhe para profissionais quando necessário",
      "Verdade sem amor é crueldade; amor sem verdade é manipulação",
    ],
    reflection: "Ao final deste módulo, reflita: que tipo de leitora de amor você quer ser? Qual princípio ético é mais difícil para você? E como você vai cuidar de si mesma ao lidar com as dores afetivas das consulentes?",
    exercise: {
      instruction: "Escreva seu próprio 'Código de Ética para Leituras Amorosas' — adaptado à sua prática, seus valores e seus limites. Inclua: (1) O que você se compromete a fazer, (2) O que você se recusa a fazer, (3) Como vai cuidar de si mesma. Guarde esse documento — é seu contrato consigo mesma como leitora.",
      type: "writing",
    },
    quiz: [
      {
        id: "amor-10-q1",
        question: "Quando uma consulente volta toda semana com a mesma pergunta de amor, a leitora deve:",
        options: ["Fazer a leitura normalmente", "Reconhecer o padrão e encorajar autonomia", "Cobrar mais caro", "Dar a resposta que ela quer"],
        correctIndex: 1,
        explanation: "Repetição indica dependência — a leitora ética encoraja a consulente a encontrar respostas em si.",
      },
      {
        id: "amor-10-q2",
        question: "Diante de um caso de violência doméstica, a leitora deve:",
        options: ["Ler normalmente", "Reconhecer seus limites e encaminhar para profissionais especializados", "Dar conselhos de relacionamento", "Tirar mais cartas"],
        correctIndex: 1,
        explanation: "Violência doméstica não é território do tarô. A responsabilidade ética é encaminhar.",
      },
      {
        id: "amor-10-q3",
        question: "'A verdade com amor' significa:",
        options: ["Dizer tudo sem filtro", "Dizer o que precisa ser dito da forma mais respeitosa possível", "Mentir para não machucar", "Omitir informação"],
        correctIndex: 1,
        explanation: "Verdade + respeito = leitura ética. Sem verdade, é manipulação. Sem respeito, é crueldade.",
      },
      {
        id: "amor-10-q4",
        question: "O compromisso da leitora inclui:",
        options: ["Impressionar a consulente", "Iluminar, empoderar, revelar e servir — sem criar dependência", "Prever o futuro exatamente", "Confirmar o que a consulente quer ouvir"],
        correctIndex: 1,
        explanation: "Iluminar, empoderar, revelar e servir — os quatro pilares da leitura ética.",
      },
    ],
  },
];

export function getAmorLessonByOrder(order: number): AmorLesson | undefined {
  return AMOR_LESSONS.find((l) => l.order === order);
}
