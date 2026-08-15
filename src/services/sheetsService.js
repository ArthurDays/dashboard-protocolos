/**
 * Serviço de integração com Google Sheets via Google Apps Script Web App.
 *
 * Responsável por:
 * - Fetch de dados (real ou mock)
 * - Cache em LocalStorage com fallback
 * - Validação de cabeçalhos da planilha
 * - Parse de datas (DD/MM/AAAA e Date string)
 */

import { MOCK_RESPONSE } from './mockData';
import { validateProtocolPayload } from './protocolContract';

// ---------- Configuration ----------

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL || '';
const API_URL = import.meta.env.VITE_PROTOCOLS_API_URL || '';
const DATA_URL = API_URL || SHEETS_URL;
const USE_MOCK = !DATA_URL;
const CACHE_KEY = 'dashboard_protocolos_cache';

/**
 * Mapeamento flexível de colunas para aceitar os nomes exatos da planilha real:
 * - DATA
 * - PROTOCOLIZAÇÃO\nE-MAIL / BALCÃO / E-PROTOCOLO (ou MEIO DE PROTOCOLIZAÇÃO)
 * - NÚMERO DO\nE-PROTOCOLO (ou Nº E-PROTOCOLO)
 * - TIPO DE DOCUMENTO
 * - INTERESSADO
 * - ASSUNTO
 * - NÚMERO DE PROCESSO (ou Nº PROCESSO)
 * - UNIDADE DE DESTINO (ou UNIDADE)
 */

function findMatchingColumn(rowObj, candidates) {
  const keys = Object.keys(rowObj);
  for (const candidate of candidates) {
    // Exact match
    if (keys.includes(candidate)) return candidate;
    // Case/whitespace insensitive match
    const normalizedCandidate = candidate.replace(/\s+/g, ' ').toLowerCase();
    const found = keys.find((k) => k.replace(/\s+/g, ' ').toLowerCase() === normalizedCandidate);
    if (found) return found;
  }
  return null;
}

const REQUIRED_COLUMNS = {
  date: ['DATA', 'Data', 'data'],
  channel: ['PROTOCOLIZAÇÃO\nE-MAIL / BALCÃO / E-PROTOCOLO', 'MEIO DE PROTOCOLIZAÇÃO', 'PROTOCOLIZAÇÃO', 'CANAL', 'canal_entrada'],
  type: ['TIPO DE DOCUMENTO', 'TIPO', 'tipo_documento'],
  interested: ['INTERESSADO', 'REQUERENTE', 'interessado'],
  unit: ['UNIDADE DE DESTINO', 'UNIDADE', 'SETOR', 'unidade'],
};

// ---------- Date Helpers ----------

/**
 * Converte string de data (DD/MM/AAAA ou Date string do JS) em Date object.
 * Retorna null se a data for inválida.
 */
export function parseDate(value) {
  if (!value) return null;

  // Se já for Date object
  if (value instanceof Date && !isNaN(value.getTime())) return value;

  const str = String(value).trim();
  if (!str) return null;

  // Formato DD/MM/AAAA
  const ddmmPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  const match = str.match(ddmmPattern);
  if (match) {
    const [, d, m, y] = match.map(Number);
    const date = new Date(y, m - 1, d);
    if (!isNaN(date.getTime()) && date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) return date;
  }

  // Tenta parse nativo do JS (ex: "Mon Jan 05 2026 05:00:00 GMT-0300")
  const nativeParsed = new Date(str);
  if (!isNaN(nativeParsed.getTime())) return nativeParsed;

  return null;
}

/**
 * Formata Date para DD/MM/AAAA.
 */
export function formatDate(date) {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// ---------- Cache ----------

function saveToCache(data) {
  try {
    const payload = {
      data,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('[Cache] Falha ao salvar no LocalStorage:', e);
  }
}

function loadFromCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Cache] Falha ao ler do LocalStorage:', e);
    return null;
  }
}

export function getLastCacheTime() {
  const cached = loadFromCache();
  return cached?.cachedAt || null;
}

// ---------- Data Processing ----------

/**
 * Normaliza os nomes dos tipos de documento (ex: "Ofício nº 640/2025" -> "Ofício")
 */
function normalizeTipoDocumento(tipoStr) {
  if (!tipoStr) return 'Não especificado';
  const clean = String(tipoStr).trim();
  const lower = clean.toLowerCase();

  if (lower.includes('ofício') || lower.includes('oficio')) return 'Ofício';
  if (lower.includes('ficha de cadastro')) return 'Ficha de Cadastro';
  if (lower.includes('abaixo-assinado') || lower.includes('abaixo assinado')) return 'Abaixo-assinado';
  if (lower.includes('requerimento')) return 'Requerimento';
  if (lower.includes('memorando')) return 'Memorando';
  if (lower.includes('certidão') || lower.includes('certidao')) return 'Certidão';
  if (lower.includes('comunicação interna') || lower.includes('comunicacao interna') || lower.includes('ci')) return 'Comunicação Interna';
  if (lower.includes('declaração') || lower.includes('declaracao')) return 'Declaração';

  // Se não bater com padrão, pega as duas primeiras palavras
  return clean.split(/\s+/).slice(0, 2).join(' ');
}

/**
 * Normaliza o canal de entrada
 */
function normalizeCanal(canalStr) {
  if (!canalStr) return 'Não informado';
  const clean = String(canalStr).trim();
  const lower = clean.toLowerCase();

  if (lower.includes('e-mail') || lower.includes('email')) return 'E-mail';
  if (lower.includes('balcão') || lower.includes('balcao')) return 'Balcão';
  if (lower.includes('e-protocolo') || lower.includes('eprotocolo')) return 'E-protocolo';
  if (lower.includes('físico') || lower.includes('fisico')) return 'Físico';

  return clean;
}

/**
 * Normaliza a unidade de destino
 */
function normalizeUnidade(unidadeStr) {
  if (!unidadeStr) return 'Outros';
  const clean = String(unidadeStr).trim().toUpperCase();
  return clean || 'Outros';
}

const MONTH_NAMES_PT_BR = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

function normalizeOrigin(row, parsedDate) {
  const explicitOrigin = row.Mes_Origem || row.mes_origem || row.sourceMonth || row._aba;
  if (explicitOrigin) return String(explicitOrigin).trim().toUpperCase();
  if (parsedDate) return MONTH_NAMES_PT_BR[parsedDate.getMonth()];
  return 'NÃO INFORMADO';
}

/**
 * Processa as linhas brutas, extraindo colunas por candidatos e normalizando datas.
 */
function processRows(rows) {
  if (!rows || rows.length === 0) return [];

  const sample = rows[0] || {};

  // Descobre nomes exatos das colunas
  const dateCol = findMatchingColumn(sample, REQUIRED_COLUMNS.date);
  const canalCol = findMatchingColumn(sample, REQUIRED_COLUMNS.channel);
  const eprotocoloCol = findMatchingColumn(sample, [
    'NÚMERO DO\nE-PROTOCOLO',
    'Nº E-PROTOCOLO',
    'E-PROTOCOLO',
    'numero_eprotocolo',
  ]);
  const tipoCol = findMatchingColumn(sample, REQUIRED_COLUMNS.type);
  const interessadoCol = findMatchingColumn(sample, REQUIRED_COLUMNS.interested);
  const assuntoCol = findMatchingColumn(sample, ['ASSUNTO', 'assunto']);
  const processoCol = findMatchingColumn(sample, ['NÚMERO DE PROCESSO', 'Nº PROCESSO', 'numero_processo', 'process_number']);
  const unidadeCol = findMatchingColumn(sample, REQUIRED_COLUMNS.unit);

  const missing = Object.entries({ dateCol, canalCol, tipoCol, interessadoCol, unidadeCol })
    .filter(([, value]) => !value)
    .map(([key]) => key.replace('Col', ''));
  if (missing.length) {
    const error = new Error(`Colunas obrigatórias ausentes: ${missing.join(', ')}`);
    error.type = 'structure';
    error.column = missing.join(', ');
    throw error;
  }

  const processed = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawDate = row[dateCol];
    const parsedDate = parseDate(rawDate);

    if (!parsedDate) {
      if (rawDate !== '' && rawDate !== null && rawDate !== undefined) {
        console.warn(`[Data] Linha ${i + 2} ignorada: data inválida "${rawDate}"`, row);
      }
      continue;
    }

    const rawCanal = row[canalCol] || '';
    const rawTipo = row[tipoCol] || '';
    const rawUnidade = row[unidadeCol] || '';

    const origin = normalizeOrigin(row, parsedDate);
    processed.push({
      data: formatDate(parsedDate),
      _parsedDate: parsedDate,
      canal_entrada: normalizeCanal(rawCanal),
      canal_raw: rawCanal,
      numero_eprotocolo: row[eprotocoloCol] || '',
      tipo_documento: normalizeTipoDocumento(rawTipo),
      tipo_raw: rawTipo,
      interessado: row[interessadoCol] || 'Não informado',
      assunto: row[assuntoCol] || '',
      numero_processo: row[processoCol] || '',
      unidade: normalizeUnidade(rawUnidade),
      unidade_raw: rawUnidade,
      mes_origem: origin,
    });
  }

  // Ordena por data descendente
  processed.sort((a, b) => b._parsedDate - a._parsedDate);
  return processed;
}

// ---------- Fetch V2 - Simples ----------

/**
 * Busca os dados brutos de todas as abas da planilha.
 * A resposta já vem em um formato unificado do Google Apps Script,
 * incluindo o campo 'Mes_Origem'.
 * @returns {Promise<Array>} Uma promessa que resolve para o array de linhas (protocolos).
 */
export async function buscarDadosPlanilha() {
  const URL_PLANILHA_UNIFICADA = DATA_URL;

  if (!URL_PLANILHA_UNIFICADA) {
    console.warn(
      'A URL do Google Apps Script não foi definida. Usando dados de mock.',
      'Por favor, defina a constante URL_PLANILHA_UNIFICADA em src/services/api.js'
    );
    // Simula um retorno com a estrutura esperada e o novo campo
    const mockDataWithOrigin = MOCK_RESPONSE.rows.map((row, index) => ({
      ...row,
      // Adiciona Mes_Origem simulado para fins de desenvolvimento
      Mes_Origem: index % 2 === 0 ? 'Janeiro/2026' : 'Fevereiro/2026',
    }));
    return mockDataWithOrigin;
  }

  try {
    const response = await fetch(URL_PLANILHA_UNIFICADA);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    const data = await response.json();
    // O backend já retorna o array de objetos diretamente em `data.rows`
    return data.rows || [];
  } catch (error) {
    console.error('Falha ao buscar dados da planilha:', error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

// ---------- Fetch ----------

/**
 * Busca os dados da planilha (ou mock).
 */
export async function fetchSheetData() {
  if (USE_MOCK) {
    const { rows, timestamp } = MOCK_RESPONSE;
    const records = processRows(rows.map((row, index) => ({
      ...row,
      Mes_Origem: index % 2 === 0 ? 'JANEIRO' : 'FEVEREIRO',
    })));
    saveToCache({ records, timestamp });
    return { records, timestamp, source: 'mock', error: null };
  }

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    const rows = validateProtocolPayload(json);
    const { timestamp } = json;

    if (!rows || rows.length === 0) {
      return {
        records: [],
        timestamp: timestamp || new Date().toISOString(),
        source: 'live',
        error: null,
      };
    }

    const records = processRows(rows);
    saveToCache({ records, timestamp: timestamp || new Date().toISOString() });

    return {
      records,
      timestamp: timestamp || new Date().toISOString(),
      source: 'live',
      error: null,
    };
  } catch (err) {
    console.error('[Fetch] Falha ao buscar dados:', err);

    if (err.type === 'structure') {
      return {
        records: [],
        timestamp: null,
        source: 'live',
        error: { type: 'structure', column: err.column, message: err.message },
      };
    }

    // EC01: Fallback para cache
    const cached = loadFromCache();
    if (cached) {
      return {
        records: cached.data.records,
        timestamp: cached.cachedAt,
        source: 'cache',
        error: {
          type: 'network',
          message: `Falha de conexão. Exibindo dados desatualizados da última leitura às ${new Date(cached.cachedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
        },
      };
    }

    return {
      records: [],
      timestamp: null,
      source: 'cache',
      error: {
        type: 'network',
        message: 'Falha de conexão e nenhum cache disponível. Verifique sua conexão e tente novamente.',
      },
    };
  }
}
