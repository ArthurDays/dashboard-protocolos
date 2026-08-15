import { useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { summarizeTriageQueue } from '../services/triageDemo';

export default function TriageCenter() {
  const { protocolosFiltrados } = useDashboard();
  const summary = useMemo(() => summarizeTriageQueue(protocolosFiltrados), [protocolosFiltrados]);
  const priorityItems = summary.items.filter(({ recommendation }) => recommendation.priority === 'HIGH').slice(0, 3);

  return <section className="glass-card triage-center animate-fade-in-up" aria-labelledby="triage-center-title">
    <div className="triage-center-header"><div><span className="modal-eyebrow">Protocol Intelligence · demonstração</span><h2 id="triage-center-title">Central de triagem agentic</h2><p>Leitura simulada dos protocolos filtrados. Nenhuma decisão é aplicada automaticamente.</p></div><span className="agent-chip">Human-in-the-loop</span></div>
    <div className="triage-metrics"><div><strong>{summary.total}</strong><span>Aguardando revisão</span></div><div><strong>{summary.highPriority}</strong><span>Alta prioridade</span></div><div><strong>{summary.averageConfidence}%</strong><span>Confiança média</span></div><div><strong>{summary.alerts}</strong><span>Alertas explicáveis</span></div></div>
    {priorityItems.length > 0 && <div className="triage-queue"><h3>Prioridades sugeridas</h3>{priorityItems.map(({ protocol, recommendation }, index) => <div className="triage-queue-row" key={`${protocol.numero_eprotocolo || protocol.numero_processo || protocol.interessado}-${index}`}><div><strong>{protocol.numero_eprotocolo || protocol.numero_processo || 'Protocolo simulado'}</strong><span>{protocol.tipo_documento} · {protocol.unidade}</span></div><span className="badge badge-error">{recommendation.priority}</span><span>{Math.round(recommendation.confidence * 100)}% confiança</span></div>)}</div>}
  </section>;
}
