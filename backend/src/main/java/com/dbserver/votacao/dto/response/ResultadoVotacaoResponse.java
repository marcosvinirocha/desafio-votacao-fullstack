package com.dbserver.votacao.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoVotacaoResponse {

    private Long pautaId;
    private String tituloPauta;
    private long votosSim;
    private long votosNao;
    private long totalVotos;
    private String resultado; // Ex: "APROVADA", "REPROVADA", "EMPATE", "SESSÃO EM ANDAMENTO"
    private boolean sessaoEncerrada;
}
