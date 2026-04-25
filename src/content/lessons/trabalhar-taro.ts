export interface TrabalharTaroLesson {
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

export const TRABALHAR_TARO_LESSONS: TrabalharTaroLesson[] = [
  {
    id: "tt-1", order: 0, title: "Quando Estou Pronta para Atender?", subtitle: "Do estudo à prática profissional", icon: "🎯",
    content: `A pergunta mais frequente de quem estuda tarô: "Quando estou pronta para ler para outras pessoas?"

**Não existe diploma obrigatório.** Tarô não é profissão regulamentada. Mas existe uma distância enorme entre estudar e atender bem. Aqui está o mapa:

**Você NÃO está pronta quando:**
- Ainda precisa consultar o significado de cada carta
- Não consegue criar narrativa entre as cartas
- Não sabe reformular perguntas do consulente
- Não consegue separar suas projeções da leitura
- Não tem prática com tiragens variadas

**Você ESTÁ pronta quando:**
- Conhece todas as 78 cartas (essência, não decoradas)
- Consegue interpretar combinações sem hesitar
- Sabe reformular perguntas para leituras mais honestas
- Consegue dar notícias difíceis com empatia
- Praticou pelo menos 50 leituras (para si e para conhecidos)
- Sente confiança — não certeza, confiança

**O caminho recomendado:**
1. Estude todos os módulos desta plataforma
2. Pratique com amigos e familiares (sem cobrar)
3. Faça 30-50 leituras gratuitas
4. Peça feedback honesto
5. Comece a cobrar quando sentir que entrega valor real`,
    keyPoints: ["Não existe diploma — mas existe preparo real", "Conhecer as 78 cartas, criar narrativa, reformular perguntas", "30-50 leituras gratuitas antes de cobrar", "Confiança (não certeza) é o sinal de prontidão"],
    deepDive: `A psicóloga Angela Duckworth pesquisa o conceito de "grit" — perseverança apaixonada de longo prazo. No tarô, a prontidão para atender não vem de uma revelação súbita, mas de prática consistente ao longo do tempo. As 50 leituras gratuitas não são apenas treino — são a construção do "grit" necessário para sustentar uma prática profissional.`,
    reflection: `Se alguém te pedisse uma leitura hoje, você se sentiria preparada? Sem julgamento — onde está sua confiança numa escala de 1 a 10? O número é seu mapa.`,
    exercise: { instruction: "Faça um autodiagnóstico honesto: dos 5 critérios de prontidão, quantos você já domina? Quais precisa desenvolver?", type: "reflection" },
    quiz: [
      { id: "tt1-q1", question: "Quantas leituras gratuitas são recomendadas antes de cobrar?", options: ["5-10", "10-20", "30-50", "100+"], correctIndex: 2, explanation: "30-50 leituras gratuitas dão a prática necessária e a confiança para entregar leituras de valor." },
    ],
  },
  {
    id: "tt-2", order: 1, title: "A Condução da Leitura", subtitle: "Do acolhimento à síntese", icon: "🗣",
    content: `Uma leitura profissional não é apenas tirar cartas — é uma **experiência completa** para o consulente. A forma como você conduz é tão importante quanto o que as cartas dizem.

**Estrutura de uma sessão (45-60 min):**

**1. Acolhimento (5 min)**
- Receba o consulente com calma
- Explique brevemente como funciona
- Pergunte se já fez leitura antes

**2. Formulação da pergunta (5-10 min)**
- Ouça o que a pessoa traz
- Ajude a reformular perguntas vagas ou fechadas
- Defina juntos: o que queremos clarear?

**3. Leitura (20-30 min)**
- Embaralhe e disponha as cartas
- Interprete carta a carta, depois em conjunto
- Use linguagem acessível — sem jargão esotérico
- Envolva o consulente: "Isso faz sentido para você?"

**4. Síntese (5-10 min)**
- Resuma o tema central em 2-3 frases
- Destaque o conselho mais importante
- Pergunte: "Ficou alguma dúvida?"

**5. Encerramento (5 min)**
- Agradeça a confiança
- Se apropriado, sugira uma reflexão para casa
- Não prometa resultados — convide à ação consciente`,
    keyPoints: ["Sessão de 45-60 min: acolhimento → pergunta → leitura → síntese → encerramento", "Ajudar a reformular perguntas é parte essencial do trabalho", "Linguagem acessível, sem jargão esotérico", "Envolver o consulente: 'Isso faz sentido para você?'"],
    deepDive: `A técnica de "devolver a pergunta" ("Isso faz sentido para você?") vem da psicoterapia rogeriana de Carl Rogers, que demonstrou que as pessoas encontram suas próprias respostas quando se sentem verdadeiramente ouvidas. No tarô, o consulente não vem buscar a SUA resposta — vem buscar a DELE, que as cartas ajudam a revelar.`,
    reflection: `Na sua última leitura para alguém, quem falou mais — você ou a pessoa? A proporção ideal é 40% você, 60% o consulente. Se você fala mais, está monologando, não lendo.`,
    exercise: { instruction: "Simule uma sessão completa com alguém de confiança. Siga os 5 passos. Peça feedback sobre como se sentiu.", type: "practice" },
    quiz: [
      { id: "tt2-q1", question: "Qual é a estrutura recomendada de uma sessão de tarô profissional?", options: ["Tirar cartas e dizer o significado", "Acolhimento → pergunta → leitura → síntese → encerramento", "Embaralhar e entregar ao consulente", "Ler todas as 78 cartas"], correctIndex: 1, explanation: "Uma sessão profissional segue 5 etapas: acolhimento, formulação da pergunta, leitura, síntese e encerramento." },
    ],
  },
  {
    id: "tt-3", order: 2, title: "Postura com o Consulente", subtitle: "Empatia, limites e profissionalismo", icon: "🤝",
    content: `Sua postura define a experiência. O consulente precisa se sentir **seguro, respeitado e empoderado**.

**Princípios de postura:**

**1. Escute mais do que fale.** Muitos tarólogos falam demais. O consulente precisa se sentir ouvido antes de receber orientação.

**2. Não julgue.** Pessoas trazem temas difíceis: traições, vícios, decisões polêmicas. Seu papel não é julgar — é iluminar.

**3. Seja honesta com delicadeza.** Se as cartas mostram algo difícil, não maquie — mas também não brutalize. "As cartas indicam que..." é melhor que "Você vai...".

**4. Não crie dependência.** O objetivo é empoderar. Se alguém volta toda semana com a mesma pergunta, converse sobre isso.

**5. Mantenha limites.** Você não é terapeuta, médica ou advogada. Encaminhe quando necessário.

**6. Cuidado com transferência.** O consulente pode projetar em você figuras de autoridade. Mantenha distância profissional.

**O que NUNCA fazer:**
- Criar pânico ("algo muito ruim vem aí")
- Diagnosticar doenças
- Prometer resultados
- Cobrar mais por "leitura mais profunda" no meio da sessão
- Compartilhar histórias de outros consulentes`,
    keyPoints: ["Escutar mais do que falar — o consulente precisa se sentir ouvido", "Honestidade com delicadeza, nunca pânico", "Não criar dependência — empoderar é o objetivo", "Manter limites profissionais: não é terapeuta"],
    deepDive: `O conceito de "transferência" (o consulente projeta em você figuras de autoridade) vem da psicanálise freudiana. No tarô, isso se manifesta quando o consulente diz "você é tão sábia" ou "preciso de você para tomar decisões". Reconhecer a transferência é essencial: sua função é devolver o poder, não absorvê-lo.`,
    reflection: `Quando alguém te elogia por uma leitura, como você se sente? Se o elogio alimenta seu ego mais do que sua compaixão, cuidado — a transferência pode ser sedutora.`,
    exercise: { instruction: "Escreva sua 'carta de princípios' pessoal: 5 compromissos que você assume com seus futuros consulentes.", type: "writing" },
    quiz: [
      { id: "tt3-q1", question: "O que fazer se um consulente volta toda semana com a mesma pergunta?", options: ["Ler novamente normalmente", "Conversar sobre a dependência e empoderar", "Recusar o atendimento", "Cobrar mais caro"], correctIndex: 1, explanation: "Quando alguém repete a mesma pergunta, é sinal de dependência. Converse sobre isso e ajude a pessoa a confiar em si." },
    ],
  },
  {
    id: "tt-4", order: 3, title: "Ética Profissional", subtitle: "O código de conduta do tarólogo", icon: "⚖️",
    content: `Ética profissional não é opcional — é o fundamento de qualquer prática séria.

**Código de ética sugerido:**

**1. Confidencialidade.** Tudo que é dito na sessão é confidencial. Sem exceções. Nunca use histórias de consulentes em redes sociais, mesmo "anonimizadas".

**2. Transparência.** Seja clara sobre: duração, preço, método e limites. O consulente sabe o que esperar antes de começar.

**3. Consentimento.** Nunca leia sobre terceiros sem o conhecimento deles. Reformule perguntas invasivas.

**4. Honestidade.** Não minta para agradar. Não exagere para impressionar. Não invente significados.

**5. Limites profissionais.** Não ofereça terapia, diagnóstico médico ou conselho legal. Encaminhe.

**6. Não-manipulação.** Nunca use informações da leitura para manipular, chantagear ou criar medo.

**7. Preço justo.** Cobre pelo seu tempo e preparo, não pela "revelação". Evite preços abusivos.

**8. Educação contínua.** Continue estudando. Nunca pare de se aprofundar.

**Situações-limite:**
- Consulente menciona ideação suicida → encaminhe para CVV (188) ou CAPS
- Consulente relata violência doméstica → oriente sobre canais de denúncia
- Consulente quer "amarrar" alguém → recuse. Ética acima de receita`,
    keyPoints: ["Confidencialidade absoluta — sem exceções", "Transparência sobre duração, preço e limites", "Encaminhar quando o tema extrapola o tarô", "Educação contínua: nunca pare de estudar"],
    deepDive: `No Brasil, o tarô não é profissão regulamentada — não há conselho de classe, exame de ordem ou diploma obrigatório. Isso significa que a regulação é autorregulatória: cada profissional define seus próprios padrões éticos. Essa liberdade é ao mesmo tempo privilégio e responsabilidade. Um código de ética pessoal não é opcional — é o mínimo para uma prática digna.`,
    reflection: `Se você escrevesse 3 princípios inegociáveis para sua prática, quais seriam? Esses princípios serão testados quando um cliente difícil aparecer.`,
    exercise: { instruction: "Escreva seu código de ética pessoal em 8-10 pontos. Imprima e coloque onde possa vê-lo antes de cada atendimento.", type: "writing" },
    quiz: [
      { id: "tt4-q1", question: "O que fazer se um consulente menciona ideação suicida?", options: ["Fazer uma leitura de proteção", "Encaminhar para CVV (188) ou CAPS", "Continuar a leitura normalmente", "Dar conselhos pessoais"], correctIndex: 1, explanation: "Ideação suicida exige encaminhamento profissional. Oriente sobre o CVV (188) e CAPS. Isso não é papel do tarô." },
    ],
  },
  {
    id: "tt-5", order: 4, title: "Comunicação na Leitura", subtitle: "Como transmitir o que as cartas mostram", icon: "💬",
    content: `A melhor leitura do mundo é inútil se mal comunicada. A forma como você traduz as cartas é uma habilidade treinável.

**Princípios de comunicação:**

**1. Linguagem acessível.** "A carta indica um período de introspecção necessária" é melhor que "O Eremita no caminho de Yod entre Chesed e Tiferet sugere retiro contemplativo".

**2. Fale em possibilidades, não em certezas.** "As cartas indicam que...", "Uma possibilidade é...", "Isso sugere que..." — nunca "Isso VAI acontecer".

**3. Use analogias.** "É como plantar uma semente — ainda não dá para ver o resultado, mas o trabalho invisível está acontecendo."

**4. Envolva o consulente.** "Isso ressoa com algo que você está vivendo?" — a leitura é um diálogo, não um monólogo.

**5. Dê espaço para silêncio.** Depois de uma revelação importante, pause. Deixe a pessoa processar.

**Erros comuns:**
- Falar rápido demais (nervosismo)
- Usar muito jargão técnico
- Não olhar para o consulente (ficar fixada nas cartas)
- Monólogo sem verificar se faz sentido
- Suavizar demais verdades necessárias`,
    keyPoints: ["Linguagem acessível, sem jargão esotérico", "Possibilidades, não certezas: 'as cartas indicam que...'", "Analogias ajudam a traduzir conceitos abstratos", "Silêncio depois de revelações é respeito, não desconforto"],
    deepDive: `Pesquisas em comunicação mostram que as pessoas retêm apenas 10-20% do que ouvem, mas 65% do que veem e ouvem juntos. No atendimento de tarô, mostrar as cartas enquanto fala, apontar detalhes visuais e usar analogias visuais aumenta dramaticamente a retenção e o impacto da leitura.`,
    reflection: `Grave uma interpretação de 3 cartas como se estivesse falando com alguém. Depois ouça: você é clara? Usa linguagem acessível? Dá espaço para silêncio?`,
    exercise: { instruction: "Grave (em áudio) uma interpretação de 3 cartas como se estivesse falando com um consulente. Ouça depois: usou jargão? Falou rápido? Envolveu a pessoa?", type: "practice" },
    quiz: [
      { id: "tt5-q1", question: "Qual é a melhor forma de comunicar uma interpretação?", options: ["'Isso VAI acontecer'", "'As cartas indicam que...' — linguagem de possibilidade", "'O Eremita no caminho de Yod...' — termos técnicos", "'Eu acho que...' — opinião pessoal"], correctIndex: 1, explanation: "Linguagem de possibilidade ('as cartas indicam que...') é mais honesta e menos intimidadora do que certezas absolutas." },
    ],
  },
  {
    id: "tt-6", order: 5, title: "Organização Profissional", subtitle: "Agenda, preço, espaço e presença online", icon: "📋",
    content: `Se você decidiu trabalhar com tarô, precisa de organização profissional — mesmo que comece como atividade complementar.

**Agenda:**
- Defina dias e horários fixos para atendimento
- Tenha um sistema de agendamento (Google Calendar, Calendly, WhatsApp Business)
- Não atenda sem hora marcada — respeite seu tempo

**Preço:**
- Pesquise o mercado da sua cidade/região
- Considere: tempo (preparo + sessão + anotação), estudo, experiência
- Faixas comuns (2024): R$80-200 para sessão de 45-60 min
- Ofereça política clara de cancelamento

**Espaço:**
- Presencial: sala limpa, confortável, privada
- Online: boa iluminação, câmera na altura dos olhos, fundo neutro, boa internet

**Presença online:**
- Instagram: conteúdo educativo sobre tarô (não previsões genéricas)
- Depoimentos: peça a clientes satisfeitos (com permissão)
- Portfólio: não exponha leituras reais — mostre seu método e visão

**Finanças:**
- Registre todos os atendimentos e receitas
- Considere MEI (Microempreendedor Individual) para formalização
- Separe conta pessoal de conta profissional`,
    keyPoints: ["Agenda fixa, sistema de agendamento, política de cancelamento", "Pesquisar preço do mercado local (R$80-200 para 45-60 min)", "Presença online educativa, não previsões genéricas", "Considerar MEI para formalização e registrar finanças"],
    deepDive: `O MEI (Microempreendedor Individual) é a forma mais simples de formalização no Brasil. Com CNAE adequado (atividades de serviços pessoais), você pode emitir nota fiscal, ter conta PJ e contribuir para o INSS. A formalização transmite profissionalismo e protege financeiramente.`,
    reflection: `Você quer trabalhar com tarô como hobby, renda extra ou profissão principal? A resposta determina o nível de organização necessário.`,
    exercise: { instruction: "Monte seu plano profissional: defina horários, pesquise preços na sua região, escolha canais de divulgação. Escreva tudo num documento.", type: "writing" },
    quiz: [
      { id: "tt6-q1", question: "Que tipo de conteúdo postar nas redes sociais como taróloga?", options: ["Previsões genéricas ('Signo de Áries esta semana')", "Conteúdo educativo sobre tarô e método", "Leituras reais de clientes (anonimizadas)", "Promessas de resultados"], correctIndex: 1, explanation: "Conteúdo educativo sobre tarô atrai clientes que valorizam profundidade — não promessas ou previsões genéricas." },
    ],
  },
  {
    id: "tt-7", order: 6, title: "Atendimento Online", subtitle: "Ler tarô à distância com qualidade", icon: "💻",
    content: `O atendimento online se tornou majoritário. Funciona tão bem quanto presencial — se feito com cuidado.

**Plataformas:** Zoom, Google Meet, WhatsApp vídeo. Prefira videochamada — o olho no olho importa.

**Preparação técnica:**
- Teste câmera e microfone antes
- Iluminação frontal (não atrás de você)
- Câmera posicionada para mostrar seu rosto E as cartas
- Internet estável (se possível, cabo)
- Silêncio no ambiente

**Adaptações para online:**
- Mostre as cartas à câmera, uma por uma
- Vá mais devagar — a conexão digital exige mais atenção
- Anuncie o que está fazendo: "Agora vou embaralhar", "Essa é a primeira carta"
- Após a sessão, envie foto das cartas e um resumo por escrito

**Vantagens do online:**
- Alcance geográfico ilimitado
- Comodidade para o consulente
- Gravação da sessão (com consentimento)
- Menor custo operacional (sem sala)`,
    keyPoints: ["Videochamada > áudio — o olho no olho importa", "Câmera mostrando rosto + cartas, iluminação frontal", "Ir mais devagar online e narrar cada ação", "Enviar foto das cartas + resumo após a sessão"],
    deepDive: `Estudos sobre teleconferência mostram que a "fadiga de zoom" é real — olhar para uma tela por longos períodos esgota mais do que a presença física. Para atendimentos online de tarô, sessões de 40-50 minutos funcionam melhor que 60. Inclua uma pausa de 2 minutos no meio se necessário.`,
    reflection: `Você já atendeu online? Se sim, o que funcionou e o que não funcionou? Se não, que receio tem? Testar numa leitura gratuita remove a maioria dos medos.`,
    exercise: { instruction: "Faça um teste: monte seu setup de atendimento online. Grave um vídeo teste de 3 minutos interpretando 3 cartas. Avalie: a imagem é clara? Dá para ver as cartas?", type: "practice" },
    quiz: [
      { id: "tt7-q1", question: "O que enviar ao consulente após um atendimento online?", options: ["Nada", "Foto das cartas e um resumo por escrito", "Uma lista de livros para estudar", "O vídeo completo sem edição"], correctIndex: 1, explanation: "Enviar foto das cartas e um breve resumo é um toque profissional que agrega valor ao atendimento." },
    ],
  },
  {
    id: "tt-8", order: 7, title: "Crescimento e Educação Contínua", subtitle: "O tarô como caminho vivo", icon: "🌱",
    content: `O estudo do tarô não termina com o último módulo deste curso. Ele **nunca termina** — e essa é a beleza do caminho.

**Como continuar crescendo:**

**1. Pratique diariamente.** O diário do tarô (1 carta/dia) é a prática mais transformadora.

**2. Leia livros.** Recomendações essenciais:
- "78 Degrees of Wisdom" — Rachel Pollack
- "The Tarot" — Robert Place
- "Tarot and the Tree of Life" — Isabel Radow Kliegman
- "Holistic Tarot" — Benebell Wen

**3. Estude outras tradições.** Marselha, Thoth, Lenormand — cada sistema amplia sua compreensão.

**4. Busque supervisão.** Converse com tarólogos mais experientes. Peça que avaliem suas leituras.

**5. Participe de comunidades.** Grupos de estudo, fóruns, encontros presenciais.

**6. Ensine.** Ensinar é a forma mais profunda de aprender. Quando você explica para alguém, consolida o conhecimento.

**7. Volte às cartas.** Periodicamente, releia os módulos deste curso. Você vai notar coisas que não notou antes — porque você mudou.

**O tarô é um espelho.** Quanto mais você cresce, mais ele mostra. A jornada do Louco é eterna — não há linha de chegada, apenas caminho.`,
    keyPoints: ["Prática diária (diário do tarô) é a base do crescimento", "Leia livros de referência e estude outras tradições", "Busque supervisão e participe de comunidades", "Ensinar consolida o conhecimento — volte às cartas periodicamente"],
    deepDive: `O conceito japonês de "kaizen" — melhoria contínua em pequenos passos — aplica-se perfeitamente ao tarô. Não é preciso ler 10 livros por mês. Uma carta por dia, uma releitura por semana, uma conversa com outro tarólogo por mês. Pequenos passos consistentes superam grandes gestos esporádicos. A jornada do Louco é eterna — e essa é a beleza.`,
    reflection: `O que você vai fazer AMANHÃ para crescer como estudante ou profissional de tarô? Não na próxima semana, não quando tiver tempo — amanhã. Um passo. Um gesto. Um compromisso.`,
    exercise: { instruction: "Crie seu plano de educação contínua: defina 1 livro para ler, 1 prática diária e 1 forma de conexão com outros estudiosos. Comece esta semana.", type: "writing" },
    quiz: [
      { id: "tt8-q1", question: "Por que voltar a reler os módulos do curso periodicamente?", options: ["Porque esquecemos tudo", "Porque mudamos e percebemos coisas novas", "Porque os módulos mudam", "Porque é obrigatório"], correctIndex: 1, explanation: "Quando você cresce, o tarô mostra mais. Relendo com novos olhos, percebe camadas que antes eram invisíveis." },
    ],
  },
  {
    id: "tt-9", order: 8, title: "Construção de Clientela", subtitle: "Como atrair os consulentes certos", icon: "🌱",
    content: `Construir clientela é, talvez, o maior desafio prático de quem decide profissionalizar o ofício. Não basta ler bem — precisa ser encontrada por quem precisa de você.

**Princípios da construção saudável de clientela:**

**1. Atraia pelo que é, não pelo que finge ser.** Marketing autêntico funciona melhor a longo prazo. Se você é racional e estruturada, não tente parecer mística e etérea (e vice-versa).

**2. Defina seu nicho.** Tarólogas que tentam atender "todo mundo" raramente atendem ninguém com profundidade. Pense: que tipo de consulente é seu ideal? Mulheres em transição? Empreendedores? Pessoas em busca espiritual?

**3. Conteúdo educativo é a melhor propaganda.** Posts que ensinam algo concreto sobre tarô atraem pessoas que valorizam profundidade. Posts genéricos ("Áries hoje vai brilhar") atraem público volátil.

**4. Depoimentos pesam mais que autopromoção.** Peça (com permissão) feedback de clientes satisfeitas. Um depoimento honesto vale mais que dez posts seus dizendo que é boa.

**5. Indicações são ouro.** Cliente satisfeita indica. Crie experiência boa o suficiente para que indiquem espontaneamente.

**Canais que funcionam (em 2024-2025):**
- **Instagram:** Conteúdo visual + reels educativos.
- **TikTok:** Curtos didáticos sobre cartas e símbolos.
- **YouTube:** Vídeos longos para autoridade (interpretações de cartas, métodos de leitura).
- **Newsletter:** Conteúdo direto na caixa de entrada — cria intimidade.
- **Boca a boca:** Ainda o mais poderoso.

**Erros comuns:**
- Postar previsões genéricas para "viralizar" (público volátil, baixa conversão).
- Brigar online com outros tarólogos (queima reputação).
- Prometer resultados garantidos (atrai cliente errada e gera frustração).
- Cobrar muito barato no início para "ganhar clientela" (atrai quem não valoriza).

**A construção é lenta — e é assim que deve ser.** Clientela construída com pressa some com pressa. Clientela construída com presença permanece.`,
    keyPoints: ["Atraia pelo que é — autenticidade vence marketing forçado", "Defina nicho: melhor ser referência para alguns que invisível para muitos", "Conteúdo educativo + depoimentos + indicações = base sólida", "Construção lenta gera clientela duradoura — pressa atrai volatilidade"],
    deepDive: `O modelo de "1.000 fãs verdadeiros" do escritor Kevin Kelly aplica-se perfeitamente ao tarô profissional: você não precisa de milhões de seguidores. Precisa de algumas centenas de pessoas que confiem profundamente em você. Tarólogas com clientela fiel de 100-200 pessoas frequentemente faturam mais — e com mais qualidade de vida — do que aquelas que perseguem viralização constante.`,
    reflection: `Pense em alguém que admira como profissional (de qualquer área). O que essa pessoa faz que você poderia adaptar? Não copie o estilo — entenda o princípio.`,
    exercise: { instruction: "Defina por escrito: quem é seu consulente ideal? Idade, momento de vida, tipo de pergunta que costuma trazer, valores. Use isso para guiar todo o seu conteúdo.", type: "writing" },
    quiz: [
      { id: "tt9-q1", question: "Qual é a estratégia mais saudável para construir clientela?", options: ["Postar previsões diárias para viralizar", "Conteúdo educativo + depoimentos + nicho claro", "Cobrar muito barato para atrair muita gente", "Brigar online para ganhar visibilidade"], correctIndex: 1, explanation: "Conteúdo educativo atrai público de qualidade. Depoimentos geram confiança. Nicho claro evita dispersão. Essa combinação cria clientela duradoura." },
    ],
  },
  {
    id: "tt-10", order: 9, title: "Sustentar a Vocação a Longo Prazo", subtitle: "Como não desistir nem se perder no caminho", icon: "🔥",
    content: `Muitas tarólogas começam com fogo intenso — e desistem em 1-2 anos. Outras se mantêm por décadas. A diferença não é talento; é **sustentação**.

**Os principais riscos da prática profissional:**

**1. Esgotamento emocional.** Atender pessoas em sofrimento é desgastante. Sem cuidados, você adoece.

**2. Solidão profissional.** Tarólogas frequentemente trabalham sozinhas. A falta de colegas para conversar isola e adoece.

**3. Crise de fé.** Vai chegar o momento em que você duvida de tudo: "Será que isso funciona mesmo? Será que estou ajudando ou enganando?" Essa crise é normal — e necessária.

**4. Pressão financeira.** Renda variável estressa. Mês bom + mês ruim + mês ruim de novo = ansiedade.

**5. Estagnação técnica.** Sem estudo contínuo, você repete os mesmos métodos por anos e perde profundidade.

**Como sustentar a vocação:**

**1. Tenha sua própria terapia.** Quem cuida de outros precisa ser cuidada. Terapia regular não é luxo — é ferramenta de trabalho.

**2. Construa rede.** Outras tarólogas, mentoras, grupos de estudo, supervisão. Não atravesse sozinha.

**3. Defina limites firmes.** Horário de atendimento, número máximo de sessões por dia, dias de descanso. Sem limites, esgota.

**4. Continue estudando.** 1 livro novo a cada 3 meses. 1 curso novo por ano. 1 retiro ou imersão a cada 2 anos.

**5. Diversifique a renda.** Atendimento individual + cursos + conteúdo pago + ebooks + mentoria. Renda diversificada reduz pressão.

**6. Volte às bases.** Periodicamente, releia O Louco. Releia Os Fundamentos. A simplicidade é o que sustenta. A complexidade é o que cansa.

**Sinais de que precisa parar (mesmo que seja temporário):**
- Você sente repulsa pelas cartas.
- Os atendimentos viraram fardo.
- Não consegue mais separar trabalho de vida.
- Sente que está enganando ou se enganando.
- Sintomas físicos (insônia, dores, irritação) persistem.

**Pausar não é desistir — é cuidar.** Voltar depois de uma pausa consciente é mais saudável que continuar arrastando.

**A vocação a longo prazo se sustenta em três pilares:** prática regular, comunidade real, propósito claro. Quem cultiva os três, sustenta. Quem negligencia algum, eventualmente cai.

**Você está construindo uma vida com o tarô — não apenas uma carreira.** Trate esse processo com a profundidade que ele merece. E lembre: A Estrela está sempre ali, depois da Torre. A esperança regenera. O caminho continua.`,
    keyPoints: ["Riscos: esgotamento, solidão, crise de fé, pressão financeira, estagnação", "Sustentação: terapia + rede + limites + estudo + diversificação", "Pausar não é desistir — é cuidar", "Três pilares: prática regular + comunidade real + propósito claro"],
    deepDive: `O burnout em profissionais que lidam com sofrimento alheio (terapeutas, médicos, tarólogos, conselheiros) é fenômeno bem documentado. A pesquisa de Christina Maslach identifica três dimensões do esgotamento: exaustão emocional, despersonalização (cinismo) e queda de realização. Tarólogas que atendem sem cuidar de si frequentemente desenvolvem todos os três sintomas. A prevenção exige supervisão, terapia e limites firmes — não é fraqueza, é higiene profissional.`,
    reflection: `Imagine você daqui a 10 anos, ainda atendendo. O que precisa cuidar HOJE para chegar lá com saúde, sentido e fé? A resposta a essa pergunta orienta as próximas decisões.`,
    exercise: { instruction: "Escreva seu 'pacto de sustentação': 5 compromissos concretos com você mesma para cuidar da vocação a longo prazo. Revise a cada 6 meses.", type: "writing" },
    quiz: [
      { id: "tt10-q1", question: "Qual é o sinal mais claro de que precisa pausar a prática (mesmo que temporariamente)?", options: ["Atender menos clientes que outros tarólogos", "Sentir repulsa pelas cartas e que os atendimentos viraram fardo", "Ter dúvidas sobre uma interpretação específica", "Cobrar menos que o mercado"], correctIndex: 1, explanation: "Repulsa pelas cartas e sensação de fardo são sinais de esgotamento. Pausar conscientemente é mais saudável que continuar arrastando." },
    ],
  },
];
