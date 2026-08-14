# Backlog — Dashboard de Protocolos

| Campo | Valor |
|---|---|
| ID | BACKLOG-0001 |
| Título | Dashboard operacional de protocolos multi-abas |
| Status | Refinement in progress |
| Prioridade | P1 |
| Origem | `specs/inbox/2026-08-14-000000-dashboard-protocolos.md` |

## Problema

O setor precisa consultar o volume e a distribuição dos protocolos recebidos em várias abas mensais, sem consolidar manualmente a planilha e sem perder visibilidade quando uma fonte falhar.

## Resultado esperado

Uma interface web responsiva que carrega o JSON consolidado, normaliza os registros, permite filtrar por mês e período, calcula indicadores e apresenta rankings legíveis com detalhamento de categorias agrupadas.

## Evidência já existente

- Frontend React/Vite em `src/`.
- Contrato e normalização em `src/services/protocolContract.js`.
- Filtros em `src/utils/filtering.js` e `src/context/DashboardContext.jsx`.
- Top 5 + Outros em `src/utils/chartData.js`.
- API Fastify/Prisma/PostgreSQL em `backend/`.
- Documentação técnica em `docs/`.

## Decisões confirmadas

- A fonte operacional atual é a planilha Google Sheets `Caderno de Entrada 2026`; o Apps Script é o adaptador de leitura previsto. A API PostgreSQL permanece uma migração futura até decisão explícita.
- Não haverá autenticação própria no dashboard.

## Decisões materialmente abertas

1. A fonte oficial de produção será Apps Script ou a API PostgreSQL?
2. Qual será a fronteira de exposição dos dados pessoais: rede institucional, compartilhamento restrito ou URL pública?
3. Quais SLAs, status e métricas operacionais devem ser considerados oficiais?
4. Qual navegador e volume máximo de registros devem ser suportados?

## Critério para promoção

Promover para a spec quando as decisões acima estiverem confirmadas ou explicitamente adiadas, mantendo cada lacuna registrada e sem transformar inferências em requisitos.
