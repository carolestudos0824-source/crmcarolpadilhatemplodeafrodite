export interface TarotSymbol {
  id: string;
  name: string;
  explanation: string;
  readings: string[];
  cards: string[];
}

export interface SymbolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  symbols: TarotSymbol[];
}

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: "luas",
    name: "Luas",
    icon: "☽",
    description: "Ciclos, intuição, feminino e inconsciente",
    symbols: [
      { id: "lua-crescente", name: "Lua Crescente", explanation: "Representa o crescimento, a intuição em desenvolvimento e o potencial que ainda não se manifestou por completo. É a fase de gestação — ideias, sentimentos e projetos que estão amadurecendo no silêncio.", readings: ["Algo está crescendo internamente", "Confie no processo — ainda não é hora de revelar", "Intuição em expansão"], cards: ["A Sacerdotisa", "A Lua"] },
      { id: "lua-cheia", name: "Lua Cheia", explanation: "Plenitude emocional, revelação e iluminação do inconsciente. O que estava oculto agora se mostra. É o ápice de um ciclo, onde verdades emergem e emoções transbordam.", readings: ["Momento de clareza emocional", "Revelação importante", "Culminação de um processo"], cards: ["A Lua", "A Estrela"] },
      { id: "lua-minguante", name: "Lua Minguante", explanation: "Fase de soltar, liberar e desapegar. O que já cumpriu seu ciclo precisa ser deixado para trás. É o convite para o recolhimento consciente.", readings: ["Hora de soltar o que não serve mais", "Período de introspecção", "Encerramento de ciclos"], cards: ["A Morte", "O Eremita"] },
    ],
  },
  {
    id: "sois",
    name: "Sóis",
    icon: "☀",
    description: "Consciência, vitalidade, verdade e clareza",
    symbols: [
      { id: "sol-radiante", name: "Sol Radiante", explanation: "Consciência plena, alegria genuína e vitalidade. O sol ilumina sem distinção — representa a verdade que não se esconde e a energia vital que sustenta toda a criação.", readings: ["Momento de clareza e otimismo", "Sucesso visível e merecido", "Energia vital em alta"], cards: ["O Sol", "O Louco"] },
      { id: "sol-nascente", name: "Sol Nascente", explanation: "Novos começos iluminados pela consciência. O amanhecer simboliza esperança renovada, o fim de um período obscuro e o início de uma nova fase com mais clareza.", readings: ["Um novo começo se anuncia", "Esperança após período difícil", "Despertar espiritual"], cards: ["O Julgamento", "A Estrela"] },
    ],
  },
  {
    id: "aguas",
    name: "Águas",
    icon: "💧",
    description: "Emoções, inconsciente, fluidez e purificação",
    symbols: [
      { id: "rio", name: "Rio ou Corrente", explanation: "O fluxo contínuo das emoções e do tempo. Rios representam o caminho natural da vida, a necessidade de fluir sem resistência e a jornada que segue independente da nossa vontade.", readings: ["Deixe as coisas fluírem", "Não resista ao curso natural", "Emoções em movimento"], cards: ["A Temperança", "A Estrela", "A Imperatriz"] },
      { id: "mar", name: "Mar ou Oceano", explanation: "O vasto inconsciente coletivo, as emoções profundas e primordiais. O mar pode ser calmo (paz interior) ou tempestuoso (emoções avassaladoras).", readings: ["Emoções profundas e intensas", "Conexão com o inconsciente coletivo", "Mergulho interior necessário"], cards: ["A Lua", "Dois de Copas"] },
      { id: "chuva", name: "Chuva", explanation: "Purificação emocional, lágrimas que limpam e renovação. A chuva fertiliza a terra, assim como as emoções processadas nutrem o crescimento pessoal.", readings: ["Período de limpeza emocional", "Lágrimas que curam", "Renovação após tristeza"], cards: ["A Temperança", "Cinco de Copas"] },
    ],
  },
  {
    id: "flores",
    name: "Flores",
    icon: "🌹",
    description: "Beleza, crescimento, amor e impermanência",
    symbols: [
      { id: "rosa-vermelha", name: "Rosa Vermelha", explanation: "Paixão, desejo e amor terreno. A rosa vermelha é o símbolo universal do amor romântico, mas também carrega os espinhos — lembrando que o amor verdadeiro envolve risco e vulnerabilidade.", readings: ["Paixão intensa", "Amor com profundidade", "Desejo que deve ser honrado"], cards: ["O Mago", "A Imperatriz"] },
      { id: "rosa-branca", name: "Rosa Branca", explanation: "Pureza de intenção, inocência espiritual e amor incondicional. Diferente da rosa vermelha, a branca transcende o desejo — é o amor que não pede nada em troca.", readings: ["Pureza de intenções", "Amor espiritual", "Inocência protegida"], cards: ["O Louco", "A Morte"] },
      { id: "lirio", name: "Lírio", explanation: "Pureza espiritual, conexão com o divino e transcendência. O lírio cresce na lama e floresce na superfície — símbolo de que a beleza espiritual pode nascer das experiências mais difíceis.", readings: ["Crescimento espiritual", "Beleza que nasce da dificuldade", "Conexão com o sagrado"], cards: ["O Mago", "A Temperança"] },
    ],
  },
  {
    id: "montanhas",
    name: "Montanhas",
    icon: "⛰",
    description: "Desafios, conquistas, elevação e permanência",
    symbols: [
      { id: "montanha-nevada", name: "Montanha Nevada", explanation: "Desafios elevados, conquistas espirituais e a frieza do isolamento necessário. O pico nevado representa tanto a meta mais alta quanto o custo de alcançá-la — solidão, esforço e perseverança.", readings: ["Grande desafio à frente", "Conquista que exige sacrifício", "Solidão como parte do caminho"], cards: ["O Eremita", "O Louco"] },
      { id: "colina", name: "Colina ou Morro", explanation: "Desafios menores, perspectiva elevada e progresso gradual. Diferente da montanha, a colina é acessível — representa os obstáculos do cotidiano que, uma vez superados, oferecem nova visão.", readings: ["Progresso constante", "Obstáculo superável", "Nova perspectiva a caminho"], cards: ["O Carro", "Seis de Espadas"] },
    ],
  },
  {
    id: "animais",
    name: "Animais",
    icon: "🐾",
    description: "Instintos, guias interiores e forças naturais",
    symbols: [
      { id: "cachorro", name: "Cachorro", explanation: "Lealdade, instinto protetor e companheirismo. O cachorro é o guia fiel que alerta sobre perigos sem julgar — representa a intuição animal, a parte nossa que sente antes de pensar.", readings: ["Confie em seus instintos", "Lealdade presente", "Alerta intuitivo"], cards: ["O Louco", "A Lua"] },
      { id: "leao", name: "Leão", explanation: "Força interior, coragem e domínio sobre os instintos. O leão não é apenas poder bruto — é o poder domesticado pela compaixão, a força que se expressa com gentileza.", readings: ["Coragem para enfrentar", "Força interior subestimada", "Domínio compassivo"], cards: ["A Força"] },
      { id: "aguia", name: "Águia", explanation: "Visão elevada, liberdade e conexão com o divino. A águia voa acima de tudo — vê o quadro completo, sem se perder nos detalhes do chão.", readings: ["Visão ampla necessária", "Liberdade espiritual", "Elevar a perspectiva"], cards: ["O Mundo", "A Roda da Fortuna"] },
    ],
  },
  {
    id: "cores",
    name: "Cores",
    icon: "🎨",
    description: "Vibração energética, emoções e estados de consciência",
    symbols: [
      { id: "dourado", name: "Dourado / Ouro", explanation: "Sabedoria divina, iluminação, valor espiritual e realização. O ouro não enferruja — representa o que é eterno e incorruptível na alma.", readings: ["Sabedoria conquistada", "Valor real e duradouro", "Conexão com o divino"], cards: ["O Sol", "O Imperador", "A Roda da Fortuna"] },
      { id: "vermelho", name: "Vermelho", explanation: "Paixão, força vital, ação e desejo. O vermelho é a cor do sangue e do fogo — energia pura que tanto cria quanto destrói.", readings: ["Paixão intensa", "Energia para agir", "Atenção ao excesso"], cards: ["O Imperador", "A Força", "A Torre"] },
      { id: "azul", name: "Azul", explanation: "Espiritualidade, calma, verdade e comunicação. O azul do céu e do mar conecta o visível ao infinito — é a cor da meditação e da fé.", readings: ["Paz interior", "Comunicação verdadeira", "Conexão espiritual"], cards: ["A Sacerdotisa", "O Eremita"] },
      { id: "branco", name: "Branco", explanation: "Pureza, potencial ilimitado e início. O branco contém todas as cores — é a tela em branco, o espaço de possibilidade antes de qualquer manifestação.", readings: ["Novo começo puro", "Potencial não manifestado", "Inocência espiritual"], cards: ["O Louco", "A Temperança"] },
    ],
  },
  {
    id: "vestes",
    name: "Vestes",
    icon: "👘",
    description: "Identidade, papel social e estado interior",
    symbols: [
      { id: "manto-azul", name: "Manto Azul", explanation: "Sabedoria espiritual, proteção divina e conhecimento oculto. O manto azul reveste quem guarda verdades profundas — é a veste do sacerdote interior.", readings: ["Sabedoria protegida", "Conhecimento que não se exibe", "Espiritualidade ativa"], cards: ["A Sacerdotisa", "O Eremita"] },
      { id: "armadura", name: "Armadura", explanation: "Proteção, defesa e preparação para conflitos. A armadura pode ser necessária ou excessiva — depende se o perigo é real ou imaginário.", readings: ["Proteção necessária", "Defesas emocionais ativas", "Questione se a armadura ainda serve"], cards: ["O Carro", "O Imperador"] },
      { id: "nudez", name: "Nudez", explanation: "Vulnerabilidade, autenticidade e liberdade. Estar nu nas cartas é estar sem máscaras — é a verdade crua, a aceitação total de si.", readings: ["Autenticidade radical", "Vulnerabilidade como força", "Liberdade das convenções"], cards: ["O Sol", "A Estrela", "O Julgamento"] },
    ],
  },
  {
    id: "objetos",
    name: "Objetos",
    icon: "⚱️",
    description: "Ferramentas, poder e instrumentos de transformação",
    symbols: [
      { id: "varinha", name: "Varinha / Bastão", explanation: "Vontade direcionada, poder criativo e canal de energia. A varinha é a extensão da intenção — transforma pensamento em ação, desejo em realidade.", readings: ["Poder de manifestar", "Intenção clara e focada", "Energia criativa disponível"], cards: ["O Mago", "O Mundo"] },
      { id: "calice", name: "Cálice / Taça", explanation: "Receptividade emocional, amor e o feminino sagrado. O cálice recebe sem forçar — é a capacidade de acolher emoções, experiências e graça.", readings: ["Abra-se para receber", "Emoções precisam de espaço", "Amor como receptividade"], cards: ["A Temperança", "A Estrela", "O Mago"] },
      { id: "espada", name: "Espada", explanation: "Verdade, discernimento e poder mental. A espada corta — ilusões, mentiras e confusões. É o instrumento da clareza, mas também pode ferir.", readings: ["Verdade precisa ser dita", "Decisão mental necessária", "Cuidado com a crueldade da razão"], cards: ["A Justiça", "O Mago"] },
      { id: "chave", name: "Chave", explanation: "Conhecimento que abre portas, revelação e acesso ao oculto. A chave é o símbolo do poder de desvendar mistérios e acessar novos níveis de compreensão.", readings: ["Solução está ao seu alcance", "Conhecimento que liberta", "Acesso a novas dimensões"], cards: ["O Hierofante", "A Sacerdotisa"] },
    ],
  },
  {
    id: "astrologia",
    name: "Elementos Astrológicos",
    icon: "♈",
    description: "Planetas, signos e correspondências celestes",
    symbols: [
      { id: "lemniscata", name: "Lemniscata (∞)", explanation: "Infinito, eternidade e ciclo perpétuo de criação. O símbolo do infinito aparece sobre a cabeça daqueles que dominam os ciclos — não como prisioneiros, mas como mestres.", readings: ["Domínio sobre os ciclos", "Consciência eterna", "Poder que se renova"], cards: ["O Mago", "A Força"] },
      { id: "estrela-seis-pontas", name: "Estrela de Seis Pontas", explanation: "União dos opostos, equilíbrio entre espírito e matéria. Os dois triângulos entrelaçados — um apontando para cima (espírito) e outro para baixo (matéria) — representam a integração total.", readings: ["Equilíbrio entre mundos", "Integração de opostos", "Harmonia alcançada"], cards: ["Os Enamorados", "A Temperança"] },
      { id: "zodiac", name: "Roda Zodiacal", explanation: "Os 12 signos como fases da experiência humana. A roda zodiacal no Tarô aparece como lembrete de que tudo é cíclico e que cada fase tem seu propósito.", readings: ["Ciclos naturais em ação", "Cada fase tem seu tempo", "Padrão cósmico revelado"], cards: ["A Roda da Fortuna", "O Mundo"] },
    ],
  },
  {
    id: "numeros",
    name: "Números",
    icon: "🔢",
    description: "Numerologia sagrada e significados ocultos",
    symbols: [
      { id: "zero", name: "Zero (0)", explanation: "O vazio fértil, o potencial puro, o ponto antes de toda manifestação. O zero não é ausência — é plenitude em estado latente, o útero cósmico.", readings: ["Potencial ilimitado", "Momento antes da criação", "Liberdade total"], cards: ["O Louco"] },
      { id: "um", name: "Um (I)", explanation: "Início, unidade, vontade e individualidade. O número um é a primeira manifestação — o ponto que gera a linha, a semente que contém a árvore inteira.", readings: ["Novo começo consciente", "Foco e determinação", "Poder individual"], cards: ["O Mago"] },
      { id: "dois", name: "Dois (II)", explanation: "Dualidade, polaridade, escolha e receptividade. O dois é o espelho — o momento em que a consciência se percebe refletida e precisa integrar os opostos.", readings: ["Escolha entre caminhos", "Equilíbrio de polaridades", "Receptividade necessária"], cards: ["A Sacerdotisa", "Os Enamorados"] },
      { id: "tres", name: "Três (III)", explanation: "Criação, expressão, síntese e abundância. O três é o filho da dualidade — quando dois opostos se encontram, nasce algo novo. É a criatividade pura.", readings: ["Criatividade em fluxo", "Expressão necessária", "Abundância chegando"], cards: ["A Imperatriz"] },
    ],
  },
  {
    id: "gestos",
    name: "Gestos e Posturas",
    icon: "🤲",
    description: "Linguagem corporal simbólica e posições rituais",
    symbols: [
      { id: "mao-erguida", name: "Mão Erguida ao Céu", explanation: "Canal entre o divino e o humano, invocação e recepção de energia cósmica. A mão que aponta para cima busca orientação, sabedoria e poder do alto.", readings: ["Conexão com o divino ativa", "Invocação de forças superiores", "Abertura para receber"], cards: ["O Mago", "O Hierofante"] },
      { id: "mao-abaixada", name: "Mão Apontando para Baixo", explanation: "Manifestação, ancoragem e transmissão de energia do alto para a terra. Complemento da mão erguida — é o gesto de 'como acima, assim abaixo'.", readings: ["Manifestar o que recebeu", "Ancorar no material", "Trazer o espiritual para o concreto"], cards: ["O Mago"] },
      { id: "olhos-fechados", name: "Olhos Fechados", explanation: "Introspecção, meditação e confiança no mundo interior. Fechar os olhos é abrir a visão interna — escolher ver com a alma em vez de com a mente.", readings: ["Momento de introspecção", "Confie na visão interior", "Pare de buscar fora"], cards: ["A Sacerdotisa", "O Eremita"] },
      { id: "sentada", name: "Postura Sentada / Trono", explanation: "Autoridade, estabilidade, domínio e presença. Quem senta não precisa se mover para provar poder — a presença basta.", readings: ["Estabilidade conquistada", "Autoridade natural", "Poder que não precisa gritar"], cards: ["A Sacerdotisa", "A Imperatriz", "O Imperador", "A Justiça"] },
    ],
  },
];
