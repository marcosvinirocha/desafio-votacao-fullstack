import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Clock, Loader2, X } from 'lucide-react';
import type { Pauta } from '../types/pauta';

interface GestaoPautasProps {
  pautas: Pauta[];
  onCreatePauta: (titulo: string, descricao: string) => Promise<void>;
  onAbrirSessao: (pautaId: string, minutos: number) => Promise<void>;
}

export const GestaoPautas: React.FC<GestaoPautasProps> = ({
  pautas,
  onCreatePauta,
  onAbrirSessao,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPautaId, setSelectedPautaId] = useState<string | null>(null);
  const [minutos, setMinutos] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao) return;
    setLoading(true);
    try {
      await onCreatePauta(titulo, descricao);
      setTitulo('');
      setDescricao('');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirSessao = async () => {
    if (!selectedPautaId) return;
    setLoading(true);
    try {
      await onAbrirSessao(selectedPautaId, minutos);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário de Cadastro */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-500" /> Nova Pauta
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Aprovação do orçamento anual"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os detalhes da pauta..."
              rows={3}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Cadastrar Pauta
          </button>
        </form>
      </section>

      {/* Lista de Pautas */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-100">Pautas Cadastradas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pautas.map((pauta) => (
            <div
              key={pauta.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-100">{pauta.titulo}</h3>
                  {pauta.sessaoAtiva ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Sessão Aberta
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                      Encerrada / Inativa
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{pauta.descricao}</p>
              </div>

              {!pauta.sessaoAtiva && (
                <button
                  onClick={() => {
                    setSelectedPautaId(pauta.id);
                    setModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  <Clock className="h-4 w-4 text-indigo-400" /> Abrir Sessão de Votação
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Modal Radix UI para Abertura de Sessão */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl space-y-4 focus:outline-none animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <Dialog.Title className="text-base font-semibold text-zinc-100">
                Abrir Sessão de Votação
              </Dialog.Title>
              <Dialog.Close className="text-zinc-400 hover:text-zinc-200">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-400">
                Tempo de duração (minutos)
              </label>
              <input
                type="number"
                min={1}
                value={minutos}
                onChange={(e) => setMinutos(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800">
                Cancelar
              </Dialog.Close>
              <button
                onClick={handleAbrirSessao}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Confirmar Abertura
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};