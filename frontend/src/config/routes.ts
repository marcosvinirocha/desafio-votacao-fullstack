/**
 * Constantes globais de rotas da aplicação.
 * Centraliza os caminhos para evitar strings mágicas espalhadas no código.
 */
export const ROUTES = {
  home: '/',
  gestaoPautas: '/pautas',
  votacao: '/votacao',
  resultados: '/resultados',
  notFound: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
