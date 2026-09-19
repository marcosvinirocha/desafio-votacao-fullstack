import { useState } from 'react';
import type { FormEvent } from 'react';

import { FeedbackMessage } from '@/components/ui/FeedbackMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buttonPrimary, inputBase } from '@/components/ui/styles';
import { cn } from '@/utils/cn';

export interface PautaFormValues {
  titulo: string;
  descricao: string;
}

interface PautaFormProps {
  onSubmit: (values: PautaFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

type PautaFormErrors = Partial<Record<'titulo' | 'descricao', string>>;

function validate(values: PautaFormValues): PautaFormErrors {
  const errors: PautaFormErrors = {};
  const titulo = values.titulo.trim();

  if (!titulo) {
    errors.titulo = 'O título é obrigatório.';
  } else if (titulo.length < 3) {
    errors.titulo = 'O título deve ter pelo menos 3 caracteres.';
  }

  if (values.descricao.trim().length > 500) {
    errors.descricao = 'A descrição deve ter no máximo 500 caracteres.';
  }

  return errors;
}

/** Formulário de criação de pauta com validação de campos. */
export function PautaForm({ onSubmit, loading = false, error = null }: PautaFormProps) {
  const [values, setValues] = useState<PautaFormValues>({ titulo: '', descricao: '' });
  const [errors, setErrors] = useState<PautaFormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({ titulo: values.titulo.trim(), descricao: values.descricao.trim() });
    setValues({ titulo: '', descricao: '' });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs"
    >
      <h2 className="text-lg font-semibold text-neutral-900">Criar nova pauta</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pauta-titulo" className="text-sm font-medium text-neutral-700">
          Título
        </label>
        <input
          id="pauta-titulo"
          name="titulo"
          type="text"
          value={values.titulo}
          onChange={(event) =>
            setValues((previous) => ({ ...previous, titulo: event.target.value }))
          }
          aria-invalid={Boolean(errors.titulo)}
          aria-describedby={errors.titulo ? 'pauta-titulo-error' : undefined}
          className={cn(
            inputBase,
            errors.titulo && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          )}
        />
        {errors.titulo && (
          <p id="pauta-titulo-error" role="alert" className="text-sm text-red-600">
            {errors.titulo}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pauta-descricao" className="text-sm font-medium text-neutral-700">
          Descrição <span className="font-normal text-neutral-400">(opcional)</span>
        </label>
        <textarea
          id="pauta-descricao"
          name="descricao"
          rows={3}
          value={values.descricao}
          onChange={(event) =>
            setValues((previous) => ({ ...previous, descricao: event.target.value }))
          }
          aria-invalid={Boolean(errors.descricao)}
          aria-describedby={errors.descricao ? 'pauta-descricao-error' : undefined}
          className={cn(
            inputBase,
            'resize-y',
            errors.descricao && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          )}
        />
        {errors.descricao && (
          <p id="pauta-descricao-error" role="alert" className="text-sm text-red-600">
            {errors.descricao}
          </p>
        )}
      </div>

      {error && <FeedbackMessage variant="error" message={error} />}

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className={buttonPrimary}>
          {loading ? (
            <>
              <LoadingSpinner size={16} label="Criando pauta…" />
              Criando…
            </>
          ) : (
            'Criar pauta'
          )}
        </button>
      </div>
    </form>
  );
}
