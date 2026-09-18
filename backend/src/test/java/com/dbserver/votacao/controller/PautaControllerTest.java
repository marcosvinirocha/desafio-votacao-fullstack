package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.PautaRequest;
import com.dbserver.votacao.dto.response.PautaResponse;
import com.dbserver.votacao.dto.response.ResultadoVotacaoResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.service.PautaService;
import com.dbserver.votacao.service.VotoService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest (PautaController.class)
class PautaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PautaService pautaService;

    @MockitoBean
    private VotoService votoService;

    @Test
    @DisplayName("POST /v1/pautas - Deve criar pauta e retornar HTTP 201 Created")
    void criarPauta_ComDadosValidos_DeveRetornarCreated() throws Exception {
        PautaRequest request = new PautaRequest("Nova Pauta", "Descrição detalhada");
        PautaResponse response = PautaResponse.builder()
                .id(1L)
                .titulo("Nova Pauta")
                .descricao("Descrição detalhada")
                .dataCriacao(LocalDateTime.now())
                .build();

        when(pautaService.criarPauta(any(PautaRequest.class))).thenReturn(response);

        mockMvc.perform(post("/v1/pautas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.titulo").value("Nova Pauta"))
                .andExpect(jsonPath("$.descricao").value("Descrição detalhada"));
    }

    @Test
    @DisplayName("POST /v1/pautas - Deve retornar HTTP 400 ao enviar pauta sem título")
    void criarPauta_SemTitulo_DeveRetornarBadRequest() throws Exception {
        PautaRequest requestInvalido = new PautaRequest("", "Descrição");

        mockMvc.perform(post("/v1/pautas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /v1/pautas - Deve listar todas as pautas com HTTP 200 OK")
    void listarPautas_DeveRetornarListaDePautas() throws Exception {
        PautaResponse pauta1 = PautaResponse.builder().id(1L).titulo("Pauta 1").build();
        PautaResponse pauta2 = PautaResponse.builder().id(2L).titulo("Pauta 2").build();

        when(pautaService.listarTodas()).thenReturn(List.of(pauta1, pauta2));

        mockMvc.perform(get("/v1/pautas")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    @DisplayName("GET /v1/pautas/{id}/resultado - Deve retornar resultado da votação com HTTP 200 OK")
    void obterResultado_QuandoPautaExiste_DeveRetornarResultado() throws Exception {
        ResultadoVotacaoResponse resultado = ResultadoVotacaoResponse.builder()
                .pautaId(1L)
                .tituloPauta("Pauta 1")
                .votosSim(10L)
                .votosNao(2L)
                .totalVotos(12L)
                .resultado("APROVADA")
                .sessaoEncerrada(true)
                .build();

        when(votoService.obterResultado(1L)).thenReturn(resultado);

        mockMvc.perform(get("/v1/pautas/1/resultado")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pautaId").value(1L))
                .andExpect(jsonPath("$.resultado").value("APROVADA"))
                .andExpect(jsonPath("$.votosSim").value(10));
    }

    @Test
    @DisplayName("GET /v1/pautas/{id}/resultado - Deve retornar HTTP 404 Not Found quando pauta não existir")
    void obterResultado_QuandoPautaNaoExiste_DeveRetornarNotFound() throws Exception {
        when(votoService.obterResultado(99L))
                .thenThrow(new ResourceNotFoundException("Pauta não encontrada com o ID: 99"));

        mockMvc.perform(get("/v1/pautas/99/resultado")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
