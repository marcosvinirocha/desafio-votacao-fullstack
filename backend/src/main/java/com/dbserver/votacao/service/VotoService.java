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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VotoService {

    private final VotoRepository votoRepository;
    private final PautaService pautaService;
    private final SessaoVotacaoService sessaoVotacaoService;

    @Transactional
    public VotoResponse registrarVoto(VotoRequest request) {
        Pauta pauta = pautaService.buscarPorId(request.getPautaId());
        SessaoVotacao sessao = sessaoVotacaoService.buscarPorPautaId(pauta.getId());

        if (!sessao.isAberta()) {
            throw new BusinessException("A sessão de votação para esta pauta está encerrada ou ainda não iniciou.");
        }

        if (votoRepository.existsByPautaIdAndAssociadoId(pauta.getId(), request.getAssociadoId())) {
            throw new BusinessException("O associado já votou nesta pauta.");
        }

        Voto voto = Voto.builder()
                .pauta(pauta)
                .associadoId(request.getAssociadoId())
                .voto(request.getVoto())
                .build();

        Voto votoSalvo = votoRepository.save(voto);

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