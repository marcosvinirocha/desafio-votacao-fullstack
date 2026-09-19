import * as Collapsible from '@radix-ui/react-collapsible';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { LucideIcon } from 'lucide-react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from '@/config/navigation';
import { cn } from '@/utils/cn';

interface SidebarLinkProps {
  label: string;
  to: string;
  icon: LucideIcon;
  collapsed: boolean;
}

function SidebarLink({ label, to, icon: Icon, collapsed }: SidebarLinkProps) {
  const link = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        )
      }
    >
      <Icon size={20} aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  // Estado retraído: exibe apenas o ícone com tooltip para o rótulo.
  if (!collapsed) {
    return link;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          className="z-50 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          {label}
          <Tooltip.Arrow className="fill-neutral-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** Barra lateral retrátil de navegação principal. */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={300}>
      <Collapsible.Root open={!collapsed} onOpenChange={(open) => setCollapsed(!open)} asChild>
        <aside
          aria-label="Navegação principal"
          className={cn(
            'sticky top-0 flex h-screen shrink-0 flex-col border-r border-neutral-200 bg-white',
            'transition-[width] duration-200',
            collapsed ? 'w-16' : 'w-64',
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
            {!collapsed && (
              <span className="text-sm font-semibold tracking-wide text-neutral-900">Votação</span>
            )}
            <Collapsible.Trigger asChild>
              <button
                type="button"
                aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {collapsed ? (
                  <ChevronsRight size={20} aria-hidden="true" />
                ) : (
                  <ChevronsLeft size={20} aria-hidden="true" />
                )}
              </button>
            </Collapsible.Trigger>
          </div>

          <nav aria-label="Páginas" className="flex-1 space-y-1 px-2 py-4">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} {...item} collapsed={collapsed} />
            ))}
          </nav>
        </aside>
      </Collapsible.Root>
    </Tooltip.Provider>
  );
}
