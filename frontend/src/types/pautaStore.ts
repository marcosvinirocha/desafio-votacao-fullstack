import type { Pauta } from './domain';

export interface PautaState {
  pautas: Pauta[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchPautas: () => Promise<void>;
  criarPauta: (titulo: string, descricao: string) => Promise<void>;

  clearError: () => void;
}
