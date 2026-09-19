import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/config/routes';

/**
 * Configuração central do router.
 * Páginas são carregadas de forma lazy (code-splitting por rota),
 * seguindo o padrão de roteamento de dados do React Router v7.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    lazy: () => import('@/pages/Home').then((module) => ({ Component: module.default })),
  },
  {
    path: ROUTES.notFound,
    lazy: () => import('@/pages/NotFound').then((module) => ({ Component: module.default })),
  },
]);
