package com.dbserver.votacao.dto.request;

import com.dbserver.votacao.model.enums.OpcaoVoto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VotoRequest {

    @NotNull(message = "O ID da pauta é obrigatório.")
    private Long pautaId;

    @NotBlank(message = "O ID do associado (ou CPF) é obrigatório.")
    private String associadoId;

    @NotNull(message = "A opção de voto (SIM/NAO) é obrigatória.")
    private OpcaoVoto voto;
}
