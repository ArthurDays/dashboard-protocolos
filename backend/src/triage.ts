export type TriagePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TriageDecision = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TriageInput {
  id: string;
  documentType: string;
  subject: string | null;
  channel: string;
  priority: TriagePriority;
  unitCode: string | null;
}

export interface TriageRecommendation {
  priority: TriagePriority;
  suggestedUnit: string;
  confidence: number;
  rationale: string[];
  alerts: string[];
  provider: 'simulated-rules';
  providerVersion: '1.0.0';
  decision: TriageDecision;
  decidedBy: string | null;
  decidedAt: string | null;
  decisionNote: string | null;
}

export interface TriageProvider {
  recommend(input: Readonly<TriageInput>): TriageRecommendation;
}

const normalize = (value: string | null) => (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export const simulatedTriageProvider: TriageProvider = {
  recommend(input) {
    const documentType = normalize(input.documentType);
    const subject = normalize(input.subject);
    const isOmbudsman = documentType.includes('OUVIDORIA') || documentType.includes('RECLAMACAO');
    const isUrgent = /\bURGENTE\b|\bRISCO\b|\bPRAZO\b/.test(subject);

    return {
      priority: isUrgent ? 'HIGH' : input.priority,
      suggestedUnit: isOmbudsman ? 'OUVIDORIA' : input.unitCode ?? 'PROTOCOLO',
      confidence: isOmbudsman || isUrgent ? 0.86 : 0.62,
      rationale: [
        isOmbudsman ? 'Tipo documental compatível com fluxo simulado de ouvidoria.' : 'Roteamento simulado usa a unidade atual ou a unidade padrão.',
        isUrgent ? 'Termo de urgência elevou a prioridade sugerida.' : 'Nenhum indicador fechado de urgência foi identificado.',
      ],
      alerts: ['Recomendação simulada: exige revisão humana antes de qualquer ação.'],
      provider: 'simulated-rules',
      providerVersion: '1.0.0',
      decision: 'PENDING',
      decidedBy: null,
      decidedAt: null,
      decisionNote: null,
    };
  },
};

export function createSimulatedTriage(input: Readonly<TriageInput>) {
  return simulatedTriageProvider.recommend(input);
}

export class TriageDecisionError extends Error {
  constructor(message: string, readonly code: 'invalid_decision' | 'already_decided') {
    super(message);
    this.name = 'TriageDecisionError';
  }
}

export function decideTriage(
  recommendation: Readonly<TriageRecommendation>,
  input: { decision: Exclude<TriageDecision, 'PENDING'>; actor: string; note?: string },
  now = new Date(),
): TriageRecommendation {
  if (recommendation.decision !== 'PENDING') {
    throw new TriageDecisionError('A recomendação já possui decisão.', 'already_decided');
  }
  if (!['APPROVED', 'REJECTED'].includes(input.decision) || !input.actor.trim()) {
    throw new TriageDecisionError('Decisão e ator válidos são obrigatórios.', 'invalid_decision');
  }
  return {
    ...recommendation,
    decision: input.decision,
    decidedBy: input.actor.trim(),
    decidedAt: now.toISOString(),
    decisionNote: input.note?.trim() || null,
  };
}
