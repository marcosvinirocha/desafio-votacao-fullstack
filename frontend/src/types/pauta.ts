export type VotoEnum = 'SIM' | 'NAO';

export interface Pauta {
  id: string;
  titulo: string;
  descricao: string;
  sessaoAtiva: boolean;
  sessaoExpiracao?: string; // ISO Date String
  votosSim: number;
  votosNao: number;
  totalVotos: number;
}