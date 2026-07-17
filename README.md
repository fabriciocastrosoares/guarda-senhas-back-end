# Guarda Senhas — Back-end

Um serviço back-end para gerenciar senhas, notas e cartões de forma segura. O projeto foi desenvolvido com NestJS e usa Prisma para persistência em PostgreSQL. Destina-se a fornecer uma API REST protegida por JWT para que cada usuário possa armazenar e recuperar dados confidenciais criptografados.

**Principais funcionalidades**
- Cadastro e autenticação de usuários (JWT).
- CRUD de credenciais (senhas de serviços) com criptografia.
- CRUD de notas seguras.
- CRUD de cartões (dados criptografados quando aplicável).
- Sessões e validação com banco de dados via Prisma.

**Stack principal**
- Node.js + NestJS
- Prisma (PostgreSQL)
- bcrypt (hash de senhas)
- cryptr (criptografia dos dados do usuário)
- Jest (testes)

---

## Início rápido

Pré-requisitos
- `Node.js` (recomendado >= 18)
- `npm` ou `pnpm`/`yarn`
- PostgreSQL (local ou remoto)

Clonar e instalar dependências
```bash
git clone https://github.com/fabriciocastrosoares/guarda-senhas-back-end.git
cd guarda-senhas
npm install
```

Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz com ao menos as variáveis abaixo (exemplo):

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=uma_chave_forte_para_jwt
CRYPTR_SECRET=uma_chave_forte_para_cryptr
PORT=3000
```

Gerar cliente Prisma e rodar migrações
```bash
npx prisma generate
npx prisma migrate dev
```

Executar em modo de desenvolvimento
```bash
npm run start:dev
```

Executar build e iniciar em produção
```bash
npm run build
npm run start:prod
```

---

## Variáveis de ambiente
- `DATABASE_URL` — string de conexão do PostgreSQL (usada pelo Prisma).
- `JWT_SECRET` — chave para assinar tokens JWT (usada por `@nestjs/jwt`).
- `CRYPTR_SECRET` — chave para o `Cryptr` (criptografia dos dados sensíveis).
- `PORT` — (opcional) porta em que a aplicação vai escutar (default `3000`).

> Observação: para executar os testes de integração (E2E) crie um `.env.test` apontando para um banco de testes isolado.

---

## Scripts úteis
- `npm run start` — inicia a aplicação (production via Nest).
- `npm run start:dev` — inicia em modo desenvolvimento com hot-reload.
- `npm run build` — compila o projeto.
- `npm run lint` — executa ESLint e corrige problemas quando possível.
- `npm run test` — executa testes unitários (Jest).
- `npm run test:e2e` — executa testes E2E (ver `test/jest-e2e.json`).

---

## Endpoints principais (resumo)

- `POST /auth/sign-up` — cria usuário.
- `POST /auth/sign-in` — autentica e retorna token JWT.

- `POST /users` — criar usuário (mesma rota usada no fluxo de cadastro).
- `GET /users/:id` — busca dados do usuário (autenticado).
- `DELETE /users/erase` — apagar conta (autenticado).

- `POST /credentials` — criar credencial (autenticado).
- `GET /credentials` — listar credenciais do usuário (autenticado).
- `GET /credentials/:id` — obter credencial por id (autenticado).
- `PUT /credentials/:id` — atualizar credencial (autenticado).
- `DELETE /credentials/:id` — remover credencial (autenticado).

- `POST /notes` — criar nota segura (autenticado).
- `GET /notes` — listar notas (autenticado).
- `GET /notes/:id` — obter nota (autenticado).
- `PUT /notes/:id` — atualizar nota (autenticado).
- `DELETE /notes/:id` — remover nota (autenticado).

- `POST /cards` — criar cartão (autenticado).
- `GET /cards` — listar cartões (autenticado).
- `GET /cards/:id` — obter cartão (autenticado).
- `PUT /cards/:id` — atualizar cartão (autenticado).
- `DELETE /cards/:id` — remover cartão (autenticado).

> Observação: todas as rotas de `credentials`, `notes`, `cards` e alguns `users` exigem o cabeçalho `Authorization: Bearer <token>` retornado pelo `/auth/sign-in`.

---

## Banco de dados (Prisma)

O projeto usa Prisma com um `schema.prisma` já configurado para PostgreSQL. Para gerar o cliente e aplicar migrações locais:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Para rodar migrações em ambiente CI/produção use:

```bash
npx prisma migrate deploy
```

---

## Testes

- Unitários: `npm run test`
- E2E: `npm run test:e2e` (lembre-se de preparar `.env.test` com as credenciais do banco de testes)

