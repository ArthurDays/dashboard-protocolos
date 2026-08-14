import { useMemo, useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { protocolToExportRow } from '../services/protocolContract';
import ProtocolDetailModal from './ProtocolDetailModal';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const UNIDADE_COLORS = { ASSAD: 'badge-primary', SUOP: 'badge-secondary', DIPRIN: 'badge-accent', SEMAD: 'badge-success', GAPRE: 'badge-error', SEPLAN: 'badge-primary', SEMOB: 'badge-secondary' };

export default function RecentTable() {
  const { protocolosFiltrados } = useDashboard();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('recent');
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const searched = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    const result = protocolosFiltrados.filter((record) => {
      if (!normalizedQuery) return true;
      return [record.data, record.interessado, record.tipo_documento, record.canal_entrada, record.unidade, record.assunto, record.numero_eprotocolo, record.numero_processo, record.mes_origem]
        .filter(Boolean).some((value) => String(value).toLocaleLowerCase('pt-BR').includes(normalizedQuery));
    });
    return [...result].sort((a, b) => sort === 'oldest' ? a._parsedDate - b._parsedDate : b._parsedDate - a._parsedDate);
  }, [protocolosFiltrados, query, sort]);

  const totalPages = Math.max(1, Math.ceil(searched.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRecords = searched.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateQuery(value) { setQuery(value); setPage(1); }
  function updatePageSize(value) { setPageSize(Number(value)); setPage(1); }

  function exportCsv() {
    const rows = searched.map(protocolToExportRow);
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = `\uFEFF${[headers, ...rows.map((row) => headers.map((header) => row[header]))].map((row) => row.map(escape).join(';')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `protocolos-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass-card recent-table-container animate-fade-in-up">
      <div className="table-header table-header-stack">
        <div className="table-title"><span>📝</span>Protocolos <span className="table-count">{searched.length} encontrados</span></div>
        <div className="table-controls">
          <label className="table-search"><span aria-hidden="true">⌕</span><input className="form-input" type="search" value={query} onChange={(e) => updateQuery(e.target.value)} placeholder="Buscar protocolo, interessado..." aria-label="Buscar protocolos" /></label>
          <button className="btn btn-ghost" type="button" onClick={exportCsv} disabled={!searched.length}>Exportar CSV</button>
          <select className="form-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Ordenar protocolos"><option value="recent">Mais recentes</option><option value="oldest">Mais antigos</option></select>
        </div>
      </div>

      {visibleRecords.length > 0 ? <div className="table-scroll"><table className="recent-table"><thead><tr><th>Data</th><th>Interessado</th><th>Tipo de Documento</th><th>Canal</th><th>Unidade</th><th>Ação</th></tr></thead><tbody>
        {visibleRecords.map((record, index) => <tr key={`${record.data}-${record.interessado}-${record.numero_processo}-${index}`} style={{ animationDelay: `${index * 40}ms` }}>
          <td>{record.data}</td><td className="table-primary-cell">{record.interessado}</td><td>{record.tipo_documento}</td><td><span className="badge badge-secondary">{record.canal_entrada}</span></td><td><span className={`badge ${UNIDADE_COLORS[record.unidade] || 'badge-primary'}`}>{record.unidade}</span></td><td><button className="btn btn-ghost btn-small" type="button" onClick={() => setSelectedProtocol(record)}>Ver detalhes</button></td>
        </tr>)}
      </tbody></table></div> : <div className="table-empty">Nenhum registro encontrado com os filtros atuais.</div>}

      <div className="table-footer"><label>Exibir <select className="form-select" value={pageSize} onChange={(e) => updatePageSize(e.target.value)} aria-label="Quantidade por página">{PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}</select> por página</label><div className="pagination"><button className="btn btn-ghost btn-small" type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Anterior</button><span>Página {currentPage} de {totalPages}</span><button className="btn btn-ghost btn-small" type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Próxima</button></div></div>
      <ProtocolDetailModal protocol={selectedProtocol} onClose={() => setSelectedProtocol(null)} />
    </div>
  );
}
