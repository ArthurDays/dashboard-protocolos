export function toDayKey(value) {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function monthRange(monthValue, records) {
  const match = records.find((record) => record.mes_origem === monthValue);
  if (!match?._parsedDate) return { dateStart: '', dateEnd: '' };
  const year = match._parsedDate.getFullYear();
  const month = match._parsedDate.getMonth();
  return {
    dateStart: `${year}-${String(month + 1).padStart(2, '0')}-01`,
    dateEnd: `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`,
  };
}

export function filterProtocols(records, filters) {
  return records.filter((item) => {
    const itemDay = toDayKey(item._parsedDate || item.data);
    const matchesMonth = filters.mes === 'Todos' || filters.mes === 'Personalizado'
      || item.mes_origem === filters.mes;
    const matchesChannel = !filters.canal || item.canal_entrada === filters.canal;
    const matchesType = !filters.tipoDocumento || item.tipo_documento === filters.tipoDocumento;
    const matchesStart = !filters.dateStart || itemDay >= filters.dateStart;
    const matchesEnd = !filters.dateEnd || itemDay <= filters.dateEnd;
    return matchesMonth && matchesChannel && matchesType && matchesStart && matchesEnd;
  });
}
