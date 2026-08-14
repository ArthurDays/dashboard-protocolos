import { useDashboard } from '../hooks/useDashboard';
import { useKPIs } from '../hooks/useKPIs';
import { monthRange } from '../utils/filtering';

export default function FilterBar() {
  const { filters, setFilters, clearFilters, todosProtocolos } = useDashboard();
  const { mesesDisponiveis, canaisUnicos, tiposUnicos } = useKPIs();

  function changeMonth(value) {
    if (value === 'Todos') {
      setFilters({ mes: 'Todos', dateStart: '', dateEnd: '' });
      return;
    }
    if (value === 'Personalizado') {
      setFilters({ mes: 'Personalizado' });
      return;
    }
    setFilters({ mes: value, ...monthRange(value, todosProtocolos) });
  }

  function changeDate(key, value) {
    setFilters({ [key]: value, mes: 'Personalizado' });
  }

  const active = filters.mes !== 'Todos' || filters.dateStart || filters.dateEnd || filters.canal || filters.tipoDocumento;
  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <div className="form-control">
          <label className="form-label" htmlFor="filter-mes">Mês de Referência</label>
          <select id="filter-mes" className="form-select" value={filters.mes} onChange={(e) => changeMonth(e.target.value)}>
            <option value="Todos">Todos</option>
            {mesesDisponiveis.map((month) => <option key={month.val} value={month.val}>{month.label}</option>)}
            <option value="Personalizado">Personalizado</option>
          </select>
        </div>
        <div className="filter-divider" />
        <div className="filter-group">
          <div className="form-control">
            <label className="form-label" htmlFor="filter-date-start">Data Inicial</label>
            <input id="filter-date-start" type="date" className="form-input" value={filters.dateStart} onChange={(e) => changeDate('dateStart', e.target.value)} />
          </div>
          <div className="form-control">
            <label className="form-label" htmlFor="filter-date-end">Data Final</label>
            <input id="filter-date-end" type="date" className="form-input" value={filters.dateEnd} onChange={(e) => changeDate('dateEnd', e.target.value)} />
          </div>
        </div>
        <div className="filter-divider" />
        <div className="form-control">
          <label className="form-label" htmlFor="filter-canal">Meio de Protocolização</label>
          <select id="filter-canal" className="form-select" value={filters.canal || ''} onChange={(e) => setFilters({ canal: e.target.value })}>
            <option value="">Todos</option>
            {canaisUnicos.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
        </div>
        <div className="filter-divider" />
        <div className="form-control">
          <label className="form-label" htmlFor="filter-tipo">Tipo de Documento</label>
          <select id="filter-tipo" className="form-select" value={filters.tipoDocumento || ''} onChange={(e) => setFilters({ tipoDocumento: e.target.value })}>
            <option value="">Todos</option>
            {tiposUnicos.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        {active && <div className="filter-actions"><button className="btn btn-ghost" onClick={clearFilters}>✕ Limpar Filtros</button></div>}
      </div>
    </div>
  );
}
