package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.AbrirSessaoRequest;
import com.dbserver.votacao.dto.response.SessaoVotacaoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.model.SessaoVotacao;
import com.dbserver.votacao.repository.SessaoVotacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j 
@Service
@RequiredArgsConstructor
public class SessaoVotacaoService {

    private static final long DURACAO_DEFAULT_MINUTOS = 1L;

    private final SessaoVotacaoRepository sessaoVotacaoRepository;
    private final PautaService pautaService;

    @Transactional
    public SessaoVotacaoResponse abrirSessao(AbrirSessaoRequest request) {
        log.info("Solicitacao para abrir sessao de votacao para a pauta ID: {}", request.getPautaId());
        Pauta pauta = pautaService.buscarPorId(request.getPautaId());

        if (sessaoVotacaoRepository.existsByPautaId(pauta.getId())) {
            log.warn("Tentativa invalida: Ja existe uma sessao aberta ou encerrada para a pauta ID: {}", pauta.getId());
            throw new BusinessException("Já existe uma sessão de votação criada para esta pauta.");
        }

        long duracao = (request.getDuracaoMinutos() != null && request.getDuracaoMinutos() > 0)
                ? request.getDuracaoMinutos()
                : DURACAO_DEFAULT_MINUTOS;
        log.debug("Definindo duracao da sessao para {} minutos na pauta ID: {}", duracao, pauta.getId());

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime encerramento = agora.plusMinutes(duracao);

        SessaoVotacao sessao = SessaoVotacao.builder()
                .pauta(pauta)
                .dataAbertura(agora)
                .dataEncerramento(encerramento)
                .build();

        SessaoVotacao sessaoSalva = sessaoVotacaoRepository.save(sessao);
        log.info("Sessao de votacao ID {} aberta com sucesso para a pauta ID {}. Valida ate: {}",
                sessaoSalva.getId(), pauta.getId(), encerramento);
        return toResponse(sessaoSalva);
    }

    @Transactional(readOnly = true)
    public SessaoVotacao buscarPorPautaId(Long pautaId) {
        log.debug("Buscando sessao de votacao associada a pauta ID: {}", pautaId);
        return sessaoVotacaoRepository.findByPautaId(pautaId)
                .orElseThrow(() -> {
                    log.warn("Sessao de votacao nao encontrada para a pauta ID: {}", pautaId);
                    return new ResourceNotFoundException("Sessão de votação não encontrada para a pauta ID: " + pautaId);
                });
    }

    @Transactional(readOnly = true)
    public List<SessaoVotacaoResponse> findAll() {
        log.debug("Buscando todas as sessões");
        return sessaoVotacaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SessaoVotacaoResponse toResponse(SessaoVotacao sessao) {
        return SessaoVotacaoResponse.builder()
                .id(sessao.getId())
                .pautaId(sessao.getPauta().getId())
                .tituloPauta(sessao.getPauta().getTitulo())
                .dataAbertura(sessao.getDataAbertura())
                .dataEncerramento(sessao.getDataEncerramento())
                .aberta(sessao.isAberta())
                .build();
    }
}