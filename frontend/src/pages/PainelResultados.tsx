import { BarChart3 } from 'lucide-react';

import { FeedbackMessage } from '@/components/ui/FeedbackMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { ResultadoStatus, ResultadoVotacao } from '@/types/domain';
import { cn } from '@/utils/cn';

interface PainelResultadosProps {
  resultados: ResultadoVotacao[];
  loading?: boolean;
  error?: string | null;
}

const RESULTADO_STYLES: Record<ResultadoStatus, { label: string; className: string }> = {
  APROVADA: { label: 'Aprovada', className: 'bg-green-50 text-green-700 ring-green-200' },
  REPROVADA: { label: 'Reprovada', className: 'bg-red-50 text-red-700 ring-red-200' },
  EMPATE: { label: 'Empate', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  'SESSÃO EM ANDAMENTO': {
    label: 'Em andamento',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
};

function ResultadoBadge({ resultado }: { resultado: ResultadoStatus }) {
  const { label, className } = RESULTADO_STYLES[resultado];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Painel visual de métricas de votação por pauta. */
export function PainelResultados({
  resultados,
  loading = false,
  error = null,
}: PainelResultadosProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={24} className="text-neutral-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-neutral-900">Resultados</h2>
        </div>
        <p className="text-sm text-neutral-500">Acompanhe a apuração dos votos de cada pauta.</p>
        {error && <FeedbackMessage variant="error" message={error} />}
      </div>

      {loading ? (
        <LoadingSpinner label="Carregando resultados…" />
      ) : resultados.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          Nenhum resultado disponível ainda.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {resultados.map((resultado) => (
            <li key={resultado.pautaId}>
              <article className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {resultado.tituloPauta}
                  </h3>
                  <ResultadoBadge resultado={resultado.resultado} />
                </div>

                <ProgressBar
                  sim={resultado.votosSim}
                  nao={resultado.votosNao}
                  label={`Votos da pauta ${resultado.tituloPauta}`}
                />

                <dl className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-neutral-50 p-3">
                    <dt className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                      Total
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-neutral-900">
                      {resultado.totalVotos}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <dt className="text-xs font-medium tracking-wide text-green-600 uppercase">
                      Sim
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-green-700">
                      {resultado.votosSim}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <dt className="text-xs font-medium tracking-wide text-red-600 uppercase">
                      Não
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-red-700">
                      {resultado.votosNao}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
