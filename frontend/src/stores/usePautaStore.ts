import { create } from 'zustand';
import { http } from '../services/index'; // Importe a sua instância pré-configurada do Axios
import type { PautaState } from '../types/pautaStore';
import type { Pauta } from '../types/domain';

export const usePautaStore = create<PautaState>((set) => ({
  pautas: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  // 1. Buscar todas as pautas
  fetchPautas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await http.get<Pauta[]>('/pautas');
      set({ pautas: response.data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar pautas';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  // 2. Criar nova pauta
  criarPauta: async (titulo: string, descricao: string) => {
    set({ loading: true, error: null });
    try {
      const response = await http.post<Pauta>('/pautas', { titulo, descricao });
      set((state) => ({ pautas: [response.data, ...state.pautas] }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar pauta';
      set({ error: message });
      throw err; // Re-lança para que o componente saiba que falhou, se necessário
    } finally {
      set({ loading: false });
    }
  },

  // 3. Abrir sessão de votação

  // // 4. Registrar Voto do Associado
  // votar: async (pautaId: number, cpf: string, voto: OpcaoVoto) => {
  //     set({ loading: true, error: null });
  //     try {
  //         await http.post(`/pautas/${pautaId}/votos`, { cpf, voto });
  //         // Recarrega as pautas para atualizar os totais de votos no painel de resultados
  //         await get().fetchPautas();
  //     } catch (err: unknown) {
  //         const message =
  //             err instanceof Error ? err.message : 'Erro ao registrar voto';
  //         set({ error: message });
  //         throw err;
  //     } finally {
  //         set({ loading: false });
  //     }
  // },
}));
