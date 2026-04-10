/**
 * Conteúdo editorial — Espadas 1 a 5
 * Modelo padrão: 18 campos por carta.
 */
import { type ArcanoMenorEditorial } from "./index";

export const ESPADAS_1_5: Partial<ArcanoMenorEditorial>[] = [
  // ═══════════════════════════════════════════════════════════════
  // ÁS DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-1",
    subtitulo: "O Corte da Verdade",
    essencia: "O Ás de Espadas é a clareza absoluta — o momento em que a mente corta todas as ilusões e enxerga a verdade nua. É o pensamento em seu estado mais puro e potente: afiado, penetrante, inevitável. Quando aparece, algo precisa ser dito, decidido ou enfrentado.",

    simbolosCentrais: "Uma mão emerge de uma nuvem segurando uma espada coroada com uma coroa de louros e um ramo de oliveira. Seis yods (gotas de luz) caem ao redor. As montanhas ao fundo representam desafios que a mente pode superar. A coroa de louros indica vitória pelo intelecto. O ramo de oliveira promete paz — mas só depois do corte.",

    arquetipo: "A Espada da Verdade — o pensamento que corta o nó górdio, a decisão que muda tudo.",

    luz: "Clareza mental, verdade revelada, decisão firme, nova ideia poderosa, justiça, triunfo intelectual, comunicação direta. O Ás de Espadas na luz é o instante em que você finalmente entende.",

    sombra: "Crueldade intelectual, verdade usada como arma, pensamento obsessivo, frieza emocional, decisão precipitada, palavras que cortam demais. Na sombra, a espada fere quem a empunha.",

    licaoPratica: "A verdade liberta, mas também corta. O Ás de Espadas ensina que clareza mental é um poder — e como todo poder, exige responsabilidade. Diga a verdade, mas com compaixão. Corte o que precisa ser cortado, mas saiba o que preservar.",

    interpretacaoAmor: "Conversa decisiva, verdade que precisa ser dita no relacionamento, clareza sobre sentimentos, decisão que define o rumo do amor. O Ás de Espadas no amor é o corte que cura — dói, mas liberta.",

    interpretacaoTrabalho: "Ideia brilhante, decisão estratégica, contrato importante, vitória em negociação, comunicação que resolve. No trabalho, é o insight que muda o jogo.",

    interpretacaoEspiritualidade: "Despertar mental, corte de ilusões espirituais, discernimento entre verdade e fantasia, meditação profunda. O Ás de Espadas na espiritualidade é o koan zen que silencia a mente tagarela.",

    vozDaCarta: "Eu sou o fio da navalha entre o que você acredita e o que é verdade. Não me empunhe com raiva — me empunhe com precisão. Eu posso libertar ou ferir, dependendo da mão que me segura. A verdade não é gentil. Mas é necessária.",

    aprofundamento: `O Ás de Espadas é o ponto de origem do pensamento no tarô. Na tradição Rider-Waite-Smith, a espada coroada combina dois símbolos aparentemente opostos: a coroa de louros (vitória, glória) e o ramo de oliveira (paz, misericórdia). A mensagem é clara: a verdade conquista, mas também pacifica.

Os seis yods caindo representam a energia divina descendo ao plano mental — o pensamento como dom do alto. Na tradição cabalística, Espadas correspondem ao mundo de Yetzirah (Formação) e ao elemento Ar. O Ás é Keter em Yetzirah — a Coroa no mundo da mente.

Na alquimia, o Ás de Espadas é a Separatio — o processo de separar o puro do impuro, o essencial do supérfluo. Toda clareza mental começa com um corte: o que fica e o que vai.

As montanhas ao fundo são o terreno do pensamento: íngreme, desafiador, solitário. A mente clara não busca conforto — busca altitude. Quanto mais alto, mais claro se vê. Mas também mais frio e mais solitário.`,

    perguntasReflexao: [
      "Existe uma verdade que você está evitando enfrentar — e que te libertaria se fosse dita?",
      "Como você equilibra honestidade intelectual e compaixão emocional?",
      "Qual decisão você está adiando que exige clareza mental agora?",
    ],

    quiz: [
      {
        id: "espadas-1-q1",
        question: "O que a coroa de louros e o ramo de oliveira na espada simbolizam?",
        options: ["Guerra e paz", "Vitória pelo intelecto e paz após a verdade", "Riqueza e poder", "Amor e ódio"],
        correctIndex: 1,
        explanation: "A coroa é vitória intelectual, o ramo de oliveira é a paz que vem depois do corte.",
      },
      {
        id: "espadas-1-q2",
        question: "Qual é o elemento do naipe de Espadas?",
        options: ["Fogo", "Água", "Ar", "Terra"],
        correctIndex: 2,
        explanation: "Espadas é o naipe do Ar — mente, pensamento, comunicação, verdade.",
      },
      {
        id: "espadas-1-q3",
        question: "Na Cabala, o Ás de Espadas corresponde a:",
        options: ["Malkuth em Assiah", "Keter em Yetzirah", "Tiferet em Briah", "Chokmah em Atziluth"],
        correctIndex: 1,
        explanation: "É Keter em Yetzirah — a Coroa no mundo da mente e da formação.",
      },
      {
        id: "espadas-1-q4",
        question: "Na sombra, o Ás de Espadas pode indicar:",
        options: ["Preguiça mental", "Verdade usada como arma e crueldade intelectual", "Amor cego", "Riqueza"],
        correctIndex: 1,
        explanation: "Na sombra, a espada fere — verdade sem compaixão se torna crueldade.",
      },
      {
        id: "espadas-1-q5",
        question: "Na alquimia, o Ás de Espadas representa:",
        options: ["Calcinatio", "Separatio", "Coagulatio", "Solutio"],
        correctIndex: 1,
        explanation: "Separatio é o processo de separar o puro do impuro — o corte essencial.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Clareza",
      luz: "Verdade revelada e decisão firme",
      sombra: "Crueldade intelectual e frieza emocional",
      licaoCentral: "A verdade liberta, mas exige compaixão ao ser dita",
      aplicacaoPratica: "Identifique uma verdade que você evita e enfrente-a com coragem e gentileza",
      fraseFixacao: "A espada corta o nó — mas a mão que a segura escolhe onde",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 2 DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-2",
    subtitulo: "O Impasse da Mente Vendada",
    essencia: "O Dois de Espadas é a carta do impasse, da indecisão e do equilíbrio precário entre duas verdades. Representa o momento em que a mente se recusa a escolher — não por falta de opções, mas por medo das consequências. A venda nos olhos é voluntária.",

    simbolosCentrais: "Uma figura sentada à beira do mar, com os olhos vendados, segura duas espadas cruzadas em equilíbrio perfeito. A lua crescente no céu indica que a intuição está disponível mas não é acessada. O mar atrás representa as emoções bloqueadas pela mente. As pedras na água são obstáculos submersos. A venda é a recusa de ver.",

    arquetipo: "O Juiz Vendado — aquele que tem todas as informações mas se recusa a decidir por medo de perder algo.",

    luz: "Pausa reflexiva, equilíbrio temporário, diplomacia, trégua necessária, meditação antes da decisão. O Dois de Espadas na luz é o momento legítimo de pausa antes de um corte importante.",

    sombra: "Indecisão crônica, negação, bloqueio emocional, recusa de ver a verdade, paralisia por medo de errar. Na sombra, a venda nunca é retirada — e a decisão nunca é tomada.",

    licaoPratica: "Não decidir já é uma decisão — e geralmente a pior. O Dois de Espadas ensina que adiar a escolha não elimina as consequências, apenas as acumula. Tire a venda. Olhe. Escolha.",

    interpretacaoAmor: "Relacionamento em impasse, verdade que ambos evitam, decisão adiada sobre o futuro do casal. O Dois de Espadas no amor diz: vocês estão fingindo que o elefante não está na sala.",

    interpretacaoTrabalho: "Decisão profissional adiada, conflito de interesses não resolvido, duas ofertas sem escolha. No trabalho, é o momento de tirar a venda e confrontar a realidade.",

    interpretacaoEspiritualidade: "Bloqueio intuitivo por excesso de racionalização, negação espiritual, medo de ver a verdade interior. O Dois de Espadas na espiritualidade pede: abra os olhos internos.",

    vozDaCarta: "Eu sei o que não quero ver — e é exatamente por isso que coloquei a venda. As espadas estão equilibradas porque eu me recuso a pender para qualquer lado. Mas o mar atrás de mim está subindo. Em algum momento, vou ter que escolher — ou a água vai escolher por mim.",

    aprofundamento: `O Dois de Espadas é uma das cartas psicologicamente mais precisas do tarô. Na tradição Rider-Waite-Smith, a venda nos olhos é voluntária — a figura não foi vendada por outro, ela mesma se vendou. É a negação como estratégia de sobrevivência.

As duas espadas em equilíbrio representam a dualidade do pensamento: sim/não, verdade/mentira, ficar/partir. A mente que não escolhe se torna prisioneira de ambas as opções.

Na numerologia, o 2 é polaridade e escolha. Em Espadas, a polaridade é mental — dois pensamentos que se contradizem, duas verdades que não podem coexistir. Na Cabala, o Dois de Espadas corresponde a Chokmah em Yetzirah — Sabedoria no mundo da mente. Paradoxalmente, a sabedoria aqui está em reconhecer que não decidir é a escolha mais perigosa.

A lua crescente no canto superior é significativa: a intuição (lua) está disponível, mas a mente racional (espadas) a bloqueia. O Dois de Espadas convida a integrar razão e intuição — não escolher entre elas.`,

    perguntasReflexao: [
      "Existe alguma verdade que você está se recusando a ver — conscientemente?",
      "Que decisão você adia repetidamente, e qual é o custo real dessa indecisão?",
      "Você confia mais na sua razão ou na sua intuição — e o que acontece quando ignora uma delas?",
    ],

    quiz: [
      {
        id: "espadas-2-q1",
        question: "O que a venda nos olhos da figura simboliza?",
        options: ["Cegueira involuntária", "Recusa voluntária de ver a verdade", "Meditação", "Punição"],
        correctIndex: 1,
        explanation: "A venda é voluntária — a figura escolhe não ver para não ter que decidir.",
      },
      {
        id: "espadas-2-q2",
        question: "O que a lua crescente no céu indica?",
        options: ["Noite", "Intuição disponível mas não acessada", "Magia", "Tempo passando"],
        correctIndex: 1,
        explanation: "A lua representa a intuição bloqueada pela racionalização excessiva.",
      },
      {
        id: "espadas-2-q3",
        question: "Qual é o arquétipo do Dois de Espadas?",
        options: ["O Guerreiro", "O Juiz Vendado", "O Sábio", "O Louco"],
        correctIndex: 1,
        explanation: "O Juiz Vendado tem todas as informações mas se recusa a decidir.",
      },
      {
        id: "espadas-2-q4",
        question: "A lição central do Dois de Espadas é:",
        options: ["Nunca decidir", "Não decidir já é uma decisão — e geralmente a pior", "Seguir a multidão", "Ignorar sentimentos"],
        correctIndex: 1,
        explanation: "Adiar a escolha acumula consequências — tire a venda e escolha.",
      },
      {
        id: "espadas-2-q5",
        question: "Na Cabala, o Dois de Espadas corresponde a:",
        options: ["Binah em Atziluth", "Chokmah em Yetzirah", "Malkuth em Assiah", "Keter em Briah"],
        correctIndex: 1,
        explanation: "É Chokmah em Yetzirah — Sabedoria no mundo da mente.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Indecisão",
      luz: "Pausa reflexiva legítima antes de uma decisão",
      sombra: "Negação crônica e paralisia por medo",
      licaoCentral: "Não decidir já é uma decisão — e geralmente a pior",
      aplicacaoPratica: "Identifique uma decisão adiada e comprometa-se a resolvê-la esta semana",
      fraseFixacao: "A venda é voluntária — e só você pode tirá-la",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 3 DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-3",
    subtitulo: "O Coração Trespassado",
    essencia: "O Três de Espadas é a carta da dor que vem da verdade. Representa o momento em que o coração é perfurado pela lucidez — quando se vê claramente o que se preferia negar. É a tristeza inevitável que acompanha toda compreensão profunda.",

    simbolosCentrais: "Um coração vermelho flutuando no céu é trespassado por três espadas. Chuva e nuvens cinzas cobrem toda a cena. Não há figura humana — a dor é universal. As três espadas representam pensamentos que feriram o coração: verdade, separação e perda. A chuva é o luto que purifica.",

    arquetipo: "A Ferida Sagrada — a dor que não destrói, mas que, ao ser sentida plenamente, abre caminho para a cura.",

    luz: "Dor necessária, verdade que liberta ao ferir, luto consciente, catarse, honestidade emocional dolorosa mas transformadora. O Três de Espadas na luz é a cirurgia que salva a vida — dói, mas cura.",

    sombra: "Sofrimento como identidade, vitimismo, ruminação obsessiva, incapacidade de superar, autocomiseração crônica, dor que se torna vício. Na sombra, as três espadas nunca são retiradas.",

    licaoPratica: "A dor não é o inimigo — a resistência à dor é. O Três de Espadas ensina que sentir plenamente a tristeza é o único caminho para atravessá-la. Chorar não é fraqueza — é a chuva que limpa o céu.",

    interpretacaoAmor: "Traição, separação dolorosa, verdade que machuca o relacionamento, coração partido, luto amoroso. O Três de Espadas no amor é a carta mais temida — mas também a mais honesta.",

    interpretacaoTrabalho: "Demissão, rejeição profissional, projeto fracassado, feedback doloroso mas necessário. No trabalho, é o momento de aceitar a perda e aprender com ela.",

    interpretacaoEspiritualidade: "A noite escura da alma, sofrimento como portal de transformação, compaixão nascida da dor, aceitação radical. O Três de Espadas na espiritualidade é a verdade que rompe todas as ilusões espirituais.",

    vozDaCarta: "Eu sei que dói. Eu sei que você preferia não ver. Mas olhe: a chuva já está caindo — e a chuva limpa. Estas espadas não vieram para destruir seu coração. Vieram para abri-lo. Um coração fechado não sente dor — mas também não sente mais nada.",

    aprofundamento: `O Três de Espadas é a carta mais visualmente impactante do tarô — e também uma das mais mal compreendidas. Na tradição Rider-Waite-Smith, a simplicidade da imagem é intencional: coração, espadas, chuva. Sem figuras humanas, sem paisagem — apenas a dor em estado puro.

Na numerologia, o 3 é o número da criação — mas em Espadas, a criação vem da destruição. As três espadas representam os três tipos de dor mental: a verdade que fere, a separação que dilacera e a perda que esvazia.

Na Cabala, o Três de Espadas corresponde a Binah em Yetzirah — a Compreensão no mundo da mente. Binah é a Grande Mãe, associada a Saturno — o planeta da dor, do tempo e da sabedoria que só vem com o sofrimento. Aqui, compreender é sofrer — porque a verdade nem sempre é gentil.

A chuva é um símbolo purificador: na tradição alquímica, a água que cai do céu é a Solutio — a dissolução que precede a reconstrução. O Três de Espadas não é o fim — é o luto necessário para que algo novo possa nascer.`,

    perguntasReflexao: [
      "Existe uma dor que você está evitando sentir — e que te impede de seguir em frente?",
      "Como você lida com verdades dolorosas — as enfrenta ou as enterra?",
      "Quando foi a última vez que você chorou sem resistência — e como se sentiu depois?",
    ],

    quiz: [
      {
        id: "espadas-3-q1",
        question: "O que as três espadas no coração representam?",
        options: ["Vingança", "Verdade, separação e perda — dores mentais que ferem o coração", "Maldição", "Morte"],
        correctIndex: 1,
        explanation: "As três espadas são os três tipos de dor mental que perfuram o emocional.",
      },
      {
        id: "espadas-3-q2",
        question: "O que a chuva simboliza nesta carta?",
        options: ["Tristeza eterna", "Luto purificador que limpa o caminho", "Punição divina", "Mau tempo"],
        correctIndex: 1,
        explanation: "A chuva é purificação — o luto necessário para que algo novo nasça.",
      },
      {
        id: "espadas-3-q3",
        question: "Qual é o arquétipo do Três de Espadas?",
        options: ["A Vítima", "A Ferida Sagrada", "O Carrasco", "O Mártir"],
        correctIndex: 1,
        explanation: "A Ferida Sagrada é a dor que, sentida plenamente, abre caminho para a cura.",
      },
      {
        id: "espadas-3-q4",
        question: "Na Cabala, o Três de Espadas corresponde a:",
        options: ["Chokmah em Atziluth", "Binah em Yetzirah", "Tiferet em Briah", "Chesed em Assiah"],
        correctIndex: 1,
        explanation: "É Binah em Yetzirah — Compreensão no mundo da mente, sabedoria pela dor.",
      },
      {
        id: "espadas-3-q5",
        question: "A lição central do Três de Espadas é:",
        options: ["Evitar a dor a todo custo", "Sentir plenamente a dor é o caminho para atravessá-la", "A dor é punição", "Nunca confiar"],
        correctIndex: 1,
        explanation: "Resistir à dor prolonga o sofrimento — senti-la plenamente é o caminho da cura.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Dor",
      luz: "Verdade dolorosa que liberta e transforma",
      sombra: "Vitimismo e ruminação obsessiva",
      licaoCentral: "Sentir a dor plenamente é o único caminho para atravessá-la",
      aplicacaoPratica: "Permita-se sentir uma dor que você anda evitando — sem julgamento",
      fraseFixacao: "A chuva não é castigo — é a água que limpa o céu depois da tempestade",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 4 DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-4",
    subtitulo: "O Repouso do Guerreiro",
    essencia: "O Quatro de Espadas é a carta do descanso necessário, da recuperação e do retiro estratégico. Representa o momento em que a mente exausta precisa parar — não por derrota, mas por sabedoria. É a pausa que restaura a capacidade de pensar com clareza.",

    simbolosCentrais: "Uma figura repousa sobre um túmulo dentro de uma capela, com três espadas na parede e uma sob o corpo. O vitral colorido mostra uma cena de bênção. As mãos em posição de oração indicam que o descanso é sagrado, não passivo. O ambiente fechado é proteção, não prisão. A espada horizontal sob o corpo indica que mesmo no repouso, a mente permanece alerta.",

    arquetipo: "O Estrategista em Retiro — aquele que se recolhe não por medo, mas para voltar mais forte.",

    luz: "Descanso necessário, retiro estratégico, meditação, recuperação mental, pausa antes da ação, contemplação restauradora. O Quatro de Espadas na luz é o cessar-fogo que salva vidas.",

    sombra: "Isolamento excessivo, fuga pela inércia, estagnação mental, recusa em voltar ao mundo, depressão disfarçada de introspecção. Na sombra, o retiro se torna esconderijo.",

    licaoPratica: "Descansar não é desistir. O Quatro de Espadas ensina que a mente precisa de silêncio para se reorganizar — e que a pausa mais produtiva é aquela que se faz antes do colapso, não depois.",

    interpretacaoAmor: "Pausa no relacionamento, tempo para pensar, distância que traz clareza, necessidade de espaço. O Quatro de Espadas no amor diz: às vezes, o melhor presente é o silêncio.",

    interpretacaoTrabalho: "Férias necessárias, licença, pausa antes de decisão importante, recuperação de burnout. No trabalho, é o sinal de que parar agora evita quebrar depois.",

    interpretacaoEspiritualidade: "Retiro espiritual, meditação profunda, silêncio interior, contemplação, recolhimento sagrado. O Quatro de Espadas na espiritualidade é o monge que fecha a porta — para abrir o universo interior.",

    vozDaCarta: "Eu não estou morto — estou descansando. As espadas na parede são minhas batalhas pausadas, não abandonadas. Voltarei. Mas por agora, o silêncio é meu aliado e o repouso é minha arma. Quem sabe descansar sabe lutar.",

    aprofundamento: `O Quatro de Espadas é frequentemente confundido com uma carta de morte ou rendição, mas na tradição Rider-Waite-Smith é uma carta de sabedoria militar: o retiro estratégico. O cavaleiro não morreu — está em recuperação.

Na numerologia, o 4 é a fundação e a estabilidade. Em Espadas, a estabilidade mental vem do silêncio — parar de pensar para poder pensar melhor. Na Cabala, o Quatro de Espadas corresponde a Chesed em Yetzirah — a Misericórdia no mundo da mente. A misericórdia aqui é consigo mesmo: permitir-se parar.

O vitral na parede da capela é um detalhe significativo: mostra uma cena de bênção, indicando que o descanso é sagrado. Na tradição monástica, o retiro espiritual é considerado uma das práticas mais elevadas — não por inatividade, mas pelo que acontece no silêncio.

A espada horizontal sob o corpo é a espada pessoal do cavaleiro — mesmo em repouso, ela está presente. A mente não se desliga — apenas muda de modo: de combate para contemplação.`,

    perguntasReflexao: [
      "Quando foi a última vez que você se permitiu parar — de verdade — sem culpa?",
      "Você consegue diferenciar descanso necessário de procrastinação?",
      "O que seu corpo e mente estão pedindo agora — ação ou silêncio?",
    ],

    quiz: [
      {
        id: "espadas-4-q1",
        question: "A figura deitada no Quatro de Espadas está:",
        options: ["Morta", "Em repouso estratégico e sagrado", "Derrotada", "Dormindo para sempre"],
        correctIndex: 1,
        explanation: "O cavaleiro não morreu — está em recuperação para voltar mais forte.",
      },
      {
        id: "espadas-4-q2",
        question: "Na Cabala, o Quatro de Espadas corresponde a:",
        options: ["Gevurah em Atziluth", "Chesed em Yetzirah", "Tiferet em Briah", "Hod em Assiah"],
        correctIndex: 1,
        explanation: "É Chesed em Yetzirah — Misericórdia no mundo da mente, compaixão consigo mesmo.",
      },
      {
        id: "espadas-4-q3",
        question: "Qual é o arquétipo do Quatro de Espadas?",
        options: ["O Derrotado", "O Estrategista em Retiro", "O Morto", "O Covarde"],
        correctIndex: 1,
        explanation: "O Estrategista se recolhe para voltar mais forte — sabedoria, não fuga.",
      },
      {
        id: "espadas-4-q4",
        question: "Na sombra, o Quatro de Espadas pode indicar:",
        options: ["Ação extrema", "Isolamento excessivo e fuga pela inércia", "Celebração", "Amor"],
        correctIndex: 1,
        explanation: "Na sombra, o retiro se torna esconderijo — a pausa que nunca termina.",
      },
      {
        id: "espadas-4-q5",
        question: "O vitral na capela simboliza:",
        options: ["Decoração", "Que o descanso é sagrado e abençoado", "Riqueza", "Religião obrigatória"],
        correctIndex: 1,
        explanation: "O vitral sacraliza o descanso — parar é uma forma de oração.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Repouso",
      luz: "Descanso estratégico que restaura a clareza",
      sombra: "Isolamento e fuga disfarçada de introspecção",
      licaoCentral: "Descansar não é desistir — é se preparar para voltar mais forte",
      aplicacaoPratica: "Reserve um momento de silêncio hoje — sem telas, sem distrações",
      fraseFixacao: "Quem sabe descansar sabe lutar — a pausa é a arma mais sábia",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 5 DE ESPADAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: "espadas-5",
    subtitulo: "A Vitória Amarga",
    essencia: "O Cinco de Espadas é a carta da vitória vazia, da derrota disfarçada de conquista e do conflito que deixa todos mais pobres. Representa o momento em que se vence a batalha mas se perde a guerra — porque o preço da vitória foi alto demais.",

    simbolosCentrais: "Uma figura com sorriso ambíguo segura três espadas enquanto duas jazem no chão. Ao fundo, duas figuras derrotadas se afastam cabisbaixas. O céu turbulento indica que ninguém saiu ileso. As espadas no chão são os argumentos ou posições abandonados pelos vencidos. O mar agitado ao fundo reflete o estado emocional de todos.",

    arquetipo: "O Vencedor Solitário — aquele que ganhou tudo e perdeu todos.",

    luz: "Reconhecimento de uma vitória pírrica, aprendizado sobre conflitos destrutivos, estratégia de escolher batalhas, humildade. O Cinco de Espadas na luz é a sabedoria de reconhecer que nem toda vitória vale o preço.",

    sombra: "Manipulação, humilhação do adversário, vitória a qualquer custo, bullying intelectual, desonestidade, trapaça. Na sombra, o sorriso do vencedor é o de quem não vê o vazio ao redor.",

    licaoPratica: "Vencer a qualquer custo é a derrota mais sofisticada. O Cinco de Espadas ensina que a verdadeira inteligência não está em ganhar todos os argumentos, mas em saber quais valem a pena — e quais devem ser largados.",

    interpretacaoAmor: "Briga que vai longe demais, parceiro que precisa ter razão sempre, humilhação no relacionamento, vitória que custa o amor. O Cinco de Espadas no amor alerta: você quer ter razão ou quer ser feliz?",

    interpretacaoTrabalho: "Competição desleal, colega que manipula, política corporativa tóxica, vitória profissional com custo moral. No trabalho, é o resultado que manchou a reputação.",

    interpretacaoEspiritualidade: "Ego espiritual, necessidade de ter razão sobre crenças, conflito de tradições, guru que manipula. O Cinco de Espadas na espiritualidade pergunta: sua busca por verdade inclui humildade?",

    vozDaCarta: "Eu ganhei. Tenho três espadas para provar. Mas olhe ao redor: eles foram embora. O céu está cinza. E estas espadas que eu segurei com tanta força... estão frias. A vitória tem gosto de quê, quando não tem ninguém para compartilhar?",

    aprofundamento: `O Cinco de Espadas é uma das cartas mais controversas do tarô. Na tradição Rider-Waite-Smith, o sorriso ambíguo da figura central é deliberadamente perturbador: é a expressão de quem venceu mas sabe, no fundo, que perdeu algo mais importante.

Na numerologia, o 5 é instabilidade e ruptura. Em Espadas, essa ruptura é social e moral: o conflito que quebra relações, a verdade usada como arma, a inteligência a serviço do ego.

Na Cabala, o Cinco de Espadas corresponde a Gevurah em Yetzirah — a Severidade no mundo da mente. Gevurah é o julgamento — mas aqui, o julgamento é distorcido: julga para vencer, não para fazer justiça.

O céu turbulento é significativo: na tradição Rider-Waite-Smith, o clima reflete o estado moral da cena. Nenhuma vitória genuína acontece sob céus tempestuosos. O conflito poluiu tudo — inclusive o ar (elemento de Espadas).

A lição histórica é a vitória pírrica: Pirro de Épiro venceu os romanos, mas perdeu tantos soldados que disse "mais uma vitória dessas e estou acabado". O Cinco de Espadas é exatamente isso — a vitória que é prelúdio da derrota.`,

    perguntasReflexao: [
      "Você já venceu uma discussão e sentiu que perdeu algo mais importante?",
      "Como você lida com a necessidade de ter razão — ela fortalece ou enfraquece seus relacionamentos?",
      "Existe um conflito atual onde seria mais sábio recuar do que insistir?",
    ],

    quiz: [
      {
        id: "espadas-5-q1",
        question: "O que o sorriso ambíguo do vencedor indica?",
        options: ["Felicidade genuína", "Vitória vazia que ele sabe, no fundo, que custou demais", "Loucura", "Bondade"],
        correctIndex: 1,
        explanation: "O sorriso é perturbador porque a vitória não trouxe satisfação — só solidão.",
      },
      {
        id: "espadas-5-q2",
        question: "Qual é o arquétipo do Cinco de Espadas?",
        options: ["O Herói", "O Vencedor Solitário", "O Sábio", "O Mártir"],
        correctIndex: 1,
        explanation: "O Vencedor Solitário ganhou tudo e perdeu todos — vitória pírrica.",
      },
      {
        id: "espadas-5-q3",
        question: "Na Cabala, o Cinco de Espadas corresponde a:",
        options: ["Chesed em Briah", "Gevurah em Yetzirah", "Tiferet em Atziluth", "Netzach em Assiah"],
        correctIndex: 1,
        explanation: "É Gevurah em Yetzirah — Severidade no mundo da mente, julgamento distorcido.",
      },
      {
        id: "espadas-5-q4",
        question: "A lição central do Cinco de Espadas é:",
        options: ["Vencer sempre", "Nem toda vitória vale o preço", "Nunca lutar", "Ignorar conflitos"],
        correctIndex: 1,
        explanation: "Vencer a qualquer custo é a derrota mais sofisticada.",
      },
      {
        id: "espadas-5-q5",
        question: "O céu turbulento na cena reflete:",
        options: ["Clima real", "Que o conflito poluiu tudo — ninguém saiu ileso", "Fim do dia", "Beleza"],
        correctIndex: 1,
        explanation: "Na tradição RWS, o clima reflete o estado moral — vitórias genuínas têm céus limpos.",
      },
    ],

    revisaoRapida: {
      palavraChave: "Vitória Vazia",
      luz: "Sabedoria de reconhecer que nem toda vitória vale o preço",
      sombra: "Manipulação e humilhação do adversário",
      licaoCentral: "Vencer a qualquer custo é a derrota mais sofisticada",
      aplicacaoPratica: "Escolha um conflito atual e pergunte: ter razão vale mais que a relação?",
      fraseFixacao: "Três espadas na mão e ninguém ao redor — o preço da vitória vazia",
    },
  },
];
