import { Loader2 } from 'lucide-react';

import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  /** Tamanho do ícone em pixels. */
  size?: number;
  className?: string;
  /** Texto lido por leitores de tela. */
  label?: string;
}

export function LoadingSpinner({
  size = 24,
  className,
  label = 'Carregando…',
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      className={cn('inline-flex items-center gap-2 text-neutral-500', className)}
    >
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
