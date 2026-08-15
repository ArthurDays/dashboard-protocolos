import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from './config.js';

export async function requireReadKey(request: FastifyRequest, reply: FastifyReply) {
  if (config.readApiKey && request.headers['x-api-key'] === config.readApiKey) return;
  await reply.code(401).send({ error: 'unauthorized', message: 'Chave de leitura ausente ou inválida.' });
}

export async function requireIngestKey(request: FastifyRequest, reply: FastifyReply) {
  if (config.ingestApiKey && request.headers['x-api-key'] === config.ingestApiKey) return;
  await reply.code(401).send({ error: 'unauthorized', message: 'Chave de ingestão ausente ou inválida.' });
}
