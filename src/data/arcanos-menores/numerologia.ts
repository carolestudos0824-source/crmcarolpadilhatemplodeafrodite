/**
 * @deprecated Fase 6.5 — não use no runtime.
 * Conteúdo agora vive em `cms_numerologia` e é lido via `getNumerologyContent`
 * (`@/lib/content`). Mantido apenas como fallback de emergência através de
 * `repo-legacy-numerology.ts` e como referência editorial.
 *
 * Numerologia dos Arcanos Menores — significado de cada número (Ás a 10).
 */

export interface NumeroTarot {
  numero: number;
  nome: string;
  subtitulo: string;
  principio: string;
  descricao: string;
  aprofundamento: string;
  comoAfetaCadaNaipe: {
    copas: string;
    paus: string;
    espadas: string;
    ouros: string;
  };
  palavrasChave: string[];
  reflexao: string;
  simbolo: string;
}

export const NUMEROLOGIA: NumeroTarot[] = [
  {
    numero: 1,
    nome: "Ás",
    subtitulo: "A Semente Pura",
    principio: "Potência inicial",
    simbolo: "✦",
    descricao: `O Ás é o começo absoluto — a semente antes da árvore, o primeiro sopro antes da palavra. Ele contém toda a energia do naipe em estado puro e concentrado, como um presente oferecido pelo universo.

Não é ainda uma realização. É uma possibilidade. Uma porta que se abre. Um convite para começar algo novo com a energia mais pura disponível.`,

    aprofundamento: `Na tradição do tarô, os Ases representam as raízes dos quatro elementos. São considerados as cartas mais poderosas dentro de cada naipe porque carregam o potencial total, sem diluição.

O Ás é como a primeira nota de uma sinfonia: define o tom de tudo que vem depois. Ele não garante o resultado — apenas oferece a energia inicial. O que você faz com ela depende das cartas (e escolhas) que se seguem.

Numerologicamente, o 1 é o ponto de partida, a unidade, o indivíduo diante de si mesmo. Não há dualidade ainda, não há conflito — apenas potência pura esperando ser direcionada.`,

    comoAfetaCadaNaipe: {
      copas: "Novo sentimento, início de amor, abertura emocional, intuição desperta.",
      paus: "Nova inspiração, impulso criativo, início de projeto, centelha de paixão.",
      espadas: "Nova ideia, clareza mental súbita, verdade revelada, momento de lucidez.",
      ouros: "Nova oportunidade material, semente financeira, início de prosperidade.",
    },
    palavrasChave: ["Início", "Potencial", "Semente", "Oferta", "Pureza"],
    reflexao: "Que porta está se abrindo agora na sua vida? Você está pronta para receber?",
  },
  {
    numero: 2,
    nome: "Dois",
    subtitulo: "O Espelho e a Escolha",
    principio: "Polaridade",
    simbolo: "☯",
    descricao: `O Dois introduz a dualidade — o momento em que a energia pura do Ás encontra um reflexo, um oposto, uma outra possibilidade. Agora existem dois caminhos, duas forças, duas perspectivas.

É a carta da parceria, da escolha e do equilíbrio. O Dois pergunta: como você se relaciona com o que é diferente de você? Como equilibra forças opostas?`,

    aprofundamento: `O número 2 é o primeiro encontro com o outro. Após a unidade do Ás, surge a percepção de que não estamos sozinhos — existem polaridades em tudo: luz e sombra, dar e receber, agir e esperar.

Na tradição esotérica, o 2 está associado à Grande Sacerdotisa — o véu entre os mundos, a intuição que percebe o que não é dito. É um número receptivo, não ativo.

O desafio do Dois é não ficar paralisado pela escolha. Reconhecer que toda dualidade é, na verdade, complementaridade — e que escolher um caminho não significa que o outro desaparece.`,

    comoAfetaCadaNaipe: {
      copas: "Conexão, parceria, troca emocional, início de vínculo afetivo.",
      paus: "Planejamento, decisão sobre direção, visão de longo prazo, aliança criativa.",
      espadas: "Indecisão, bloqueio mental, necessidade de escolha, recusa a ver a verdade.",
      ouros: "Equilíbrio financeiro, malabarismo entre prioridades, gestão de recursos.",
    },
    palavrasChave: ["Dualidade", "Escolha", "Parceria", "Equilíbrio", "Reflexo"],
    reflexao: "Onde você está dividida? O que aconteceria se parasse de escolher entre e começasse a integrar?",
  },
  {
    numero: 3,
    nome: "Três",
    subtitulo: "A Primeira Floração",
    principio: "Expansão",
    simbolo: "△",
    descricao: `O Três é o resultado do encontro. Quando duas forças se unem, algo novo nasce — uma terceira energia que é maior que a soma das partes. É o número da criação, da expressão e da primeira manifestação visível.

É a carta do crescimento, da celebração e da comunidade. O Três mostra os primeiros frutos daquilo que foi plantado.`,

    aprofundamento: `O 3 é considerado o número da síntese e da criatividade. Na geometria sagrada, o triângulo é a primeira forma fechada — é preciso três pontos para criar uma superfície.

Na tradição do tarô, o Três está associado à Imperatriz — a mãe criativa, a abundância, a natureza em flor. É o número onde a potência do Ás e a escolha do Dois finalmente ganham forma.

O Três é expansivo e generoso, mas também pode ser superficial se não tiver raiz. A alegria do Três é genuína, mas ainda jovem — precisa de estrutura (o Quatro) para se sustentar.`,

    comoAfetaCadaNaipe: {
      copas: "Celebração, amizade, alegria compartilhada, fertilidade emocional.",
      paus: "Expansão de projetos, visão ganhando forma, colaboração criativa.",
      espadas: "Dor necessária, coração partido, verdade dolorosa que permite crescimento.",
      ouros: "Trabalho em equipe, maestria no ofício, reconhecimento profissional.",
    },
    palavrasChave: ["Criação", "Expressão", "Crescimento", "Comunidade", "Síntese"],
    reflexao: "O que está florescendo na sua vida? Você está celebrando seus primeiros frutos ou correndo para o próximo passo?",
  },
  {
    numero: 4,
    nome: "Quatro",
    subtitulo: "Os Alicerces",
    principio: "Estrutura",
    simbolo: "▢",
    descricao: `O Quatro é a estabilização. Depois da expansão do Três, chega o momento de construir fundações — criar ordem, definir limites, organizar o que foi criado. É o número da segurança, da disciplina e da estrutura.

Mas estrutura também pode virar rigidez. O Quatro é a carta que pergunta: você está se protegendo ou se aprisionando?`,

    aprofundamento: `O 4 é o número da materialização. Quatro elementos, quatro estações, quatro direções — é a base sólida sobre a qual tudo se constrói. Na geometria, o quadrado representa estabilidade perfeita.

Na tradição do tarô, o Quatro está associado ao Imperador — autoridade, controle, ordem. É o pai que constrói a casa e define as regras.

O desafio do Quatro é não confundir segurança com estagnação. A estrutura é necessária, mas se for rígida demais, sufoca o crescimento. O Quatro saudável é aquele que cria espaço seguro para a vida continuar se movendo.`,

    comoAfetaCadaNaipe: {
      copas: "Apatia emocional, tédio na relação, necessidade de olhar para dentro e reavaliar.",
      paus: "Celebração de conquista, marco alcançado, momento de colher antes de plantar novamente.",
      espadas: "Repouso forçado, retiro, necessidade de pausa mental, recuperação.",
      ouros: "Controle financeiro, posse, segurança material, mas risco de avareza.",
    },
    palavrasChave: ["Estabilidade", "Ordem", "Limites", "Fundação", "Proteção"],
    reflexao: "Suas bases estão sólidas? A estrutura da sua vida te sustenta ou te limita?",
  },
  {
    numero: 5,
    nome: "Cinco",
    subtitulo: "A Rachadura Necessária",
    principio: "Tensão e ruptura",
    simbolo: "☆",
    descricao: `O Cinco é o tremor. Depois da estabilidade do Quatro, algo se rompe — uma crise, um conflito, uma perda. Mas essa ruptura não é aleatória: ela é necessária. A estrutura que ficou rígida demais precisa ser sacudida para permitir novo crescimento.

O Cinco é desconfortável, mas é o professor mais honesto do tarô. Ele mostra onde você estava presa — e te força a se mover.`,

    aprofundamento: `O 5 é o número do conflito e da mudança. Ele quebra a harmonia do 4 para criar espaço para evolução. Na tradição, está associado ao Hierofante — que, paradoxalmente, representa tradição, mas também a busca por significado além da estrutura.

O Cinco é o ponto médio da jornada numérica (entre 1 e 10). É o momento de maior tensão — o meio do caminho onde nem é possível voltar ao início nem se vê claramente o fim.

Culturalmente, o 5 aparece em muitas tradições como número de transformação: os cinco sentidos, as cinco feridas, as cinco fases do luto. É o número que lembra que crescimento exige desconforto.`,

    comoAfetaCadaNaipe: {
      copas: "Perda, luto, decepção emocional, mas também a possibilidade de ver o que restou.",
      paus: "Competição, conflito de egos, luta por espaço, mas oportunidade de se fortalecer.",
      espadas: "Derrota, humilhação, vitória vazia, mas lição sobre o custo da guerra.",
      ouros: "Perda financeira, exclusão, pobreza temporária, mas lição sobre verdadeiro valor.",
    },
    palavrasChave: ["Crise", "Conflito", "Ruptura", "Lição", "Mudança"],
    reflexao: "Que estrutura está rachando na sua vida? E se essa rachadura for exatamente o que você precisa para crescer?",
  },
  {
    numero: 6,
    nome: "Seis",
    subtitulo: "O Retorno ao Centro",
    principio: "Recomposição",
    simbolo: "✡",
    descricao: `O Seis é a cura depois da crise. Depois da ruptura do Cinco, vem o momento de recompor — reunir os pedaços, encontrar novo equilíbrio, restaurar a harmonia em um nível mais profundo.

É a carta da generosidade, da reconciliação e da beleza que nasce da superação. O Seis não volta ao estado anterior — ele cria algo melhor a partir do que ficou.`,

    aprofundamento: `O 6 é o número da harmonia restaurada. Na geometria sagrada, a Estrela de Davi (hexagrama) representa a união dos opostos — fogo e água, céu e terra, masculino e feminino.

Na tradição do tarô, o Seis está associado aos Enamorados — a escolha feita com o coração, a integração de opostos, o amor que cura. É o número onde a dor do 5 encontra significado.

O Seis é generoso e compassivo, mas pode ser idealista demais. A armadilha é romantizar a dor passada ou buscar harmonia a qualquer custo. O Seis saudável é aquele que encontra equilíbrio sem negar o que aconteceu.`,

    comoAfetaCadaNaipe: {
      copas: "Nostalgia positiva, reencontro, memórias afetivas, inocência revisitada.",
      paus: "Vitória, reconhecimento público, triunfo após esforço, liderança merecida.",
      espadas: "Transição, partida necessária, deixar para trás o que machuca, viagem.",
      ouros: "Generosidade, caridade, equilíbrio entre dar e receber, justiça social.",
    },
    palavrasChave: ["Harmonia", "Cura", "Generosidade", "Reconciliação", "Equilíbrio"],
    reflexao: "O que você reconstruiu depois de uma crise? Que equilíbrio novo emergiu da ruptura?",
  },
  {
    numero: 7,
    nome: "Sete",
    subtitulo: "A Prova Interior",
    principio: "Prova e tensão profunda",
    simbolo: "⟡",
    descricao: `O Sete é o teste. Depois da recomposição do Seis, surge um desafio mais sutil — não externo como o Cinco, mas interno. É a carta da tentação, da dúvida, da fé posta à prova.

O Sete pergunta: agora que você se reconstruiu, quem você é de verdade? O que você escolhe quando ninguém está olhando? É o número do discernimento e da coragem moral.`,

    aprofundamento: `O 7 é considerado o número mais místico e introspectivo. Sete dias da semana, sete chakras, sete notas musicais — é o número da completude cíclica e da busca espiritual.

Na tradição do tarô, o Sete está associado ao Carro — a vontade dirigida, o controle sobre forças opostas, a vitória pela determinação. Mas o Sete também é ambíguo: ele pode indicar ilusão (7 de Copas) ou estratégia (7 de Espadas).

O desafio do Sete é não se perder na complexidade. Quando tudo parece nebuloso, o Sete convida à pausa, à reflexão profunda e à escolha consciente — não impulsiva.`,

    comoAfetaCadaNaipe: {
      copas: "Ilusão, fantasia, excesso de opções, necessidade de discernir desejo de verdade.",
      paus: "Defesa de posição, luta contra adversidades, coragem sob pressão.",
      espadas: "Estratégia, astúcia, engano possível, necessidade de honestidade consigo.",
      ouros: "Paciência, investimento a longo prazo, avaliação de resultados, espera ativa.",
    },
    palavrasChave: ["Teste", "Discernimento", "Fé", "Introspecção", "Tentação"],
    reflexao: "Que prova interior você está enfrentando? Você está sendo honesta consigo mesma sobre o que realmente quer?",
  },
  {
    numero: 8,
    nome: "Oito",
    subtitulo: "O Movimento Consciente",
    principio: "Organização e movimento",
    simbolo: "∞",
    descricao: `O Oito é a ação organizada. Depois da prova do Sete, quem permanece de pé encontra clareza para agir — com método, com foco, com domínio. É o número do poder consciente, da maestria e da transformação deliberada.

O Oito é associado ao infinito (∞) — o fluxo contínuo de energia quando bem direcionada. É a carta que mostra: agora você sabe o que fazer. Faça.`,

    aprofundamento: `O 8 é o número do poder e do equilíbrio dinâmico. Diferente do 4 (estabilidade estática), o 8 é estabilidade em movimento — como a órbita de um planeta ou o fluxo de um rio.

Na tradição do tarô, o Oito está associado à Força (ou Justiça, dependendo do sistema) — o domínio gentil sobre impulsos, a coragem que vem da compaixão, o poder que não precisa se impor.

O Oito também carrega o tema da restrição voluntária (8 de Espadas) e da disciplina focada (8 de Ouros). Nem sempre é confortável — mas é sempre transformador.`,

    comoAfetaCadaNaipe: {
      copas: "Desapego, abandono do que não serve mais, busca por significado mais profundo.",
      paus: "Velocidade, notícias chegando, mudanças rápidas, energia em movimento acelerado.",
      espadas: "Aprisionamento mental, limitação autoimposta, mas possibilidade de libertação.",
      ouros: "Dedicação ao ofício, aprendizado focado, maestria sendo construída, disciplina.",
    },
    palavrasChave: ["Poder", "Maestria", "Movimento", "Foco", "Transformação"],
    reflexao: "Onde você precisa agir com mais foco? Que habilidade está pedindo para ser aprofundada?",
  },
  {
    numero: 9,
    nome: "Nove",
    subtitulo: "O Fruto Maduro",
    principio: "Maturação",
    simbolo: "◉",
    descricao: `O Nove é a colheita quase completa. Depois de todo o caminho — do início (Ás) à crise (5) à reconstrução (6) à prova (7) à maestria (8) — chega o momento de quase-plenitude. É o número da sabedoria adquirida, do desejo realizado, da maturidade.

Mas o Nove também carrega solidão. Quem chega tão longe muitas vezes está sozinha — e precisa lidar com o peso do que conquistou.`,

    aprofundamento: `O 9 é o último número de um dígito — o máximo da individualidade antes da completude do 10. Na numerologia, é o número do sábio, do ermitão, de quem acumulou experiência suficiente para ensinar.

Na tradição do tarô, o Nove está associado ao Eremita — a sabedoria solitária, a lanterna que ilumina o próprio caminho, a busca interior que só pode ser feita sozinha.

O Nove é paradoxal: é realização, mas também isolamento. É abundância, mas também angústia (9 de Espadas). A lição é que plenitude não significa ausência de dor — significa integração dela.`,

    comoAfetaCadaNaipe: {
      copas: "Desejo realizado, satisfação emocional profunda, o 'wish card' do tarô.",
      paus: "Resiliência, última defesa, força interior sob pressão, quase no limite.",
      espadas: "Angústia profunda, insônia, medo noturno, mas a dor é mais mental que real.",
      ouros: "Independência, luxo, autossuficiência, colheita de esforço prolongado.",
    },
    palavrasChave: ["Sabedoria", "Maturidade", "Realização", "Solidão", "Colheita"],
    reflexao: "O que você já colheu na vida que merece ser reconhecido? O que a solidão da jornada te ensinou?",
  },
  {
    numero: 10,
    nome: "Dez",
    subtitulo: "O Ciclo Completo",
    principio: "Culminação ou excesso",
    simbolo: "⊕",
    descricao: `O Dez é o fim do ciclo. Toda a energia que começou como semente no Ás chegou ao seu ponto máximo — para o bem ou para o mal. É o número da plenitude, do legado, mas também do excesso.

O Dez mostra que nada pode crescer infinitamente. Quando a energia chega ao máximo, algo precisa se transformar — ou o ciclo se repete, ou um novo começa. O Dez é simultaneamente fim e preparação para um novo início.`,

    aprofundamento: `O 10 é o retorno ao 1 em um nível mais elevado (1+0=1). Na numerologia, representa a completude e o início de um novo ciclo. É o número do legado — o que fica depois que o ciclo termina.

Na tradição do tarô, o Dez está associado à Roda da Fortuna — o ciclo eterno de ascensão e queda, o lembrete de que tudo é temporário e que a única constante é a mudança.

O Dez pode ser glorioso (10 de Copas: família feliz) ou devastador (10 de Espadas: fim absoluto). Em ambos os casos, a mensagem é a mesma: este capítulo chegou ao fim. O que vem depois depende de como você carrega o que aprendeu.`,

    comoAfetaCadaNaipe: {
      copas: "Plenitude emocional, família feliz, realização afetiva completa, amor duradouro.",
      paus: "Sobrecarga, peso do excesso, responsabilidade esmagadora, burnout.",
      espadas: "Fim dramático, colapso, traição, mas também: o pior já passou, recomeço possível.",
      ouros: "Herança, legado familiar, riqueza geracional, prosperidade construída com o tempo.",
    },
    palavrasChave: ["Completude", "Legado", "Excesso", "Fim de ciclo", "Transformação"],
    reflexao: "Que ciclo está chegando ao fim na sua vida? O que você quer levar para o próximo capítulo — e o que precisa deixar para trás?",
  },
];

export function getNumeroTarot(numero: number): NumeroTarot | undefined {
  return NUMEROLOGIA.find((n) => n.numero === numero);
}
