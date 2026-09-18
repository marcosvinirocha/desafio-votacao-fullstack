package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.PautaRequest;
import com.dbserver.votacao.dto.response.PautaResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.repository.PautaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PautaServiceTest {

    @Mock
    private PautaRepository pautaRepository;

    @InjectMocks
    private PautaService pautaService;

    @Test
    @DisplayName("Deve criar uma pauta com sucesso")
    void criarPauta_ComSucesso() {
        PautaRequest request = new PautaRequest("Nova Pauta", "Descrição da pauta");
        Pauta pautaSalva = Pauta.builder()
                .id(1L)
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .dataCriacao(LocalDateTime.now())
                .build();

        when(pautaRepository.save(any(Pauta.class))).thenReturn(pautaSalva);

        PautaResponse response = pautaService.criarPauta(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Nova Pauta", response.getTitulo());
        verify(pautaRepository, times(1)).save(any(Pauta.class));
    }

    @Test
    @DisplayName("Deve buscar pauta por ID com sucesso")
    void buscarPorId_QuandoExiste_DeveRetornarPauta() {
        Pauta pauta = Pauta.builder().id(1L).titulo("Pauta 1").build();
        when(pautaRepository.findById(1L)).thenReturn(Optional.of(pauta));

        Pauta resultado = pautaService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(pautaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Deve lancar ResourceNotFoundException quando pauta nao for encontrada")
    void buscarPorId_QuandoNaoExiste_DeveLancarExcecao() {
        when(pautaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> pautaService.buscarPorId(99L));
        verify(pautaRepository, times(1)).findById(99L);
    }
}
