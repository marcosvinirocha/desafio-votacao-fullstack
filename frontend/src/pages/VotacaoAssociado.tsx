import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';

import { FeedbackMessage } from '@/components/ui/FeedbackMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OptionCard } from '@/components/ui/OptionCard';
import { buttonPrimary, inputBase } from '@/components/ui/styles';
import type { OpcaoVoto, Pauta, RegistrarVotoPayload } from '@/types/domain';
import { cn } from '@/utils/cn';

interface VotoOpcao {
  value: OpcaoVoto;
  label: string;
  icon: ReactNode;
}

const VOTO_OPCOES: VotoOpcao[] = [
  { value: 'SIM', label: 'Sim', icon: <ThumbsUp size={20} aria-hidden="true" /> },
  { value: 'NAO', label: 'Não', icon: <ThumbsDown size={20} aria-hidden="true" /> },
];

interface VotacaoErrors {
  associadoId?: string;
  pautaId?: string;
  voto?: string;
}

interface VotacaoAssociadoProps {
  /** Pautas com sessão de votação ativa. */
  pautasAtivas: Pauta[];
  loading?: boolean;
  error?: string | null;
  onVotar: (payload: RegistrarVotoPayload) => void | Promise<void>;
}

/** Interface do associado: CPF/identificador, pauta ativa e opção de voto (SIM/NÃO). */
export function VotacaoAssociado({
  pautasAtivas,
  loading = false,
  error = null,
  onVotar,
}: VotacaoAssociadoProps) {
  const [associadoId, setAssociadoId] = useState('');
  const [pautaId, setPautaId] = useState<number | ''>('');
  const [voto, setVoto] = useState<OpcaoVoto | null>(null);
  const [errors, setErrors] = useState<VotacaoErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const optionCount = VOTO_OPCOES.length;
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = index === 0 ? optionCount - 1 : index - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = index === optionCount - 1 ? 0 : index + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = optionCount - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextVoto = VOTO_OPCOES[nextIndex].value;
    setVoto(nextVoto);
    setErrors((previous) => ({ ...previous, voto: undefined }));
    radioRefs.current[nextIndex]?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: VotacaoErrors = {};
    if (!/^\d{11}$/.test(associadoId.trim())) {
      nextErrors.associadoId = 'Informe um CPF válido (11 dígitos).';
    }
    if (pautaId === '') {
      nextErrors.pautaId = 'Selecione a pauta em votação.';
    }
    if (!voto) {
      nextErrors.voto = 'Selecione sua opção de voto.';
    }

    setErrors(nextErrors);
    setSubmitError(null);
    setSuccess(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onVotar({
        pautaId: Number(pautaId),
        associadoId: associadoId.trim(),
        voto: voto as OpcaoVoto,
      });
      setSuccess('Voto registrado com sucesso!');
      setVoto(null);
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível registrar o voto. Tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Votação</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Informe seu CPF, selecione a pauta ativa e registre seu voto.
          </p>
        </div>
        {error && <FeedbackMessage variant="error" message={error} />}
        {success && <FeedbackMessage variant="success" message={success} />}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="voto-associado" className="text-sm font-medium text-neutral-700">
            CPF / identificador do associado
          </label>
          <input
            id="voto-associado"
            name="associadoId"
            type="text"
            inputMode="numeric"
            maxLength={11}
            placeholder="00000000000"
            value={associadoId}
            onChange={(event) => {
              setAssociadoId(event.target.value.replace(/\D/g, ''));
              setErrors((previous) => ({ ...previous, associadoId: undefined }));
              setSuccess(null);
            }}
            aria-invalid={Boolean(errors.associadoId)}
            aria-describedby={errors.associadoId ? 'voto-associado-error' : undefined}
            className={cn(
              inputBase,
              errors.associadoId && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            )}
          />
          {errors.associadoId && (
            <p id="voto-associado-error" role="alert" className="text-sm text-red-600">
              {errors.associadoId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="voto-pauta" className="text-sm font-medium text-neutral-700">
            Pauta em votação
          </label>
          <select
            id="voto-pauta"
            name="pautaId"
            value={pautaId}
            onChange={(event) => {
              setPautaId(event.target.value === '' ? '' : Number(event.target.value));
              setErrors((previous) => ({ ...previous, pautaId: undefined }));
              setSuccess(null);
            }}
            aria-invalid={Boolean(errors.pautaId)}
            aria-describedby={errors.pautaId ? 'voto-pauta-error' : undefined}
            className={cn(
              inputBase,
              'appearance-none',
              errors.pautaId && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            )}
          >
            <option value="">Selecione uma pauta…</option>
            {pautasAtivas.map((pauta) => (
              <option key={pauta.id} value={pauta.id}>
                {pauta.titulo}
              </option>
            ))}
          </select>
          {errors.pautaId && (
            <p id="voto-pauta-error" role="alert" className="text-sm text-red-600">
              {errors.pautaId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Sua opção</span>
          <div
            role="radiogroup"
            aria-label="Opção de voto"
            className="flex flex-col gap-3 sm:flex-row"
          >
            {VOTO_OPCOES.map((opcao, index) => (
              <OptionCard
                key={opcao.value}
                id={`opcao-${opcao.value.toLowerCase()}`}
                label={opcao.label}
                icon={opcao.icon}
                selected={voto === opcao.value}
                tabIndex={voto === opcao.value || (voto === null && index === 0) ? 0 : -1}
                onSelect={() => {
                  setVoto(opcao.value);
                  setErrors((previous) => ({ ...previous, voto: undefined }));
                  setSuccess(null);
                }}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(element) => {
                  radioRefs.current[index] = element;
                }}
              />
            ))}
          </div>
          {errors.voto && (
            <p id="opcao-voto-error" role="alert" className="text-sm text-red-600">
              {errors.voto}
            </p>
          )}
        </div>

        {submitError && <FeedbackMessage variant="error" message={submitError} />}

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className={buttonPrimary}>
            {submitting ? (
              <>
                <LoadingSpinner size={16} label="Registrando voto…" />
                Registrando…
              </>
            ) : (
              'Registrar voto'
            )}
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner label="Carregando pautas ativas…" />}
    </div>
  );
}
