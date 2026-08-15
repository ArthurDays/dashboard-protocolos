CREATE TYPE "TriageDecision" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "TriageRecommendation" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "suggestedUnit" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "rationale" JSONB NOT NULL,
    "alerts" JSONB NOT NULL,
    "provider" TEXT NOT NULL,
    "providerVersion" TEXT NOT NULL,
    "decision" "TriageDecision" NOT NULL DEFAULT 'PENDING',
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TriageRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TriageRecommendation_protocolId_createdAt_idx" ON "TriageRecommendation"("protocolId", "createdAt");
CREATE INDEX "TriageRecommendation_decision_idx" ON "TriageRecommendation"("decision");

ALTER TABLE "TriageRecommendation"
ADD CONSTRAINT "TriageRecommendation_protocolId_fkey"
FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
