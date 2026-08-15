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
