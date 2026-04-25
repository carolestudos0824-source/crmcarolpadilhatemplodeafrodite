export interface LeituraAplicadaLesson {
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

export const LEITURA_APLICADA_LESSONS: LeituraAplicadaLesson[] = [
  {
    id: "la-1", order: 0, title: "Leitura para Amor", subtitle: "Relações afetivas com honestidade", icon: "💕",
    content: `Amor é o tema mais pedido — e o mais distorcido. Muitas leituras afetivas são projeções de desejo: "Ele vai voltar?", "Ela me ama?", "Vai dar certo?"

**Princípios da leitura afetiva:**

**1. A leitura é sobre quem pergunta.** Mesmo que a pergunta seja sobre outra pessoa, a resposta fala da dinâmica — não da mente alheia.

**2. Reformule perguntas fechadas.**
- "Ele vai voltar?" → "Que energia envolve essa dinâmica agora?"
- "Ela me ama?" → "O que eu preciso saber sobre essa conexão?"
- "Vai dar certo?" → "O que essa relação precisa para evoluir?"

**3. Cartas-chave no amor:**
- **Os Enamorados** — Escolha, atração, alinhamento de valores.
- **2 de Copas** — Conexão mútua, parceria, encontro de almas.
- **A Imperatriz** — Fertilidade emocional, cuidado, amor maternal.
- **4 de Paus** — Celebração, lar, estabilidade a dois.
- **O Diabo** — Obsessão, dependência, vínculo tóxico.
- **3 de Espadas** — Dor, traição, verdade difícil.

**4. Cuidado com profecias auto-realizáveis.** Se você diz "as cartas dizem que não vai dar certo", pode criar a sabotagem que gera o resultado.

**Tiragem sugerida para amor (4 cartas):**
1. Minha energia na relação
2. A energia do outro na relação
3. O que nos une
4. O que precisamos trabalhar`,
    keyPoints: ["A leitura é sobre quem pergunta, não sobre a mente alheia", "Reformular perguntas fechadas em abertas", "Cuidado com profecias auto-realizáveis", "Tiragem de 4 cartas: minha energia, a do outro, o que une, o que trabalhar"],
    deepDive: `A tiragem afetiva mais solicitada é variação do "Que ele/ela sente?" — mas essa formulação é eticamente problemática porque tenta acessar a mente alheia. Na prática, o tarô reflete a dinâmica percebida por quem pergunta, não os pensamentos reais do outro. Reformular para "Que energia existe nessa conexão?" produz leituras mais honestas e úteis.`,
    reflection: `Quando você pensa em ler tarô sobre amor, o que realmente quer saber? A verdade sobre a relação — ou confirmação do que deseja ouvir? A resposta honesta a essa pergunta determina a qualidade da leitura.`,
    exercise: { instruction: "Faça a tiragem de 4 cartas para amor sobre uma relação real (pode ser romântica, familiar ou amizade). Registre a interpretação.", type: "practice" },
    quiz: [
      { id: "la1-q1", question: "Como reformular 'Ele vai voltar?'", options: ["'Quando ele vai voltar?'", "'Que energia envolve essa dinâmica agora?'", "'Devo esperar?'", "'É destino?'"], correctIndex: 1, explanation: "Perguntas abertas sobre energia e dinâmica produzem leituras mais honestas e úteis do que perguntas fechadas." },
    ],
  },
  {
    id: "la-2", order: 1, title: "Leitura para Trabalho", subtitle: "Carreira, projetos e propósito", icon: "💼",
    content: `Trabalho é o segundo tema mais pedido. Aqui, o tarô ajuda a clarear decisões de carreira, projetos estagnados, relações profissionais e propósito.

**Perguntas frequentes (e como reformular):**
- "Vou ser promovida?" → "Que energia envolve meu crescimento profissional agora?"
- "Devo largar o emprego?" → "O que eu preciso considerar antes dessa decisão?"
- "Meu negócio vai prosperar?" → "Que forças apoiam e que forças desafiam meu projeto?"

**Cartas-chave no trabalho:**
- **O Mago** — Competência, iniciativa, domínio técnico.
- **O Imperador** — Estrutura, liderança, organização.
- **8 de Ouros** — Dedicação, aprendizado, domínio gradual.
- **Ás de Paus** — Novo projeto, centelha criativa, oportunidade.
- **10 de Ouros** — Prosperidade, herança, estabilidade financeira.
- **5 de Ouros** — Crise financeira, perda, vulnerabilidade material.

**Tiragem para carreira (5 cartas):**
1. Situação atual
2. O que me motiva (ou deveria motivar)
3. Obstáculo principal
4. Força que posso usar
5. Direção mais favorável`,
    keyPoints: ["Reformular perguntas de sim/não em perguntas de clareza", "O Mago, Imperador, 8 de Ouros são cartas-chave profissionais", "Tiragem de 5 cartas para decisões de carreira", "Tarô não decide por você — ilumina a decisão"],
    deepDive: `O tarô tem uma limitação importante em leituras de trabalho: ele mostra tendências e energias, não fatos. "As cartas indicam estagnação" não significa "você será demitida" — significa que a energia atual é de estagnação. A ação humana pode alterar qualquer tendência. Por isso, sempre termine leituras profissionais com: "O que posso fazer para mudar isso?"`,
    reflection: `Se você fizesse uma leitura sobre sua carreira agora, que pergunta faria? A qualidade da pergunta determina a profundidade da resposta.`,
    exercise: { instruction: "Faça a tiragem de 5 cartas para carreira. Interprete cada posição. Que insight novo surgiu?", type: "practice" },
    quiz: [
      { id: "la2-q1", question: "O que a carta 8 de Ouros geralmente indica no trabalho?", options: ["Crise financeira", "Dedicação e domínio gradual", "Demissão", "Sorte inesperada"], correctIndex: 1, explanation: "O 8 de Ouros mostra dedicação ao ofício — aprendizado paciente e domínio gradual da habilidade." },
    ],
  },
  {
    id: "la-3", order: 2, title: "Leitura para Espiritualidade", subtitle: "Autoconhecimento e caminho interior", icon: "🌟",
    content: `Leituras espirituais são sobre autoconhecimento profundo — não sobre "destino" ou "karma" genérico.

**O que uma leitura espiritual pode iluminar:**
- Padrões inconscientes que se repetem
- Lições que a vida está tentando ensinar
- Bloqueios emocionais ou mentais
- O próximo passo na jornada interior
- Conexão com propósito ou missão pessoal

**Perguntas poderosas:**
- "O que minha alma está pedindo agora?"
- "Que padrão estou repetindo inconscientemente?"
- "O que preciso liberar para avançar?"
- "Qual é a lição deste momento da minha vida?"

**Tiragem de autoconhecimento (3 cartas):**
1. O que sei sobre mim (consciente)
2. O que não sei sobre mim (inconsciente)
3. O que minha alma pede agora

**Cartas-chave espirituais:**
- **A Sacerdotisa** — Intuição, silêncio, sabedoria interior.
- **O Eremita** — Introspecção, busca solitária, luz interior.
- **A Estrela** — Esperança, cura, conexão cósmica.
- **O Mundo** — Completude, realização, integração.
- **A Lua** — Inconsciente, medos, ilusões a atravessar.`,
    keyPoints: ["Leituras espirituais iluminam padrões, lições e bloqueios", "Perguntas abertas sobre alma e padrões geram melhores leituras", "Tiragem de 3: consciente, inconsciente, o que a alma pede", "Sacerdotisa, Eremita e Estrela são cartas-chave espirituais"],
    deepDive: `Na tradição junguiana, a leitura espiritual mais poderosa é a que revela a "sombra" — os aspectos de si que negamos ou desconhecemos. Quando A Lua ou O Diabo aparecem em posições espirituais, não indicam "algo ruim" — indicam material inconsciente pedindo integração. A espiritualidade no tarô não é luz eterna; é integração da totalidade.`,
    reflection: `Qual carta do tarô você mais evita ou que mais te incomoda? Essa carta provavelmente contém uma lição espiritual que você precisa — a resistência é o sinal.`,
    exercise: { instruction: "Faça a tiragem de autoconhecimento (3 cartas). Medite 5 minutos sobre a carta do 'inconsciente'. O que ela revela?", type: "practice" },
    quiz: [
      { id: "la3-q1", question: "Qual pergunta é mais adequada para uma leitura espiritual?", options: ["'Vou ficar rica?'", "'O que minha alma está pedindo agora?'", "'Quando vou encontrar o amor?'", "'Qual é meu signo verdadeiro?'"], correctIndex: 1, explanation: "Perguntas sobre a alma e padrões internos são as mais poderosas para leituras espirituais." },
    ],
  },
  {
    id: "la-4", order: 3, title: "Leitura para Família", subtitle: "Dinâmicas familiares e heranças emocionais", icon: "👨‍👩‍👧‍👦",
    content: `Família é tema delicado — envolve heranças emocionais, padrões geracionais e relações carregadas de história.

**Princípios para leituras familiares:**

**1. Você não lê a família — lê sua relação com a família.** As cartas mostram sua perspectiva e dinâmica, não verdades absolutas sobre os outros.

**2. Cuidado com triangulação.** "O que minha mãe sente sobre minha irmã?" — não é sua leitura a fazer. Reformule: "Como posso melhorar minha relação com minha família?"

**3. Padrões geracionais aparecem com frequência.** Cartas repetidas ao longo de várias leituras sobre família podem indicar padrões herdados que precisam ser conscientizados.

**Tiragem familiar (4 cartas):**
1. Herança emocional que carrego
2. Padrão que se repete
3. O que preciso transformar
4. Como encontrar paz nessa dinâmica

**Cartas relevantes:**
- **A Imperatriz / O Imperador** — Figuras materna e paterna.
- **10 de Copas** — Felicidade familiar, harmonia.
- **10 de Paus** — Peso, responsabilidade excessiva, carregar demais.
- **6 de Copas** — Nostalgia, memórias de infância, inocência.`,
    keyPoints: ["Leia sua relação com a família, não a família em si", "Evitar triangulação — cada leitura é sobre quem pergunta", "Padrões geracionais podem aparecer como cartas recorrentes", "10 de Paus e 6 de Copas são cartas-chave em leituras familiares"],
    deepDive: `Padrões geracionais no tarô são fascinantes: quando a mesma carta aparece repetidamente em leituras sobre família — especialmente cartas como O Imperador, A Imperatriz ou 10 de Paus — ela pode estar sinalizando uma dinâmica que se repete através de gerações. Na psicologia familiar, isso é chamado de "transmissão transgeracional".`,
    reflection: `Que papel você ocupa na sua família? Cuidadora? Mediadora? Rebelde? As cartas da corte podem refletir esses papéis — observe qual aparece mais em suas leituras familiares.`,
    exercise: { instruction: "Faça a tiragem familiar de 4 cartas. Foque na carta 'herança emocional'. Que padrão da sua família de origem você reconhece?", type: "practice" },
    quiz: [
      { id: "la4-q1", question: "Por que evitar perguntas como 'O que minha mãe sente sobre minha irmã?'", options: ["Porque é proibido no tarô", "Porque é triangulação — a leitura deve ser sobre quem pergunta", "Porque é impossível ler família", "Porque família não é tema válido"], correctIndex: 1, explanation: "É triangulação — ler sobre a relação entre outras pessoas não é ético nem produtivo. A leitura é sobre quem pergunta." },
    ],
  },
  {
    id: "la-5", order: 4, title: "Leitura para Decisões", subtitle: "Quando você precisa escolher", icon: "🔀",
    content: `Decisões são um dos usos mais práticos e poderosos do tarô. Não porque as cartas decidem por você — mas porque iluminam aspectos que você não está vendo.

**Tiragem de decisão (6 cartas):**
Separe as cartas em dois grupos:
- Caminho A (3 cartas): Energia, desafio, resultado provável
- Caminho B (3 cartas): Energia, desafio, resultado provável

**Regra de ouro:** O tarô mostra tendências, não destinos. A decisão é sempre sua.

**Como interpretar:**
- Compare as energias: qual caminho tem mais fluidez?
- Compare os desafios: qual você está mais preparada para enfrentar?
- Compare os resultados: qual se alinha mais com seus valores?

**Cuidado:** Não repita a tiragem até conseguir o "resultado" que quer. Se as cartas incomodam, é porque estão mostrando algo que você precisa ver.

**Cartas-chave em decisões:**
- **Os Enamorados** — A própria essência da escolha.
- **2 de Espadas** — Indecisão, recusa de ver a verdade.
- **7 de Copas** — Muitas opções, ilusão, fantasias.
- **A Justiça** — Consequências, equilíbrio, verdade.`,
    keyPoints: ["Tarô ilumina aspectos ocultos, não decide por você", "Tiragem de 2 caminhos: energia + desafio + resultado para cada", "Nunca repetir a tiragem para 'mudar' o resultado", "Os Enamorados e A Justiça são cartas centrais em decisões"],
    deepDive: `O filósofo existencialista Jean-Paul Sartre dizia que "não escolher já é uma escolha". No tarô, o 2 de Espadas representa exatamente isso — a paralisia de quem se recusa a decidir, vendada diante de duas espadas. A tiragem de decisão funciona melhor quando feita ANTES de já ter decidido internamente — se você já sabe o que quer, a leitura vira confirmação, não clareza.`,
    reflection: `Quando você pede ajuda ao tarô para decidir, realmente está aberta às duas possibilidades? Ou já decidiu e quer que as cartas confirmem?`,
    exercise: { instruction: "Pense numa decisão real que precisa tomar. Faça a tiragem de 2 caminhos. Compare: qual se alinha mais com seus valores?", type: "practice" },
    quiz: [
      { id: "la5-q1", question: "O que fazer se as cartas mostram algo que você não quer ver?", options: ["Repetir até mudar", "Aceitar que mostram algo que precisa ser visto", "Ignorar a leitura", "Culpar as cartas"], correctIndex: 1, explanation: "Se as cartas incomodam, é porque mostram algo que você precisa ver. Repetir a tiragem não muda a verdade." },
    ],
  },
  {
    id: "la-6", order: 5, title: "Leitura para Bloqueios", subtitle: "Quando algo trava e você não sabe por quê", icon: "🔒",
    content: `Bloqueios são situações em que algo parece travado — carreira estagnada, relacionamento repetitivo, criatividade seca, sensação de "não sair do lugar".

**O tarô é excelente para iluminar bloqueios porque:**
- Mostra o que está por trás da superfície (inconsciente)
- Revela padrões que se repetem sem consciência
- Oferece perspectivas que a mente racional não acessa

**Tiragem para bloqueios (5 cartas):**
1. O que está bloqueado
2. Causa visível (o que sei)
3. Causa oculta (o que não sei)
4. O que perpetua o bloqueio
5. Chave para destravar

**Cartas que frequentemente indicam bloqueios:**
- **4 de Espadas** — Paralisia mental, recusa de agir.
- **8 de Espadas** — Prisão mental auto-imposta.
- **O Enforcado** — Rendição necessária, inversão de perspectiva.
- **A Lua** — Medos inconscientes, ilusões.
- **2 de Espadas** — Recusa de ver a verdade, indecisão.

**Insight importante:** Muitos bloqueios são proteções disfarçadas. A carta "causa oculta" frequentemente revela um medo que, quando conscientizado, perde seu poder.`,
    keyPoints: ["Bloqueios frequentemente têm causas inconscientes", "Tiragem de 5: bloqueio, causa visível, causa oculta, perpetuação, chave", "8 de Espadas e A Lua indicam prisões mentais e medos inconscientes", "Muitos bloqueios são proteções disfarçadas — conscientizar é destravar"],
    deepDive: `Na psicologia, muitos bloqueios são mecanismos de defesa — proteções criadas pelo inconsciente para evitar dor. O 8 de Espadas (prisão mental auto-imposta) e A Lua (medos inconscientes) frequentemente revelam que o bloqueio não é o problema — é a solução que a psique encontrou para um problema mais profundo. Destravar significa encontrar uma solução melhor, não forçar a remoção.`,
    reflection: `Pense num bloqueio persistente na sua vida. E se ele não fosse um obstáculo, mas uma proteção? Do que ele está te protegendo? A resposta pode ser a chave.`,
    exercise: { instruction: "Pense num bloqueio real na sua vida. Faça a tiragem de 5 cartas. Foque na carta 3 (causa oculta): que medo ela revela?", type: "practice" },
    quiz: [
      { id: "la6-q1", question: "O que a carta 8 de Espadas geralmente indica sobre bloqueios?", options: ["Bloqueio externo intransponível", "Prisão mental auto-imposta — a saída existe mas não é vista", "Falta de inteligência", "Problema financeiro"], correctIndex: 1, explanation: "O 8 de Espadas mostra uma prisão mental auto-imposta — a pessoa está presa, mas a saída existe. As vendas impedem de ver." },
    ],
  },
  {
    id: "la-7", order: 6, title: "Leitura do Ano", subtitle: "12 cartas para os 12 meses", icon: "📅",
    content: `A leitura do ano é uma tiragem de 12 cartas — uma para cada mês — que oferece um panorama das energias do ano.

**Como fazer:**
1. Embaralhe com a intenção: "Que energia acompanha cada mês do meu ano?"
2. Tire 12 cartas, uma para cada mês.
3. Opcionalmente, tire uma 13ª carta como tema geral do ano.

**Como interpretar:**
- Cada carta indica a **energia dominante** do mês, não um evento específico.
- Observe padrões: muitas Copas? Ano emocional. Muitas Espadas? Ano mental.
- Observe a sequência: há uma narrativa? Um arco de crescimento?

**Quando fazer:**
- No início do ano (janeiro) ou no seu aniversário.
- Releia mensalmente: compare a previsão com o vivido.

**Tiragem do ano é uma ferramenta de autoconhecimento longitudinal** — mais útil que tiragens pontuais porque mostra tendências ao longo do tempo.`,
    keyPoints: ["12 cartas = 12 meses + 1 carta-tema opcional", "Cada carta indica energia dominante, não evento específico", "Observar padrões de naipes revela o tom geral do ano", "Releitura mensal é a prática mais valiosa"],
    deepDive: `A tiragem do ano tem uma armadilha: a tentação de ler cada carta como previsão literal. "Saiu A Torre em março — algo vai desmoronar!" Não. A carta indica a energia dominante — e como você se relaciona com essa energia determina como o mês se manifesta. A Torre em março pode ser uma revelação libertadora se você estiver aberta à verdade.`,
    reflection: `Se você fizesse a tiragem do ano agora, que mês te preocuparia mais? E qual esperaria com mais curiosidade? Suas expectativas já revelam onde estão seus medos e desejos.`,
    exercise: { instruction: "Faça a tiragem do ano (12 + 1 cartas). Anote cada carta por mês. No final do mês, releia e compare com o vivido.", type: "practice" },
    quiz: [
      { id: "la7-q1", question: "O que cada carta da tiragem do ano indica?", options: ["Um evento que vai acontecer naquele mês", "A energia dominante do mês", "Uma pessoa que vai aparecer", "O dia mais importante do mês"], correctIndex: 1, explanation: "Cada carta indica a energia dominante do mês — não um evento específico ou uma previsão literal." },
    ],
  },
  {
    id: "la-8", order: 7, title: "Quando Não Ler", subtitle: "Os limites saudáveis da leitura temática", icon: "🚫",
    content: `Saber quando **não ler** é tão importante quanto saber ler.

**Não leia quando:**

**1. Está emocionalmente envolvida no tema.** Se é sobre seu relacionamento e você acabou de brigar, a leitura será enviesada. Espere ou peça a outra pessoa que leia.

**2. Quer confirmação, não verdade.** Se está repetindo a mesma pergunta até conseguir a carta que quer, pare. As cartas já responderam.

**3. O tema exige profissional.** Saúde mental, diagnóstico médico, questões legais — encaminhe para o profissional adequado.

**4. O consulente está em crise aguda.** Se alguém está desesperada, chorando ou em estado alterado, o que ela precisa é acolhimento humano, não uma tiragem.

**5. Você não está bem.** Se está cansada, distraída, ansiosa ou doente, a qualidade da leitura cai drasticamente. Cuide de si antes de ler.

**Regra final:** O tarô é uma ferramenta de clareza, não de fuga. Se a leitura está substituindo terapia, decisão ou ação — algo está errado.`,
    keyPoints: ["Não ler quando emocionalmente envolvida no tema", "Não repetir a mesma pergunta até conseguir a 'resposta certa'", "Encaminhar questões de saúde, legais ou crises para profissionais", "O tarô é ferramenta de clareza, não de fuga"],
    deepDive: `A ética de "quando não ler" é uma das marcas de maturidade profissional. Tarólogos iniciantes tendem a ler sempre — para provar competência. Tarólogos experientes sabem que recusar uma leitura é, às vezes, a leitura mais poderosa que se pode oferecer. "Você não precisa de cartas agora — precisa de uma conversa honesta" pode ser mais valioso do que qualquer tiragem.`,
    reflection: `Você já leu tarô quando não deveria? O que aconteceu? A experiência de ler no momento errado ensina tanto quanto ler no momento certo.`,
    exercise: { instruction: "Liste 3 situações pessoais em que você NÃO deveria ler tarô para si mesma. Para cada uma, identifique: o que fazer em vez disso?", type: "writing" },
    quiz: [
      { id: "la8-q1", question: "O que fazer se um consulente está em crise aguda?", options: ["Fazer a leitura rapidamente", "Oferecer acolhimento humano e encaminhar para profissional", "Ignorar o estado emocional", "Ler mais cartas para acalmar"], correctIndex: 1, explanation: "Em crise aguda, o consulente precisa de acolhimento humano, não de tiragem. Se necessário, encaminhe para profissional." },
    ],
  },
  {
    id: "la-9", order: 8, title: "Leitura para Saúde Emocional", subtitle: "O tarô como apoio (não substituto) da terapia", icon: "💗",
    content: `Saúde emocional é tema delicado. O tarô **apoia, mas não substitui** acompanhamento terapêutico. Saber a diferença é parte da ética do ofício.

**O que o tarô PODE fazer em saúde emocional:**
- Iluminar padrões emocionais recorrentes.
- Dar nome a sentimentos difíceis de articular.
- Oferecer perspectivas simbólicas que ampliam autoconhecimento.
- Servir como apoio reflexivo entre sessões de terapia.

**O que o tarô NÃO pode fazer:**
- Diagnosticar transtornos (depressão, ansiedade, TOC, etc).
- Substituir psicoterapia ou psiquiatria.
- Garantir cura emocional.
- Resolver crises agudas (luto recente, ideação suicida, surtos).

**Tiragem de saúde emocional (4 cartas):**
1. Como me sinto agora (consciente)
2. O que está por trás desse sentimento (inconsciente)
3. O que preciso acolher
4. Que recurso posso ativar

**Cartas relevantes em saúde emocional:**
- **3 de Espadas** — Dor profunda, luto, traição emocional.
- **9 de Espadas** — Ansiedade, insônia, pensamentos catastróficos.
- **5 de Copas** — Tristeza, foco no que se perdeu.
- **A Estrela** — Esperança, cura, fé renovada.
- **6 de Copas** — Memória afetiva, infância, doçura.
- **4 de Copas** — Apatia, melancolia, recusa do que é oferecido.

**Quando encaminhar imediatamente:**
- Consulente menciona ideação suicida → CVV (188).
- Consulente em surto ou estado alterado → encaminhar para emergência psiquiátrica.
- Consulente com sintomas persistentes (insônia crônica, paralisia, isolamento) → recomendar avaliação profissional.

**A frase que protege:** "O tarô pode iluminar, mas o que você está vivendo merece acompanhamento profissional. Vamos pensar juntas em quem procurar?"`,
    keyPoints: ["Tarô apoia, não substitui terapia ou psiquiatria", "Pode iluminar padrões, dar nome, oferecer perspectiva — não diagnostica", "Tiragem de 4: sinto / inconsciente / acolher / recurso", "Ideação suicida ou crise aguda exige encaminhamento imediato"],
    deepDive: `A relação entre tarô e psicoterapia foi profundamente trabalhada por Sallie Nichols ("Jung and Tarot") e Arthur Rosengarten ("Tarot and Psychology"). Ambos defendem que o tarô pode ser ferramenta complementar — nunca substituta — do trabalho clínico. Em alguns países, terapeutas usam tarô em sessão como recurso projetivo, similar ao Rorschach. No Brasil, a fronteira é clara: terapia é trabalho de psicólogo registrado; tarô é ferramenta simbólica de apoio.`,
    reflection: `Você já leu tarô para alguém em sofrimento emocional intenso? Como se sentiu? Saber identificar quando a leitura ajuda e quando ela não basta é uma das competências mais importantes do ofício.`,
    exercise: { instruction: "Faça a tiragem de 4 cartas para saúde emocional sobre como você está agora. Foque na carta 4 (recurso): que ferramenta interna você pode ativar?", type: "practice" },
    quiz: [
      { id: "la9-q1", question: "Se um consulente menciona ideação suicida durante uma leitura, o que fazer?", options: ["Fazer uma tiragem de proteção", "Acolher e encaminhar imediatamente para CVV (188) ou emergência", "Continuar a leitura normalmente", "Dizer que vai melhorar"], correctIndex: 1, explanation: "Ideação suicida exige encaminhamento profissional imediato. Acolha humanamente e oriente sobre o CVV (188) ou emergência psiquiátrica." },
    ],
  },
  {
    id: "la-10", order: 9, title: "Leitura para Transições", subtitle: "Quando tudo está mudando ao mesmo tempo", icon: "🌗",
    content: `Transições são momentos em que a vida muda de fase: mudança de cidade, fim ou início de relacionamento, troca de carreira, perda significativa, nascimento, entrada em nova década de vida. O tarô é especialmente útil nesses momentos porque oferece **estrutura simbólica para o que ainda não tem nome**.

**Por que ler tarô em transições:**
- A mente racional não dá conta do volume de mudança.
- O simbólico organiza o caos antes que a lógica consiga.
- Cartas oferecem perspectiva quando você está dentro demais para ver.
- A leitura cria espaço de pausa em meio ao turbilhão.

**Tiragem para transições (5 cartas):**
1. O que estou deixando para trás
2. O que ainda me prende
3. O umbral que estou atravessando agora
4. O que está nascendo
5. O que preciso lembrar para sustentar a travessia

**Cartas-chave em transições:**
- **A Morte** — Fim necessário, transformação profunda.
- **A Torre** — Colapso de estrutura antiga, revelação súbita.
- **O Enforcado** — Suspensão, espera fértil, inversão de perspectiva.
- **O Julgamento** — Renascimento, chamado interior, recomeço.
- **A Roda da Fortuna** — Ciclos, mudança inevitável, novo capítulo.
- **6 de Espadas** — Travessia, deixar para trás, atravessar águas.
- **8 de Copas** — Partida, abandono consciente, busca de mais.

**O que a transição pede:**
- **Paciência.** Transições têm seu tempo. Forçar é destruir.
- **Luto.** Toda mudança envolve perda — mesmo as boas.
- **Cuidado.** Você está mais vulnerável durante transições. Reduza o ritmo.
- **Apoio.** Não atravesse sozinha. Amigos, terapia, comunidade — peça ajuda.

**O que evitar:**
- Tomar decisões definitivas no meio do caos (mude um elemento por vez).
- Buscar conforto em padrões antigos que você está justamente deixando.
- Comparar sua transição com a de outras pessoas — cada travessia tem seu ritmo.

**A leitura final em transições:** Não pergunte "quando termina?" — pergunte "o que esta passagem está me ensinando?" A primeira pergunta gera ansiedade; a segunda, sabedoria.`,
    keyPoints: ["Transições pedem leitura por organizarem o caos simbolicamente", "Tiragem de 5: deixar / prender / umbral / nascer / lembrar", "Morte, Torre, Enforcado, Julgamento, Roda — cartas centrais", "Não tomar decisões definitivas em meio ao caos — pedir apoio"],
    deepDive: `O antropólogo Arnold van Gennep estudou os "ritos de passagem" e identificou três fases universais: separação (deixar o antigo), liminaridade (estar entre, no umbral), e incorporação (entrar no novo). O tarô mapeia perfeitamente essas fases: A Morte é separação, O Enforcado é liminaridade, O Julgamento é incorporação. Saber identificar em qual fase o consulente está é meio caminho para uma leitura útil em transição.`,
    reflection: `Você está numa transição agora — mesmo pequena? Que fase: separação, liminaridade, incorporação? Identificar a fase muda completamente o conselho que faz sentido.`,
    exercise: { instruction: "Pense em uma transição atual ou recente. Faça a tiragem de 5 cartas. Foque na carta 3 (umbral): o que ela revela sobre o momento exato em que você está?", type: "practice" },
    quiz: [
      { id: "la10-q1", question: "Em meio a uma transição, qual pergunta gera mais sabedoria?", options: ["'Quando isso vai terminar?'", "'O que esta passagem está me ensinando?'", "'Por que isso aconteceu comigo?'", "'Quem é culpado?'"], correctIndex: 1, explanation: "'O que esta passagem está me ensinando?' transforma o caos em aprendizado. 'Quando termina?' apenas alimenta a ansiedade." },
    ],
  },
];
