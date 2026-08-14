import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import OtherItemsModal from './OtherItemsModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const COLORS = ['#4f46e5', '#0891b2', '#d97706', '#059669', '#db2777', '#64748b'];

export default function RankingBarChart({ items, title, icon, modalTitle, color = COLORS[0] }) {
  const [otherItems, setOtherItems] = useState([]);
  const labels = items.map((item) => item.label);
  const data = {
    labels,
    datasets: [{
      data: items.map((item) => item.value),
      backgroundColor: items.map((_, index) => index === items.length - 1 && labels[index] === 'Outros' ? '#94a3b8' : color),
      borderColor: items.map((_, index) => index === items.length - 1 && labels[index] === 'Outros' ? '#64748b' : color),
      borderWidth: 1,
      borderRadius: 5,
      borderSkipped: false,
      barThickness: 22,
    }],
  };
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event, elements) => {
      const item = items[elements[0]?.index];
      if (item?.label === 'Outros') setOtherItems(item.items);
    },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', precision: 0 }, border: { display: false } },
      y: { grid: { display: false }, ticks: { color: '#334155', font: { family: "'Inter', sans-serif", size: 11, weight: '600' } }, border: { color: '#e2e8f0' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#cbd5e1', cornerRadius: 8, padding: 12, callbacks: { label: (context) => ` ${context.raw} protocolos` } },
    },
  };

  return (
    <div className="glass-card chart-container animate-fade-in-up">
      <div className="chart-title"><span className="chart-title-icon">{icon}</span>{title}</div>
      <div className="chart-wrapper ranking-chart-wrapper">
        {items.length ? <Bar data={data} options={options} /> : <p className="table-empty">Nenhum dado disponível</p>}
      </div>
      <OtherItemsModal items={otherItems} title={modalTitle} onClose={() => setOtherItems([])} />
    </div>
  );
}
