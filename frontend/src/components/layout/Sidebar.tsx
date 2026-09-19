import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Tooltip from '@radix-ui/react-tooltip';
import { List, LayoutGrid, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const buttonContent = (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        isActive
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{buttonContent}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={12}
              className="z-50 rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 shadow-md animate-in fade-in-0 zoom-in-95"
            >
              {label}
              <Tooltip.Arrow className="fill-zinc-800" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return buttonContent;
};

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeList, setActiveList] = useState<'primeira' | 'segunda'>('primeira');

  return (
    <Collapsible.Root
      open={!isCollapsed}
      onOpenChange={(open) => setIsCollapsed(!open)}
      className={cn(
        'relative flex h-screen flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header / Logo */}
      <div className="space-y-6">
        <div className="flex h-10 items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <Layers className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-semibold text-zinc-100 truncate">
                Painel
              </span>
            )}
          </div>

          <Collapsible.Trigger asChild>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              aria-label={isCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              ) }
            </button>
          </Collapsible.Trigger>
        </div>

        {/* Links de Navegação das Listagens */}
        <nav className="space-y-1">
          <div className="px-2 py-1">
            {!isCollapsed && (
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Listagens
              </span>
            )}
          </div>

          <NavItem
            icon={List}
            label="Primeira Listagem"
            isActive={activeList === 'primeira'}
            isCollapsed={isCollapsed}
            onClick={() => setActiveList('primeira')}
          />

          <NavItem
            icon={LayoutGrid}
            label="Segunda Listagem"
            isActive={activeList === 'segunda'}
            isCollapsed={isCollapsed}
            onClick={() => setActiveList('segunda')}
          />
        </nav>
      </div>

      {/* Footer / Perfil */}
      <div className="border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex shrink-0 items-center justify-center text-xs font-medium text-zinc-300">
            US
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-zinc-200 truncate">
                Usuário
              </span>
              <span className="text-xs text-zinc-500 truncate">
                usuario@email.com
              </span>
            </div>
          )}
        </div>
      </div>
    </Collapsible.Root>
  );
};