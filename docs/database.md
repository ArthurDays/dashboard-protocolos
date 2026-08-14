# Banco de dados

<!-- specsfy:documentator:start -->
## Mapa de persistência

| Entidade/Tabela | Campos | Relações | Fonte |
| --- | --- | --- | --- |
| Holiday | id:String, date:DateTime, name:String, createdAt:DateTime | String, DateTime, String, DateTime | `backend/prisma/schema.prisma` |
| IngestionEvent | id:String, source:String, externalId:String, payloadHash:String, outcome:String, error:String?, createdAt:DateTime | String, String, String, String, String, String, DateTime | `backend/prisma/schema.prisma` |
| Movement | id:String, protocolId:String, protocol:Protocol, fromStatus:ProtocolStatus?, toStatus:ProtocolStatus, fromUnitId:String?, toUnitId:String?, toUnit:Unit?, note:String?, actor:String?, occurredAt:DateTime | String, String, Protocol, ProtocolStatus, ProtocolStatus, String, String, Unit, String, String, DateTime | `backend/prisma/schema.prisma` |
| Protocol | id:String, source:String, externalId:String, protocolNumber:String?, processNumber:String?, entryDate:DateTime, sourceMonth:String, channel:String, documentType:String, interested:String, subject:String?, status:ProtocolStatus, priority:Priority, dueAt:DateTime?, completedAt:DateTime?, unitId:String?, unit:Unit?, movements:Movement[], createdAt:DateTime, updatedAt:DateTime | String, String, String, String, String, DateTime, String, String, String, String, String, ProtocolStatus, Priority, DateTime, DateTime, String, Unit, Movement, DateTime, DateTime | `backend/prisma/schema.prisma` |
| SlaRule | id:String, documentType:String?, priority:Priority, workingDays:Int, active:Boolean, createdAt:DateTime, updatedAt:DateTime | String, String, Priority, Int, Boolean, DateTime, DateTime | `backend/prisma/schema.prisma` |
| Unit | id:String, code:String, name:String, active:Boolean, protocols:Protocol[], movements:Movement[], createdAt:DateTime, updatedAt:DateTime | String, String, String, Boolean, Protocol, Movement, DateTime, DateTime | `backend/prisma/schema.prisma` |

```mermaid
erDiagram
  HOLIDAY {
    String id
    DateTime date
    String name
    DateTime createdAt
  }
  STRING ||--o{ HOLIDAY : relaciona
  DATETIME ||--o{ HOLIDAY : relaciona
  STRING ||--o{ HOLIDAY : relaciona
  DATETIME ||--o{ HOLIDAY : relaciona
  INGESTIONEVENT {
    String id
    String source
    String externalId
    String payloadHash
    String outcome
    String_ error
    DateTime createdAt
  }
  STRING ||--o{ INGESTIONEVENT : relaciona
  STRING ||--o{ INGESTIONEVENT : relaciona
  STRING ||--o{ INGESTIONEVENT : relaciona
  STRING ||--o{ INGESTIONEVENT : relaciona
  STRING ||--o{ INGESTIONEVENT : relaciona
  STRING ||--o{ INGESTIONEVENT : relaciona
  DATETIME ||--o{ INGESTIONEVENT : relaciona
  MOVEMENT {
    String id
    String protocolId
    Protocol protocol
    ProtocolStatus_ fromStatus
    ProtocolStatus toStatus
    String_ fromUnitId
    String_ toUnitId
    Unit_ toUnit
    String_ note
    String_ actor
    DateTime occurredAt
  }
  STRING ||--o{ MOVEMENT : relaciona
  STRING ||--o{ MOVEMENT : relaciona
  PROTOCOL ||--o{ MOVEMENT : relaciona
  PROTOCOLSTATUS ||--o{ MOVEMENT : relaciona
  PROTOCOLSTATUS ||--o{ MOVEMENT : relaciona
  STRING ||--o{ MOVEMENT : relaciona
  STRING ||--o{ MOVEMENT : relaciona
  UNIT ||--o{ MOVEMENT : relaciona
  STRING ||--o{ MOVEMENT : relaciona
  STRING ||--o{ MOVEMENT : relaciona
  DATETIME ||--o{ MOVEMENT : relaciona
  PROTOCOL {
    String id
    String source
    String externalId
    String_ protocolNumber
    String_ processNumber
    DateTime entryDate
    String sourceMonth
    String channel
    String documentType
    String interested
    String_ subject
    ProtocolStatus status
    Priority priority
    DateTime_ dueAt
    DateTime_ completedAt
    String_ unitId
    Unit_ unit
    Movement__ movements
    DateTime createdAt
    DateTime updatedAt
  }
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  DATETIME ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  PROTOCOLSTATUS ||--o{ PROTOCOL : relaciona
  PRIORITY ||--o{ PROTOCOL : relaciona
  DATETIME ||--o{ PROTOCOL : relaciona
  DATETIME ||--o{ PROTOCOL : relaciona
  STRING ||--o{ PROTOCOL : relaciona
  UNIT ||--o{ PROTOCOL : relaciona
  MOVEMENT ||--o{ PROTOCOL : relaciona
  DATETIME ||--o{ PROTOCOL : relaciona
  DATETIME ||--o{ PROTOCOL : relaciona
  SLARULE {
    String id
    String_ documentType
    Priority priority
    Int workingDays
    Boolean active
    DateTime createdAt
    DateTime updatedAt
  }
  STRING ||--o{ SLARULE : relaciona
  STRING ||--o{ SLARULE : relaciona
  PRIORITY ||--o{ SLARULE : relaciona
  INT ||--o{ SLARULE : relaciona
  BOOLEAN ||--o{ SLARULE : relaciona
  DATETIME ||--o{ SLARULE : relaciona
  DATETIME ||--o{ SLARULE : relaciona
  UNIT {
    String id
    String code
    String name
    Boolean active
    Protocol__ protocols
    Movement__ movements
    DateTime createdAt
    DateTime updatedAt
  }
  STRING ||--o{ UNIT : relaciona
  STRING ||--o{ UNIT : relaciona
  STRING ||--o{ UNIT : relaciona
  BOOLEAN ||--o{ UNIT : relaciona
  PROTOCOL ||--o{ UNIT : relaciona
  MOVEMENT ||--o{ UNIT : relaciona
  DATETIME ||--o{ UNIT : relaciona
  DATETIME ||--o{ UNIT : relaciona
```

## Fonte complementar

Consulte [`.specsfy/DATABASE.md`](../.specsfy/DATABASE.md) para decisões,
ownership, retenção e detalhes humanos não inferíveis.
<!-- specsfy:documentator:end -->
