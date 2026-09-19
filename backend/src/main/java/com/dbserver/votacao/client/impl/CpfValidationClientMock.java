package com.dbserver.votacao.client.impl;

import com.dbserver.votacao.client.CpfValidationClient;
import com.dbserver.votacao.dto.response.CpfStatusResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.enums.StatusVoto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CpfValidationClientMock implements CpfValidationClient {

    private static final Logger log = LoggerFactory.getLogger(CpfValidationClientMock.class);

    @Override
    public CpfStatusResponse validarCpf(String cpf) {
        log.info("Simulando validação externa de CPF: {}", cpf);

        // Sanitize: remove caracteres não numéricos se houver pontuação
        String cleanCpf = (cpf != null) ? cpf.replaceAll("\\D", "") : "";

        if (cleanCpf.length() != 11) {
            log.warn("CPF inválido ou com formato incorreto: {}", cpf);
            throw new ResourceNotFoundException("CPF inválido ou não encontrado na base federal: " + cpf);
        }

        // Obtém o último dígito
        int ultimoDigito = Character.getNumericValue(cleanCpf.charAt(cleanCpf.length() - 1));

        // Dígito Par = ABLE_TO_VOTE | Dígito Ímpar = UNABLE_TO_VOTE
        if (ultimoDigito % 2 == 0) {
            log.info("CPF {} validado com status ABLE_TO_VOTE", cpf);
            return new CpfStatusResponse(StatusVoto.ABLE_TO_VOTE);
        } else {
            log.warn("CPF {} validado com status UNABLE_TO_VOTE", cpf);
            return new CpfStatusResponse(StatusVoto.UNABLE_TO_VOTE);
        }
    }
}
