import { useMemo } from 'react';
import { useDashboard } from './useDashboard';
import { aggregateObjectTopN } from '../utils/chartData';

export function useKPIs() {
  const { todosProtocolos, protocolosFiltrados } = useDashboard();

  return useMemo(() => {
    const days = new Set(protocolosFiltrados.map((record) => record.data).filter(Boolean));
    const digital = protocolosFiltrados.filter((r) => ['E-mail', 'E-protocolo'].includes(r.canal_entrada)).length;
    const fisico = protocolosFiltrados.filter((r) => ['Balcão', 'Físico'].includes(r.canal_entrada)).length;
    const totalCanais = digital + fisico || 1;
    const proporcaoCanais = protocolosFiltrados.reduce((result, record) => {
      const key = record.canal_entrada || 'Não informado';
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});

    const unidades = [...new Set(protocolosFiltrados.map((r) => r.unidade || 'Não informado'))].sort();
    const unidadeTotais = protocolosFiltrados.reduce((result, record) => {
      const key = record.unidade || 'Não informado';
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    const tipoTotais = protocolosFiltrados.reduce((result, record) => {
      const key = record.tipo_documento || 'Não informado';
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    const tiposAgrupados = aggregateObjectTopN(tipoTotais);
    const tiposVisiveis = tiposAgrupados.map((item) => item.label);
    const matriz = Object.fromEntries(tiposVisiveis.map((tipo) => [tipo, Object.fromEntries(unidades.map((u) => [u, 0]))]));

    protocolosFiltrados.forEach((record) => {
      const tipo = record.tipo_documento || 'Não informado';
      const tipoAgrupado = tiposVisiveis.includes(tipo) ? tipo : 'Outros';
      const unidade = record.unidade || 'Não informado';
      matriz[tipoAgrupado][unidade] = (matriz[tipoAgrupado][unidade] || 0) + 1;
    });

    const meses = [...new Set(todosProtocolos.map((r) => r.mes_origem).filter(Boolean))].sort((a, b) => {
      const order = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
      return order.indexOf(a.split('/')[0]) - order.indexOf(b.split('/')[0]);
    });

    return {
      totalGeral: protocolosFiltrados.length,
      mediaDiaria: (protocolosFiltrados.length / (days.size || 1)).toFixed(1),
      comparativo: { digital, fisico, digitalPct: Math.round((digital / totalCanais) * 100), fisicoPct: Math.round((fisico / totalCanais) * 100) },
      proporcaoCanais,
      canaisAgrupados: aggregateObjectTopN(proporcaoCanais),
      tiposAgrupados,
      unidadesAgrupadas: aggregateObjectTopN(unidadeTotais),
      matrizTipoUnidade: {
        labels: unidades,
        datasets: tiposAgrupados.map((tipo) => ({
          label: tipo.label,
          data: unidades.map((unidade) => matriz[tipo.label][unidade] || 0),
          outros: tipo.items,
        })),
      },
      ultimosRegistros: protocolosFiltrados.slice(0, 5),
      canaisUnicos: [...new Set(todosProtocolos.map((r) => r.canal_entrada).filter(Boolean))].sort(),
      tiposUnicos: [...new Set(todosProtocolos.map((r) => r.tipo_documento).filter(Boolean))].sort(),
      mesesDisponiveis: meses.map((mes) => ({ val: mes, label: mes })),
    };
  }, [todosProtocolos, protocolosFiltrados]);
}
