package com.dbserver.votacao.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessaoVotacaoResponse {

    private Long id;
    private Long pautaId;
    private String tituloPauta;
    private LocalDateTime dataAbertura;
    private LocalDateTime dataEncerramento;
    private boolean aberta;
}
