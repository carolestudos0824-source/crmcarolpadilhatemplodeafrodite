// Painel Arquiteto de Apps — dados de todos os módulos
// Todos os comandos são para o Lovable.

export type Command = {
  n: number;
  title: string;
  purpose: string;
  when: string;
  where: string;
  result: string;
  content: string;
};

export type AppModel = {
  name: string;
  audience: string;
  pain: string;
  monetization: string;
  screens: string[];
  database: string[];
  command: string;
  checklist: string[];
};

export type CommonError = {
  category: string;
  title: string;
  explanation: string;
  fix: string;
  command: string;
};

export type ModuleId =
  | "comece"
  | "ideias"
  | "construir"
  | "login"
  | "venda"
  | "checkout"
  | "seo"
  | "campanhas"
  | "criativos"
  | "validacao"
  | "checklist"
  | "erros"
  | "ativar";

export type ModuleMeta = {
  id: ModuleId;
  label: string;
  icon: string; // lucide icon name
};

export const MODULES: ModuleMeta[] = [
  { id: "comece", label: "Comece aqui", icon: "Sparkles" },
  { id: "ideias", label: "Ideias prontas", icon: "Lightbulb" },
  { id: "construir", label: "Construir app", icon: "Hammer" },
  { id: "login", label: "Login e banco", icon: "Lock" },
  { id: "venda", label: "Página de venda", icon: "Megaphone" },
  { id: "checkout", label: "Checkout e entrega", icon: "ShoppingCart" },
  { id: "seo", label: "SEO e GEO", icon: "Search" },
  { id: "campanhas", label: "Campanhas", icon: "Rocket" },
  { id: "criativos", label: "Criativos", icon: "Image" },
  { id: "validacao", label: "Validação", icon: "Users" },
  { id: "checklist", label: "Checklist", icon: "ListChecks" },
  { id: "erros", label: "Erros comuns", icon: "AlertTriangle" },
  { id: "ativar", label: "Ativar acesso", icon: "Gift" },
];

// Ordem para navegação Voltar/Próximo
export const MODULE_ORDER: ModuleId[] = MODULES.map((m) => m.id);

// ============ Comandos por módulo ============

const cmd = (
  n: number,
  title: string,
  purpose: string,
  when: string,
  where: string,
  result: string,
  content: string,
): Command => ({ n, title, purpose, when, where, result, content });

export const COMMANDS_CONSTRUIR: Command[] = [
  cmd(
    1,
    "Transformar ideia em plano",
    "Serve para o Lovable entender sua ideia antes de construir.",
    "Use primeiro, antes de pedir telas ou banco.",
    "Cole no Lovable, no campo de conversa do projeto.",
    "Um plano com MVP, telas, fluxo e estrutura.",
    `Você é um especialista em produto digital, UX e Lovable.

Minha ideia é:
[descreva sua ideia]

Quem vai usar:
[descreva o público]

Problema que resolve:
[descreva a dor]

Antes de construir, gere um plano com:
1. Veredito estratégico
2. Usuário principal
3. Ação principal
4. MVP com no máximo 5 funcionalidades
5. O que cortar agora
6. Fluxo em até 5 etapas
7. Telas necessárias
8. Banco de dados necessário
9. Monetização
10. Ordem de construção

Regras:
- Mobile first.
- Não inchar o produto.
- Explicar de forma simples.`,
  ),
  cmd(
    2,
    "Construir primeira versão",
    "Pede ao Lovable que comece a construir o app.",
    "Depois que o plano do Comando 1 estiver pronto.",
    "Cole no mesmo projeto do Lovable.",
    "As primeiras telas e o fluxo principal criados.",
    `Construa a primeira versão do app com base neste plano:

[cole o plano do Comando 1]

Crie:
1. Páginas principais
2. Componentes básicos
3. Fluxo principal
4. Estados vazios, erro e sucesso

Regras:
- Apenas MVP.
- Mobile first.
- Interface simples.`,
  ),
  cmd(
    3,
    "Criar dashboard",
    "Cria a tela inicial do usuário depois do login.",
    "Depois que telas principais e login existirem.",
    "Cole no Lovable.",
    "Uma tela inicial com resumo e próxima ação.",
    `Crie um dashboard simples para o usuário.

Mostre:
1. Resumo principal
2. Próxima ação recomendada
3. Itens mais importantes
4. Botão para criar novo item
5. Estado vazio explicando o próximo passo

Regra: o usuário entende o próximo passo em 5 segundos.`,
  ),
  cmd(
    4,
    "Melhorar design mobile",
    "Deixa o app bonito, claro e fácil de usar no celular.",
    "Depois que o app já tem telas principais.",
    "Cole no Lovable.",
    "Cores, espaçamento, botões e mobile melhorados.",
    `Melhore o design mobile do app.

Ajuste cores, espaçamento, botões, cards, títulos, ícones, navegação, contraste e estados vazios.

Regras:
- Não mudar lógica.
- Não adicionar funcionalidades.
- Só melhorar visual e experiência no celular.`,
  ),
  cmd(
    5,
    "Revisar MVP",
    "Revisa o app antes de continuar para login/banco.",
    "Antes de avançar para área restrita.",
    "Cole no Lovable.",
    "Lista de problemas e correções aplicadas.",
    `Faça uma revisão do MVP atual.

Verifique:
1. Fluxo principal
2. Mobile
3. Estados vazios e de erro
4. Links
5. Textos confusos

Entregue:
1. Problemas encontrados
2. Correções aplicadas
3. O que devo testar manualmente`,
  ),
];

export const COMMANDS_LOGIN: Command[] = [
  cmd(
    1,
    "Criar login e cadastro",
    "Permite que o app tenha usuários e proteja páginas privadas.",
    "Depois que o MVP está pronto.",
    "Cole no Lovable.",
    "Telas de entrar, cadastrar e recuperar acesso.",
    `Adicione login e cadastro ao app.

Regras:
1. Tela de entrar
2. Tela de criar conta
3. Recuperação de acesso
4. Proteger páginas privadas
5. Mensagens claras
6. Usar Supabase Auth se já estiver com Supabase
7. Não expor chaves sensíveis`,
  ),
  cmd(
    2,
    "Criar banco de dados",
    "Faz o app salvar informações de cada usuário.",
    "Quando o app precisa guardar dados.",
    "Cole no Lovable.",
    "Tabelas, relações e políticas de acesso.",
    `Crie o banco de dados necessário.

Contexto:
[descreva o app]

Dados a salvar:
[liste]

Crie:
1. Tabelas e campos
2. Relações
3. Políticas RLS (se Supabase)
4. Dados de exemplo

Regras:
- Cada usuário só vê os próprios dados.
- Não usar service role no frontend.`,
  ),
  cmd(
    3,
    "Criar regras de acesso",
    "Define quem pode ver, criar, editar e apagar dados.",
    "Depois que o banco existir.",
    "Cole no Lovable.",
    "Políticas RLS revisadas e testadas.",
    `Revise as regras de acesso do banco.

Para cada tabela, defina:
1. Quem pode ler
2. Quem pode inserir
3. Quem pode atualizar
4. Quem pode apagar
5. Política para admin

Regra: usuário comum não acessa dados de outro usuário.`,
  ),
  cmd(
    4,
    "Criar área restrita",
    "Cria a área onde o comprador acessa o conteúdo.",
    "Quando o produto precisa de área exclusiva.",
    "Cole no Lovable.",
    "Página protegida por login + acesso liberado.",
    `Crie uma área restrita para compradores.

A área deve:
1. Exigir login
2. Exigir acesso liberado
3. Mostrar boas-vindas
4. Mostrar o que o usuário comprou
5. Mostrar próximos passos
6. Esconder conteúdo para quem não tem acesso`,
  ),
  cmd(
    5,
    "Criar painel admin",
    "Permite ao dono liberar e revogar acesso.",
    "Quando você precisa controlar quem entra.",
    "Cole no Lovable.",
    "Tela admin protegida.",
    `Crie um painel admin simples.

Funções:
1. Buscar usuário por e-mail
2. Ver status de acesso
3. Liberar acesso
4. Revogar acesso
5. Ver data de criação

Regras:
- Só admin acessa.
- Nunca expor service role no frontend.`,
  ),
];

export const COMMANDS_VENDA: Command[] = [
  cmd(1, "Criar landing page", "Apresenta e vende o app.", "Quando o MVP funciona e a promessa está clara.", "Cole no Lovable.", "Landing pública completa.",
    `Crie uma landing page para vender este app.

App: [descreva]
Público: [descreva]
Dor: [descreva]
Promessa: [descreva]
Preço: [informe]

Inclua: hero, subheadline, CTA, dor, solução, como funciona, benefícios, o que está incluso, preço, FAQ, CTA final.

Regras: mobile first, texto claro, sem promessa exagerada.`),
  cmd(2, "Criar página de preço", "Mostra planos e o que está incluso.", "Depois da landing.", "Cole no Lovable.", "Página/seção de preço com CTA.",
    `Crie uma página de preço.

Produto: [descreva]
Preço: [informe]

Entregue: card de preço, lista do que está incluso, do que não está, garantia, FAQ, CTA e texto de segurança.`),
  cmd(3, "Criar FAQ", "Responde dúvidas comuns antes da compra.", "Depois da landing.", "Cole no Lovable.", "Seção FAQ com 8 a 12 perguntas.",
    `Crie uma seção de FAQ para a landing.

Tema: [descreva o produto]

Inclua 10 perguntas reais sobre: o que é, para quem é, como funciona, prazo, garantia, suporte, pagamento, acesso, atualização e dúvidas técnicas básicas.

Regra: respostas curtas, honestas, sem hype.`),
  cmd(4, "Criar página de confiança", "Reúne provas, segurança e contato.", "Quando faltar confiança no fluxo.", "Cole no Lovable.", "Página com provas e dados de contato.",
    `Crie uma página de confiança.

Inclua: quem está por trás, como funciona o suporte, política de reembolso, segurança dos dados, contato direto e canais oficiais.

Regra: nada inventado. Apenas o que for verdade.`),
  cmd(5, "Melhorar copy da oferta", "Deixa o texto da oferta mais claro e direto.", "Quando a landing existe mas não converte.", "Cole no Lovable.", "Copy revisada da oferta.",
    `Revise a copy da oferta da landing.

Atual: [cole o texto atual]
Público: [descreva]
Dor: [descreva]

Reescreva: headline, subheadline, bullets, CTA e parágrafo de garantia. Texto direto, sem clichês, sem promessa exagerada.`),
];

export const COMMANDS_CHECKOUT: Command[] = [
  cmd(1, "Criar checkout", "Organiza o fluxo de compra.", "Quando o produto for vendido.", "Cole no Lovable.", "Fluxo de compra funcional.",
    `Crie o fluxo de checkout.

Inclua: botão de compra, página de checkout ou integração externa, segurança visual, instruções claras e suporte. Não mostrar materiais protegidos.`),
  cmd(2, "Criar página de obrigado", "Confirma a compra e explica o próximo passo.", "Depois do checkout.", "Cole no Lovable.", "Página de obrigado clara.",
    `Crie a página de obrigado.

Inclua: confirmação da compra, instruções pós-compra, link para a área restrita, aviso de e-mail/spam e link de suporte.`),
  cmd(3, "Criar área de entrega", "Entrega os materiais ao comprador.", "Quando o produto exige área exclusiva.", "Cole no Lovable.", "Área protegida e organizada.",
    `Crie a área de entrega.

Inclua: boas-vindas, o que comprou, como usar, materiais, checklist de progresso, suporte e bloqueio para visitantes.`),
  cmd(4, "Criar fluxo de acesso restrito", "Garante que só compradores entrem.", "Depois da área de entrega.", "Cole no Lovable.", "Acesso restrito testado.",
    `Implemente o fluxo de acesso restrito.

Regras:
1. Visitante sem login não acessa
2. Login sem acesso liberado vê mensagem clara
3. Admin libera acesso pelo painel
4. Comprador recebe instrução de como entrar`),
  cmd(5, "Criar recuperação de acesso", "Permite ao comprador voltar a entrar.", "Quando o usuário esquece a senha.", "Cole no Lovable.", "Fluxo de recuperação por e-mail.",
    `Crie o fluxo de recuperação de acesso.

Inclua: link mágico por e-mail, recuperação por senha, mensagens claras e redirecionamento após login.`),
  cmd(6, "Criar painel de liberação de compradores", "Permite ao dono liberar acesso para quem comprou.", "Depois que checkout e área restrita existirem.", "Cole no Lovable.", "Painel admin com liberação de acesso.",
    `Crie um painel de liberação de compradores.

O admin deve conseguir:
1. Buscar usuário por e-mail
2. Liberar acesso após confirmar pagamento
3. Revogar acesso
4. Ver status atual
5. Ver data e origem do acesso

Regras: só admin acessa, nunca expor service role no frontend.`),
];


export const COMMANDS_SEO: Command[] = [
  cmd(1, "Criar plano de SEO", "Define palavras e páginas para o Google.", "Antes de gerar páginas SEO.", "Cole no Lovable.", "Plano com palavras e páginas.",
    `Crie um plano de SEO para este app.

App: [descreva]
Público: [descreva]
Concorrentes: [liste 3]

Entregue: 15 palavras-chave reais, intenção de busca de cada uma, páginas a criar e prioridade.`),
  cmd(2, "Criar páginas para palavras-chave", "Gera páginas para ranquear no Google.", "Depois do plano de SEO.", "Cole no Lovable.", "Páginas SEO publicadas.",
    `Crie páginas otimizadas para as palavras-chave:

[liste palavras do plano]

Cada página deve ter: título, meta description, H1, intro, seções H2, FAQ e CTA. Texto útil, sem keyword stuffing.`),
  cmd(3, "Criar FAQ SEO", "Cria FAQ que responde buscas comuns.", "Depois das páginas principais.", "Cole no Lovable.", "FAQ otimizada para busca.",
    `Crie uma seção de FAQ otimizada para busca.

Tema: [descreva]

Liste 12 perguntas reais que pessoas digitam no Google sobre esse tema e responda cada uma de forma direta.`),
  cmd(4, "Criar páginas GEO", "Cria páginas para mecanismos de IA entenderem o app.", "Depois das páginas SEO.", "Cole no Lovable.", "Páginas explicativas para LLMs.",
    `Crie páginas GEO para que mecanismos de IA entendam este app.

Inclua: o que é o app, para quem serve, como funciona, problemas resolvidos, diferenciais, exemplos de uso e comparação com alternativas. Texto claro, factual, sem hype.`),
  cmd(5, "Criar páginas por nicho", "Páginas específicas para cada público.", "Quando o app atende vários nichos.", "Cole no Lovable.", "Uma página por nicho.",
    `Crie páginas específicas por nicho.

Nichos: [liste]

Cada página: dor do nicho, como o app resolve, prova, FAQ e CTA.`),
  cmd(6, "Criar schema FAQPage", "Marcação para o Google entender o FAQ.", "Depois do FAQ pronto.", "Cole no Lovable.", "JSON-LD FAQPage publicado.",
    `Adicione schema JSON-LD FAQPage nas páginas com FAQ.

Use as perguntas e respostas reais já publicadas. Inclua no <head> da página.`),
  cmd(7, "Criar schema SoftwareApplication", "Marcação para o Google entender o app.", "Na home e na landing principal.", "Cole no Lovable.", "JSON-LD SoftwareApplication.",
    `Adicione schema JSON-LD SoftwareApplication.

Inclua: name, description, applicationCategory, operatingSystem, offers (preço), aggregateRating apenas se houver avaliações reais.`),
];

export const COMMANDS_CAMPANHAS: Command[] = [
  cmd(1, "Criar campanha orgânica", "Plano de divulgação sem pagar mídia.", "Quando não há orçamento.", "Cole no Lovable.", "Plano de conteúdo orgânico.",
    `Crie um plano de campanha orgânica para divulgar este app.

App: [descreva]
Público: [descreva]
Canais: [Instagram, TikTok, LinkedIn, grupos, etc]

Entregue: 14 ideias de post, formato, gancho, CTA e dia ideal.`),
  cmd(2, "Criar campanha paga", "Plano de anúncios pagos.", "Quando há orçamento mínimo.", "Cole no Lovable.", "Estrutura de campanha paga.",
    `Crie uma campanha paga para este app.

Plataforma: [Meta, Google, TikTok]
Objetivo: [tráfego, leads, vendas]
Orçamento: [valor]

Entregue: estrutura de campanha, públicos, criativos sugeridos, copy e métricas a acompanhar.`),
  cmd(3, "Criar campanha de WhatsApp", "Mensagens prontas para distribuir no WhatsApp.", "Para falar com lista quente.", "Cole no Lovable.", "Sequência pronta para WhatsApp.",
    `Crie uma campanha de WhatsApp.

Público: [descreva]
Objetivo: [descreva]

Entregue: 5 mensagens prontas, ordem de envio, intervalo e CTA.`),
  cmd(4, "Criar campanha de lista de espera", "Aquece público antes do lançamento.", "Antes de abrir vendas.", "Cole no Lovable.", "Campanha de lista de espera.",
    `Crie uma campanha de lista de espera.

Inclua: página de captura, sequência de e-mails de aquecimento, mensagens de WhatsApp e copy do convite.`),
  cmd(5, "Criar plano de 7 dias", "Plano enxuto para uma semana.", "Quando quer começar rápido.", "Cole no Lovable.", "Calendário de 7 dias.",
    `Crie um plano de divulgação de 7 dias.

App: [descreva]
Público: [descreva]

Entregue: o que postar em cada dia, formato, canal e CTA.`),
  cmd(6, "Criar plano de 30 dias", "Plano completo de um mês.", "Quando quer consistência.", "Cole no Lovable.", "Calendário de 30 dias.",
    `Crie um plano de divulgação de 30 dias.

Entregue: tema da semana, posts por dia, formato, canal, CTA e métrica a acompanhar.`),
  cmd(7, "Analisar resultado da campanha", "Lê números e diz o que ajustar.", "Depois de rodar uma campanha.", "Cole no Lovable.", "Análise e próximos passos.",
    `Analise o resultado desta campanha.

Dados:
[cole métricas: impressões, cliques, CPC, CTR, leads, vendas, custo total]

Diga: o que funcionou, o que não funcionou, o que ajustar e o que testar a seguir.`),
];

export const COMMANDS_CRIATIVOS: Command[] = [
  cmd(1, "Criar criativos estáticos", "Anúncios em imagem.", "Para Meta Ads e Instagram.", "Cole no Lovable.", "5 conceitos de criativo estático.",
    `Crie 5 conceitos de criativo estático.

App: [descreva]
Público: [descreva]
Dor: [descreva]
Promessa: [descreva]

Para cada um: gancho visual, headline, subheadline, CTA e descrição da imagem.`),
  cmd(2, "Criar roteiros de vídeo", "Roteiros curtos para anúncios.", "Para Reels, TikTok, Shorts.", "Cole no Lovable.", "5 roteiros prontos.",
    `Crie 5 roteiros de vídeo de até 30 segundos.

App: [descreva]
Público: [descreva]

Para cada roteiro: gancho nos 3s, dor, virada, prova, CTA. Texto natural, fácil de gravar no celular.`),
  cmd(3, "Criar anúncios para Meta Ads", "Copies prontas para Facebook/Instagram Ads.", "Para subir campanha paga.", "Cole no Lovable.", "5 anúncios completos.",
    `Crie 5 anúncios para Meta Ads.

Para cada um: título principal, texto principal, descrição, CTA e ideia de criativo.`),
  cmd(4, "Criar posts para Instagram", "Posts orgânicos.", "Para alimentar perfil.", "Cole no Lovable.", "10 posts prontos.",
    `Crie 10 posts para Instagram.

Para cada post: tipo (carrossel, imagem única, reels), tema, copy, hashtags e CTA.`),
  cmd(5, "Criar stories", "Sequência de stories.", "Para engajar lista atual.", "Cole no Lovable.", "Sequência de 8 stories.",
    `Crie uma sequência de 8 stories.

Para cada story: objetivo, texto, elemento interativo (enquete, caixa de pergunta, contagem) e CTA final.`),
  cmd(6, "Criar vídeos curtos", "Ideias para Reels/TikTok orgânicos.", "Para crescer alcance.", "Cole no Lovable.", "10 ideias com gancho.",
    `Crie 10 ideias de vídeo curto orgânico.

Para cada uma: gancho nos 3s, formato, roteiro resumido e CTA.`),
  cmd(7, "Criar teste A/B de criativos", "Estrutura para comparar criativos.", "Depois de ter 4+ criativos.", "Cole no Lovable.", "Plano de teste A/B.",
    `Crie um plano de teste A/B de criativos.

Criativos disponíveis: [liste]

Diga: o que testar, como dividir orçamento, por quanto tempo e como decidir o vencedor.`),
  cmd(8, "Criar biblioteca de criativos", "Organiza tudo em um só lugar.", "Quando começa a acumular criativos.", "Cole no Lovable.", "Estrutura de biblioteca.",
    `Crie a estrutura de uma biblioteca de criativos.

Inclua: categoria, formato, status, métrica, link do arquivo e data. Sugira tabela ou ferramenta gratuita.`),
];

export const COMMANDS_VALIDACAO: Command[] = [
  cmd(1, "Criar plano para validar com 10 usuários", "Define como testar com gente real.", "Depois do MVP publicado.", "Cole no Lovable.", "Plano de validação.",
    `Crie um plano para validar este app com 10 usuários reais.

App: [descreva]
Público: [descreva]

Entregue: quem chamar, onde encontrar, mensagem de convite, tarefas para fazer, perguntas de feedback, métrica principal e critérios de continuar/ajustar/abandonar.`),
  cmd(2, "Criar formulário de feedback", "Formulário para coletar resposta.", "Para enviar depois do teste.", "Cole no Lovable.", "Formulário pronto.",
    `Crie um formulário de feedback com 8 perguntas.

Misture pergunta fechada e aberta. Foco em entender se o usuário entendeu, se usaria de novo e se pagaria.`),
  cmd(3, "Criar mensagem de convite", "Texto para convidar pessoas.", "Antes de iniciar o teste.", "Cole no Lovable.", "3 versões de convite.",
    `Crie 3 mensagens curtas para convidar 10 pessoas a testar este app.

Tom: direto, pessoal, sem hype. Inclua o que a pessoa ganha ao testar.`),
  cmd(4, "Criar pesquisa com usuários", "Pesquisa estruturada.", "Para entender o público.", "Cole no Lovable.", "Pesquisa pronta.",
    `Crie uma pesquisa com 10 perguntas para entender o público deste app.

Foco em: dor real, como resolve hoje, quanto pagaria, frequência de uso.`),
  cmd(5, "Analisar feedback", "Lê respostas e diz o que mudar.", "Depois de coletar respostas.", "Cole no Lovable.", "Resumo do feedback.",
    `Analise as respostas coletadas.

Respostas:
[cole]

Entregue: padrões identificados, dores repetidas, melhorias prioritárias e o que NÃO mudar.`),
  cmd(6, "Melhorar app depois do feedback", "Aplica melhorias no Lovable.", "Depois de analisar feedback.", "Cole no Lovable.", "App ajustado.",
    `Aplique melhorias no app com base neste feedback:

[cole resumo]

Regras: corrigir o que é dor real, não inchar o app, manter MVP enxuto.`),
];

// ============ Modelos de apps prontos ============

export const APP_MODELS: AppModel[] = [
  {
    name: "AgendaPro Local",
    audience: "Barbeiros, manicures, esteticistas, personal trainers.",
    pain: "Perdem horários e dependem de mensagens soltas no WhatsApp.",
    monetization: "Assinatura mensal por profissional.",
    screens: ["Login", "Agenda", "Cadastro de serviços", "Cadastro de clientes", "Painel"],
    database: ["profissionais", "servicos", "clientes", "agendamentos"],
    command: `Crie no Lovable um app chamado AgendaPro Local.

Público: profissionais autônomos (barbeiros, manicures, esteticistas, personal trainers).
Dor: perdem horários e clientes por usarem só WhatsApp.

MVP:
1. Cadastro de serviços
2. Agenda de horários
3. Cadastro de clientes
4. Confirmação de agendamento
5. Painel do profissional

Banco: profissionais, servicos, clientes, agendamentos.
Mobile first. Sem inchar.`,
    checklist: ["Profissional cria serviço", "Cliente é cadastrado", "Agendamento confirmado", "Painel mostra agenda do dia"],
  },
  {
    name: "CardápioZap",
    audience: "Pequenos restaurantes, lanchonetes e delivery local.",
    pain: "Cardápio em PDF e pedidos por WhatsApp sem organização.",
    monetization: "Assinatura mensal por estabelecimento.",
    screens: ["Cardápio público", "Carrinho", "Checkout WhatsApp", "Admin do dono"],
    database: ["lojas", "categorias", "produtos", "pedidos"],
    command: `Crie no Lovable um app chamado CardápioZap.

Público: pequenos restaurantes e delivery.
Dor: cardápio em PDF e pedidos bagunçados no WhatsApp.

MVP:
1. Cardápio público com fotos
2. Carrinho
3. Envio de pedido por WhatsApp formatado
4. Admin para o dono cadastrar produtos
5. Categorias

Banco: lojas, categorias, produtos, pedidos. Mobile first.`,
    checklist: ["Dono cadastra produto", "Cliente monta pedido", "Pedido vai para WhatsApp", "Admin protegido"],
  },
  {
    name: "ControleMEI",
    audience: "Microempreendedores individuais.",
    pain: "Não controlam entradas, saídas e limite anual do MEI.",
    monetization: "Assinatura mensal baixa.",
    screens: ["Dashboard", "Entradas", "Saídas", "Relatório anual"],
    database: ["usuarios", "lancamentos", "categorias"],
    command: `Crie no Lovable um app chamado ControleMEI.

Público: MEIs no Brasil.
Dor: não controlam faturamento e estouram o limite anual.

MVP:
1. Lançar entrada
2. Lançar saída
3. Dashboard com total do mês
4. Aviso de aproximação do limite anual
5. Relatório anual simples

Banco: usuarios, lancamentos, categorias. Cada usuário só vê seus dados.`,
    checklist: ["Lança entrada", "Lança saída", "Dashboard atualiza", "Aviso de limite funciona"],
  },
  {
    name: "TreinoSimples",
    audience: "Personal trainers e alunos.",
    pain: "Planilhas confusas e treinos perdidos no WhatsApp.",
    monetization: "Assinatura por personal.",
    screens: ["Login", "Lista de alunos", "Treino do aluno", "Histórico"],
    database: ["personais", "alunos", "treinos", "exercicios"],
    command: `Crie no Lovable um app chamado TreinoSimples.

Público: personal trainers e seus alunos.
Dor: treinos enviados por PDF e WhatsApp se perdem.

MVP:
1. Personal cadastra aluno
2. Personal monta treino
3. Aluno vê treino da semana no celular
4. Aluno marca exercício feito
5. Histórico simples

Banco: personais, alunos, treinos, exercicios. Mobile first.`,
    checklist: ["Personal cadastra aluno", "Monta treino", "Aluno acessa", "Marca feito"],
  },
  {
    name: "Imobiliária Fácil",
    audience: "Corretores autônomos e mini imobiliárias.",
    pain: "Imóveis espalhados em planilhas e fotos no WhatsApp.",
    monetization: "Assinatura mensal por corretor.",
    screens: ["Lista de imóveis", "Detalhe", "Cadastro", "Painel"],
    database: ["corretores", "imoveis", "leads"],
    command: `Crie no Lovable um app chamado Imobiliária Fácil.

Público: corretores autônomos.
Dor: imóveis espalhados em planilhas e WhatsApp.

MVP:
1. Cadastrar imóvel com fotos
2. Página pública do imóvel
3. Captura de lead
4. Painel do corretor
5. Filtros básicos

Banco: corretores, imoveis, leads. Página pública otimizada para mobile.`,
    checklist: ["Cadastra imóvel", "Página pública abre", "Lead chega no painel"],
  },
  {
    name: "Escola de Reforço Online",
    audience: "Professores particulares e pais.",
    pain: "Aulas particulares sem organização nem material.",
    monetization: "Assinatura por professor.",
    screens: ["Login", "Turmas", "Aula", "Tarefas"],
    database: ["professores", "alunos", "aulas", "tarefas"],
    command: `Crie no Lovable um app chamado Escola de Reforço Online.

Público: professores particulares.
Dor: aulas sem material organizado.

MVP:
1. Cadastrar aluno
2. Criar aula com conteúdo
3. Enviar tarefa
4. Aluno marca como feita
5. Painel do professor

Banco: professores, alunos, aulas, tarefas. Mobile first.`,
    checklist: ["Cadastra aluno", "Cria aula", "Aluno acessa", "Marca tarefa feita"],
  },
  {
    name: "PetAgenda",
    audience: "Pet shops, banho e tosa, veterinários autônomos.",
    pain: "Agendamentos confusos no WhatsApp e clientes perdidos.",
    monetization: "Assinatura por estabelecimento.",
    screens: ["Agenda", "Cadastro de pet", "Cadastro de tutor", "Serviços"],
    database: ["estabelecimentos", "tutores", "pets", "agendamentos", "servicos"],
    command: `Crie no Lovable um app chamado PetAgenda.

Público: pet shops e banho e tosa.
Dor: agenda bagunçada e clientes esquecidos.

MVP:
1. Cadastrar tutor e pet
2. Cadastrar serviços
3. Agendar horário
4. Confirmação automática
5. Painel do estabelecimento

Banco: estabelecimentos, tutores, pets, agendamentos, servicos. Mobile first.`,
    checklist: ["Cadastra tutor + pet", "Agenda serviço", "Painel mostra dia", "Confirmação enviada"],
  },
  {
    name: "Lista de Espera Inteligente",
    audience: "Lançadores de produto digital, infoprodutores.",
    pain: "Capturam leads mas não aquecem antes do lançamento.",
    monetization: "Assinatura por projeto.",
    screens: ["Página de captura", "Painel do criador", "Sequência"],
    database: ["projetos", "leads", "sequencias", "envios"],
    command: `Crie no Lovable um app chamado Lista de Espera Inteligente.

Público: infoprodutores no pré-lançamento.
Dor: capturam e-mail mas não aquecem o lead.

MVP:
1. Página de captura
2. Sequência de aquecimento
3. Painel do criador
4. Indicador "convide 3 amigos"
5. Disparo simples por e-mail

Banco: projetos, leads, sequencias, envios.`,
    checklist: ["Captura lead", "Lead entra na sequência", "Painel mostra total", "Indicação funciona"],
  },
  {
    name: "OrçaFácil",
    audience: "Prestadores de serviço (pintor, marceneiro, elétrica, reforma).",
    pain: "Fazem orçamento no papel ou WhatsApp e perdem cliente.",
    monetization: "Assinatura mensal baixa.",
    screens: ["Novo orçamento", "Lista", "Orçamento público", "Painel"],
    database: ["prestadores", "clientes", "orcamentos", "itens"],
    command: `Crie no Lovable um app chamado OrçaFácil.

Público: prestadores de serviço.
Dor: orçamento no papel/WhatsApp, sem profissionalismo.

MVP:
1. Criar orçamento com itens
2. Link público do orçamento
3. Cliente aceita ou recusa
4. Painel do prestador
5. PDF simples

Banco: prestadores, clientes, orcamentos, itens.`,
    checklist: ["Cria orçamento", "Envia link", "Cliente aceita", "Painel atualiza"],
  },
  {
    name: "Mini CRM WhatsApp",
    audience: "Vendedores autônomos e pequenos times comerciais.",
    pain: "Conversas perdidas no WhatsApp e leads sem follow-up.",
    monetization: "Assinatura por vendedor.",
    screens: ["Lista de leads", "Detalhe do lead", "Funil", "Lembretes"],
    database: ["vendedores", "leads", "interacoes", "tarefas"],
    command: `Crie no Lovable um app chamado Mini CRM WhatsApp.

Público: vendedores autônomos.
Dor: leads do WhatsApp se perdem sem follow-up.

MVP:
1. Cadastrar lead
2. Funil simples (novo, contato, proposta, fechado)
3. Anotar interação
4. Lembrete de follow-up
5. Painel com totais

Banco: vendedores, leads, interacoes, tarefas.`,
    checklist: ["Cadastra lead", "Move no funil", "Anota interação", "Recebe lembrete"],
  },
];

// ============ Erros comuns ============

export const COMMON_ERRORS: CommonError[] = [
  {
    category: "Lovable",
    title: "Lovable criou coisa demais",
    explanation: "Você pediu MVP mas ele entregou recursos extras.",
    fix: "Peça para remover o que não está no MVP e voltar ao plano original.",
    command: `Revise o app e remova tudo que não está neste MVP:

[cole a lista do MVP]

Mantenha somente as 5 funcionalidades acordadas. Não adicione novidades.`,
  },
  {
    category: "Login",
    title: "Login não funciona",
    explanation: "Usuário não consegue entrar ou recebe erro.",
    fix: "Peça ao Lovable para revisar fluxo de autenticação e mensagens.",
    command: `Revise o fluxo de login.

Verifique: cadastro, login, recuperação de senha, redirecionamento após login e mensagens claras de erro. Use Supabase Auth corretamente.`,
  },
  {
    category: "Banco",
    title: "Banco não salva",
    explanation: "Dados somem ou erro ao gravar.",
    fix: "Peça revisão das políticas RLS e do client de inserção.",
    command: `Revise por que o banco não está salvando dados.

Verifique: políticas RLS, GRANTS, schema da tabela, payload enviado e mensagens de erro no console. Corrija e explique o que estava errado.`,
  },
  {
    category: "Mobile",
    title: "Página ficou feia no celular",
    explanation: "Layout quebrado, texto cortado, botões pequenos.",
    fix: "Peça ajuste mobile first.",
    command: `Ajuste o layout mobile da página [nome].

Garanta: nada com scroll horizontal, botões com toque confortável, texto legível, espaçamento adequado e cards em uma coluna no celular.`,
  },
  {
    category: "UI",
    title: "Botão não funciona",
    explanation: "Clica e nada acontece.",
    fix: "Peça verificação do handler e estado.",
    command: `Verifique por que o botão [descreva] não está funcionando.

Cheque: handler conectado, estado correto, validações, console do navegador. Corrija e teste.`,
  },
  {
    category: "Acesso",
    title: "Usuário não consegue entrar",
    explanation: "Login ok mas a área restrita não abre.",
    fix: "Peça revisão da regra de acesso liberado.",
    command: `Revise por que o usuário logado não acessa a área restrita.

Verifique: tabela user_access, flag has_access, redirecionamento e mensagens. Corrija.`,
  },
  {
    category: "Programa",
    title: "Não sei qual comando usar",
    explanation: "Está na dúvida sobre a ordem.",
    fix: "Volte para Comece aqui e siga a trilha em ordem.",
    command: `Sou iniciante. Me diga, com base neste plano:

[cole o plano]

Qual deve ser o próximo comando que devo usar no Lovable e por quê.`,
  },
  {
    category: "Divulgação",
    title: "Não sei divulgar",
    explanation: "App pronto mas sem público.",
    fix: "Use os módulos Campanhas e Criativos.",
    command: `Crie um plano de divulgação para os primeiros 30 dias.

App: [descreva]
Público: [descreva]
Orçamento: [informe]

Entregue calendário, canais, ideias de post e meta de leads.`,
  },
  {
    category: "Anúncios",
    title: "Anúncio não converte",
    explanation: "Tráfego não vira lead nem venda.",
    fix: "Peça análise de criativo, copy e página.",
    command: `Analise por que este anúncio não converte.

Criativo: [descreva]
Copy: [cole]
Página de destino: [descreva]
Métricas: [cole]

Diga onde está o vazamento e o que mudar.`,
  },
  {
    category: "Validação",
    title: "Ninguém respondeu",
    explanation: "Mandou convite mas ninguém testou.",
    fix: "Reveja convite, canal e oferta de retorno.",
    command: `Reveja minha mensagem de convite para validação:

[cole a mensagem]

Reescreva mais humana, com benefício claro para quem aceitar e tempo realista.`,
  },
];

// ============ Checklist geral por fases ============

export const CHECKLIST_PHASES: { phase: string; items: string[] }[] = [
  {
    phase: "Fase 1 — Ideia",
    items: ["Escolhi ideia", "Defini público", "Defini dor", "Defini promessa"],
  },
  {
    phase: "Fase 2 — Construção",
    items: ["Gerei plano", "Criei primeira versão", "Testei no celular", "Corrigi erros"],
  },
  {
    phase: "Fase 3 — Venda",
    items: ["Criei landing page", "Criei preço", "Criei checkout", "Criei obrigado"],
  },
  {
    phase: "Fase 4 — Entrega",
    items: ["Criei área restrita", "Criei login", "Criei entrega", "Testei acesso"],
  },
  {
    phase: "Fase 5 — Crescimento",
    items: ["Criei SEO", "Criei GEO", "Criei campanhas", "Criei criativos"],
  },
  {
    phase: "Fase 6 — Validação",
    items: ["Testei com 10 pessoas", "Coletei feedback", "Melhorei", "Publiquei"],
  },
];

// ============ Dicas de cada módulo ============

export const MODULE_HINTS: Record<ModuleId, { doNow: string; advanceWhen: string }> = {
  comece: {
    doNow: "Leia a regra de ouro e escolha entre usar uma ideia pronta ou construir a sua.",
    advanceWhen: "Avance quando você souber qual ideia vai construir no Lovable.",
  },
  ideias: {
    doNow: "Escolha um modelo que se pareça com o que você quer criar. Clique em Ver detalhes e copie o comando.",
    advanceWhen: "Avance quando você tiver copiado um comando de ideia e colado no Lovable.",
  },
  construir: {
    doNow: "Comece pelo Comando 1. Copie, cole no Lovable e espere o resultado antes do próximo.",
    advanceWhen: "Avance quando o Lovable tiver criado seu plano e a primeira versão do app.",
  },
  login: {
    doNow: "Adicione login antes do banco. Depois crie as tabelas e as regras de acesso.",
    advanceWhen: "Avance quando você conseguir entrar no app e ver dados salvos no banco.",
  },
  venda: {
    doNow: "Crie primeiro a landing page. Depois preço, FAQ e confiança.",
    advanceWhen: "Avance quando a landing page estiver no ar e explicando claramente seu app.",
  },
  checkout: {
    doNow: "Crie o checkout, a página de obrigado e a área de entrega na ordem.",
    advanceWhen: "Avance quando um comprador conseguir comprar, receber acesso e entrar na área restrita.",
  },
  seo: {
    doNow: "Comece pelo plano de SEO. Depois gere páginas e schemas.",
    advanceWhen: "Avance quando suas páginas tiverem título, descrição e FAQ otimizados.",
  },
  campanhas: {
    doNow: "Escolha um canal e use o gerador rápido para criar a primeira campanha.",
    advanceWhen: "Avance quando você tiver pelo menos uma campanha pronta para rodar.",
  },
  criativos: {
    doNow: "Use o gerador rápido para criar 3 criativos diferentes no formato escolhido.",
    advanceWhen: "Avance quando você tiver 3 criativos prontos para testar.",
  },
  validacao: {
    doNow: "Liste 10 pessoas reais que podem testar e copie a mensagem de convite.",
    advanceWhen: "Avance quando pelo menos 5 pessoas testarem e responderem o feedback.",
  },
  checklist: {
    doNow: "Marque tudo que você já fez. Use a barra de progresso como guia.",
    advanceWhen: "Avance quando seu progresso geral estiver acima de 70%.",
  },
  erros: {
    doNow: "Use a busca para encontrar seu problema. Copie o comando de correção e cole no Lovable.",
    advanceWhen: "Avance quando o erro estiver resolvido e o app estiver funcionando de novo.",
  },
  ativar: {
    doNow: "Digite o código que você recebeu e clique em Resgatar código.",
    advanceWhen: "Pronto. Você já está no programa.",
  },
};
