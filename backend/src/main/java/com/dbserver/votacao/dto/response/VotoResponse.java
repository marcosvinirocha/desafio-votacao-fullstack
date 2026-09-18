package com.dbserver.votacao.dto.response;

import com.dbserver.votacao.model.enums.OpcaoVoto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VotoResponse {

    private Long id;
    private Long pautaId;
    private String associadoId;
    private OpcaoVoto voto;
    private LocalDateTime dataVoto;
}
