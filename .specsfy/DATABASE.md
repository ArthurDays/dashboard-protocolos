# Banco de dados

Mapa de persistência e fontes do sistema. A fonte operacional atual é externa;
o PostgreSQL é o destino de migração e ingestão idempotente.

## Fontes de dados

<!-- specsfy:database:start -->
| Fonte | Tecnologia | Configuração segura | Evidência |
| --- | --- | --- | --- |
| Operacional atual | Google Sheets via Apps Script | URL em `VITE_SHEETS_URL`, nunca segredo no documento | `google-apps-script/Code.gs` |
| Migração | PostgreSQL | `DATABASE_URL`, nunca o valor | `backend/prisma/schema.prisma` |

## Estruturas

| Estrutura | Tipo | Campos | Relações | Fonte |
| --- | --- | --- | --- | --- |
| Registro de protocolo | `external_id`/id | data, origem, canal, tipo, interessado, unidade, assunto | movimentações e ingestão | Apps Script/Prisma |
| Movimentação | id | status, unidade, responsável, timestamps | protocolo | Prisma |
| Evento de ingestão | id/hash | source, external_id, payload_hash, resultado | protocolo | Prisma |
<!-- specsfy:database:end -->

## Decisões, ownership e retenção

Registros podem conter dados pessoais e identificadores de processo. Retenção,
ownership, classificação formal e política de auditoria ainda aguardam decisão
institucional. A ingestão futura deve ser idempotente por `(source, external_id)`.
