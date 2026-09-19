import axios from 'axios';

import { env } from '@/config/env';

/**
 * Cliente HTTP central da aplicação (axios).
 * Adicione interceptors de autenticação, logging e tratamento de erros aqui,
 * de forma desacoplada das camadas de negócio.
 */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
