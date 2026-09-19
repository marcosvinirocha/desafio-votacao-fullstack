/**
 * Modelos de domínio do Sistema de Votação, espelhando o contrato da API do backend.
 * Sem `enum` (erasableSyntaxOnly): unions de string.
 */

export type OpcaoVoto = 'SIM' | 'NAO';

export type ResultadoStatus = 'APROVADA' | 'REPROVADA' | 'EMPATE' | 'SESSÃO EM ANDAMENTO';

/** Sem sessão criada / Em andamento (ativa) / Encerrada. */
export type PautaStatus = 'semSessao' | 'emAndamento' | 'encerrada';

/** Response de `POST /v1/pautas` e `GET /v1/pautas`. */
export interface Pauta {
  id: number;
  titulo: string;
  descricao: string | null;
  dataCriacao: string;
}

/** Response de `POST /v1/sessoes/abrir`. */
export interface SessaoVotacao {
  id: number;
  pautaId: number;
  tituloPauta: string;
  dataAbertura: string;
  dataEncerramento: string;
  aberta: boolean;
}

/** Response de `GET /v1/pautas/{id}/resultado`. */
export interface ResultadoVotacao {
  pautaId: number;
  tituloPauta: string;
  votosSim: number;
  votosNao: number;
  totalVotos: number;
  resultado: ResultadoStatus;
  sessaoEncerrada: boolean;
}

/** Response de `POST /v1/votos`. */
export interface Voto {
  id: number;
  pautaId: number;
  associadoId: string;
  voto: OpcaoVoto;
  dataVoto: string;
}

/** Pauta acompanhada do status derivado da sessão (para cards/listagem). */
export interface PautaComStatus {
  pauta: Pauta;
  status: PautaStatus;
}

/** Payload de `POST /v1/sessoes/abrir`. */
export interface AbrirSessaoPayload {
  pautaId: number;
  duracaoMinutos: number;
}

/** Payload de `POST /v1/votos`. */
export interface RegistrarVotoPayload {
  pautaId: number;
  associadoId: string;
  voto: OpcaoVoto;
}
