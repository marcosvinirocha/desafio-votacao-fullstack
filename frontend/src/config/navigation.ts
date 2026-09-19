import type { LucideIcon } from 'lucide-react';
import { BarChart3, ClipboardList, Vote } from 'lucide-react';

import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/** Itens de navegação exibidos na Sidebar. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Gestão de Pautas', to: ROUTES.gestaoPautas, icon: ClipboardList },
  { label: 'Votação', to: ROUTES.votacao, icon: Vote },
  { label: 'Resultados', to: ROUTES.resultados, icon: BarChart3 },
];

/** Título da página ativa exibido no Header. */
export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.gestaoPautas]: 'Gestão de Pautas',
  [ROUTES.votacao]: 'Votação',
  [ROUTES.resultados]: 'Resultados',
};
