export interface Client {
  id: string;
  nome?: string;
  whatsapp?: string;
  instagram?: string;
  dataNascimento?: string;
  cidade?: string;
  origem?: string; // Como chegou
  nomePessoaEnvolvida?: string;
  dataNascimentoPessoa?: string;
  statusRelacao?: string;
  situacaoPrincipal?: string;
  observacoesPrivadas?: string;
  statusComercial?: string;
  temperatura?: 'Fria' | 'Morna' | 'Quente' | 'Ativa' | 'Recorrente' | 'Sensível' | 'Alta Prioridade';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  ultimoAtendimento?: string;
  proximoRetorno?: string;
}

export interface TarotCard {
  name: string;
  obs: string;
  confirmed: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  nomeCliente: string;
  situacaoAmorosa: string;
  relatoCaso: string;
  fotoTiragem?: string;
  cartasConfirmadas: Record<number, TarotCard>;
  leituraCompleta: string;
  roteiroAudio: string;
  textoWhatsapp: string;
  magiasIndicadas: string;
  magiaOferecida?: boolean;
  magiaContratada?: string; // ID da magia ou nome
  valorAtendimento?: number;
  formaPagamento?: string;
  statusAtendimento: 'Rascunho' | 'Em andamento' | 'Leitura gerada' | 'Salvo' | 'Enviado' | 'Finalizada';
  isDeliveredToPortal?: boolean;
  observacoesPrivadas?: string;
  followUpId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  appointmentId?: string;
  tipo: 'Retorno pós-consulta' | 'Acompanhar magia' | 'Cobrar retorno' | 'Enviar mensagem' | 'Reavaliar caso' | 'Acompanhamento 7 dias' | 'Acompanhamento 21 dias' | 'Acompanhamento 90 dias' | 'Pagamento pendente' | 'Entrega de orientação';
  data: string;
  hora?: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Pendente' | 'Feito' | 'Adiado' | 'Cancelado';
  observacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MagiaContratada {
  id: string;
  clientId: string;
  appointmentId?: string;
  nomeMagia: string;
  objetivo: string;
  dataContratacao: string;
  valor: number;
  statusPagamento: 'Não cobrado' | 'Pendente' | 'Pago parcial' | 'Pago' | 'Cancelado';
  statusExecucao: 'Indicada' | 'Oferecida' | 'Contratada' | 'Aguardando pagamento' | 'Agendada' | 'Realizada' | 'Em acompanhamento' | 'Finalizada' | 'Cancelada';
  dataExecucao?: string;
  dataFollowup?: string;
  resultadoRelatado?: string;
  observacoesPrivadas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Financeiro {
  id: string;
  clientId?: string;
  appointmentId?: string;
  tipo: 'Consulta' | 'Jogo do Amor' | 'Mandala' | 'Magia' | 'Acompanhamento' | 'Produto' | 'Outro';
  descricao: string;
  valor: number;
  data: string;
  formaPagamento: 'Pix' | 'Dinheiro' | 'Cartão' | 'Transferência' | 'Outro';
  status: 'Pago' | 'Pendente' | 'Parcial' | 'Cancelado';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  titulo: string;
  categoria: string;
  texto: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  nomeProfissional: string;
  assinatura: string;
  whatsapp: string;
  instagram?: string;
  email?: string;
  textoEncerramento?: string;
  valorConsulta: string;
  valorMagia: string;
  textosPadrao: string;
  paleta: string;
  precos: Record<string, string>;
  preferencias: {
    mostrarValoresLeitura?: boolean;
    mostrarValoresWhatsApp?: boolean;
    linguagemDireta?: boolean;
    modoTeleprompter?: boolean;
    fonteGrande?: boolean;
  };
}

const KEYS = {
  CLIENTS: 'templo_afrodite_clients_v2',
  APPOINTMENTS: 'templo_afrodite_appointments_v2',
  FOLLOW_UPS: 'templo_afrodite_followups',
  MAGIAS: 'templo_afrodite_magias_v2',
  FINANCEIRO: 'templo_afrodite_financeiro',
  MESSAGES: 'templo_afrodite_messages',
  SETTINGS: 'templo_afrodite_settings_v2',
};

export const storage = {
  // Helpers
  generateId: () => Math.random().toString(36).substr(2, 9),

  // Generic Get/Set
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  save: <T extends { id: string, createdAt: string, updatedAt: string }>(key: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): T => {
    const items = storage.get<T>(key);
    const now = new Date().toISOString();
    
    if (item.id) {
      const index = items.findIndex(i => i.id === item.id);
      if (index !== -1) {
        const updated = { ...items[index], ...item, updatedAt: now } as T;
        items[index] = updated;
        localStorage.setItem(key, JSON.stringify(items));
        return updated;
      }
    }
    
    const newItem = {
      ...item,
      id: item.id || storage.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;
    
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
  },
  delete: (key: string, id: string) => {
    const items = storage.get<{ id: string }>(key);
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  },

  // Clients
  getClients: () => storage.get<Client>(KEYS.CLIENTS),
  saveClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<Client>(KEYS.CLIENTS, client),
  getClientById: (id: string) => storage.getClients().find(c => c.id === id),

  // Appointments
  getAppointments: () => storage.get<Appointment>(KEYS.APPOINTMENTS),
  getAppointmentsByClient: (clientId: string) => storage.getAppointments().filter(a => a.clientId === clientId),
  saveAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<Appointment>(KEYS.APPOINTMENTS, appointment),
  getAppointmentById: (id: string) => storage.getAppointments().find(a => a.id === id),

  // Follow-ups
  getFollowUps: () => storage.get<FollowUp>(KEYS.FOLLOW_UPS),
  saveFollowUp: (fu: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<FollowUp>(KEYS.FOLLOW_UPS, fu),
  
  // Magias
  getMagias: () => storage.get<MagiaContratada>(KEYS.MAGIAS),
  saveMagia: (m: Omit<MagiaContratada, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<MagiaContratada>(KEYS.MAGIAS, m),

  // Financeiro
  getFinanceiro: () => storage.get<Financeiro>(KEYS.FINANCEIRO),
  saveFinanceiro: (f: Omit<Financeiro, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<Financeiro>(KEYS.FINANCEIRO, f),

  // Messages
  getMessages: () => storage.get<MessageTemplate>(KEYS.MESSAGES),
  saveMessage: (m: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => storage.save<MessageTemplate>(KEYS.MESSAGES, m),

  // Settings
  getSettings: (): Settings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      nomeProfissional: 'Carol Padilha',
      assinatura: 'Carol Padilha • Tarô e Magia',
      whatsapp: '(11) 99999-9999',
      valorConsulta: '250,00',
      valorMagia: '500,00',
      textosPadrao: '',
      paleta: 'original',
      precos: {},
      preferencias: {}
    };
  },
  saveSettings: (settings: Settings): void => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  // Backup
  exportBackup: () => {
    const data = {
      clients: storage.getClients(),
      appointments: storage.getAppointments(),
      followUps: storage.getFollowUps(),
      magias: storage.getMagias(),
      financeiro: storage.getFinanceiro(),
      messages: storage.getMessages(),
      settings: storage.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },
  importBackup: (json: string, mode: 'merge' | 'replace') => {
    const data = JSON.parse(json);
    if (mode === 'replace') {
      localStorage.setItem(KEYS.CLIENTS, JSON.stringify(data.clients || []));
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(data.appointments || []));
      localStorage.setItem(KEYS.FOLLOW_UPS, JSON.stringify(data.followUps || []));
      localStorage.setItem(KEYS.MAGIAS, JSON.stringify(data.magias || []));
      localStorage.setItem(KEYS.FINANCEIRO, JSON.stringify(data.financeiro || []));
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(data.messages || []));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings || storage.getSettings()));
    } else {
      // Simple merge by ID
      const merge = (key: string, newData: any[]) => {
        const existing = storage.get(key);
        const map = new Map(existing.map((item: any) => [item.id, item]));
        newData.forEach(item => map.set(item.id, item));
        localStorage.setItem(key, JSON.stringify(Array.from(map.values())));
      };
      if (data.clients) merge(KEYS.CLIENTS, data.clients);
      if (data.appointments) merge(KEYS.APPOINTMENTS, data.appointments);
      if (data.followUps) merge(KEYS.FOLLOW_UPS, data.followUps);
      if (data.magias) merge(KEYS.MAGIAS, data.magias);
      if (data.financeiro) merge(KEYS.FINANCEIRO, data.financeiro);
      if (data.messages) merge(KEYS.MESSAGES, data.messages);
    }
  }
};
