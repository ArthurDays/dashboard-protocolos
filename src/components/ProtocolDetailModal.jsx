import { useEffect, useState } from 'react';
import { buildDemoAuditTrail, createDemoRecommendation, decideDemoRecommendation } from '../services/triageDemo';

export default function ProtocolDetailModal({ protocol, onClose }) {
  const [recommendation, setRecommendation] = useState(null);
  useEffect(() => setRecommendation(null), [protocol]);
  if (!protocol) return null;

  const fields = [
    ['Data de entrada', protocol.data],
    ['Interessado', protocol.interessado],
    ['Tipo de documento', protocol.tipo_documento],
    ['Canal de entrada', protocol.canal_entrada],
    ['Unidade de destino', protocol.unidade],
    ['Nº e-protocolo', protocol.numero_eprotocolo || 'Não informado'],
    ['Nº processo', protocol.numero_processo || 'Não informado'],
    ['Assunto', protocol.assunto || 'Não informado'],
    ['Mês de origem', protocol.mes_origem || 'Não informado'],
  ];

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card protocol-modal" role="dialog" aria-modal="true" aria-labelledby="protocol-detail-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><span className="modal-eyebrow">Detalhe do protocolo</span><h2 id="protocol-detail-title">{protocol.numero_eprotocolo || protocol.numero_processo || 'Registro selecionado'}</h2></div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
        </div>
        <div className="protocol-detail-grid">
          {fields.map(([label, value]) => <div className="protocol-detail-field" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <section className="agent-panel" aria-labelledby="agent-panel-title">
          <div className="agent-panel-heading"><div><span className="modal-eyebrow">Protocol Intelligence · modo demonstração</span><h3 id="agent-panel-title">Agente de triagem</h3></div><span className="agent-chip">IA simulada</span></div>
          {!recommendation ? <button className="btn btn-primary" type="button" onClick={() => setRecommendation(createDemoRecommendation(protocol))}>Analisar com agente</button> : <>
            <div className="agent-summary"><div><span>Prioridade sugerida</span><strong>{recommendation.priority}</strong></div><div><span>Unidade sugerida</span><strong>{recommendation.suggestedUnit}</strong></div><div><span>Confiança</span><strong>{Math.round(recommendation.confidence * 100)}%</strong></div></div>
            <ul className="agent-reasons">{recommendation.rationale.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            <p className="agent-alert">⚠ {recommendation.alerts[0]}</p>
            <ol className="agent-audit" aria-label="Trilha demonstrativa do agente">{buildDemoAuditTrail(recommendation).map((step) => <li key={step.label} data-status={step.status}><span aria-hidden="true" />{step.label}</li>)}</ol>
            {recommendation.decision === 'PENDING' ? <div className="agent-actions"><button className="btn btn-primary" type="button" onClick={() => setRecommendation(decideDemoRecommendation(recommendation, 'APPROVED'))}>Aprovar simulação</button><button className="btn btn-ghost" type="button" onClick={() => setRecommendation(decideDemoRecommendation(recommendation, 'REJECTED'))}>Rejeitar</button></div> : <p className="agent-decision">Decisão simulada: <strong>{recommendation.decision === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}</strong>. Nenhuma alteração foi aplicada.</p>}
          </>}
        </section>
        <div className="modal-footer"><span>Informações recebidas da fonte de dados</span><button className="btn btn-primary" type="button" onClick={onClose}>Fechar</button></div>
      </section>
    </div>
  );
}
