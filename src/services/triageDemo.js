const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export function createDemoRecommendation(protocol) {
  const type = normalize(protocol.tipo_documento);
  const subject = normalize(protocol.assunto);
  const ombudsman = type.includes('OUVIDORIA') || type.includes('RECLAMACAO');
  const urgent = /\bURGENTE\b|\bRISCO\b|\bPRAZO\b/.test(subject);
  return {
    priority: urgent ? 'HIGH' : 'NORMAL',
    suggestedUnit: ombudsman ? 'OUVIDORIA' : protocol.unidade || 'PROTOCOLO',
    confidence: ombudsman || urgent ? 0.86 : 0.62,
    rationale: [ombudsman ? 'Tipo compatível com o fluxo simulado de ouvidoria.' : 'Roteamento baseado na unidade atual.', urgent ? 'Indicador fechado de urgência identificado.' : 'Sem indicador fechado de urgência.'],
    alerts: ['Demonstração: exige revisão humana e não executa alterações.'],
    decision: 'PENDING', mode: 'DEMO', appliedToProtocol: false,
  };
}

export function decideDemoRecommendation(recommendation, decision) {
  if (recommendation.decision !== 'PENDING') return recommendation;
  return { ...recommendation, decision, decidedAt: new Date().toISOString(), appliedToProtocol: false };
}

export function summarizeTriageQueue(protocols) {
  const items = protocols.map((protocol) => ({ protocol, recommendation: createDemoRecommendation(protocol) }));
  const confidence = items.reduce((total, item) => total + item.recommendation.confidence, 0);
  return {
    total: items.length,
    highPriority: items.filter((item) => ['HIGH', 'URGENT'].includes(item.recommendation.priority)).length,
    averageConfidence: items.length ? Math.round((confidence / items.length) * 100) : 0,
    alerts: items.reduce((total, item) => total + item.recommendation.alerts.length, 0),
    items,
  };
}

export function buildDemoAuditTrail(recommendation) {
  const decided = recommendation.decision !== 'PENDING';
  return [
    { status: 'DONE', label: 'Protocolo analisado como dado não confiável' },
    { status: 'DONE', label: `Recomendação explicável gerada (${Math.round(recommendation.confidence * 100)}% de confiança)` },
    { status: decided ? 'DONE' : 'PENDING', label: decided ? `Revisão humana: ${recommendation.decision === 'APPROVED' ? 'aprovada' : 'rejeitada'}` : 'Aguardando revisão humana' },
    { status: 'NOT_APPLIED', label: 'Alteração não aplicada ao protocolo' },
  ];
}
