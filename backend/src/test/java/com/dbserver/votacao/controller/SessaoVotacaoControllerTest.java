package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.AbrirSessaoRequest;
import com.dbserver.votacao.dto.response.SessaoVotacaoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.service.SessaoVotacaoService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest (SessaoVotacaoController.class)
class SessaoVotacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SessaoVotacaoService sessaoVotacaoService;

    @Test
    @DisplayName("POST /v1/sessoes/abrir - Deve abrir sessão e retornar HTTP 201 Created")
    void abrirSessao_ComDadosValidos_DeveRetornarCreated() throws Exception {
        AbrirSessaoRequest request = AbrirSessaoRequest.builder()
                .pautaId(1L)
                .duracaoMinutos(5)
                .build();

        SessaoVotacaoResponse response = SessaoVotacaoResponse.builder()
                .id(10L)
                .pautaId(1L)
                .dataAbertura(LocalDateTime.now())
                .dataEncerramento(LocalDateTime.now().plusMinutes(5))
                .aberta(true)
                .build();

        when(sessaoVotacaoService.abrirSessao(any(AbrirSessaoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/v1/sessoes/abrir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.pautaId").value(1L))
                .andExpect(jsonPath("$.aberta").value(true));
    }

    @Test
    @DisplayName("POST /v1/sessoes/abrir - Deve retornar HTTP 400 Bad Request ao omitir pautaId")
    void abrirSessao_SemPautaId_DeveRetornarBadRequest() throws Exception {
        AbrirSessaoRequest requestInvalido = AbrirSessaoRequest.builder()
                .duracaoMinutos(5)
                .build();

        mockMvc.perform(post("/v1/sessoes/abrir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /v1/sessoes/abrir - Deve retornar HTTP 400 Bad Request ao tentar abrir sessão já existente")
    void abrirSessao_SessaoJaExistente_DeveRetornarBadRequest() throws Exception {
        AbrirSessaoRequest request = AbrirSessaoRequest.builder()
                .pautaId(1L)
                .build();

        when(sessaoVotacaoService.abrirSessao(any(AbrirSessaoRequest.class)))
                .thenThrow(new BusinessException("Já existe uma sessão de votação criada para esta pauta."));

        mockMvc.perform(post("/v1/sessoes/abrir")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
