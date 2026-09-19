import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração dos cenários e thresholds de carga
export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Rampa de subida: 50 VUs em 10s
    { duration: '30s', target: 200 }, // Carga de estresse: 200 VUs em 30s
    { duration: '10s', target: 0 },   // Rampa de descida: 0 VUs em 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% das requisições devem responder em menos de 200ms
    http_req_failed: ['rate<0.01'],   // Tolerância máxima de 1% de requisições com falha
  },
};

// URL do ambiente via variável de ambiente (Docker extra_hosts) com fallback local
const HOST = __ENV.TARGET_HOSTNAME || 'localhost:8080';
const BASE_URL = `http://${HOST}/v1`;

export default function () {
  // Gera CPF dinâmico terminado em dígito PAR para validação de mock (ABLE_TO_VOTE)
  const randomSuffix = Math.floor(Math.random() * 5) * 2; // Produz 0, 2, 4, 6 ou 8
  const randomPrefix = Math.floor(100000000 + Math.random() * 900000000);
  const cpf = `${randomPrefix}${randomSuffix}`.padStart(11, '0');

  const payload = JSON.stringify({
    pautaId: 1,
    associadoId: cpf,
    voto: Math.random() > 0.5 ? 'SIM' : 'NAO',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Envio da requisição de voto
  const res = http.post(`${BASE_URL}/votos`, payload, params);

  // Asserção
  const isSuccess = check(res, {
    'status é 201 Created': (r) => r.status === 201,
    'tempo de resposta < 200ms': (r) => r.timings.duration < 200,
  });

  // Log detalhado das requisições com falha
  if (!isSuccess) {
    console.error(`[FALHA] HTTP Status: ${res.status} | Resposta: ${res.body}`);
  }

  // Pausa pequena de reflexão por VU para evitar exaustão instantânea de sockets
  sleep(0.1);
}