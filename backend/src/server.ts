import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { createHash } from 'node:crypto';
import { config } from './config.js';
import { requireIngestKey, requireReadKey } from './auth.js';
import { prisma } from './prisma.js';
import { Priority, ProtocolStatus, TriageDecision as PrismaTriageDecision } from '@prisma/client';
import { calculateDueAt } from './sla.js';
import { createSimulatedTriage } from './triage.js';

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });
const metrics = { startedAt: new Date().toISOString(), requests: 0, responses: 0, errors: 0 };

app.addHook('onRequest', async () => { metrics.requests += 1; });
app.addHook('onResponse', async (_request, reply) => { metrics.responses += 1; if (reply.statusCode >= 500) metrics.errors += 1; });

await app.register(cors, { origin: config.corsOrigin });
await app.register(helmet);
await app.register(rateLimit, { max: 120, timeWindow: '1 minute' });

const statusValues = new Set(Object.values(ProtocolStatus));
const priorityValues = new Set(Object.values(Priority));

function parseDate(value: unknown) {
  if (!value) return undefined;
  const brazilian = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brazilian) {
    const [, day, month, year] = brazilian;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)) return date;
    return undefined;
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function protocolJson(protocol: any) {
  return {
    id: protocol.id,
    external_id: protocol.externalId,
    protocol_number: protocol.protocolNumber,
    process_number: protocol.processNumber,
    data: protocol.entryDate.toISOString().slice(0, 10),
    mes_origem: protocol.sourceMonth,
    canal_entrada: protocol.channel,
    tipo_documento: protocol.documentType,
    interessado: protocol.interested,
    assunto: protocol.subject,
    status: protocol.status,
    prioridade: protocol.priority,
    prazo: protocol.dueAt?.toISOString() || null,
    unidade: protocol.unit?.code || null,
    created_at: protocol.createdAt.toISOString(),
    updated_at: protocol.updatedAt.toISOString(),
  };
}

app.get('/api/health', async (_request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'ok', timestamp: new Date().toISOString() };
  } catch {
    return reply.code(503).send({ status: 'degraded', database: 'unavailable' });
  }
});

app.get('/api/metrics', { preHandler: requireReadKey }, async () => ({ ...metrics, uptime_seconds: Math.floor(process.uptime()) }));

app.get('/api/protocolos', { preHandler: requireReadKey }, async (request) => {
  const query = request.query as Record<string, string | undefined>;
  const page = Math.max(1, Number(query.page || 1));
  const perPage = Math.min(100, Math.max(1, Number(query.per_page || 25)));
  const search = query.search?.trim();
  const where: any = {};
  if (query.mes_origem) where.sourceMonth = query.mes_origem.toUpperCase();
  if (query.status && statusValues.has(query.status as ProtocolStatus)) where.status = query.status;
  if (query.prioridade && priorityValues.has(query.prioridade as Priority)) where.priority = query.prioridade;
  if (query.unidade) where.unit = { code: query.unidade };
  const dateStart = parseDate(query.date_start);
  const dateEnd = parseDate(query.date_end);
  if (dateStart || dateEnd) where.entryDate = { ...(dateStart ? { gte: dateStart } : {}), ...(dateEnd ? { lte: dateEnd } : {}) };
  if (search) where.OR = [
    { externalId: { contains: search, mode: 'insensitive' } },
    { interested: { contains: search, mode: 'insensitive' } },
    { subject: { contains: search, mode: 'insensitive' } },
    { protocolNumber: { contains: search, mode: 'insensitive' } },
    { processNumber: { contains: search, mode: 'insensitive' } },
  ];
  const orderBy = query.sort === 'data' ? { entryDate: 'asc' as const } : { entryDate: 'desc' as const };
  const [total, data] = await prisma.$transaction([
    prisma.protocol.count({ where }),
    prisma.protocol.findMany({ where, include: { unit: true }, orderBy, skip: (page - 1) * perPage, take: perPage }),
  ]);
  return { data: data.map(protocolJson), meta: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) } };
});

app.get('/api/protocolos/:id', { preHandler: requireReadKey }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const protocol = await prisma.protocol.findUnique({ where: { id }, include: { unit: true } });
  if (!protocol) return reply.code(404).send({ error: 'not_found', message: 'Protocolo não encontrado.' });
  return protocolJson(protocol);
});

app.post('/api/protocolos/:id/triagens', { preHandler: requireReadKey }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const protocol = await prisma.protocol.findUnique({ where: { id }, include: { unit: true } });
  if (!protocol) return reply.code(404).send({ error: 'not_found', message: 'Protocolo não encontrado.' });

  const recommendation = createSimulatedTriage({
    id: protocol.id,
    documentType: protocol.documentType,
    subject: protocol.subject,
    channel: protocol.channel,
    priority: protocol.priority,
    unitCode: protocol.unit?.code ?? null,
  });
  const created = await prisma.triageRecommendation.create({
    data: {
      protocolId: protocol.id,
      priority: recommendation.priority,
      suggestedUnit: recommendation.suggestedUnit,
      confidence: recommendation.confidence,
      rationale: recommendation.rationale,
      alerts: recommendation.alerts,
      provider: recommendation.provider,
      providerVersion: recommendation.providerVersion,
    },
  });
  return reply.code(201).send(created);
});

app.get('/api/protocolos/:id/triagens', { preHandler: requireReadKey }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const exists = await prisma.protocol.count({ where: { id } });
  if (!exists) return reply.code(404).send({ error: 'not_found', message: 'Protocolo não encontrado.' });
  return prisma.triageRecommendation.findMany({ where: { protocolId: id }, orderBy: { createdAt: 'desc' } });
});

app.post('/api/triagens/:id/decisao', { preHandler: requireIngestKey }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as { decision?: string; actor?: string; note?: string };
  const decision = body?.decision as PrismaTriageDecision;
  const actor = body?.actor?.trim();
  const validDecision = decision === PrismaTriageDecision.APPROVED || decision === PrismaTriageDecision.REJECTED;
  if (!validDecision || !actor) {
    return reply.code(400).send({ error: 'invalid_decision', message: 'decision e actor válidos são obrigatórios.' });
  }
  const exists = await prisma.triageRecommendation.count({ where: { id } });
  if (!exists) return reply.code(404).send({ error: 'not_found', message: 'Recomendação não encontrada.' });

  const decidedAt = new Date();
  const updated = await prisma.triageRecommendation.updateMany({
    where: { id, decision: PrismaTriageDecision.PENDING },
    data: { decision, decidedBy: actor, decidedAt, decisionNote: body.note?.trim() || null },
  });
  if (updated.count === 0) return reply.code(409).send({ error: 'already_decided', message: 'A recomendação já possui decisão.' });
  return prisma.triageRecommendation.findUnique({ where: { id } });
});

app.get('/api/protocolos/:id/movimentacoes', { preHandler: requireReadKey }, async (request) => {
  const { id } = request.params as { id: string };
  const movements = await prisma.movement.findMany({ where: { protocolId: id }, include: { toUnit: true }, orderBy: { occurredAt: 'asc' } });
  return movements.map((movement) => ({ ...movement, to_unit: movement.toUnit?.code || null }));
});

app.get('/api/dashboard/kpis', { preHandler: requireReadKey }, async () => {
  const [total, byStatus, byUnit] = await prisma.$transaction([
    prisma.protocol.count(),
    prisma.protocol.groupBy({ by: ['status'], orderBy: { status: 'asc' }, _count: { _all: true } }),
    prisma.protocol.groupBy({ by: ['unitId'], orderBy: { unitId: 'asc' }, _count: { _all: true } }),
  ]);
  const statusRows = byStatus as unknown as Array<{ status: ProtocolStatus; _count: { _all: number } }>;
  const unitRows = byUnit as unknown as Array<{ unitId: string | null; _count: { _all: number } }>;
  return { total, by_status: statusRows.map((item) => ({ status: item.status, total: item._count._all })), by_unit: unitRows.map((item) => ({ unit_id: item.unitId, total: item._count._all })) };
});

app.get('/api/dashboard/sla', { preHandler: requireReadKey }, async () => {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const active = { status: { notIn: [ProtocolStatus.COMPLETED, ProtocolStatus.CANCELLED, ProtocolStatus.ARCHIVED] } };
  const [activeTotal, overdue, dueSoon, completedCandidates] = await prisma.$transaction([
    prisma.protocol.count({ where: active }),
    prisma.protocol.count({ where: { ...active, dueAt: { lt: now } } }),
    prisma.protocol.count({ where: { ...active, dueAt: { gte: now, lte: nextWeek } } }),
    prisma.protocol.findMany({ where: { status: ProtocolStatus.COMPLETED, dueAt: { not: null }, completedAt: { not: null } }, select: { dueAt: true, completedAt: true } }),
  ]);
  const completedLate = completedCandidates.filter((item) => item.dueAt && item.completedAt && item.completedAt > item.dueAt).length;
  return { active: activeTotal, overdue, due_soon: dueSoon, completed_late: completedLate };
});

app.patch('/api/protocolos/:id/status', { preHandler: requireIngestKey }, async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as { status?: string; note?: string; actor?: string; unit?: string };
  if (!body?.status || !statusValues.has(body.status as ProtocolStatus)) return reply.code(400).send({ error: 'invalid_status', message: 'Status inválido.' });
  const current = await prisma.protocol.findUnique({ where: { id } });
  if (!current) return reply.code(404).send({ error: 'not_found', message: 'Protocolo não encontrado.' });
  const nextStatus = body.status as ProtocolStatus;
  const unit = body.unit ? await prisma.unit.upsert({ where: { code: body.unit.toUpperCase() }, update: {}, create: { code: body.unit.toUpperCase(), name: body.unit } }) : null;
  const updated = await prisma.$transaction(async (transaction) => {
    const protocol = await transaction.protocol.update({ where: { id }, data: { status: nextStatus, unitId: unit?.id || current.unitId, completedAt: nextStatus === ProtocolStatus.COMPLETED ? new Date() : current.completedAt } });
    if (current.status !== nextStatus || unit?.id !== current.unitId) await transaction.movement.create({ data: { protocolId: id, fromStatus: current.status, toStatus: nextStatus, fromUnitId: current.unitId, toUnitId: unit?.id || current.unitId, note: body.note, actor: body.actor || 'api' } });
    return protocol;
  });
  return { id: updated.id, status: updated.status };
});

app.post('/api/ingestao/protocolos', { preHandler: requireIngestKey }, async (request, reply) => {
  const body = request.body as { source?: string; records?: Record<string, unknown>[] };
  if (!body?.source || !Array.isArray(body.records)) return reply.code(400).send({ error: 'invalid_payload', message: 'source e records são obrigatórios.' });
  const results: Array<Record<string, unknown>> = [];
  for (const [index, item] of body.records.entries()) {
    const externalId = String(item.external_id || item.externalId || item.numero_eprotocolo || item.numero_processo || `${item.data || 'sem-data'}-${index}`);
    const entryDate = parseDate(item.data || item.entry_date);
    if (!entryDate || !item.interessado || !item.tipo_documento) {
      results.push({ external_id: externalId, outcome: 'rejected', error: 'data, interessado e tipo_documento são obrigatórios.' });
      continue;
    }
    const status = statusValues.has(String(item.status) as ProtocolStatus) ? String(item.status) as ProtocolStatus : ProtocolStatus.RECEIVED;
    const priority = priorityValues.has(String(item.prioridade) as Priority) ? String(item.prioridade) as Priority : Priority.NORMAL;
    const unit = item.unidade ? await prisma.unit.upsert({ where: { code: String(item.unidade).toUpperCase() }, update: {}, create: { code: String(item.unidade).toUpperCase(), name: String(item.unidade) } }) : null;
    const payloadHash = createHash('sha256').update(JSON.stringify(item)).digest('hex');
    const existing = await prisma.protocol.findUnique({ where: { source_externalId: { source: body.source, externalId } } });
    const dueAt = await calculateDueAt(prisma, entryDate, String(item.tipo_documento), priority);
    const protocol = await prisma.protocol.upsert({
      where: { source_externalId: { source: body.source, externalId } },
      update: { entryDate, sourceMonth: String(item.mes_origem || item.Mes_Origem || 'NÃO INFORMADO').toUpperCase(), channel: String(item.canal_entrada || item.canal || 'Não informado'), documentType: String(item.tipo_documento), interested: String(item.interessado), subject: item.assunto ? String(item.assunto) : null, protocolNumber: item.numero_eprotocolo ? String(item.numero_eprotocolo) : null, processNumber: item.numero_processo ? String(item.numero_processo) : null, status, priority, dueAt, unitId: unit?.id },
      create: { source: body.source, externalId, entryDate, sourceMonth: String(item.mes_origem || item.Mes_Origem || 'NÃO INFORMADO').toUpperCase(), channel: String(item.canal_entrada || item.canal || 'Não informado'), documentType: String(item.tipo_documento), interested: String(item.interessado), subject: item.assunto ? String(item.assunto) : null, protocolNumber: item.numero_eprotocolo ? String(item.numero_eprotocolo) : null, processNumber: item.numero_processo ? String(item.numero_processo) : null, status, priority, dueAt, unitId: unit?.id },
    });
    if (!existing || existing.status !== status) await prisma.movement.create({ data: { protocolId: protocol.id, fromStatus: existing?.status, toStatus: status, toUnitId: unit?.id, actor: `ingestion:${body.source}` } });
    await prisma.ingestionEvent.upsert({ where: { source_externalId: { source: body.source, externalId } }, update: { payloadHash, outcome: existing ? 'updated' : 'inserted', error: null }, create: { source: body.source, externalId, payloadHash, outcome: existing ? 'updated' : 'inserted' } });
    results.push({ external_id: externalId, id: protocol.id, outcome: existing ? 'updated' : 'inserted' });
  }
  return reply.code(202).send({ source: body.source, total: results.length, results });
});

app.addHook('onClose', async () => prisma.$disconnect());

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
