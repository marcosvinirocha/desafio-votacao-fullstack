package com.dbserver.votacao.repository;

import com.dbserver.votacao.model.SessaoVotacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessaoVotacaoRepository extends JpaRepository<SessaoVotacao, Long> {
    Optional<SessaoVotacao> findByPautaId(Long pautaId);
    boolean existsByPautaId(Long pautaId);
}