import { useDashboard } from '../hooks/useDashboard';

export default function ErrorScreen() {
  const { errorMessage, errorColumn, refresh } = useDashboard();

  return (
    <div className="error-screen">
      <div className="error-icon">🚨</div>
      <h1 className="error-title">Erro de Estrutura</h1>
      <p className="error-message">
        {errorColumn ? (
          <>
            A coluna <span className="error-column-name">{errorColumn}</span> não
            foi encontrada na planilha. Verifique se o nome foi alterado
            acidentalmente no Caderno de Entrada.
          </>
        ) : (
          errorMessage
        )}
      </p>
      <button className="btn btn-primary" onClick={refresh}>
        🔄 Tentar Novamente
      </button>
    </div>
  );
}
