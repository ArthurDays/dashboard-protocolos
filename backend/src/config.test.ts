import { describe, expect, it } from 'vitest';
import { assertSecureConfig, config } from './config.js';

const valid = { ...config, readApiKey: 'read-secret', ingestApiKey: 'write-secret' };

describe('assertSecureConfig', () => {
  it('SPECSFY:SEC-001 rejeita chaves ausentes', () => {
    expect(() => assertSecureConfig({ ...valid, readApiKey: '' })).toThrow(/obrigatórias/);
    expect(() => assertSecureConfig({ ...valid, ingestApiKey: '' })).toThrow(/obrigatórias/);
  });

  it('SPECSFY:SEC-002 rejeita a mesma chave para leitura e escrita', () => {
    expect(() => assertSecureConfig({ ...valid, ingestApiKey: valid.readApiKey })).toThrow(/diferentes/);
  });

  it('SPECSFY:SEC-003 aceita credenciais distintas e presentes', () => {
    expect(() => assertSecureConfig(valid)).not.toThrow();
  });
});
