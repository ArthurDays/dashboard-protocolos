/**
 * Mantém as maiores categorias e agrupa o restante em "Outros".
 * `items` preserva a composição do agrupamento para drill-down no gráfico.
 */
export function aggregateTopN(entries, limit = 5) {
  const normalized = entries
    .map(([label, value]) => ({ label, value: Number(value) || 0 }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'pt-BR'));

  const top = normalized.slice(0, limit);
  const rest = normalized.slice(limit);

  if (rest.length === 0) return top.map((item) => ({ ...item, items: [] }));

  return [
    ...top.map((item) => ({ ...item, items: [] })),
    {
      label: 'Outros',
      value: rest.reduce((total, item) => total + item.value, 0),
      items: rest,
    },
  ];
}

export function aggregateObjectTopN(values, limit = 5) {
  return aggregateTopN(Object.entries(values), limit);
}
