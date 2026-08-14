export default function OtherItemsModal({ items, title, onClose }) {
  if (!items?.length) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="other-items-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Detalhamento</span>
            <h2 id="other-items-title">{title}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
        </div>
        <div className="modal-table-wrapper">
          <table className="modal-table">
            <thead><tr><th>Categoria</th><th>Quantidade</th></tr></thead>
            <tbody>{items.map((item) => <tr key={item.label}><td>{item.label}</td><td className="mono">{item.value}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="modal-footer"><span>{items.length} categorias agrupadas</span><button className="btn btn-primary" type="button" onClick={onClose}>Fechar</button></div>
      </section>
    </div>
  );
}
