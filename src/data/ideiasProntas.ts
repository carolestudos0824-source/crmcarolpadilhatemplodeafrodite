import { APP_MODELS, type AppModel } from "@/data/entregaModules";

export const IDEAS_CATEGORIES = [
  "Todas",
  "Mais vendáveis",
  "Serviços locais",
  "WhatsApp e vendas",
  "Educação e mentoria",
  "Restaurantes e comércio",
  "Finanças e MEI",
  "Fitness e saúde",
  "Pets",
  "Imóveis",
  "Eventos",
  "Operação interna",
] as const;

export type IdeaCategory = (typeof IDEAS_CATEGORIES)[number];

type IdeaMeta = { name: string; category: string; badges: string[] };

// Helper to build compact AppModel objects for new ideas
const mk = (m: {
  name: string;
  audience: string;
  pain: string;
  mvp: string[];
  monetization: string;
  database?: string[];
  promise?: string;
  mainAction?: string;
}): AppModel => ({
  name: m.name,
  audience: m.audience,
  pain: m.pain,
  monetization: m.monetization,
  screens: m.mvp.slice(0, 5),
  database: m.database ?? [],
  command: `Crie no Lovable um app chamado ${m.name}.

Público: ${m.audience}
Dor: ${m.pain}

MVP:
${m.mvp.map((x, i) => `${i + 1}. ${x}`).join("\n")}

Monetização: ${m.monetization}
Mobile first, em português, simples.`,
  checklist: m.mvp.slice(0, 4),
  shortDescription: m.promise ?? `App para ${m.audience.toLowerCase()}.`,
  promise: m.promise,
  mainAction: m.mainAction,
  mvp: m.mvp,
});

// 17 ideias que ainda não existiam em APP_MODELS
const EXTRA_MODELS: AppModel[] = [
  mk({
    name: "ClínicaAgenda",
    audience: "Psicólogos, nutricionistas, esteticistas e terapeutas.",
    pain: "Agenda, ficha do cliente e retornos desorganizados.",
    mvp: ["Agenda de consultas", "Ficha simples do cliente", "Lembrete de retorno", "Histórico de atendimentos", "Painel do profissional"],
    monetization: "Assinatura mensal por profissional.",
    database: ["profissionais", "clientes", "consultas", "fichas"],
    promise: "Atender com agenda, ficha e retorno organizados em um só lugar.",
    mainAction: "Marcar uma consulta em 2 toques.",
  }),
  mk({
    name: "PropostaPro",
    audience: "Designers, social media, consultores e freelancers.",
    pain: "Propostas comerciais feitas de forma amadora no Word ou PDF.",
    mvp: ["Modelos de proposta", "Editor simples", "Link público para o cliente", "Aceite com 1 clique", "Painel de propostas"],
    monetization: "Assinatura mensal.",
    database: ["usuarios", "propostas", "clientes", "aceites"],
    promise: "Enviar propostas profissionais com aceite em link.",
    mainAction: "Gerar e enviar uma proposta em 2 minutos.",
  }),
  mk({
    name: "ContratoSimples",
    audience: "Freelancers e prestadores de serviço.",
    pain: "Trabalham sem contrato ou copiam modelos ruins da internet.",
    mvp: ["Biblioteca de modelos", "Preencher dados do cliente", "Gerar contrato em PDF", "Assinatura por link", "Histórico"],
    monetization: "Pagamento único ou assinatura.",
    database: ["usuarios", "modelos", "contratos", "assinaturas"],
    promise: "Fechar contrato com cliente em minutos, sem advogado.",
    mainAction: "Gerar contrato em 3 passos.",
  }),
  mk({
    name: "CobrançaZap",
    audience: "Pequenos negócios e profissionais autônomos.",
    pain: "Esquecem cobranças e recebem com atraso.",
    mvp: ["Cadastrar clientes", "Lançar cobranças", "Vencimentos", "Lembrete pronto pra WhatsApp", "Painel de pendências"],
    monetization: "Assinatura mensal.",
    database: ["clientes", "cobrancas", "lembretes"],
    promise: "Não esquecer mais nenhuma cobrança.",
    mainAction: "Disparar lembrete de cobrança em 1 toque.",
  }),
  mk({
    name: "EstoqueFácil",
    audience: "Lojas pequenas, brechós, papelarias e revendas.",
    pain: "Não sabem o que tem em estoque e perdem venda.",
    mvp: ["Produtos", "Entradas", "Saídas", "Alerta de estoque baixo", "Relatório simples"],
    monetization: "Assinatura mensal.",
    database: ["produtos", "movimentacoes", "alertas"],
    promise: "Saber exatamente o que tem no estoque sem planilha.",
    mainAction: "Lançar entrada ou saída em segundos.",
  }),
  mk({
    name: "VitrineZap",
    audience: "Lojistas que vendem só pelo WhatsApp.",
    pain: "Vendem por foto solta no WhatsApp e perdem pedido.",
    mvp: ["Catálogo de produtos", "Categorias", "Botão de pedido", "Envio ao WhatsApp do dono", "Painel do lojista"],
    monetization: "Mensalidade por loja.",
    database: ["lojas", "produtos", "pedidos"],
    promise: "Ter uma vitrine online com pedido direto no WhatsApp.",
    mainAction: "Cliente faz pedido em 2 toques.",
  }),
  mk({
    name: "Clube de Assinatura Local",
    audience: "Cafés, marmitas, produtos artesanais e clubes locais.",
    pain: "Vendem uma vez e não criam recorrência.",
    mvp: ["Planos de assinatura", "Cadastro de assinantes", "Próxima entrega", "Histórico", "Painel do dono"],
    monetization: "Mensalidade ou comissão.",
    database: ["planos", "assinantes", "entregas"],
    promise: "Criar receita recorrente com clube de assinatura.",
    mainAction: "Assinar plano em 3 passos.",
  }),
  mk({
    name: "Delivery de Bairro",
    audience: "Pequenos comércios locais que querem fugir de marketplaces.",
    pain: "Dependem de marketplaces caros e perdem margem.",
    mvp: ["Catálogo", "Carrinho", "Pedido", "Status do pedido", "Painel do comércio"],
    monetization: "Assinatura mensal mais taxa por pedido.",
    database: ["comercios", "produtos", "pedidos", "clientes"],
    promise: "Receber pedido direto, sem comissão de app gigante.",
    mainAction: "Cliente pede em 2 minutos.",
  }),
  mk({
    name: "ReservaFácil",
    audience: "Quadras, salões, coworkings e espaços pequenos.",
    pain: "Reservas duplicadas e controle manual em caderno.",
    mvp: ["Calendário de reservas", "Reserva pública", "Confirmação", "Bloqueios", "Painel do dono"],
    monetization: "Assinatura mensal.",
    database: ["espacos", "reservas", "clientes"],
    promise: "Acabar com reservas duplicadas.",
    mainAction: "Reservar horário em 2 toques.",
  }),
  mk({
    name: "EventoExpress",
    audience: "Organizadores de eventos pequenos.",
    pain: "Inscrição e check-in desorganizados em planilha.",
    mvp: ["Página do evento", "Inscrição online", "Lista de inscritos", "Check-in com QR", "Relatório"],
    monetization: "Taxa por evento.",
    database: ["eventos", "inscritos", "checkins"],
    promise: "Organizar evento com inscrição e check-in profissionais.",
    mainAction: "Inscrever participante em 1 minuto.",
  }),
  mk({
    name: "NPS Pós-Venda",
    audience: "E-commerces e prestadores de serviço.",
    pain: "Não sabem quem ficou satisfeito ou insatisfeito.",
    mvp: ["Criar pesquisa", "Envio por link", "Nota e comentário", "Alerta de notas baixas", "Painel de NPS"],
    monetization: "Assinatura mensal.",
    database: ["pesquisas", "respostas", "alertas"],
    promise: "Saber em tempo real quem está satisfeito.",
    mainAction: "Enviar pesquisa em 1 clique.",
  }),
  mk({
    name: "Portal do Cliente Freelancer",
    audience: "Designers, devs, social media e agências pequenas.",
    pain: "Cliente pede status no WhatsApp o tempo todo.",
    mvp: ["Projetos", "Arquivos", "Aprovações", "Status atual", "Comentários"],
    monetization: "Assinatura mensal.",
    database: ["projetos", "arquivos", "aprovacoes", "clientes"],
    promise: "Tirar o cliente do WhatsApp e centralizar o projeto.",
    mainAction: "Cliente aprova entrega em 1 clique.",
  }),
  mk({
    name: "Checklist Operacional",
    audience: "Lojas, franquias pequenas e equipes operacionais.",
    pain: "Tarefas diárias não são cumpridas e ninguém percebe.",
    mvp: ["Modelos de checklist", "Atribuir responsável", "Marcar como feito", "Histórico", "Painel"],
    monetization: "Assinatura mensal.",
    database: ["checklists", "tarefas", "responsaveis"],
    promise: "Garantir que a rotina diária seja cumprida.",
    mainAction: "Marcar tarefa como feita em 1 toque.",
  }),
  mk({
    name: "RecrutaSimples",
    audience: "Pequenas empresas que contratam pelo WhatsApp.",
    pain: "Candidatos chegam por WhatsApp e se perdem.",
    mvp: ["Cadastro de vagas", "Página pública da vaga", "Candidatos", "Status de triagem", "Notas internas"],
    monetization: "Assinatura mensal.",
    database: ["vagas", "candidatos", "triagens"],
    promise: "Organizar candidatos sem planilha.",
    mainAction: "Mover candidato no funil em 1 toque.",
  }),
  mk({
    name: "Desafio 21 Dias",
    audience: "Creators, coaches, nutricionistas e professores.",
    pain: "Querem vender transformação curta com acompanhamento.",
    mvp: ["Inscrição", "Tarefas diárias", "Progresso do aluno", "Comunidade simples", "Painel"],
    monetization: "Pagamento por turma.",
    database: ["turmas", "alunos", "tarefas", "progresso"],
    promise: "Rodar desafio de 21 dias com acompanhamento real.",
    mainAction: "Aluno marca tarefa do dia.",
  }),
  mk({
    name: "Controle de Comissões",
    audience: "Equipes comerciais pequenas.",
    pain: "Comissão calculada manualmente gera conflito.",
    mvp: ["Vendedores", "Vendas", "Regra de comissão", "Fechamento mensal", "Relatório"],
    monetization: "Assinatura mensal.",
    database: ["vendedores", "vendas", "comissoes"],
    promise: "Fechar comissão sem briga.",
    mainAction: "Lançar venda em segundos.",
  }),
  mk({
    name: "SuporteZap Organizado",
    audience: "Negócios que atendem pelo WhatsApp.",
    pain: "Atendimento se perde sem status nem responsável.",
    mvp: ["Tickets", "Status", "Responsáveis", "Histórico", "Painel"],
    monetization: "Assinatura mensal.",
    database: ["tickets", "responsaveis", "mensagens"],
    promise: "Não perder mais nenhum atendimento.",
    mainAction: "Abrir ticket em 1 toque.",
  }),
];

// Acrescenta os 17 modelos extras à lista principal (sem duplicar)
const existingNames = new Set(APP_MODELS.map((m) => m.name));
for (const extra of EXTRA_MODELS) {
  if (!existingNames.has(extra.name)) {
    APP_MODELS.push(extra);
  }
}

// Ordem oficial das 30 ideias + categoria + selos
const META: IdeaMeta[] = [
  { name: "AgendaPro Local", category: "Serviços locais", badges: ["Mais vendável", "Fácil no Lovable", "Assinatura"] },
  { name: "Mini CRM WhatsApp", category: "WhatsApp e vendas", badges: ["Mais vendável", "Assinatura"] },
  { name: "OrçaFácil", category: "Serviços locais", badges: ["Mais vendável", "Fácil no Lovable"] },
  { name: "ControleMEI", category: "Finanças e MEI", badges: ["Mais vendável", "Assinatura"] },
  { name: "CardápioZap", category: "Restaurantes e comércio", badges: ["Mais vendável", "Fácil no Lovable"] },
  { name: "Área de Membros Express", category: "Educação e mentoria", badges: ["Mais vendável", "Assinatura"] },
  { name: "App de Mentoria", category: "Educação e mentoria", badges: ["Assinatura"] },
  { name: "TreinoSimples", category: "Fitness e saúde", badges: ["Assinatura"] },
  { name: "Lista de Espera Inteligente", category: "Educação e mentoria", badges: ["Fácil no Lovable", "Pagamento único"] },
  { name: "PetAgenda", category: "Pets", badges: ["Assinatura"] },
  { name: "Imobiliária Fácil", category: "Imóveis", badges: ["Assinatura"] },
  { name: "Escola de Reforço Online", category: "Educação e mentoria", badges: ["Assinatura"] },
  { name: "Tarot Digital", category: "Educação e mentoria", badges: ["Fácil no Lovable", "Comissão"] },
  { name: "ClínicaAgenda", category: "Fitness e saúde", badges: ["Assinatura"] },
  { name: "PropostaPro", category: "Serviços locais", badges: ["Fácil no Lovable", "Assinatura"] },
  { name: "ContratoSimples", category: "Serviços locais", badges: ["Fácil no Lovable", "Pagamento único"] },
  { name: "CobrançaZap", category: "Finanças e MEI", badges: ["Assinatura"] },
  { name: "EstoqueFácil", category: "Restaurantes e comércio", badges: ["Assinatura"] },
  { name: "VitrineZap", category: "Restaurantes e comércio", badges: ["Fácil no Lovable", "Assinatura"] },
  { name: "Clube de Assinatura Local", category: "Restaurantes e comércio", badges: ["Assinatura"] },
  { name: "Delivery de Bairro", category: "Restaurantes e comércio", badges: ["Assinatura"] },
  { name: "ReservaFácil", category: "Eventos", badges: ["Assinatura"] },
  { name: "EventoExpress", category: "Eventos", badges: ["Fácil no Lovable", "Pagamento único"] },
  { name: "NPS Pós-Venda", category: "Operação interna", badges: ["Fácil no Lovable", "Assinatura"] },
  { name: "Portal do Cliente Freelancer", category: "Serviços locais", badges: ["Assinatura"] },
  { name: "Checklist Operacional", category: "Operação interna", badges: ["Assinatura"] },
  { name: "RecrutaSimples", category: "Operação interna", badges: ["Fácil no Lovable", "Assinatura"] },
  { name: "Desafio 21 Dias", category: "Educação e mentoria", badges: ["Fácil no Lovable", "Pagamento único"] },
  { name: "Controle de Comissões", category: "Operação interna", badges: ["Assinatura"] },
  { name: "SuporteZap Organizado", category: "WhatsApp e vendas", badges: ["Assinatura"] },
];

// Aplica category/badges nos próprios objetos AppModel (não-destrutivo)
for (const meta of META) {
  const model = APP_MODELS.find((m) => m.name === meta.name);
  if (model) {
    model.category = meta.category;
    model.badges = meta.badges;
  }
}

export type IdeaCard = { model: AppModel; category: string; badges: string[] };

export const IDEAS_LIBRARY: IdeaCard[] = META.map((meta) => {
  const model = APP_MODELS.find((m) => m.name === meta.name);
  if (!model) throw new Error(`Modelo ausente em APP_MODELS: ${meta.name}`);
  return { model, category: meta.category, badges: meta.badges };
});

export const IDEAS_INITIAL_VISIBLE = 12;

export const isMostSellable = (badges: string[]) => badges.includes("Mais vendável");
