import { useEffect, useRef, useState } from 'react';
import { useKPIs } from '../hooks/useKPIs';

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(current);

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      } else {
        setDisplay(typeof value === 'string' ? value : target);
      }
    }

    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);

  return <>{display}</>;
}

export default function KPICards() {
  const { totalGeral, mediaDiaria, comparativo } = useKPIs();

  return (
    <div className="kpi-row stagger">
      {/* Card 1: Total Geral */}
      <div className="glass-card kpi-card animate-fade-in-up" style={{ '--kpi-color': 'var(--color-primary)' }}>
        <div className="kpi-header">
          <span className="kpi-label">Total Geral</span>
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
            📄
          </div>
        </div>
        <div className="kpi-value">
          <AnimatedNumber value={totalGeral} />
        </div>
        <div className="kpi-footer">
          <span>protocolos no período</span>
        </div>
      </div>

      {/* Card 2: Média Diária */}
      <div className="glass-card kpi-card animate-fade-in-up" style={{ '--kpi-color': 'var(--color-secondary)' }}>
        <div className="kpi-header">
          <span className="kpi-label">Média Diária</span>
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
            📅
          </div>
        </div>
        <div className="kpi-value">
          {mediaDiaria}
        </div>
        <div className="kpi-footer">
          <span>entradas por dia</span>
        </div>
      </div>

      {/* Card 3: Digital vs Físico */}
      <div className="glass-card kpi-card animate-fade-in-up" style={{ '--kpi-color': 'var(--color-accent)' }}>
        <div className="kpi-header">
          <span className="kpi-label">Digital vs Físico</span>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
            ⚡
          </div>
        </div>
        <div className="kpi-comparison">
          <div className="kpi-comp-item">
            <span className="kpi-comp-label">Digital</span>
            <span className="kpi-comp-value digital">
              <AnimatedNumber value={comparativo.digital} />
            </span>
            <div className="kpi-comp-bar">
              <div
                className="kpi-comp-bar-fill digital"
                style={{ width: `${comparativo.digitalPct}%` }}
              />
            </div>
            <span className="kpi-footer">{comparativo.digitalPct}%</span>
          </div>

          <span className="kpi-comp-vs">vs</span>

          <div className="kpi-comp-item">
            <span className="kpi-comp-label">Físico</span>
            <span className="kpi-comp-value fisico">
              <AnimatedNumber value={comparativo.fisico} />
            </span>
            <div className="kpi-comp-bar">
              <div
                className="kpi-comp-bar-fill fisico"
                style={{ width: `${comparativo.fisicoPct}%` }}
              />
            </div>
            <span className="kpi-footer">{comparativo.fisicoPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
