# Dashboard de Protocolos API

Backend REST próprio do Dashboard, construído com Node.js, TypeScript, Fastify,
Prisma e PostgreSQL.

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Endpoints principais:

- `GET /api/health`
- `GET /api/metrics`
- `GET /api/protocolos`
- `GET /api/protocolos/:id`
- `GET /api/protocolos/:id/movimentacoes`
- `GET /api/dashboard/kpis`
- `GET /api/dashboard/sla`
- `PATCH /api/protocolos/:id/status`
- `POST /api/ingestao/protocolos`

Use `x-api-key` para leitura (`READ_API_KEY`) e ingestão
(`INGEST_API_KEY`). As duas chaves são obrigatórias e devem ser diferentes; a
API recusa a inicialização quando a configuração é insegura.

## Banco

O schema está em `prisma/schema.prisma` e a primeira migration em
`prisma/migrations/0001_init/migration.sql`. O modelo já contempla protocolo,
unidade, movimentação, status, prioridade, SLA, feriados e eventos de ingestão.

## Ingestão

```json
{
  "source": "google-sheets",
  "records": [
    {
      "external_id": "EP-2026-0001",
      "data": "2026-08-14",
      "Mes_Origem": "AGOSTO",
      "canal_entrada": "E-mail",
      "tipo_documento": "Requerimento",
      "interessado": "Nome",
      "unidade": "ASSAD"
    }
  ]
}
```

A operação é idempotente por `source + external_id` e registra cada resultado
em `IngestionEvent`.
