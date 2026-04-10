/**
 * Conteúdo editorial — Copas 1 a 5
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";

export const COPAS_1_5: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // ÁS DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-1",
    subtitulo: "O Cálice Transbordante",
    essencia: "O Ás de Copas é o início de toda experiência emocional. É o momento em que o coração se abre — para amar, para sentir, para se conectar com algo maior que a razão. Um cálice transbordante oferecido pelo divino, simbolizando que o amor sempre começa como um presente, nunca como uma conquista.",

    simbolosCentrais: "O cálice dourado emerge de uma nuvem (a mão divina), transbordando cinco jatos de água — os cinco sentidos despertos pelo sentimento. Uma pomba desce trazendo uma hóstia ao cálice: a comunhão entre o humano e o sagrado. Abaixo, um lago coberto de lótus representa a fertilidade emocional que nasce da entrega. A letra W (Water) gravada no cálice reforça o vínculo com o elemento Água.",

    arquetipo: "A Fonte — o ponto de origem de onde toda emoção nasce. O nascedouro que nunca seca, desde que não seja bloqueado pelo medo.",

    luz: "Novo amor, início emocional, intuição desperta, compaixão genuína, abertura do coração, fertilidade afetiva. O Ás de Copas na luz é o convite mais bonito do tarô: permita-se sentir.",

    sombra: "Emoção reprimida, medo de se abrir, sentimentalismo vazio, expectativas irreais sobre o amor, coração fechado por proteção excessiva. Na sombra, o cálice está virado — a oferta foi recusada.",

    licaoPratica: "Nem todo início precisa de garantias. Às vezes, o ato mais corajoso é simplesmente se permitir sentir — sem saber onde vai dar. O Ás de Copas ensina que vulnerabilidade não é fraqueza: é a porta de entrada para toda conexão verdadeira.",

    interpretacaoAmor: "Novo sentimento nascendo, possibilidade de romance, reconciliação, declaração de amor, despertar da paixão. Se você perguntou sobre amor, o Ás de Copas diz: sim, há algo real aqui. Mas precisa de abertura, não de controle.",

    interpretacaoTrabalho: "Novo projeto que traz satisfação emocional, trabalho criativo, colaboração harmoniosa, início de parceria profissional com afinidade. O Ás de Copas no trabalho diz: escolha o que faz seu coração bater mais forte.",

    interpretacaoEspiritualidade: "Despertar intuitivo, conexão com o sagrado, experiência mística espontânea, abertura do chakra cardíaco. O Ás de Copas na espiritualidade é o momento em que você sente — não pensa, não analisa — que algo maior existe.",

    vozDaCarta: "Eu sou o primeiro gole d'água depois da travessia no deserto. Sou a lágrima que cai sem motivo aparente — e que carrega consigo tudo que você precisava soltar. Não me segure. Não me analise. Apenas beba.",

    aprofundamento: `Na tradição Rider-Waite-Smith, o Ás de Copas é a carta mais claramente espiritual entre os quatro Ases. A pomba descendo com a hóstia evoca o Espírito Santo na iconografia cristã — mas o símbolo é mais antigo: é a conexão entre o divino e o humano através do sentimento.

Os cinco jatos de água representam os cinco sentidos — todos despertos pelo amor. Quando amamos de verdade, vemos diferente, ouvimos diferente, tocamos diferente. O amor não é apenas emocional — ele reorganiza toda a nossa percepção.

O cálice em forma de W (Water/Água) lembra que Copas é, antes de tudo, o naipe do elemento Água — fluido, adaptável, profundo, capaz de assumir qualquer forma. A água do Ás é pura: ainda não foi poluída por expectativa, ciúme ou medo.

Alquimicamente, o Ás de Copas representa a Prima Materia emocional — a substância bruta a partir da qual toda experiência afetiva será moldada. É o potencial absoluto do coração.`,

    perguntasReflexao: [
      "O que aconteceria se você se permitisse sentir plenamente, sem medo do resultado?",
      "Existe algum sentimento que você está reprimindo por achar que não é seguro?",
      "Quando foi a última vez que você se abriu completamente para alguém — e como foi?",
    ],

    quiz: [
      {
        id: "copas-1-q1",
        question: "O que a pomba descendo ao cálice simboliza no Ás de Copas?",
        options: [
          "A paz após um conflito",
          "A conexão entre o divino e o humano através do sentimento",
          "A liberdade emocional",
          "O fim de um ciclo afetivo",
        ],
        correctIndex: 1,
        explanation: "A pomba trazendo a hóstia ao cálice simboliza a comunhão entre o sagrado e o humano — o amor como presente divino, não como conquista pessoal.",
      },
      {
        id: "copas-1-q2",
        question: "Qual é o arquétipo do Ás de Copas?",
        options: [
          "O Espelho",
          "A Fonte",
          "O Guardião",
          "O Viajante",
        ],
        correctIndex: 1,
        explanation: "O Ás de Copas é A Fonte — o ponto de origem de onde toda emoção nasce, o nascedouro que nunca seca quando não bloqueado pelo medo.",
      },
      {
        id: "copas-1-q3",
        question: "Na sombra, o que o Ás de Copas indica?",
        options: [
          "Traição amorosa",
          "Excesso de emoção sem controle",
          "Emoção reprimida e medo de se abrir",
          "Fim de um relacionamento",
        ],
        correctIndex: 2,
        explanation: "Na sombra, o cálice está virado — a oferta emocional foi recusada. Indica medo de vulnerabilidade e coração fechado por proteção excessiva.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Início emocional",
      luz: "Novo amor, abertura do coração, intuição desperta",
      sombra: "Emoção reprimida, medo de se abrir, coração fechado",
      licaoCentral: "Vulnerabilidade não é fraqueza — é a porta para toda conexão verdadeira",
      aplicacaoPratica: "Permita-se sentir sem exigir garantias",
      fraseFixacao: "O cálice transborda para quem ousa se abrir.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 2 DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-2",
    subtitulo: "O Encontro dos Cálices",
    essencia: "O 2 de Copas é o primeiro encontro verdadeiro — quando dois corações se reconhecem. Não é apenas atração: é ressonância. Duas pessoas (ou duas partes de si) se olham nos olhos e dizem, sem palavras: 'eu te vejo'. É o nascimento do vínculo.",

    simbolosCentrais: "Dois jovens trocam cálices sob o caduceu de Hermes — símbolo de cura, comunicação e equilíbrio entre opostos. Acima, a cabeça de leão alado representa a paixão elevada pela alma. Os dois cálices se inclinam um para o outro: a entrega é mútua, não unilateral.",

    arquetipo: "O Espelho — o momento em que você se vê refletida no outro e descobre algo sobre si mesma que não conseguia ver sozinha.",

    luz: "Parceria, atração mútua, contrato emocional, amizade profunda, reconciliação, encontro de almas, equilíbrio na troca afetiva. O 2 de Copas na luz é a confirmação: o sentimento é recíproco.",

    sombra: "Dependência emocional, fusão excessiva, perda de identidade na relação, projeção — amar no outro o que falta em si. Na sombra, os cálices se confundem e ninguém sabe mais qual é o seu.",

    licaoPratica: "Todo vínculo verdadeiro começa com reciprocidade. Se apenas um lado se inclina, não é encontro — é desequilíbrio. O 2 de Copas ensina que amar de verdade exige que ambos estejam presentes, abertos e dispostos a trocar.",

    interpretacaoAmor: "Início de namoro, atração correspondida, pedido de compromisso, reencontro significativo. Se o consulente perguntou 'ele sente o mesmo?', o 2 de Copas responde: sim. Mas a pergunta seguinte é: vocês estão prontos para construir?",

    interpretacaoTrabalho: "Parceria profissional promissora, contrato justo, fusão de empresas, mentoria mútua. No trabalho, o 2 de Copas indica que a colaboração será mais produtiva que o esforço solo.",

    interpretacaoEspiritualidade: "Integração de polaridades internas — masculino/feminino, razão/emoção, luz/sombra. O 2 de Copas na espiritualidade é o casamento alquímico: a união dos opostos dentro de si.",

    vozDaCarta: "Eu sou o instante em que seus olhos encontram os dela e o mundo para. Não é magia — é reconhecimento. Você já conhecia esse rosto, esse calor, essa frequência. Eu apenas trouxe vocês de volta um para o outro.",

    aprofundamento: `O caduceu de Hermes acima dos cálices é um dos símbolos mais ricos do tarô. As duas serpentes entrelaçadas representam forças opostas em equilíbrio — não em conflito. É a cura que acontece quando opostos se complementam em vez de competirem.

A cabeça de leão alado acima do caduceu é uma referência ao Leão como símbolo de paixão e coragem — mas com asas, indicando que essa paixão é elevada, não apenas carnal. É o desejo sublimado pelo sentimento genuíno.

Na tradição alquímica, o 2 de Copas representa a Conjunctio — a união sagrada dos opostos. É o momento em que Sol e Lua se encontram, criando algo que nenhum dos dois poderia ser sozinho.

Historicamente, o 2 de Copas era considerada a carta do noivado — o compromisso que nasce do reconhecimento mútuo. Não é ainda o casamento (10 de Copas), mas é o primeiro pacto: 'estamos juntos nisso'.`,

    perguntasReflexao: [
      "Nos seus relacionamentos, a troca é equilibrada ou há um lado que dá mais?",
      "Você consegue se ver com clareza nos olhos de quem ama — ou projeta o que quer ver?",
      "Que parte de você só desperta na presença de outra pessoa?",
    ],

    quiz: [
      {
        id: "copas-2-q1",
        question: "O que o caduceu de Hermes simboliza no 2 de Copas?",
        options: [
          "Comércio e negociação",
          "Cura, comunicação e equilíbrio entre opostos",
          "Poder divino sobre humanos",
          "Proteção contra inimigos",
        ],
        correctIndex: 1,
        explanation: "O caduceu — com duas serpentes em equilíbrio — simboliza a cura que acontece quando forças opostas se complementam, além de comunicação e harmonia.",
      },
      {
        id: "copas-2-q2",
        question: "Qual é a lição central do 2 de Copas?",
        options: [
          "Amar sem esperar nada em troca",
          "Que a solidão é necessária para o crescimento",
          "Todo vínculo verdadeiro começa com reciprocidade",
          "Que devemos nos proteger do amor",
        ],
        correctIndex: 2,
        explanation: "O 2 de Copas ensina que amar de verdade exige que ambos os lados estejam presentes e dispostos a trocar — reciprocidade é a base.",
      },
      {
        id: "copas-2-q3",
        question: "Na tradição alquímica, o 2 de Copas representa:",
        options: [
          "A Prima Materia",
          "A Conjunctio — a união sagrada dos opostos",
          "A Nigredo — a fase escura da transformação",
          "O Ouroboros — o ciclo eterno",
        ],
        correctIndex: 1,
        explanation: "O 2 de Copas é a Conjunctio alquímica — o momento em que Sol e Lua se encontram, criando algo que nenhum dos dois poderia ser sozinho.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Encontro e reciprocidade",
      luz: "Parceria, atração mútua, equilíbrio na troca",
      sombra: "Dependência emocional, fusão, perda de identidade",
      licaoCentral: "Amar exige que ambos estejam presentes e dispostos a trocar",
      aplicacaoPratica: "Avalie se seus vínculos são recíprocos ou unilaterais",
      fraseFixacao: "O encontro verdadeiro acontece quando dois cálices se inclinam ao mesmo tempo.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 3 DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-3",
    subtitulo: "A Dança da Celebração",
    essencia: "O 3 de Copas é a alegria compartilhada — o momento em que o sentimento se expande para além do casal e se torna comunidade. É a festa, a irmandade, a celebração de um ciclo que floresceu. Três mulheres dançam juntas porque a alegria verdadeira nunca é solitária.",

    simbolosCentrais: "Três mulheres erguem seus cálices em brinde, dançando em círculo sobre frutos e flores — símbolos de abundância e colheita emocional. As guirlandas nos cabelos indicam celebração e vitória. O chão fértil confirma: o que foi plantado deu frutos. Os três cálices erguidos ao alto representam a alegria que sobe — que se eleva e contagia.",

    arquetipo: "As Três Graças — Aglaia (brilho), Eufrosina (alegria) e Tália (florescimento). A tríade feminina que celebra a beleza da vida em comunhão.",

    luz: "Celebração, amizade, comunidade, fertilidade, criatividade coletiva, gratidão, alegria genuína. O 3 de Copas na luz é o momento em que você olha ao redor e percebe: sou amada.",

    sombra: "Superficialidade, festa como fuga, fofoca, triângulo amoroso, excesso de socialização para evitar intimidade real. Na sombra, a dança continua — mas ninguém está presente de verdade.",

    licaoPratica: "A alegria precisa ser celebrada — não guardada. Quando algo bom acontece, compartilhe. Quando uma amizade te nutre, honre. O 3 de Copas ensina que a felicidade se multiplica quando dividida e murcha quando trancada.",

    interpretacaoAmor: "Fase de alegria no relacionamento, celebração de conquista a dois, grupo de amigas como rede de apoio, fertilidade. Cuidado com o significado sombra: triângulo amoroso ou terceira pessoa na relação.",

    interpretacaoTrabalho: "Trabalho em equipe bem-sucedido, celebração de resultado, networking produtivo, projeto colaborativo que flui. O 3 de Copas no trabalho diz: o sucesso aqui é coletivo, não individual.",

    interpretacaoEspiritualidade: "Prática espiritual em grupo, círculos de mulheres, rituais coletivos, gratidão como prática. O 3 de Copas na espiritualidade lembra: a fé compartilhada é mais forte que a fé solitária.",

    vozDaCarta: "Eu sou o brinde que ninguém planejou. Sou a risada que escapa no meio do jantar. Sou a amiga que aparece na hora certa com a garrafa certa e as palavras certas. Pare de esperar o momento perfeito — ele é agora.",

    aprofundamento: `As Três Graças (Cárites) da mitologia grega são uma referência direta ao 3 de Copas. Na arte renascentista, eram retratadas dançando em círculo — exatamente como no Rider-Waite-Smith — representando a beleza, a alegria e a criatividade que nascem da comunhão.

O número 3 é o primeiro número de síntese: 1 (eu) + 2 (tu) = 3 (nós). É o primeiro resultado da união — a criança, a obra, a comunidade. No contexto de Copas, é o sentimento que deixa de ser privado e se torna compartilhado.

As frutas e flores no chão — abóboras, uvas, maçãs — são símbolos de colheita e fertilidade. Indicam que esse não é um momento de plantar: é de colher. O trabalho emocional já foi feito; agora é hora de celebrar o resultado.

Na numerologia do tarô, o 3 sempre indica expansão. Em Copas, essa expansão é emocional e social — o amor que cresce para incluir mais pessoas, mais formas de afeto, mais razões para sorrir.`,

    perguntasReflexao: [
      "Quando foi a última vez que você celebrou algo de verdade — não por obrigação, mas por alegria genuína?",
      "Suas amizades te nutrem ou te drenam? O 3 de Copas pede atenção a essa diferença.",
      "Você está usando a socialização como celebração ou como fuga de algo que precisa encarar sozinha?",
    ],

    quiz: [
      {
        id: "copas-3-q1",
        question: "Qual referência mitológica está diretamente ligada ao 3 de Copas?",
        options: [
          "As Musas do Olimpo",
          "As Três Graças (Cárites)",
          "As Parcas do destino",
          "As Amazonas guerreiras",
        ],
        correctIndex: 1,
        explanation: "As Três Graças — Aglaia (brilho), Eufrosina (alegria) e Tália (florescimento) — são o arquétipo do 3 de Copas: celebração da beleza da vida em comunhão.",
      },
      {
        id: "copas-3-q2",
        question: "Na sombra, o que o 3 de Copas pode indicar?",
        options: [
          "Solidão profunda",
          "Triângulo amoroso ou superficialidade nas relações",
          "Fim de uma amizade",
          "Depressão e isolamento",
        ],
        correctIndex: 1,
        explanation: "Na sombra, o 3 de Copas pode indicar triângulo amoroso, festa como fuga, ou socialização excessiva para evitar intimidade real.",
      },
      {
        id: "copas-3-q3",
        question: "O que os frutos no chão do 3 de Copas simbolizam?",
        options: [
          "A necessidade de plantar novos projetos",
          "A abundância material acima da emocional",
          "A colheita emocional — o que foi plantado deu frutos",
          "O desperdício de recursos",
        ],
        correctIndex: 2,
        explanation: "As frutas e flores no chão são símbolos de colheita e fertilidade, indicando que o trabalho emocional já foi feito e é hora de celebrar.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Celebração e comunidade",
      luz: "Alegria compartilhada, amizade, fertilidade emocional",
      sombra: "Superficialidade, triângulo amoroso, festa como fuga",
      licaoCentral: "A felicidade se multiplica quando compartilhada",
      aplicacaoPratica: "Celebre suas conquistas e honre suas amizades",
      fraseFixacao: "A alegria verdadeira nunca dança sozinha.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 4 DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-4",
    subtitulo: "O Tédio Sagrado",
    essencia: "O 4 de Copas é a pausa emocional — o momento em que tudo parece 'ok', mas algo falta. Não é tristeza. É tédio. É a apatia de quem já tem, mas não sente. Um jovem sentado sob uma árvore recusa o cálice oferecido pela mão divina porque já não consegue ver o valor do que tem — nem do que ainda pode vir.",

    simbolosCentrais: "Um jovem sentado sob uma árvore, braços cruzados, olha para três cálices no chão com desinteresse. Uma quarta copa emerge de uma nuvem — oferecida pela mão divina — mas ele não a vê (ou não quer ver). A árvore é proteção, mas também isolamento. Os braços cruzados indicam fechamento: a recusa não é racional, é emocional.",

    arquetipo: "O Contemplativo Saturado — aquele que recebeu tanto que já não reconhece o valor do que tem. O espírito entediado que precisa de uma crise para despertar.",

    luz: "Introspecção necessária, pausa para reavaliação, meditação, tempo para si, recusa saudável de ofertas que não ressoam. O 4 de Copas na luz é a sabedoria de dizer 'não' quando o coração não está presente.",

    sombra: "Apatia, ingratidão, oportunidades desperdiçadas, depressão leve, desconexão emocional, resistência passiva à vida. Na sombra, o 4 de Copas é a anestesia da alma — sentir nada para não sentir dor.",

    licaoPratica: "O tédio é um professor disfarçado. Ele aparece quando algo que antes nos movia perdeu o sentido — e nos obriga a buscar um sentido mais profundo. O 4 de Copas ensina que antes de buscar algo novo, é preciso entender por que o antigo deixou de satisfazer.",

    interpretacaoAmor: "Estagnação na relação, parceiro emocionalmente distante, fase de desinteresse que pode ser tanto preguiça quanto pedido silencioso de mudança. Não é necessariamente fim — é sinal de que algo precisa mudar.",

    interpretacaoTrabalho: "Desmotivação profissional, sensação de que o trabalho perdeu o sentido, recusa de oportunidades por apatia, necessidade de reavaliar propósito na carreira.",

    interpretacaoEspiritualidade: "Noite escura da alma em versão suave, desconexão com práticas que antes nutriam, necessidade de silêncio e retiro. O 4 de Copas na espiritualidade diz: pare de buscar e permita-se apenas ser — por um tempo.",

    vozDaCarta: "Eu sou o vazio que aparece quando tudo está 'bem'. Sou a pergunta que ninguém quer fazer: 'e se nada disso importar?' Não me ignore. Não me medique. Me escute. Eu estou aqui porque você parou de prestar atenção na sua própria vida.",

    aprofundamento: `O 4 de Copas é uma das cartas mais mal compreendidas do tarô. Muitos leitores a tratam como negativa, mas na verdade ela é profundamente necessária. O número 4 é o número da estrutura e da pausa — e em Copas, isso se traduz em estagnação emocional.

A mão que emerge da nuvem, oferecendo o quarto cálice, é a mesma que aparece nos Ases — é a oferta divina, a graça. Mas o jovem não a vê. Não porque é cego, mas porque está fechado. Seus braços cruzados são uma barreira autoimposta.

Na psicologia junguiana, o 4 de Copas corresponde ao momento de enantiodromia — quando uma energia chega ao extremo e começa a se inverter. O excesso de emoção (3 de Copas) se transforma em ausência de emoção (4 de Copas). É o pêndulo natural da psique.

Budisticamente, o 4 de Copas é o dukkha sutil — o sofrimento que não é dor aguda, mas insatisfação crônica. É o "está tudo bem, mas não está" que permeia a existência quando perdemos a conexão com o presente.`,

    perguntasReflexao: [
      "Existe algo na sua vida que você parou de valorizar simplesmente por ter se acostumado?",
      "O seu tédio atual é sinal de que precisa mudar algo — ou de que precisa olhar mais fundo para o que já tem?",
      "Que oferta (emocional, profissional, espiritual) você pode estar recusando sem perceber?",
    ],

    quiz: [
      {
        id: "copas-4-q1",
        question: "O que a mão que emerge da nuvem oferecendo o quarto cálice representa?",
        options: [
          "Uma tentação perigosa",
          "A oferta divina / graça que o jovem não percebe",
          "Uma memória do passado",
          "O quarto elemento (terra)",
        ],
        correctIndex: 1,
        explanation: "É a mesma mão divina dos Ases — uma graça oferecida. O problema não é a oferta, é a recusa do jovem, fechado demais para percebê-la.",
      },
      {
        id: "copas-4-q2",
        question: "Qual conceito budista melhor descreve a energia do 4 de Copas?",
        options: [
          "Samsara — o ciclo de renascimento",
          "Dukkha sutil — insatisfação crônica",
          "Nirvana — libertação completa",
          "Karma — ação e consequência",
        ],
        correctIndex: 1,
        explanation: "O 4 de Copas é o dukkha sutil — não é dor aguda, mas a insatisfação crônica do 'está tudo bem, mas não está'.",
      },
      {
        id: "copas-4-q3",
        question: "Na luz, o 4 de Copas pode indicar:",
        options: [
          "Depressão clínica",
          "Introspecção necessária e recusa saudável de ofertas que não ressoam",
          "Fim de um relacionamento",
          "Raiva reprimida",
        ],
        correctIndex: 1,
        explanation: "Na luz, o 4 de Copas é a sabedoria de pausar, reavaliar e recusar o que não ressoa — introspecção, não apatia.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Pausa emocional",
      luz: "Introspecção, reavaliação, recusa saudável, meditação",
      sombra: "Apatia, ingratidão, oportunidades desperdiçadas",
      licaoCentral: "O tédio é professor — busque o sentido mais profundo antes de buscar algo novo",
      aplicacaoPratica: "Antes de procurar novidades, pergunte por que o atual deixou de satisfazer",
      fraseFixacao: "Nem sempre o cálice que falta é o que está sendo oferecido — às vezes é o que você já tem.",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 5 DE COPAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "copas-5",
    subtitulo: "O Luto Necessário",
    essencia: "O 5 de Copas é a dor da perda — mas não da perda total. Três cálices caíram, o líquido derramou, e a figura enlutada só consegue ver o que perdeu. Atrás dela, dois cálices permanecem de pé. A lição é brutal e simples: a dor é real, mas não é tudo que resta.",

    simbolosCentrais: "Uma figura de capa preta olha para três cálices derrubados — o líquido (emoções) se espalhou pelo chão. Atrás dela, dois cálices permanecem de pé, invisíveis ao seu olhar fixo na perda. Ao fundo, um rio (fluxo emocional) passa sob uma ponte (caminho de volta). Uma torre ou casa ao longe simboliza segurança — ainda acessível, mas exige que a figura se vire.",

    arquetipo: "O Enlutado — aquele que precisa viver a dor para atravessá-la. Não evita, não nega, não acelera. Simplesmente sente — até poder olhar para trás e ver o que ficou.",

    luz: "Luto saudável, processo de perda, aceitação gradual, aprendizado pelo sofrimento, liberação emocional. O 5 de Copas na luz é a permissão para chorar — sabendo que o choro limpa.",

    sombra: "Vitimismo, fixação na perda, recusa a ver o que restou, autopiedade crônica, melancolia sem fim. Na sombra, a figura nunca se vira — e os dois cálices de pé apodrecem de abandono.",

    licaoPratica: "Perda é parte da experiência humana — não uma falha. O 5 de Copas ensina que a dor precisa ser vivida, não evitada. Mas ensina também que chorar sobre o que caiu não deve impedir de cuidar do que ficou de pé.",

    interpretacaoAmor: "Término, decepção, traição, luto por uma relação que não deu certo. Mas os dois cálices de pé indicam que nem tudo está perdido — seja um novo amor possível, seja a relação consigo mesma que precisa de atenção.",

    interpretacaoTrabalho: "Perda de emprego, projeto que fracassou, parceria desfeita, desapontamento com resultados. No trabalho, o 5 de Copas diz: lamente, aprenda e olhe para as oportunidades que ainda existem.",

    interpretacaoEspiritualidade: "Perda de fé, desilusão com caminhos espirituais, necessidade de reconstruir a relação com o sagrado a partir de uma base mais honesta. O 5 de Copas na espiritualidade é a 'noite escura' que antecede o amanhecer.",

    vozDaCarta: "Eu sou a dor que você quer evitar. Sou os três cálices no chão, o líquido que escorre e não volta. Mas eu também sou o sussurro que diz: olhe para trás. Há algo de pé. Há uma ponte. Há um caminho de volta. Você só precisa se virar.",

    aprofundamento: `O 5 de Copas é frequentemente chamada de 'a carta do luto' — e com razão. No sistema numérico do tarô, o 5 é sempre o ponto de crise: a ruptura que sacode a estrutura do 4. Em Copas, essa crise é emocional — perda, decepção, dor.

Os três cálices derrubados versus os dois de pé criam uma proporção deliberada: a perda é maior que o que restou (3 > 2), mas o que restou é suficiente para recomeçar. A carta não nega a dor — ela contextualiza.

A ponte ao fundo é um dos detalhes mais importantes e frequentemente ignorados. A ponte é o caminho de volta — o retorno à segurança, à comunidade, à vida. Ela está lá, esperando. Mas para cruzá-la, a figura precisa primeiro se virar — parar de olhar para o que perdeu e começar a andar na direção do que ficou.

A capa preta é o véu do luto — a proteção temporária que a dor oferece. Ela é necessária por um tempo, mas se for usada para sempre, transforma-se em prisão.

Na tradição estoica, o 5 de Copas evoca o conceito de amor fati — o amor pelo destino, incluindo a dor. Não é masoquismo: é a compreensão de que o sofrimento, quando integrado, se torna sabedoria.`,

    perguntasReflexao: [
      "O que você perdeu recentemente que ainda está te impedindo de ver o que ficou?",
      "Existe uma 'ponte' na sua vida que você está evitando cruzar — um caminho de volta que exige coragem?",
      "Você está vivendo o luto ou se escondendo nele?",
    ],

    quiz: [
      {
        id: "copas-5-q1",
        question: "Quantos cálices permanecem de pé atrás da figura enlutada?",
        options: [
          "Nenhum — todos caíram",
          "Um",
          "Dois",
          "Três",
        ],
        correctIndex: 2,
        explanation: "Dois cálices permanecem de pé atrás da figura. A perda é real (3 caíram), mas não é total — há o que ficou, se ela se virar para ver.",
      },
      {
        id: "copas-5-q2",
        question: "O que a ponte ao fundo do 5 de Copas simboliza?",
        options: [
          "Uma separação definitiva",
          "O caminho de volta — retorno à segurança e à vida",
          "Uma prisão emocional",
          "A passagem entre vida e morte",
        ],
        correctIndex: 1,
        explanation: "A ponte é o caminho de volta à segurança e à vida — está sempre lá, mas exige que a figura pare de olhar para a perda e comece a caminhar.",
      },
      {
        id: "copas-5-q3",
        question: "Qual é a diferença entre o 5 de Copas na luz e na sombra?",
        options: [
          "Na luz é alegria, na sombra é tristeza",
          "Na luz é luto saudável que permite seguir, na sombra é vitimismo e fixação na perda",
          "Na luz é perdão, na sombra é vingança",
          "Não há diferença — é sempre uma carta negativa",
        ],
        correctIndex: 1,
        explanation: "Na luz, o 5 de Copas é luto saudável — sentir a dor e eventualmente se virar. Na sombra, é fixação na perda e recusa de ver o que restou.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Perda e luto",
      luz: "Luto saudável, aceitação gradual, aprendizado pela dor",
      sombra: "Vitimismo, fixação na perda, recusa de ver o que restou",
      licaoCentral: "A dor é real, mas não é tudo que resta — olhe para o que ficou de pé",
      aplicacaoPratica: "Permita-se sentir a perda, mas não deixe de cuidar do que ficou",
      fraseFixacao: "Três cálices caíram, mas dois permanecem de pé. Vire-se.",
    },
  },
];
