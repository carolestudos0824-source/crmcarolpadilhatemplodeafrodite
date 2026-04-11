export interface ArquiteturaMenoresLesson {
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

export const ARQUITETURA_MENORES_LESSONS: ArquiteturaMenoresLesson[] = [
  {
    id: "am-1",
    order: 0,
    title: "A Estrutura dos 56",
    subtitle: "Como os Arcanos Menores organizam a experiência humana",
    icon: "🗺",
    content: `Os Arcanos Menores são 56 cartas divididas em 4 naipes de 14 cartas cada. Enquanto os Arcanos Maiores representam **arquétipos universais** — forças cósmicas que transcendem o indivíduo — os Menores tratam da **experiência cotidiana**: emoções, ações, pensamentos e realidades materiais.

**A grande armadilha:** Muitos estudantes tratam os Menores como cartas "menores" em importância. Isso é um erro. Na prática da leitura, os Menores aparecem com muito mais frequência e são onde a vida real se manifesta. Os Maiores dão o tom; os Menores contam a história.

**Estrutura de cada naipe:**
- **10 cartas numeradas** (Ás a 10) — A jornada do elemento, do potencial puro à completude.
- **4 cartas da corte** (Pajem, Cavaleiro, Rainha, Rei) — Pessoas, posturas ou estágios de maturidade da energia.

**Os 4 naipes e seus domínios:**
- **Copas (Água)** — Emoções, relacionamentos, intuição, mundo interior.
- **Paus (Fogo)** — Ação, criatividade, paixão, força vital, projetos.
- **Espadas (Ar)** — Mente, pensamento, conflito, verdade, comunicação.
- **Ouros (Terra)** — Material, corpo, dinheiro, saúde, manifestação concreta.

Cada naipe funciona como um capítulo da vida. Juntos, cobrem todas as dimensões da experiência humana.`,
    keyPoints: [
      "56 cartas: 4 naipes × 14 cartas (10 numeradas + 4 corte)",
      "Menores = vida cotidiana; Maiores = arquétipos universais",
      "Cada naipe cobre uma dimensão: emoção, ação, mente, matéria",
      "Na prática, os Menores são tão importantes quanto os Maiores",
    ],
    deepDive: `Na tradição original do tarô de Marselha, os Arcanos Menores não tinham cenas ilustradas — apenas padrões geométricos dos símbolos do naipe. Foi Pamela Colman Smith que revolucionou o tarô ao ilustrar todas as 56 cartas com cenas narrativas completas, tornando possível ler os Menores de forma intuitiva.`,
    exercise: { instruction: "Separe as 56 cartas menores em 4 montes por naipe. Para cada monte, escreva: qual dimensão da vida ele representa? Que situações do seu cotidiano ele cobre?", type: "practice" },
    quiz: [
      { id: "am1-q1", question: "Quantas cartas tem cada naipe dos Arcanos Menores?", options: ["10", "12", "14", "16"], correctIndex: 2, explanation: "Cada naipe tem 14 cartas: 10 numeradas (Ás a 10) + 4 da corte (Pajem, Cavaleiro, Rainha, Rei)." },
      { id: "am1-q2", question: "Qual naipe está associado ao elemento Fogo?", options: ["Copas", "Espadas", "Paus", "Ouros"], correctIndex: 2, explanation: "Paus está associado ao Fogo — ação, criatividade, paixão e força vital." },
    ],
  },
  {
    id: "am-2",
    order: 1,
    title: "Os 4 Elementos nos Naipes",
    subtitle: "Água, Fogo, Ar e Terra como linguagem",
    icon: "🌊",
    content: `Cada naipe é regido por um dos 4 elementos clássicos. Compreender os elementos é ter a chave para interpretar qualquer carta menor.

**Copas — Água 💧**
A água é receptiva, fluida, profunda. Copas trata de tudo que sentimos: amor, saudade, alegria, tristeza, conexão, intuição. É o mundo interior — o que não se vê, mas se sente. Quando Copas domina uma leitura, a questão é emocional.

**Paus — Fogo 🔥**
O fogo é ativo, criativo, transformador. Paus trata de ação, projetos, ambição, energia criativa e impulso vital. É o que nos move — a centelha que inicia. Quando Paus domina, a questão é sobre ação, propósito ou criatividade.

**Espadas — Ar ⚔️**
O ar é mental, cortante, claro. Espadas trata de pensamentos, decisões, conflitos, verdades e comunicação. É o domínio da mente — poderosa para cortar ilusões, mas perigosa quando corta a si mesma. Quando Espadas domina, a questão é mental ou comunicacional.

**Ouros — Terra 💎**
A terra é sólida, concreta, fértil. Ouros trata de dinheiro, saúde, trabalho, corpo e manifestação material. É o que se toca — o resultado concreto. Quando Ouros domina, a questão é prática, financeira ou física.

**Interações entre elementos:**
- Água + Fogo = tensão (emoção vs. ação)
- Ar + Terra = complemento (ideia → concretização)
- Água + Terra = fertilidade (emoção que gera resultado)
- Fogo + Ar = expansão (ação alimentada por ideias)`,
    keyPoints: [
      "Copas/Água = emoções; Paus/Fogo = ação; Espadas/Ar = mente; Ouros/Terra = matéria",
      "O elemento dominante numa leitura indica a natureza da questão",
      "Elementos interagem: podem se complementar ou tensionar",
      "Dominar os elementos permite ler qualquer carta menor pela essência",
    ],
    exercise: { instruction: "Para a próxima semana, quando algo relevante acontecer no seu dia, pergunte: 'Isso é Copas, Paus, Espadas ou Ouros?' Registre num caderno.", type: "practice" },
    quiz: [
      { id: "am2-q1", question: "Uma leitura dominada por Espadas sugere que a questão central é:", options: ["Emocional", "Financeira", "Mental ou comunicacional", "Criativa"], correctIndex: 2, explanation: "Espadas = Ar = mente, pensamentos, comunicação, conflitos mentais." },
      { id: "am2-q2", question: "Qual é a interação entre Água (Copas) e Fogo (Paus)?", options: ["Harmonia natural", "Tensão — emoção vs. ação", "Indiferença", "Destruição mútua"], correctIndex: 1, explanation: "Água e Fogo criam tensão — emoção e ação são forças que precisam ser equilibradas." },
    ],
  },
  {
    id: "am-3",
    order: 2,
    title: "A Jornada dos Números",
    subtitle: "Do Ás ao 10 — o ciclo de cada elemento",
    icon: "🔢",
    content: `Cada naipe conta uma história em 10 capítulos — do Ás (semente) ao 10 (completude). A mesma progressão se repete nos 4 naipes, mas com a "cor" do elemento.

**Ás** — Oferta divina. A mão que sai das nuvens. Potencial puro, começo.
**2** — Primeira escolha. Dualidade, parceria ou dilema.
**3** — Primeiro resultado. Expansão, criação, celebração ou trabalho conjunto.
**4** — Fundação. Estabilidade, pausa, consolidação — às vezes estagnação.
**5** — Crise. Conflito, perda, desequilíbrio — a saída da zona de conforto.
**6** — Restauração. Harmonia reencontrada, generosidade, equilíbrio.
**7** — Reflexão. Avaliação, escolha interior, busca de sentido.
**8** — Movimento. Energia canalizada, velocidade, domínio ou transição rápida.
**9** — Culminação. Quase lá — realização solitária, peso ou satisfação.
**10** — Completude. Fim de ciclo — plenitude, herança ou peso acumulado.

**Exemplo prático — Copas (emoções):**
Ás = nova emoção → 2 = conexão → 3 = celebração → 4 = acomodação → 5 = perda → 6 = nostalgia/reconciliação → 7 = ilusão/escolha → 8 = partida → 9 = realização emocional → 10 = felicidade plena.

Quando você entende a jornada numérica, consegue ler qualquer carta menor combinando número + elemento.`,
    keyPoints: [
      "Ás = semente; 5 = crise; 10 = completude — ciclo universal",
      "A mesma progressão se repete nos 4 naipes com cores diferentes",
      "Número + elemento = interpretação natural de qualquer Menor",
      "Os números contam uma história de nascimento, crise e resolução",
    ],
    exercise: { instruction: "Separe as 10 cartas numeradas de Copas. Coloque em ordem (Ás a 10) e leia como uma história emocional. Escreva essa história em suas palavras.", type: "practice" },
    quiz: [
      { id: "am3-q1", question: "O que o número 5 representa na jornada de qualquer naipe?", options: ["Estabilidade", "Crise e desequilíbrio", "Completude", "Celebração"], correctIndex: 1, explanation: "O 5 é sempre a crise — o momento que sacode a estabilidade do 4 e força mudança." },
      { id: "am3-q2", question: "Qual é a diferença entre 9 e 10 no ciclo numérico?", options: ["Nenhuma — são iguais", "9 = culminação solitária; 10 = completude/herança", "9 = início; 10 = meio", "9 = crise; 10 = recuperação"], correctIndex: 1, explanation: "O 9 é quase lá — realização solitária. O 10 é a completude final — plenitude ou peso acumulado." },
    ],
  },
  {
    id: "am-4",
    order: 3,
    title: "Como Ler Menores com Profundidade",
    subtitle: "Além do significado superficial",
    icon: "🔍",
    content: `Ler Arcanos Menores com profundidade requer combinar três camadas:

**1. Elemento (naipe)** — Qual dimensão da vida está ativa? Emocional? Mental? Prática? Criativa?

**2. Número** — Em que estágio do ciclo estamos? Começo? Crise? Completude?

**3. Imagem (RWS)** — O que a cena mostra? Qual é a postura? A expressão? O cenário?

**A combinação dessas 3 camadas cria a leitura:**

Exemplo: **5 de Ouros**
- Elemento: Terra (material, dinheiro, corpo)
- Número: 5 (crise, perda, desequilíbrio)
- Imagem: Duas figuras feridas na neve, passando por uma igreja iluminada sem perceber.
- Leitura: Crise material que cega para os recursos disponíveis. A ajuda existe — mas a dor impede de ver.

**Armadilhas a evitar:**
- Ler apenas pelo número, ignorando a imagem.
- Ler apenas pela imagem, ignorando o número e o naipe.
- Tratar Menores como "menos importantes" que Maiores.
- Decorar significados sem entender a lógica por trás.

Quando você domina a tríade elemento-número-imagem, qualquer carta menor se abre para você — mesmo as que nunca estudou.`,
    keyPoints: [
      "Três camadas: elemento + número + imagem = leitura profunda",
      "Nunca ler só pelo número ou só pela imagem",
      "Menores são tão ricos quanto Maiores quando lidos com método",
      "Armadilha: decorar sem entender a lógica do sistema",
    ],
    exercise: { instruction: "Escolha uma carta menor aleatória. Sem consultar nenhum material, interprete-a usando as 3 camadas: elemento + número + imagem. Depois compare com o conteúdo da plataforma.", type: "practice" },
    quiz: [
      { id: "am4-q1", question: "Quais são as 3 camadas para ler um Arcano Menor com profundidade?", options: ["Nome, data e posição", "Elemento, número e imagem", "Cor, tamanho e posição", "Intuição, lógica e memória"], correctIndex: 1, explanation: "Elemento (naipe) + número + imagem (RWS) = as 3 camadas da leitura profunda de Menores." },
    ],
  },
  {
    id: "am-5",
    order: 4,
    title: "Menores e Maiores Juntos",
    subtitle: "Como dialogam na mesma leitura",
    icon: "🤝",
    content: `Numa leitura real, Arcanos Maiores e Menores aparecem juntos. Saber como eles dialogam é essencial.

**Regra fundamental:** Arcanos Maiores indicam **forças maiores** — tendências, lições de vida, energias arquetípicas. Arcanos Menores indicam **como** essas forças se manifestam no cotidiano.

**Exemplo:**
Posição "situação": A Imperatriz (Maior)
Posição "como viver isso": 3 de Copas (Menor)

Leitura: Uma energia de abundância e criação (Imperatriz) se manifesta como celebração emocional, conexão com amigas, alegria compartilhada (3 de Copas).

**Proporção na leitura:**
- Muitos Maiores → Forças grandes em jogo, momento de transformação pessoal.
- Muitos Menores → Questões práticas, cotidianas, ações concretas.
- Equilíbrio → Momento de integração entre o grande e o pequeno.

**Maiores "pesam" mais na leitura** — não porque são "melhores", mas porque representam correntes mais profundas. Um Maior na posição-chave define o tom; os Menores ao redor mostram como esse tom se vive no dia a dia.`,
    keyPoints: [
      "Maiores = forças arquetípicas; Menores = manifestação cotidiana",
      "Muitos Maiores indicam momento de transformação profunda",
      "Muitos Menores indicam questões práticas e ações concretas",
      "Um Maior define o tom; Menores mostram como se vive esse tom",
    ],
    exercise: { instruction: "Faça uma tiragem de 3 cartas. Se saírem Maiores e Menores juntos, observe: qual define o tema principal? Quais detalham o cotidiano?", type: "practice" },
    quiz: [
      { id: "am5-q1", question: "Se uma leitura tem muitos Arcanos Maiores, o que isso sugere?", options: ["Que a leitura deu errado", "Momento de transformação profunda, forças maiores em jogo", "Que as cartas menores são irrelevantes", "Que a pergunta foi superficial"], correctIndex: 1, explanation: "Muitos Maiores indicam que forças arquetípicas maiores estão em ação — momento de transformação." },
    ],
  },
  {
    id: "am-6",
    order: 5,
    title: "Mapa Visual dos 4 Naipes",
    subtitle: "Resumo e revisão antes de mergulhar",
    icon: "🗂",
    content: `Antes de estudar cada naipe em detalhe, vamos consolidar tudo num mapa:

**COPAS — Água 💧**
Domínio: Emoções, amor, intuição, relacionamentos
Estação: Outono
Direção: Oeste
Qualidade: Receptivo, fluido, profundo
Pergunta-guia: "O que eu estou sentindo?"
Excesso: Emocionalidade, dependência, passividade
Falta: Frieza, desconexão, insensibilidade

**PAUS — Fogo 🔥**
Domínio: Ação, criatividade, projetos, paixão
Estação: Primavera
Direção: Sul
Qualidade: Ativo, transformador, expansivo
Pergunta-guia: "O que eu quero criar?"
Excesso: Impulsividade, burnout, agressividade
Falta: Apatia, falta de propósito, estagnação

**ESPADAS — Ar ⚔️**
Domínio: Mente, verdade, comunicação, conflito
Estação: Inverno
Direção: Leste
Qualidade: Cortante, claro, analítico
Pergunta-guia: "O que eu estou pensando?"
Excesso: Ansiedade, crueldade mental, racionalização
Falta: Confusão, falta de clareza, indecisão

**OUROS — Terra 💎**
Domínio: Material, corpo, dinheiro, saúde
Estação: Verão
Direção: Norte
Qualidade: Sólido, concreto, fértil
Pergunta-guia: "O que eu estou construindo?"
Excesso: Materialismo, ganância, rigidez
Falta: Instabilidade, desorganização, negligência do corpo

Com este mapa internalizado, você está pronta para mergulhar em cada naipe.`,
    keyPoints: [
      "Cada naipe tem domínio, estação, direção e pergunta-guia",
      "Excesso e falta de cada elemento indicam desequilíbrio",
      "Este mapa serve de referência rápida para qualquer leitura",
      "Compreender o mapa é pré-requisito para estudar cada naipe",
    ],
    exercise: { instruction: "Desenhe o mapa dos 4 naipes num papel. Para cada um, escreva: elemento, domínio, pergunta-guia, excesso e falta. Use como referência nos próximos módulos.", type: "writing" },
    quiz: [
      { id: "am6-q1", question: "Qual é a pergunta-guia do naipe de Espadas?", options: ["O que estou sentindo?", "O que estou pensando?", "O que estou construindo?", "O que quero criar?"], correctIndex: 1, explanation: "Espadas (Ar) = mente → a pergunta-guia é 'O que eu estou pensando?'" },
      { id: "am6-q2", question: "Qual é o excesso do elemento Fogo (Paus)?", options: ["Frieza", "Materialismo", "Impulsividade e burnout", "Ansiedade"], correctIndex: 2, explanation: "Fogo em excesso vira impulsividade, burnout e agressividade." },
    ],
  },
];
