/** Envelope genérico de respostas da API. */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/** Modela o ErrorResponse retornado pelo backend em erros de negócio/validação. */
export interface ApiError {
  timestamp?: string;
  status?: number;
  message: string;
  path?: string;
  errors?: Record<string, string>;
}
