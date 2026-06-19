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
  {
    n: 1,
    title: "Transformar ideia em plano",
    purpose: "Serve para o Lovable entender sua ideia antes de construir.",
    when: "Use primeiro, antes de pedir telas ou banco.",
    where: "Cole no Lovable, no campo de conversa do projeto.",
    result: "Um plano com MVP, telas, fluxo e estrutura.",
    objective:
      "Transformar uma ideia solta em plano com público, dor, MVP, fluxo e estrutura.",
    whenLovableDirect: "Quando o usuário já sabe a ideia, público e problema.",
    whenAgentFirst:
      "Quando a ideia ainda está confusa, ampla demais ou sem monetização clara.",
    content: `Você é um especialista em produto digital, UX e Lovable.

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
6. Fluxo do usuário
7. Estrutura das telas
8. Banco de dados necessário
9. Riscos técnicos
10. Primeiro prompt de construção

Não escreva código ainda.
Não crie telas ainda.
Primeiro entregue o plano.`,
    agentPrompt: `Quero criar um aplicativo, mas antes preciso validar a ideia.

Ideia:
[descreva sua ideia]

Público:
[quem vai usar]

Como pretendo monetizar:
[assinatura, venda única, freemium, serviço, não sei]

Analise como Arquiteto de Aplicativos.

Quero:
1. Veredito sincero
2. Se essa ideia vende ou não
3. Qual deve ser o MVP
4. Quais funções cortar
5. Como construir no Lovable
6. Qual prompt final devo colar no Lovable.`,
    correctionPrompt: `O plano ficou genérico. Refaça com mais precisão.

Não aumente o escopo.
Corte tudo que não for essencial.
Mantenha o MVP com no máximo 5 funcionalidades.
Explique:
1. Ação principal do usuário
2. Fluxo real em até 5 passos
3. Funcionalidades essenciais
4. O que fica fora
5. Primeiro comando de construção.`,
    advanceCriteria:
      "Avance apenas quando tiver nome do app, público, promessa, MVP com até 5 funções e fluxo principal.",
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
    advanceWhen: "Não avance se o Lovable ainda não entregou o resultado esperado. Volte, corrija ou use a aba Corrigir erro.",
  },
  login: {
    doNow: "Crie login simples, depois perfil do usuário, depois proteja a área restrita. Teste cada passo antes de avançar.",
    advanceWhen: "Não avance para venda ou checkout antes de testar se o usuário consegue entrar, sair e acessar a área correta.",
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
