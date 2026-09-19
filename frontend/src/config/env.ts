/**
 * Acesso tipado às variáveis de ambiente do Vite (import.meta.env).
 * Todas as variáveis relevantes da aplicação devem ser expostas aqui.
 */
const DEFAULT_API_BASE_URL = 'http://localhost:8080/v1';

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
} as const;
