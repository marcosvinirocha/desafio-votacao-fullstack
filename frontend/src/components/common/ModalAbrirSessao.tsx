import * as Dialog from '@radix-ui/react-dialog';
import { Clock3, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { FeedbackMessage } from '@/components/ui/FeedbackMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buttonPrimary, buttonSecondary, inputBase } from '@/components/ui/styles';
import type { AbrirSessaoPayload, Pauta } from '@/types/domain';
import { cn } from '@/utils/cn';

interface SessaoFormProps {
  pauta: Pauta;
  onSubmit: (payload: AbrirSessaoPayload) => void | Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Formulário interno do modal. Vive dentro do Dialog.Content, que é desmontado
 * ao fechar (Presence) — o estado reseta automaticamente a cada abertura.
 */
function SessaoForm({ pauta, onSubmit, loading, error }: SessaoFormProps) {
  const [duracaoMinutos, setDuracaoMinutos] = useState('1');
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const duracao = Number(duracaoMinutos);
    if (!Number.isInteger(duracao) || duracao < 1) {
      setFieldError('Informe uma duração válida (mínimo 1 minuto).');
      return;
    }

    setFieldError(null);
    await onSubmit({ pautaId: pauta.id, duracaoMinutos: duracao });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sessao-duracao" className="text-sm font-medium text-neutral-700">
          Duração (minutos)
        </label>
        <div className="relative">
          <Clock3
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            id="sessao-duracao"
            name="duracaoMinutos"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={duracaoMinutos}
            onChange={(event) => {
              setDuracaoMinutos(event.target.value);
              setFieldError(null);
            }}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? 'sessao-duracao-error' : undefined}
            className={cn(
              inputBase,
              'pl-9',
              fieldError && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            )}
          />
        </div>
        {fieldError && (
          <p id="sessao-duracao-error" role="alert" className="text-sm text-red-600">
            {fieldError}
          </p>
        )}
      </div>

      {error && <FeedbackMessage variant="error" message={error} />}

      <div className="flex justify-end gap-3">
        <Dialog.Close asChild>
          <button type="button" className={buttonSecondary}>
            Cancelar
          </button>
        </Dialog.Close>
        <button type="submit" disabled={loading} className={buttonPrimary}>
          {loading ? (
            <>
              <LoadingSpinner size={16} label="Abrindo sessão…" />
              Abrindo…
            </>
          ) : (
            'Abrir sessão'
          )}
        </button>
      </div>
    </form>
  );
}

interface ModalAbrirSessaoProps {
  /** Pauta selecionada; `null` mantém o modal fechado. */
  pauta: Pauta | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AbrirSessaoPayload) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

/** Modal (Radix Dialog) para definir a duração da sessão de votação, em minutos. */
export function ModalAbrirSessao({
  pauta,
  onOpenChange,
  onSubmit,
  loading = false,
  error = null,
}: ModalAbrirSessaoProps) {
  const open = pauta !== null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold text-neutral-900">
                Abrir sessão de votação
              </Dialog.Title>
              <Dialog.Description className="mt-1 truncate text-sm text-neutral-500">
                {pauta ? `Duração da sessão para “${pauta.titulo}”.` : ''}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Fechar"
                className="shrink-0 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {pauta && (
            <SessaoForm pauta={pauta} onSubmit={onSubmit} loading={loading} error={error} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
