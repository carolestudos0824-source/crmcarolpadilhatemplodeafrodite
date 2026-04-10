/**
 * Conteúdo editorial — Ouros 1 a 5
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";

export const OUROS_1_5: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // ÁS DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-1",
    subtitulo: "A Semente de Ouro",
    essencia: "O Ás de Ouros é a semente da manifestação — o momento em que uma possibilidade concreta surge no mundo material. Representa uma nova oportunidade financeira, física ou prática que, se cultivada com paciência, pode se tornar abundância real.",

    simbolosCentrais: "Uma mão emerge de uma nuvem segurando uma grande moeda de ouro com um pentagrama inscrito. Abaixo, um jardim florescente com lírios e um arco de sebe conduz a montanhas distantes. O pentagrama é o espírito manifestado na matéria. O jardim é a fertilidade da terra. As montanhas representam os objetivos de longo prazo. A sebe é o portal entre a ideia e a concretização.",

    arquetipo: "A Semente Dourada — a oportunidade concreta que aparece uma vez e exige ação prática para germinar.",

    luz: "Nova oportunidade material, prosperidade nascente, início de projeto lucrativo, boa saúde, presente concreto, fundação sólida. O Ás de Ouros na luz é a moeda que cai na sua mão — agora, plante-a.",

    sombra: "Ganância, materialismo excessivo, oportunidade desperdiçada por preguiça, obsessão com dinheiro, falsa segurança material. Na sombra, a moeda é agarrada em vez de plantada — e nunca cresce.",

    licaoPratica: "Toda abundância começa com uma semente. O Ás de Ouros ensina que a prosperidade não é mágica — é o resultado de plantar no momento certo, cuidar com constância e colher com gratidão. A terra recompensa quem trabalha.",

    interpretacaoAmor: "Início concreto de relacionamento, proposta prática (morar junto, casar), amor que se manifesta em ações. O Ás de Ouros no amor é a palavra que vira gesto — o amor que se prova nos fatos.",

    interpretacaoTrabalho: "Nova oportunidade de emprego, início de negócio, investimento promissor, promoção, projeto viável. No trabalho, é a chance concreta que você esperava — agora, execute.",

    interpretacaoEspiritualidade: "Espiritualidade encarnada, sagrado no cotidiano, corpo como templo, gratidão material como prática espiritual. O Ás de Ouros na espiritualidade é o momento em que o espírito toca a terra.",

    vozDaCarta: "Eu sou a moeda que cai na sua mão — mas não sou a fortuna. Sou a semente. Se você me guardar no bolso, ficarei ali para sempre: uma única moeda. Se me plantar na terra certa, com suor e paciência, serei uma floresta dourada. A escolha é sua.",

    aprofundamento: `O Ás de Ouros é o ponto de origem da manifestação material no tarô. Na tradição Rider-Waite-Smith, o pentagrama na moeda representa o quinto elemento — espírito — contido na matéria. A mensagem é clara: o material não é separado do sagrado.

O jardim florescente abaixo da mão é o Éden terreno — a promessa de que a terra é generosa quando cultivada. Os lírios brancos simbolizam pureza de intenção na busca material. As montanhas ao fundo são os objetivos de longo prazo que exigem persistência.

Na Cabala, o Ás de Ouros corresponde a Keter em Assiah — a Coroa no mundo material. É a centelha divina que desce ao plano mais denso da existência. Na numerologia, o 1 é começo absoluto — e em Ouros, esse começo é tangível, mensurável, real.

Na alquimia, o Ás de Ouros é a Prima Materia — a matéria bruta a partir da qual todo ouro será criado. Não é o resultado final, é o ingrediente essencial. Toda riqueza, toda saúde, toda construção começa com esta moeda única.`,

    perguntasReflexao: [
      "Existe uma oportunidade concreta na sua vida que você está ignorando ou adiando?",
      "Como você equilibra espiritualidade e vida material — são opostos ou complementos?",
      "O que significa 'plantar' para você neste momento — que semente prática precisa ir à terra?",
    ],

    quiz: [
      {
        id: "ouros-1-q1",
        question: "O que o pentagrama na moeda do Ás de Ouros simboliza?",
        options: ["Magia negra", "O espírito manifestado na matéria", "Dinheiro", "Sorte"],
        correctIndex: 1,
        explanation: "O pentagrama representa o quinto elemento (espírito) contido na matéria — o sagrado no concreto.",
      },
      {
        id: "ouros-1-q2",
        question: "Qual é o elemento do naipe de Ouros?",
        options: ["Fogo", "Água", "Ar", "Terra"],
        correctIndex: 3,
        explanation: "Ouros é o naipe da Terra — matéria, corpo, trabalho, manifestação concreta.",
      },
      {
        id: "ouros-1-q3",
        question: "Na Cabala, o Ás de Ouros corresponde a:",
        options: ["Malkuth em Yetzirah", "Keter em Assiah", "Tiferet em Briah", "Chokmah em Atziluth"],
        correctIndex: 1,
        explanation: "É Keter em Assiah — a Coroa no mundo material, a centelha divina na matéria.",
      },
      {
        id: "ouros-1-q4",
        question: "Na sombra, o Ás de Ouros pode indicar:",
        options: ["Generosidade", "Ganância e oportunidade desperdiçada por materialismo", "Amor", "Sabedoria"],
        correctIndex: 1,
        explanation: "Na sombra, a moeda é agarrada em vez de plantada — materialismo que impede o crescimento.",
      },
      {
        id: "ouros-1-q5",
        question: "Na alquimia, o Ás de Ouros representa:",
        options: ["A Pedra Filosofal", "A Prima Materia", "O Elixir", "A Rubedo"],
        correctIndex: 1,
        explanation: "A Prima Materia é a matéria bruta a partir da qual todo ouro será criado — o começo essencial.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Semente",
      luz: "Oportunidade concreta e prosperidade nascente",
      sombra: "Ganância e oportunidade desperdiçada",
      licaoCentral: "A terra recompensa quem planta com paciência e constância",
      aplicacaoPratica: "Identifique uma oportunidade prática e dê o primeiro passo concreto hoje",
      fraseFixacao: "A moeda na mão é semente — plante ou ela nunca será floresta",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 2 DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-2",
    subtitulo: "A Dança do Equilíbrio",
    essencia: "O Dois de Ouros é a carta do equilíbrio dinâmico — a habilidade de manter duas responsabilidades, dois projetos ou duas áreas da vida em movimento sem deixar nenhuma cair. Representa a adaptabilidade prática que a vida exige.",

    simbolosCentrais: "Um jovem dança equilibrando duas moedas conectadas por uma fita em forma de lemniscata (∞). O mar agitado ao fundo e navios em ondas altas contrastam com a leveza do dançarino. A lemniscata indica equilíbrio eterno — não estático, mas em movimento perpétuo. Os navios representam as flutuações da vida material. A dança mostra que equilíbrio é ritmo, não rigidez.",

    arquetipo: "O Malabarista — aquele que mantém tudo no ar com graça, sabendo que parar de se mover é cair.",

    luz: "Adaptabilidade, flexibilidade financeira, equilíbrio entre trabalho e vida, gestão de múltiplas demandas, fluidez prática. O Dois de Ouros na luz é a dança — não a marcha.",

    sombra: "Instabilidade financeira, incapacidade de se comprometer, dispersão, viver no fio da navalha sem rede de segurança. Na sombra, o malabarista está sempre à beira de deixar tudo cair.",

    licaoPratica: "A vida nunca está em equilíbrio perfeito — e não precisa estar. O Dois de Ouros ensina que equilíbrio não é estabilidade, é movimento. A arte não é parar de balançar, é aprender a dançar com o balanço.",

    interpretacaoAmor: "Equilíbrio entre relacionamento e individualidade, casal que gerencia responsabilidades juntos, adaptação mútua. O Dois de Ouros no amor é dançar juntos — cada um com seu ritmo, mas na mesma música.",

    interpretacaoTrabalho: "Múltiplos projetos simultâneos, freelancer gerenciando clientes, adaptação a mudanças no mercado. No trabalho, é a flexibilidade que mantém a renda fluindo.",

    interpretacaoEspiritualidade: "Equilíbrio entre espírito e matéria, integração do sagrado no cotidiano, fluidez entre meditação e ação. O Dois de Ouros na espiritualidade é o monge que medita e depois vai ao mercado.",

    vozDaCarta: "Eu danço porque parar é cair. As duas moedas são pesadas, o mar está agitado e os navios balançam — mas olhe para os meus pés. Eles conhecem o ritmo. Equilíbrio não é estar parado. É saber para onde se mover quando o chão se move.",

    aprofundamento: `O Dois de Ouros é uma das cartas mais dinâmicas do tarô. Na tradição Rider-Waite-Smith, a lemniscata (símbolo do infinito) conectando as duas moedas é o mesmo símbolo que aparece no Mago — indicando que o equilíbrio material é, em si, uma forma de magia.

Na numerologia, o 2 é dualidade e escolha. Em Ouros, a dualidade é prática: trabalho/vida, receita/despesa, dar/receber. A escolha não é entre um ou outro, mas como manter ambos em movimento.

Na Cabala, o Dois de Ouros corresponde a Chokmah em Assiah — a Sabedoria no mundo material. A sabedoria aqui é prática: saber quando gastar e quando guardar, quando avançar e quando recuar, quando investir e quando colher.

O mar agitado ao fundo é significativo: o mundo material nunca é estável. Os navios sobem e descem — assim como as finanças, a saúde, as circunstâncias. O dançarino não controla o mar — controla seus pés.`,

    perguntasReflexao: [
      "Quais áreas da sua vida estão disputando sua energia agora — e como você está gerenciando?",
      "Você busca equilíbrio como estado fixo ou como movimento contínuo?",
      "O que aconteceria se você parasse de tentar controlar tudo e começasse a dançar com a incerteza?",
    ],

    quiz: [
      {
        id: "ouros-2-q1",
        question: "O que a lemniscata (∞) conectando as moedas simboliza?",
        options: ["Dívida infinita", "Equilíbrio eterno em movimento contínuo", "Riqueza", "Magia"],
        correctIndex: 1,
        explanation: "A lemniscata indica que o equilíbrio não é estático — é dinâmico e perpétuo.",
      },
      {
        id: "ouros-2-q2",
        question: "Qual é o arquétipo do Dois de Ouros?",
        options: ["O Guerreiro", "O Malabarista", "O Rei", "O Eremita"],
        correctIndex: 1,
        explanation: "O Malabarista mantém tudo no ar com graça — equilíbrio é ritmo, não rigidez.",
      },
      {
        id: "ouros-2-q3",
        question: "Na Cabala, o Dois de Ouros corresponde a:",
        options: ["Binah em Atziluth", "Chokmah em Assiah", "Tiferet em Yetzirah", "Keter em Briah"],
        correctIndex: 1,
        explanation: "É Chokmah em Assiah — Sabedoria prática no mundo material.",
      },
      {
        id: "ouros-2-q4",
        question: "A lição central do Dois de Ouros é:",
        options: ["Nunca mudar", "Equilíbrio não é estabilidade — é movimento", "Gastar tudo", "Acumular"],
        correctIndex: 1,
        explanation: "A arte não é parar de balançar — é aprender a dançar com o balanço.",
      },
      {
        id: "ouros-2-q5",
        question: "O mar agitado ao fundo representa:",
        options: ["Perigo", "A instabilidade natural do mundo material", "Viagem", "Morte"],
        correctIndex: 1,
        explanation: "O mundo material nunca é estável — o dançarino não controla o mar, controla seus pés.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Equilíbrio",
      luz: "Adaptabilidade e flexibilidade prática",
      sombra: "Instabilidade e dispersão crônica",
      licaoCentral: "Equilíbrio não é estar parado — é saber dançar com o movimento",
      aplicacaoPratica: "Identifique duas responsabilidades em conflito e crie um ritmo que acomode ambas",
      fraseFixacao: "A dança é o equilíbrio — parar de se mover é cair",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 3 DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-3",
    subtitulo: "A Obra das Mãos",
    essencia: "O Três de Ouros é a carta da maestria artesanal, da colaboração qualificada e do trabalho bem-feito. Representa o momento em que habilidade, dedicação e cooperação se unem para criar algo de valor duradouro.",

    simbolosCentrais: "Três figuras trabalham juntas dentro de uma catedral: um escultor com ferramentas e dois monges ou arquitetos avaliando os planos. Três pentagramas estão esculpidos no arco acima. A catedral representa a Grande Obra — algo maior que qualquer indivíduo. O escultor é a habilidade técnica. Os consultores são o planejamento e a visão. Os três pentagramas são a recompensa do trabalho bem-feito.",

    arquetipo: "O Mestre Artesão — aquele que transforma matéria bruta em obra de arte através de habilidade, paciência e colaboração.",

    luz: "Maestria profissional, trabalho em equipe qualificado, aprendizado técnico, reconhecimento pela qualidade, construção duradoura. O Três de Ouros na luz é a catedral — construída pedra a pedra por mãos habilidosas.",

    sombra: "Perfeccionismo paralisante, trabalho menosprezado, colaboração difícil, mediocridade aceita, falta de reconhecimento. Na sombra, o artesão trabalha sozinho e ninguém vê a obra.",

    licaoPratica: "A excelência não é talento — é prática. O Três de Ouros ensina que a maestria vem da repetição paciente, da abertura ao feedback e da humildade de ser aprendiz antes de ser mestre. Toda catedral começa com uma única pedra bem colocada.",

    interpretacaoAmor: "Relacionamento que é construído com esforço mútuo, parceria prática, casal que trabalha junto em projetos. O Três de Ouros no amor é o casal que constrói a casa — literalmente e metaforicamente.",

    interpretacaoTrabalho: "Trabalho em equipe excelente, mentoria, aprendizado de nova habilidade, projeto colaborativo de alta qualidade. No trabalho, é o reconhecimento que vem de fazer bem-feito.",

    interpretacaoEspiritualidade: "Prática espiritual disciplinada, artesanato como meditação, construção do templo interior, maestria pela repetição sagrada. O Três de Ouros na espiritualidade é a prece feita com as mãos.",

    vozDaCarta: "Cada pedra que eu coloco nesta catedral tem o peso da minha intenção. Não trabalho sozinho — os mestres me orientam e a planta me guia. Mas a mão que esculpe é minha. A excelência não é um dom — é uma escolha que faço a cada golpe do cinzel.",

    aprofundamento: `O Três de Ouros é frequentemente chamado de "carta do artesão" na tradição do tarô. Na tradição Rider-Waite-Smith, a cena dentro da catedral é carregada de simbolismo maçônico: o aprendiz trabalhando sob a supervisão dos mestres é uma referência direta aos graus da maçonaria operativa.

Na numerologia, o 3 é criação e expressão. Em Ouros, a criação é tangível — algo que se pode tocar, ver, habitar. Na Cabala, o Três de Ouros corresponde a Binah em Assiah — a Compreensão no mundo material. Binah é a Grande Mãe que dá forma — e aqui, a forma é a catedral, o artesanato, a obra.

Os três pentagramas no arco representam a tríade da maestria: habilidade técnica, visão criativa e execução disciplinada. Nenhum desses elementos sozinho é suficiente — a excelência requer os três.

Na tradição medieval, o construtor de catedrais era considerado um artista-sacerdote — alguém cujo trabalho manual era uma forma de oração. O Três de Ouros preserva essa visão: trabalhar com excelência é um ato sagrado.`,

    perguntasReflexao: [
      "Existe uma habilidade que você quer desenvolver mas não pratica com disciplina?",
      "Como você recebe feedback sobre seu trabalho — com abertura ou com defesa?",
      "Qual seria a sua 'catedral' — o projeto que exige toda a sua maestria?",
    ],

    quiz: [
      {
        id: "ouros-3-q1",
        question: "O que a catedral na cena do Três de Ouros representa?",
        options: ["Religião", "A Grande Obra — algo maior que qualquer indivíduo", "Riqueza", "Governo"],
        correctIndex: 1,
        explanation: "A catedral é a obra coletiva que transcende o indivíduo — construída por gerações.",
      },
      {
        id: "ouros-3-q2",
        question: "Qual é o arquétipo do Três de Ouros?",
        options: ["O Guerreiro", "O Mestre Artesão", "O Rei", "O Louco"],
        correctIndex: 1,
        explanation: "O Mestre Artesão transforma matéria bruta em arte pela habilidade e paciência.",
      },
      {
        id: "ouros-3-q3",
        question: "Na Cabala, o Três de Ouros corresponde a:",
        options: ["Chokmah em Atziluth", "Binah em Assiah", "Tiferet em Briah", "Chesed em Yetzirah"],
        correctIndex: 1,
        explanation: "É Binah em Assiah — Compreensão no mundo material, a Grande Mãe que dá forma.",
      },
      {
        id: "ouros-3-q4",
        question: "Os três pentagramas no arco representam:",
        options: ["Três deuses", "Habilidade técnica, visão criativa e execução disciplinada", "Três moedas", "Sorte"],
        correctIndex: 1,
        explanation: "A tríade da maestria — nenhum elemento sozinho é suficiente para a excelência.",
      },
      {
        id: "ouros-3-q5",
        question: "A lição central do Três de Ouros é:",
        options: ["Trabalhar sozinho", "A excelência vem da prática paciente e da colaboração", "Ser perfeito", "Não aceitar feedback"],
        correctIndex: 1,
        explanation: "Maestria = repetição paciente + abertura ao feedback + humildade de aprendiz.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Maestria",
      luz: "Trabalho excelente, colaboração qualificada, reconhecimento",
      sombra: "Perfeccionismo paralisante e trabalho menosprezado",
      licaoCentral: "A excelência não é talento — é prática paciente e colaboração",
      aplicacaoPratica: "Escolha uma habilidade e pratique-a com disciplina por 30 dias",
      fraseFixacao: "Toda catedral começa com uma única pedra bem colocada",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 4 DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-4",
    subtitulo: "O Guardião do Tesouro",
    essencia: "O Quatro de Ouros é a carta da posse, do controle e da segurança material levada ao extremo. Representa o momento em que a proteção do que se conquistou se transforma em aprisionamento — quando guardar se torna agarrar.",

    simbolosCentrais: "Uma figura sentada sobre um banco segura uma moeda sobre a cabeça, outra sob os pés e abraça duas contra o peito. Uma cidade próspera aparece ao fundo, mas a figura está fora dela — isolada pela posse. A moeda na cabeça domina o pensamento. As moedas no peito bloqueiam o coração. A moeda sob os pés impede o movimento. A cidade representa a comunidade da qual se isolou.",

    arquetipo: "O Avarento — aquele que possui tudo e não tem nada, porque confundiu posse com segurança.",

    luz: "Segurança financeira, gestão responsável de recursos, proteção do patrimônio, estabilidade construída, fundação sólida. O Quatro de Ouros na luz é a poupança — guardar com propósito.",

    sombra: "Avareza, medo de perder, controle excessivo, materialismo que isola, incapacidade de compartilhar, possessividade. Na sombra, as quatro moedas são algemas douradas.",

    licaoPratica: "A verdadeira segurança não vem de agarrar — vem de confiar. O Quatro de Ouros ensina que guardar com sabedoria é virtude, mas agarrar com medo é prisão. A pergunta não é 'quanto tenho?', mas 'quanto posso dar sem me perder?'.",

    interpretacaoAmor: "Possessividade no relacionamento, medo de perder o parceiro, controle afetivo, dificuldade de se abrir. O Quatro de Ouros no amor é o abraço que sufoca — segura tão forte que expulsa.",

    interpretacaoTrabalho: "Resistência a mudanças, apego a posição, medo de investir, gestão conservadora demais. No trabalho, é o profissional que não arrisca — e por isso não cresce.",

    interpretacaoEspiritualidade: "Apego material que bloqueia o crescimento espiritual, medo de soltar, necessidade de controle sobre o destino. O Quatro de Ouros na espiritualidade pergunta: o que você precisa soltar para crescer?",

    vozDaCarta: "Eu trabalhei demais para perder o que tenho. Esta moeda na cabeça me lembra todos os dias do esforço. Estas no peito, eu protejo como filhas. A dos pés me mantém no lugar. Mas a cidade lá fora... eu já não consigo chegar até ela. Será que estou seguro — ou preso?",

    aprofundamento: `O Quatro de Ouros é uma das cartas mais psicologicamente reveladoras do tarô. Na tradição Rider-Waite-Smith, a posição da figura é deliberadamente desconfortável: segura as moedas com tanto esforço que não consegue se mover.

Na numerologia, o 4 é estabilidade e fundação. Em Ouros, a estabilidade material levada ao extremo se torna rigidez — e a fundação se torna prisão. Na Cabala, o Quatro de Ouros corresponde a Chesed em Assiah — a Misericórdia no mundo material. Paradoxalmente, a falta de misericórdia consigo mesmo (não se permitir gastar, compartilhar, viver) é o tema central.

A cidade ao fundo é crucial: a prosperidade não existe no isolamento. A riqueza só tem sentido em comunidade — e o Quatro de Ouros perdeu essa conexão. Suas moedas não circulam, não geram, não alimentam — apenas existem como troféus de um medo que nunca será aplacado.

Na psicologia, o Quatro de Ouros representa o medo de escassez — a crença profunda de que nunca haverá o suficiente, mesmo quando há abundância. É a riqueza sem paz.`,

    perguntasReflexao: [
      "Existe algo que você segura tão forte que está sufocando — dinheiro, posição, relacionamento?",
      "Seu desejo de segurança te protege ou te isola?",
      "O que você precisaria soltar para se sentir genuinamente livre?",
    ],

    quiz: [
      {
        id: "ouros-4-q1",
        question: "O que a cidade ao fundo, fora do alcance da figura, simboliza?",
        options: ["Perigo", "A comunidade e prosperidade da qual se isolou pela posse", "Pobreza", "Guerra"],
        correctIndex: 1,
        explanation: "A cidade próspera ao fundo é a vida que ele perdeu ao se isolar com suas moedas.",
      },
      {
        id: "ouros-4-q2",
        question: "Qual é o arquétipo do Quatro de Ouros?",
        options: ["O Generoso", "O Avarento", "O Sábio", "O Guerreiro"],
        correctIndex: 1,
        explanation: "O Avarento possui tudo e não tem nada — confundiu posse com segurança.",
      },
      {
        id: "ouros-4-q3",
        question: "Na Cabala, o Quatro de Ouros corresponde a:",
        options: ["Gevurah em Yetzirah", "Chesed em Assiah", "Tiferet em Atziluth", "Binah em Briah"],
        correctIndex: 1,
        explanation: "É Chesed em Assiah — a Misericórdia que falta no mundo material.",
      },
      {
        id: "ouros-4-q4",
        question: "A lição central do Quatro de Ouros é:",
        options: ["Nunca gastar", "Guardar com sabedoria é virtude, agarrar com medo é prisão", "Gastar tudo", "Ignorar dinheiro"],
        correctIndex: 1,
        explanation: "A verdadeira segurança vem da confiança, não do controle obsessivo.",
      },
      {
        id: "ouros-4-q5",
        question: "Na sombra, o Quatro de Ouros pode indicar:",
        options: ["Generosidade", "Avareza e materialismo que isola", "Amor", "Liberdade"],
        correctIndex: 1,
        explanation: "Na sombra, as moedas são algemas douradas — posse que aprisiona.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Posse",
      luz: "Segurança financeira e gestão responsável",
      sombra: "Avareza e controle que isola",
      licaoCentral: "Guardar é virtude, agarrar é prisão — a segurança vem da confiança",
      aplicacaoPratica: "Dê ou compartilhe algo de valor hoje — e observe como se sente",
      fraseFixacao: "Quatro moedas abraçadas — e uma cidade inteira perdida lá fora",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 5 DE OUROS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ouros-5",
    subtitulo: "A Caminhada no Frio",
    essencia: "O Cinco de Ouros é a carta da perda material, da exclusão e da provação que testa a fé na abundância. Representa o momento em que o frio da escassez bate — mas também mostra que a porta da ajuda está mais perto do que parece.",

    simbolosCentrais: "Duas figuras caminham descalças na neve, diante de uma igreja com vitrais iluminados mostrando cinco pentagramas. Uma figura está ferida, apoiada em muletas. A outra está descalça e coberta com trapos. A igreja com luz e calor está ali — mas eles não entram. Os vitrais mostram que a abundância espiritual existe, mesmo na pobreza material. A neve é a provação temporária.",

    arquetipo: "O Excluído — aquele que caminha na escassez sem perceber que a porta da abundância está aberta ao lado.",

    luz: "Reconhecimento da ajuda disponível, humildade para pedir, solidariedade na adversidade, provação que fortalece, pobreza temporária como mestra. O Cinco de Ouros na luz é o pedido de ajuda que muda tudo.",

    sombra: "Vitimismo material, orgulho que impede de aceitar ajuda, pobreza mental, exclusão autoimposta, identificação com a carência. Na sombra, a neve é eterna porque a porta é ignorada.",

    licaoPratica: "A escassez mais profunda não é a de dinheiro — é a de perspectiva. O Cinco de Ouros ensina que a abundância muitas vezes está a uma porta de distância, mas o orgulho, a vergonha ou a cegueira impede de entrar. Pedir ajuda não é fraqueza — é sabedoria.",

    interpretacaoAmor: "Solidão afetiva, relacionamento em crise financeira, parceiros que se apoiam na adversidade, amor que sobrevive à escassez. O Cinco de Ouros no amor testa a força do vínculo — e revela se é real.",

    interpretacaoTrabalho: "Perda financeira, desemprego, crise profissional, investimento fracassado. No trabalho, é o momento de aceitar ajuda e recomeçar com humildade.",

    interpretacaoEspiritualidade: "A noite escura material da alma, provação que purifica, fé testada pela escassez, gratidão por pouco. O Cinco de Ouros na espiritualidade é a provação de Jó — perder tudo e ainda assim confiar.",

    vozDaCarta: "Eu sei que a igreja está ali — vejo a luz nos vitrais. Mas meus pés estão descalços e meu orgulho é maior que meu frio. Talvez a lição não seja sobre dinheiro. Talvez seja sobre aprender a bater na porta e dizer: eu preciso de ajuda.",

    aprofundamento: `O Cinco de Ouros é uma das cartas mais emocionalmente carregadas do tarô. Na tradição Rider-Waite-Smith, o detalhe mais importante é frequentemente ignorado: a igreja com vitrais iluminados está ali, com a porta aparentemente aberta. Os excluídos não entram — e o tarô não explica por quê.

Na numerologia, o 5 é ruptura e crise. Em Ouros, a crise é material: perda de dinheiro, saúde, abrigo, segurança. Na Cabala, o Cinco de Ouros corresponde a Gevurah em Assiah — a Severidade no mundo material. Gevurah é o julgamento que corta — e aqui, o corte é na carteira, no corpo, na segurança.

A neve é um símbolo purificador: na tradição alquímica, o frio extremo é a Nigredo invernal — a fase de decomposição que precede a transformação. A escassez não é permanente — é estacional.

Os cinco pentagramas nos vitrais são significativos: a abundância é visível, iluminada, presente — mas inacessível para quem não ergue os olhos e bate na porta. A lição não é sobre pobreza material, é sobre pobreza de perspectiva.`,

    perguntasReflexao: [
      "Existe uma 'igreja iluminada' — uma ajuda disponível — que você está ignorando por orgulho?",
      "Como você lida com a escassez — com desespero ou com a confiança de que é temporária?",
      "Quando foi a última vez que pediu ajuda de verdade — sem vergonha?",
    ],

    quiz: [
      {
        id: "ouros-5-q1",
        question: "O que a igreja iluminada ao fundo simboliza?",
        options: ["Religião obrigatória", "A ajuda e abundância que estão disponíveis mas não são acessadas", "Condenação", "Riqueza da igreja"],
        correctIndex: 1,
        explanation: "A igreja com luz e calor está ali — a abundância existe, mas os excluídos não entram.",
      },
      {
        id: "ouros-5-q2",
        question: "Qual é o arquétipo do Cinco de Ouros?",
        options: ["O Rico", "O Excluído", "O Guerreiro", "O Rei"],
        correctIndex: 1,
        explanation: "O Excluído caminha na escassez sem perceber que a porta está aberta ao lado.",
      },
      {
        id: "ouros-5-q3",
        question: "Na Cabala, o Cinco de Ouros corresponde a:",
        options: ["Chesed em Briah", "Gevurah em Assiah", "Tiferet em Atziluth", "Netzach em Yetzirah"],
        correctIndex: 1,
        explanation: "É Gevurah em Assiah — Severidade no mundo material, o corte na segurança.",
      },
      {
        id: "ouros-5-q4",
        question: "A lição central do Cinco de Ouros é:",
        options: ["A pobreza é destino", "A escassez mais profunda é de perspectiva — a ajuda está a uma porta de distância", "Nunca pedir ajuda", "O dinheiro resolve tudo"],
        correctIndex: 1,
        explanation: "Pedir ajuda não é fraqueza — é sabedoria que abre a porta da abundância.",
      },
      {
        id: "ouros-5-q5",
        question: "Na sombra, o Cinco de Ouros pode indicar:",
        options: ["Abundância", "Vitimismo e orgulho que impede de aceitar ajuda", "Amor", "Paz"],
        correctIndex: 1,
        explanation: "Na sombra, a neve é eterna porque a porta da igreja é ignorada por orgulho.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Escassez",
      luz: "Humildade para pedir ajuda e solidariedade na adversidade",
      sombra: "Vitimismo e orgulho que perpetuam a carência",
      licaoCentral: "A escassez mais profunda é de perspectiva — a ajuda está perto",
      aplicacaoPratica: "Peça ajuda para algo que você anda carregando sozinho",
      fraseFixacao: "A igreja está iluminada — basta erguer os olhos e bater na porta",
    },
  },
];
