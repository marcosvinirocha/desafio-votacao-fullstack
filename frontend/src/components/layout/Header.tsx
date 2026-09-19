import { useLocation } from 'react-router-dom';

import { PAGE_TITLES } from '@/config/navigation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/utils/cn';

/** Cabeçalho superior com o título da página ativa e o estado de conexão. */
export function Header() {
  const { pathname } = useLocation();
  const isOnline = useOnlineStatus();
  const title = PAGE_TITLES[pathname] ?? 'Sistema de Votação';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>

      <span
        role="status"
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
          isOnline
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700',
        )}
      >
        <span
          className={cn('size-2 rounded-full', isOnline ? 'bg-green-500' : 'bg-red-500')}
          aria-hidden="true"
        />
        {isOnline ? 'Conectado' : 'Offline'}
      </span>
    </header>
  );
}
