export default function ProtocolDetailModal({ protocol, onClose }) {
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
        <div className="modal-footer"><span>Informações recebidas da fonte de dados</span><button className="btn btn-primary" type="button" onClick={onClose}>Fechar</button></div>
      </section>
    </div>
  );
}
