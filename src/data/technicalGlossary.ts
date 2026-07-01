import type { ModuleId } from "./entregaModules";

/**
 * Glossário Técnico do App — dados estáticos, somente leitura.
 *
 * Importante:
 * - NÃO entra em MODULES nem em MODULE_ORDER.
 * - NÃO conta em TOTAL_COMMANDS (54).
 * - NÃO altera progresso, IDs ou builders.
 * - `relatedModuleId` é apenas referência visual opcional.
 */

export type GlossaryCategoryId =
  | "comeco"
  | "telas"
  | "banco"
  | "seguranca"
  | "publicacao"
  | "metricas"
  | "performance"
  | "backend"
  | "infra"
  | "escala"
  | "ferramentas"
  | "ia"
  | "mobile";

export type GlossaryUrgency =
  | "agora"
  | "em-breve"
  | "antes-de-publicar"
  | "com-usuarios"
  | "escala-avancada";

export interface TechnicalTerm {
  slug: string;
  name: string;
  category: GlossaryCategoryId;
  simple: string;
  whyItMatters: string;
  whenItEnters: string;
  worryNow: GlossaryUrgency;
  relatedModuleId?: ModuleId;
  notForBeginners?: boolean;
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategoryId; label: string }[] = [
  { id: "comeco", label: "Começo / versão inicial" },
  { id: "telas", label: "Telas, fluxo e experiência" },
  { id: "banco", label: "Banco, login e dados" },
  { id: "seguranca", label: "Segurança" },
  { id: "publicacao", label: "Publicação e domínio" },
  { id: "metricas", label: "Métricas e observabilidade" },
  { id: "performance", label: "Performance e otimização" },
  { id: "backend", label: "Backend e integrações" },
  { id: "infra", label: "Infraestrutura" },
  { id: "escala", label: "Escala avançada" },
  { id: "ferramentas", label: "Ferramentas de desenvolvimento" },
  { id: "ia", label: "Inteligência artificial" },
  { id: "mobile", label: "Mobile / PWA / Android / iOS" },
];

export const URGENCY_META: Record<
  GlossaryUrgency,
  { label: string; tone: string; hint: string }
> = {
  "agora": {
    label: "Agora",
    tone: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    hint: "Vale entender desde o começo.",
  },
  "em-breve": {
    label: "Em breve",
    tone: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    hint: "Aparece logo nos próximos passos.",
  },
  "antes-de-publicar": {
    label: "Antes de publicar",
    tone: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    hint: "Revise antes de divulgar.",
  },
  "com-usuarios": {
    label: "Com usuários reais",
    tone: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    hint: "Importa quando seu app começa a ter uso real.",
  },
  "escala-avancada": {
    label: "Só em escala avançada",
    tone: "border-white/20 bg-white/[0.04] text-muted-foreground",
    hint: "Não se preocupe com isso no início.",
  },
};

export const TECHNICAL_GLOSSARY: TechnicalTerm[] = [
  // ===== Banco, login e dados =====
  {
    slug: "database",
    name: "Database",
    category: "banco",
    simple: "É onde o app guarda informações de forma organizada (pessoas usuárias, posts, compras, etc.).",
    whyItMatters: "Sem banco, o app esquece tudo entre cliques. Toda informação importante vive ali.",
    whenItEnters: "Já no começo, quando você precisa salvar conta de pessoa usuária ou conteúdo.",
    worryNow: "agora",
    relatedModuleId: "login",
  },
  {
    slug: "embedded-database",
    name: "Embedded database",
    category: "banco",
    simple: "Um banco de dados que mora dentro do próprio app, sem servidor separado.",
    whyItMatters: "Útil em apps offline ou ferramentas locais; raramente é o caso de apps web do Lovable.",
    whenItEnters: "Casos específicos. Para a maioria das pessoas participantes, não é necessário.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "dynamodb",
    name: "DynamoDB",
    category: "banco",
    simple: "Banco de dados NoSQL da Amazon, pensado para volumes muito grandes.",
    whyItMatters: "Alternativa a bancos tradicionais quando há milhões de registros.",
    whenItEnters: "Só faz sentido em escala bem grande. O Lovable Cloud já cobre o início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "sharding",
    name: "Sharding",
    category: "escala",
    simple: "Dividir um banco gigante em pedaços menores para aguentar mais carga.",
    whyItMatters: "Só vira tema quando o app tem muito tráfego.",
    whenItEnters: "Escala avançada. Não se preocupe com isso no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "partitioning",
    name: "Partitioning",
    category: "escala",
    simple: "Organizar uma tabela enorme em partes para acelerar consultas.",
    whyItMatters: "Otimização de banco em larga escala.",
    whenItEnters: "Só faz sentido com volumes muito grandes.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },

  // ===== Segurança =====
  {
    slug: "encryption",
    name: "Encryption (Criptografia)",
    category: "seguranca",
    simple: "Embaralhar informações para que só quem tem a chave consiga ler.",
    whyItMatters: "Protege senhas, tokens e dados sensíveis de pessoas usuárias.",
    whenItEnters: "Desde o começo. O Lovable Cloud já criptografa muita coisa por padrão.",
    worryNow: "agora",
    relatedModuleId: "seguranca",
  },
  {
    slug: "firewall",
    name: "Firewall",
    category: "seguranca",
    simple: "Uma 'porta' que filtra o que pode ou não acessar o sistema.",
    whyItMatters: "Bloqueia acessos indesejados na infraestrutura.",
    whenItEnters: "Boa parte é cuidada pelo provedor do Cloud. Você foca nas regras do app (RLS).",
    worryNow: "com-usuarios",
  },
  {
    slug: "rate-limiting",
    name: "Rate limiting",
    category: "seguranca",
    simple: "Limitar quantas vezes alguém pode fazer uma ação por minuto.",
    whyItMatters: "Evita abuso, spam e ataques de força bruta no login.",
    whenItEnters: "Antes de divulgar o app, especialmente em endpoints de login e pagamento.",
    worryNow: "antes-de-publicar",
    relatedModuleId: "seguranca",
  },

  // ===== Publicação e domínio =====
  {
    slug: "deployments",
    name: "Deployments",
    category: "publicacao",
    simple: "Colocar uma nova versão do app no ar.",
    whyItMatters: "Toda mudança aprovada precisa ser publicada para os usuários verem.",
    whenItEnters: "A cada atualização. No Lovable, basta clicar em Publish.",
    worryNow: "agora",
    relatedModuleId: "publicar",
  },
  {
    slug: "staging",
    name: "Staging",
    category: "publicacao",
    simple: "Ambiente de testes parecido com produção, antes do app público.",
    whyItMatters: "Permite testar mudanças sem afetar pessoas usuárias reais.",
    whenItEnters: "Quando o app já está vendendo. No início, o preview do Lovable cumpre esse papel.",
    worryNow: "em-breve",
  },
  {
    slug: "ci-cd",
    name: "CI/CD",
    category: "publicacao",
    simple: "Automatizar testes e publicação a cada mudança no código.",
    whyItMatters: "Reduz risco de quebrar o app ao publicar.",
    whenItEnters: "Lovable já cuida disso por baixo. Você não precisa configurar manualmente.",
    worryNow: "escala-avancada",
  },
  {
    slug: "availability",
    name: "Availability",
    category: "publicacao",
    simple: "Quanto tempo o app fica de pé e respondendo (ex.: 99,9% do mês).",
    whyItMatters: "Reflete confiança. Apps que caem muito perdem pessoas usuárias.",
    whenItEnters: "Importa de verdade quando você tem pessoas usuárias reais pagando.",
    worryNow: "com-usuarios",
  },

  // ===== Métricas e observabilidade =====
  {
    slug: "error-logging",
    name: "Error logging",
    category: "metricas",
    simple: "Registrar automaticamente quando algo dá errado no app.",
    whyItMatters: "Sem isso você só descobre bugs quando a pessoa usuária reclama.",
    whenItEnters: "Antes de divulgar para mais pessoas.",
    worryNow: "antes-de-publicar",
    relatedModuleId: "metricas",
  },
  {
    slug: "qps",
    name: "QPS (Queries Per Second)",
    category: "metricas",
    simple: "Quantas requisições por segundo o app processa.",
    whyItMatters: "Métrica de carga. Importa quando há muito tráfego.",
    whenItEnters: "Geralmente só em escala avançada.",
    worryNow: "escala-avancada",
  },
  {
    slug: "throughput",
    name: "Throughput",
    category: "performance",
    simple: "Quanta coisa o sistema consegue processar em um período.",
    whyItMatters: "Indica capacidade. Vira tema sob carga alta.",
    whenItEnters: "Quando há muitos usuários simultâneos.",
    worryNow: "com-usuarios",
  },

  // ===== Performance =====
  {
    slug: "caching",
    name: "Caching",
    category: "performance",
    simple: "Guardar resultados prontos para entregar mais rápido na próxima vez.",
    whyItMatters: "Deixa o app mais rápido e barato. Lovable e navegadores já cacheiam muita coisa.",
    whenItEnters: "Antes de divulgar, para garantir velocidade percebida.",
    worryNow: "antes-de-publicar",
  },
  {
    slug: "otimizacao",
    name: "Otimização (Optimisation)",
    category: "performance",
    simple: "Ajustar o app para ficar mais rápido, leve e barato.",
    whyItMatters: "Impacta experiência da pessoa usuária e custos de infraestrutura.",
    whenItEnters: "Depois que o app já funciona — primeiro funciona, depois otimiza.",
    worryNow: "antes-de-publicar",
  },

  // ===== Backend e integrações =====
  {
    slug: "cloud",
    name: "Cloud",
    category: "backend",
    simple: "Servidores e serviços alugados pela internet em vez de máquinas próprias.",
    whyItMatters: "Seu app no Lovable já roda em cloud. Você não precisa montar servidor.",
    whenItEnters: "Já está em uso, mesmo que você não veja.",
    worryNow: "agora",
  },
  {
    slug: "serverless",
    name: "Serverless",
    category: "backend",
    simple: "Código que roda sob demanda, sem você gerenciar servidor.",
    whyItMatters: "É o modelo das Edge Functions do Lovable Cloud.",
    whenItEnters: "Quando você precisa de lógica no backend (pagamento, IA, integrações).",
    worryNow: "em-breve",
  },
  {
    slug: "lambda",
    name: "Lambda",
    category: "backend",
    simple: "Função serverless da Amazon. Roda só quando é chamada.",
    whyItMatters: "Conceito parecido com as Edge Functions que você já tem no Cloud.",
    whenItEnters: "Casos específicos. Não é o caminho padrão da Fábrica.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "rpc",
    name: "RPC (Remote Procedure Call)",
    category: "backend",
    simple: "Chamar uma função que roda em outro lugar como se fosse local.",
    whyItMatters: "No Lovable Cloud você usa RPCs do banco para regras seguras (ex.: papéis de admin).",
    whenItEnters: "Quando você cria funções seguras no banco.",
    worryNow: "em-breve",
  },
  {
    slug: "web-sockets",
    name: "Web sockets",
    category: "backend",
    simple: "Canal aberto entre app e servidor para enviar atualizações em tempo real.",
    whyItMatters: "Usado em chat, notificações ao vivo, presença online.",
    whenItEnters: "Só se o seu app precisa de tempo real.",
    worryNow: "em-breve",
  },
  {
    slug: "long-polling",
    name: "Long polling",
    category: "backend",
    simple: "App pergunta ao servidor 'tem novidade?' e fica esperando a resposta.",
    whyItMatters: "Alternativa simples a web sockets para atualizações próximas do tempo real.",
    whenItEnters: "Casos específicos. Geralmente não é necessário no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "short-polling",
    name: "Short polling",
    category: "backend",
    simple: "App pergunta de tempos em tempos 'tem novidade?'.",
    whyItMatters: "Simples de implementar, mas custa mais requisições.",
    whenItEnters: "Casos específicos. Para a maioria das pessoas participantes, não é necessário.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "kafka-rabbitmq",
    name: "Kafka / RabbitMQ",
    category: "escala",
    simple: "Sistemas para mandar mensagens entre partes diferentes do app.",
    whyItMatters: "Úteis em apps grandes que processam muitos eventos.",
    whenItEnters: "Escala avançada. Não se preocupe com isso no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "sqs",
    name: "SQS",
    category: "escala",
    simple: "Fila de mensagens da Amazon para coordenar tarefas em segundo plano.",
    whyItMatters: "Útil em apps grandes com muitas tarefas assíncronas.",
    whenItEnters: "Escala avançada. Fora do escopo inicial.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },

  // ===== Infraestrutura =====
  {
    slug: "docker",
    name: "Docker",
    category: "infra",
    simple: "Empacota um app com tudo que ele precisa para rodar igual em qualquer máquina.",
    whyItMatters: "Padrão da indústria para empacotar serviços.",
    whenItEnters: "Lovable Cloud cuida disso. Você não precisa configurar manualmente.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "containerisation",
    name: "Containerisation",
    category: "infra",
    simple: "A prática de empacotar serviços em 'caixas' isoladas (containers).",
    whyItMatters: "Permite rodar e atualizar serviços de forma previsível.",
    whenItEnters: "Conceito de fundo. Você não configura no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    category: "infra",
    simple: "Sistema que coordena vários containers em produção.",
    whyItMatters: "Padrão para empresas que rodam dezenas de serviços.",
    whenItEnters: "Escala muito avançada. Não se preocupe com isso no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "load-balancer",
    name: "Load balancer / proxy",
    category: "escala",
    simple: "Distribui as requisições entre vários servidores para nenhum ficar sobrecarregado.",
    whyItMatters: "Garante que o app continue rápido com muito tráfego.",
    whenItEnters: "Escala avançada. A infraestrutura do Cloud já faz isso por você no início.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "s3",
    name: "S3",
    category: "infra",
    simple: "Serviço da Amazon para guardar arquivos (imagens, PDFs, vídeos).",
    whyItMatters: "Equivalente ao Storage do Lovable Cloud, que você usa para uploads.",
    whenItEnters: "Quando o app precisa armazenar arquivos.",
    worryNow: "em-breve",
  },
  {
    slug: "ftp",
    name: "FTP",
    category: "infra",
    simple: "Protocolo antigo para transferir arquivos entre computadores.",
    whyItMatters: "Muito raro hoje. Apps modernos usam Storage/HTTPS.",
    whenItEnters: "Praticamente nunca em apps Lovable.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },

  // ===== Ferramentas de desenvolvimento =====
  {
    slug: "git-github",
    name: "Git / GitHub",
    category: "ferramentas",
    simple: "Sistema para versionar código e guardar histórico de mudanças.",
    whyItMatters: "Permite voltar a versões antigas e exportar seu projeto para fora do Lovable.",
    whenItEnters: "Quando você quer backup externo ou trabalhar com mais pessoas.",
    worryNow: "em-breve",
  },
  {
    slug: "cherry-pick",
    name: "Cherry pick",
    category: "ferramentas",
    simple: "Pegar uma mudança específica de uma versão e aplicar em outra.",
    whyItMatters: "Comando avançado de Git.",
    whenItEnters: "Só se você for usar Git manualmente. No fluxo Lovable, raramente.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },

  // ===== Inteligência artificial =====
  {
    slug: "tensorflow",
    name: "TensorFlow",
    category: "ia",
    simple: "Biblioteca para treinar e usar modelos de IA do zero.",
    whyItMatters: "Para quem cria modelos próprios. A Fábrica usa IA via Lovable AI Gateway, sem precisar treinar.",
    whenItEnters: "Fora do escopo da Fábrica.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },

  // ===== Começo / versão inicial =====
  {
    slug: "mvp",
    name: "MVP (versão mínima)",
    category: "comeco",
    simple: "A versão mais simples do app que já entrega valor para a pessoa usuária.",
    whyItMatters: "Evita gastar tempo construindo o que ninguém vai usar. Foque no essencial primeiro.",
    whenItEnters: "Logo no início, antes de copiar prompts para o Lovable.",
    worryNow: "agora",
    relatedModuleId: "mvp",
  },
  {
    slug: "escopo",
    name: "Escopo",
    category: "comeco",
    simple: "O que entra e o que NÃO entra na primeira versão do app.",
    whyItMatters: "Sem escopo claro, o app cresce sem fim e nunca fica pronto.",
    whenItEnters: "Antes de planejar telas e prompts.",
    worryNow: "agora",
    relatedModuleId: "planejar",
  },
  {
    slug: "versao-versionamento",
    name: "Versão / versionamento",
    category: "comeco",
    simple: "Cada estágio do app (v1, v2, v3) com melhorias acumuladas.",
    whyItMatters: "Permite evoluir sem quebrar o que já funciona.",
    whenItEnters: "A partir do momento em que o MVP está no ar.",
    worryNow: "em-breve",
    relatedModuleId: "melhorias",
  },

  // ===== Telas, fluxo e experiência =====
  {
    slug: "fluxo",
    name: "Fluxo do app",
    category: "telas",
    simple: "O caminho que a pessoa usuária percorre dentro do app, de tela em tela.",
    whyItMatters: "Um fluxo confuso faz a pessoa usuária desistir antes de chegar no objetivo.",
    whenItEnters: "Antes de pedir telas ao Lovable.",
    worryNow: "agora",
    relatedModuleId: "telas",
  },
  {
    slug: "ux",
    name: "UX (experiência da pessoa usuária)",
    category: "telas",
    simple: "Como a pessoa se sente usando o app: fácil, claro, sem fricção.",
    whyItMatters: "Um app bonito mas confuso não vende. UX boa retém pessoas usuárias.",
    whenItEnters: "Em toda decisão de tela e fluxo.",
    worryNow: "agora",
    relatedModuleId: "telas",
  },
  {
    slug: "ui",
    name: "UI (interface visual)",
    category: "telas",
    simple: "A parte visual do app: cores, botões, tipografia, espaçamento.",
    whyItMatters: "Comunica profissionalismo e confiança em segundos.",
    whenItEnters: "Quando você está montando as telas.",
    worryNow: "agora",
    relatedModuleId: "telas",
  },
  {
    slug: "estado-vazio",
    name: "Estado vazio",
    category: "telas",
    simple: "Como a tela aparece quando ainda não há nenhum dado (zero itens, zero clientes).",
    whyItMatters: "Uma tela vazia bem feita orienta a pessoa usuária a dar o próximo passo.",
    whenItEnters: "Na revisão das telas principais.",
    worryNow: "antes-de-publicar",
    relatedModuleId: "telas",
  },

  // ===== Mobile / PWA / Android / iOS =====
  {
    slug: "pwa",
    name: "PWA",
    category: "mobile",
    simple: "Um app web que pode parecer aplicativo instalado no celular.",
    whyItMatters: "Ajuda a entregar uma experiência mais parecida com app, sem precisar criar um app nativo logo no início.",
    whenItEnters: "Quando você quiser que a pessoa ou cliente acesse pelo celular com mais praticidade.",
    worryNow: "em-breve",
    relatedModuleId: "publicar",
  },
  {
    slug: "app-responsivo",
    name: "App responsivo",
    category: "mobile",
    simple: "Um app que se adapta bem ao celular, tablet e computador.",
    whyItMatters: "A maioria das pessoas acessa pelo celular, então as telas precisam ficar fáceis de usar.",
    whenItEnters: "Desde as primeiras telas do app.",
    worryNow: "agora",
    relatedModuleId: "telas",
  },
  {
    slug: "mobile-first",
    name: "Mobile-first",
    category: "mobile",
    simple: "Pensar primeiro na experiência do celular.",
    whyItMatters: "Evita telas apertadas, botões pequenos e fluxos difíceis para quem usa pelo celular.",
    whenItEnters: "Na criação das telas e fluxos principais.",
    worryNow: "agora",
    relatedModuleId: "telas",
  },
  {
    slug: "tela-inicial-celular",
    name: "Tela inicial do celular",
    category: "mobile",
    simple: "Atalho que a pessoa usuária pode salvar na tela do celular para abrir o app mais rápido.",
    whyItMatters: "Dá sensação de app instalado, mesmo sendo um app web/PWA.",
    whenItEnters: "Depois que o app estiver publicado e testado.",
    worryNow: "antes-de-publicar",
  },
  {
    slug: "manifest",
    name: "Manifest",
    category: "mobile",
    simple: "Arquivo com informações do app, como nome, ícone e aparência quando instalado.",
    whyItMatters: "É uma parte importante para transformar um app web em PWA.",
    whenItEnters: "Quando você quiser melhorar a experiência de instalação no celular.",
    worryNow: "em-breve",
  },
  {
    slug: "service-worker",
    name: "Service Worker",
    category: "mobile",
    simple: "Recurso técnico que ajuda o PWA a carregar melhor e, em alguns casos, funcionar offline.",
    whyItMatters: "Pode melhorar performance e experiência no celular.",
    whenItEnters: "Em etapas mais avançadas de publicação e otimização.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "push-notification",
    name: "Push notification",
    category: "mobile",
    simple: "Notificação enviada para o celular ou navegador da pessoa usuária.",
    whyItMatters: "Pode lembrar a pessoa usuária de voltar ao app.",
    whenItEnters: "Depois que o app já estiver validado e com usuários reais.",
    worryNow: "com-usuarios",
  },
  {
    slug: "app-nativo",
    name: "App nativo",
    category: "mobile",
    simple: "Aplicativo criado especificamente para Android ou iOS.",
    whyItMatters: "Pode ser necessário em projetos mais avançados, mas costuma exigir mais estrutura.",
    whenItEnters: "Depois de validar a ideia, se houver necessidade real de loja, câmera avançada, recursos nativos ou escala.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
  {
    slug: "android-ios",
    name: "Android / iOS",
    category: "mobile",
    simple: "Android e iOS são os principais sistemas de celular.",
    whyItMatters: "Alguns comportamentos podem mudar entre celulares diferentes.",
    whenItEnters: "Na etapa de testes antes de publicar.",
    worryNow: "antes-de-publicar",
  },
  {
    slug: "permissoes-celular",
    name: "Permissões do celular",
    category: "mobile",
    simple: "Autorizações para usar recursos como câmera, localização, microfone ou notificações.",
    whyItMatters: "Sem permissão, alguns recursos não funcionam.",
    whenItEnters: "Quando o app precisar de câmera, localização ou notificações.",
    worryNow: "em-breve",
  },
  {
    slug: "geolocalizacao",
    name: "Geolocalização",
    category: "mobile",
    simple: "Recurso que identifica a localização aproximada da pessoa usuária.",
    whyItMatters: "Pode ser útil para mapas, entregas, agendas locais ou busca por proximidade.",
    whenItEnters: "Somente se a ideia do app realmente precisar disso.",
    worryNow: "em-breve",
  },
  {
    slug: "camera-no-app",
    name: "Câmera no app",
    category: "mobile",
    simple: "Uso da câmera do celular dentro do app.",
    whyItMatters: "Pode servir para fotos, comprovantes, perfis, registros e uploads.",
    whenItEnters: "Quando a funcionalidade fizer parte do valor principal do app.",
    worryNow: "em-breve",
  },
  {
    slug: "safe-area",
    name: "Safe area",
    category: "mobile",
    simple: "Espaço de segurança da tela para não esconder conteúdo atrás de bordas, notch ou barras do celular.",
    whyItMatters: "Evita botão cortado ou texto escondido em alguns modelos de celular.",
    whenItEnters: "Na revisão visual mobile.",
    worryNow: "antes-de-publicar",
  },
  {
    slug: "botao-tocavel",
    name: "Botão tocável",
    category: "mobile",
    simple: "Botão grande o suficiente para ser tocado com o dedo sem dificuldade.",
    whyItMatters: "Botões pequenos causam erro e frustração no celular.",
    whenItEnters: "Na revisão de UX das telas.",
    worryNow: "agora",
  },
  {
    slug: "webview",
    name: "WebView",
    category: "mobile",
    simple: "Uma forma de exibir um app web dentro de uma estrutura de aplicativo.",
    whyItMatters: "Às vezes é usada para transformar um app web em algo parecido com app nativo.",
    whenItEnters: "Somente em etapas mais avançadas.",
    worryNow: "escala-avancada",
    notForBeginners: true,
  },
];
