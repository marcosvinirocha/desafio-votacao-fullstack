import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS dinamicamente com suporte a conflitos do Tailwind.
 * Uso: cn('base', condicional ? 'ativa' : 'inativa', customClassName)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
