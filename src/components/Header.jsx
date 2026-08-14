import { useDashboard } from '../hooks/useDashboard';

export default function Header() {
  const { status, lastSync, isRefreshing, refresh, errorMessage } = useDashboard();

  const syncLabel = lastSync
    ? new Date(lastSync).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const dotClass = [
    'sync-dot',
    status === 'stale' && 'stale',
    status === 'error' && 'error',
    isRefreshing && 'loading',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <div className="header-logo-icon">📋</div>
              <div>
                <div className="header-title">Painel de Protocolos</div>
                <div className="header-subtitle">Caderno de Entrada 2026</div>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="sync-status">
              <span className={dotClass} />
              <span>
                {status === 'stale'
                  ? 'Dados do cache'
                  : status === 'error'
                  ? 'Offline'
                  : isRefreshing
                  ? 'Atualizando…'
                  : `Sincronizado às ${syncLabel}`}
              </span>
            </div>

            <button
              className="btn btn-primary"
              onClick={refresh}
              disabled={isRefreshing}
              title="Atualizar Agora (FR03)"
            >
              {isRefreshing ? (
                <>
                  <span className="spinner spinner-sm" />
                  Atualizando
                </>
              ) : (
                <>
                  🔄 Atualizar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* EC01: Banner de dados desatualizados */}
      {status === 'stale' && errorMessage && (
        <div className="stale-banner-container">
          <div className="banner banner-warning">
            <span className="banner-icon">⚠️</span>
            <span className="banner-text">
              Aviso: {errorMessage}
            </span>
            <button className="btn btn-ghost banner-action" onClick={refresh}>
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
