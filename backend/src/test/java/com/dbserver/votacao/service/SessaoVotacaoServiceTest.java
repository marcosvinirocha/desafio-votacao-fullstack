package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.AbrirSessaoRequest;
import com.dbserver.votacao.dto.response.SessaoVotacaoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.model.SessaoVotacao;
import com.dbserver.votacao.repository.SessaoVotacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class SessaoVotacaoServiceTest {

    @Mock
    private SessaoVotacaoRepository sessaoVotacaoRepository;

    @Mock
    private PautaService pautaService;

    @InjectMocks
    private SessaoVotacaoService sessaoVotacaoService;



    @Test
    @DisplayName("Deve abrir sessao com tempo customizado quando informado")
    void abrirSessao_ComTempoCustomizado_DeveCriarComSucesso() {
        Pauta pauta = Pauta.builder().id(1L).titulo("Pauta Teste").build();
        AbrirSessaoRequest request = new AbrirSessaoRequest(1L, 5);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoRepository.existsByPautaId(1L)).thenReturn(false);
        when(sessaoVotacaoRepository.save(any(SessaoVotacao.class))).thenAnswer(invocation -> {
            SessaoVotacao s = invocation.getArgument(0);
            s.setId(10L);
            return s;
        });

        SessaoVotacaoResponse response = sessaoVotacaoService.abrirSessao(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertTrue(response.isAberta());
        verify(sessaoVotacaoRepository, times(1)).save(any(SessaoVotacao.class));
    }

    @Test
    @DisplayName("Deve abrir sessao com tempo padrao de 1 minuto quando duracao nao informada")
    void abrirSessao_SemTempoInformado_DeveUsarTempoPadrao() {
        Pauta pauta = Pauta.builder().id(1L).titulo("Pauta Teste").build();
        AbrirSessaoRequest request = new AbrirSessaoRequest(1L, null);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoRepository.existsByPautaId(1L)).thenReturn(false);
        when(sessaoVotacaoRepository.save(any(SessaoVotacao.class))).thenAnswer(i -> {
            SessaoVotacao s = i.getArgument(0);
            s.setId(10L);
            return s;
        });

        SessaoVotacaoResponse response = sessaoVotacaoService.abrirSessao(request);

        assertNotNull(response);
        verify(sessaoVotacaoRepository, times(1)).save(any(SessaoVotacao.class));
    }


    @Test
    @DisplayName("Deve retornar lista de DTOs com todas as sessoes cadastradas")
    void deveRetornarListaDeSessoes() {
        // Arrange
        Pauta pauta = Pauta.builder().id(1L).titulo("Pauta de Teste").build();
        SessaoVotacao sessao = SessaoVotacao.builder()
                .id(10L)
                .pauta(pauta)
                .dataAbertura(LocalDateTime.now())
                .dataEncerramento(LocalDateTime.now().plusMinutes(1))
                .build();

        given(sessaoVotacaoRepository.findAll()).willReturn(List.of(sessao));

        // Act
        List<SessaoVotacaoResponse> resultado = sessaoVotacaoService.findAll();

        // Assert
        assertThat(resultado).hasSize(1);
        SessaoVotacaoResponse dto = resultado.get(0);
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getPautaId()).isEqualTo(1L);
        assertThat(dto.getTituloPauta()).isEqualTo("Pauta de Teste");
        assertThat(dto.getDataAbertura()).isNotNull();

        verify(sessaoVotacaoRepository).findAll();
    }

    @Test
    @DisplayName("Deve lancar BusinessException ao tentar abrir sessao duplicada para a mesma pauta")
    void abrirSessao_SessaoJaExistente_DeveLancarExcecao() {
        Pauta pauta = Pauta.builder().id(1L).build();
        AbrirSessaoRequest request = new AbrirSessaoRequest(1L, 3);

        when(pautaService.buscarPorId(1L)).thenReturn(pauta);
        when(sessaoVotacaoRepository.existsByPautaId(1L)).thenReturn(true);

        assertThrows(BusinessException.class, () -> sessaoVotacaoService.abrirSessao(request));
        verify(sessaoVotacaoRepository, never()).save(any());
    }
}
