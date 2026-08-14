import { useKPIs } from '../hooks/useKPIs';
import RankingBarChart from './RankingBarChart';

export default function UnitChart() {
  const { unidadesAgrupadas } = useKPIs();
  return <RankingBarChart items={unidadesAgrupadas} title="Protocolos por Unidade" icon="🏢" modalTitle="Outras unidades" color="#0891b2" />;
}
