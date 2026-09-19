# 🚀 Testes de Carga e Performance (k6 + Docker)

Este repositório contém a suíte automatizada de testes de carga e estresse para a API do **Sistema de Votação Cooperativa**, utilizando [Grafana k6](https://k6.io/) e [Docker Compose](https://docs.docker.com/compose/).

---

## 🛠️ Arquitetura dos Arquivos

| Arquivo | Descrição |
| :--- | :--- |
| `load-test.js` | Script k6 com curva de carga (stages), gerador de CPF sintético validável e captura de exceções HTTP |
| `docker-compose.yml` | Orquestração do container `k6-runner` com mapeamento de rede para o Host |
| `README.md` | Guia completo de execução, diagnósticos e resolução de gargalos de performance |

---

## 📋 Pré-requisitos

1. **Docker Engine** e **Docker Compose** instalados na máquina hospedeira.
2. Aplicação Spring Boot rodando e acessível na porta `8080`.
3. Uma pauta ativa com ID `1` criada na base de dados (`pautaId: 1`) e com a sessão de votação aberta.

---

## ⚙️ Configuração do Cenário de Teste (`load-test.js`)

### 1. Etapas de Carga (Stages)
* **Rampa de Subida (Ramp-up):** `10s` subindo gradualmente de `0` para **`50 VUs`** (Virtual Users).
* **Pico de Estresse (Peak Load):** `30s` sustentando **`200 VUs` simultâneos**.
* **Rampa de Descida (Ramp-down):** `10s` reduzindo de `200` para **`0 VUs`**.

### 2. Critérios de Aceite (Thresholds)
* **`http_req_duration`**: 95% das requisições devem ser processadas em menos de **200ms** (`p(95) < 200`).
* **`http_req_failed`**: A taxa total de erros HTTP (status diferente de `201`) deve ser **inferior a 1%** (`rate < 0.01`).

---

## 🐳 Comandos Docker para Execução

### 1. Execução Padrão (Análise Rápida)
Para rodar os testes e receber o relatório consolidado direto no terminal:

```bash
docker compose up --build --exit-code-from k6-runner