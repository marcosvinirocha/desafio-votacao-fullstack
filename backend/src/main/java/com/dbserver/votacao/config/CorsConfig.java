package com.dbserver.votacao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a configuração a todos os endpoints (/v1/pautas, /v1/votos, etc.)
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Origens permitidas (ex: React/Vite/Next.js)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Cabeçalhos permitidos nas requisições
                .allowCredentials(true) // Permite o envio de cookies ou headers de autenticação
                .maxAge(3600); // Tempo em segundos de cache da resposta Preflight (OPTIONS)
    }
}
