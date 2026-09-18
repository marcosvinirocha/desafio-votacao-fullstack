package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.VotoRequest;
import com.dbserver.votacao.dto.response.ResultadoVotacaoResponse;
import com.dbserver.votacao.dto.response.VotoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.model.SessaoVotacao;
import com.dbserver.votacao.model.Voto;
import com.dbserver.votacao.model.enums.OpcaoVoto;
import com.dbserver.votacao.repository.VotoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VotoServiceTest {

    @Mock
    private VotoRepository votoRepository;

    @Mock
    private PautaService pautaService;

    @Mock
    private SessaoVotacaoService sessaoVotacaoService;

    @InjectMocks
    private VotoService votoService;

    @Test
    @DisplayName("Deve registrar voto com sucesso quando a sessao estiver aberta e associado nao votou")
    void registrarVoto_ComSucesso() {
        Pauta pauta = Pauta.builder().id(1L).build();
        SessaoVotacao sessao = SessaoVotacao.builder()
                .dataAbertura(LocalDateTime.now().minusMinutes(1))
                .dataEncerramento(LocalDateTime.now().plusMinutes(5))
                .build();

        VotoRequest request = new VotoRequest(1L, "12345678901", OpcaoVoto.SIM);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoService.buscarPorPautaId(1L)).thenReturn(sessao);
        when(votoRepository.existsByPautaIdAndAssociadoId(1L, "12345678901")).thenReturn(false);
        when(votoRepository.save(any(Voto.class))).thenAnswer(i -> {
            Voto v = i.getArgument(0);
            v.setId(100L);
            v.setDataVoto(LocalDateTime.now());
            return v;
        });

        VotoResponse response = votoService.registrarVoto(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("12345678901", response.getAssociadoId());
        assertEquals(OpcaoVoto.SIM, response.getVoto());
        verify(votoRepository, times(1)).save(any(Voto.class));
    }

    @Test
    @DisplayName("Deve lancar BusinessException quando a sessao de votacao estiver encerrada")
    void registrarVoto_SessaoEncerrada_DeveLancarExcecao() {
        Pauta pauta = Pauta.builder().id(1L).build();
        SessaoVotacao sessao = SessaoVotacao.builder()
                .dataAbertura(LocalDateTime.now().minusMinutes(10))
                .dataEncerramento(LocalDateTime.now().minusMinutes(1))
                .build();

        VotoRequest request = new VotoRequest(1L, "12345678901", OpcaoVoto.SIM);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoService.buscarPorPautaId(1L)).thenReturn(sessao);

        assertThrows(BusinessException.class, () -> votoService.registrarVoto(request));
        verify(votoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lancar BusinessException quando o associado ja votou na pauta")
    void registrarVoto_VotoDuplicado_DeveLancarExcecao() {
        Pauta pauta = Pauta.builder().id(1L).build();
        SessaoVotacao sessao = SessaoVotacao.builder()
                .dataAbertura(LocalDateTime.now().minusMinutes(1))
                .dataEncerramento(LocalDateTime.now().plusMinutes(5))
                .build();

        VotoRequest request = new VotoRequest(1L, "12345678901", OpcaoVoto.SIM);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoService.buscarPorPautaId(1L)).thenReturn(sessao);
        when(votoRepository.existsByPautaIdAndAssociadoId(1L, "12345678901")).thenReturn(true);

        assertThrows(BusinessException.class, () -> votoService.registrarVoto(request));
        verify(votoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve calcular resultado da pauta aprovada corretamente")
    void obterResultado_PautaAprovada() {
        Pauta pauta = Pauta.builder().id(1L).titulo("Pauta Teste").build();
        SessaoVotacao sessao = SessaoVotacao.builder()
                .dataAbertura(LocalDateTime.now().minusMinutes(10))
                .dataEncerramento(LocalDateTime.now().minusMinutes(1))
                .build();

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoService.buscarPorPautaId(1L)).thenReturn(sessao);
        when(votoRepository.countByPautaIdAndVoto(1L, OpcaoVoto.SIM)).thenReturn(5L);
        when(votoRepository.countByPautaIdAndVoto(1L, OpcaoVoto.NAO)).thenReturn(2L);
        when(votoRepository.countByPautaId(1L)).thenReturn(7L);

        ResultadoVotacaoResponse resultado = votoService.obterResultado(1L);

        assertNotNull(resultado);
        assertEquals("APROVADA", resultado.getResultado());
        assertEquals(5L, resultado.getVotosSim());
        assertEquals(2L, resultado.getVotosNao());
        assertTrue(resultado.isSessaoEncerrada());
    }
}
