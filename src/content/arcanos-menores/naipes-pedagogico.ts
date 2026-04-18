/**
 * @deprecated Fase 6.5 — não use no runtime.
 * Conteúdo agora vive em `cms_suits` e é lido via `getSuitContent` /
 * `useSuitIntroContent`. Mantido apenas como fallback através de
 * `repo-legacy-suits.ts` e como referência editorial.
 *
 * Conteúdo pedagógico dos 4 naipes — introduções ricas e didáticas.
 */

import { type Naipe } from "./index";

export interface NaipePedagogico {
  naipe: Naipe;
  /** Texto principal curto */
  textoPrincipal: string;
  /** Aprofundamento simbólico */
  aprofundamentoSimbolico: string;
  /** Eixo elemental */
  eixoElemental: {
    titulo: string;
    texto: string;
  };
  /** Eixo psicológico */
  eixoPsicologico: {
    titulo: string;
    texto: string;
  };
  /** Eixo prático */
  eixoPratico: {
    titulo: string;
    texto: string;
  };
  /** Aplicações em leitura */
  aplicacoesLeitura: string[];
  /** Frase de abertura (poética) */
  fraseAbertura: string;
  /** Pergunta reflexiva */
  reflexao: string;
}

export const NAIPES_PEDAGOGICO: Record<Naipe, NaipePedagogico> = {
  copas: {
    naipe: "copas",
    fraseAbertura: "Onde há água, há sentimento. Onde há sentimento, há vida.",
    textoPrincipal: `Copas é o naipe do coração. Ele fala sobre tudo aquilo que sentimos, mas nem sempre sabemos nomear — o amor que transborda, a saudade que aperta, a alegria que ilumina, o medo de se entregar.

Cada carta de Copas é um espelho emocional. Elas não descrevem eventos externos, mas estados internos: como você se sente, como se conecta, como ama, como se cura. É o naipe mais íntimo do tarô.

Quando Copas aparece em uma leitura, a mensagem é sempre sobre vínculo — consigo mesma, com o outro, com a vida. Ele pergunta: "O que o seu coração está dizendo?"`,

    aprofundamentoSimbolico: `Na tradição do tarô, Copas está associado ao cálice — o recipiente sagrado que contém as emoções e a vida espiritual. O cálice aparece nas lendas do Santo Graal como símbolo da busca pela completude interior.

A água, elemento de Copas, é fluida, adaptável e profunda. Ela assume a forma do recipiente que a contém — assim como nossas emoções são moldadas pelas circunstâncias. A água pode ser calma como um lago ou devastadora como uma tempestade. Copas carrega essa dualidade.

No baralho Rider-Waite-Smith, as cartas de Copas frequentemente mostram cenas à beira d'água, nuvens refletidas, peixes e lótus — todos símbolos do mundo emocional e da conexão entre consciente e inconsciente.

Nas tradições esotéricas, Copas corresponde ao naipe de Corações no baralho comum e está ligado à direção Oeste — o lugar do pôr do sol, do recolhimento e da introspecção.`,

    eixoElemental: {
      titulo: "Água — O Elemento de Copas",
      texto: `A água é o elemento da fluidez, da receptividade e da profundidade. Ela não força — ela flui. Não ataca — ela envolve. Não ilumina — ela reflete.

No tarô, a água representa o inconsciente, as emoções, a intuição e os sonhos. Quando Copas domina uma leitura, o momento pede entrega, sensibilidade e escuta interior — não ação forçada.

A água também é o elemento da cura. Lágrimas limpam, banhos purificam, rios renovam. Copas nos lembra que sentir profundamente não é fraqueza — é a forma mais corajosa de estar viva.`,
    },

    eixoPsicologico: {
      titulo: "O Mundo Interior — A Psicologia de Copas",
      texto: `Psicologicamente, Copas governa a inteligência emocional: a capacidade de reconhecer, nomear e processar sentimentos. Ele fala sobre empatia, vulnerabilidade, apego e desapego.

Nas cartas numerais (Ás ao 10), Copas conta a história do coração — do primeiro impulso emocional (Ás) até a realização afetiva completa (10). No caminho, há paixão (2), celebração (3), tédio (4), perda (5), nostalgia (6), ilusão (7), desapego (8), satisfação (9) e plenitude (10).

Nas cartas da corte, Copas mostra diferentes formas de se relacionar com as emoções: o Pajem que está aprendendo a sentir, o Cavaleiro que se lança em busca do amor, a Rainha que domina sua vida emocional e o Rei que integra sentimento e sabedoria.`,
    },

    eixoPratico: {
      titulo: "Copas na Vida Real",
      texto: `No dia a dia, Copas aparece quando o tema é: relacionamentos amorosos, amizades profundas, vida familiar, criatividade artística, saúde emocional e espiritualidade.

É o naipe que responde perguntas como: "Ele me ama?", "Devo perdoar?", "Por que estou tão triste?", "Como posso me abrir mais?", "O que meu coração quer?"

Copas não é sobre fazer — é sobre sentir. Quando esse naipe domina uma tiragem, o conselho raramente é agir. É parar, escutar, acolher e permitir que o sentimento encontre seu caminho natural.`,
    },

    aplicacoesLeitura: [
      "Quando Copas domina a leitura, o foco é emocional — não prático.",
      "Muitas Copas indicam momento de sensibilidade aumentada e necessidade de acolhimento.",
      "Copas invertidas frequentemente apontam emoções reprimidas ou negadas.",
      "Em leituras de amor, Copas é o naipe mais relevante — ele fala diretamente sobre o vínculo.",
      "Copas + Espadas na mesma leitura sugere conflito entre o que se sente e o que se pensa.",
      "A ausência total de Copas em uma leitura pode indicar desconexão emocional.",
    ],

    reflexao: "Neste momento, como está o seu mundo emocional? Você está se permitindo sentir ou está evitando algo que precisa ser acolhido?",
  },

  paus: {
    naipe: "paus",
    fraseAbertura: "Onde há fogo, há vontade. Onde há vontade, há criação.",
    textoPrincipal: `Paus é o naipe da energia em movimento. Ele fala sobre aquilo que nos impulsiona — a vontade de criar, de conquistar, de transformar o mundo ao nosso redor.

Cada carta de Paus é uma centelha. Elas descrevem impulsos, desejos, projetos, ambições e a força vital que nos move para frente. É o naipe mais dinâmico do tarô — inquieto, corajoso e, às vezes, impaciente.

Quando Paus aparece em uma leitura, a mensagem é sobre ação — não pensamento, não sentimento, mas movimento. Ele pergunta: "O que você está criando? Para onde está direcionando sua energia?"`,

    aprofundamentoSimbolico: `Na tradição do tarô, Paus está associado ao bastão — símbolo de poder, autoridade e força criativa. O bastão é uma extensão do braço, uma ferramenta de ação e, nas tradições mais antigas, um símbolo fálico de criação.

O fogo, elemento de Paus, é transformador por natureza. Ele destrói para criar, ilumina para revelar, aquece para nutrir. O fogo não pode ser contido por muito tempo — ele precisa se expandir ou se apaga.

No baralho Rider-Waite-Smith, Paus aparece frequentemente em cenas de movimento — cavalos galopando, figuras em pé segurando bastões, paisagens montanhosas que evocam conquista. A vegetação nos bastões simboliza crescimento e potencial vivo.

Nas tradições esotéricas, Paus corresponde ao naipe de Paus (Clubs) no baralho comum e está ligado à direção Sul — o lugar do sol no auge, do calor máximo e da energia pura.`,

    eixoElemental: {
      titulo: "Fogo — O Elemento de Paus",
      texto: `O fogo é o elemento da transformação, da paixão e da vontade. Ele não espera — ele age. Não pede permissão — ele avança. Não se adapta — ele transforma.

No tarô, o fogo representa a energia criativa, a ambição, a sexualidade, o entusiasmo e a coragem. Quando Paus domina uma leitura, o momento pede ação, iniciativa e fé no próprio poder.

O fogo também é o elemento da inspiração. Artistas, empreendedores, líderes e visionários carregam a energia de Paus. Mas o fogo sem direção queima — e Paus na sombra pode virar impulsividade, agressividade ou burnout.`,
    },

    eixoPsicologico: {
      titulo: "A Força Motriz — A Psicologia de Paus",
      texto: `Psicologicamente, Paus governa a motivação: o que nos faz levantar, criar, lutar e persistir. Ele fala sobre autoconfiança, ambição, identidade e propósito.

Nas cartas numerais (Ás ao 10), Paus conta a história da energia — do primeiro impulso criativo (Ás) até o peso do excesso (10). No caminho, há planejamento (2), expansão (3), celebração (4), competição (5), vitória (6), defesa (7), velocidade (8), resiliência (9) e sobrecarga (10).

Nas cartas da corte, Paus mostra diferentes formas de canalizar a energia: o Pajem curioso e entusiasmado, o Cavaleiro aventureiro e impetuoso, a Rainha magnética e confiante, e o Rei visionário e estrategista.`,
    },

    eixoPratico: {
      titulo: "Paus na Vida Real",
      texto: `No dia a dia, Paus aparece quando o tema é: carreira, projetos criativos, empreendedorismo, sexualidade, esportes, viagens e qualquer situação que exija iniciativa.

É o naipe que responde perguntas como: "Devo começar esse projeto?", "Estou no caminho certo?", "Como reacender minha motivação?", "Qual é o meu propósito?"

Paus é sobre fazer. Quando esse naipe domina uma tiragem, o conselho é agir — com coragem, com foco, com fé. Mas com um alerta: fogo sem controle destrói. A sabedoria de Paus é saber quando avançar e quando recuar.`,
    },

    aplicacoesLeitura: [
      "Quando Paus domina a leitura, o foco é ação e energia — não reflexão passiva.",
      "Muitas cartas de Paus indicam momento de alta energia, projetos em andamento ou necessidade de iniciativa.",
      "Paus invertidos frequentemente apontam falta de motivação, projetos estagnados ou energia mal direcionada.",
      "Em leituras de trabalho, Paus é o naipe mais relevante — ele fala sobre ambição e realização.",
      "Paus + Copas na mesma leitura sugere paixão — tanto criativa quanto romântica.",
      "A ausência total de Paus pode indicar falta de energia, motivação ou direção.",
    ],

    reflexao: "Onde está sua energia agora? Você está criando algo que importa ou está desperdiçando fogo em coisas que não nutrem?",
  },

  espadas: {
    naipe: "espadas",
    fraseAbertura: "Onde há clareza, há corte. Onde há corte, há verdade.",
    textoPrincipal: `Espadas é o naipe da mente. Ele fala sobre tudo que pensamos, decidimos, comunicamos e, muitas vezes, tememos — a verdade que liberta, o conflito que desafia, a palavra que cura ou fere.

Cada carta de Espadas é uma lâmina. Elas descrevem pensamentos, crenças, decisões, dúvidas e a clareza que vem — às vezes — acompanhada de dor. É o naipe mais desafiador do tarô, mas também o mais transformador.

Quando Espadas aparece em uma leitura, a mensagem é sobre verdade — a verdade que você precisa encarar, dizer ou aceitar. Ele pergunta: "O que você está evitando pensar?"`,

    aprofundamentoSimbolico: `Na tradição do tarô, Espadas está associada à lâmina — símbolo de discernimento, justiça e poder intelectual. A espada corta o que é desnecessário, separa verdade de ilusão e defende o que é justo.

O ar, elemento de Espadas, é invisível mas essencial. Ele carrega palavras, ideias, sons e respiração. O ar pode ser uma brisa suave ou um furacão devastador — assim como a mente pode trazer clareza ou destruição.

No baralho Rider-Waite-Smith, Espadas aparece em cenas frequentemente dramáticas — figuras em lágrimas, céus tempestuosos, espadas cravadas nas costas. Isso não significa que Espadas é "negativo" — significa que a verdade nem sempre é confortável.

Nas tradições esotéricas, Espadas corresponde ao naipe de Espadas (Spades) no baralho comum e está ligado à direção Leste — o lugar do amanhecer, da mente desperta e da primeira luz.`,

    eixoElemental: {
      titulo: "Ar — O Elemento de Espadas",
      texto: `O ar é o elemento da comunicação, do intelecto e da liberdade. Ele não se vê — mas se sente. Não se toca — mas move tudo ao redor.

No tarô, o ar representa o pensamento, a lógica, a linguagem e a percepção. Quando Espadas domina uma leitura, o momento pede clareza mental, honestidade e coragem para encarar a verdade — mesmo quando dói.

O ar também é o elemento da mudança. Ventos trazem novas estações, espalham sementes, limpam o céu depois da tempestade. Espadas nos lembra que toda crise mental pode ser uma porta para uma compreensão mais profunda.`,
    },

    eixoPsicologico: {
      titulo: "A Mente em Ação — A Psicologia de Espadas",
      texto: `Psicologicamente, Espadas governa o pensamento analítico, a comunicação e os padrões mentais. Ele fala sobre crenças limitantes, ansiedade, clareza, decisões difíceis e a coragem de dizer a verdade.

Nas cartas numerais (Ás ao 10), Espadas conta a história da mente — da primeira ideia clara (Ás) até o colapso mental (10). No caminho, há escolha difícil (2), dor necessária (3), repouso (4), derrota (5), transição (6), estratégia (7), aprisionamento (8), angústia (9) e fim de ciclo (10).

Nas cartas da corte, Espadas mostra diferentes formas de usar a mente: o Pajem curioso e investigativo, o Cavaleiro direto e às vezes cortante, a Rainha perceptiva e independente, e o Rei analítico e autoritário.`,
    },

    eixoPratico: {
      titulo: "Espadas na Vida Real",
      texto: `No dia a dia, Espadas aparece quando o tema é: decisões difíceis, conflitos, comunicação, estudos, processos legais, saúde mental e qualquer situação que exija clareza e honestidade.

É o naipe que responde perguntas como: "O que devo decidir?", "Estou sendo honesta comigo?", "Como lidar com esse conflito?", "Por que estou tão ansiosa?"

Espadas é sobre pensar com coragem. Quando esse naipe domina uma tiragem, o conselho é olhar de frente, nomear o problema e agir com lucidez. Mas com compaixão: a verdade sem empatia é crueldade.`,
    },

    aplicacoesLeitura: [
      "Quando Espadas domina a leitura, o foco é mental — decisões, conflitos e verdades a encarar.",
      "Muitas Espadas indicam momento de tensão mental, necessidade de clareza ou crise que exige ação.",
      "Espadas invertidas frequentemente apontam confusão mental, mentiras (para si ou para outros) ou paralisia por análise.",
      "Em leituras sobre conflitos, Espadas é o naipe mais relevante — ele revela a natureza do problema.",
      "Espadas + Ouros na mesma leitura sugere preocupações práticas com forte componente mental.",
      "A ausência de Espadas pode indicar que o momento é mais emocional ou prático do que intelectual.",
    ],

    reflexao: "Que verdade você está evitando? E que clareza poderia chegar se você parasse de fugir dela?",
  },

  ouros: {
    naipe: "ouros",
    fraseAbertura: "Onde há raiz, há sustento. Onde há sustento, há florescer.",
    textoPrincipal: `Ouros é o naipe do mundo concreto. Ele fala sobre tudo que é tangível — o corpo, o dinheiro, o trabalho, a casa, a saúde, a comida na mesa, a segurança que permite existir em paz.

Cada carta de Ouros é uma semente plantada no solo. Elas descrevem construções, investimentos, colheitas e a relação que temos com o mundo material — não como ganância, mas como cuidado com a base que sustenta a vida.

Quando Ouros aparece em uma leitura, a mensagem é sobre construção — o que você está plantando, cultivando e colhendo no plano concreto. Ele pergunta: "Sua base está sólida?"`,

    aprofundamentoSimbolico: `Na tradição do tarô, Ouros está associado à moeda ou pentáculo — símbolo de valor, manifestação e integração dos quatro elementos. O pentáculo de cinco pontas representa o espírito governando os elementos — a materialização do sagrado.

A terra, elemento de Ouros, é sólida, fértil e paciente. Ela não se apressa — crescer leva tempo. A terra sustenta tudo que vive, recebe o que morre e transforma o antigo em nutriente para o novo.

No baralho Rider-Waite-Smith, Ouros aparece em cenas de prosperidade e trabalho — artesãos em suas oficinas, jardins floridos, cidades prósperas. A recorrência de paisagens verdes e colheitas simboliza os frutos do esforço consistente.

Nas tradições esotéricas, Ouros corresponde ao naipe de Ouros (Diamonds) no baralho comum e está ligado à direção Norte — o lugar do inverno, da estrutura, da paciência e da sabedoria que vem com o tempo.`,

    eixoElemental: {
      titulo: "Terra — O Elemento de Ouros",
      texto: `A terra é o elemento da estabilidade, da nutrição e da manifestação. Ela não se move com pressa — ela se constrói com paciência. Não brilha — ela sustenta.

No tarô, a terra representa o corpo, a saúde, as finanças, o trabalho e tudo que é tangível e mensurável. Quando Ouros domina uma leitura, o momento pede atenção ao prático — cuidar das bases, investir com consciência, honrar o corpo.

A terra também é o elemento da gratidão. Ela nos lembra que antes de buscar o transcendente, é preciso ter os pés no chão. Ouros ensina que espiritualidade sem cuidado com a matéria é ilusão — e que prosperidade sem propósito é vazio.`,
    },

    eixoPsicologico: {
      titulo: "A Base Sólida — A Psicologia de Ouros",
      texto: `Psicologicamente, Ouros governa a sensação de segurança, o valor próprio e a relação com abundância e escassez. Ele fala sobre autoestima material, generosidade, avareza e a capacidade de construir algo duradouro.

Nas cartas numerais (Ás ao 10), Ouros conta a história da manifestação — do primeiro recurso (Ás) até a herança e legado familiar (10). No caminho, há equilíbrio (2), maestria (3), controle (4), crise financeira (5), generosidade (6), paciência (7), aprendizado (8), luxo e independência (9) e prosperidade geracional (10).

Nas cartas da corte, Ouros mostra diferentes formas de lidar com o mundo material: o Pajem estudioso e prático, o Cavaleiro metódico e trabalhador, a Rainha próspera e generosa, e o Rei empreendedor e abundante.`,
    },

    eixoPratico: {
      titulo: "Ouros na Vida Real",
      texto: `No dia a dia, Ouros aparece quando o tema é: dinheiro, carreira, saúde, moradia, investimentos, corpo e qualquer situação que envolva o mundo material.

É o naipe que responde perguntas como: "Vou conseguir pagar as contas?", "Esse emprego é para mim?", "Como cuidar melhor da minha saúde?", "Estou construindo algo sólido?"

Ouros é sobre construir com paciência. Quando esse naipe domina uma tiragem, o conselho é trabalhar, investir, cuidar do corpo e ter paciência com o tempo. Os frutos de Ouros não são instantâneos — são duradouros.`,
    },

    aplicacoesLeitura: [
      "Quando Ouros domina a leitura, o foco é material — dinheiro, trabalho, saúde, corpo.",
      "Muitas cartas de Ouros indicam momento de construção, investimento ou atenção às necessidades práticas.",
      "Ouros invertidos frequentemente apontam insegurança financeira, desvalorização ou negligência com o corpo.",
      "Em leituras sobre dinheiro e carreira, Ouros é o naipe mais relevante — ele fala sobre recursos e resultados.",
      "Ouros + Copas na mesma leitura sugere a busca por segurança emocional através do material, ou vice-versa.",
      "A ausência de Ouros pode indicar que o momento é mais emocional ou espiritual do que prático.",
    ],

    reflexao: "Sua base está sólida? O que você está construindo agora que vai sustentar sua vida daqui a cinco anos?",
  },
};

export function getNaipePedagogico(naipe: Naipe): NaipePedagogico {
  return NAIPES_PEDAGOGICO[naipe];
}
