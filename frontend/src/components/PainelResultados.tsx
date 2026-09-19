import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { Pauta } from '../types/pauta';

interface PainelResultadosProps {
  pautas: Pauta[];
}

export const PainelResultados: React.FC<PainelResultadosProps> = ({ pautas }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" /> Painel de Resultados
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Acompanhamento dos votos computados por pauta.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {pautas.map((pauta) => {
          const percSim = pauta.totalVotos > 0 ? Math.round((pauta.votosSim / pauta.totalVotos) * 100) : 0;
          const percNao = pauta.totalVotos > 0 ? Math.round((pauta.votosNao / pauta.totalVotos) * 100) : 0;

          return (
            <div key={pauta.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-100">{pauta.titulo}</h3>
                <span className="text-xs text-zinc-500">Total de votos: {pauta.totalVotos}</span>
              </div>

              {/* Barra Votos SIM */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-emerald-400">SIM ({pauta.votosSim})</span>
                  <span className="text-zinc-400">{percSim}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-950 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percSim}%` }} />
                </div>
              </div>

              {/* Barra Votos NÃO */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-rose-400">NÃO ({pauta.votosNao})</span>
                  <span className="text-zinc-400">{percNao}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-950 overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${percNao}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};