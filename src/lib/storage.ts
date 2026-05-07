export interface Client {
  id: string;
  nome: string;
  whatsapp: string;
  instagram?: string;
  dataNascimento?: string;
  nomePessoaEnvolvida: string;
  statusRelacao: string;
  situacaoPrincipal: string;
  observacoesPrivadas?: string;
  statusComercial: string;
  createdAt: string;
  updatedAt: string;
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
  observacoesPrivadas?: string;
  statusAtendimento: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  nomeProfissional: string;
  assinatura: string;
  whatsapp: string;
  valorConsulta: string;
  valorMagia: string;
  textosPadrao: string;
  paleta: string;
  preferencias: Record<string, any>;
}

const KEYS = {
  CLIENTS: 'templo_afrodite_clients',
  APPOINTMENTS: 'templo_afrodite_appointments',
  SETTINGS: 'templo_afrodite_settings',
};

export const storage = {
  // Clients
  getClients: (): Client[] => {
    const data = localStorage.getItem(KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  saveClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Client => {
    const clients = storage.getClients();
    const now = new Date().toISOString();
    
    if (client.id) {
      const index = clients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        const updatedClient = { ...clients[index], ...client, updatedAt: now } as Client;
        clients[index] = updatedClient;
        localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
        return updatedClient;
      }
    }
    
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      statusComercial: client.statusComercial || 'Nova cliente'
    } as Client;
    
    clients.push(newClient);
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
    return newClient;
  },
  getClientById: (id: string): Client | undefined => {
    return storage.getClients().find(c => c.id === id);
  },

  // Appointments
  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  },
  getAppointmentsByClient: (clientId: string): Appointment[] => {
    return storage.getAppointments().filter(a => a.clientId === clientId);
  },
  saveAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment => {
    const appointments = storage.getAppointments();
    const now = new Date().toISOString();
    
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    } as Appointment;
    
    appointments.push(newAppointment);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return newAppointment;
  },
  updateAppointment: (id: string, updates: Partial<Appointment>): Appointment | undefined => {
    const appointments = storage.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    const updated = { ...appointments[index], ...updates, updatedAt: new Date().toISOString() };
    appointments[index] = updated;
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return updated;
  },
  getAppointmentById: (id: string): Appointment | undefined => {
    return storage.getAppointments().find(a => a.id === id);
  },

  // Settings
  getSettings: (): Settings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      nomeProfissional: 'Carol Padilha',
      assinatura: 'Carol Padilha • Tarô e Magia',
      whatsapp: '(11) 99999-9999',
      valorConsulta: '250,00',
      valorMagia: '450,00',
      textosPadrao: '',
      paleta: 'original',
      preferencias: {}
    };
  },
  saveSettings: (settings: Settings): void => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};
