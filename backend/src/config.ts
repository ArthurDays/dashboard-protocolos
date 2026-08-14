export const config = {
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 3333),
  readApiKey: process.env.READ_API_KEY || '',
  ingestApiKey: process.env.INGEST_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5173',
};
