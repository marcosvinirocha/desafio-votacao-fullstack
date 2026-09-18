package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.AbrirSessaoRequest;
import com.dbserver.votacao.dto.response.SessaoVotacaoResponse;
import com.dbserver.votacao.service.SessaoVotacaoService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/sessoes")
@RequiredArgsConstructor
//@Tag(name = "Sessões de Votação", description = "Endpoints para abertura e gestão de sessões de votação")
public class SessaoVotacaoController {

    private final SessaoVotacaoService sessaoVotacaoService;

    @PostMapping("/abrir")
    //@Operation(summary = "Abrir uma sessão de votação para uma pauta")
    public ResponseEntity<SessaoVotacaoResponse> abrirSessao(@Valid @RequestBody AbrirSessaoRequest request) {
        SessaoVotacaoResponse response = sessaoVotacaoService.abrirSessao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
