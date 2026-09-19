import React, { useState } from 'react';
import { Check, X, Vote, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Pauta, VotoEnum } from '../types/pauta';

interface VotacaoAssociadoProps {
    pautasAtivas: Pauta[];
    onVotar: (pautaId: string, cpf: string, voto: VotoEnum) => Promise<void>;
}

export const VotacaoAssociado: React.FC<VotacaoAssociadoProps> = ({ pautasAtivas, onVotar }) => {
    const [cpf, setCpf] = useState('');
    const [selectedPauta, setSelectedPauta] = useState('');
    const [voto, setVoto] = useState<VotoEnum | null>(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPauta || !cpf || !voto) return;

        setLoading(true);
        setFeedback(null);

        try {
            await onVotar(selectedPauta, cpf, voto);
            setFeedback({ type: 'success', message: 'Voto registrado com sucesso!' });
            setCpf('');
            setVoto(null);
            setSelectedPauta('');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar voto.';
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm space-y-6">
            <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <Vote className="h-5 w-5 text-indigo-500" /> Votação do Associado
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Informe seu CPF e selecione uma pauta aberta para votar.</p>
            </div>

            {feedback && (
                <div
                    className={`flex items-center gap-2 rounded-lg p-3 text-sm ${feedback.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                >
                    {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {feedback.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">CPF / Identificador</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Pauta para Votação</label>
                    <select
                        value={selectedPauta}
                        onChange={(e) => setSelectedPauta(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Selecione uma pauta...</option>
                        {pautasAtivas.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Seu Voto</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setVoto('SIM')}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-3 font-medium text-sm transition-colors ${voto === 'SIM'
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            <Check className="h-4 w-4" /> SIM
                        </button>
                        <button
                            type="button"
                            onClick={() => setVoto('NAO')}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-3 font-medium text-sm transition-colors ${voto === 'NAO'
                                    ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                                }`}
                        >
                            <X className="h-4 w-4" /> NÃO
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !voto || !selectedPauta || !cpf}
                    className="flex justify-center items-center gap-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 mt-4"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />} Registrar Voto
                </button>
            </form>
        </div>
    );
};