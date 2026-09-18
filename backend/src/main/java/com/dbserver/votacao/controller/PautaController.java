package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.PautaRequest;
import com.dbserver.votacao.dto.response.PautaResponse;
import com.dbserver.votacao.dto.response.ResultadoVotacaoResponse;
import com.dbserver.votacao.service.PautaService;
import com.dbserver.votacao.service.VotoService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/pautas")
@RequiredArgsConstructor
//@Tag(name = "Pautas", description = "Endpoints para gerenciamento de pautas e consulta de resultados")
public class PautaController {

    private final PautaService pautaService;
    private final VotoService votoService;

    @PostMapping
    //@Operation(summary = "Cadastrar uma nova pauta")
    public ResponseEntity<PautaResponse> criarPauta(@Valid @RequestBody PautaRequest request) {
        PautaResponse response = pautaService.criarPauta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    //@Operation(summary = "Listar todas as pautas cadastradas")
    public ResponseEntity<List<PautaResponse>> listarPautas() {
        return ResponseEntity.ok(pautaService.listarTodas());
    }

    @GetMapping("/{pautaId}/resultado")
    //@Operation(summary = "Obter o resultado da votação de uma pauta")
    public ResponseEntity<ResultadoVotacaoResponse> obterResultado(@PathVariable Long pautaId) {
        ResultadoVotacaoResponse resultado = votoService.obterResultado(pautaId);
        return ResponseEntity.ok(resultado);
    }
}
