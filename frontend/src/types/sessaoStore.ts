import type { AbrirSessaoPayload, PautaStatus, SessaoVotacao } from './domain';

export interface SessaoState {
  sessoes: SessaoVotacao[];
  sessaoAtiva: SessaoVotacao | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchSessoes: () => Promise<void>;
  abrirSessao: (payload: AbrirSessaoPayload) => Promise<SessaoVotacao>;
  /** Busca síncrona sobre o array `sessoes` em memória (sem chamadas HTTP). */
  buscarSessaoPorPauta: (pautaId: number) => SessaoVotacao | null;
  /** Deriva o status da pauta por comparação temporal com a sessão cadastrada. */
  calcularStatusSessao: (pautaId: number) => PautaStatus;
  clearError: () => void;
}
