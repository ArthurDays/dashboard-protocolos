export const PROTOCOL_CONTRACT_VERSION = '1.0';

export const PROTOCOL_FIELDS = [
  'data',
  'canal_entrada',
  'tipo_documento',
  'interessado',
  'unidade',
  'mes_origem',
];

export function extractProtocolRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  return null;
}

export function validateProtocolPayload(payload) {
  const rows = extractProtocolRows(payload);
  if (!Array.isArray(rows)) {
    const error = new Error('Resposta inválida: esperado um array de protocolos.');
    error.type = 'contract';
    throw error;
  }
  return rows;
}

export function protocolToExportRow(protocol) {
  return {
    Data: protocol.data || '',
    'Mês de origem': protocol.mes_origem || '',
    Interessado: protocol.interessado || '',
    'Tipo de documento': protocol.tipo_documento || '',
    Canal: protocol.canal_entrada || '',
    Unidade: protocol.unidade || '',
    'Nº e-protocolo': protocol.numero_eprotocolo || '',
    'Nº processo': protocol.numero_processo || '',
    Assunto: protocol.assunto || '',
  };
}
