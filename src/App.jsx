import { DashboardProvider } from './context/DashboardContext';
import { useDashboard } from './hooks/useDashboard';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KPICards from './components/KPICards';
import DonutChart from './components/DonutChart';
import BarChart from './components/BarChart';
import UnitChart from './components/UnitChart';
import RecentTable from './components/RecentTable';
import ErrorScreen from './components/ErrorScreen';
import './App.css';

function DashboardContent() {
  const { status, errorType, isRefreshing } = useDashboard();

  // Loading state
  if (status === 'loading' && isRefreshing) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p className="loading-text">Carregando dados do Caderno de Entrada…</p>
      </div>
    );
  }

  // Structural error (EC02)
  if (errorType === 'structure') {
    return (
      <>
        <Header />
        <ErrorScreen />
      </>
    );
  }

  // Dashboard normal
  return (
    <div className="app">
      <Header />
      <FilterBar />
      <main className="main-content">
        <KPICards />
        <section className="charts-row">
          <DonutChart />
          <BarChart />
          <UnitChart />
        </section>
        <RecentTable />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
