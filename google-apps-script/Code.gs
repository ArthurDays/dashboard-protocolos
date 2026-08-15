/**
 * Google Apps Script — Backend do Painel de Protocolos
 *
 * Este script lê TODAS as abas (meses) da planilha "Caderno de Entrada 2026"
 * e consolida todas as linhas em um único JSON retornado para o dashboard.
 */

const EXPORTED_HEADERS = new Set([
  'Data', 'Canal de Entrada', 'Canal', 'Tipo de Documento', 'Interessado',
  'Assunto', 'Unidade', 'Número e-Protocolo', 'Número do Processo',
  'Nº e-Protocolo', 'Nº Processo', 'Status', 'Prioridade',
]);

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();

    let allHeaders = [];
    const allRows = [];

    sheets.forEach((sheet) => {
      const sheetName = sheet.getName();
      // Ignora abas ocultas ou de resumo/instruções se houver
      if (sheet.isSheetHidden()) return;

      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) return; // Vazia ou apenas cabeçalho

      const sourceHeaders = data[0].map((h) => String(h).trim());
      const headers = sourceHeaders.filter((header) => EXPORTED_HEADERS.has(header));
      if (allHeaders.length === 0) {
        allHeaders = headers;
      }

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const obj = { _aba: sheetName, Mes_Origem: sheetName.trim().toUpperCase() };
        let hasAnyValue = false;

        headers.forEach((header) => {
          const columnIndex = sourceHeaders.indexOf(header);
          let value = row[columnIndex];
          if (value instanceof Date) {
            const d = String(value.getDate()).padStart(2, '0');
            const m = String(value.getMonth() + 1).padStart(2, '0');
            const y = value.getFullYear();
            value = `${d}/${m}/${y}`;
          } else {
            value = value !== null && value !== undefined ? String(value).trim() : '';
          }
          obj[header] = value;
          if (value) hasAnyValue = true;
        });

        if (hasAnyValue) {
          allRows.push(obj);
        }
      }
    });

    return createJsonResponse({
      error: false,
      headers: allHeaders,
      rows: allRows,
      timestamp: new Date().toISOString(),
      totalRows: allRows.length,
      totalAbas: sheets.length,
    });
  } catch (err) {
    return createJsonResponse({
      error: true,
      message: err.message,
      headers: [],
      rows: [],
      timestamp: new Date().toISOString(),
    });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
