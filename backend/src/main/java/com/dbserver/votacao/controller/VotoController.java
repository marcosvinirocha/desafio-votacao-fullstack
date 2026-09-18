package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.VotoRequest;
import com.dbserver.votacao.dto.response.VotoResponse;
import com.dbserver.votacao.service.VotoService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j 
@RestController
@RequestMapping("/v1/votos")
@RequiredArgsConstructor
//@Tag(name = "Votos", description = "Endpoints para envio e registro de votos dos associados")
public class VotoController {

    private final VotoService votoService;

    @PostMapping
    //@Operation(summary = "Registrar o voto de um associado em uma pauta")
    public ResponseEntity<VotoResponse> registrarVoto(@Valid @RequestBody VotoRequest request) {
        log.debug("Recebida requisição para registrar voto. PautaID: {}, AssociadoID: {}, Voto: {}", 
            request.getPautaId(), request.getAssociadoId(), request.getVoto());
        VotoResponse response = votoService.registrarVoto(request);
        log.debug("Voto registrado com sucesso. ID do Voto: {}, PautaID: {}", 
            response.getId(), response.getPautaId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
