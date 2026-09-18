package com.dbserver.votacao.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PautaRequest {

    @NotBlank(message = "O título da pauta é obrigatório.")
    private String titulo;

    private String descricao;
}
