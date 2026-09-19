package com.dbserver.votacao.service;

import com.dbserver.votacao.client.CpfValidationClient;
import com.dbserver.votacao.dto.request.VotoRequest;
import com.dbserver.votacao.dto.response.CpfStatusResponse;
import com.dbserver.votacao.dto.response.ResultadoVotacaoResponse;
import com.dbserver.votacao.dto.response.VotoResponse;
import com.dbserver.votacao.exception.BusinessException;
import com.dbserver.votacao.model.Pauta;
import com.dbserver.votacao.model.SessaoVotacao;
import com.dbserver.votacao.model.Voto;
import com.dbserver.votacao.model.enums.OpcaoVoto;
import com.dbserver.votacao.repository.VotoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j 
@Service
@RequiredArgsConstructor
public class VotoService {

    private final VotoRepository votoRepository;
    private final PautaService pautaService;
    private final SessaoVotacaoService sessaoVotacaoService;
    private final CpfValidationClient cpfValidationClient;

    @Transactional
    public VotoResponse registrarVoto(VotoRequest request) {
        log.info("Tentativa de registro de voto. Associado: '{}', Pauta ID: {}, Opcao: '{}'",
                request.getAssociadoId(), request.getPautaId(), request.getVoto());

        // 1. Validar CPF e permissão de voto no serviço externo/mock
        CpfStatusResponse cpfStatus = cpfValidationClient.validarCpf(request.getAssociadoId());
        
        if (!cpfStatus.isAbleToVote()) {
            throw new BusinessException("O associado informado não está habilitado para votar nesta pauta (UNABLE_TO_VOTE).");
        }
        Pauta pauta = pautaService.buscarPorId(request.getPautaId());
        SessaoVotacao sessao = sessaoVotacaoService.buscarPorPautaId(pauta.getId());

        if (!sessao.isAberta()) {
            log.warn("Voto recusado: A sessao da pauta ID {} esta encerrada. Horario atual: {}",
                    pauta.getId(), java.time.LocalDateTime.now());
            throw new BusinessException("A sessão de votação para esta pauta está encerrada ou ainda não iniciou.");
        }

        if (votoRepository.existsByPautaIdAndAssociadoId(pauta.getId(), request.getAssociadoId())) {
            log.warn("Voto recusado: Associado '{}' ja votou na pauta ID {}", request.getAssociadoId(), pauta.getId());
            throw new BusinessException("O associado já votou nesta pauta.");
        }

        Voto voto = Voto.builder()
                .pauta(pauta)
                .associadoId(request.getAssociadoId())
                .voto(request.getVoto())
                .build();

        Voto votoSalvo = votoRepository.save(voto);
        log.info("Voto ID {} registrado com sucesso. Associado: '{}', Pauta ID: {}",
                votoSalvo.getId(), votoSalvo.getAssociadoId(), pauta.getId());

        return VotoResponse.builder()
                .id(votoSalvo.getId())
                .pautaId(pauta.getId())
                .associadoId(votoSalvo.getAssociadoId())
                .voto(votoSalvo.getVoto())
                .dataVoto(votoSalvo.getDataVoto())
                .build();
    }

    @Transactional(readOnly = true)
    public ResultadoVotacaoResponse obterResultado(Long pautaId) {
        log.info("Iniciando apuracao do resultado da pauta ID: {}", pautaId);
        Pauta pauta = pautaService.buscarPorId(pautaId);
        SessaoVotacao sessao = sessaoVotacaoService.buscarPorPautaId(pautaId);

        long votosSim = votoRepository.countByPautaIdAndVoto(pautaId, OpcaoVoto.SIM);
        long votosNao = votoRepository.countByPautaIdAndVoto(pautaId, OpcaoVoto.NAO);
        long totalVotos = votoRepository.countByPautaId(pautaId);

        boolean encerrada = !sessao.isAberta();
        String resultado;

        if (!encerrada) {
            resultado = "SESSÃO EM ANDAMENTO";
        } else if (votosSim > votosNao) {
            resultado = "APROVADA";
        } else if (votosNao > votosSim) {
            resultado = "REPROVADA";
        } else {
            resultado = "EMPATE";
        }

        log.info("Apuracao da pauta ID {}: Total Votos={}, SIM={}, NAO={}, Status='{}', Encerrada={}",
                pautaId, totalVotos, votosSim, votosNao, resultado, encerrada);

        return ResultadoVotacaoResponse.builder()
                .pautaId(pauta.getId())
                .tituloPauta(pauta.getTitulo())
                .votosSim(votosSim)
                .votosNao(votosNao)
                .totalVotos(totalVotos)
                .resultado(resultado)
                .sessaoEncerrada(encerrada)
                .build();
    }
}