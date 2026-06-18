import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut,
  ExternalLink,
  Copy,
  Check,
  LifeBuoy,
  Lock,
  Loader2,
  ShieldCheck,
  Gift,
  Sparkles,
  
  ListChecks,
  Smartphone,
  Lightbulb,
  Library,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { GiftCodeRedemption } from "@/components/GiftCodeRedemption";
import { clearSession } from "@/lib/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";

// ===================== Conteúdo =====================

const LOVABLE_URL = "https://lovable.dev";
const STORAGE_PROGRESS = "fabrica_apps_progress_v4";
const STORAGE_STEPS = "fabrica_apps_steps_v2";

type Command = {
  n: number;
  title: string;
  purpose: string;
  when: string;
  where: string;
  result: string;
  content: string;
};

const commands: Command[] = [
  {
    n: 1,
    title: "Transformar a ideia em plano",
    purpose: "Serve para o Lovable entender sua ideia e organizar o app antes de construir.",
    when: "Use primeiro, antes de pedir telas ou banco.",
    where: "Cole no Lovable, no campo de conversa do projeto.",
    result: "O Lovable deve responder com um plano claro: MVP, telas, fluxo e estrutura.",
    content: `Você é um especialista em produto digital, UX e Lovable.

Quero criar um app no Lovable.

Minha ideia é:
[descreva aqui sua ideia]

Quem vai usar:
[descreva o público]

Problema que resolve:
[descreva a dor]

Como pretendo ganhar dinheiro:
[assinatura, pagamento único, comissão, anúncios ou ainda não sei]

Antes de construir, crie um plano simples e completo com:
1. Veredito estratégico
2. Problema real
3. Usuário principal
4. Ação principal
5. MVP com no máximo 5 funcionalidades
6. O que cortar agora
7. Fluxo em até 5 etapas
8. Telas necessárias
9. Banco de dados necessário
10. Design recomendado
11. Monetização
12. Riscos principais
13. Ordem de construção no Lovable

Regras:
- Não criar produto inchado.
- Não passar de 5 funcionalidades no MVP.
- Explicar de forma simples.
- Pensar mobile first.`,
  },
  {
    n: 2,
    title: "Construir primeira versão",
    purpose: "Serve para pedir ao Lovable que comece a construir o app.",
    when: "Use depois que o Lovable gerar o plano.",
    where: "Cole no mesmo projeto do Lovable.",
    result: "O Lovable deve criar as primeiras telas e o fluxo principal.",
    content: `Agora construa a primeira versão do app com base neste plano:

[cole aqui o plano gerado no Comando 1]

Crie:
1. Páginas principais
2. Componentes básicos
3. Fluxo principal
4. Botões importantes
5. Estados vazios
6. Estados de erro
7. Estados de sucesso

Regras:
- Criar só o MVP.
- Interface simples.
- Mobile first.
- Não adicionar funcionalidades extras.
- Usuário precisa entender sem tutorial.`,
  },
  {
    n: 3,
    title: "Adicionar login e cadastro",
    purpose: "Serve para o app ter usuários e proteger páginas privadas.",
    when: "Use quando o app já tem telas e precisa de área restrita.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar telas de entrar, criar conta e proteger rotas.",
    content: `Adicione login e cadastro ao app.

Regras:
1. Criar tela de entrar
2. Criar tela de criar conta
3. Criar recuperação de acesso
4. Proteger páginas privadas
5. Mostrar mensagens claras
6. Redirecionar usuário logado para a área correta
7. Não expor chaves sensíveis
8. Usar Supabase Auth se o projeto já estiver com Supabase

Explique o que foi criado e o que devo testar.`,
  },
  {
    n: 4,
    title: "Criar banco de dados",
    purpose: "Serve para o app salvar informações de cada usuário.",
    when: "Use quando o app precisa guardar dados (clientes, pedidos, tarefas etc).",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar tabelas, relações e regras de acesso.",
    content: `Crie o banco de dados necessário para este app.

Contexto:
[explique o app]

O app precisa salvar:
[explique os dados]

Crie:
1. Tabelas necessárias
2. Campos de cada tabela
3. Relações entre tabelas
4. Regras de acesso
5. Políticas RLS, se usar Supabase
6. Dados de exemplo
7. Estados de erro e sucesso

Regras:
- Cada usuário só vê seus próprios dados quando fizer sentido.
- Não criar tabelas desnecessárias.
- Manter simples.
- Não usar service role no frontend.`,
  },
  {
    n: 5,
    title: "Criar dashboard",
    purpose: "Serve para o usuário ter uma tela inicial clara depois do login.",
    when: "Use depois que login e banco estiverem prontos.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma tela inicial com resumo e próxima ação.",
    content: `Crie um dashboard simples para o usuário.

O dashboard deve mostrar:
1. Resumo principal
2. Próxima ação recomendada
3. Lista dos itens mais importantes
4. Botão para criar novo item
5. Estado vazio explicando o que fazer
6. Layout mobile first

Regras:
- Não colocar informação demais.
- O usuário deve entender o próximo passo em 5 segundos.`,
  },
  {
    n: 6,
    title: "Melhorar design",
    purpose: "Serve para deixar o app bonito, claro e fácil de usar.",
    when: "Use depois que o app já tem telas principais.",
    where: "Cole no Lovable.",
    result: "O Lovable deve melhorar cores, espaçamento, botões e mobile.",
    content: `Melhore o design do app.

Objetivo:
Deixar o app bonito, claro, moderno e fácil de usar no celular.

Ajuste:
1. Cores
2. Espaçamento
3. Botões
4. Cards
5. Títulos
6. Ícones
7. Navegação
8. Contraste
9. Estados vazios
10. Mensagens

Regras:
- Não mudar a lógica.
- Não adicionar funcionalidades.
- Só melhorar visual e experiência.`,
  },
  {
    n: 7,
    title: "Criar landing page",
    purpose: "Serve para apresentar e vender o app para visitantes.",
    when: "Use quando o app já tem MVP e promessa clara.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma página pública completa.",
    content: `Crie uma landing page para vender ou apresentar este app.

App:
[descreva o app]

Público:
[descreva o público]

Problema:
[descreva a dor]

Promessa:
[descreva o resultado]

Preço:
[informe ou escreva ainda não definido]

A página deve ter:
1. Hero
2. Subheadline
3. CTA
4. Dor
5. Solução
6. Como funciona
7. Benefícios
8. O que está incluso
9. Preço
10. FAQ
11. CTA final

Regras:
- Mobile first.
- Texto claro.
- Sem promessa exagerada.
- Sem dizer que dinheiro é garantido.`,
  },
  {
    n: 8,
    title: "Criar página de preço",
    purpose: "Serve para mostrar planos e o que está incluso.",
    when: "Use depois que a landing page existir.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma seção ou página de preço com CTA.",
    content: `Crie uma página ou seção de preço para este produto.

Produto:
[descreva]

Preço:
[informe]

Entregue:
1. Card de preço
2. Lista do que está incluso
3. Lista do que não está incluso
4. Garantia, se houver
5. Perguntas frequentes
6. CTA de compra
7. Texto de segurança
8. O que acontece após o pagamento`,
  },
  {
    n: 9,
    title: "Criar checkout e obrigado",
    purpose: "Serve para organizar a compra e o que acontece depois.",
    when: "Use quando o produto for vendido.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar fluxo de compra e página de obrigado.",
    content: `Crie o fluxo de compra e pós-compra.

Crie:
1. Botão de compra
2. Página de checkout ou integração com checkout externo
3. Página de obrigado
4. Instruções pós-compra
5. Link para área restrita
6. Aviso para verificar e-mail, spam e promoções
7. Link de suporte

Regras:
- O comprador não pode ficar perdido.
- Não mostrar materiais protegidos sem acesso.
- Manter simples.`,
  },
  {
    n: 10,
    title: "Criar área de entrega",
    purpose: "Serve para entregar materiais ao comprador.",
    when: "Use quando o produto precisa de uma área exclusiva.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma área protegida e organizada.",
    content: `Crie uma área de entrega protegida para compradores.

A área deve mostrar:
1. Boas-vindas
2. O que o usuário comprou
3. Como usar
4. Materiais ou funcionalidades
5. Botões claros
6. Checklist de progresso
7. Suporte
8. Mensagem para quem ainda não tem acesso

Regras:
- Usuário sem login não acessa.
- Usuário sem acesso não vê materiais.
- Usuário com acesso entende em 10 segundos.
- Não mostrar preço dentro da entrega.
- Não parecer landing page.`,
  },
  {
    n: 11,
    title: "Criar painel admin",
    purpose: "Serve para o dono liberar ou revogar acesso.",
    when: "Use quando você precisa controlar quem acessa.",
    where: "Cole no Lovable.",
    result: "O Lovable deve criar uma tela admin protegida.",
    content: `Crie um painel admin simples.

O admin deve conseguir:
1. Buscar usuário por e-mail
2. Ver status de acesso
3. Liberar acesso
4. Revogar acesso
5. Ver data de criação
6. Ver origem do acesso

Regras:
- Só admin acessa.
- Usuário comum não acessa.
- Não expor service role no frontend.
- Mostrar mensagens claras.`,
  },
  {
    n: 12,
    title: "Testar tudo",
    purpose: "Serve para revisar o app antes de mostrar a alguém.",
    when: "Use antes de publicar.",
    where: "Cole no Lovable.",
    result: "O Lovable deve revisar fluxo, mobile, erros, páginas e segurança.",
    content: `Faça uma revisão completa do app.

Teste:
1. Página inicial
2. Login
3. Cadastro
4. Recuperação de acesso
5. Área protegida
6. Banco de dados
7. Botões
8. Mobile
9. Admin
10. Estados de erro
11. Estados de sucesso
12. Links

Entregue:
1. Problemas encontrados
2. Correções aplicadas
3. O que eu devo testar manualmente
4. Checklist final`,
  },
  {
    n: 13,
    title: "Publicar",
    purpose: "Serve para preparar o app para o mundo real.",
    when: "Use depois de testar tudo.",
    where: "Cole no Lovable antes do deploy.",
    result: "O Lovable deve revisar publicação, SEO básico e segurança.",
    content: `Prepare o app para publicação.

Verifique:
1. Nome do app
2. Logo
3. Páginas públicas
4. Páginas protegidas
5. Links
6. SEO básico
7. Mobile
8. Segurança básica
9. Dados de teste removidos
10. Fluxo principal funcionando

Depois entregue:
1. Checklist antes de publicar
2. O que testar depois do deploy
3. O que não esquecer`,
  },
  {
    n: 14,
    title: "Validar com 10 usuários",
    purpose: "Serve para testar com pessoas reais antes de escalar.",
    when: "Use depois que o app estiver publicado ou pronto para testar.",
    where: "Use como guia ou cole no Lovable para gerar formulário.",
    result: "Um plano simples para validar com 10 usuários reais.",
    content: `Crie um plano para validar este app com 10 usuários reais.

App:
[descreva]

Público:
[descreva]

Entregue:
1. Quem chamar
2. Onde encontrar essas pessoas
3. Mensagem de convite
4. Tarefas para elas fazerem
5. Perguntas de feedback
6. Métrica principal
7. Critério para continuar
8. Critério para ajustar
9. Critério para abandonar
10. Próximas melhorias`,
  },
];

// ============== Modelos de apps prontos ==============

type Template = {
  name: string;
  audience: string;
  pain: string;
  mvp: string[];
  monetization: string;
  screens: string[];
  db: string[];
  command: string;
  checklist?: string[];
};

const templates: Template[] = [
  {
    name: "AgendaPro Local",
    audience:
      "Barbeiros, manicures, esteticistas, personal trainers e pequenos prestadores de serviço.",
    pain: "Eles perdem horários, esquecem clientes e dependem de mensagens soltas no WhatsApp.",
    mvp: [
      "Cadastro de serviços",
      "Agenda de horários",
      "Cadastro de clientes",
      "Confirmação de agendamento",
      "Painel do profissional",
    ],
    monetization: "Mensalidade de R$29 a R$59 por profissional.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Serviços",
      "Agenda",
      "Clientes",
      "Página pública de agendamento",
    ],
    db: ["users", "services", "clients", "appointments"],
    checklist: [
      "Consegue criar serviço?",
      "Consegue criar cliente?",
      "Consegue criar agendamento?",
      "Agenda aparece corretamente?",
      "Usuário só vê seus dados?",
    ],
    command: `Crie um app chamado AgendaPro Local.

Objetivo:
Ajudar pequenos prestadores de serviço a organizar agenda, clientes e horários.

Público:
Barbeiros, manicures, esteticistas, personal trainers e profissionais autônomos.

Problema:
Eles recebem agendamentos pelo WhatsApp e se perdem com horários, cancelamentos e clientes.

MVP obrigatório:
1. Cadastro e login do profissional
2. Cadastro de serviços com nome, duração e preço
3. Cadastro de clientes
4. Agenda com horários
5. Página simples para criar agendamento

Telas:
1. Landing page pública
2. Login e cadastro
3. Dashboard com resumo do dia
4. Tela de serviços
5. Tela de clientes
6. Tela de agenda
7. Tela pública para agendar

Banco de dados:
Crie tabelas:
- profiles
- services
- clients
- appointments

Regras:
- Cada usuário só vê seus próprios serviços, clientes e agendamentos.
- O app deve ser mobile first.
- O fluxo deve ser simples.
- Não adicionar funcionalidades fora do MVP.
- Criar estados de vazio, erro e sucesso.
- Criar botões claros.
- Criar design moderno com fundo claro ou escuro, mas limpo.

Monetização:
Preparar estrutura para plano gratuito limitado e plano pago mensal.

Resultado esperado:
Um MVP funcional para testar com 10 prestadores de serviço.`,
  },
  {
    name: "CardápioZap",
    audience: "Lanchonetes, marmitarias, pizzarias pequenas e restaurantes locais.",
    pain: "Pedidos chegam bagunçados no WhatsApp e o dono se perde.",
    mvp: [
      "Cadastro de produtos",
      "Cardápio público",
      "Carrinho simples",
      "Envio do pedido para WhatsApp",
      "Painel de pedidos",
    ],
    monetization: "Mensalidade de R$39 a R$99 por estabelecimento.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Produtos",
      "Cardápio público",
      "Pedido",
      "Configurações do WhatsApp",
    ],
    db: ["restaurants", "products", "orders", "order_items"],
    command: `Crie um app chamado CardápioZap.

Objetivo:
Ajudar pequenos restaurantes a receber pedidos de forma organizada e enviar o pedido final para o WhatsApp.

Público:
Marmitarias, lanchonetes, pizzarias pequenas e restaurantes locais.

Problema:
O restaurante recebe pedidos soltos no WhatsApp e se perde com produtos, quantidades e entrega.

MVP obrigatório:
1. Login do dono do restaurante
2. Cadastro de produtos com nome, descrição, preço e imagem
3. Cardápio público com lista de produtos
4. Carrinho simples
5. Botão para enviar pedido formatado para WhatsApp

Telas:
1. Landing page
2. Login e cadastro
3. Dashboard
4. Produtos
5. Configurações do restaurante
6. Cardápio público
7. Carrinho

Banco de dados:
Crie tabelas:
- profiles
- restaurants
- products
- orders
- order_items

Regras:
- Cada restaurante só vê seus próprios produtos.
- O cardápio público deve funcionar sem login.
- O pedido deve ser enviado para o WhatsApp com texto organizado.
- Não criar pagamento online no MVP.
- Não criar delivery avançado no MVP.
- Priorizar simplicidade.

Resultado esperado:
Um cardápio online simples para testar com restaurantes reais.`,
  },
  {
    name: "ControleMEI",
    audience: "MEIs, freelancers e autônomos.",
    pain: "Eles não sabem quanto ganharam, quanto gastaram e se estão tendo lucro.",
    mvp: [
      "Registro de entradas",
      "Registro de despesas",
      "Resumo mensal",
      "Categorias",
      "Relatório simples",
    ],
    monetization: "Mensalidade de R$19 a R$39 ou pagamento único.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard financeiro",
      "Entradas",
      "Despesas",
      "Relatório mensal",
    ],
    db: ["profiles", "incomes", "expenses", "categories"],
    command: `Crie um app chamado ControleMEI.

Objetivo:
Ajudar MEIs, freelancers e autônomos a controlar dinheiro de forma simples.

Público:
Pessoas que trabalham por conta própria e precisam saber quanto ganham e gastam.

Problema:
Elas misturam dinheiro pessoal com dinheiro do trabalho e não sabem se estão tendo lucro.

MVP obrigatório:
1. Login do usuário
2. Cadastro de entradas de dinheiro
3. Cadastro de despesas
4. Dashboard com saldo do mês
5. Relatório mensal simples

Telas:
1. Landing page
2. Login e cadastro
3. Dashboard
4. Entradas
5. Despesas
6. Categorias
7. Relatório mensal

Banco:
Crie tabelas:
- profiles
- incomes
- expenses
- categories

Regras:
- Cada usuário só vê seus próprios lançamentos.
- Interface muito simples.
- Mostrar total de entradas, total de despesas e saldo.
- Usar gráficos simples apenas se não complicar.
- Mobile first.
- Não criar integração bancária no MVP.

Resultado esperado:
Um controle financeiro simples para validar com 10 autônomos.`,
  },
  {
    name: "TreinoSimples",
    audience: "Personal trainers e alunos.",
    pain: "Treinos são enviados em PDF ou WhatsApp e o aluno se perde.",
    mvp: [
      "Cadastro de alunos",
      "Cadastro de treinos",
      "Exercícios por treino",
      "Marcar treino como feito",
      "Painel do personal",
    ],
    monetization: "Mensalidade para personal trainers.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Alunos",
      "Treinos",
      "Exercícios",
      "Área do aluno",
    ],
    db: ["profiles", "students", "workouts", "exercises", "workout_logs"],
    command: `Crie um app chamado TreinoSimples.

Objetivo:
Ajudar personal trainers a enviar treinos organizados para seus alunos.

Público:
Personal trainers que atendem alunos presencialmente ou online.

Problema:
Os treinos ficam espalhados em PDF, planilhas e WhatsApp.

MVP obrigatório:
1. Login do personal
2. Cadastro de alunos
3. Criação de treinos
4. Adição de exercícios ao treino
5. Área do aluno para ver treino e marcar como feito

Telas:
1. Landing page
2. Login
3. Dashboard do personal
4. Alunos
5. Treinos
6. Exercícios
7. Área do aluno

Banco:
Crie tabelas:
- profiles
- students
- workouts
- exercises
- workout_logs

Regras:
- Personal só vê seus próprios alunos.
- Aluno só vê seus próprios treinos.
- Interface mobile first.
- Não criar vídeo, pagamento ou chat no MVP.
- Manter simples e rápido.

Resultado esperado:
Um MVP para testar com 3 personal trainers e 10 alunos.`,
  },
  {
    name: "Imobiliária Fácil",
    audience: "Corretores autônomos e pequenas imobiliárias.",
    pain: "Imóveis e contatos ficam espalhados em WhatsApp, planilhas e fotos.",
    mvp: [
      "Cadastro de imóveis",
      "Galeria de fotos",
      "Lista pública",
      "Captura de interessados",
      "Painel de leads",
    ],
    monetization: "Mensalidade por corretor.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Imóveis",
      "Página pública do imóvel",
      "Leads",
    ],
    db: ["profiles", "properties", "property_images", "leads"],
    command: `Crie um app chamado Imobiliária Fácil.

Objetivo:
Ajudar corretores a organizar imóveis e captar interessados.

Público:
Corretores autônomos e pequenas imobiliárias.

Problema:
Os imóveis ficam espalhados em grupos, fotos e mensagens.

MVP obrigatório:
1. Login do corretor
2. Cadastro de imóveis
3. Upload ou cadastro de fotos
4. Página pública do imóvel
5. Formulário de interesse

Telas:
1. Landing page
2. Login
3. Dashboard
4. Imóveis
5. Detalhe do imóvel
6. Leads interessados

Banco:
Crie tabelas:
- profiles
- properties
- property_images
- leads

Regras:
- Corretor só gerencia seus próprios imóveis.
- Página pública pode ser vista sem login.
- Lead deve ser salvo para o corretor.
- Não criar contrato, assinatura digital ou financiamento no MVP.
- Foco em captação simples.`,
  },
  {
    name: "Escola de Reforço Online",
    audience: "Professores particulares e pequenas escolas de reforço.",
    pain: "Eles têm alunos, aulas e pagamentos desorganizados.",
    mvp: [
      "Cadastro de alunos",
      "Cadastro de aulas",
      "Agenda",
      "Materiais",
      "Controle simples de pagamento",
    ],
    monetization: "Mensalidade para professores.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Alunos",
      "Aulas",
      "Materiais",
      "Pagamentos",
    ],
    db: ["profiles", "students", "classes", "materials", "payments"],
    command: `Crie um app chamado Escola de Reforço Online.

Objetivo:
Ajudar professores particulares a organizar alunos, aulas, materiais e pagamentos simples.

Público:
Professores de reforço, professores de idiomas e pequenas escolas.

Problema:
Eles controlam tudo por WhatsApp e planilha.

MVP obrigatório:
1. Login do professor
2. Cadastro de alunos
3. Agenda de aulas
4. Upload ou cadastro de materiais
5. Controle simples de pagamento pago/pendente

Telas:
1. Landing page
2. Login
3. Dashboard
4. Alunos
5. Aulas
6. Materiais
7. Pagamentos

Banco:
Crie tabelas:
- profiles
- students
- classes
- materials
- payments

Regras:
- Professor só vê seus próprios alunos.
- Aluno pode ter área simples, se não complicar.
- Não criar videoconferência no MVP.
- Mobile first.`,
  },
  {
    name: "PetAgenda",
    audience: "Pet shops, banho e tosa e veterinários pequenos.",
    pain: "Agendamentos de pets ficam bagunçados.",
    mvp: [
      "Cadastro de pets",
      "Cadastro de tutores",
      "Agenda",
      "Serviços",
      "Histórico do pet",
    ],
    monetization: "Mensalidade para pet shops.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Tutores",
      "Pets",
      "Serviços",
      "Agenda",
    ],
    db: ["profiles", "owners", "pets", "services", "appointments"],
    command: `Crie um app chamado PetAgenda.

Objetivo:
Ajudar pet shops e banho e tosa a organizar pets, tutores, serviços e agendamentos.

Público:
Pequenos pet shops e profissionais de banho e tosa.

Problema:
Eles se perdem com horários, nomes dos pets e serviços pedidos.

MVP obrigatório:
1. Login do estabelecimento
2. Cadastro de tutores
3. Cadastro de pets
4. Cadastro de serviços
5. Agenda de atendimentos

Telas:
1. Landing page
2. Login
3. Dashboard
4. Tutores
5. Pets
6. Serviços
7. Agenda

Banco:
Crie tabelas:
- profiles
- owners
- pets
- services
- appointments

Regras:
- Cada estabelecimento só vê seus próprios dados.
- Mostrar histórico simples do pet.
- Não criar prontuário veterinário completo no MVP.
- Interface simples.`,
  },
  {
    name: "Lista de Espera Inteligente",
    audience: "Infoprodutores, creators e negócios que querem validar uma ideia antes de criar.",
    pain: "Eles lançam produtos sem saber se alguém quer.",
    mvp: [
      "Página de captura",
      "Formulário de interesse",
      "Lista de leads",
      "Perguntas de validação",
      "Dashboard de interesse",
    ],
    monetization: "Pagamento único ou assinatura para creators.",
    screens: [
      "Landing page do app",
      "Criar campanha",
      "Página pública da campanha",
      "Dashboard de leads",
      "Respostas de validação",
    ],
    db: ["profiles", "campaigns", "leads", "validation_answers"],
    command: `Crie um app chamado Lista de Espera Inteligente.

Objetivo:
Ajudar creators e empreendedores a validar ideias antes de criar o produto.

Público:
Infoprodutores, creators, freelancers e pequenos negócios.

Problema:
Eles criam produtos sem saber se existe interesse real.

MVP obrigatório:
1. Página pública da ideia
2. Formulário para entrar na lista de espera
3. Perguntas de validação
4. Dashboard com leads
5. Exportação simples ou visualização dos inscritos

Telas:
1. Landing page do app
2. Criar campanha
3. Página pública da campanha
4. Dashboard de leads
5. Respostas de validação

Banco:
Crie tabelas:
- profiles
- campaigns
- leads
- validation_answers

Regras:
- Usuário só vê suas próprias campanhas.
- Página pública funciona sem login.
- Não criar automação de e-mail no MVP.
- Foco em validar demanda.`,
  },
  {
    name: "OrçaFácil",
    audience: "Prestadores de serviço que enviam orçamento pelo WhatsApp.",
    pain: "Orçamentos se perdem e parecem pouco profissionais.",
    mvp: [
      "Cadastro de cliente",
      "Criar orçamento",
      "Itens do orçamento",
      "Link público do orçamento",
      "Status aprovado/pendente",
    ],
    monetization: "Mensalidade ou pagamento único.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Clientes",
      "Orçamentos",
      "Detalhe público do orçamento",
    ],
    db: ["profiles", "clients", "quotes", "quote_items"],
    command: `Crie um app chamado OrçaFácil.

Objetivo:
Ajudar prestadores de serviço a criar orçamentos profissionais rapidamente.

Público:
Eletricistas, pedreiros, designers, freelancers, marceneiros e prestadores em geral.

Problema:
Orçamentos enviados por mensagem ficam confusos e pouco profissionais.

MVP obrigatório:
1. Login do profissional
2. Cadastro de clientes
3. Criação de orçamento
4. Itens com descrição, quantidade e valor
5. Link público do orçamento

Telas:
1. Landing page
2. Login
3. Dashboard
4. Clientes
5. Orçamentos
6. Detalhe público do orçamento

Banco:
Crie tabelas:
- profiles
- clients
- quotes
- quote_items

Regras:
- Profissional só vê seus próprios orçamentos.
- Link público pode ser visto pelo cliente.
- Não criar assinatura digital no MVP.
- Design profissional e simples.`,
  },
  {
    name: "Mini CRM WhatsApp",
    audience: "Pequenos vendedores e autônomos.",
    pain: "Eles esquecem de responder leads e perdem vendas.",
    mvp: [
      "Cadastro de leads",
      "Status do lead",
      "Observações",
      "Próximo contato",
      "Dashboard de oportunidades",
    ],
    monetization: "Mensalidade de R$29 a R$79.",
    screens: [
      "Landing page",
      "Login",
      "Dashboard",
      "Leads",
      "Detalhe do lead",
      "Tarefas de follow-up",
    ],
    db: ["profiles", "leads", "lead_notes", "follow_ups"],
    command: `Crie um app chamado Mini CRM WhatsApp.

Objetivo:
Ajudar pequenos vendedores a organizar leads e follow-ups.

Público:
Autônomos, consultores, vendedores locais e pequenos negócios.

Problema:
Leads ficam perdidos no WhatsApp e o vendedor esquece de dar retorno.

MVP obrigatório:
1. Login do usuário
2. Cadastro de leads
3. Status do lead
4. Anotações
5. Próxima data de contato

Telas:
1. Landing page
2. Login
3. Dashboard
4. Leads
5. Detalhe do lead
6. Tarefas de follow-up

Banco:
Crie tabelas:
- profiles
- leads
- lead_notes
- follow_ups

Regras:
- Usuário só vê seus próprios leads.
- Não criar integração com WhatsApp no MVP.
- Criar botão para abrir conversa no WhatsApp com número cadastrado.
- Interface simples.`,
  },
];

const progressItems = [
  "Escolhi minha ideia",
  "Copiei o Comando 1",
  "Colei no Lovable",
  "Recebi o plano",
  "Usei o Comando 2",
  "Criei primeira versão",
  "Adicionei login",
  "Criei banco de dados",
  "Testei no celular",
  "Criei landing page",
  "Criei entrega",
  "Criei admin",
  "Testei tudo",
  "Publiquei",
  "Mostrei para 10 pessoas",
  "Corrigi com feedback",
];

const commonErrors = [
  {
    title: "Lovable criou coisa demais",
    fix: "Use o comando de correção e peça para voltar ao MVP com no máximo 5 funcionalidades.",
  },
  {
    title: "Não sei o que escrever na ideia",
    fix: "Escreva do jeito simples. Exemplo: quero um app para restaurantes organizarem pedidos.",
  },
  {
    title: "Login não funciona",
    fix: "Use o comando de teste de login e peça para revisar Supabase Auth.",
  },
  {
    title: "Banco não salva",
    fix: "Peça ao Lovable para revisar tabelas, policies e conexão.",
  },
  {
    title: "Ficou feio no celular",
    fix: "Use o comando de melhorar design mobile.",
  },
  {
    title: "Não sei se devo lançar",
    fix: "Use o comando de validação com 10 usuários.",
  },
];

// ===================== Helpers =====================

function copyText(text: string, label: string) {
  return navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copiado. Agora cole no Lovable.`))
    .catch(() => toast.error("Não foi possível copiar."));
}

function CommandCard({
  cmd,
  done,
  onToggle,
}: {
  cmd: Command;
  done: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyText(cmd.content, `Comando ${cmd.n}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <GlassCard id={`cmd-${cmd.n}`} className="p-6 space-y-4 scroll-mt-24">

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent font-heading font-bold flex items-center justify-center">
          {cmd.n}
        </div>
        <h3 className="font-heading font-semibold text-lg leading-snug">
          Comando {cmd.n} — {cmd.title}
        </h3>
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          ["Para que serve", cmd.purpose],
          ["Quando usar", cmd.when],
          ["Onde colar", cmd.where],
          ["Resultado esperado", cmd.result],
        ].map(([label, text]) => (
          <div key={label} className="rounded-lg bg-white/5 border border-white/10 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
              {label}
            </dt>
            <dd className="text-foreground/85 text-[13px] leading-snug">{text}</dd>
          </div>
        ))}
      </dl>

      <details className="group" open>
        <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-muted-foreground/80 hover:text-accent transition select-none">
          Ver o comando
        </summary>
        <pre className="mt-2 text-[13px] text-foreground/85 whitespace-pre-wrap font-sans leading-6 bg-background/40 border border-white/5 rounded-lg p-3 max-h-80 overflow-y-auto">
{cmd.content}
        </pre>
      </details>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-white/5">
        <button onClick={copy} className="btn-primary flex-1 justify-center">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copiado" : "Copiar comando"}
        </button>
        <label className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none px-3 py-2 rounded-lg border border-white/10">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            className="accent-accent"
          />
          Já usei este comando
        </label>
      </div>
    </GlassCard>
  );
}

function TemplateCard({ t }: { t: Template }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyText(t.command, `Comando do ${t.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <GlassCard className="p-6 space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-xl">{t.name}</h3>
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Para quem é
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug">{t.audience}</dd>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Dor que resolve
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug">{t.pain}</dd>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            O que o MVP faz
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug">
            <ul className="list-disc list-inside space-y-0.5">
              {t.mvp.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Como ganha dinheiro
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug">{t.monetization}</dd>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Telas principais
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug">
            {t.screens.join(" · ")}
          </dd>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
            Banco de dados
          </dt>
          <dd className="text-foreground/85 text-[13px] leading-snug font-mono">
            {t.db.join(", ")}
          </dd>
        </div>
      </dl>

      <details className="group">
        <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-muted-foreground/80 hover:text-accent transition select-none">
          Ver comando completo para Lovable
        </summary>
        <pre className="mt-2 text-[13px] text-foreground/85 whitespace-pre-wrap font-sans leading-6 bg-background/40 border border-white/5 rounded-lg p-3 max-h-80 overflow-y-auto">
{t.command}
        </pre>
      </details>

      {t.checklist && (
        <div className="rounded-lg bg-accent/5 border border-accent/20 p-3">
          <p className="text-[10px] uppercase tracking-wider text-accent mb-2">
            Checklist de teste
          </p>
          <ul className="text-[13px] text-foreground/85 space-y-1">
            {t.checklist.map((c) => (
              <li key={c} className="flex gap-2">
                <Check size={14} className="text-accent shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={copy} className="btn-primary w-full justify-center">
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copiado" : `Copiar comando deste app`}
      </button>
    </GlassCard>
  );
}

// ===================== Página =====================

export default function Entrega() {
  const navigate = useNavigate();
  const auth = useAuthState();

  const [stepsDone, setStepsDone] = useState<boolean[]>(() => commands.map(() => false));
  const [progress, setProgress] = useState<boolean[]>(() => progressItems.map(() => false));

  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_STEPS);
      if (a) {
        const parsed = JSON.parse(a);
        if (Array.isArray(parsed) && parsed.length === commands.length)
          setStepsDone(parsed.map(Boolean));
      }
      const b = localStorage.getItem(STORAGE_PROGRESS);
      if (b) {
        const parsed = JSON.parse(b);
        if (Array.isArray(parsed) && parsed.length === progressItems.length)
          setProgress(parsed.map(Boolean));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEPS, JSON.stringify(stepsDone));
    } catch {
      /* ignore */
    }
  }, [stepsDone]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
    } catch {
      /* ignore */
    }
  }, [progress]);

  const doneCount = useMemo(() => stepsDone.filter(Boolean).length, [stepsDone]);

  const logout = async () => {
    await clearSession();
    navigate("/login");
  };

  // ---------- AUTH GATES ----------
  if (auth.status === "loading") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-16">
          <Loader2 className="animate-spin mx-auto text-accent" size={28} />
          <p className="text-sm text-muted-foreground mt-4">Verificando seu acesso…</p>
        </div>
      </Section>
    );
  }

  if (auth.status === "anonymous") {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Área restrita</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Entre com o e-mail usado na compra para acessar seus comandos do Lovable.
            </p>
            <button onClick={() => navigate("/login")} className="btn-primary w-full">
              Entrar na área restrita
            </button>
          </div>
        </div>
      </Section>
    );
  }

  if (!auth.hasAccess && !auth.isAdmin) {
    return (
      <Section>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="glass-strong p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-amber-400" size={22} />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">
              Acesso ainda não liberado
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua conta foi criada, mas seu acesso aos materiais ainda não está ativo.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
                className="btn-primary w-full justify-center"
              >
                <LifeBuoy size={14} /> Falar com suporte
              </button>
              <button
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2"
              >
                <LogOut size={12} /> Sair desta conta
              </button>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const email = auth.email ?? "";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startStep1 = async () => {
    await copyText(commands[0].content, "Comando 1");
    setStepsDone((prev) => {
      const next = [...prev];
      next[0] = true;
      return next;
    });
    scrollTo("trilha");
  };

  const openLovable = () => window.open(LOVABLE_URL, "_blank", "noopener,noreferrer");

  return (
    <>
      {/* HERO */}
      <Section className="pt-10 pb-10" id="comece">

        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <Logo size="md" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {email && (
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {email}
                </span>
              )}
              {auth.isAdmin && (
                <button
                  onClick={() => navigate("/admin/acessos")}
                  className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent inline-flex items-center gap-1"
                >
                  <ShieldCheck size={12} /> Admin
                </button>
              )}
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 inline-flex items-center gap-1"
              >
                <LogOut size={12} /> Sair
              </button>
            </div>
          </div>

          <div className="glass-strong p-8 md:p-12 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Sparkles size={12} /> Programa Arquiteto de Apps
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-3">
              Construa seu app no Lovable do zero ao lançamento
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Siga o passo a passo. Copie um comando por vez, cole no Lovable e avance
              até ter seu app pronto para testar com usuários reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <button onClick={startStep1} className="btn-primary">
                <Copy size={16} /> Começar pelo Passo 1
              </button>
              <button
                onClick={() => scrollTo("modelos")}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
              >
                <Library size={16} /> Ver ideias prontas de apps
              </button>
              <button
                onClick={openLovable}
                className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center justify-center gap-2 text-sm"
              >
                <ExternalLink size={16} /> Abrir Lovable
              </button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Regra simples: um comando por vez. Não pule etapas.
            </p>
          </div>
        </div>
      </Section>

      {/* NAV TOC */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <nav className="flex items-center gap-2 text-xs whitespace-nowrap">
            {[
              ["Comece aqui", "comece"],
              ["Ideias prontas", "modelos"],
              ["Construir app", "trilha"],
              ["Área restrita e banco", "cmd-3"],
              ["Landing page e venda", "cmd-7"],
              ["SEO e GEO", "cmd-13"],
              ["Campanhas", "cmd-14"],
              ["Criativos", "cmd-6"],
              ["Validação", "cmd-14"],
              ["Checklist", "progresso"],
              ["Erros comuns", "erros"],
              ["Ativar acesso", "ativar"],
            ].map(([label, id]) => (
              <a
                key={label}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* O QUE VOCÊ COMPROU */}
      <Section className="py-10">

        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">O que você comprou</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Você comprou um programa guiado para criar aplicativos com o Lovable, mesmo
            sem saber programar. Aqui você encontra comandos prontos, modelos de apps,
            checklists e instruções para construir, vender e validar sua ideia.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Copy,
                title: "Comandos prontos para Lovable",
                text: "Você não precisa inventar o que escrever. Basta copiar e colar.",
              },
              {
                icon: ListChecks,
                title: "Passo a passo completo",
                text: "Você começa pela ideia e termina com um app pronto para testar.",
              },
              {
                icon: Library,
                title: "Modelos de apps prontos",
                text: "Escolha uma ideia pronta e adapte para o seu público.",
              },
              {
                icon: Smartphone,
                title: "Validação com usuários",
                text: "Antes de escalar, teste com 10 pessoas reais.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <GlassCard key={title} className="p-5">
                <Icon className="text-accent mb-3" size={20} />
                <h3 className="font-heading font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* COMO USAR */}
      <Section className="py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">Como usar esta página</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Pense nesta página como um mapa. Você vai seguir uma trilha. Primeiro escolhe
            ou escreve uma ideia. Depois copia os comandos na ordem e cola no Lovable.
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ["Escolha uma ideia", "Você pode usar sua própria ideia ou escolher uma ideia pronta."],
              ["Copie o Comando 1", "Ele transforma a ideia em um plano claro."],
              ["Cole no Lovable", "O Lovable vai entender o que você quer criar."],
              ["Use o próximo comando", "Cada comando constrói uma parte do app."],
              ["Teste no celular", "Veja se as telas e botões funcionam."],
              ["Mostre para 10 pessoas", "Use feedback real antes de melhorar."],
            ].map(([title, text], i) => (
              <li
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-bold flex items-center justify-center mb-2">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>Não tente usar todos os comandos de uma vez. Use um por vez.</p>
          </div>
        </div>
      </Section>

      {/* ESCOLHA SEU CAMINHO */}
      <Section className="py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-6">Escolha seu caminho</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <GlassCard className="p-6 space-y-4">
              <Lightbulb className="text-accent" size={22} />
              <h3 className="font-heading text-xl font-semibold">Tenho minha própria ideia</h3>
              <p className="text-sm text-muted-foreground">
                Use este caminho se você já sabe o app que quer criar.
              </p>
              <button
                onClick={() => scrollTo("trilha")}
                className="btn-primary w-full justify-center"
              >
                Ir para o Passo 1 <ArrowRight size={16} />
              </button>
            </GlassCard>
            <GlassCard className="p-6 space-y-4">
              <Library className="text-accent" size={22} />
              <h3 className="font-heading text-xl font-semibold">Quero uma ideia pronta</h3>
              <p className="text-sm text-muted-foreground">
                Use este caminho se você quer escolher um app pronto para construir no
                Lovable.
              </p>
              <button
                onClick={() => scrollTo("modelos")}
                className="px-4 py-3 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold"
              >
                Ver modelos de apps <ArrowRight size={16} />
              </button>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* MODELOS */}
      <Section className="py-10" id="modelos">
        <div className="max-w-5xl mx-auto" id="modelos-anchor">
          <h2 className="text-2xl font-heading font-bold mb-2">
            Modelos de apps prontos para validar
          </h2>
          <p className="text-muted-foreground mb-3 max-w-3xl">
            Escolha um modelo, copie o comando e cole no Lovable. Depois adapte para seu
            público.
          </p>
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
            Essas ideias têm dor clara, público definido e forma de monetização. Mesmo
            assim, valide com 10 usuários antes de investir pesado.
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            {templates.map((t) => (
              <TemplateCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </Section>

      {/* TRILHA PRINCIPAL */}
      <Section className="py-10" id="trilha">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold">
                Trilha principal: construa do zero no Lovable
              </h2>
              <p className="text-muted-foreground">
                Use estes comandos na ordem. Cada comando cria uma parte do seu app.
              </p>
            </div>
            <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              {doneCount}/{commands.length} comandos usados
            </span>
          </div>

          <div className="space-y-5">
            {commands.map((cmd, i) => (
              <CommandCard
                key={cmd.n}
                cmd={cmd}
                done={stepsDone[i]}
                onToggle={() =>
                  setStepsDone((prev) => {
                    const next = [...prev];
                    next[i] = !next[i];
                    return next;
                  })
                }
              />
            ))}
          </div>
        </div>
      </Section>

      {/* SE PERDER */}
      <Section className="py-10">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-heading font-bold mb-2 text-center">
              Se você se perder, faça só isso
            </h2>
            <p className="text-muted-foreground mb-5 text-center">
              Não tente fazer tudo no mesmo dia. Faça nesta ordem: Comando 1, Comando 2,
              teste no celular, depois continue.
            </p>
            <ol className="space-y-2 text-sm max-w-md mx-auto">
              {[
                "Copie o Comando 1",
                "Cole no Lovable",
                "Leia o plano",
                "Copie o Comando 2",
                "Teste a primeira versão",
              ].map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-5 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm">
                <Sparkles size={14} /> Um comando por vez.
              </span>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* PROGRESSO */}
      <Section className="py-10" id="progresso">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-2xl font-heading font-bold mb-2">Meu progresso</h2>
          <p className="text-muted-foreground mb-6">
            Marque cada etapa conforme você avança. Salvamos automaticamente neste
            navegador.
          </p>
          <ul className="space-y-2">
            {progressItems.map((item, i) => (
              <li key={item}>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={progress[i]}
                    onChange={() =>
                      setProgress((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      })
                    }
                    className="accent-accent w-4 h-4"
                  />
                  <span
                    className={`text-sm ${
                      progress[i] ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ERROS COMUNS */}
      <Section className="py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-2">
            Erros comuns e como resolver
          </h2>
          <p className="text-muted-foreground mb-6">
            Quando algo der errado, procure aqui antes de chamar o suporte.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonErrors.map((e) => (
              <GlassCard key={e.title} className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <h3 className="font-semibold text-sm">{e.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{e.fix}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* SUPORTE */}
      <Section className="py-10">
        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h3 className="font-heading font-semibold mb-1">Travou em algum comando?</h3>
              <p className="text-sm text-muted-foreground">
                Fale com a gente e te ajudamos a destravar.
              </p>
            </div>
            <button
              onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}
              className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 inline-flex items-center gap-2 text-sm"
            >
              <LifeBuoy size={14} /> Falar com suporte
            </button>
          </GlassCard>
        </div>
      </Section>

      {/* GIFT CODE (final) */}
      <Section className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Gift className="mx-auto text-accent mb-3" size={22} />
            <h2 className="text-xl font-heading font-bold mb-1">
              Ativar ou estender acesso
            </h2>
            <p className="text-sm text-muted-foreground">
              Use esta área apenas se você recebeu um código de acesso.
            </p>
          </div>
          <GiftCodeRedemption />
        </div>
      </Section>
    </>
  );
}
