CREATE TYPE "ProtocolStatus" AS ENUM ('RECEIVED', 'TRIAGE', 'FORWARDED', 'IN_ANALYSIS', 'PENDING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

CREATE TABLE "Unit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Protocol" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "source" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "protocolNumber" TEXT,
  "processNumber" TEXT,
  "entryDate" TIMESTAMP(3) NOT NULL,
  "sourceMonth" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "interested" TEXT NOT NULL,
  "subject" TEXT,
  "status" "ProtocolStatus" NOT NULL DEFAULT 'RECEIVED',
  "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "unitId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Protocol_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Protocol_source_externalId_key" ON "Protocol"("source", "externalId");
CREATE INDEX "Protocol_entryDate_idx" ON "Protocol"("entryDate");
CREATE INDEX "Protocol_sourceMonth_idx" ON "Protocol"("sourceMonth");
CREATE INDEX "Protocol_status_idx" ON "Protocol"("status");
CREATE INDEX "Protocol_unitId_idx" ON "Protocol"("unitId");
CREATE INDEX "Protocol_documentType_idx" ON "Protocol"("documentType");

CREATE TABLE "Movement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "protocolId" TEXT NOT NULL,
  "fromStatus" "ProtocolStatus",
  "toStatus" "ProtocolStatus" NOT NULL,
  "fromUnitId" TEXT,
  "toUnitId" TEXT,
  "note" TEXT,
  "actor" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Movement_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Movement_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Movement_protocolId_occurredAt_idx" ON "Movement"("protocolId", "occurredAt");

CREATE TABLE "SlaRule" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "documentType" TEXT,
  "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
  "workingDays" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "SlaRule_documentType_priority_active_idx" ON "SlaRule"("documentType", "priority", "active");

CREATE TABLE "Holiday" ("id" TEXT NOT NULL PRIMARY KEY, "date" TIMESTAMP(3) NOT NULL UNIQUE, "name" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "IngestionEvent" ("id" TEXT NOT NULL PRIMARY KEY, "source" TEXT NOT NULL, "externalId" TEXT NOT NULL, "payloadHash" TEXT NOT NULL, "outcome" TEXT NOT NULL, "error" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE UNIQUE INDEX "IngestionEvent_source_externalId_key" ON "IngestionEvent"("source", "externalId");
CREATE INDEX "IngestionEvent_createdAt_idx" ON "IngestionEvent"("createdAt");
