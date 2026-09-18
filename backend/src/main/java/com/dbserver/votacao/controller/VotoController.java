package com.dbserver.votacao.controller;

import com.dbserver.votacao.dto.request.VotoRequest;
import com.dbserver.votacao.dto.response.VotoResponse;
import com.dbserver.votacao.service.VotoService;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/votos")
@RequiredArgsConstructor
//@Tag(name = "Votos", description = "Endpoints para envio e registro de votos dos associados")
public class VotoController {

    private final VotoService votoService;

    @PostMapping
    //@Operation(summary = "Registrar o voto de um associado em uma pauta")
    public ResponseEntity<VotoResponse> registrarVoto(@Valid @RequestBody VotoRequest request) {
        VotoResponse response = votoService.registrarVoto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
