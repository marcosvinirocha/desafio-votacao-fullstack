package com.dbserver.votacao.service;

import com.dbserver.votacao.dto.request.AbrirSessaoRequest;
import com.dbserver.votacao.dto.response.SessaoVotacaoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.exception.ResourceNotFoundException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.model.SessaoVotacao;
import com.dbserver.votacao.repository.SessaoVotacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SessaoVotacaoService {

    private static final long DURACAO_DEFAULT_MINUTOS = 1L;

    private final SessaoVotacaoRepository sessaoVotacaoRepository;
    private final PautaService pautaService;

    @Transactional
    public SessaoVotacaoResponse abrirSessao(AbrirSessaoRequest request) {
        Pauta pauta = pautaService.buscarPorId(request.getPautaId());

        if (sessaoVotacaoRepository.existsByPautaId(pauta.getId())) {
            throw new BusinessException("Já existe uma sessão de votação criada para esta pauta.");
        }

        long duracao = (request.getDuracaoMinutos() != null && request.getDuracaoMinutos() > 0)
                ? request.getDuracaoMinutos()
                : DURACAO_DEFAULT_MINUTOS;

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime encerramento = agora.plusMinutes(duracao);

        SessaoVotacao sessao = SessaoVotacao.builder()
                .pauta(pauta)
                .dataAbertura(agora)
                .dataEncerramento(encerramento)
                .build();

        SessaoVotacao sessaoSalva = sessaoVotacaoRepository.save(sessao);
        return toResponse(sessaoSalva);
    }

    @Transactional(readOnly = true)
    public SessaoVotacao buscarPorPautaId(Long pautaId) {
        return sessaoVotacaoRepository.findByPautaId(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma sessão de votação encontrada para a pauta ID: " + pautaId));
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