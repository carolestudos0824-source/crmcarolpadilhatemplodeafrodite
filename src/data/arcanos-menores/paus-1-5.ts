/**
 * Conteúdo editorial — Paus 1 a 5
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";

export const PAUS_1_5: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // ÁS DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-1",
    subtitulo: "A Centelha Primordial",
    essencia: "O Ás de Paus é o fogo que acende tudo. É a faísca da inspiração, o impulso puro, a energia criadora em seu estado mais selvagem e potente. Quando esta carta aparece, algo dentro de você acabou de despertar — e pede passagem.",

    simbolosCentrais: "Uma mão surge de uma nuvem segurando um bastão vivo, brotando folhas verdes. Ao fundo, um castelo sobre uma colina representa as metas que se tornam possíveis. As folhas caindo do bastão são sementes de futuro: cada uma é um projeto em potencial. O céu limpo e dourado indica clareza de propósito. A paisagem fértil abaixo mostra que o terreno está pronto para receber a ação.",

    arquetipo: "A Faísca — o momento exato em que uma ideia nasce com força suficiente para mudar tudo. O Big Bang pessoal.",

    luz: "Inspiração súbita, novo empreendimento, energia criativa, início de jornada, entusiasmo puro, potencial ilimitado, coragem para começar. O Ás de Paus na luz é o grito do universo dizendo: agora.",

    sombra: "Impulso sem direção, início que nunca se completa, entusiasmo que evapora, ego inflado, ação precipitada sem planejamento, energia desperdiçada. Na sombra, o fogo queima tudo ao redor — inclusive quem o segura.",

    licaoPratica: "O fogo não espera permissão para arder. O Ás de Paus ensina que a inspiração tem prazo de validade — se você não agir enquanto a chama está viva, ela se apaga. Comece imperfeito, mas comece.",

    interpretacaoAmor: "Paixão avassaladora, atração instantânea, novo romance com energia intensa, desejo sexual desperto. O Ás de Paus no amor é fogo: esquenta rápido, ilumina tudo — mas precisa ser alimentado para durar.",

    interpretacaoTrabalho: "Novo projeto inspirador, oportunidade empreendedora, promoção, início de negócio próprio, energia renovada na carreira. No trabalho, é a ideia que muda tudo — se você tiver coragem de executá-la.",

    interpretacaoEspiritualidade: "Despertar da kundalini, chamado vocacional, energia vital renovada, conexão com o fogo sagrado. O Ás de Paus na espiritualidade é o momento em que você sente que nasceu para algo — e decide honrar isso.",

    vozDaCarta: "Eu sou o primeiro segundo depois do raio. Sou a ideia que te acorda de madrugada, o impulso que faz suas mãos tremerem de vontade. Não me guarde. Não me planeje demais. Eu sou fogo — e fogo precisa se mover. Agora.",

    aprofundamento: `O Ás de Paus é o ponto de ignição de todo o naipe de Fogo. Na tradição Rider-Waite-Smith, o bastão que brota folhas verdes é um paradoxo poderoso: a madeira morta que renasce pelo toque divino. É a vida que insiste em acontecer.

A mão que emerge da nuvem — presente em todos os quatro Ases — representa a oferta do divino ao humano. No caso de Paus, o presente é a energia pura: não dinheiro (Ouros), não emoção (Copas), não pensamento (Espadas), mas vontade.

Na numerologia esotérica, o 1 é o ponto de origem — não dualidade, não reflexão, apenas impulso. Em Paus, esse impulso é o Fogo em estado puro: criação, destruição, transformação. Não é bom nem mau — é inevitável.

Na Cabala, o Ás de Paus corresponde a Keter em Atziluth — a Coroa no mundo mais elevado. É o primeiro lampejo da vontade divina, antes de assumir qualquer forma. Alquimicamente, é a Calcinatio — o fogo que queima as impurezas e revela a essência.

As oito folhas caindo do bastão representam as oito direções — a energia se irradia para todos os lados. O Ás não escolhe: ele oferece. A escolha de direção virá nas cartas seguintes.`,

    perguntasReflexao: [
      "Existe uma ideia ou projeto que está pedindo para nascer na sua vida agora?",
      "Quando foi a última vez que você agiu por puro impulso criativo — e como foi?",
      "O que acontece quando você adia repetidamente algo que te inspira?",
    ],

    quiz: [
      {
        id: "paus-1-q1",
        question: "O que o bastão brotando folhas verdes simboliza?",
        options: ["Morte", "Vida que renasce pelo toque divino", "Decadência", "Estagnação"],
        correctIndex: 1,
        explanation: "O bastão vivo é madeira morta que renasce — a vida que insiste em acontecer.",
      },
      {
        id: "paus-1-q2",
        question: "Qual é o elemento do naipe de Paus?",
        options: ["Água", "Terra", "Ar", "Fogo"],
        correctIndex: 3,
        explanation: "Paus é o naipe do Fogo — ação, criatividade, vontade, energia vital.",
      },
      {
        id: "paus-1-q3",
        question: "Na Cabala, o Ás de Paus corresponde a:",
        options: ["Malkuth em Assiah", "Keter em Atziluth", "Tiferet em Briah", "Yesod em Yetzirah"],
        correctIndex: 1,
        explanation: "É Keter em Atziluth — a Coroa no mundo mais elevado, o primeiro lampejo da vontade divina.",
      },
      {
        id: "paus-1-q4",
        question: "Na sombra, o Ás de Paus pode indicar:",
        options: ["Preguiça total", "Impulso sem direção e energia desperdiçada", "Depressão", "Traição"],
        correctIndex: 1,
        explanation: "Na sombra, o fogo queima sem direção — entusiasmo que evapora ou ação precipitada.",
      },
      {
        id: "paus-1-q5",
        question: "As folhas caindo do bastão representam:",
        options: ["Decadência", "Energia irradiando em todas as direções", "Outono", "Tristeza"],
        correctIndex: 1,
        explanation: "As oito folhas representam a energia se irradiando — o Ás oferece, não escolhe.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Inspiração",
      luz: "Faísca criativa, impulso puro, novo começo",
      sombra: "Energia desperdiçada e impulso sem direção",
      licaoCentral: "A inspiração tem prazo de validade — comece imperfeito, mas comece",
      aplicacaoPratica: "Identifique uma ideia que está pedindo para nascer e dê o primeiro passo hoje",
      fraseFixacao: "O fogo não espera permissão para arder",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 2 DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-2",
    subtitulo: "O Senhor dos Horizontes",
    essencia: "O Dois de Paus é o momento da decisão entre permanecer e partir, entre o conhecido e o desconhecido. Representa o planejamento visionário — quando a energia do Ás ganha direção e se transforma em estratégia. O mundo está literalmente nas suas mãos.",

    simbolosCentrais: "Uma figura segura um globo terrestre na mão direita enquanto se apoia num bastão com a esquerda, de pé sobre as ameias de um castelo. Um segundo bastão está fixo à parede. O mar e as montanhas ao fundo representam territórios a conquistar. A rosa branca e o lírio vermelho cruzados no escudo simbolizam paixão e pureza em equilíbrio.",

    arquetipo: "O Conquistador Visionário — aquele que olha o horizonte e decide que aquilo tudo pode ser seu.",

    luz: "Visão de futuro, planejamento estratégico, decisão corajosa, domínio pessoal, ambição saudável, parcerias estratégicas. O Dois de Paus na luz é Colombo olhando o oceano — sabendo que algo existe do outro lado.",

    sombra: "Indecisão, medo de sair da zona de conforto, planejamento excessivo sem ação, arrogância, desejo de controle total. Na sombra, o globo se torna um peso — e o castelo, uma prisão.",

    licaoPratica: "O mapa não é o território. O Dois de Paus ensina que planejar é essencial, mas em algum momento é preciso largar o globo e descer do castelo. A visão só se realiza quando vira caminhada.",

    interpretacaoAmor: "Decisão importante no relacionamento, escolha entre dois caminhos afetivos, parceria que amplia horizontes, viagem a dois que muda tudo. O Dois de Paus no amor diz: vocês podem ir mais longe juntos.",

    interpretacaoTrabalho: "Planejamento de negócio, expansão profissional, decisão estratégica, parceria comercial, mudança de carreira calculada. No trabalho, é o momento de pensar grande — e depois agir grande.",

    interpretacaoEspiritualidade: "Escolha de caminho espiritual, decisão entre tradições, visão expandida do propósito de vida. O Dois de Paus na espiritualidade é o chamado que exige uma escolha: para qual horizonte você caminha?",

    vozDaCarta: "Eu coloquei o mundo nas suas mãos — mas não para você ficar olhando. Veja o horizonte. Sinta o vento. Agora escolha: ficar no castelo ou cruzar o mar? Ambos custam. Mas apenas um leva adiante.",

    aprofundamento: `O Dois de Paus é uma das cartas mais expansivas do tarô. Na tradição Rider-Waite-Smith, a figura no topo do castelo segurando o globo evoca Alexandre, o Grande — o conquistador que olhava o mapa e via destino, não geografia.

O número 2 introduz a dualidade: escolha, parceria, polaridade. Em Paus, essa dualidade é entre visão e ação — saber para onde ir e ter coragem de partir. Os dois bastões representam os dois polos: um está na mão (ação presente), outro fixo na parede (potencial reservado).

Na Cabala, o Dois de Paus corresponde a Chokmah em Atziluth — a Sabedoria no mundo do Fogo. Chokmah é a primeira força de expansão após Keter — o lampejo que agora tem direção. Na astrologia, está associado a Marte em Áries — a energia mais assertiva e pioneira do zodíaco.

O globo terrestre é um símbolo de domínio, mas também de responsabilidade. Quem segura o mundo precisa saber que cada decisão afeta tudo ao redor. O Dois de Paus não é apenas ambição — é visão com consciência.`,

    perguntasReflexao: [
      "Existe uma decisão importante que você está adiando por medo do desconhecido?",
      "Como seria sua vida se você pensasse dez vezes maior do que pensa agora?",
      "Qual horizonte te chama — e o que te impede de caminhar até ele?",
    ],

    quiz: [
      {
        id: "paus-2-q1",
        question: "O que o globo terrestre na mão da figura simboliza?",
        options: ["Riqueza material", "Domínio e visão de futuro", "Solidão", "Conhecimento"],
        correctIndex: 1,
        explanation: "O globo representa o mundo de possibilidades — e a capacidade de escolher uma direção.",
      },
      {
        id: "paus-2-q2",
        question: "Na Cabala, o Dois de Paus corresponde a:",
        options: ["Malkuth em Assiah", "Chokmah em Atziluth", "Binah em Briah", "Tiferet em Yetzirah"],
        correctIndex: 1,
        explanation: "É Chokmah em Atziluth — Sabedoria no Fogo, a primeira expansão com direção.",
      },
      {
        id: "paus-2-q3",
        question: "Qual é o arquétipo do Dois de Paus?",
        options: ["O Eremita", "O Conquistador Visionário", "O Louco", "O Mártir"],
        correctIndex: 1,
        explanation: "É o Conquistador Visionário — quem olha o horizonte e decide que pode ser seu.",
      },
      {
        id: "paus-2-q4",
        question: "Na sombra, o Dois de Paus indica:",
        options: ["Depressão", "Planejamento excessivo sem ação", "Traição", "Pobreza"],
        correctIndex: 1,
        explanation: "Na sombra, o globo vira peso e o castelo vira prisão — planejar sem nunca agir.",
      },
      {
        id: "paus-2-q5",
        question: "Os dois bastões representam:",
        options: ["Conflito", "Ação presente e potencial reservado", "Destruição", "Casamento"],
        correctIndex: 1,
        explanation: "Um bastão na mão (ação) e outro na parede (reserva) — a dualidade entre agir e esperar.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Visão",
      luz: "Planejamento visionário e decisão corajosa",
      sombra: "Indecisão e planejamento excessivo sem ação",
      licaoCentral: "A visão só se realiza quando vira caminhada",
      aplicacaoPratica: "Escolha um horizonte e defina o primeiro passo concreto hoje",
      fraseFixacao: "O mapa não é o território — desça do castelo e caminhe",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 3 DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-3",
    subtitulo: "O Vigia dos Navios",
    essencia: "O Três de Paus é a carta da expansão consciente. Representa o momento em que o planejamento do Dois se torna movimento real — os navios foram enviados, as oportunidades estão no horizonte e agora é preciso esperar com confiança. É o empreendedor que lançou sua aposta e aguarda o retorno.",

    simbolosCentrais: "Uma figura de manto vermelho e dourado observa três navios no mar, de pé sobre um penhasco, segurando um dos três bastões. Os outros dois estão fincados ao lado. O manto vermelho representa ação, o dourado representa sucesso. Os navios são os projetos lançados ao mundo. O horizonte amplo indica que o campo de possibilidades é vasto.",

    arquetipo: "O Explorador-Mercador — aquele que já lançou seus navios e agora observa o horizonte com confiança paciente.",

    luz: "Expansão, empreendimento em movimento, visão de longo prazo, oportunidades no horizonte, comércio, viagem, liderança visionária. O Três de Paus na luz é a confiança de quem semeou bem e espera a colheita.",

    sombra: "Atrasos frustrantes, oportunidades que não retornam, excesso de confiança, investimento sem retorno, solidão do líder. Na sombra, os navios partiram — mas podem nunca voltar.",

    licaoPratica: "Depois de agir, é preciso confiar. O Três de Paus ensina que nem tudo depende de você — há um tempo entre a semeadura e a colheita que exige paciência, fé e visão de longo prazo.",

    interpretacaoAmor: "Relacionamento à distância, parceiro que expande seu mundo, amor que cresce com o tempo, espera paciente por alguém que voltará. O Três de Paus no amor diz: o amor certo às vezes está no próximo horizonte.",

    interpretacaoTrabalho: "Expansão de negócio, projetos internacionais, resultados que estão a caminho, networking estratégico. No trabalho, é o momento de confiar no que você lançou e se preparar para receber.",

    interpretacaoEspiritualidade: "Visão espiritual de longo prazo, confiança no processo, expansão da consciência além do familiar. O Três de Paus na espiritualidade é a fé que sustenta enquanto os frutos ainda não chegaram.",

    vozDaCarta: "Eu lancei os navios. Fiz minha parte. Agora fico aqui, no penhasco, olhando o horizonte — não com ansiedade, mas com a certeza de quem plantou na estação certa. Eles voltarão. E trarão mais do que eu imaginei.",

    aprofundamento: `O Três de Paus marca a transição do planejamento para a execução em andamento. Na tradição Rider-Waite-Smith, os três bastões fincados representam a base tripla da ação bem-sucedida: visão, coragem e paciência.

Na numerologia, o 3 é o número da criação manifestada — a tese (1), a antítese (2) e a síntese (3). Em Paus, é o momento em que a faísca (Ás) e a decisão (Dois) geram movimento real no mundo.

Na Cabala, o Três de Paus corresponde a Binah em Atziluth — a Compreensão no mundo do Fogo. Binah é a Grande Mãe que dá forma ao potencial — aqui, a energia crua do fogo ganha estrutura e direção.

Os navios no mar são um símbolo mercantil da Renascença — a era em que o tarô se consolidou. Representam investimentos lançados ao desconhecido: risco calculado, confiança no processo, e a sabedoria de que grandes retornos exigem grande paciência.`,

    perguntasReflexao: [
      "Que 'navios' você lançou recentemente e estão no horizonte esperando retorno?",
      "Como você lida com a espera entre agir e receber os resultados?",
      "Existe algo que você precisa soltar — confiar que voltará — em vez de controlar?",
    ],

    quiz: [
      {
        id: "paus-3-q1",
        question: "O que os navios no horizonte representam?",
        options: ["Fuga", "Projetos e oportunidades lançados ao mundo", "Guerra", "Tristeza"],
        correctIndex: 1,
        explanation: "Os navios são investimentos e projetos que foram lançados e aguardam retorno.",
      },
      {
        id: "paus-3-q2",
        question: "Na Cabala, o Três de Paus corresponde a:",
        options: ["Keter em Atziluth", "Binah em Atziluth", "Chokmah em Briah", "Chesed em Yetzirah"],
        correctIndex: 1,
        explanation: "É Binah em Atziluth — Compreensão no Fogo, a energia que ganha forma.",
      },
      {
        id: "paus-3-q3",
        question: "Qual é o arquétipo do Três de Paus?",
        options: ["O Guerreiro", "O Explorador-Mercador", "O Monge", "O Rei"],
        correctIndex: 1,
        explanation: "O Explorador-Mercador lançou seus navios e espera com confiança paciente.",
      },
      {
        id: "paus-3-q4",
        question: "Na sombra, o Três de Paus pode indicar:",
        options: ["Violência", "Atrasos e investimentos sem retorno", "Casamento", "Revelação"],
        correctIndex: 1,
        explanation: "Na sombra, os navios podem não voltar — excesso de confiança ou atrasos frustrantes.",
      },
      {
        id: "paus-3-q5",
        question: "O manto vermelho e dourado da figura representa:",
        options: ["Realeza", "Ação (vermelho) e sucesso (dourado)", "Religião", "Magia"],
        correctIndex: 1,
        explanation: "Vermelho é a cor da ação e dourado do sucesso — juntos indicam empreendimento bem-sucedido.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Expansão",
      luz: "Projetos em movimento e confiança no horizonte",
      sombra: "Atrasos e excesso de confiança",
      licaoCentral: "Depois de agir, é preciso confiar no tempo",
      aplicacaoPratica: "Identifique um projeto em andamento e pratique a paciência consciente",
      fraseFixacao: "Os navios voltarão — mas só se você souber esperar",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 4 DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-4",
    subtitulo: "O Portal da Celebração",
    essencia: "O Quatro de Paus é a carta da celebração, da harmonia e da conquista compartilhada. Representa o momento em que o trabalho duro gera frutos visíveis e é hora de festejar — não sozinho, mas com aqueles que ajudaram a construir. É o lar, a comunidade, a festa que marca um ciclo.",

    simbolosCentrais: "Quatro bastões erguidos formam um portal ou arco decorado com guirlandas de flores e frutas. Duas figuras celebram com buquês de flores nas mãos. Ao fundo, um castelo e uma ponte indicam estabilidade e conexão. A guirlanda entre os bastões é o símbolo da recompensa pelo esforço — a natureza que celebra junto.",

    arquetipo: "O Anfitrião — aquele que abre as portas do seu lar e convida todos para celebrar o que foi conquistado.",

    luz: "Celebração, harmonia, casamento, inauguração, marco importante, comunidade unida, lar abençoado, alegria compartilhada. O Quatro de Paus na luz é o brinde que se faz quando a fundação está firme.",

    sombra: "Festa sem motivo, harmonia superficial, pressão social para comemorar, instabilidade mascarada de celebração, medo de quebrar a alegria. Na sombra, os quatro bastões sustentam uma fachada.",

    licaoPratica: "Celebrar não é frívolo — é necessário. O Quatro de Paus ensina que reconhecer as vitórias é tão importante quanto conquistá-las. Sem celebração, a jornada perde sentido e a energia se esgota.",

    interpretacaoAmor: "Casamento, noivado, mudança para a mesma casa, festa de aniversário do casal, harmonia familiar. O Quatro de Paus no amor é o portal que se cruza a dois — e que se enfeita com flores.",

    interpretacaoTrabalho: "Inauguração, lançamento de produto, promoção celebrada, equipe unida, resultado que merece reconhecimento. No trabalho, é o momento de parar e celebrar antes de seguir em frente.",

    interpretacaoEspiritualidade: "Ritual de gratidão, celebração sazonal, comunidade espiritual acolhedora, reconhecimento do sagrado no cotidiano. O Quatro de Paus na espiritualidade é a festa como oração.",

    vozDaCarta: "Eu sou a guirlanda que enfeita o portal. Sou o riso que ecoa quando as portas se abrem. Não passe por mim com pressa — pare, olhe ao redor, veja quem veio. Este momento existe porque muitas mãos o construíram. Celebre.",

    aprofundamento: `O Quatro de Paus é frequentemente associado a casamentos e celebrações na tradição divinatória, mas seu significado é mais amplo: é qualquer momento de estabilidade alcançada após esforço.

Na numerologia, o 4 é o número da fundação — os quatro pilares, as quatro direções, as quatro estações. Em Paus, a fundação é feita de fogo — o que significa que a estabilidade aqui não é estática, mas dinâmica: é a energia organizada, não contida.

Na Cabala, o Quatro de Paus corresponde a Chesed em Atziluth — a Misericórdia no mundo do Fogo. Chesed é a expansão benéfica, a generosidade que flui naturalmente. Aqui, o fogo não queima — aquece, ilumina, convida.

O portal formado pelos bastões é um símbolo universal de passagem: marca a transição de um estado para outro. Cruzar o portal do Quatro de Paus é entrar num espaço de segurança e pertencimento. Na tradição medieval, os portais de flores marcavam casamentos, feiras e festivais — momentos em que a comunidade se reunia para celebrar a vida.`,

    perguntasReflexao: [
      "Quando foi a última vez que você parou para celebrar uma conquista — grande ou pequena?",
      "Quem são as pessoas que merecem estar na sua celebração?",
      "Você tende a pular a celebração e ir direto para o próximo desafio?",
    ],

    quiz: [
      {
        id: "paus-4-q1",
        question: "O que o portal de bastões com guirlandas simboliza?",
        options: ["Prisão", "Passagem e celebração de conquista", "Morte", "Teste"],
        correctIndex: 1,
        explanation: "O portal marca a transição para um espaço de segurança e celebração.",
      },
      {
        id: "paus-4-q2",
        question: "Na Cabala, o Quatro de Paus corresponde a:",
        options: ["Gevurah em Briah", "Chesed em Atziluth", "Tiferet em Assiah", "Hod em Yetzirah"],
        correctIndex: 1,
        explanation: "É Chesed em Atziluth — Misericórdia no Fogo, a expansão generosa.",
      },
      {
        id: "paus-4-q3",
        question: "Qual é o arquétipo do Quatro de Paus?",
        options: ["O Guerreiro", "O Anfitrião", "O Eremita", "O Mártir"],
        correctIndex: 1,
        explanation: "O Anfitrião abre as portas e convida todos a celebrar o que foi conquistado.",
      },
      {
        id: "paus-4-q4",
        question: "Na sombra, o Quatro de Paus pode indicar:",
        options: ["Tragédia", "Harmonia superficial e celebração forçada", "Morte", "Fome"],
        correctIndex: 1,
        explanation: "Na sombra, a festa mascara instabilidade — uma fachada de alegria.",
      },
      {
        id: "paus-4-q5",
        question: "Por que celebrar é importante segundo o Quatro de Paus?",
        options: ["Para impressionar", "Porque sem celebração a jornada perde sentido", "Para gastar dinheiro", "Para esquecer problemas"],
        correctIndex: 1,
        explanation: "Reconhecer vitórias é tão importante quanto conquistá-las — mantém a energia viva.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Celebração",
      luz: "Harmonia, festa e conquista compartilhada",
      sombra: "Alegria superficial e fachada de estabilidade",
      licaoCentral: "Celebrar não é frívolo — é necessário para manter a jornada",
      aplicacaoPratica: "Escolha uma conquista recente e celebre-a de forma significativa",
      fraseFixacao: "O portal se enfeita com flores para quem soube chegar até ele",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 5 DE PAUS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "paus-5",
    subtitulo: "A Arena dos Iguais",
    essencia: "O Cinco de Paus é a carta do conflito criativo, da competição saudável e do embate de ideias. Representa o momento em que múltiplas energias colidem — não para destruir, mas para forjar algo mais forte. É a arena onde se testam as forças.",

    simbolosCentrais: "Cinco jovens brandindo bastões numa aparente batalha — mas olhando com atenção, ninguém é ferido. Os pés estão firmes no chão: é uma competição, não uma guerra. Os bastões se cruzam no ar sem acertar ninguém — é choque de ideias, não de espadas. As roupas diferentes indicam diversidade de origens e perspectivas.",

    arquetipo: "O Competidor — aquele que se fortalece no embate, que precisa do desafio para crescer.",

    luz: "Competição saudável, debate criativo, diversidade de ideias, energia competitiva, crescimento pelo desafio, esportes, brainstorming acalorado. O Cinco de Paus na luz é a arena onde todos saem mais fortes.",

    sombra: "Conflito destrutivo, ego excessivo, briga por poder, caos sem propósito, competição que destrói em vez de construir. Na sombra, os bastões se tornam armas e ninguém escuta ninguém.",

    licaoPratica: "O atrito gera fogo — e fogo gera transformação. O Cinco de Paus ensina que evitar todo conflito é tão prejudicial quanto buscar toda briga. O segredo está no conflito com propósito: debate que refina, competição que eleva.",

    interpretacaoAmor: "Discussões necessárias, competição saudável no casal, paixão que se expressa em intensidade, diferenças que precisam ser negociadas. O Cinco de Paus no amor diz: brigar não é o problema — é como vocês brigam.",

    interpretacaoTrabalho: "Competição por uma vaga, brainstorming intenso, conflito de egos no time, licitação, mercado competitivo. No trabalho, é o desafio que tira você da zona de conforto.",

    interpretacaoEspiritualidade: "Conflito interno entre crenças, ego espiritual, competição entre tradições, teste de convicções. O Cinco de Paus na espiritualidade convida: suas crenças sobrevivem ao debate?",

    vozDaCarta: "Eu sou o barulho que incomoda — mas preste atenção: ninguém está sangrando. Isso aqui é uma forja, não um campo de batalha. Os melhores aços nascem do atrito. Segure seu bastão com firmeza, mas não para machucar — para aprender.",

    aprofundamento: `O Cinco de Paus é frequentemente temido por parecer violento, mas na tradição Rider-Waite-Smith é notável que ninguém está realmente ferido. Os cinco jovens parecem mais estar praticando do que lutando — é o equivalente medieval do treino esportivo.

Na numerologia, o 5 é o número da instabilidade dinâmica — rompe a estabilidade do 4 para gerar movimento. Em Paus, essa ruptura é energética: é o fogo que precisa de oxigênio (conflito) para continuar ardendo.

Na Cabala, o Cinco de Paus corresponde a Gevurah em Atziluth — a Severidade no mundo do Fogo. Gevurah é a força que testa, que julga, que elimina o fraco para fortalecer o todo. É Marte em Leão — energia guerreira a serviço da criação.

Historicamente, os torneios medievais eram exatamente isso: competição ritualizada onde os cavaleiros testavam suas habilidades sem intenção de matar. O Cinco de Paus carrega essa herança — o combate como escola, não como guerra.`,

    perguntasReflexao: [
      "Como você lida com a competição — ela te motiva ou te paralisa?",
      "Existe um conflito na sua vida que poderia ser transformado em crescimento?",
      "Suas ideias sobrevivem ao debate — ou você evita ser desafiado?",
    ],

    quiz: [
      {
        id: "paus-5-q1",
        question: "Por que ninguém é ferido no Cinco de Paus?",
        options: ["Estão protegidos", "É competição, não guerra", "São imortais", "Estão brincando"],
        correctIndex: 1,
        explanation: "O Cinco de Paus mostra competição saudável — embate de ideias, não destruição.",
      },
      {
        id: "paus-5-q2",
        question: "Na Cabala, o Cinco de Paus corresponde a:",
        options: ["Chesed em Briah", "Gevurah em Atziluth", "Tiferet em Yetzirah", "Netzach em Assiah"],
        correctIndex: 1,
        explanation: "É Gevurah em Atziluth — Severidade no Fogo, a força que testa para fortalecer.",
      },
      {
        id: "paus-5-q3",
        question: "Qual é o arquétipo do Cinco de Paus?",
        options: ["O Pacifista", "O Competidor", "O Sábio", "O Louco"],
        correctIndex: 1,
        explanation: "O Competidor se fortalece no embate — precisa do desafio para crescer.",
      },
      {
        id: "paus-5-q4",
        question: "Na sombra, o Cinco de Paus indica:",
        options: ["Paz excessiva", "Conflito destrutivo e ego excessivo", "Preguiça", "Depressão"],
        correctIndex: 1,
        explanation: "Na sombra, a competição destrói em vez de construir — bastões viram armas.",
      },
      {
        id: "paus-5-q5",
        question: "As roupas diferentes dos cinco jovens representam:",
        options: ["Pobreza", "Diversidade de origens e perspectivas", "Fantasia", "Uniforme"],
        correctIndex: 1,
        explanation: "As roupas variadas indicam que pessoas de origens diferentes trazem perspectivas diferentes.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Competição",
      luz: "Embate criativo que fortalece todos os envolvidos",
      sombra: "Conflito destrutivo e egos em colisão",
      licaoCentral: "O atrito gera fogo — e fogo gera transformação",
      aplicacaoPratica: "Aceite um desafio que te tire da zona de conforto hoje",
      fraseFixacao: "Os melhores aços nascem do atrito, não do silêncio",
    },
  },
];
