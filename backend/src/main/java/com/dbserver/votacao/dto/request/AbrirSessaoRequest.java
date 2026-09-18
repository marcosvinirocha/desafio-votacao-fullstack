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

    @NotNull(message = "O ID da pauta é obrigatório.")
    private Long pautaId;

    // Se nulo ou menor/igual a zero, a aplicação assume 1 minuto por padrão
    private Long duracaoMinutos;
}
