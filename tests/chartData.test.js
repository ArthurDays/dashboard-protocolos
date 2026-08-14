import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateObjectTopN, aggregateTopN } from '../src/utils/chartData.js';
import { filterProtocols } from '../src/utils/filtering.js';

test('filtra protocolos por meio e tipo de documento', () => {
  const records = [
    { canal_entrada: 'E-mail', tipo_documento: 'Ofício', data: '01/08/2026', mes_origem: 'AGOSTO' },
    { canal_entrada: 'Balcão', tipo_documento: 'Ofício', data: '02/08/2026', mes_origem: 'AGOSTO' },
    { canal_entrada: 'E-mail', tipo_documento: 'Requerimento', data: '03/08/2026', mes_origem: 'AGOSTO' },
  ];

  assert.equal(filterProtocols(records, { mes: 'Todos', canal: 'E-mail', tipoDocumento: 'Ofício' }).length, 1);
  assert.equal(filterProtocols(records, { mes: 'Todos', canal: 'Balcão', tipoDocumento: '' }).length, 1);
});

test('mantém as cinco maiores categorias em ordem decrescente', () => {
  const result = aggregateTopN([
    ['A', 1], ['B', 10], ['C', 8], ['D', 7], ['E', 6], ['F', 5], ['G', 2],
  ]);

  assert.deepEqual(result.map((item) => item.label), ['B', 'C', 'D', 'E', 'F', 'Outros']);
  assert.equal(result.at(-1).value, 3);
  assert.deepEqual(result.at(-1).items, [{ label: 'G', value: 2 }, { label: 'A', value: 1 }]);
});

test('não cria Outros quando há no máximo cinco categorias', () => {
  const result = aggregateObjectTopN({ A: 2, B: 1 });
  assert.deepEqual(result.map((item) => item.label), ['A', 'B']);
  assert.ok(result.every((item) => item.items.length === 0));
});

test('descarta valores nulos ou zerados', () => {
  const result = aggregateTopN([['A', 0], ['B', null], ['C', 3]]);
  assert.deepEqual(result, [{ label: 'C', value: 3, items: [] }]);
});
