import type { LucideIcon } from 'lucide-react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { cn } from '@/utils/cn';

export type FeedbackVariant = 'error' | 'success' | 'info' | 'warning';

const FEEDBACK_STYLES: Record<FeedbackVariant, { container: string; icon: LucideIcon }> = {
  error: { container: 'border-red-200 bg-red-50 text-red-800', icon: AlertCircle },
  success: { container: 'border-green-200 bg-green-50 text-green-800', icon: CheckCircle2 },
  info: { container: 'border-blue-200 bg-blue-50 text-blue-800', icon: Info },
  warning: { container: 'border-amber-200 bg-amber-50 text-amber-800', icon: AlertCircle },
};

interface FeedbackMessageProps {
  variant?: FeedbackVariant;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/** Alerta de feedback (erro/sucesso/info/warning) com anúncio acessível. */
export function FeedbackMessage({
  variant = 'info',
  message,
  onDismiss,
  className,
}: FeedbackMessageProps) {
  const Icon = FEEDBACK_STYLES[variant].icon;
  const isAlert = variant === 'error' || variant === 'warning';

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 text-sm',
        FEEDBACK_STYLES[variant].container,
        className,
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar mensagem"
          className="shrink-0 rounded-md p-1 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
