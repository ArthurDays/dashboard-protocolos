export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 3333),
  readApiKey: process.env.READ_API_KEY || '',
  ingestApiKey: process.env.INGEST_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5173',
};

export function assertSecureConfig(current = config) {
  if (!current.readApiKey || !current.ingestApiKey) {
    throw new Error('READ_API_KEY e INGEST_API_KEY são obrigatórias.');
  }
  if (current.readApiKey === current.ingestApiKey) {
    throw new Error('READ_API_KEY e INGEST_API_KEY devem ser diferentes.');
  }
}
