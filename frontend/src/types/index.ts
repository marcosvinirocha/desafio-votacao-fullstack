/**
 * Tipos globais de infraestrutura.
 * Mantenha aqui apenas tipos genéricos e reutilizáveis (sem regras de negócio).
 */

/** Envelope padrão de respostas da API. */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/** Formato padrão de erro da API. */
export interface ApiError {
  status?: number;
  message: string;
  details?: unknown;
}
