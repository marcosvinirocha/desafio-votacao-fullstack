import { create } from 'zustand';
import { http } from '../services/index';
import type { SessaoState } from '@/types/sessaoStore';
import type { AbrirSessaoPayload, PautaStatus, SessaoVotacao } from '@/types/domain';
import { usePautaStore } from './usePautaStore';

export const useSessaoStore = create<SessaoState>((set, get) => ({
  // 1. Estado inicial
  sessoes: [],
  sessaoAtiva: null,
  loading: false,
  error: null,

  // 2. Ações que satisfazem a interface SessaoState
  clearError: () => set({ error: null }),

  // GET /v1/sessoes — carrega a lista completa de sessões na montagem
  fetchSessoes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await http.get<SessaoVotacao[]>('/sessoes');
      set({ sessoes: response.data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar sessões de votação';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  // POST /v1/sessoes/abrir
  abrirSessao: async (payload: AbrirSessaoPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await http.post<SessaoVotacao>('/sessoes/abrir', payload);
      const novaSessao = response.data;

      set((state) => ({
        sessoes: [novaSessao, ...state.sessoes.filter((s) => s.pautaId !== payload.pautaId)],
        sessaoAtiva: novaSessao,
      }));

      // Sincroniza as pautas após abrir a sessão (status refletido nos cards)
      await usePautaStore.getState().fetchPautas();

      return novaSessao;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao abrir sessão de votação';
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Busca síncrona sobre o array em memória (evita Promises pendentes)
  buscarSessaoPorPauta: (pautaId: number) =>
    get().sessoes.find((sessao) => sessao.pautaId === pautaId) ?? null,

  // Derivação síncrona do status por comparação temporal
  calcularStatusSessao: (pautaId: number): PautaStatus => {
    const sessao = get().buscarSessaoPorPauta(pautaId);
    if (!sessao) return 'semSessao';

    const agora = new Date().getTime();
    const inicio = new Date(sessao.dataAbertura).getTime();
    const fim = new Date(sessao.dataEncerramento).getTime();

    const dentroDoIntervalo =
      !Number.isNaN(inicio) && !Number.isNaN(fim) && agora >= inicio && agora <= fim;

    return dentroDoIntervalo && sessao.aberta === true ? 'emAndamento' : 'encerrada';
  },
}));
