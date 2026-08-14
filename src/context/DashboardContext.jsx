import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { fetchSheetData } from '../services/sheetsService';
import { filterProtocols } from '../utils/filtering';
import { DashboardContext } from './dashboardContextValue';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

const initialState = {
  todosProtocolos: [],
  protocolosFiltrados: [],
  filters: { mes: 'Todos', dateStart: '', dateEnd: '', canal: '', tipoDocumento: '' },
  status: 'loading',
  errorMessage: null,
  errorType: null,
  errorColumn: null,
  source: null,
  lastSync: null,
  isRefreshing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: state.todosProtocolos.length ? state.status : 'loading', isRefreshing: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: action.error ? 'stale' : 'success',
        todosProtocolos: action.records,
        protocolosFiltrados: filterProtocols(action.records, state.filters),
        source: action.source,
        lastSync: action.timestamp || state.lastSync,
        errorMessage: action.error?.message || null,
        errorType: action.error?.type || null,
        errorColumn: action.error?.column || null,
        isRefreshing: false,
      };
    case 'FETCH_ERROR':
      return { ...state, status: action.error.type === 'structure' ? 'error' : 'stale', errorMessage: action.error.message, errorType: action.error.type, errorColumn: action.error.column || null, isRefreshing: false };
    case 'SET_FILTERS': {
      const filters = { ...state.filters, ...action.filters };
      return { ...state, filters, protocolosFiltrados: filterProtocols(state.todosProtocolos, filters) };
    }
    case 'CLEAR_FILTERS': {
      const filters = { mes: 'Todos', dateStart: '', dateEnd: '', canal: '', tipoDocumento: '' };
      return { ...state, filters, protocolosFiltrados: state.todosProtocolos };
    }
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refresh = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const result = await fetchSheetData();
      if (result.error?.type === 'structure') {
        dispatch({ type: 'FETCH_ERROR', error: result.error });
        return;
      }
      dispatch({ type: 'FETCH_SUCCESS', ...result });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', error: { type: 'network', message: error.message || 'Falha ao carregar os dados.' } });
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const setFilters = useCallback((changes) => dispatch({ type: 'SET_FILTERS', filters: changes }), []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);

  const value = useMemo(() => ({ ...state, refresh, setFilters, clearFilters }), [state, refresh, setFilters, clearFilters]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
