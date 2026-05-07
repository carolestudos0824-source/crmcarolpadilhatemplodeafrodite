import { Lead } from "./lead";

const INBOX_KEY = 'templo_afrodite_inbox_v2'; // Changed key to avoid conflict with old format

export const leadService = {
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(INBOX_KEY);
    return data ? JSON.parse(data) : [];
  },

  getLeadById: (id: string): Lead | undefined => {
    return leadService.getLeads().find(l => l.id === id);
  },

  createLead: async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Lead> => {
    const leads = leadService.getLeads();
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Novo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedLeads = [newLead, ...leads];
    localStorage.setItem(INBOX_KEY, JSON.stringify(updatedLeads));
    return newLead;
  },

  updateLeadStatus: async (id: string, status: Lead['status']): Promise<void> => {
    const leads = leadService.getLeads();
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, status, updatedAt: new Date().toISOString() } : lead
    );
    localStorage.setItem(INBOX_KEY, JSON.stringify(updatedLeads));
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<void> => {
    const leads = leadService.getLeads();
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, ...data, updatedAt: new Date().toISOString() } : lead
    );
    localStorage.setItem(INBOX_KEY, JSON.stringify(updatedLeads));
  },

  deleteLead: async (id: string): Promise<void> => {
    const leads = leadService.getLeads();
    const updatedLeads = leads.filter(lead => lead.id !== id);
    localStorage.setItem(INBOX_KEY, JSON.stringify(updatedLeads));
  }
};
