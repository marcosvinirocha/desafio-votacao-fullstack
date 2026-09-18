package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.VotoRequest;
import com.dbserver.votacao.dto.response.VotoResponse;
import com.dbserver.votacao.model.enums.OpcaoVoto;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest (VotoController.class)
class VotoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean // Padrão obrigatório no Spring Boot 4+
    private VotoService votoService;

    @Test
    @DisplayName("POST /v1/votos - Deve retornar HTTP 201 Created e VotoResponse")
    void registrarVoto_ComDadosValidos_DeveRetornarCreated() throws Exception {
        VotoRequest request = new VotoRequest(1L, "12345678901", OpcaoVoto.SIM);
        VotoResponse response = VotoResponse.builder()
                .id(10L)
                .pautaId(1L)
                .associadoId("12345678901")
                .voto(OpcaoVoto.SIM)
                .dataVoto(LocalDateTime.now())
                .build();

        when(votoService.registrarVoto(any(VotoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/v1/votos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.pautaId").value(1L))
                .andExpect(jsonPath("$.associadoId").value("12345678901"))
                .andExpect(jsonPath("$.voto").value("SIM"));
    }

    @Test
    @DisplayName("POST /v1/votos - Deve retornar HTTP 400 Bad Request ao enviar payload invalido")
    void registrarVoto_SemCamposObrigatorios_DeveRetornarBadRequest() throws Exception {
        VotoRequest requestInvalido = new VotoRequest(null, "", null);

        mockMvc.perform(post("/v1/votos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest());
    }
}