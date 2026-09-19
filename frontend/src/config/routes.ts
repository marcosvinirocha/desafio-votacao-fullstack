/**
 * Constantes globais de rotas da aplicação.
 * Centraliza os caminhos para evitar strings mágicas espalhadas no código.
 */
export const ROUTES = {
  home: '/',
  notFound: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
