package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.PautaRequest;
import com.dbserver.votacao.dto.response.PautaResponse;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.repository.PautaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PautaService {

    private final PautaRepository pautaRepository;

    @Transactional
    public PautaResponse criarPauta(PautaRequest request) {
        Pauta pauta = Pauta.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .build();

        Pauta pautaSalva = pautaRepository.save(pauta);
        return toResponse(pautaSalva);
    }

    @Transactional(readOnly = true)
    public Pauta buscarPorId(Long id) {
        return pautaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pauta não encontrada com o ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<PautaResponse> listarTodas() {
        return pautaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
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
