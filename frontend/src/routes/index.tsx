import { useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import type { PautaFormValues } from '@/components/common/PautaForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { ROUTES } from '@/config/routes';
import { usePautaStore } from '@/stores/usePautaStore';
import { useSessaoStore } from '@/stores/useSessaoStore';
import type {
  AbrirSessaoPayload,
  PautaComStatus,
  //RegistrarVotoPayload,
  ResultadoVotacao,
} from '@/types/domain';

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
            Component: function GestaoPautasRoute() {
              const { pautas, fetchPautas, criarPauta } = usePautaStore();
              const { fetchSessoes, calcularStatusSessao, abrirSessao } = useSessaoStore();

              useEffect(() => {
                void fetchPautas();
                void fetchSessoes();
              }, [fetchPautas, fetchSessoes]);

              // Mapeia as pautas cruzando com as sessões ativas/encerradas na store
              const pautasComStatus: PautaComStatus[] = pautas.map((pauta) => ({
                pauta,
                status: calcularStatusSessao(pauta.id),
              }));

              return (
                <module.GestaoPautas
                  pautas={pautasComStatus}
                  onCreatePauta={async (values: PautaFormValues) => {
                    await criarPauta(values.titulo, values.descricao);
                  }}
                  onAbrirSessao={async (payload: AbrirSessaoPayload) => {
                    await abrirSessao(payload);
                  }}
                />
              );
            },
          })),
      },
      // {
      //   path: ROUTES.votacao,
      //   lazy: () =>
      //     import('@/pages/VotacaoAssociado').then((module) => ({
      //       Component: function VotacaoAssociadoRoute() {
      //         const { pautas, fetchPautas, votar } = usePautaStore();
      //         const { sessoes, fetchSessoes } = useSessaoStore();

      //         useEffect(() => {
      //           void fetchPautas();
      //           void fetchSessoes();
      //         }, [fetchPautas, fetchSessoes]);

      //         // Filtra pautas que possuem sessão aberta em andamento no momento
      //         const pautasAtivas = pautas.filter((pauta) => {
      //           const sessao = sessoes.find((s) => s.pautaId === pauta.id);
      //           if (!sessao) return false;

      //           const agora = Date.now();
      //           const inicio = new Date(sessao.dataAbertura).getTime();
      //           const fim = new Date(sessao.dataEncerramento).getTime();

      //           return agora >= inicio && agora <= fim && sessao.aberta;
      //         });

      //         return (
      //           <module.VotacaoAssociado
      //             pautasAtivas={pautasAtivas}
      //             onVotar={async (payload: RegistrarVotoPayload) => {
      //               await votar(payload.pautaId, payload.associadoId, payload.voto);
      //             }}
      //           />
      //         );
      //       },
      //     })),
      // },
      {
        path: ROUTES.resultados,
        lazy: () =>
          import('@/pages/PainelResultados').then((module) => ({
            Component: function PainelResultadosRoute() {
              const { pautas, fetchPautas } = usePautaStore();
              const { sessoes, fetchSessoes } = useSessaoStore();

              useEffect(() => {
                void fetchPautas();
                void fetchSessoes();
              }, [fetchPautas, fetchSessoes]);

              const resultados: ResultadoVotacao[] = pautas.map((p) => {
                const sessao = sessoes.find((s) => s.pautaId === p.id);
                const votosSim = 'votosSim' in p ? Number(p.votosSim) : 0;
                const votosNao = 'votosNao' in p ? Number(p.votosNao) : 0;
                const totalVotos = 'totalVotos' in p ? Number(p.totalVotos) : votosSim + votosNao;

                let resultado: ResultadoVotacao['resultado'] = 'EMPATE';
                if (votosSim > votosNao) resultado = 'APROVADA';
                if (votosNao > votosSim) resultado = 'REPROVADA';

                // Determina se a sessão encerrou verificando a ausência da sessão ou estouramento do horário de encerramento
                const sessaoEncerrada =
                  !sessao || new Date().getTime() > new Date(sessao.dataEncerramento).getTime();

                return {
                  pautaId: p.id,
                  tituloPauta: p.titulo,
                  votosSim,
                  votosNao,
                  totalVotos,
                  resultado,
                  sessaoEncerrada,
                };
              });

              return <module.PainelResultados resultados={resultados} />;
            },
          })),
      },
    ],
  },
  {
    path: ROUTES.notFound,
    lazy: () => import('@/pages/NotFound').then((module) => ({ Component: module.default })),
  },
]);
