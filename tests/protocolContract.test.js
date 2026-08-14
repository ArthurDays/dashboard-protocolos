import test from 'node:test';
import assert from 'node:assert/strict';
import { extractProtocolRows, protocolToExportRow, validateProtocolPayload } from '../src/services/protocolContract.js';

test('aceita array, rows e data como envelopes', () => {
  const row = { data: '14/08/2026' };
  assert.deepEqual(extractProtocolRows([row]), [row]);
  assert.deepEqual(extractProtocolRows({ rows: [row] }), [row]);
  assert.deepEqual(extractProtocolRows({ data: [row] }), [row]);
});

test('rejeita payload sem coleção de protocolos', () => {
  assert.throws(() => validateProtocolPayload({ ok: true }), /Resposta inválida/);
});

test('gera linha exportável com campos estáveis', () => {
  const row = protocolToExportRow({ data: '14/08/2026', mes_origem: 'AGOSTO', interessado: 'Ana', assunto: 'Pedido' });
  assert.equal(row.Data, '14/08/2026');
  assert.equal(row['Mês de origem'], 'AGOSTO');
  assert.equal(row.Interessado, 'Ana');
  assert.equal(row.Assunto, 'Pedido');
  assert.equal(row.Unidade, '');
});
