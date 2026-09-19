import type { KeyboardEvent as ReactKeyboardEvent, ReactNode, Ref } from 'react';

import { cn } from '@/utils/cn';

interface OptionCardProps {
  id: string;
  label: string;
  icon: ReactNode;
  selected: boolean;
  /** Tabindex para o padrão de roving tabindex do grupo de rádio. */
  tabIndex?: number;
  onSelect: () => void;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** Ref para manipulação de foco pelo grupo. */
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

/** Opção de seleção estilizada e acessível (role="radio"). */
export function OptionCard({
  id,
  label,
  icon,
  selected,
  tabIndex = 0,
  onSelect,
  onKeyDown,
  disabled = false,
  ref,
  className,
}: OptionCardProps) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-base font-semibold',
        'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-blue-600 bg-blue-50 text-blue-700'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50',
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}
