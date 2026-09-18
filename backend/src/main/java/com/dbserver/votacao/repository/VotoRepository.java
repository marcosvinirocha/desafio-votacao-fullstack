package com.dbserver.votacao.repository;

import com.dbserver.votacao.model.Voto;
import com.dbserver.votacao.model.enums.OpcaoVoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByPautaIdAndAssociadoId(Long pautaId, String associadoId);
    long countByPautaIdAndVoto(Long pautaId, OpcaoVoto voto);
    long countByPautaId(Long pautaId);
}
