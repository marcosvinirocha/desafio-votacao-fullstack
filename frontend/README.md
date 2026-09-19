# Frontend

Boilerplate frontend — React 19 + Vite + TypeScript (strict) + Tailwind CSS v4.

## Stack

| Camada      | Tecnologia                  |
| ----------- | --------------------------- |
| Framework   | React 19                    |
| Bundler     | Vite 8                      |
| Linguagem   | TypeScript (strict, `~5.9`) |
| Estilos     | Tailwind CSS v4 (CSS-first) |
| Router      | React Router v7             |
| HTTP Client | Axios                       |
| Qualidade   | ESLint (flat) + Prettier    |

## Scripts

```bash
pnpm install        # ou npm install / yarn
pnpm dev            # dev server
pnpm build          # typecheck + build de produção
pnpm preview        # preview do build
pnpm lint           # ESLint
pnpm format         # Prettier (escreve arquivos)
pnpm format:check   # Prettier (verifica)
pnpm typecheck      # tsc --noEmit
```

## Estrutura

```
src/
├── assets/       # recursos estáticos e ícones
├── components/   # ui/ | common/ | layout/
├── config/       # constantes globais, env e rotas
├── hooks/        # custom hooks reutilizáveis
├── pages/        # páginas principais (lazy-loaded)
├── routes/       # configuração do router
├── services/     # cliente HTTP (axios) e integração de API
├── types/        # tipos e interfaces globais
└── utils/        # helpers (ex.: cn)
```

## Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável            | Descrição                 | Padrão                     |
| ------------------- | ------------------------- | -------------------------- |
| `VITE_API_BASE_URL` | Base URL da API (backend) | `http://localhost:8080/v1` |
