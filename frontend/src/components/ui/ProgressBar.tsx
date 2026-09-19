import { cn } from '@/utils/cn';

interface ProgressBarProps {
  /** Quantidade de votos "SIM". */
  sim: number;
  /** Quantidade de votos "NÃO". */
  nao: number;
  /** Rótulo acessível da barra. */
  label?: string;
  className?: string;
}

/** Barra de progresso segmentada (SIM vs NÃO) com percentuais. */
export function ProgressBar({ sim, nao, label = 'Apurado', className }: ProgressBarProps) {
  const total = sim + nao;
  const simPercent = total === 0 ? 0 : Math.round((sim / total) * 100);
  const naoPercent = total === 0 ? 0 : Math.round((nao / total) * 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={simPercent}
        aria-valuetext={`Sim ${simPercent}%, Não ${naoPercent}%`}
        className="flex h-4 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full bg-green-500 transition-[width] duration-300"
          style={{ width: `${simPercent}%` }}
        />
        <div
          className="h-full bg-red-500 transition-[width] duration-300"
          style={{ width: `${naoPercent}%` }}
        />
      </div>
    </div>
  );
}
