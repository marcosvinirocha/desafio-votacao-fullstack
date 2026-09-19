import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import type { PautaFormValues } from '@/components/common/PautaForm';
import { ROUTES } from '@/config/routes';
import type { AbrirSessaoPayload, RegistrarVotoPayload } from '@/types/domain';

/*
 * TODO(wire-api): substituir os stubs abaixo por services/hooks de API
 * (GET/POST /v1/pautas, POST /v1/sessoes/abrir, POST /v1/votos, GET /v1/pautas/{id}/resultado).
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.gestaoPautas} replace /> },
      {
        path: ROUTES.gestaoPautas,
        lazy: () =>
          import('@/pages/GestaoPautas').then((module) => ({
            Component: () => (
              <module.GestaoPautas
                pautas={[]}
                onCreatePauta={async (values: PautaFormValues) => {
                  // TODO(wire-api): POST /v1/pautas
                  void values;
                }}
                onAbrirSessao={async (payload: AbrirSessaoPayload) => {
                  // TODO(wire-api): POST /v1/sessoes/abrir
                  void payload;
                }}
              />
            ),
          })),
      },
      {
        path: ROUTES.votacao,
        lazy: () =>
          import('@/pages/VotacaoAssociado').then((module) => ({
            Component: () => (
              <module.VotacaoAssociado
                pautasAtivas={[]}
                onVotar={async (payload: RegistrarVotoPayload) => {
                  // TODO(wire-api): POST /v1/votos
                  void payload;
                }}
              />
            ),
          })),
      },
      {
        path: ROUTES.resultados,
        lazy: () =>
          import('@/pages/PainelResultados').then((module) => ({
            Component: () => <module.PainelResultados resultados={[]} />,
          })),
      },
    ],
  },
  {
    path: ROUTES.notFound,
    lazy: () => import('@/pages/NotFound').then((module) => ({ Component: module.default })),
  },
]);
