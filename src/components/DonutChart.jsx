import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useKPIs } from '../hooks/useKPIs';
import OtherItemsModal from './OtherItemsModal';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#4f46e5', '#0891b2', '#d97706', '#059669', '#db2777', '#64748b'];

export default function DonutChart() {
  const { canaisAgrupados } = useKPIs();
  const [otherItems, setOtherItems] = useState([]);
  const labels = canaisAgrupados.map((item) => item.label);
  const values = canaisAgrupados.map((item) => item.value);
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  const data = { labels, datasets: [{ data: values, backgroundColor: COLORS.slice(0, labels.length), hoverBackgroundColor: COLORS.slice(0, labels.length).map((color) => color), borderWidth: 0, spacing: 3, borderRadius: 4 }] };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    onClick: (_event, elements) => {
      const index = elements[0]?.index;
      if (labels[index] === 'Outros') setOtherItems(canaisAgrupados[index].items);
    },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#334155', font: { family: "'Inter', sans-serif", size: 12, weight: '600' }, padding: 16, usePointStyle: true, pointStyleWidth: 12 } },
      tooltip: { callbacks: { label: (context) => ` ${context.raw} registros (${((context.raw / total) * 100).toFixed(1)}%)` } },
    },
  };

  return (
    <div className="glass-card chart-container animate-fade-in-up">
      <div className="chart-title"><span className="chart-title-icon">🍩</span>Meios de Entrada</div>
      <div className="chart-wrapper">{labels.length ? <Doughnut data={data} options={options} /> : <p className="table-empty">Nenhum dado disponível</p>}</div>
      <OtherItemsModal items={otherItems} title="Outros meios de entrada" onClose={() => setOtherItems([])} />
    </div>
  );
}
