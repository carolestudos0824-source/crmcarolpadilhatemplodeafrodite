export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  instagram?: string;
  situacaoAmorosa: string;
  nomePessoaEnvolvida?: string;
  relato: string;
  servicoInteresse: string;
  status: 'Novo lead' | 'Em análise' | 'Cliente criada' | 'Atendimento iniciado' | 'Respondida' | 'Arquivada';
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

export const SERVICOS_INTERESSE = [
  "Jogo do Amor",
  "Consulta espiritual",
  "Magia de amor",
  "Limpeza espiritual",
  "Ainda não sei"
];
