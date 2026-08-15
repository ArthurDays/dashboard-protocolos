# Banco de dados

Mapa de persistência e fontes do sistema. A fonte operacional atual é externa;
o PostgreSQL é o destino de migração e ingestão idempotente.

## Fontes de dados

<!-- specsfy:database:start -->
| Fonte | Tecnologia/forma | Evidência |
| --- | --- | --- |
| Estrutura | Schema/migration | `backend/prisma/migrations/0001_init/migration.sql` |
| Estrutura | Schema/migration | `backend/prisma/migrations/0002_triage_recommendations/migration.sql` |
| Estrutura | Schema/migration | `backend/prisma/schema.prisma` |

## Estruturas detectadas

| Estrutura | Tipo | Campos | Relações | Fonte |
| --- | --- | --- | --- | --- |
| Unit | Tabela SQL | id:TEXT, code:TEXT, name:TEXT, active:BOOLEAN, createdAt:TIMESTAMP(3), updatedAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| Protocol | Tabela SQL | id:TEXT, source:TEXT, externalId:TEXT, protocolNumber:TEXT, processNumber:TEXT, entryDate:TIMESTAMP(3), sourceMonth:TEXT, channel:TEXT, documentType:TEXT, interested:TEXT, subject:TEXT, dueAt:TIMESTAMP(3), completedAt:TIMESTAMP(3), unitId:TEXT, createdAt:TIMESTAMP(3), updatedAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| Movement | Tabela SQL | id:TEXT, protocolId:TEXT, fromUnitId:TEXT, toUnitId:TEXT, note:TEXT, actor:TEXT, occurredAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| SlaRule | Tabela SQL | id:TEXT, documentType:TEXT, workingDays:INTEGER, active:BOOLEAN, createdAt:TIMESTAMP(3), updatedAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| Holiday | Tabela SQL | id:TEXT, date:TIMESTAMP(3), name:TEXT, createdAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| IngestionEvent | Tabela SQL | id:TEXT, source:TEXT, externalId:TEXT, payloadHash:TEXT, outcome:TEXT, error:TEXT, createdAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0001_init/migration.sql` |
| TriageRecommendation | Tabela SQL | id:TEXT, protocolId:TEXT, suggestedUnit:TEXT, confidence:DOUBLE, rationale:JSONB, alerts:JSONB, provider:TEXT, providerVersion:TEXT, decidedBy:TEXT, decidedAt:TIMESTAMP(3), decisionNote:TEXT, createdAt:TIMESTAMP(3), updatedAt:TIMESTAMP(3) | Não detectadas | `backend/prisma/migrations/0002_triage_recommendations/migration.sql` |
| Unit | Model Prisma | id:String, code:String, name:String, active:Boolean, protocols:Protocol[], movements:Movement[], createdAt:DateTime, updatedAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| Protocol | Model Prisma | id:String, source:String, externalId:String, protocolNumber:String?, processNumber:String?, entryDate:DateTime, sourceMonth:String, channel:String, documentType:String, interested:String, subject:String?, status:ProtocolStatus, priority:Priority, dueAt:DateTime?, completedAt:DateTime?, unitId:String?, unit:Unit?, movements:Movement[], triageRecommendations:TriageRecommendation[], createdAt:DateTime, updatedAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| TriageRecommendation | Model Prisma | id:String, protocolId:String, protocol:Protocol, priority:Priority, suggestedUnit:String, confidence:Float, rationale:Json, alerts:Json, provider:String, providerVersion:String, decision:TriageDecision, decidedBy:String?, decidedAt:DateTime?, decisionNote:String?, createdAt:DateTime, updatedAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| Movement | Model Prisma | id:String, protocolId:String, protocol:Protocol, fromStatus:ProtocolStatus?, toStatus:ProtocolStatus, fromUnitId:String?, toUnitId:String?, toUnit:Unit?, note:String?, actor:String?, occurredAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| SlaRule | Model Prisma | id:String, documentType:String?, priority:Priority, workingDays:Int, active:Boolean, createdAt:DateTime, updatedAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| Holiday | Model Prisma | id:String, date:DateTime, name:String, createdAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
| IngestionEvent | Model Prisma | id:String, source:String, externalId:String, payloadHash:String, outcome:String, error:String?, createdAt:DateTime | Não detectadas | `backend/prisma/schema.prisma` |
<!-- specsfy:database:end -->

## Decisões, ownership e retenção

Registros podem conter dados pessoais e identificadores de processo. Retenção,
ownership, classificação formal e política de auditoria ainda aguardam decisão
institucional. A ingestão futura deve ser idempotente por `(source, external_id)`.
