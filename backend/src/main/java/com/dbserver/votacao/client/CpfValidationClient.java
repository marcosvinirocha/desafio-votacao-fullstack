package com.dbserver.votacao.client;

import com.dbserver.votacao.dto.response.CpfStatusResponse;

public interface CpfValidationClient {
    CpfStatusResponse validarCpf(String cpf);
}
