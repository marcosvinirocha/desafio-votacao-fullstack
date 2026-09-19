package com.dbserver.votacao.client;

import com.dbserver.votacao.client.impl.CpfValidationClientMock;
import com.dbserver.votacao.dto.response.CpfStatusResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.enums.StatusVoto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CpfValidationClientMockTest {

    private CpfValidationClient client;

    @BeforeEach
    void setUp() {
        client = new CpfValidationClientMock();
    }

    @Test
    @DisplayName("Deve retornar ABLE_TO_VOTE quando o último dígito do CPF for par")
    void validarCpf_UltimoDigitoPar_DeveRetornarAbleToVote() {
        CpfStatusResponse response = client.validarCpf("12345678902");

        assertNotNull(response);
        assertEquals(StatusVoto.ABLE_TO_VOTE, response.status());
        assertTrue(response.isAbleToVote());
    }

    @Test
    @DisplayName("Deve retornar UNABLE_TO_VOTE quando o último dígito do CPF for ímpar")
    void validarCpf_UltimoDigitoImpar_DeveRetornarUnableToVote() {
        CpfStatusResponse response = client.validarCpf("12345678901");

        assertNotNull(response);
        assertEquals(StatusVoto.UNABLE_TO_VOTE, response.status());
        assertFalse(response.isAbleToVote());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando o CPF tiver tamanho inválido")
    void validarCpf_TamanhoInvalido_DeveLancarExcecao() {
        assertThrows(ResourceNotFoundException.class, () -> client.validarCpf("12345"));
    }
}