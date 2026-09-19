import type { PautaStatus } from '@/types/domain';
import { cn } from '@/utils/cn';

const BADGE_STATUS_LABELS: Record<PautaStatus, string> = {
  semSessao: 'Sem sessão',
  emAndamento: 'Em andamento',
  encerrada: 'Encerrada',
};

const BADGE_STATUS_STYLES: Record<PautaStatus, string> = {
  semSessao: 'bg-neutral-100 text-neutral-600 ring-neutral-200',
  emAndamento: 'bg-green-50 text-green-700 ring-green-200',
  encerrada: 'bg-red-50 text-red-700 ring-red-200',
};

interface BadgeStatusProps {
  status: PautaStatus;
  className?: string;
}

/** Indicador visual do status da pauta (Ativa/Em andamento/Encerrada). */
export function BadgeStatus({ status, className }: BadgeStatusProps) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        BADGE_STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {BADGE_STATUS_LABELS[status]}
    </span>
  );
}
