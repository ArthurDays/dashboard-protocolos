import { useKPIs } from '../hooks/useKPIs';
import RankingBarChart from './RankingBarChart';

export default function BarChart() {
  const { tiposAgrupados } = useKPIs();
  return <RankingBarChart items={tiposAgrupados} title="Top 5 Tipos de Documento" icon="📊" modalTitle="Outros tipos de documento" />;
}
