import { CalendarDays, Clock3 } from 'lucide-react';

import { BadgeStatus } from '@/components/ui/BadgeStatus';
import { buttonPrimary } from '@/components/ui/styles';
import type { Pauta, PautaStatus } from '@/types/domain';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

interface PautaCardProps {
  pauta: Pauta;
  status: PautaStatus;
  onAbrirSessao: (pauta: Pauta) => void;
  className?: string;
}

/** Card individual de pauta com status da sessão e ação de abertura. */
export function PautaCard({ pauta, status, onAbrirSessao, className }: PautaCardProps) {
  const hasSessao = status !== 'semSessao';

  return (
    <article
      className={cn(
        'flex h-full flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900">{pauta.titulo}</h3>
        <BadgeStatus status={status} />
      </div>

      {pauta.descricao && <p className="text-sm text-neutral-600">{pauta.descricao}</p>}

      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <CalendarDays size={14} aria-hidden="true" />
          {formatDate(pauta.dataCriacao)}
        </span>

        <button
          type="button"
          onClick={() => onAbrirSessao(pauta)}
          disabled={hasSessao}
          className={cn(buttonPrimary, 'py-2')}
        >
          <Clock3 size={16} aria-hidden="true" />
          {hasSessao ? 'Sessão criada' : 'Abrir sessão'}
        </button>
      </div>
    </article>
  );
}
