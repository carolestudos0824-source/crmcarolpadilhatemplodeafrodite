export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  instagram?: string;
  tipoAtendimento: string;
  situacaoAmorosa: string;
  nomePessoaEnvolvida?: string;
  relato: string;
  jaFezConsulta: boolean;
  canalRetorno: 'Portal' | 'WhatsApp' | 'Ambos';
  status: 'Novo' | 'Em análise' | 'Aguardando pagamento' | 'Aguardando tiragem' | 'Em preparo' | 'Leitura entregue' | 'Acompanhamento' | 'Finalizado' | 'Arquivado';
  comprovanteUrl?: string;
  comprovanteStatus?: 'Recebido' | 'Confirmado' | 'Recusado';
  comprovanteValor?: number;
  createdAt: string;
  updatedAt: string;
}

export const SITUACOES_AMOROSAS = [
  "Ele sumiu",
  "Término recente",
  "Quero reconquistar",
  "Ele bloqueia e desbloqueia",
  "Relação fria",
  "Possível traição",
  "Terceira pessoa",
  "Amor não assumido",
  "Quero atrair alguém novo",
  "Quero saber se devo insistir",
  "Outro caso"
];

export const TIPOS_ATENDIMENTO = [
  "Jogo do Amor",
  "Consulta espiritual",
  "Magia de amor",
  "Limpeza espiritual",
  "Acompanhamento",
  "Ainda não sei"
];
