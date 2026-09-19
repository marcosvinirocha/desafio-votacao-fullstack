/** Classes utilitárias compartilhadas entre componentes (formulários e botões). */

export const inputBase =
  'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 ' +
  'shadow-xs outline-none transition placeholder:text-neutral-400 ' +
  'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm ' +
  'font-semibold text-white transition-colors hover:bg-blue-700 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export const buttonSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white ' +
  'px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';
