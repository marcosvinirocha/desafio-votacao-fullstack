package com.dbserver.votacao.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbrirSessaoRequest {

    @NotNull(message = "O ID da pauta é obrigatório")
    private Long pautaId;

    private Integer duracaoMinutos;
}
