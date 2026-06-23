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
  // Campos opcionais para o módulo "Construir app" (central guiada):
  objective?: string;
  whenLovableDirect?: string;
  whenAgentFirst?: string;
  agentPrompt?: string;
  correctionPrompt?: string;
  advanceCriteria?: string;
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
  // Blueprint fields (optional, used by the rich "Mapa inicial do app" modal)
  shortDescription?: string;
  promise?: string;
  expectedResult?: string;
  mainAction?: string;
  mvp?: string[];
  cutFromFirst?: string[];
  screensWithRole?: { name: string; role: string }[];
  loginAccess?: string;
  adminArea?: string;
  paymentNotes?: string;
  differentiator?: string;
  risks?: string[];
  testFirst?: string[];
  buyerPersona?: string;
  validationTest?: string;
  visualStyleSuggestion?: string;
  // Library taxonomy (Ideias prontas page)
  category?: string;
  badges?: string[];
};


export type CommonError = {
  category: string;
  title: string;
  explanation: string;
  fix: string;
  command: string;
  severity?: "Leve" | "Médio" | "Crítico";
};

export type ModuleId =
  | "fundamentos"
  | "comece"
  | "ideias"
  | "planejar"
  | "mvp"
  | "telas"
  | "construir"
  | "login"
  | "seguranca"
  | "venda"
  | "monetizacao"
  | "checkout"
  | "legal"
  | "publicar"
  | "teste"
  | "seo"
  | "campanhas"
  | "criativos"
  | "metricas"
  | "melhorias"
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
  { id: "fundamentos", label: "Como usar o Lovable", icon: "BookOpen" },
  { id: "comece", label: "Comece aqui", icon: "Sparkles" },
  { id: "ideias", label: "Ideias prontas", icon: "Lightbulb" },
  { id: "planejar", label: "Planejar o App", icon: "ClipboardList" },
  { id: "mvp", label: "MVP e Arquitetura", icon: "Workflow" },
  { id: "telas", label: "Telas e Fluxo", icon: "Map" },
  { id: "construir", label: "Construir app", icon: "Hammer" },
  { id: "login", label: "Login e banco", icon: "Lock" },
  { id: "seguranca", label: "Segurança do App", icon: "ShieldCheck" },
  { id: "venda", label: "Página de venda", icon: "Megaphone" },
  { id: "monetizacao", label: "Monetização", icon: "DollarSign" },
  { id: "checkout", label: "Checkout e entrega", icon: "ShoppingCart" },
  { id: "legal", label: "Legal e Confiança", icon: "Scale" },
  { id: "publicar", label: "Publicar e Domínio", icon: "Globe" },
  { id: "teste", label: "Teste Final do App", icon: "ClipboardCheck" },
  { id: "seo", label: "SEO e GEO", icon: "Search" },
  { id: "campanhas", label: "Campanhas", icon: "Rocket" },
  { id: "criativos", label: "Criativos", icon: "Image" },
  { id: "metricas", label: "Métricas do App", icon: "BarChart3" },
  { id: "validacao", label: "Validação", icon: "Users" },
  { id: "melhorias", label: "Melhorias e Versões", icon: "GitBranch" },
  { id: "checklist", label: "Painel de Prontidão", icon: "ListChecks" },
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
  {
    n: 1,
    title: "Criar primeira versão do app",
    purpose: "Pede ao Lovable que construa a base funcional do app ativo.",
    when: "Use como primeiro comando do módulo Construir app.",
    where: "Cole no Lovable, no projeto do seu app ativo.",
    result: "Primeira versão navegável com telas principais e fluxo do usuário.",
    objective:
      "Construir a base funcional inicial do app ativo, com telas principais, navegação e estrutura visual mobile first.",
    whenLovableDirect:
      "Quando o app ativo já está selecionado e você quer ver a primeira versão funcionando.",
    whenAgentFirst:
      "Quando você ainda quer revisar escopo, MVP ou ordem das telas antes de construir.",
    content: `Construa a primeira versão do app [nome do app ativo] no Lovable.

Use o contexto já definido para este app.

Objetivo:
Criar a base funcional inicial do aplicativo, com telas principais, navegação e estrutura visual mobile first.

Crie:
1. Tela inicial do app.
2. Fluxo principal do usuário.
3. Tela de entrega ou resultado principal.
4. Estrutura visual limpa.
5. Navegação básica entre as telas.

Regras:
- Mantenha o MVP simples.
- Não adicione mais de 5 funcionalidades principais.
- Não implemente pagamento real agora.
- Não implemente domínio agora.
- Não crie recursos avançados fora do MVP.
- Use textos claros para usuário leigo.
- Priorize mobile first.

Entregue:
- primeira versão navegável;
- telas principais conectadas;
- layout consistente;
- próximo passo recomendado.`,
    agentPrompt: `Quero construir a primeira versão do app ativo no Lovable.

Antes de eu colar o prompt de construção, analise como Arquiteto de Aplicativos:

1. O MVP proposto está enxuto? Tem no máximo 5 funcionalidades?
2. Quais telas são realmente essenciais para a primeira versão?
3. Qual deve ser o fluxo principal do usuário?
4. O que devo cortar agora para evitar inflar o escopo?
5. Qual deve ser o primeiro prompt de construção, executivo, para colar no Lovable?

Use o contexto já definido para o app ativo. Se faltar algum dado, assuma hipóteses razoáveis e siga em frente.`,
    correctionPrompt: `A primeira versão ficou ampla demais ou confusa. Simplifique.

Mantenha apenas:
1. Tela inicial
2. Ação principal
3. Resultado da ação
4. Navegação mínima
5. Estado vazio e mensagem de erro

Remova qualquer função que não ajude o usuário a completar a ação principal.
Não adicione pagamento, domínio ou recursos avançados agora.`,
    advanceCriteria:
      "Avance quando a primeira versão abrir, tiver visual coerente, fluxo principal funcionando e não estiver inchada.",
  },
  {
    n: 2,
    title: "Construir primeira versão",
    purpose: "Pede ao Lovable que comece a construir o app.",
    when: "Depois que o plano do Comando 1 estiver pronto.",
    where: "Cole no mesmo projeto do Lovable.",
    result: "As primeiras telas e o fluxo principal criados.",
    objective:
      "Pedir ao Lovable para criar a primeira versão funcional, sem inflar o escopo.",
    whenLovableDirect: "Quando o plano da Etapa 1 já foi aprovado e está claro.",
    whenAgentFirst:
      "Quando o plano ainda parece amplo e você quer um prompt de construção mais enxuto.",
    content: `Com base no plano aprovado, construa a primeira versão funcional do app.

Regras:
1. Não adicione funcionalidades fora do MVP.
2. Priorize mobile first.
3. Crie interface clara, moderna e profissional.
4. Use dados reais de exemplo, sem lorem ipsum.
5. Crie navegação simples.
6. Garanta que a ação principal do usuário funcione.
7. Não implemente login, pagamento ou banco avançado ainda, a menos que seja essencial para testar o MVP.

Ao final, entregue:
1. O que foi criado
2. Como testar
3. O que ainda está pendente.`,
    agentPrompt: `Analise este plano de app e transforme em um prompt de construção para o Lovable.

Plano:
[cole o plano]

Quero uma primeira versão funcional, simples, clara e sem excesso.
Não quero login, pagamento ou automações se não forem essenciais para o primeiro teste.`,
    correctionPrompt: `A primeira versão ficou ampla demais ou confusa. Simplifique.

Mantenha apenas:
1. Tela inicial
2. Ação principal
3. Resultado da ação
4. Navegação mínima
5. Estado vazio e mensagem de erro

Remova qualquer função que não ajude o usuário a completar a ação principal.`,
    advanceCriteria:
      "Avance quando a primeira versão abrir, tiver visual coerente, fluxo principal funcionando e não estiver inchada.",
  },
  {
    n: 3,
    title: "Criar dashboard",
    purpose: "Cria a tela inicial do usuário depois do login.",
    when: "Depois que telas principais e login existirem.",
    where: "Cole no Lovable.",
    result: "Uma tela inicial com resumo e próxima ação.",
    objective: "Criar a tela inicial do usuário depois do login ou acesso.",
    whenLovableDirect:
      "Quando o app já tem fluxo principal e você quer um painel que oriente o uso diário.",
    whenAgentFirst:
      "Quando há muitas informações possíveis e você precisa decidir o que entra na primeira dobra.",
    content: `Crie o dashboard principal do usuário.

O dashboard deve mostrar:
1. Boas-vindas
2. Próxima ação recomendada
3. Resumo do progresso ou atividade
4. Cards principais do app
5. Botão claro para a ação principal
6. Estado vazio para usuário novo
7. Layout responsivo mobile first

Não crie dados irreais demais.
Não polua a tela.
O dashboard deve guiar o usuário para agir.`,
    agentPrompt: `Meu app já tem uma primeira versão. Quero criar um dashboard que guie o usuário.

Contexto do app:
[descreva]

Ação principal:
[descreva]

Crie a estrutura ideal do dashboard com cards, prioridades e textos.`,
    correctionPrompt: `O dashboard ficou confuso. Refaça com foco em uma única próxima ação.

Priorize:
1. O que o usuário deve fazer agora
2. O que ele já fez
3. O que falta completar
4. Um botão principal
5. Menos informação na primeira dobra.`,
    advanceCriteria:
      "Avance quando o dashboard deixar claro o que o usuário deve fazer em seguida.",
  },
  {
    n: 4,
    title: "Melhorar design mobile",
    purpose: "Deixa o app bonito, claro e fácil de usar no celular.",
    when: "Depois que o app já tem telas principais.",
    where: "Cole no Lovable.",
    result: "Cores, espaçamento, botões e mobile melhorados.",
    objective:
      "Transformar a versão inicial em uma experiência limpa e usável no celular.",
    whenLovableDirect:
      "Quando você já testou no celular e listou pontos visuais a corrigir.",
    whenAgentFirst:
      "Quando você quer uma análise de UX mobile antes de pedir ajustes ao Lovable.",
    content: `Faça uma revisão completa de design mobile.

Corrija:
1. Espaçamentos
2. Tamanho de fonte
3. Botões pequenos
4. Cards muito largos
5. Menu difícil de usar
6. Contraste
7. Hierarquia visual
8. Inputs difíceis no celular
9. Scroll excessivo
10. Elementos quebrando a tela

Preserve funcionalidades.
Não refaça o app do zero.
Apenas melhore a experiência mobile.`,
    agentPrompt: `Analise a experiência mobile do meu app com base nesta descrição ou print.

[descreva ou cole observações]

Quero uma lista objetiva de melhorias para mandar ao Lovable, sem refazer o app do zero.`,
    correctionPrompt: `O mobile ainda ficou ruim. Corrija apenas UX mobile.

Prioridade:
1. Legibilidade
2. Botões grandes
3. Menos poluição
4. Melhor espaçamento
5. Ação principal visível
6. Menu simples.`,
    advanceCriteria:
      "Avance quando o app estiver legível, navegável e usável no celular.",
  },
  {
    n: 5,
    title: "Revisar MVP",
    purpose: "Revisa o app antes de continuar para login/banco.",
    when: "Antes de avançar para área restrita.",
    where: "Cole no Lovable.",
    result: "Lista de problemas e correções aplicadas.",
    objective:
      "Revisar se o app está pronto para avançar para login, banco ou venda.",
    whenLovableDirect:
      "Quando você quer um relatório técnico direto do Lovable sobre o estado atual.",
    whenAgentFirst:
      "Quando você quer uma auditoria estratégica antes de decidir se avança ou corta.",
    content: `Faça uma auditoria do MVP atual antes de avançar.

Não altere código nesta rodada.

Audite:
1. O app resolve a dor principal?
2. O usuário entende o que fazer?
3. A ação principal funciona?
4. O MVP tem excesso?
5. O mobile está usável?
6. Existem botões quebrados?
7. Existem textos genéricos?
8. O que deve ser corrigido antes de criar login, banco ou pagamento?

Entregue:
1. O que está aprovado
2. O que precisa corrigir
3. O que deve ser cortado
4. O próximo prompt recomendado.`,
    agentPrompt: `Quero auditar meu MVP antes de avançar.

App:
[descreva]

Público:
[descreva]

Ação principal:
[descreva]

Analise se está pronto para login, banco, pagamento e venda.
Aponte cortes, riscos e próxima etapa.`,
    correctionPrompt: `A auditoria ficou superficial. Refaça avaliando:
1. Clareza
2. Usabilidade
3. Escopo
4. Monetização
5. Risco técnico
6. Próximo passo exato.`,
    advanceCriteria:
      "Avance para login e banco apenas quando o MVP estiver simples, funcional, compreensível e usável no mobile.",
  },
];

export const COMMANDS_LOGIN: Command[] = [
  {
    n: 1,
    title: "Criar login simples",
    purpose: "Permitir que o usuário crie conta, entre e saia do app.",
    when: "Quando o MVP já está pronto e você precisa que pessoas entrem com e-mail e senha.",
    where: "Cole no Lovable.",
    result: "Telas de cadastro, login e logout funcionando.",
    objective: "Permitir que o usuário crie conta, entre e saia do app.",
    whenLovableDirect:
      "Quando o MVP já está pronto e você precisa que pessoas entrem com e-mail e senha.",
    whenAgentFirst: "Quando você não sabe se seu app precisa de login no MVP.",
    content: `Crie um sistema de login simples para este app.

Requisitos:

1. Cadastro com e-mail e senha.
2. Login com e-mail e senha.
3. Botão de sair.
4. Mensagens claras de erro.
5. Redirecionar usuário logado para a área principal.
6. Redirecionar usuário deslogado para a página de login.
7. Layout simples, responsivo e coerente com o design atual.

Não crie funções extras.
Não crie painel admin ainda.
Não altere o fluxo principal do app.
Ao final, explique como testar cadastro, login e logout.`,
    agentPrompt: `Estou criando um app no Lovable e preciso decidir se ele precisa de login.

App:
[descreva o app]

Público:
[descreva o público]

Ação principal:
[descreva]

Analise:

1. Esse app precisa de login no MVP?
2. O que deve ficar protegido?
3. Que dados preciso salvar?
4. O que pode ficar sem login agora?
5. Qual prompt devo colar no Lovable?`,
    correctionPrompt: `O login ficou confuso ou não funciona corretamente. Corrija sem refazer o app inteiro.

Verifique:

1. Cadastro.
2. Login.
3. Logout.
4. Redirecionamento.
5. Mensagens de erro.
6. Usuário logado não deve voltar para login.
7. Usuário deslogado não deve acessar área restrita.

Preserve o design atual.`,
    advanceCriteria:
      "Avance apenas quando você conseguir criar conta, entrar, sair e entrar novamente sem erro.",
  },
  {
    n: 2,
    title: "Criar perfil do usuário",
    purpose: "Guardar as informações básicas de cada usuário.",
    when: "Quando o app precisa lembrar quem é o usuário logado.",
    where: "Cole no Lovable.",
    result: "Cada usuário logado vê apenas seus próprios dados.",
    objective: "Guardar as informações básicas de cada usuário.",
    whenLovableDirect: "Quando o app precisa lembrar quem é o usuário logado.",
    whenAgentFirst: "Quando você não sabe quais dados precisa guardar.",
    content: `Crie uma estrutura simples de perfil do usuário.

O perfil deve guardar:

1. Nome.
2. E-mail.
3. Data de criação.
4. Tipo de acesso, se fizer sentido.
5. Status do usuário, se fizer sentido.

Após cadastro, cada usuário deve ter um perfil associado.

Crie uma tela simples de Minha conta com:

1. Nome.
2. E-mail.
3. Status ou plano, se existir.
4. Botão de sair.

Não crie configurações avançadas agora.
Não crie campos desnecessários.`,
    agentPrompt: `Meu app precisa guardar dados de usuário.

App:
[descreva o app]

O que o usuário faz dentro dele:
[descreva]

Me ajude a decidir:

1. Quais dados preciso salvar no perfil?
2. Quais dados são desnecessários agora?
3. Preciso de status, plano ou tipo de acesso?
4. Qual prompt devo colar no Lovable?`,
    correctionPrompt: `O perfil do usuário não está sendo criado ou exibido corretamente. Corrija a ligação entre usuário autenticado e perfil.

Verifique:

1. Se cada usuário tem apenas um perfil.
2. Se o perfil aparece na tela Minha conta.
3. Se os dados pertencem ao usuário correto.
4. Se não há vazamento de dados entre usuários.
5. Se o logout continua funcionando.`,
    advanceCriteria:
      "Avance quando cada usuário logado conseguir ver seus próprios dados.",
  },
  {
    n: 3,
    title: "Proteger área restrita",
    purpose: "Garantir que só usuário logado acesse determinadas páginas.",
    when: "Quando seu app já tem uma área que não pode ficar pública.",
    where: "Cole no Lovable.",
    result:
      "Usuário deslogado não acessa área protegida. Usuário logado acessa normalmente.",
    objective: "Garantir que só usuário logado acesse determinadas páginas.",
    whenLovableDirect:
      "Quando seu app já tem uma área que não pode ficar pública.",
    whenAgentFirst: "Quando você não sabe quais páginas devem ser protegidas.",
    content: `Proteja as páginas principais do app.

Regras:

1. Usuário deslogado deve ser enviado para /login.
2. Usuário logado deve acessar a área principal.
3. Mostrar estado de carregamento enquanto verifica o login.
4. Evitar tela piscando entre logado e deslogado.
5. Manter mensagens claras.

Não crie regras complexas ainda.
Apenas proteja o acesso básico.`,
    agentPrompt: `Preciso decidir quais partes do meu app devem ser protegidas.

App:
[descreva]

Páginas atuais:
[descreva]

Me diga:

1. O que pode ser público?
2. O que precisa de login?
3. O que precisa ser premium?
4. Qual fluxo simples devo pedir ao Lovable?`,
    correctionPrompt: `A área restrita está falhando. Corrija o controle de acesso.

Problemas possíveis:

1. Usuário deslogado consegue entrar.
2. Usuário logado é mandado para login.
3. Página pisca antes de carregar.
4. Logout não limpa sessão.
5. Redirecionamento está errado.

Corrija sem refazer o app inteiro.`,
    advanceCriteria:
      "Avance quando usuário deslogado não conseguir acessar área protegida e usuário logado conseguir acessar normalmente.",
  },
  {
    n: 4,
    title: "Criar acesso especial ou admin",
    purpose:
      "Separar usuário comum, comprador, assinante ou admin, quando necessário.",
    when: "Quando o app realmente precisa separar níveis de acesso.",
    where: "Cole no Lovable.",
    result: "Cada tipo de usuário acessa apenas o que deve acessar.",
    objective:
      "Separar usuário comum, comprador, assinante ou admin, quando necessário.",
    whenLovableDirect:
      "Quando o app realmente precisa separar níveis de acesso.",
    whenAgentFirst: "Quando você não sabe se precisa de admin no MVP.",
    content: `Crie uma lógica simples de permissão para usuários.

Antes de implementar, verifique se o app realmente precisa disso no MVP.

Se precisar, criar:

1. Usuário comum.
2. Usuário com acesso liberado.
3. Admin, apenas se necessário.

Regras:

1. Usuário comum vê apenas área básica.
2. Usuário com acesso liberado vê área premium.
3. Admin vê área de gestão, se existir.
4. Nunca usar permissões apenas no front-end se houver dados sensíveis.
5. Nunca expor chave service role no frontend.
6. Manter mensagens claras quando o acesso for negado.`,
    agentPrompt: `Meu app precisa de permissões?

App:
[descreva]

Tipos de usuário que imagino:
[descreva]

Analise:

1. Preciso de admin no MVP?
2. Preciso de área premium?
3. Preciso de comprador, assinante ou usuário comum?
4. O que pode ficar simples agora?
5. O que deve ficar para versão 2?
6. Qual prompt seguro devo colar no Lovable?`,
    correctionPrompt: `As permissões ficaram confusas. Simplifique.

Use no máximo:

1. Usuário sem acesso.
2. Usuário com acesso.
3. Admin.

Explique quais páginas cada tipo pode acessar e corrija o fluxo.
Não exponha dados sensíveis.
Não exponha chave service role no frontend.`,
    advanceCriteria:
      "Avance quando cada tipo de usuário acessar apenas o que deve acessar.",
  },
  {
    n: 5,
    title: "Auditar login e banco antes da venda",
    purpose:
      "Verificar se o app está seguro e funcional antes de criar pagamento ou vender.",
    when: "Antes de criar página de venda, checkout ou área premium.",
    where: "Cole no Lovable.",
    result:
      "Lista clara do que está aprovado, do que precisa corrigir e do próximo passo.",
    objective:
      "Verificar se o app está seguro e funcional antes de criar pagamento ou vender.",
    whenLovableDirect:
      "Antes de criar página de venda, checkout ou área premium.",
    whenAgentFirst:
      "Quando você não tem certeza se o login, banco e permissões estão simples e seguros.",
    content: `Faça uma auditoria do login e banco de dados antes de avançar para venda.

Não altere código nesta rodada.

Verifique:

1. Cadastro funciona?
2. Login funciona?
3. Logout funciona?
4. Usuário deslogado fica bloqueado?
5. Usuário logado acessa a área correta?
6. Cada usuário vê apenas seus próprios dados?
7. Existe dado sensível exposto no front-end?
8. Existe chave service role exposta no frontend?
9. Existe botão quebrado?
10. Existe mensagem de erro clara?
11. O mobile está usável?

Entregue:

1. O que está aprovado.
2. O que precisa corrigir.
3. O que não deve ser criado ainda.
4. Próximo prompt recomendado.`,
    agentPrompt: `Quero auditar login e banco antes de vender.

App:
[descreva]

Fluxo atual:
[descreva]

Tipos de usuário:
[descreva]

Analise:

1. O acesso está simples?
2. O app está seguro o suficiente para MVP?
3. Existem dados expostos?
4. O que devo testar antes de vender?
5. Qual prompt devo mandar ao Lovable?`,
    correctionPrompt: `A auditoria ficou superficial. Refaça com foco em segurança, acesso e dados do usuário.

Avalie:

1. Sessão.
2. Redirecionamento.
3. Perfil.
4. Permissão.
5. Proteção de página.
6. Dados sensíveis.
7. Chave service role.
8. Teste mobile.`,
    advanceCriteria:
      "Avance para página de venda e checkout apenas quando login, perfil e área restrita estiverem funcionando.",
  },
];

export const COMMANDS_VENDA: Command[] = [
  {
    n: 1,
    title: "Definir oferta e criar landing page",
    purpose: "Criar a primeira página que explica e vende o app.",
    when: "Quando você já sabe público, dor, promessa e entrega.",
    where: "Cole no Lovable.",
    result:
      "Landing page clara, mobile first, com promessa, benefícios, CTA e FAQ.",
    objective: "Criar a primeira página que explica e vende o app.",
    whenLovableDirect:
      "Quando você já sabe público, dor, promessa e entrega.",
    whenAgentFirst:
      "Quando você ainda não sabe explicar por que alguém compraria seu app.",
    content: `Crie uma landing page para vender este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Entrega:
[descreva o que a pessoa recebe]

Crie uma página com:

1. Hero forte.
2. Subtítulo claro.
3. Botão principal.
4. Problema que o app resolve.
5. Como funciona.
6. Benefícios.
7. O que está incluso.
8. O que não está incluso, se fizer sentido.
9. Prova ou elementos de confiança sem inventar depoimentos.
10. FAQ.
11. CTA final.

Regras:

- Mobile first.
- Texto claro.
- Sem promessas exageradas.
- Sem lorem ipsum.
- Não inventar resultados garantidos.`,
    agentPrompt: `Quero transformar meu app em uma oferta vendável.

App:
[descreva]

Público:
[descreva]

Problema que resolve:
[descreva]

Monetização:
[preço único, assinatura, serviço, freemium ou não sei]

Analise:

1. Qual é a promessa mais clara?
2. O que devo vender de verdade?
3. Quais benefícios devo destacar?
4. Quais promessas devo evitar?
5. Qual estrutura de landing devo pedir ao Lovable?`,
    correctionPrompt: `A landing ficou genérica. Refaça com mais clareza comercial.

Corrija:

1. Hero fraco.
2. Promessa vaga.
3. Benefícios genéricos.
4. Falta de CTA.
5. Texto longo demais.
6. Falta de confiança.
7. Promessas exageradas.

Não invente depoimentos.
Não prometa resultado garantido.
Mantenha o foco em clareza, valor e conversão.`,
    advanceCriteria:
      "Avance quando uma pessoa leiga conseguir entender em menos de 10 segundos o que o app faz e por que deveria se interessar.",
  },
  {
    n: 2,
    title: "Criar página de preço",
    purpose: "Explicar o investimento e o que está incluso.",
    when: "Quando você já definiu o preço e a entrega.",
    where: "Cole no Lovable.",
    result: "Página de preço simples, clara e com CTA.",
    objective: "Explicar o investimento e o que está incluso.",
    whenLovableDirect: "Quando você já definiu o preço e a entrega.",
    whenAgentFirst:
      "Quando você não sabe quanto cobrar ou se deve vender por preço único ou assinatura.",
    content: `Crie uma página de preço para este app.

Produto:
[descreva]

Investimento:
[informe]

O que está incluso:
[descreva]

O que não está incluso:
[descreva]

Crie uma página com:

1. Nome da oferta.
2. Investimento claro.
3. Lista do que está incluso.
4. Lista do que não está incluso.
5. Garantia ou política, se existir.
6. FAQ curto.
7. CTA forte para compra.
8. Texto de segurança e confiança.

Regras:

- Não esconder valor.
- Não inventar garantia.
- Não criar desconto falso.
- Não prometer resultado garantido.`,
    agentPrompt: `Preciso definir preço e estrutura de cobrança para meu app.

App:
[descreva]

Público:
[descreva]

Valor que entrega:
[descreva]

Me ajude a decidir:

1. Preço único ou assinatura?
2. Faixa de preço inicial.
3. O que incluir.
4. O que deixar fora.
5. Como comunicar o investimento na página.`,
    correctionPrompt: `A página de preço ficou confusa. Refaça de forma mais simples.

Precisa conter:

1. Nome da oferta.
2. Investimento visível.
3. O que está incluso.
4. O que não está incluso.
5. CTA de compra.
6. FAQ curto.
7. Aviso sem promessa exagerada.

Remova excesso visual e planos desnecessários.`,
    advanceCriteria:
      "Avance quando a pessoa entender exatamente o que compra, quanto paga e o que recebe.",
  },
  {
    n: 3,
    title: "Criar FAQ de venda",
    purpose: "Responder dúvidas antes da compra.",
    when: "Depois de criar landing e preço.",
    where: "Cole no Lovable.",
    result: "FAQ com pelo menos 8 perguntas úteis e respostas claras.",
    objective: "Responder dúvidas antes da compra.",
    whenLovableDirect: "Depois de criar landing e preço.",
    whenAgentFirst: "Quando você não sabe quais dúvidas o comprador pode ter.",
    content: `Crie uma seção de FAQ para a landing.

Tema:
[descreva o produto]

Inclua perguntas reais sobre:

1. O que é.
2. Para quem é.
3. Para quem não é.
4. Como funciona.
5. O que está incluso.
6. Pagamento.
7. Acesso.
8. Suporte.
9. Garantia ou política.
10. Próximo passo após a compra.

Regras:

- Respostas curtas.
- Tom honesto.
- Sem hype.
- Não inventar garantias.
- Não prometer resultados automáticos.`,
    agentPrompt: `Quero criar um FAQ para vender meu app.

App:
[descreva]

Oferta:
[descreva]

Preço:
[descreva]

Liste:

1. As principais objeções do comprador.
2. Perguntas que devem entrar no FAQ.
3. Respostas curtas e honestas.
4. O que não devo prometer.`,
    correctionPrompt: `O FAQ ficou genérico. Refaça com perguntas que realmente bloqueiam a compra.

Inclua dúvidas sobre:

1. Acesso.
2. Pagamento.
3. Uso.
4. Para quem é.
5. Para quem não é.
6. Suporte.
7. Limitações.
8. Segurança.`,
    advanceCriteria:
      "Avance quando o FAQ responder as principais dúvidas que impedem a compra.",
  },
  {
    n: 4,
    title: "Criar página de confiança",
    purpose: "Aumentar segurança antes da compra.",
    when:
      "Quando o comprador precisa saber quem está por trás, como funciona suporte e quais são os dados de contato.",
    where: "Cole no Lovable.",
    result:
      "Página de confiança honesta, com informações reais e contato claro.",
    objective: "Aumentar segurança antes da compra.",
    whenLovableDirect:
      "Quando o comprador precisa saber quem está por trás, como funciona suporte e quais são os dados de contato.",
    whenAgentFirst:
      "Quando você não sabe quais elementos de confiança seu produto precisa.",
    content: `Crie uma página de confiança para este app.

A página deve conter:

1. Quem está por trás do produto.
2. Como funciona o suporte.
3. Política de reembolso, se existir.
4. Segurança dos dados.
5. Formas de contato.
6. Canais oficiais.
7. O que o produto faz.
8. O que o produto não promete.

Regras:

- Não inventar depoimentos.
- Não inventar CNPJ.
- Não inventar garantia.
- Não inventar certificações.
- Usar apenas informações verdadeiras.`,
    agentPrompt: `Quero criar uma página de confiança para meu app.

Produto:
[descreva]

Responsável:
[descreva]

Suporte:
[descreva]

Política:
[descreva]

Me ajude a definir:

1. O que precisa aparecer para gerar confiança.
2. O que não devo prometer.
3. Quais dados legais faltam.
4. Qual prompt devo mandar ao Lovable.`,
    correctionPrompt: `A página de confiança inventou ou exagerou informações. Corrija.

Regras:

1. Remova depoimentos inventados.
2. Remova certificações falsas.
3. Remova garantias inexistentes.
4. Use apenas dados reais.
5. Explique suporte, contato, segurança e limites do produto.`,
    advanceCriteria:
      "Avance quando a página transmitir segurança sem inventar prova.",
  },
  {
    n: 5,
    title: "Revisar copy da oferta",
    purpose: "Deixar o texto mais claro, direto e convincente.",
    when: "Quando a landing existe, mas ainda não está forte.",
    where: "Cole no Lovable.",
    result: "Copy mais clara, direta e forte, sem exagero.",
    objective: "Deixar o texto mais claro, direto e convincente.",
    whenLovableDirect: "Quando a landing existe, mas ainda não está forte.",
    whenAgentFirst:
      "Quando você não sabe se a oferta está clara ou se a promessa está boa.",
    content: `Revise a copy da oferta da landing.

Contexto:
App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Reescreva:

1. Headline.
2. Subheadline.
3. Benefícios.
4. Bullets.
5. CTA.
6. Parágrafo de garantia ou segurança, se existir.
7. FAQ, se necessário.

Regras:

- Texto direto.
- Sem clichês.
- Sem promessa exagerada.
- Sem inventar prova.
- Não aumentar escopo do produto.
- Manter clareza acima de criatividade.`,
    agentPrompt: `Quero revisar a oferta do meu app antes de vender.

Cole aqui minha headline, promessa, preço e principais seções:
[cole]

Analise:

1. Está claro?
2. Está vendável?
3. Está exagerado?
4. Está genérico?
5. O que devo reescrever?
6. Qual prompt devo mandar ao Lovable?`,
    correctionPrompt: `A revisão da copy ficou genérica. Refaça com foco em clareza e conversão.

Melhore:

1. Headline.
2. Subheadline.
3. Benefícios específicos.
4. CTA.
5. FAQ.
6. O que está incluso.
7. O que não está incluso.

Remova:

1. Hype.
2. Promessas irreais.
3. Frases vagas.
4. Textos longos demais.`,
    advanceCriteria:
      "Avance quando a oferta explicar com clareza o valor do app, o que a pessoa recebe e qual ação deve tomar.",
  },
];

export const COMMANDS_CHECKOUT: Command[] = [
  {
    n: 1,
    title: "Criar forma de pagamento",
    purpose: "Criar o caminho para o usuário pagar pelo produto.",
    when: "Quando a oferta e o preço já estão definidos.",
    where: "Cole no Lovable.",
    result: "Fluxo de pagamento claro, botão funcionando e entrega ainda protegida.",
    objective: "Criar o caminho para o usuário pagar pelo produto.",
    whenLovableDirect: "Quando a oferta e o preço já estão definidos.",
    whenAgentFirst:
      "Quando você ainda não sabe se deve usar WhatsApp, checkout externo, gateway ou assinatura.",
    content: `Crie o fluxo de pagamento para este app.

Produto:
[descreva]

Valor:
[informe]

Forma de pagamento:
[WhatsApp, checkout externo, Kiwify, Hotmart, Kirvano, Stripe, Mercado Pago ou outro]

Requisitos:

1. Botão de compra claro.
2. Página ou seção de checkout.
3. Resumo do que a pessoa está comprando.
4. Informação sobre liberação de acesso.
5. Botão alternativo de suporte.
6. Aviso de que o acesso será liberado após confirmação do pagamento, se o fluxo for manual.
7. Não mostrar materiais protegidos antes da confirmação.

Regras:

- Não inventar gateway.
- Não criar promessa de acesso automático se ainda não existe webhook.
- Não deixar botão quebrado.
- Se a URL de pagamento ainda não existir, deixar campo configurável.`,
    agentPrompt: `Preciso decidir como receber pagamento no meu app.

App:
[descreva]

Produto:
[descreva]

Preço:
[informe]

Entrega:
[descreva]

Analise:

1. Devo começar com WhatsApp, checkout externo ou gateway?
2. O acesso deve ser manual ou automático no MVP?
3. O que precisa aparecer antes da compra?
4. O que precisa aparecer depois da compra?
5. Qual prompt devo colar no Lovable?`,
    correctionPrompt: `O fluxo de pagamento ficou confuso ou quebrado. Corrija sem refazer o app inteiro.

Verifique:

1. Botão de compra.
2. Link de pagamento.
3. Resumo da oferta.
4. Informação sobre acesso após pagamento.
5. Suporte.
6. Nenhum material protegido aparece antes da compra.
7. Nenhum botão abre URL vazia ou placeholder.`,
    advanceCriteria:
      "Avance apenas quando o botão de compra abrir o caminho correto de pagamento e o comprador entender o que acontece depois.",
  },
  {
    n: 2,
    title: "Criar página de obrigado",
    purpose: "Confirmar a compra e explicar o próximo passo.",
    when: "Depois de criar o caminho de pagamento.",
    where: "Cole no Lovable.",
    result: "Página de obrigado clara, honesta e útil.",
    objective: "Confirmar a compra e explicar o próximo passo.",
    whenLovableDirect: "Depois de criar o caminho de pagamento.",
    whenAgentFirst:
      "Quando você não sabe o que o comprador deve ver depois de pagar.",
    content: `Crie uma página de obrigado para este app.

A página deve conter:

1. Confirmação da compra.
2. Resumo do que a pessoa comprou.
3. Próximo passo claro.
4. Informação sobre liberação de acesso.
5. Botão para login ou área de entrega, se aplicável.
6. Botão de suporte.
7. Mensagem honesta se a liberação for manual.

Texto obrigatório se o acesso ainda for manual:
"Seu acesso será liberado após confirmação do pagamento."

Não prometa acesso automático se ainda não existe integração com gateway.`,
    agentPrompt: `Quero criar a página de obrigado do meu app.

Produto:
[descreva]

Entrega:
[manual ou automática]

Acesso:
[login, link, código, área restrita]

Me ajude a definir:

1. O que o comprador precisa ver depois de pagar.
2. Qual texto evita suporte.
3. Quais botões devem aparecer.
4. O que não devo prometer.`,
    correctionPrompt: `A página de obrigado está confusa ou promete algo que o sistema ainda não faz. Corrija.

Regras:

1. Não prometer acesso automático se o acesso é manual.
2. Explicar o próximo passo.
3. Mostrar botão de suporte.
4. Mostrar botão de login ou entrega, se existir.
5. Usar texto claro e honesto.`,
    advanceCriteria:
      "Avance quando o comprador souber exatamente o que acontece depois da compra.",
  },
  {
    n: 3,
    title: "Criar área de entrega protegida",
    purpose: "Criar a área onde o comprador acessa o produto.",
    when: "Quando o produto exige área exclusiva.",
    where: "Cole no Lovable.",
    result: "Área de entrega protegida, clara e organizada.",
    objective: "Criar a área onde o comprador acessa o produto.",
    whenLovableDirect: "Quando o produto exige área exclusiva.",
    whenAgentFirst:
      "Quando você não sabe se a entrega deve ser por área restrita, link, e-mail ou código.",
    content: `Crie uma área de entrega protegida para este produto.

Produto:
[descreva]

Materiais entregues:
[descreva]

A área deve conter:

1. Boas-vindas.
2. Lista do que foi comprado.
3. Instruções de uso.
4. Materiais ou links protegidos.
5. Checklist de progresso, se fizer sentido.
6. Botão de suporte.
7. Bloqueio para visitantes sem acesso.

Regras:

- Visitante sem acesso não pode ver materiais.
- Usuário sem compra não pode ver materiais.
- Não mostrar links protegidos no código público.
- Não expor dados sensíveis.`,
    agentPrompt: `Preciso definir a melhor forma de entregar meu produto.

Produto:
[descreva]

Materiais:
[links, PDF, prompts, vídeo, área logada, comunidade, outro]

Analise:

1. Preciso de área restrita?
2. Posso entregar por e-mail?
3. Preciso de login?
4. Preciso de acesso manual?
5. O que a área de entrega deve mostrar?`,
    correctionPrompt: `A área de entrega está pública ou confusa. Corrija com foco em proteção e clareza.

Verifique:

1. Visitante sem acesso não vê material.
2. Comprador liberado vê material.
3. Botões funcionam.
4. Instruções estão claras.
5. Materiais protegidos não aparecem para usuários errados.`,
    advanceCriteria:
      "Avance quando somente comprador autorizado conseguir ver a entrega.",
  },
  {
    n: 4,
    title: "Bloquear visitantes e liberar compradores",
    purpose:
      "Garantir que só compradores confirmados entrem na área de entrega.",
    when: "Depois que a área de entrega existe.",
    where: "Cole no Lovable.",
    result:
      "Fluxo testado para visitante, usuário sem acesso e comprador liberado.",
    objective:
      "Garantir que só compradores confirmados entrem na área de entrega.",
    whenLovableDirect: "Depois que a área de entrega existe.",
    whenAgentFirst: "Quando você não sabe como controlar quem pode entrar.",
    content: `Implemente o fluxo de acesso restrito para compradores.

Regras:

1. Visitante sem login não acessa a entrega.
2. Usuário logado sem acesso vê mensagem clara.
3. Usuário com acesso liberado entra na área de entrega.
4. Admin pode liberar ou revogar acesso, se existir painel.
5. Comprador recebe orientação de como entrar.
6. Não expor materiais protegidos para visitantes.

Se ainda não houver webhook, usar liberação manual.`,
    agentPrompt: `Preciso definir o fluxo de acesso do comprador.

Produto:
[descreva]

Pagamento:
[manual, checkout externo, gateway]

Entrega:
[descreva]

Me ajude a decidir:

1. O acesso será manual ou automático?
2. Preciso de admin para liberar compradores?
3. Preciso de código de acesso?
4. Como evitar que visitantes vejam material pago?
5. Qual fluxo simples devo pedir ao Lovable?`,
    correctionPrompt: `O acesso restrito está falhando. Corrija.

Problemas possíveis:

1. Visitante vê material pago.
2. Comprador liberado não consegue entrar.
3. Usuário sem acesso entra indevidamente.
4. Mensagem de bloqueio confusa.
5. Admin não consegue liberar acesso.
6. Logout ou login quebrado.`,
    advanceCriteria:
      "Avance quando visitante, usuário comum e comprador liberado tiverem comportamentos corretos.",
  },
  {
    n: 5,
    title: "Criar recuperação de acesso",
    purpose:
      "Permitir que o comprador volte a entrar se perder senha, link ou orientação.",
    when: "Quando existe login ou área restrita.",
    where: "Cole no Lovable.",
    result: "Comprador consegue recuperar ou pedir ajuda sem se perder.",
    objective:
      "Permitir que o comprador volte a entrar se perder senha, link ou orientação.",
    whenLovableDirect: "Quando existe login ou área restrita.",
    whenAgentFirst:
      "Quando você não sabe qual recuperação faz sentido para seu produto.",
    content: `Crie o fluxo de recuperação de acesso.

Requisitos:

1. Recuperação por e-mail, se houver login.
2. Mensagem clara para quem esqueceu senha.
3. Botão de suporte.
4. Página de ajuda com instruções.
5. Redirecionamento correto após recuperar acesso.
6. Evitar expor materiais protegidos durante recuperação.

Não crie fluxo complexo se o MVP só precisa de suporte manual.`,
    agentPrompt: `Meu comprador pode perder o acesso ao produto.

Produto:
[descreva]

Forma de entrega:
[descreva]

Login:
[sim ou não]

Me ajude a decidir:

1. Preciso de recuperação por e-mail?
2. Preciso de suporte manual?
3. Preciso de código de acesso?
4. O que devo colocar na página de ajuda?`,
    correctionPrompt: `A recuperação de acesso não está clara. Corrija.

Verifique:

1. Botão de recuperar senha.
2. E-mail de recuperação.
3. Mensagem para suporte.
4. Redirecionamento após login.
5. Bloqueio de materiais para quem não tem acesso.`,
    advanceCriteria:
      "Avance quando o comprador tiver um caminho claro para voltar a acessar.",
  },
  {
    n: 6,
    title: "Criar painel de liberação manual",
    purpose: "Permitir que você libere ou revogue acesso de compradores.",
    when: "Quando o fluxo ainda não tem webhook automático.",
    where: "Cole no Lovable.",
    result:
      "Admin consegue liberar e revogar acesso manualmente com segurança básica.",
    objective: "Permitir que você libere ou revogue acesso de compradores.",
    whenLovableDirect: "Quando o fluxo ainda não tem webhook automático.",
    whenAgentFirst:
      "Quando você não sabe se precisa de painel admin, código de acesso ou webhook.",
    content: `Crie um painel simples de liberação manual de compradores.

Funções:

1. Buscar usuário por e-mail.
2. Ver status de acesso.
3. Liberar acesso.
4. Revogar acesso.
5. Ver data de liberação.
6. Mostrar mensagens claras de sucesso e erro.

Regras:

- Apenas admin pode acessar.
- Não expor chave service role no frontend.
- Não permitir que usuário comum libere acesso.
- Não mostrar dados sensíveis desnecessários.
- Manter logs simples, se possível.`,
    agentPrompt: `Preciso controlar acesso de compradores.

Produto:
[descreva]

Pagamento:
[manual ou gateway]

Entrega:
[descreva]

Me ajude a decidir:

1. Preciso de painel manual agora?
2. Preciso de webhook depois?
3. Quais campos o painel precisa ter?
4. Quais riscos de segurança devo evitar?
5. Qual prompt devo colar no Lovable?`,
    correctionPrompt: `O painel de liberação está inseguro ou confuso. Corrija.

Regras:

1. Apenas admin pode acessar.
2. Usuário comum nunca libera acesso.
3. Não expor service role.
4. Buscar usuário por e-mail.
5. Liberar e revogar acesso.
6. Mostrar mensagens claras.
7. Manter acesso negado para quem não foi liberado.`,
    advanceCriteria:
      "Avance quando você conseguir simular uma compra, liberar o comprador e confirmar que ele entra na entrega.",
  },
];


export const COMMANDS_SEO: Command[] = [
  {
    n: 1,
    title: "Criar mapa de palavras e buscas",
    purpose:
      "Definir quais termos, perguntas e assuntos o público pode pesquisar.",
    when: "Quando o app já tem público, dor e promessa definidos.",
    where: "Cole no Lovable.",
    result: "Mapa claro de palavras, perguntas, páginas e prioridades.",
    objective:
      "Definir quais termos, perguntas e assuntos o público pode pesquisar.",
    whenLovableDirect:
      "Quando o app já tem público, dor e promessa definidos.",
    whenAgentFirst:
      "Quando você não sabe quais palavras seu público usaria para encontrar seu app.",
    content: `Crie um plano de SEO para este app.

App:
[descreva]

Público:
[descreva]

Problema que resolve:
[descreva]

Oferta ou ação principal:
[descreva]

Entregue:

1. 20 palavras-chave principais.
2. 10 perguntas que o público pesquisaria.
3. Intenção de busca de cada grupo.
4. Páginas que precisam ser criadas.
5. Prioridade de criação das páginas.
6. Títulos sugeridos.
7. Meta descriptions sugeridas.

Regras:

- Não usar keyword stuffing.
- Não criar páginas vazias.
- Priorizar clareza e utilidade.
- Não prometer resultado garantido no Google.`,
    agentPrompt: `Preciso criar SEO para meu app.

App:
[descreva]

Público:
[descreva]

Problema:
[descreva]

Me ajude a definir:

1. Quais palavras meu público pesquisaria.
2. Quais perguntas ele faria.
3. Quais páginas preciso criar.
4. Qual prioridade seguir.
5. O que evitar para não parecer conteúdo genérico.`,
    correctionPrompt: `O plano de SEO ficou genérico. Refaça com foco em intenção de busca real.

Corrija:

1. Palavras vagas.
2. Páginas sem objetivo.
3. Títulos genéricos.
4. Repetição excessiva de palavras.
5. Falta de perguntas reais.
6. Falta de prioridade.`,
    advanceCriteria:
      "Avance quando você souber quais páginas criar e por que cada uma existe.",
  },
  {
    n: 2,
    title: "Criar páginas para o Google",
    purpose: "Criar páginas úteis para temas e palavras-chave importantes.",
    when: "Depois de ter o plano de SEO.",
    where: "Cole no Lovable.",
    result: "Páginas SEO publicadas, úteis e não repetitivas.",
    objective: "Criar páginas úteis para temas e palavras-chave importantes.",
    whenLovableDirect: "Depois de ter o plano de SEO.",
    whenAgentFirst: "Quando você não sabe quais páginas devem ser criadas primeiro.",
    content: `Crie páginas otimizadas para as palavras-chave abaixo.

Palavras-chave:
[cole a lista]

Para cada página, crie:

1. URL amigável.
2. Title.
3. Meta description.
4. H1.
5. Introdução clara.
6. Seções H2.
7. FAQ curto.
8. CTA.
9. Texto útil, sem repetição artificial.

Regras:

- Cada página deve responder uma intenção real.
- Não criar conteúdo vazio.
- Não repetir a mesma página com palavras diferentes.
- Não usar keyword stuffing.`,
    agentPrompt: `Tenho estas palavras-chave:
[cole]

Me ajude a decidir:

1. Quais merecem página própria.
2. Quais podem ficar juntas.
3. Qual ordem criar.
4. Que título usar.
5. Que CTA colocar.`,
    correctionPrompt: `As páginas SEO ficaram repetitivas ou artificiais. Corrija.

Regras:

1. Cada página deve ter objetivo próprio.
2. Evite repetir o mesmo texto.
3. Melhore títulos e subtítulos.
4. Inclua FAQ útil.
5. Mantenha CTA claro.
6. Remova keyword stuffing.`,
    advanceCriteria:
      "Avance quando cada página tiver título, descrição, conteúdo útil, FAQ e CTA.",
  },
  {
    n: 3,
    title: "Criar perguntas frequentes de busca",
    purpose: "Responder dúvidas reais que podem aparecer no Google e na landing.",
    when: "Depois das páginas principais.",
    where: "Cole no Lovable.",
    result: "FAQ com perguntas úteis para busca e decisão de compra.",
    objective: "Responder dúvidas reais que podem aparecer no Google e na landing.",
    whenLovableDirect: "Depois das páginas principais.",
    whenAgentFirst: "Quando você não sabe quais perguntas o público faria.",
    content: `Crie uma seção de FAQ otimizada para busca.

Tema:
[descreva o produto ou app]

Liste 12 perguntas reais que pessoas pesquisariam no Google sobre esse tema.

Para cada pergunta:

1. Escreva uma resposta curta.
2. Seja direto.
3. Não use hype.
4. Não prometa resultado garantido.
5. Inclua CTA suave quando fizer sentido.

As perguntas devem cobrir:

- O que é.
- Para quem é.
- Como funciona.
- Investimento.
- Segurança.
- Acesso.
- Limitações.
- Suporte.`,
    agentPrompt: `Preciso criar FAQs para busca.

Produto:
[descreva]

Público:
[descreva]

Me ajude a listar:

1. Perguntas que as pessoas pesquisam.
2. Objeções antes da compra.
3. Dúvidas de uso.
4. Perguntas que aumentam confiança.
5. Respostas curtas e honestas.`,
    correctionPrompt: `O FAQ ficou genérico. Refaça com perguntas reais e respostas úteis.

Inclua dúvidas sobre:

1. Como funciona.
2. Para quem é.
3. Preço ou investimento.
4. Acesso.
5. Segurança.
6. Limitações.
7. Suporte.
8. Próximo passo.`,
    advanceCriteria:
      "Avance quando o FAQ responder dúvidas reais do usuário antes de comprar ou usar.",
  },
  {
    n: 4,
    title: "Criar páginas para ferramentas de IA",
    purpose: "Criar páginas explicativas para mecanismos de IA entenderem o app.",
    when: "Depois das páginas SEO principais.",
    where: "Cole no Lovable.",
    result:
      "Página explicativa clara para usuários, buscadores e ferramentas de IA.",
    objective: "Criar páginas explicativas para mecanismos de IA entenderem o app.",
    whenLovableDirect: "Depois das páginas SEO principais.",
    whenAgentFirst:
      "Quando você não sabe como explicar seu app para buscadores inteligentes.",
    content: `Crie páginas GEO para que ferramentas de IA entendam melhor este app.

App:
[descreva]

A página deve explicar:

1. O que é o app.
2. Para quem serve.
3. Qual problema resolve.
4. Como funciona.
5. Principais recursos.
6. Diferenciais reais.
7. Limitações.
8. Comparação honesta com alternativas.
9. Perguntas frequentes.
10. CTA.

Regras:

- Texto claro e factual.
- Não inventar autoridade.
- Não exagerar promessa.
- Não repetir palavras artificialmente.
- Explicar contexto de forma objetiva.`,
    agentPrompt: `Quero que ferramentas de IA entendam melhor meu app.

App:
[descreva]

Público:
[descreva]

Me ajude a criar:

1. Uma explicação objetiva do app.
2. Principais recursos.
3. Diferenciais reais.
4. Limitações.
5. Comparação honesta.
6. FAQs úteis para IA e buscadores.`,
    correctionPrompt: `A página GEO ficou vaga ou exagerada. Refaça com linguagem factual.

Corrija:

1. Explique o que é.
2. Explique para quem é.
3. Explique o que resolve.
4. Remova promessas exageradas.
5. Inclua limitações.
6. Use comparação honesta.`,
    advanceCriteria:
      "Avance quando uma pessoa e uma IA conseguirem entender o app sem contexto externo.",
  },
  {
    n: 5,
    title: "Criar páginas para nichos específicos",
    purpose: "Criar páginas direcionadas para públicos ou segmentos diferentes.",
    when: "Quando o app atende vários nichos.",
    where: "Cole no Lovable.",
    result: "Páginas diferentes para nichos reais, sem duplicação artificial.",
    objective: "Criar páginas direcionadas para públicos ou segmentos diferentes.",
    whenLovableDirect: "Quando o app atende vários nichos.",
    whenAgentFirst:
      "Quando você não sabe se deve segmentar ou manter uma página única.",
    content: `Crie páginas específicas por nicho.

App:
[descreva]

Nichos:
[liste]

Para cada nicho, criar:

1. Headline específica.
2. Dor principal do nicho.
3. Como o app ajuda.
4. Benefícios.
5. Caso de uso.
6. FAQ.
7. CTA.

Regras:

- Não duplicar texto.
- Não inventar dores.
- Não criar páginas para nichos irrelevantes.
- Cada página precisa parecer feita para aquele público.`,
    agentPrompt: `Meu app pode atender vários nichos.

App:
[descreva]

Nichos possíveis:
[liste]

Analise:

1. Quais nichos realmente fazem sentido.
2. Quais não valem página própria.
3. Qual mensagem usar para cada nicho.
4. Qual página criar primeiro.`,
    correctionPrompt: `As páginas por nicho ficaram repetitivas. Refaça com diferenciação real.

Cada página deve ter:

1. Dor específica.
2. Linguagem do nicho.
3. Exemplo de uso.
4. Benefícios próprios.
5. CTA adequado.`,
    advanceCriteria:
      "Avance quando cada página de nicho tiver motivo claro para existir.",
  },
  {
    n: 6,
    title: "Adicionar marcação de FAQ",
    purpose:
      "Adicionar schema FAQPage para ajudar buscadores a entenderem perguntas e respostas.",
    when: "Depois de criar FAQs reais na página.",
    where: "Cole no Lovable.",
    result: "Schema FAQPage válido nas páginas com FAQ.",
    objective:
      "Adicionar schema FAQPage para ajudar buscadores a entenderem perguntas e respostas.",
    whenLovableDirect: "Depois de criar FAQs reais na página.",
    whenAgentFirst:
      "Quando você não sabe se suas FAQs estão boas o suficiente para schema.",
    content: `Adicione schema FAQPage nas páginas que possuem FAQ.

Regras:

1. Usar apenas perguntas e respostas já publicadas na página.
2. Não inventar perguntas ocultas.
3. Não colocar conteúdo diferente no schema.
4. Usar JSON-LD no head da página.
5. Validar se o JSON está correto.
6. Manter o texto visível para o usuário.

Explique ao final quais páginas receberam schema.`,
    agentPrompt: `Tenho este FAQ:
[cole]

Analise:

1. Ele está bom para schema FAQPage?
2. Alguma pergunta está vaga?
3. Alguma resposta promete demais?
4. O que devo corrigir antes de mandar ao Lovable?`,
    correctionPrompt: `O schema FAQPage está incorreto. Corrija.

Verifique:

1. JSON-LD válido.
2. Perguntas iguais às exibidas na página.
3. Respostas iguais às exibidas na página.
4. Nenhum conteúdo oculto.
5. Sem promessas exageradas.
6. Sem erro de sintaxe.`,
    advanceCriteria:
      "Avance quando o FAQ estiver visível na página e o schema corresponder ao conteúdo real.",
  },
  {
    n: 7,
    title: "Adicionar marcação de aplicativo",
    purpose:
      "Adicionar schema SoftwareApplication para ajudar buscadores a entenderem que o produto é um app.",
    when: "Na home ou landing principal do app.",
    where: "Cole no Lovable.",
    result: "Schema SoftwareApplication válido com dados reais do app.",
    objective:
      "Adicionar schema SoftwareApplication para ajudar buscadores a entenderem que o produto é um app.",
    whenLovableDirect: "Na home ou landing principal do app.",
    whenAgentFirst:
      "Quando você não sabe quais dados reais do app pode informar.",
    content: `Adicione schema SoftwareApplication na home e na landing principal.

Inclua apenas dados reais:

1. Nome do app.
2. Descrição.
3. Categoria.
4. Sistema operacional, se aplicável.
5. URL.
6. Preço, se estiver definido.
7. Autor ou organização, se existir.
8. Política ou termos, se existirem.

Regras:

- Não inventar avaliações.
- Não inventar reviews.
- Não inventar preço se não estiver definido.
- Não inventar empresa.
- Usar JSON-LD válido.
- Inserir no head da página.`,
    agentPrompt: `Quero adicionar schema SoftwareApplication no meu app.

Dados atuais:
Nome:
[preencha]

Descrição:
[preencha]

Preço:
[preencha ou não definido]

Empresa ou responsável:
[preencha ou não definido]

Me ajude a decidir:

1. Quais campos posso usar.
2. Quais campos não devo inventar.
3. O que falta antes de publicar.`,
    correctionPrompt: `O schema SoftwareApplication está usando dados inventados ou incorretos. Corrija.

Regras:

1. Remova avaliações falsas.
2. Remova reviews inventados.
3. Remova empresa inexistente.
4. Use apenas dados reais.
5. Valide JSON-LD.
6. Insira apenas nas páginas corretas.`,
    advanceCriteria:
      "Avance quando a marcação usar apenas dados reais e estiver tecnicamente válida.",
  },
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
  {
    n: 1,
    title: "Criar imagem estática",
    purpose: "Criar imagens para posts, anúncios ou divulgação orgânica.",
    when: "Quando você já sabe público, dor, promessa e canal.",
    where: "Cole no Lovable.",
    result: "5 ideias de criativos estáticos com gancho, promessa, CTA e ângulo.",
    objective: "Criar imagens para posts, anúncios ou divulgação orgânica.",
    whenLovableDirect: "Quando você já sabe público, dor, promessa e canal.",
    whenAgentFirst: "Quando você ainda não sabe qual ângulo visual usar.",
    content: `Crie 5 conceitos de criativo estático para divulgar este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Canal:
[Instagram, WhatsApp, Meta Ads, LinkedIn ou outro]

Para cada criativo, entregue:

1. Gancho.
2. Headline.
3. Texto curto.
4. Sugestão visual.
5. CTA.
6. Ângulo usado.
7. Métrica para testar.

Regras:

- Não criar promessa exagerada.
- Não usar clichês.
- Não inventar prova.
- Focar em clareza, dor, promessa e ação.`,
    agentPrompt: `Quero criar criativos estáticos para divulgar meu app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Me ajude a definir:

1. Melhores ângulos.
2. Ganchos mais fortes.
3. O que devo evitar.
4. Qual criativo testar primeiro.
5. Qual prompt devo colar no Lovable.`,
    correctionPrompt: `Os criativos ficaram genéricos. Refaça com foco em clareza e conversão.

Cada criativo precisa ter:

1. Gancho forte.
2. Dor específica.
3. Promessa clara.
4. CTA.
5. Sugestão visual objetiva.
6. Ângulo diferente.

Remova clichês, frases vagas e promessas exageradas.`,
    advanceCriteria: "Avance quando tiver pelo menos 3 imagens com mensagens diferentes para testar.",
  },
  {
    n: 2,
    title: "Criar roteiro de vídeo curto",
    purpose: "Criar roteiros para Reels, TikTok, Shorts ou stories.",
    when: "Quando você já sabe qual dor ou promessa quer comunicar.",
    where: "Cole no Lovable.",
    result: "5 roteiros curtos, claros e prontos para gravar.",
    objective: "Criar roteiros para Reels, TikTok, Shorts ou stories.",
    whenLovableDirect: "Quando você já sabe qual dor ou promessa quer comunicar.",
    whenAgentFirst: "Quando você não sabe qual gancho usar nos primeiros segundos.",
    content: `Crie 5 roteiros de vídeo curto para divulgar este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Canal:
[Reels, TikTok, Shorts, Stories ou outro]

Para cada roteiro, entregue:

1. Gancho dos 3 primeiros segundos.
2. Cena 1.
3. Cena 2.
4. Cena 3.
5. Texto falado.
6. Texto na tela.
7. CTA final.
8. Duração sugerida.

Regras:

- Vídeos curtos e diretos.
- Linguagem natural.
- Sem promessa exagerada.
- Foco em dor, transformação e próximo passo.`,
    agentPrompt: `Quero criar roteiros de vídeo curto para meu app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Me ajude a criar:

1. 10 ganchos.
2. 5 ideias de roteiro.
3. O melhor formato para começar.
4. O que evitar para não parecer anúncio forçado.`,
    correctionPrompt: `Os roteiros ficaram longos ou genéricos. Refaça.

Cada roteiro deve ter:

1. Gancho nos primeiros 3 segundos.
2. Uma dor clara.
3. Uma promessa simples.
4. Poucas cenas.
5. CTA final.
6. Linguagem natural.

Remova enrolação, frases difíceis e promessas irreais.`,
    advanceCriteria: "Avance quando tiver pelo menos 3 roteiros simples que possam ser gravados sem produção complexa.",
  },
  {
    n: 3,
    title: "Criar anúncio para Meta Ads",
    purpose: "Criar textos de anúncio para Facebook e Instagram.",
    when: "Quando a oferta já foi testada organicamente.",
    where: "Cole no Lovable.",
    result: "5 anúncios prontos para teste, sem promessas exageradas.",
    objective: "Criar textos de anúncio para Facebook e Instagram.",
    whenLovableDirect: "Quando a oferta já foi testada organicamente.",
    whenAgentFirst: "Quando você ainda não validou a oferta ou não sabe se deve investir em anúncio.",
    content: `Crie 5 anúncios para Meta Ads para este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Oferta:
[descreva]

Para cada anúncio, entregue:

1. Título principal.
2. Texto principal.
3. Descrição curta.
4. CTA.
5. Ângulo do anúncio.
6. Ideia de criativo.
7. Métrica principal.

Regras:

- Não prometer resultado garantido.
- Não usar antes e depois falso.
- Não criar sensacionalismo.
- Não usar linguagem enganosa.
- Começar com teste simples.
- Não recomendar escalar antes de validar.`,
    agentPrompt: `Estou pensando em anunciar meu app.

App:
[descreva]

Oferta:
[descreva]

Público:
[descreva]

Resultados orgânicos:
[descreva ou escreva "ainda não testei"]

Analise:

1. Já faz sentido usar Meta Ads?
2. O que devo testar antes?
3. Qual ângulo de anúncio usar?
4. Qual promessa evitar?
5. Qual campanha simples posso rodar?`,
    correctionPrompt: `Os anúncios ficaram exagerados ou genéricos. Refaça com mais clareza.

Cada anúncio precisa ter:

1. Dor específica.
2. Promessa realista.
3. CTA claro.
4. Texto direto.
5. Ângulo diferente.

Remova hype, promessa garantida e frases vagas.`,
    advanceCriteria: "Avance quando tiver anúncios claros e uma oferta já minimamente validada.",
  },
  {
    n: 4,
    title: "Criar posts para Instagram",
    purpose: "Criar posts orgânicos para explicar, educar e gerar interesse.",
    when: "Quando você quer alimentar o perfil antes de vender ou lançar.",
    where: "Cole no Lovable.",
    result: "10 posts prontos com tema, legenda, CTA e objetivo.",
    objective: "Criar posts orgânicos para explicar, educar e gerar interesse.",
    whenLovableDirect: "Quando você quer alimentar o perfil antes de vender ou lançar.",
    whenAgentFirst: "Quando você não sabe quais temas postar.",
    content: `Crie 10 posts para Instagram sobre este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Para cada post, entregue:

1. Tipo do post: carrossel, imagem única, reel ou texto.
2. Tema.
3. Headline.
4. Legenda.
5. CTA.
6. Objetivo do post.
7. Ideia visual.

Regras:

- Não criar conteúdo genérico.
- Não usar clichês.
- Não prometer resultado automático.
- Misturar educação, dor, bastidores, prova honesta e convite.`,
    agentPrompt: `Quero criar conteúdo para divulgar meu app no Instagram.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Oferta:
[descreva]

Me ajude a criar:

1. Pilares de conteúdo.
2. Ideias de posts.
3. Ordem de publicação.
4. CTAs.
5. O que evitar.`,
    correctionPrompt: `Os posts ficaram genéricos. Refaça com temas mais específicos.

Inclua:

1. Dor real do público.
2. Exemplos práticos.
3. Convite para testar ou conhecer.
4. CTA.
5. Linguagem simples.
6. Variação entre educação, venda e bastidor.`,
    advanceCriteria: "Avance quando tiver pelo menos 5 posts que expliquem bem o app e convidem para uma ação.",
  },
  {
    n: 5,
    title: "Criar sequência de stories",
    purpose: "Criar uma sequência rápida para gerar conversa e ação.",
    when: "Quando você quer testar interesse com sua audiência.",
    where: "Cole no Lovable.",
    result: "Sequência de stories com interação e CTA.",
    objective: "Criar uma sequência rápida para gerar conversa e ação.",
    whenLovableDirect: "Quando você quer testar interesse com sua audiência.",
    whenAgentFirst: "Quando não sabe como abrir conversa sem parecer venda forçada.",
    content: `Crie uma sequência de stories para divulgar este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Crie 8 stories com:

1. Texto do story.
2. Elemento interativo: enquete, caixa de pergunta, quiz ou contagem.
3. Sugestão visual.
4. Objetivo de cada story.
5. CTA final.

Regras:

- Começar com dor ou curiosidade.
- Criar interação.
- Não vender de forma agressiva.
- Terminar com chamada clara.`,
    agentPrompt: `Quero criar stories para divulgar meu app sem parecer forçado.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Me ajude a criar:

1. Gancho inicial.
2. Enquetes.
3. Caixas de pergunta.
4. Sequência lógica.
5. CTA final.`,
    correctionPrompt: `Os stories ficaram sem interação ou muito vendedores. Refaça.

Inclua:

1. Gancho inicial.
2. Pergunta para audiência.
3. Enquete.
4. Explicação simples.
5. CTA final.
6. Linguagem natural.`,
    advanceCriteria: "Avance quando a sequência conseguir gerar resposta ou clique.",
  },
  {
    n: 6,
    title: "Criar Reels, TikTok ou Shorts",
    purpose: "Criar ideias de vídeos curtos para alcance orgânico.",
    when: "Quando você quer testar alcance com vídeo curto.",
    where: "Cole no Lovable.",
    result: "10 ideias de vídeos curtos com ganchos e CTAs.",
    objective: "Criar ideias de vídeos curtos para alcance orgânico.",
    whenLovableDirect: "Quando você quer testar alcance com vídeo curto.",
    whenAgentFirst: "Quando não sabe qual formato combina com o público.",
    content: `Crie 10 ideias de vídeos curtos para divulgar este app.

App:
[descreva]

Público:
[descreva]

Dor:
[descreva]

Promessa:
[descreva]

Para cada vídeo, entregue:

1. Gancho.
2. Formato: tutorial, lista, erro comum, antes e depois conceitual, bastidor, pergunta, história ou demonstração.
3. Roteiro resumido.
4. Texto na tela.
5. CTA.
6. Duração sugerida.

Regras:

- Não criar promessas falsas.
- Não depender de produção complexa.
- Usar linguagem simples.
- Focar em retenção nos primeiros segundos.`,
    agentPrompt: `Quero divulgar meu app com vídeos curtos.

App:
[descreva]

Público:
[descreva]

Canal:
[Reels, TikTok, Shorts]

Me ajude a decidir:

1. Quais formatos testar.
2. Quais ganchos usar.
3. Quais ideias têm mais chance de retenção.
4. Como transformar minha oferta em vídeo.`,
    correctionPrompt: `As ideias de vídeos ficaram genéricas. Refaça com formatos mais fortes.

Use:

1. Erro comum.
2. Lista rápida.
3. Antes e depois conceitual.
4. Demonstração.
5. Bastidor.
6. Pergunta polêmica sem exagero.
7. Dor específica.`,
    advanceCriteria: "Avance quando tiver pelo menos 3 vídeos simples para gravar ainda hoje.",
  },
  {
    n: 7,
    title: "Criar teste A/B de criativos",
    purpose: "Comparar versões e descobrir o que funciona melhor.",
    when: "Depois de criar pelo menos 2 criativos.",
    where: "Cole no Lovable.",
    result: "Plano simples para comparar criativos sem confusão.",
    objective: "Comparar versões e descobrir o que funciona melhor.",
    whenLovableDirect: "Depois de criar pelo menos 2 criativos.",
    whenAgentFirst: "Quando você não sabe o que testar.",
    content: `Crie um plano de teste A/B de criativos.

Criativos disponíveis:
[liste]

Objetivo:
[clique, cadastro, compra, resposta, visualização ou outro]

Crie:

1. Hipótese do teste.
2. Versão A.
3. Versão B.
4. O que muda entre elas.
5. Métrica principal.
6. Período mínimo de teste.
7. Como decidir vencedor.
8. Próximo teste recomendado.

Regras:

- Testar uma diferença por vez.
- Não mudar tudo ao mesmo tempo.
- Não decidir apenas por curtida.
- Olhar clique, resposta, cadastro, compra ou uso real.`,
    agentPrompt: `Quero testar criativos, mas não sei o que comparar.

Criativos:
[cole ou descreva]

Objetivo:
[descreva]

Me ajude a criar:

1. Uma hipótese de teste.
2. Duas versões.
3. Métrica principal.
4. Critério para escolher vencedor.`,
    correctionPrompt: `O teste A/B ficou confuso. Refaça de forma simples.

Compare apenas uma diferença:

1. Gancho.
2. CTA.
3. Imagem.
4. Dor.
5. Promessa.
6. Formato.

Explique qual métrica define o vencedor.`,
    advanceCriteria: "Avance quando souber exatamente o que está testando e qual número define o vencedor.",
  },
  {
    n: 8,
    title: "Organizar biblioteca de criativos",
    purpose: "Guardar criativos, resultados e aprendizados para reaproveitar.",
    when: "Quando você já tem vários criativos ou campanhas.",
    where: "Cole no Lovable.",
    result: "Estrutura simples para organizar criativos e aprendizados.",
    objective: "Guardar criativos, resultados e aprendizados para reaproveitar.",
    whenLovableDirect: "Quando você já tem vários criativos ou campanhas.",
    whenAgentFirst: "Quando você não sabe como organizar testes e resultados.",
    content: `Crie a estrutura de uma biblioteca de criativos.

A biblioteca deve organizar:

1. Categoria.
2. Canal.
3. Formato.
4. Gancho.
5. Dor.
6. Promessa.
7. CTA.
8. Status: ideia, em teste, aprovado, pausado.
9. Métrica principal.
10. Resultado.
11. Aprendizado.
12. Link ou arquivo do criativo.

Sugira também uma tabela simples para Notion, Airtable, Google Sheets ou banco do app.`,
    agentPrompt: `Quero organizar meus criativos e testes.

Canais:
[descreva]

Quantidade de criativos:
[descreva]

Me ajude a criar:

1. Estrutura simples de biblioteca.
2. Campos essenciais.
3. Como marcar vencedores.
4. Como reaproveitar criativos que funcionaram.`,
    correctionPrompt: `A biblioteca ficou complexa demais. Simplifique.

Use apenas:

1. Nome do criativo.
2. Canal.
3. Formato.
4. Gancho.
5. Status.
6. Métrica.
7. Resultado.
8. Aprendizado.

Não crie painel complexo se uma tabela simples resolver.`,
    advanceCriteria: "Avance quando conseguir saber quais criativos foram testados, quais funcionaram e por quê.",
  },
];

export const COMMANDS_VALIDACAO: Command[] = [
  {
    n: 1,
    title: "Planejar teste com 10 usuários reais",
    purpose: "Criar um plano simples para testar o app com pessoas parecidas com o público real.",
    when: "Quando o MVP já está publicado ou pronto para teste.",
    where: "Cole no Lovable.",
    result: "Plano simples para testar o app com 10 pessoas reais.",
    objective: "Criar um plano simples para testar o app com pessoas parecidas com o público real.",
    whenLovableDirect: "Quando o MVP já está publicado ou pronto para teste.",
    whenAgentFirst: "Quando você não sabe quem chamar ou o que deve observar no teste.",
    content: `Crie um plano para validar este app com 10 usuários reais.

App:
[descreva]

Público:
[descreva]

Problema que resolve:
[descreva]

Ação principal do app:
[descreva]

Entregue:

1. Quem chamar para testar.
2. Onde encontrar essas pessoas.
3. Mensagem de convite.
4. Tarefas que elas devem fazer dentro do app.
5. Perguntas de feedback.
6. Métrica principal do teste.
7. Sinais de interesse real.
8. Critérios para continuar, ajustar ou pausar.

Regras:

- Não valide apenas com pessoas que querem agradar.
- Não pergunte só se a pessoa gostou.
- Observe comportamento.
- Priorize sinais reais: uso, clique, cadastro, retorno, indicação, pergunta de preço ou compra.`,
    agentPrompt: `Quero validar meu app com pessoas reais.

App:
[descreva]

Público:
[descreva]

Ação principal:
[descreva]

Me ajude a definir:

1. Quem devo chamar para testar.
2. Onde encontrar essas pessoas.
3. O que devo pedir para elas fazerem.
4. Quais perguntas devo fazer.
5. Quais sinais mostram interesse real.
6. O que não devo considerar validação.`,
    correctionPrompt: `O plano de validação ficou genérico. Refaça com foco em comportamento real.

Corrija:

1. Quem deve testar.
2. O que a pessoa deve fazer no app.
3. Quais perguntas revelarão dúvidas reais.
4. Quais métricas serão acompanhadas.
5. Como separar elogio de sinal real.
6. O que fazer se ninguém usar.`,
    advanceCriteria: "Avance quando souber quem chamar, o que pedir para testar e quais sinais observar.",
  },
  {
    n: 2,
    title: "Criar formulário de feedback simples",
    purpose: "Formulário curto para entender se o usuário compreendeu, usou e teve interesse.",
    when: "Antes de enviar o app para os primeiros testes.",
    where: "Cole no Lovable.",
    result: "Formulário curto, claro e útil para coletar feedback real.",
    objective: "Criar um formulário curto para entender se o usuário compreendeu, usou e teve interesse.",
    whenLovableDirect: "Antes de enviar o app para os primeiros testes.",
    whenAgentFirst: "Quando você não sabe quais perguntas fazer.",
    content: `Crie um formulário de feedback simples para testar este app.

App:
[descreva]

Público:
[descreva]

Objetivo do teste:
[descreva]

O formulário deve ter no máximo 8 perguntas.

Misture:

1. Perguntas fechadas.
2. Perguntas abertas.
3. Perguntas sobre clareza.
4. Perguntas sobre dificuldade.
5. Perguntas sobre interesse real.
6. Perguntas sobre o que faltou.
7. Perguntas sobre pagamento ou continuidade, se fizer sentido.

Inclua perguntas como:

- Você entendeu o que o app faz?
- Conseguiu completar a ação principal?
- Onde você travou?
- O que ficou confuso?
- Você usaria de novo?
- Você pagaria por isso ou indicaria para alguém?
- O que impediria você de usar?

Regras:

- Não fazer formulário longo.
- Não perguntar apenas se a pessoa gostou.
- Focar em clareza, uso e interesse real.`,
    agentPrompt: `Preciso criar um formulário de feedback para validar meu app.

App:
[descreva]

Público:
[descreva]

O que quero descobrir:
[descreva]

Crie perguntas para entender:

1. Se a pessoa entendeu.
2. Se conseguiu usar.
3. Onde travou.
4. Se teve interesse real.
5. O que devo melhorar primeiro.`,
    correctionPrompt: `O formulário ficou longo ou superficial. Refaça.

Regras:

1. Máximo de 8 perguntas.
2. Perguntas simples.
3. Foco em uso real.
4. Perguntar onde a pessoa travou.
5. Perguntar se usaria de novo.
6. Perguntar sobre interesse real.
7. Evitar perguntas que só geram elogio.`,
    advanceCriteria: "Avance quando o formulário ajudar a descobrir clareza, dificuldade e interesse real.",
  },
  {
    n: 3,
    title: "Criar mensagem de convite",
    purpose: "Mensagens simples para convidar pessoas a testarem o app.",
    when: "Antes de chamar os primeiros usuários.",
    where: "Cole no Lovable.",
    result: "Mensagens prontas para chamar pessoas reais para teste.",
    objective: "Criar mensagens simples para convidar pessoas a testarem o app.",
    whenLovableDirect: "Antes de chamar os primeiros usuários.",
    whenAgentFirst: "Quando você não sabe como convidar sem parecer venda forçada.",
    content: `Crie mensagens de convite para pessoas testarem este app.

App:
[descreva]

Público:
[descreva]

O que quero testar:
[descreva]

Crie:

1. Mensagem curta para WhatsApp.
2. Mensagem para direct do Instagram.
3. Mensagem para grupo ou comunidade.
4. Mensagem mais pessoal para alguém conhecido.
5. Mensagem de lembrete.

Cada mensagem deve:

- Explicar o que é o app.
- Pedir um teste rápido.
- Dizer quanto tempo leva.
- Pedir feedback sincero.
- Não parecer venda agressiva.
- Não prometer recompensa inexistente.`,
    agentPrompt: `Quero convidar pessoas para testarem meu app sem parecer insistente.

App:
[descreva]

Público:
[descreva]

Canal:
[WhatsApp, direct, grupo, e-mail, outro]

Me ajude a criar:

1. Uma mensagem curta.
2. Uma mensagem mais pessoal.
3. Uma mensagem de lembrete.
4. Um convite que peça feedback sincero.`,
    correctionPrompt: `As mensagens ficaram longas, frias ou vendedoras demais. Refaça.

Cada mensagem deve:

1. Ser curta.
2. Explicar o app em uma frase.
3. Pedir teste rápido.
4. Pedir feedback sincero.
5. Ter CTA simples.
6. Não parecer anúncio.`,
    advanceCriteria: "Avance quando tiver uma mensagem simples para convidar pelo canal escolhido.",
  },
  {
    n: 4,
    title: "Fazer perguntas certas aos usuários",
    purpose: "Perguntas para entender comportamento, dúvidas, objeções e interesse real.",
    when: "Depois que algumas pessoas testaram o app.",
    where: "Cole no Lovable.",
    result: "Perguntas úteis para entender o que aconteceu no teste.",
    objective: "Criar perguntas para entender comportamento, dúvidas, objeções e interesse real.",
    whenLovableDirect: "Depois que algumas pessoas testaram o app.",
    whenAgentFirst: "Quando você não sabe como conversar com usuários.",
    content: `Crie uma pesquisa com 10 perguntas para entender o público deste app.

App:
[descreva]

Público:
[descreva]

O que o usuário testou:
[descreva]

Foco:

- Dor real.
- Clareza da promessa.
- Facilidade de uso.
- Onde travou.
- Frequência de uso.
- Interesse em continuar.
- Interesse em pagar ou indicar.
- Objeções.
- O que melhoraria.

Regras:

- Não fazer perguntas que induzem elogio.
- Não perguntar só "você gostou?".
- Perguntar sobre comportamento.
- Perguntar o que a pessoa fez, não só o que ela acha.`,
    agentPrompt: `Quero entrevistar usuários que testaram meu app.

App:
[descreva]

O que eles testaram:
[descreva]

Me ajude a criar perguntas para descobrir:

1. Se entenderam.
2. Se conseguiram usar.
3. Onde travaram.
4. Se voltariam.
5. Se pagariam.
6. O que devo melhorar primeiro.`,
    correctionPrompt: `As perguntas ficaram fracas ou induzem respostas educadas. Refaça.

Crie perguntas que descubram:

1. Comportamento.
2. Dificuldade.
3. Interesse real.
4. Objeções.
5. Clareza.
6. Próximo passo.

Evite perguntas que só geram "sim", "não" ou elogio.`,
    advanceCriteria: "Avance quando as perguntas ajudarem a descobrir comportamento, não só opinião.",
  },
  {
    n: 5,
    title: "Separar elogio de sinal real",
    purpose: "Analisar feedback e identificar o que realmente importa.",
    when: "Depois de coletar respostas dos usuários.",
    where: "Cole no Lovable.",
    result: "Resumo claro do que é elogio, sinal real, dúvida repetida e prioridade de melhoria.",
    objective: "Analisar feedback e identificar o que realmente importa.",
    whenLovableDirect: "Depois de coletar respostas dos usuários.",
    whenAgentFirst: "Quando você não sabe interpretar feedback.",
    content: `Analise as respostas coletadas e separe elogios de sinais reais.

Respostas:
[cole aqui]

Classifique:

1. Elogios genéricos.
2. Dúvidas repetidas.
3. Travamentos.
4. Objeções.
5. Sinais fracos.
6. Sinais fortes.
7. Sugestões úteis.
8. Sugestões que devem ser ignoradas agora.

Considere sinal forte:

- Usuário criou conta.
- Usuário usou sem ajuda.
- Usuário pediu o link.
- Usuário perguntou preço.
- Usuário voltou.
- Usuário indicou.
- Usuário pagou.
- Usuário pediu acesso.

Entregue:

1. Resumo do feedback.
2. Padrões identificados.
3. O que corrigir primeiro.
4. O que não mudar agora.
5. Próximo teste recomendado.`,
    agentPrompt: `Recebi feedback do meu app e preciso interpretar.

Feedback:
[cole]

Me ajude a separar:

1. Elogio educado.
2. Sinal real de interesse.
3. Dúvida repetida.
4. Problema de usabilidade.
5. Objeção comercial.
6. O que devo mudar primeiro.
7. O que devo ignorar por enquanto.`,
    correctionPrompt: `A análise ficou superficial. Refaça separando opinião de comportamento.

Analise:

1. Quem realmente usou.
2. Quem só elogiou.
3. Onde as pessoas travaram.
4. O que apareceu mais de uma vez.
5. Se houve interesse real.
6. Se alguém perguntou preço, pediu acesso, voltou ou indicou.
7. O que mudar primeiro.`,
    advanceCriteria: "Avance quando souber quais feedbacks representam comportamento real e quais são apenas opinião.",
  },
  {
    n: 6,
    title: "Melhorar o app com base no feedback",
    purpose: "Aplicar melhorias priorizadas sem bagunçar o MVP.",
    when: "Depois de identificar padrões repetidos no feedback.",
    where: "Cole no Lovable.",
    result: "App melhorado com base em padrões reais de feedback, sem inflar o escopo.",
    objective: "Aplicar melhorias priorizadas sem bagunçar o MVP.",
    whenLovableDirect: "Depois de identificar padrões repetidos no feedback.",
    whenAgentFirst: "Quando você não sabe o que corrigir primeiro.",
    content: `Aplique melhorias no app com base neste feedback.

Feedback resumido:
[cole resumo]

Dúvidas repetidas:
[cole]

Problemas encontrados:
[cole]

Sinais reais:
[cole]

Regras:

1. Corrigir primeiro o que bloqueia o uso.
2. Melhorar clareza antes de adicionar funções.
3. Não criar funcionalidades novas sem necessidade.
4. Não mudar tudo por causa de uma opinião isolada.
5. Preservar o MVP.
6. Explicar o que foi alterado.
7. Explicar como testar depois.

Prioridade:

1. Erros que impedem uso.
2. Confusão na primeira tela.
3. Ação principal difícil.
4. Falta de clareza na oferta.
5. Melhorias simples de UX.`,
    agentPrompt: `Preciso decidir o que mudar no app depois do feedback.

Feedback:
[cole]

Problemas:
[cole]

Sinais de interesse:
[cole]

Me ajude a priorizar:

1. O que corrigir agora.
2. O que deixar para depois.
3. O que ignorar.
4. O que testar novamente.
5. Qual prompt mandar ao Lovable.`,
    correctionPrompt: `As melhorias ficaram grandes demais. Simplifique.

Não aumente o escopo.
Não crie funcionalidades novas sem necessidade.
Corrija apenas:

1. Erros que impedem uso.
2. Pontos de confusão.
3. Fluxo principal.
4. Texto pouco claro.
5. Problemas repetidos no feedback.

Preserve o MVP.`,
    advanceCriteria: "Avance quando as melhorias resolverem problemas repetidos e o app estiver pronto para novo teste.",
  },
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

Público: profissionais autônomos.
Dor: perdem horários por usarem só WhatsApp.

MVP:
1. Cadastro de serviços
2. Agenda de horários
3. Cadastro de clientes
4. Confirmação de agendamento
5. Painel do profissional

Banco: profissionais, servicos, clientes, agendamentos.
Mobile first.`,
    checklist: ["Profissional cria serviço", "Cliente é cadastrado", "Agendamento confirmado", "Painel mostra agenda do dia"],
    shortDescription: "Agenda online para profissionais autônomos organizarem horários, serviços e clientes em um só lugar.",
    promise: "Nunca mais perder um horário ou cliente por causa de mensagem no WhatsApp.",
    expectedResult: "O profissional abre o app no celular e vê a agenda do dia com nome, serviço e horário de cada cliente.",
    mainAction: "Marcar um novo horário em até 2 toques.",
    mvp: [
      "Cadastrar serviços com duração e preço",
      "Ver agenda do dia/semana",
      "Cadastrar cliente rápido",
      "Marcar e confirmar agendamento",
      "Painel simples com totais do dia",
    ],
    cutFromFirst: ["Integração com Google Calendar", "Pagamento online", "Programa de fidelidade", "App nativo"],
    screensWithRole: [
      { name: "Login", role: "Entrar com e-mail/senha." },
      { name: "Agenda", role: "Ver e marcar horários do dia." },
      { name: "Serviços", role: "Cadastrar serviços e preços." },
      { name: "Clientes", role: "Buscar e cadastrar clientes." },
      { name: "Painel", role: "Totais do dia e próximos atendimentos." },
    ],
    loginAccess: "Login obrigatório por profissional. Cada profissional só vê os próprios dados.",
    adminArea: "Sem painel admin nesta versão. O próprio profissional administra a conta.",
    paymentNotes: "Cobrança recorrente externa (Stripe/Hotmart). O app só libera acesso de quem está pago.",
    differentiator: "Feito para uma única pessoa autônoma: simples, em português, mobile first.",
    risks: ["Profissional resistir a sair do WhatsApp", "Cliente esquecer de confirmar"],
    testFirst: ["Cadastrar 5 serviços e 5 clientes reais", "Marcar 1 dia inteiro de atendimentos", "Ver agenda no celular"],
    buyerPersona: "Profissional autônomo, 25–55 anos, atende em casa ou em salão pequeno.",
    validationTest: "Conseguir 3 profissionais pagando R$29–49/mês por 30 dias seguidos.",
    visualStyleSuggestion: "Clean, claro, mobile first, com destaque para horários e nomes.",
  },
  {
    name: "Tarot Digital",
    audience: "Tarólogas, terapeutas holísticas e oraculistas.",
    pain: "Vendem por DM, cobram por Pix e perdem clientes que queriam comprar sozinhos.",
    monetization: "Assinatura mensal da profissional + venda avulsa de leituras.",
    screens: ["Home pública", "Catálogo de leituras", "Compra", "Área do cliente", "Painel"],
    database: ["taróloga", "leituras", "clientes", "pedidos", "mensagens"],
    command: `Crie no Lovable um app chamado Tarot Digital.

Público: tarólogas e oraculistas.
Dor: vendem por DM e Pix, perdem clientes que queriam comprar sozinhos.

MVP:
1. Catálogo público de leituras
2. Compra simples com link de pagamento
3. Área do cliente para ver a leitura entregue
4. Painel da tarólogá para enviar a leitura
5. E-mail quando a leitura é liberada

Banco: tarólogá, leituras, clientes, pedidos, mensagens.
Mobile first. Estilo místico e elegante.`,
    checklist: ["Cliente compra leitura", "Tarólogá recebe pedido", "Tarólogá entrega leitura", "Cliente abre a área"],
    shortDescription: "Vitrine + área do cliente para tarólogas venderem leituras digitais sem depender de DM.",
    promise: "Vender leituras em um link só, sem ficar respondendo Pix e print de comprovante.",
    expectedResult: "A cliente entra, escolhe uma leitura, paga e recebe o resultado na própria área dela.",
    mainAction: "Comprar uma leitura em menos de 2 minutos.",
    mvp: [
      "Catálogo público de leituras",
      "Compra com link de pagamento",
      "Painel da tarólogá com pedidos",
      "Área do cliente com leitura entregue",
      "E-mail quando a leitura sai",
    ],
    cutFromFirst: ["Chat ao vivo", "Agendamento de chamada", "App nativo", "Comunidade interna"],
    screensWithRole: [
      { name: "Home pública", role: "Apresentar a tarólogá e suas leituras." },
      { name: "Catálogo", role: "Listar leituras com preço." },
      { name: "Compra", role: "Receber dados e abrir pagamento." },
      { name: "Área do cliente", role: "Ver leituras compradas." },
      { name: "Painel", role: "Receber e responder pedidos." },
    ],
    loginAccess: "Login obrigatório para a cliente. Tarólogá tem login separado.",
    adminArea: "Painel da tarólogá lista pedidos, libera leitura e marca como entregue.",
    paymentNotes: "Pagamento via link externo (Stripe/Hotmart/Pix). Liberação manual ou via webhook.",
    differentiator: "Feito para o ritual: visual místico, linguagem acolhedora, foco no cuidado.",
    risks: ["Cliente esperar resposta instantânea", "Comprovantes de Pix manuais"],
    testFirst: ["Cadastrar 3 tipos de leitura", "Fazer 3 vendas reais", "Entregar 3 leituras pelo painel"],
    buyerPersona: "Tarólogá ou terapeuta, 28–55 anos, já vende por Instagram.",
    validationTest: "10 leituras vendidas em 30 dias, com a tarólogá pagando R$49/mês.",
    visualStyleSuggestion: "Místico, escuro, com toques dourados e tipografia elegante.",
  },
  {
    name: "Área de Membros Express",
    audience: "Infoprodutores, mentores e criadores que vendem conteúdo digital.",
    pain: "Pagam plataformas caras só para entregar um curso simples.",
    monetization: "Assinatura mensal do criador.",
    screens: ["Login do aluno", "Lista de módulos", "Aula", "Materiais", "Painel do criador"],
    database: ["criadores", "alunos", "modulos", "aulas", "materiais", "acessos"],
    command: `Crie no Lovable um app chamado Área de Membros Express.

Público: infoprodutores, mentores e criadores.
Dor: usam plataformas caras só para entregar um curso simples.

MVP:
1. Login do aluno
2. Lista de módulos e aulas
3. Player com vídeo embed (YouTube/Vimeo)
4. Materiais para download
5. Painel do criador

Banco: criadores, alunos, modulos, aulas, materiais, acessos.
Mobile first. Visual limpo e premium.`,
    checklist: ["Criador cadastra módulo", "Aluno entra com login", "Aluno vê aula", "Aluno baixa material"],
    shortDescription: "Área de membros simples e premium para vender e entregar conteúdo digital sem plataforma cara.",
    promise: "Entregar seu curso em uma área profissional, sem pagar plataforma cara nem mexer em código.",
    expectedResult: "Aluno entra com login, abre o módulo certo e assiste à aula no celular ou no computador.",
    mainAction: "Assistir a próxima aula em 1 toque.",
    mvp: [
      "Login do aluno",
      "Lista de módulos e aulas",
      "Player com vídeo embed",
      "Materiais para download",
      "Painel do criador",
    ],
    cutFromFirst: ["Comunidade interna", "Comentários", "Gamificação", "App nativo", "Hospedagem de vídeo"],
    screensWithRole: [
      { name: "Login", role: "Entrar como aluno." },
      { name: "Módulos", role: "Ver progresso e abrir aulas." },
      { name: "Aula", role: "Assistir e marcar como vista." },
      { name: "Materiais", role: "Baixar PDFs e bônus." },
      { name: "Painel do criador", role: "Cadastrar conteúdo e liberar acesso." },
    ],
    loginAccess: "Login obrigatório para o aluno. Acesso liberado pelo criador ou via integração com checkout externo.",
    adminArea: "Painel do criador para gerenciar módulos, aulas e quem tem acesso.",
    paymentNotes: "Pagamento via Hotmart/Stripe/Kiwify. O app só controla o acesso após a venda.",
    differentiator: "Foco em entrega rápida do conteúdo: nada de tela cheia, só o essencial para o aluno aprender.",
    risks: ["Aluno reclamar de função que outra plataforma tem", "Vídeos pesados"],
    testFirst: ["Cadastrar 1 módulo com 3 aulas", "Liberar acesso para 5 alunos", "Coletar feedback em 7 dias"],
    buyerPersona: "Criador de curso digital com até 500 alunos, 25–50 anos.",
    validationTest: "3 criadores pagando R$97/mês com pelo menos 10 alunos ativos cada.",
    visualStyleSuggestion: "Premium, escuro, foco no conteúdo, tipografia legível.",
  },
  {
    name: "App de Mentoria",
    audience: "Mentores que acompanham alunos em jornadas de 30 a 180 dias.",
    pain: "Perdem alunos por falta de organização entre encontros, tarefas e materiais.",
    monetization: "Assinatura mensal do mentor.",
    screens: ["Login", "Mentorados", "Plano do aluno", "Encontros", "Materiais"],
    database: ["mentores", "alunos", "encontros", "tarefas", "materiais"],
    command: `Crie no Lovable um app chamado App de Mentoria.

Público: mentores que acompanham alunos em jornadas.
Dor: perdem alunos por falta de organização entre encontros e tarefas.

MVP:
1. Cadastrar mentorados
2. Plano individual com tarefas
3. Agenda de encontros
4. Materiais por aluno
5. Painel do mentor com status de cada aluno

Banco: mentores, alunos, encontros, tarefas, materiais.
Mobile first. Foco em clareza.`,
    checklist: ["Mentor cadastra aluno", "Aluno vê tarefas", "Encontro agendado", "Material acessado"],
    shortDescription: "Espaço único para o mentor organizar alunos, encontros, tarefas e materiais — sem perder ninguém no caminho.",
    promise: "Acompanhar todo aluno com clareza, sem depender de planilha ou caixa de mensagens lotada.",
    expectedResult: "Mentor abre o app e vê o status de cada aluno: tarefas pendentes, próximo encontro, último contato.",
    mainAction: "Abrir o aluno e atualizar o plano dele em 30 segundos.",
    mvp: [
      "Cadastrar mentorado",
      "Criar plano com tarefas",
      "Agendar encontros",
      "Anexar materiais ao aluno",
      "Painel do mentor",
    ],
    cutFromFirst: ["Chat ao vivo", "Pagamento dentro do app", "Avaliação 360", "Integração com calendário"],
    screensWithRole: [
      { name: "Login", role: "Entrar como mentor ou aluno." },
      { name: "Mentorados", role: "Ver lista e status de cada aluno." },
      { name: "Plano do aluno", role: "Criar tarefas e marcar progresso." },
      { name: "Encontros", role: "Agendar e registrar conversas." },
      { name: "Materiais", role: "Anexar PDFs, vídeos e links." },
    ],
    loginAccess: "Login obrigatório. Mentor enxerga todos os alunos; cada aluno só vê o próprio plano.",
    adminArea: "Painel do mentor com filtros por status (em dia, atrasado, sumido).",
    paymentNotes: "Cobrança fora do app. O app só dá acesso a quem o mentor liberar.",
    differentiator: "Não é CRM nem LMS: é um app feito para a relação mentor↔aluno.",
    risks: ["Aluno não entrar no app", "Mentor não atualizar status"],
    testFirst: ["Cadastrar 5 alunos reais", "Rodar 1 ciclo de 30 dias", "Coletar 3 depoimentos"],
    buyerPersona: "Mentor com 5–50 alunos ativos, 30–55 anos.",
    validationTest: "3 mentores pagando R$149/mês com pelo menos 5 alunos ativos cada.",
    visualStyleSuggestion: "Clean, organizado, com destaque para status e prazos.",
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
    severity: "Médio",
    title: "Lovable criou coisa demais",
    explanation: "Você pediu MVP mas ele entregou recursos extras.",
    fix: "Peça para remover o que não está no MVP e voltar ao plano original.",
    command: `Revise o app e remova tudo que não está neste MVP:

[cole a lista do MVP]

Mantenha somente as 5 funcionalidades acordadas. Não adicione novidades.`,
  },
  {
    category: "Login",
    severity: "Crítico",
    title: "Login não funciona",
    explanation: "Usuário não consegue entrar ou recebe erro.",
    fix: "Peça ao Lovable para revisar fluxo de autenticação e mensagens.",
    command: `Revise o fluxo de login.

Verifique: cadastro, login, recuperação de senha, redirecionamento após login e mensagens claras de erro. Use Supabase Auth corretamente.`,
  },
  {
    category: "Banco",
    severity: "Crítico",
    title: "Banco não salva",
    explanation: "Dados somem ou erro ao gravar.",
    fix: "Peça revisão das políticas RLS e do client de inserção.",
    command: `Revise por que o banco não está salvando dados.

Verifique: políticas RLS, GRANTS, schema da tabela, payload enviado e mensagens de erro no console. Corrija e explique o que estava errado.`,
  },
  {
    category: "Mobile",
    severity: "Médio",
    title: "Página ficou feia no celular",
    explanation: "Layout quebrado, texto cortado, botões pequenos.",
    fix: "Peça ajuste mobile first.",
    command: `Ajuste o layout mobile da página [nome].

Garanta: nada com scroll horizontal, botões com toque confortável, texto legível, espaçamento adequado e cards em uma coluna no celular.`,
  },
  {
    category: "Lovable",
    severity: "Crítico",
    title: "Botão não funciona",
    explanation: "Clica e nada acontece.",
    fix: "Peça verificação do handler e estado.",
    command: `Verifique por que o botão [descreva] não está funcionando.

Cheque: handler conectado, estado correto, validações, console do navegador. Corrija e teste.`,
  },
  {
    category: "Acesso",
    severity: "Crítico",
    title: "Usuário não consegue entrar",
    explanation: "Login ok mas a área restrita não abre.",
    fix: "Peça revisão da regra de acesso liberado.",
    command: `Revise por que o usuário logado não acessa a área restrita.

Verifique: tabela user_access, flag has_access, redirecionamento e mensagens. Corrija.`,
  },
  {
    category: "Lovable",
    severity: "Leve",
    title: "Não sei qual comando usar",
    explanation: "Está na dúvida sobre a ordem.",
    fix: "Volte para Comece aqui e siga a trilha em ordem.",
    command: `Sou iniciante. Me diga, com base neste plano:

[cole o plano]

Qual deve ser o próximo comando que devo usar no Lovable e por quê.`,
  },
  {
    category: "Divulgação",
    severity: "Leve",
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
    category: "Divulgação",
    severity: "Médio",
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
    severity: "Médio",
    title: "Ninguém respondeu",
    explanation: "Mandou convite mas ninguém testou.",
    fix: "Reveja convite, canal e oferta de retorno.",
    command: `Reveja minha mensagem de convite para validação:

[cole a mensagem]

Reescreva mais humana, com benefício claro para quem aceitar e tempo realista.`,
  },
  {
    category: "Deploy",
    severity: "Crítico",
    title: "App não abre depois de publicar",
    explanation: "O app funcionava no preview, mas quebrou depois do deploy.",
    fix: "Peça para o Lovable verificar build, rotas, variáveis de ambiente e erros de console.",
    command: `Meu app funcionava no preview, mas não abre depois do deploy.

Verifique:
1. Erros de build.
2. Rotas quebradas.
3. Variáveis de ambiente ausentes.
4. Erros no console.
5. Dependências quebradas.
6. Diferença entre preview e produção.

Não refaça o app.
Corrija apenas a causa do erro e explique como testar.`,
  },
  {
    category: "Venda",
    severity: "Crítico",
    title: "Botão de checkout não abre",
    explanation: "O botão de pagamento não leva para o checkout ou abre erro.",
    fix: "Verifique URL configurada, placeholder, protocolo e ação do botão.",
    command: `O botão de checkout não está funcionando.

Verifique:
1. Se a URL de checkout está preenchida.
2. Se ainda existe placeholder como COLE_AQUI.
3. Se a URL começa com https://, mailto: ou tel: quando aplicável.
4. Se o botão chama a função correta.
5. Se não abre janela em branco.
6. Se o usuário recebe mensagem amigável quando o checkout não está configurado.

Não altere o layout.
Corrija apenas o fluxo do botão.`,
  },
  {
    category: "Acesso",
    severity: "Crítico",
    title: "Comprador pagou, mas não recebeu acesso",
    explanation: "O pagamento aconteceu, mas o acesso não foi liberado.",
    fix: "Verifique se o fluxo é manual ou automático e se existe painel de liberação.",
    command: `O comprador pagou, mas não recebeu acesso.

Verifique:
1. Se o produto usa liberação manual ou automática.
2. Se existe painel admin para liberar acesso.
3. Se o usuário foi criado corretamente.
4. Se a flag de acesso está correta.
5. Se a área restrita lê o acesso do banco.
6. Se a mensagem pós-compra está clara.

Não prometa webhook automático se ele não existe.
Corrija o fluxo atual com segurança.`,
  },
  {
    category: "Banco",
    severity: "Crítico",
    title: "Erro de permissão no Supabase",
    explanation: "O app não consegue ler, criar ou atualizar dados.",
    fix: "Verifique RLS, policies, grants e usuário autenticado.",
    command: `O app está com erro de permissão no Supabase.

Verifique:
1. Se RLS está ativado.
2. Se existem policies corretas.
3. Se o usuário está autenticado.
4. Se a query usa o user_id correto.
5. Se faltam grants para authenticated.
6. Se não há uso indevido de service role no frontend.

Não desative segurança sem explicar o risco.
Corrija com policies adequadas.`,
  },
  {
    category: "Lovable",
    severity: "Médio",
    title: "Lovable mexeu no que já estava pronto",
    explanation: "O Lovable alterou partes que estavam funcionando.",
    fix: "Peça correção cirúrgica e restauração do que foi quebrado.",
    command: `Você alterou partes que já estavam funcionando.

Faça uma correção cirúrgica:
1. Liste o que foi alterado.
2. Identifique o que quebrou.
3. Restaure o comportamento anterior.
4. Preserve layout, autenticação, banco, rotas e progresso.
5. Corrija apenas o problema solicitado.

Não refaça o app.
Não remova funcionalidades.
Não altere módulos não relacionados.`,
  },
  {
    category: "Mobile",
    severity: "Médio",
    title: "Layout quebrou no celular",
    explanation: "No desktop está bom, mas no celular ficou difícil de usar.",
    fix: "Peça ajuste mobile first sem refazer o app.",
    command: `O layout quebrou no celular.

Corrija apenas a experiência mobile:
1. Espaçamentos.
2. Tamanho dos botões.
3. Quebra de texto.
4. Cards muito largos.
5. Menus difíceis.
6. Inputs pequenos.
7. Scroll horizontal indesejado.

Não refaça o design.
Preserve identidade visual e funcionalidades.`,
  },
  {
    category: "Lovable",
    severity: "Leve",
    title: "O prompt não foi entendido",
    explanation: "O Lovable respondeu algo genérico ou fez outra coisa.",
    fix: "Reenvie com contexto, restrições e critérios de aceite.",
    command: `O comando anterior não foi entendido corretamente.

Refaça seguindo exatamente esta estrutura:
1. Objetivo da alteração.
2. O que pode mexer.
3. O que não pode mexer.
4. Arquivos ou áreas relacionadas.
5. Critérios de aceite.
6. QA obrigatório.

Não invente funcionalidades.
Não refaça o app.
Entregue apenas o solicitado.`,
  },
  {
    category: "Créditos",
    severity: "Médio",
    title: "Acabaram os créditos do Lovable",
    explanation: "O Lovable pausou recursos de IA ou pediu top up.",
    fix: "Pare de construir, faça auditoria e só volte com prompts cirúrgicos.",
    command: `Meus créditos do Lovable acabaram ou estão baixos.

Antes de qualquer nova alteração:
1. Faça uma auditoria do estado atual.
2. Liste o que já está pronto.
3. Liste pendências críticas.
4. Priorize apenas o que desbloqueia venda, acesso ou uso.
5. Crie prompts cirúrgicos para economizar créditos.

Não sugira refazer o app.
Não sugira melhorias cosméticas agora.`,
  },
];

// ============ Checklist geral por fases ============

export const CHECKLIST_PHASES: {
  phase: string;
  moduleId?: string;
  moduleLabel?: string;
  items: string[];
}[] = [
  {
    phase: "Fase 1 — Ideia clara",
    moduleId: "comece",
    moduleLabel: "Ir para Comece aqui",
    items: [
      "Escolhi a ideia principal do app",
      "Defini quem vai usar",
      "Defini qual dor o app resolve",
      "Defini a promessa principal",
    ],
  },
  {
    phase: "Fase 2 — MVP construído",
    moduleId: "construir",
    moduleLabel: "Ir para Construir app",
    items: [
      "Gerei o plano do app",
      "Criei a primeira versão no Lovable",
      "Testei o app no celular",
      "Corrigi os erros principais",
    ],
  },
  {
    phase: "Fase 3 — Venda preparada",
    moduleId: "venda",
    moduleLabel: "Ir para Página de venda",
    items: [
      "Criei a landing page",
      "Defini o preço ou próximo passo de compra",
      "Criei o checkout ou caminho de pagamento",
      "Criei a página de obrigado",
    ],
  },
  {
    phase: "Fase 4 — Entrega protegida",
    moduleId: "checkout",
    moduleLabel: "Ir para Checkout e entrega",
    items: [
      "Criei a área de entrega protegida",
      "Criei login ou acesso restrito",
      "Organizei o que o comprador recebe",
      "Testei o acesso como comprador",
    ],
  },
  {
    phase: "Fase 5 — Crescimento iniciado",
    moduleId: "campanhas",
    moduleLabel: "Ir para Campanhas",
    items: [
      "Criei base de SEO",
      "Criei base de GEO",
      "Criei primeira campanha",
      "Criei primeiros criativos",
    ],
  },
  {
    phase: "Fase 6 — Validação com pessoas reais",
    moduleId: "validacao",
    moduleLabel: "Ir para Validação",
    items: [
      "Convidei 10 pessoas reais",
      "Coletei feedback",
      "Separei elogio de sinal real",
      "Melhorei o app com base no feedback",
      "Preparei novo teste ou publicação",
    ],
  },
];

// ============ Dicas de cada módulo ============

export const MODULE_HINTS: Record<ModuleId, { doNow: string; advanceWhen: string }> = {
  fundamentos: {
    doNow: "Leia as cinco aulas curtas para entender o que é o Lovable, como ele pensa e como você vai usar a Fábrica junto com ele.",
    advanceWhen: "Avance quando você tiver lido as cinco aulas e entendido a regra de ouro: um pedido de cada vez.",
  },
  comece: {
    doNow: "Leia a regra de ouro e escolha entre usar uma ideia pronta ou construir a sua.",
    advanceWhen: "Avance quando você souber qual ideia vai construir no Lovable.",
  },
  ideias: {
    doNow: "Escolha um modelo que se pareça com o que você quer criar. Clique em Ver detalhes e copie o comando.",
    advanceWhen: "Avance quando você tiver copiado um comando de ideia e colado no Lovable.",
  },
  planejar: {
    doNow: "Antes de abrir o Lovable, defina problema, público, promessa, ação principal e o que entra na primeira versão.",
    advanceWhen: "Avance quando você tiver um plano claro do seu app, simples e sem excesso, pronto para construir.",
  },
  mvp: {
    doNow: "Transforme o plano em arquitetura: MVP, funcionalidades essenciais, telas, dados e regras principais.",
    advanceWhen: "Avance quando você tiver um prompt de arquitetura claro para começar a construção no Lovable.",
  },
  telas: {
    doNow: "Organize as telas, defina o fluxo do usuário, separe áreas públicas e restritas e defina o CTA principal de cada tela.",
    advanceWhen: "Avance quando você tiver um mapa claro das telas e do caminho do usuário, pronto para construir.",
  },
  construir: {
    doNow: "Comece pelo Comando 1. Copie, cole no Lovable e espere o resultado antes do próximo.",
    advanceWhen: "Não avance se o Lovable ainda não entregou o resultado esperado. Volte, corrija ou use a aba Corrigir erro.",
  },
  login: {
    doNow: "Crie login simples, depois perfil do usuário, depois proteja a área restrita. Teste cada passo antes de avançar.",
    advanceWhen: "Não avance para venda ou checkout antes de testar se o usuário consegue entrar, sair e acessar a área correta.",
  },
  seguranca: {
    doNow: "Revise rotas públicas, área restrita, painel admin, dados do usuário, banco, RLS, chaves secretas e teste tentativas de acesso indevido.",
    advanceWhen: "Avance quando visitante, usuário comum, comprador e admin estiverem vendo apenas o que devem ver.",
  },
  venda: {
    doNow: "Defina a promessa, crie a landing, explique o preço, responda dúvidas e reforce confiança.",
    advanceWhen: "Antes de criar checkout, garanta que a pessoa entende o valor do app em menos de 10 segundos.",
  },
  monetizacao: {
    doNow: "Escolha o modelo de cobrança, defina uma faixa de valor inicial e prepare uma oferta clara para testar com pessoas reais.",
    advanceWhen: "Avance quando você tiver um modelo de cobrança escolhido, uma faixa de valor inicial e uma oferta pronta para validar.",
  },
  checkout: {

    doNow: "Crie pagamento, página de obrigado, área de entrega protegida, libere o acesso e teste como comprador.",
    advanceWhen: "Antes de divulgar, faça o caminho completo como se você fosse o comprador.",
  },
  legal: {
    doNow: "Revise termos, privacidade, suporte, pagamento e entrega. Remova promessas exageradas e deixe links legais acessíveis.",
    advanceWhen: "Avance quando o app tiver termos, privacidade, suporte claros e textos sem promessa irreal.",
  },
  publicar: {
    doNow: "Publique o app, teste o link público, revise domínio, favicon e imagem social, e abra no celular antes de divulgar.",
    advanceWhen: "Avance quando o link público abrir corretamente em navegador, aba anônima e celular, com favicon, título e imagem social revisados.",
  },
  teste: {
    doNow: "Teste como visitante, como usuário logado e no celular. Revise botões, formulários, links, checkout e área de entrega.",
    advanceWhen: "Avance quando o app funcionar bem em desktop e celular, sem scroll horizontal, sem botões quebrados e com fluxo de compra e entrega claros.",
  },
  seo: {
    doNow: "Escolha palavras, crie páginas, responda dúvidas, adicione marcações e revise antes de publicar.",
    advanceWhen: "Não crie páginas vazias. Cada página precisa ajudar uma pessoa real a entender seu app.",
  },
  campanhas: {
    doNow: "Escolha um canal e use o gerador rápido para criar a primeira campanha.",
    advanceWhen: "Avance quando você tiver pelo menos uma campanha pronta para rodar.",
  },
  criativos: {
    doNow: "Use o gerador rápido para criar 3 criativos diferentes no formato escolhido.",
    advanceWhen: "Avance quando você tiver 3 criativos prontos para testar.",
  },
  metricas: {
    doNow: "Defina a ação principal, escolha poucas métricas, mapeie o funil e identifique pontos de abandono.",
    advanceWhen: "Avance quando você souber quais números vai acompanhar e como eles vão orientar as próximas melhorias.",
  },
  validacao: {
    doNow: "Liste 10 pessoas reais que podem testar e copie a mensagem de convite.",
    advanceWhen: "Avance quando pelo menos 5 pessoas testarem e responderem o feedback.",
  },
  melhorias: {
    doNow: "Organize feedbacks, separe bug de melhoria, priorize 5 mudanças e teste a nova versão antes de divulgar.",
    advanceWhen: "Avance quando a nova versão estiver aplicada, testada e registrada, sem quebrar o que já funcionava.",
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

// ============ Comandos do módulo Monetização ============

export const COMMANDS_MONETIZACAO: Command[] = [
  {
    n: 1,
    title: "Entender o valor do app",
    purpose: "A pessoa precisa saber qual dor o app resolve antes de definir preço.",
    when: "Use antes de pensar em qualquer modelo de cobrança ou faixa de valor.",
    where: "Cole no Lovable, no campo de conversa do projeto.",
    result: "Uma seção do app com público, dor, transformação e motivo para pagar.",
    objective:
      "A pessoa precisa saber qual dor o app resolve antes de definir preço.",
    whenLovableDirect:
      "Quando o app já existe e só falta deixar o valor explícito na interface.",
    whenAgentFirst:
      "Quando você ainda não consegue explicar em uma frase por que alguém pagaria pelo app.",
    content: `Crie uma seção no meu app que explique claramente qual dor ele resolve, para quem ele foi feito, qual transformação ele entrega e por que isso tem valor para o usuário. Use linguagem simples e direta.

Inclua:
- Para quem é o app
- Qual dor resolve
- Qual transformação entrega
- Por que isso tem valor

Não use promessa exagerada. Não prometa resultado garantido.`,
    agentPrompt: `Analise meu app e me ajude a identificar o valor real dele. Quero saber qual dor ele resolve, para quem ele é mais útil e por que alguém pagaria por isso.

Considere:
- Público específico
- Dor concreta
- Entrega principal
- Diferença em relação ao que já existe`,
    correctionPrompt: `O Lovable deixou a explicação genérica. Reescreva a seção deixando claro: público, dor, solução, entrega e motivo para pagar. Sem frases vagas, sem promessa de resultado.`,
    advanceCriteria:
      "Avance quando você conseguir explicar em uma frase por que alguém pagaria pelo seu app.",
  },
  {
    n: 2,
    title: "Escolher o modelo de cobrança",
    purpose: "Definir se o app será venda única, assinatura, freemium, beta pago ou licença.",
    when: "Use depois de entender o valor, antes de definir preço.",
    where: "Cole no Lovable depois de conversar com o Agente sobre o modelo.",
    result: "Uma seção interna ou documentação com o modelo principal escolhido.",
    objective:
      "Definir se o app será venda única, assinatura, freemium, beta pago ou licença.",
    whenLovableDirect:
      "Quando você já decidiu o modelo e só falta deixá-lo explícito no app.",
    whenAgentFirst:
      "Quando ainda está em dúvida entre dois ou mais modelos de cobrança.",
    content: `Crie uma seção interna no meu app ou documentação explicando o modelo de cobrança escolhido. Mostre se será venda única, assinatura, freemium, beta pago ou licença, e explique de forma clara o que o usuário recebe.

Inclua:
- Modelo principal
- O que está incluso
- Para quem é
- O que NÃO está incluso

Não misture vários modelos. Escolha um principal.`,
    agentPrompt: `Me ajude a escolher o melhor modelo de cobrança para meu app. Considere: tipo de entrega, frequência de uso, público, suporte, atualização, valor percebido e facilidade de venda.

Sugira um modelo principal e, se fizer sentido, no máximo um modelo futuro. Justifique a escolha.`,
    correctionPrompt: `O Lovable misturou vários modelos de cobrança. Organize em apenas um modelo principal e, no máximo, uma alternativa futura. Deixe claro o que está incluso em cada um.`,
    advanceCriteria:
      "Avance quando você tiver escolhido um modelo principal de cobrança.",
  },
  {
    n: 3,
    title: "Definir valor inicial para teste",
    purpose: "Escolher uma faixa de preço inicial para validar, sem travar por perfeccionismo.",
    when: "Use depois de escolher o modelo de cobrança.",
    where: "Cole no Lovable depois de definir a faixa com o Agente.",
    result: "Uma seção de oferta com valor inicial, o que está incluso e CTA claro.",
    objective:
      "Escolher uma faixa de preço inicial para validar, sem travar por perfeccionismo.",
    whenLovableDirect:
      "Quando você já tem a faixa decidida e só falta criar a seção de oferta.",
    whenAgentFirst:
      "Quando você não tem ideia de quanto cobrar ou tem medo de errar o valor.",
    content: `Crie uma seção de oferta com um valor inicial de teste para meu app. A seção deve mostrar o que está incluso, para quem é, o que a pessoa recebe e um botão de ação claro. Não prometa resultado garantido.

Inclua:
- Valor inicial de teste
- O que está incluso
- Para quem é
- Botão de ação

Use linguagem honesta. Sem promessa de lucro, sem garantia de resultado.`,
    agentPrompt: `Com base no meu app, me ajude a definir uma faixa de preço inicial para testar. Quero uma recomendação para venda única, assinatura ou beta pago, com justificativa e riscos.

Considere: público, dor resolvida, frequência de uso, suporte, valor percebido e concorrentes. Sugira uma faixa, não um número único.`,
    correctionPrompt: `O Lovable criou uma promessa exagerada ou preço sem justificativa. Ajuste para uma oferta honesta, com valor inicial de teste e sem garantia de resultado.`,
    advanceCriteria:
      "Avance quando você tiver uma faixa de valor clara para testar com pessoas reais.",
  },
  {
    n: 4,
    title: "Criar planos ou oferta única",
    purpose: "Decidir se o app terá um único valor ou planos diferentes.",
    when: "Use depois de definir a faixa de valor inicial.",
    where: "Cole no Lovable na página de venda ou de planos.",
    result: "Uma oferta única clara ou no máximo 3 planos diferentes.",
    objective:
      "Decidir se o app terá um único valor ou planos diferentes.",
    whenLovableDirect:
      "Quando você já sabe se vai usar oferta única ou planos.",
    whenAgentFirst:
      "Quando você não sabe se faz mais sentido vender em um único plano ou criar opções.",
    content: `Crie uma seção de planos para meu app. Se fizer sentido, crie até 3 opções: Básico, Completo e Premium. Se não fizer sentido ter planos, crie uma oferta única clara. Explique o que cada opção inclui.

Inclua em cada opção:
- Nome do plano
- O que está incluso
- Para quem é
- Valor

Mantenha simples. Máximo 3 planos.`,
    agentPrompt: `Meu app deve ter oferta única ou planos? Analise com base no público, complexidade, suporte, entrega e facilidade de venda.

Se recomendar planos, sugira no máximo 3 opções com nome, público e o que cada uma inclui.`,
    correctionPrompt: `O Lovable criou planos demais. Simplifique para uma oferta única ou no máximo 3 planos claros. Cada um precisa ter público e entrega diferentes.`,
    advanceCriteria:
      "Avance quando a pessoa conseguir entender rapidamente o que compra e o que recebe.",
  },
  {
    n: 5,
    title: "Validar se o preço faz sentido",
    purpose: "Testar o valor com pessoas reais antes de escalar.",
    when: "Use antes de divulgar o app em campanhas pagas.",
    where: "Cole no Lovable na página de oferta ou de validação.",
    result: "Uma página ou bloco de validação com CTA, perguntas e lista de espera.",
    objective:
      "Testar o valor com pessoas reais antes de escalar.",
    whenLovableDirect:
      "Quando a oferta já está pronta e só falta o bloco de teste e feedback.",
    whenAgentFirst:
      "Quando você não sabe como abordar pessoas reais para testar o preço.",
    content: `Crie uma página ou bloco de validação para testar o preço do meu app. Inclua CTA, perguntas de interesse, campo para feedback e uma mensagem clara para quem quiser comprar ou entrar na lista de espera.

Inclua:
- Apresentação curta da oferta
- CTA principal
- 3 a 5 perguntas curtas
- Campo de feedback
- Lista de espera`,
    agentPrompt: `Crie um plano simples para validar o preço do meu app com 10 pessoas reais. Quero perguntas, mensagens de abordagem e critérios para saber se o preço está alto, baixo ou confuso.

Inclua:
- Como abordar
- Que perguntas fazer
- O que observar
- Quando ajustar o valor`,
    correctionPrompt: `O Lovable criou uma validação genérica. Ajuste para testar especificamente se as pessoas entenderam o valor e se pagariam pela oferta. Inclua perguntas sobre preço, clareza e interesse real.`,
    advanceCriteria:
      "Avance quando pelo menos 10 pessoas tiverem visto a oferta ou quando você tiver feedback suficiente para ajustar o valor.",
  },
];
