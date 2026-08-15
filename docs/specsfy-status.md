# Status Specsfy do Dashboard

Atualizado em 2026-08-14.

## Estado atual

| Artefato | Estado |
|---|---|
| Inbox | Registrada |
| Backlog | Refinamento em andamento |
| Spec | Draft |
| Definition Gate | Pending |
| Plan Gate | Pending |
| Delivery Gate | Pending |
| Fonte operacional | Google Sheets `Caderno de Entrada 2026` via Apps Script |
| Fonte de migração | Fastify + PostgreSQL |

## Evidências confirmadas

- A planilha possui abas mensais de janeiro a agosto, conforme a evidência em
  `specs/draft/0001-dashboard-protocolos/research/`.
- O Apps Script lê abas visíveis e acrescenta `_aba` e `Mes_Origem`.
- A implantação do Web App foi atualizada para a versão 4 em 14/08/2026,
  mantendo a URL da implantação fora do repositório e acesso restrito conforme a decisão do
  produto de não exigir autenticação no dashboard.
- O frontend deriva os meses do payload, filtra client-side e agrega gráficos
  em Top 5 + `Outros`.
- Os filtros de meio de protocolização e tipo de documento estão implementados
  na regra central de filtragem e foram verificados no navegador.
- O backend possui contrato de ingestão idempotente, endpoints de consulta,
  métricas e estrutura Prisma/PostgreSQL.
- O ambiente possui Docker Compose para frontend, API e banco.

## Pendências que impedem o Definition Gate

1. Definir a fronteira de exposição/mascaramento dos dados pessoais, já que não
   haverá autenticação própria.
2. Confirmar status, SLA, retenção e auditoria institucionais.
3. Definir volume máximo e navegador suportado.
4. Escolher explicitamente o runner TDD Node e materializar o script
   `test:tdd`.

## Próxima sequência técnica

1. Registrar as decisões acima na seção 2 e 17 da spec.
2. Executar o validador estrutural da spec e corrigir cobertura BDD.
3. Derivar testes TDD com marcadores `SPECSFY:`.
4. Observar RED válido antes de alterações comportamentais.
5. Validar GREEN, lint, build, Docker e smoke test da fonte.
6. Atualizar evidências, reconstruir documentação e solicitar revisão.
7. Só então promover a spec para `planned`, `in-progress`, `review` e
   `completed`.

## Comandos de operação

```powershell
cd dashboard-protocolos
npm test
npm run lint
npm run build
docker compose up -d --build
docker compose ps
```

O cache do navegador é contingência e não substitui a planilha nem o banco como
fonte de auditoria.
