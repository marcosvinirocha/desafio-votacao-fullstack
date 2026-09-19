import { useState } from 'react';

import { ModalAbrirSessao } from '@/components/common/ModalAbrirSessao';
import { PautaCard } from '@/components/common/PautaCard';
import { PautaForm } from '@/components/common/PautaForm';
import type { PautaFormValues } from '@/components/common/PautaForm';
import { FeedbackMessage } from '@/components/ui/FeedbackMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { AbrirSessaoPayload, Pauta, PautaComStatus } from '@/types/domain';

interface GestaoPautasProps {
  pautas: PautaComStatus[];
  loading?: boolean;
  error?: string | null;
  criandoPauta?: boolean;
  criarPautaError?: string | null;
  abrindoSessao?: boolean;
  abrirSessaoError?: string | null;
  onCreatePauta: (values: PautaFormValues) => void | Promise<void>;
  onAbrirSessao: (payload: AbrirSessaoPayload) => void | Promise<void>;
}

/** Container principal do módulo de pautas: listagem, criação e abertura de sessão. */
export function GestaoPautas({
  pautas,
  loading = false,
  error = null,
  criandoPauta = false,
  criarPautaError = null,
  abrindoSessao = false,
  abrirSessaoError = null,
  onCreatePauta,
  onAbrirSessao,
}: GestaoPautasProps) {
  const [pautaParaSessao, setPautaParaSessao] = useState<Pauta | null>(null);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Pautas</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Cadastre novas pautas e abra sessões de votação para os associados.
          </p>
        </div>
        {error && <FeedbackMessage variant="error" message={error} />}
      </div>

      <PautaForm onSubmit={onCreatePauta} loading={criandoPauta} error={criarPautaError} />

      <section aria-labelledby="lista-pautas-title" className="flex flex-col gap-4">
        <h3 id="lista-pautas-title" className="text-lg font-semibold text-neutral-900">
          Pautas cadastradas
        </h3>

        {loading ? (
          <LoadingSpinner label="Carregando pautas…" />
        ) : pautas.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            Nenhuma pauta cadastrada ainda.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {pautas.map(({ pauta, status }) => (
              <li key={pauta.id}>
                <PautaCard pauta={pauta} status={status} onAbrirSessao={setPautaParaSessao} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ModalAbrirSessao
        pauta={pautaParaSessao}
        onOpenChange={(open) => {
          if (!open) {
            setPautaParaSessao(null);
          }
        }}
        onSubmit={onAbrirSessao}
        loading={abrindoSessao}
        error={abrirSessaoError}
      />
    </div>
  );
}
