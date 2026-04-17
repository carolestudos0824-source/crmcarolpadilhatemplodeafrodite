/**
 * @deprecated Fase 6.5 — não use no runtime.
 * Conteúdo agora vive em `cms_court_cards` e é lido via `getCourtCardsContent`
 * / `useCourtCardsContent`. Mantido apenas como fallback através de
 * `repo-legacy-court.ts` e como referência editorial.
 *
 * Cartas da Corte — Pajem, Cavaleiro, Rainha e Rei.
 * Lógica pedagógica para desmistificar as 16 cartas da corte.
 */

import { type Naipe } from "./index";

export interface CartaCortePedagogica {
  id: string;
  nome: string;
  subtitulo: string;
  principio: string;
  simbolo: string;
  palavrasChave: string[];
  textoPrincipal: string;
  explicacaoSimbolica: string;
  leituraPsicologica: string;
  leituraPratica: string;
  comoSeManifesta: Record<Naipe, { titulo: string; texto: string }>;
  exemplosInterpretacao: string[];
  reflexao: string;
}

export const CARTAS_CORTE: CartaCortePedagogica[] = [
  {
    id: "pajem",
    nome: "Pajem",
    subtitulo: "O Mensageiro Curioso",
    principio: "Início, curiosidade, mensagem, aprendizado",
    simbolo: "📜",
    palavrasChave: ["Curiosidade", "Mensagem", "Início", "Estudo", "Potencial"],

    textoPrincipal: `O Pajem é a carta do começo consciente. Enquanto o Ás traz a energia bruta e potencial de um naipe, o Pajem é a pessoa que recebe essa energia e começa a explorá-la — com olhos curiosos, mente aberta e passos ainda hesitantes.

Ele é o estudante, o aprendiz, aquele que está descobrindo algo pela primeira vez. Não tem maestria, não tem autoridade — mas tem algo que os mais experientes às vezes perdem: o frescor da descoberta, a capacidade de se surpreender, a humildade de quem sabe que não sabe.

Na prática de leitura, o Pajem frequentemente indica mensagens chegando, notícias, convites ou o início de uma nova fase de aprendizado.`,

    explicacaoSimbolica: `Na tradição medieval do tarô, o Pajem (ou Page) era o jovem servo da corte — aquele que carregava mensagens entre nobres, aprendia os ofícios e se preparava para subir na hierarquia. Ele não tinha poder próprio, mas tinha acesso ao poder.

Simbolicamente, o Pajem representa a Terra de cada elemento. Ele é a manifestação mais concreta e inicial da energia do naipe — a semente que acabou de brotar, o primeiro passo no caminho.

No Rider-Waite-Smith, os Pajens aparecem sempre em pé, segurando o símbolo do naipe com reverência e atenção, como quem estuda um objeto precioso. A postura é contemplativa, não ativa — o Pajem observa antes de agir.

O Pajem também é associado à energia da criança interior: aberta, receptiva, sem julgamentos, pronta para aprender. Quando essa carta aparece, o convite é voltar a esse estado — soltar o que "já sabe" e permitir-se ser novata outra vez.`,

    leituraPsicologica: `Psicologicamente, o Pajem representa o arquétipo do Eterno Estudante — a parte de nós que nunca para de aprender, que se encanta com o novo, que faz perguntas que os "especialistas" já esqueceram de fazer.

Na sombra, o Pajem pode indicar imaturidade, ingenuidade, falta de comprometimento ou a tendência de colecionar inícios sem nunca aprofundar. É aquela pessoa que começa tudo e não termina nada — ou que usa a posição de "aprendiz" para evitar responsabilidade.

Na luz, o Pajem é a mente do principiante — o shoshin do Zen: "Na mente do principiante, as possibilidades são muitas. Na mente do especialista, são poucas." É o lembrete de que todo mestre já foi aprendiz.

Quando o Pajem aparece em uma leitura pessoal, frequentemente indica que a pessoa está entrando em uma nova área da vida com pouca experiência — e que isso é perfeitamente adequado. O momento pede curiosidade, não competência.`,

    leituraPratica: `Na prática, o Pajem aparece quando:

• Uma mensagem ou notícia está a caminho
• Um novo estudo, curso ou aprendizado está começando
• A pessoa precisa adotar uma postura mais humilde e receptiva
• Há uma oportunidade que ainda está em fase embrionária
• Uma criança ou pessoa jovem é relevante na situação

O Pajem é a carta do "ainda não sei, mas estou aprendendo" — e isso é uma força, não uma fraqueza. Quando ele aparece, o conselho é: estude, pergunte, observe, absorva. Não tente dominar o que ainda não compreendeu.`,

    comoSeManifesta: {
      copas: {
        titulo: "Pajem de Copas — O Poeta Aprendiz",
        texto: "Primeiro despertar emocional. Encantamento, sonhos românticos, intuição nascente. Pode indicar uma declaração de amor, um convite afetivo ou o início de uma fase de maior sensibilidade. Na sombra: sentimentalismo, fantasia sem base real, vulnerabilidade exposta.",
      },
      paus: {
        titulo: "Pajem de Paus — O Explorador Entusiasmado",
        texto: "Primeiro impulso criativo. Entusiasmo contagiante, ideias borbulhando, vontade de começar algo novo. Pode indicar uma notícia animadora sobre projetos ou uma centelha de inspiração. Na sombra: planos que nunca saem do papel, dispersão, excesso de entusiasmo sem foco.",
      },
      espadas: {
        titulo: "Pajem de Espadas — O Investigador Afiado",
        texto: "Primeira clareza mental. Curiosidade intelectual, vontade de entender, mente questionadora. Pode indicar uma verdade sendo revelada ou um período de estudo intenso. Na sombra: fofoca, uso da inteligência para manipular, cinismo precoce.",
      },
      ouros: {
        titulo: "Pajem de Ouros — O Aprendiz Dedicado",
        texto: "Primeiro passo prático. Estudo aplicado, início de carreira, aprendizado de um ofício. Pode indicar uma oportunidade financeira nascente ou o começo de um investimento. Na sombra: perfeccionismo paralisante, medo de errar, foco excessivo em resultados.",
      },
    },

    exemplosInterpretacao: [
      "\"Que energia preciso cultivar agora?\" → Pajem de Copas: hora de se abrir emocionalmente sem medo de parecer vulnerável.",
      "\"Devo aceitar esse novo projeto?\" → Pajem de Paus: sim, mas como aprendiz — sem a pressão de já dominar.",
      "\"O que essa situação está tentando me ensinar?\" → Pajem de Espadas: olhe para os fatos sem julgamento emocional.",
      "\"Como posso melhorar minha situação financeira?\" → Pajem de Ouros: comece estudando, não gastando — conhecimento primeiro.",
    ],

    reflexao: "Em que área da sua vida você precisa voltar a ser aprendiz? O que mudaria se você substituísse o medo de errar pela curiosidade de descobrir?",
  },

  {
    id: "cavaleiro",
    nome: "Cavaleiro",
    subtitulo: "O Buscador em Movimento",
    principio: "Movimento, busca, impulso dirigido, ação",
    simbolo: "⚔️",
    palavrasChave: ["Ação", "Busca", "Movimento", "Impulso", "Aventura"],

    textoPrincipal: `O Cavaleiro é a energia do naipe em pleno movimento. Se o Pajem observa e aprende, o Cavaleiro sai pela porta e vai atrás. Ele é o jovem adulto que já sabe o suficiente para agir — mas ainda não tem a maturidade para dosar.

É a carta da ação, da busca, da aventura e, às vezes, do excesso. O Cavaleiro não tem meio-termo: ele se lança de corpo e alma, com toda a intensidade, para o bem ou para o mal.

Na prática de leitura, o Cavaleiro frequentemente indica mudanças rápidas, chegada de alguém importante, uma fase de muita energia direcionada ou a necessidade de agir com mais decisão — ou, inversamente, de frear um pouco.`,

    explicacaoSimbolica: `Na corte medieval, o cavaleiro era o guerreiro itinerante — aquele que saía em busca de glória, missão ou amor. Ele não ficava no castelo: ele cavalgava. A imagem do cavaleiro a cavalo é fundamental: ele está em trânsito, entre um lugar e outro, entre quem era e quem está se tornando.

Simbolicamente, o Cavaleiro representa o Ar (ou Fogo, dependendo da tradição) de cada elemento. Ele é a energia do naipe em estado de expansão ativa — não mais contemplação (Pajem), mas ação direta.

No Rider-Waite-Smith, todos os Cavaleiros aparecem montados, em diferentes graus de velocidade: o de Copas se move suavemente, o de Paus galopa furiosamente, o de Espadas carga com violência, o de Ouros permanece quase parado. A velocidade do cavalo revela a natureza da energia.

O Cavaleiro também é o arquétipo do herói em jornada — aquele que deixou a segurança do lar para buscar algo maior. Quando aparece, sempre traz movimento à leitura.`,

    leituraPsicologica: `Psicologicamente, o Cavaleiro representa o impulso de ação — a parte de nós que não se contenta em saber, mas precisa fazer. É a energia do jovem adulto: idealista, intenso, corajoso e, frequentemente, imprudente.

Na luz, o Cavaleiro é dedicação absoluta: a pessoa que se joga no que ama, que viaja mil quilômetros por uma causa, que não desiste. É a energia que move o mundo.

Na sombra, é obsessão, fanatismo, impulsividade e a incapacidade de parar. O Cavaleiro invertido é aquele que confunde agitação com progresso, velocidade com direção, intensidade com profundidade.

Quando o Cavaleiro aparece em uma leitura pessoal, frequentemente indica que a pessoa está em uma fase de alta energia — e precisa decidir se está usando essa energia com sabedoria ou apenas correndo sem rumo.`,

    leituraPratica: `Na prática, o Cavaleiro aparece quando:

• Uma situação está se movendo rapidamente
• Alguém está chegando ou partindo com intensidade
• A pessoa precisa agir — parar de pensar e ir
• Há risco de excesso: energia demais sem direção
• Uma busca ou missão pessoal está em andamento

O Cavaleiro é a carta do "vá em frente" — mas com um alerta: verifique se você sabe para onde está indo. Velocidade sem direção é apenas caos em movimento.`,

    comoSeManifesta: {
      copas: {
        titulo: "Cavaleiro de Copas — O Romântico Idealista",
        texto: "Busca pelo amor ideal. Convites românticos, propostas afetivas, alguém que chega com sentimento intenso. Energia do poeta apaixonado, do artista inspirado. Na sombra: idealismo excessivo, promessas vazias, emoções sem ação concreta, sedução sem compromisso.",
      },
      paus: {
        titulo: "Cavaleiro de Paus — O Aventureiro Audaz",
        texto: "Ação apaixonada e imediata. Viagens, mudanças rápidas, projetos lançados com entusiasmo. Energia do empreendedor que não espera permissão. Na sombra: impulsividade destrutiva, raiva, impaciência, projetos abandonados no meio.",
      },
      espadas: {
        titulo: "Cavaleiro de Espadas — O Guerreiro Mental",
        texto: "Ação intelectual agressiva. Confronto direto, verdades ditas sem filtro, debates intensos. Energia do ativista, do advogado, do revolucionário. Na sombra: crueldade verbal, arrogância intelectual, pressa que atropela pessoas.",
      },
      ouros: {
        titulo: "Cavaleiro de Ouros — O Construtor Paciente",
        texto: "Ação metódica e persistente. Trabalho dedicado, progresso lento mas sólido, rotina produtiva. Energia do artesão, do investidor paciente. Na sombra: teimosia, rigidez, trabalho sem prazer, lentidão excessiva, materialismo.",
      },
    },

    exemplosInterpretacao: [
      "\"Alguém vai aparecer na minha vida?\" → Cavaleiro de Copas: sim, alguém com sentimentos fortes — mas avalie se é amor real ou fantasia.",
      "\"Devo mudar de cidade?\" → Cavaleiro de Paus: a energia está favorável para movimento — confie no impulso, mas tenha um plano mínimo.",
      "\"Como lidar com esse conflito?\" → Cavaleiro de Espadas: enfrente diretamente, mas cuide da forma — a verdade não precisa ser cruel.",
      "\"Meu projeto vai dar resultado?\" → Cavaleiro de Ouros: sim, mas no tempo dele — continue trabalhando sem pressa de colher.",
    ],

    reflexao: "Para onde você está cavalgando? Sua intensidade está te levando aonde quer ir — ou apenas te afastando de onde deveria estar?",
  },

  {
    id: "rainha",
    nome: "Rainha",
    subtitulo: "O Domínio Interior",
    principio: "Domínio interno, maturidade receptiva, interiorização do naipe",
    simbolo: "👑",
    palavrasChave: ["Maestria", "Receptividade", "Profundidade", "Nutrição", "Sabedoria"],

    textoPrincipal: `A Rainha é o domínio interior do naipe. Ela não precisa provar nada, não precisa se mover para lugar nenhum — ela já chegou. Sua força não é a ação (como o Cavaleiro) nem a autoridade (como o Rei), mas a presença: ela encarna a energia do naipe de forma tão completa que irradia naturalmente.

A Rainha é maturidade receptiva. Ela não conquista — ela atrai. Não comanda — ela nutre. Não busca — ela já encontrou e agora cultiva o que tem. É a face interna, contemplativa e profunda do naipe.

Na prática de leitura, a Rainha frequentemente indica a necessidade de cultivar qualidades internas, cuidar do que já existe, ou a presença de uma pessoa com essas características na vida do consulente.`,

    explicacaoSimbolica: `Na tradição do tarô, a Rainha é a Água de cada elemento — a expressão receptiva, fértil e nutriente da energia. Ela é o cálice que contém, o jardim que floresce, o espaço que acolhe.

No Rider-Waite-Smith, todas as Rainhas aparecem sentadas em tronos — enraizadas, estáveis, não em trânsito. Seus tronos estão frequentemente ao ar livre, cercados por natureza, água ou jardins, simbolizando fertilidade e conexão com o orgânico.

A Rainha segura o símbolo do naipe com familiaridade, não com curiosidade (Pajem) nem com agressividade (Cavaleiro). Ela conhece aquela energia intimamente — é parte dela.

Simbolicamente, a Rainha representa o princípio feminino não no sentido de gênero, mas de polaridade: receptividade, intuição, nutrição, profundidade, gestação. É o aspecto yin do naipe — tão poderoso quanto o yang do Rei, mas expresso de forma diferente.`,

    leituraPsicologica: `Psicologicamente, a Rainha representa a inteligência emocional madura — a capacidade de sentir profundamente sem ser dominada pelo sentimento, de compreender sem precisar explicar, de nutrir sem se anular.

Na luz, a Rainha é sabedoria encarnada: a pessoa que cria espaço seguro para outros crescerem, que tem autoridade natural sem precisar impor, que compreende as sutilezas que escapam à maioria.

Na sombra, a Rainha pode se tornar manipuladora, possessiva ou passivo-agressiva. Pode usar sua compreensão profunda para controlar em vez de nutrir — ou pode se sacrificar tanto pelos outros que perde a si mesma.

Quando a Rainha aparece em uma leitura pessoal, frequentemente indica que a pessoa precisa acessar sua força interior — não reagir, não agir, mas ser. Parar de buscar fora o que já existe dentro.`,

    leituraPratica: `Na prática, a Rainha aparece quando:

• A situação pede receptividade, não ação
• É preciso nutrir algo que já existe em vez de buscar algo novo
• Uma pessoa madura e sábia é relevante na situação
• O consulente precisa confiar em sua intuição e experiência
• Há necessidade de criar espaço — para si ou para outros

A Rainha é a carta do "você já tem o que precisa" — o convite é parar de correr e começar a cultivar. A maestria da Rainha não é fazer mais, é ser mais.`,

    comoSeManifesta: {
      copas: {
        titulo: "Rainha de Copas — A Mãe Emocional",
        texto: "Maestria emocional. Empatia profunda, intuição certeira, capacidade de acolher sem julgamento. É a conselheira natural, a amiga que entende sem precisar de palavras. Na sombra: codependência, manipulação emocional, sacrifício excessivo, absorção das dores alheias.",
      },
      paus: {
        titulo: "Rainha de Paus — A Líder Magnética",
        texto: "Maestria criativa. Confiança natural, magnetismo pessoal, capacidade de inspirar sem forçar. É a empreendedora que lidera pelo exemplo, a artista que vive sua arte. Na sombra: ciúme, competição desleal, dominação através do carisma, temperamento explosivo.",
      },
      espadas: {
        titulo: "Rainha de Espadas — A Mente Soberana",
        texto: "Maestria intelectual. Percepção afiada, honestidade implacável, independência de pensamento. É a mentora que diz o que ninguém quer ouvir — com precisão cirúrgica. Na sombra: frieza emocional, amargura, isolamento autoimposto, crueldade disfarçada de sinceridade.",
      },
      ouros: {
        titulo: "Rainha de Ouros — A Guardiã Próspera",
        texto: "Maestria material. Generosidade prática, lar acolhedor, prosperidade compartilhada. É a pessoa que transforma recursos em conforto e conforto em segurança. Na sombra: possessividade material, controle através do dinheiro, definição do amor por presentes.",
      },
    },

    exemplosInterpretacao: [
      "\"Como posso ajudar essa pessoa?\" → Rainha de Copas: esteja presente — às vezes, escutar com o coração é mais poderoso que qualquer conselho.",
      "\"Como me posicionar no trabalho?\" → Rainha de Paus: lidere pelo exemplo e pela energia, não pela imposição. Sua presença já é sua autoridade.",
      "\"Devo dizer o que penso?\" → Rainha de Espadas: sim, mas com precisão — não com raiva. A verdade bem colocada corta sem destruir.",
      "\"Como criar mais estabilidade?\" → Rainha de Ouros: cuide do que já tem antes de buscar mais. Prosperidade é gestão, não acumulação.",
    ],

    reflexao: "Que energia você já domina internamente mas ainda não reconhece? O que aconteceria se você parasse de buscar e começasse a irradiar?",
  },

  {
    id: "rei",
    nome: "Rei",
    subtitulo: "A Autoridade Manifesta",
    principio: "Domínio externo, autoridade, direção, expressão consolidada do naipe",
    simbolo: "🏛️",
    palavrasChave: ["Autoridade", "Maestria", "Direção", "Liderança", "Consolidação"],

    textoPrincipal: `O Rei é a expressão máxima e consolidada do naipe. Enquanto a Rainha domina internamente, o Rei projeta essa energia para fora — com autoridade, direção e responsabilidade. Ele não apenas sente, pensa, cria ou constrói: ele dirige, governa e decide.

O Rei é maturidade em ação. Ele já foi Pajem (aprendeu), já foi Cavaleiro (buscou), já integrou a sabedoria da Rainha — e agora usa tudo isso para liderar. Sua força não é a intensidade (como o Cavaleiro) nem a profundidade (como a Rainha), mas a capacidade de tomar decisões e sustentar suas consequências.

Na prática de leitura, o Rei frequentemente indica a necessidade de assumir responsabilidade, tomar uma decisão com autoridade, ou a presença de uma figura de poder e liderança na situação.`,

    explicacaoSimbolica: `Na tradição do tarô, o Rei é o Fogo (ou Ar) de cada elemento — a expressão ativa, diretiva e manifestada da energia. Ele é a chama que ilumina, a espada que decide, o cetro que comanda.

No Rider-Waite-Smith, todos os Reis aparecem sentados em tronos massivos, geralmente em posição frontal, olhando diretamente para o observador. A postura é de quem está pronto para decidir — não para contemplar (Rainha), não para agir impulsivamente (Cavaleiro), mas para governar.

Os Reis seguram tanto o símbolo do naipe quanto um segundo objeto de poder (cetro, espada) — indicando que não apenas conhecem a energia, mas a controlam e direcionam conscientemente.

Simbolicamente, o Rei representa o princípio masculino no sentido de polaridade: ação direcionada, responsabilidade, estrutura, decisão, manifestação externa. É o aspecto yang que complementa o yin da Rainha — ambos necessários para a completude.`,

    leituraPsicologica: `Psicologicamente, o Rei representa a autoridade madura — a capacidade de liderar sem dominar, de decidir sem ser rígido, de sustentar responsabilidades sem se perder nelas.

Na luz, o Rei é o líder benevolente: justo, experiente, confiável, capaz de ver o quadro geral e tomar decisões difíceis com sabedoria. É a pessoa que outros procuram em momentos de crise — não por ser perfeita, mas por ser firme.

Na sombra, o Rei pode se tornar tirânico, controlador, emocionalmente distante ou abusivo em seu uso de poder. Pode confundir autoridade com autoritarismo, liderança com dominação, responsabilidade com controle.

Quando o Rei aparece em uma leitura pessoal, frequentemente indica que a pessoa precisa assumir uma posição de liderança — em sua própria vida, antes de tudo. O Rei pergunta: "Você está governando sua vida ou sendo governada por circunstâncias?"`,

    leituraPratica: `Na prática, o Rei aparece quando:

• Uma decisão importante precisa ser tomada — com firmeza
• A situação exige liderança, não hesitação
• Uma figura de autoridade é relevante (chefe, pai, mentor, líder)
• O consulente precisa assumir responsabilidade por sua própria vida
• É hora de parar de aprender e começar a dirigir

O Rei é a carta do "assuma o trono" — o convite é parar de esperar que alguém resolva e começar a resolver. Com sabedoria, com justiça, com firmeza — mas com a humildade de quem sabe que todo poder vem acompanhado de responsabilidade.`,

    comoSeManifesta: {
      copas: {
        titulo: "Rei de Copas — O Sábio Compassivo",
        texto: "Autoridade emocional. Equilíbrio entre sentimento e razão, capacidade de liderar com empatia sem perder a firmeza. É o terapeuta, o conselheiro, o líder que cuida. Na sombra: repressão emocional, manipulação sutil, controle disfarçado de cuidado, volatilidade escondida.",
      },
      paus: {
        titulo: "Rei de Paus — O Visionário Estrategista",
        texto: "Autoridade criativa. Visão de longo prazo, capacidade de inspirar e mobilizar, liderança natural em projetos grandes. É o CEO, o diretor, o mentor que vê o potencial antes de todos. Na sombra: arrogância, imposição de sua visão, intolerância com limitações alheias.",
      },
      espadas: {
        titulo: "Rei de Espadas — O Juiz Imparcial",
        texto: "Autoridade intelectual. Pensamento claro, decisões baseadas em lógica, comunicação precisa e assertiva. É o juiz, o estrategista, o analista que corta a confusão com clareza. Na sombra: frieza calculista, abuso de poder intelectual, tirania da razão sobre o sentimento.",
      },
      ouros: {
        titulo: "Rei de Ouros — O Patriarca Próspero",
        texto: "Autoridade material. Sucesso construído, generosidade abundante, capacidade de criar prosperidade sustentável. É o empresário maduro, o investidor sábio, o provedor. Na sombra: ganância, materialismo, controle financeiro como forma de poder, workaholism.",
      },
    },

    exemplosInterpretacao: [
      "\"Como devo lidar com essa equipe?\" → Rei de Copas: lidere com empatia — entenda as pessoas antes de decidir por elas.",
      "\"Meu negócio vai crescer?\" → Rei de Paus: sim, se você mantiver a visão e souber delegar. Líder não faz tudo — líder dirige.",
      "\"Devo processar essa pessoa?\" → Rei de Espadas: analise os fatos com frieza. Justiça não é vingança — é clareza aplicada.",
      "\"Como garantir o futuro da minha família?\" → Rei de Ouros: construa com paciência, invista com sabedoria, ensine pelo exemplo.",
    ],

    reflexao: "Em que área da vida você precisa assumir o trono? Onde está delegando seu poder para outros — e o que mudaria se parasse?",
  },
];

export function getCartaCorte(id: string): CartaCortePedagogica | undefined {
  return CARTAS_CORTE.find((c) => c.id === id);
}
