import { supabase } from "@/integrations/supabase/client";
import { 
  Client, 
  Appointment, 
  FollowUp, 
  MagiaContratada, 
  Financeiro, 
  MessageTemplate 
} from "./storage";

const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  return user.id;
};

const mapClientToDB = (client: Partial<Client>, userId: string) => ({
  user_id: userId,
  nome: client.nome,
  whatsapp: client.whatsapp,
  instagram: client.instagram,
  data_nascimento: client.dataNascimento,
  cidade: client.cidade,
  origem: client.origem,
  nome_envolvido: client.nomePessoaEnvolvida,
  data_nascimento_envolvido: client.dataNascimentoPessoa,
  status_relacao: client.statusRelacao,
  situacao_principal: client.situacaoPrincipal,
  observacoes_privadas: client.observacoesPrivadas,
  status_comercial: client.statusComercial,
  temperatura: client.temperatura,
  tags: client.tags,
  ultimo_atendimento: client.ultimoAtendimento,
  proximo_retorno: client.proximoRetorno,
});

const mapDBToClient = (db: any): Client => ({
  id: db.id,
  nome: db.nome,
  whatsapp: db.whatsapp,
  instagram: db.instagram,
  dataNascimento: db.data_nascimento,
  cidade: db.cidade,
  origem: db.origem,
  nomePessoaEnvolvida: db.nome_envolvido,
  dataNascimentoPessoa: db.data_nascimento_envolvido,
  statusRelacao: db.status_relacao,
  situacaoPrincipal: db.situacao_principal,
  observacoesPrivadas: db.observacoes_privadas,
  statusComercial: db.status_comercial,
  temperatura: db.temperatura,
  tags: db.tags,
  ultimoAtendimento: db.ultimo_atendimento,
  proximoRetorno: db.proximo_retorno,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const supabaseService = {
  getClients: async (): Promise<Client[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .order('nome');
    
    if (error) throw error;
    return (data || []).map(mapDBToClient);
  },

  getClientById: async (id: string): Promise<Client | null> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return mapDBToClient(data);
  },

  saveClient: async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Client> => {
    const userId = await getUserId();
    const dbData = mapClientToDB(client, userId);
    
    if (client.id) {
      const { data, error } = await supabase
        .from('clientes')
        .update(dbData)
        .eq('id', client.id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return mapDBToClient(data);
    } else {
      const { data, error } = await supabase
        .from('clientes')
        .insert(dbData)
        .select()
        .single();
      
      if (error) throw error;
      return mapDBToClient(data);
    }
  },

  deleteClient: async (id: string) => {
    const userId = await getUserId();
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(db => ({
      id: db.id,
      clientId: db.client_id,
      nomeCliente: db.nome_cliente,
      situacaoAmorosa: db.situacao_amorosa,
      relatoCaso: db.relato,
      fotoTiragem: db.foto_tiragem,
      cartasConfirmadas: db.cartas_confirmadas,
      leituraCompleta: db.leitura_completa,
      roteiroAudio: db.roteiro_audio,
      textoWhatsapp: db.texto_whatsapp,
      magiasIndicadas: db.magias_indicadas,
      magiaOferecida: db.magia_oferecida,
      magiaContratada: db.magia_contratada,
      valorAtendimento: db.valor_atendimento,
      formaPagamento: db.forma_pagamento,
      statusAtendimento: db.status_atendimento,
      isDeliveredToPortal: db.is_delivered_to_portal,
      observacoesPrivadas: db.observacoes_privadas,
      followUpId: db.follow_up_id,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    }));
  },

  saveAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Appointment> => {
    const userId = await getUserId();
    const dbData = {
      user_id: userId,
      client_id: appointment.clientId,
      nome_cliente: appointment.nomeCliente,
      situacao_amorosa: appointment.situacaoAmorosa,
      relato: appointment.relatoCaso,
      foto_tiragem: appointment.fotoTiragem,
      cartas_confirmadas: appointment.cartasConfirmadas,
      leitura_completa: appointment.leituraCompleta,
      roteiro_audio: appointment.roteiroAudio,
      texto_whatsapp: appointment.textoWhatsapp,
      magias_indicadas: appointment.magiasIndicadas,
      magia_oferecida: appointment.magiaOferecida,
      magia_contratada: appointment.magiaContratada,
      valor_atendimento: appointment.valorAtendimento,
      forma_pagamento: appointment.formaPagamento,
      status_atendimento: appointment.statusAtendimento,
      is_delivered_to_portal: appointment.isDeliveredToPortal,
      observacoes_privadas: appointment.observacoesPrivadas,
      follow_up_id: appointment.followUpId,
    };

    if (appointment.id) {
      const { data, error } = await supabase
        .from('atendimentos')
        .update(dbData)
        .eq('id', appointment.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getAppointments();
      return all.find(a => a.id === data.id)!;
    } else {
      const { data, error } = await supabase
        .from('atendimentos')
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getAppointments();
      return all.find(a => a.id === data.id)!;
    }
  },

  getFollowUps: async (): Promise<FollowUp[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*')
      .eq('user_id', userId)
      .order('data');
    
    if (error) throw error;
    return (data || []).map(db => ({
      id: db.id,
      clientId: db.client_id,
      appointmentId: db.appointment_id,
      tipo: db.tipo,
      data: db.data,
      hora: db.hora,
      prioridade: db.prioridade,
      status: db.status,
      observacao: db.observacao,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    }));
  },

  saveFollowUp: async (fu: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<FollowUp> => {
    const userId = await getUserId();
    const dbData = {
      user_id: userId,
      client_id: fu.clientId,
      appointment_id: fu.appointmentId,
      tipo: fu.tipo,
      data: fu.data,
      hora: fu.hora,
      prioridade: fu.prioridade,
      status: fu.status,
      observacao: fu.observacao,
    };

    if (fu.id) {
      const { data, error } = await supabase
        .from('follow_ups')
        .update(dbData)
        .eq('id', fu.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getFollowUps();
      return all.find(a => a.id === data.id)!;
    } else {
      const { data, error } = await supabase
        .from('follow_ups')
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getFollowUps();
      return all.find(a => a.id === data.id)!;
    }
  },

  getMagias: async (): Promise<MagiaContratada[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('magias_contratadas')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map(db => ({
      id: db.id,
      clientId: db.client_id,
      appointmentId: db.appointment_id,
      nomeMagia: db.nome_magia,
      objetivo: db.objetivo,
      dataContratacao: db.data_contratacao,
      valor: db.valor,
      statusPagamento: db.status_pagamento,
      statusExecucao: db.status_execucao,
      dataExecucao: db.data_execucao,
      dataFollowup: db.data_followup,
      resultadoRelatado: db.resultado_relatado,
      observacoesPrivadas: db.observacoes_privadas,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    }));
  },

  saveMagia: async (m: Omit<MagiaContratada, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<MagiaContratada> => {
    const userId = await getUserId();
    const dbData = {
      user_id: userId,
      client_id: m.clientId,
      appointment_id: m.appointmentId,
      nome_magia: m.nomeMagia,
      objetivo: m.objetivo,
      data_contratacao: m.dataContratacao,
      valor: m.valor,
      status_pagamento: m.statusPagamento,
      status_execucao: m.statusExecucao,
      data_execucao: m.dataExecucao,
      data_followup: m.dataFollowup,
      resultado_relatado: m.resultadoRelatado,
      observacoes_privadas: m.observacoesPrivadas,
    };

    if (m.id) {
      const { data, error } = await supabase
        .from('magias_contratadas')
        .update(dbData)
        .eq('id', m.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getMagias();
      return all.find(a => a.id === data.id)!;
    } else {
      const { data, error } = await supabase
        .from('magias_contratadas')
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getMagias();
      return all.find(a => a.id === data.id)!;
    }
  },

  getFinanceiro: async (): Promise<Financeiro[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('financeiro')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map(db => ({
      id: db.id,
      clientId: db.client_id,
      appointmentId: db.appointment_id,
      tipo: db.tipo,
      descricao: db.descricao,
      valor: db.valor,
      data: db.data,
      formaPagamento: db.forma_pagamento,
      status: db.status,
      observacoes: db.observacoes,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    }));
  },

  saveFinanceiro: async (f: Omit<Financeiro, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Financeiro> => {
    const userId = await getUserId();
    const dbData = {
      user_id: userId,
      client_id: f.clientId,
      appointment_id: f.appointmentId,
      tipo: f.tipo,
      descricao: f.descricao,
      valor: f.valor,
      data: f.data,
      forma_pagamento: f.formaPagamento,
      status: f.status,
      observacoes: f.observacoes,
    };

    if (f.id) {
      const { data, error } = await supabase
        .from('financeiro')
        .update(dbData)
        .eq('id', f.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getFinanceiro();
      return all.find(a => a.id === data.id)!;
    } else {
      const { data, error } = await supabase
        .from('financeiro')
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getFinanceiro();
      return all.find(a => a.id === data.id)!;
    }
  },

  getMessages: async (): Promise<MessageTemplate[]> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('mensagens_templates')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map(db => ({
      id: db.id,
      titulo: db.titulo,
      categoria: db.categoria,
      texto: db.texto,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    }));
  },

  saveMessage: async (m: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<MessageTemplate> => {
    const userId = await getUserId();
    const dbData = {
      user_id: userId,
      titulo: m.titulo,
      categoria: m.categoria,
      texto: m.texto,
    };

    if (m.id) {
      const { data, error } = await supabase
        .from('mensagens_templates')
        .update(dbData)
        .eq('id', m.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getMessages();
      return all.find(a => a.id === data.id)!;
    } else {
      const { data, error } = await supabase
        .from('mensagens_templates')
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      const all = await supabaseService.getMessages();
      return all.find(a => a.id === data.id)!;
    }
  },
};
