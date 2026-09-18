package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.PautaRequest;
import com.dbserver.votacao.dto.response.PautaResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.repository.PautaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j 
@Service
@RequiredArgsConstructor
public class PautaService {

    private final PautaRepository pautaRepository;

    @Transactional
    public PautaResponse criarPauta(PautaRequest request) {
        log.info("Iniciando criacao de nova pauta com titulo: '{}'", request.getTitulo());
        Pauta pauta = Pauta.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .build();

        Pauta pautaSalva = pautaRepository.save(pauta);
        log.info("Pauta criada com sucesso. ID: {}", pautaSalva.getId());
        return toResponse(pautaSalva);
    }

    @Transactional(readOnly = true)
    public Pauta buscarPorId(Long id) {
        log.debug("Buscando pauta por ID: {}", id);
        return pautaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Pauta com ID {} nao foi encontrada", id);
                    return new ResourceNotFoundException("Pauta não encontrada com o ID: " + id);
                });
    }

    @Transactional(readOnly = true)
    public List<PautaResponse> listarTodas() {
        log.debug("Buscando todas as pautas cadastradas");
        List<PautaResponse> pautas = pautaRepository.findAll().stream()
                .map(p -> PautaResponse.builder()
                        .id(p.getId())
                        .titulo(p.getTitulo())
                        .descricao(p.getDescricao())
                        .dataCriacao(p.getDataCriacao())
                        .build())
                .toList();

        log.debug("Total de pautas encontradas: {}", pautas.size());
        return pautas;
    }

    private PautaResponse toResponse(Pauta pauta) {
        return PautaResponse.builder()
                .id(pauta.getId())
                .titulo(pauta.getTitulo())
                .descricao(pauta.getDescricao())
                .dataCriacao(pauta.getDataCriacao())
                .build();
    }
}
