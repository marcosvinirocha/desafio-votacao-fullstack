package com.dbserver.votacao.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.dbserver.votacao.model.enums.OpcaoVoto;

@Entity
@Table(
    name = "votos",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_pauta_associado",
            columnNames = {"pauta_id", "associado_id"}
        )
    }
)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pauta_id", nullable = false)
    private Pauta pauta;

    @Column(name = "associado_id", nullable = false)
    private String associadoId; // Pode ser CPF ou UUID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpcaoVoto voto;

    @Column(name = "data_voto", nullable = false)
    private LocalDateTime dataVoto;

    @PrePersist
    protected void onCreate() {
        this.dataVoto = LocalDateTime.now();
    }
}
