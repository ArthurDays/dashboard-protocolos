# Dashboard de Protocolos

Painel web de leitura para acompanhamento operacional de protocolos. O frontend
consome o JSON consolidado do Google Apps Script, normaliza os registros no
navegador e calcula indicadores, gráficos e filtros client-side.

## Estado atual

O módulo possui:

- carregamento por Google Apps Script, com preparação para API REST;
- fallback para dados mock, cache local e modo degradado offline;
- refresh manual e automático a cada 15 minutos;
- filtro dinâmico por `Mes_Origem` e período personalizado;
- filtros por canal e tipo de documento;
- KPIs de volume, média diária e físico versus digital;
- rosca de meios de entrada;
- rankings de Top 5 tipos e unidades;
- agrupamento `Outros` com modal de detalhamento;
- busca, ordenação, paginação, detalhe e exportação CSV.

O módulo ainda não possui banco próprio, autenticação, API REST, SLA ou edição
de protocolos. A evolução está descrita em
[`docs/api-migration.md`](docs/api-migration.md).

## Início rápido

```bash
npm install
npm run dev
```

Acesse `http://127.0.0.1:5173/`.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor local com hot reload |
| `npm run build` | Bundle de produção em `dist/` |
| `npm run preview` | Servir o bundle de produção |
| `npm test` | Testes nativos do contrato e agregações |
| `npm run lint` | Verificar o código com Oxlint |

## Configuração

Copie `.env.example` para `.env.local`:

```env
VITE_SHEETS_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
VITE_PROTOCOLS_API_URL=
VITE_PROTOCOLS_API_KEY=
```

`VITE_PROTOCOLS_API_URL`, quando preenchida, tem precedência sobre
`VITE_SHEETS_URL`. `VITE_PROTOCOLS_API_KEY` é enviada como `x-api-key` para a
API de leitura. Assim, a fonte pode migrar para uma API sem alterar os
componentes da interface.

Não commite `.env.local` nem URLs privadas. O arquivo é ignorado pelo
`.gitignore` central.

## Estrutura

```text
dashboard-protocolos/
├── google-apps-script/       # endpoint de leitura da planilha
├── backend/                   # API Fastify + Prisma + PostgreSQL
├── src/components/            # interface e visualizações
├── src/context/               # estado, refresh e filtros
├── src/hooks/                 # KPIs e agregações
├── src/services/              # fontes e contrato de dados
├── src/utils/                 # processamento reutilizável
├── docs/                      # documentação técnica e operacional
├── .env.example
└── package.json
```

## Documentação

- [Arquitetura](docs/architecture.md)
- [Contrato de dados](docs/data-contract.md)
- [Operação e troubleshooting](docs/operations.md)
- [Publicação do Google Apps Script](google-apps-script/README.md)
- [Migração para API REST e PostgreSQL](docs/api-migration.md)
- [Testes e critérios de qualidade](docs/testing.md)
- [Status e gates do Specsfy](docs/specsfy-status.md)
- [Frontend e componentes](docs/frontend.md)
- [Fluxos da aplicação](docs/flows.md)
- [Integrações](docs/integrations.md)
- [Banco de dados](docs/database.md)
- [Decisões técnicas](docs/decisions.md)
- [Especificação funcional](specs/draft/0001-dashboard-protocolos/spec.md)
- [Backlog](specs/backlog/0001-dashboard-protocolos.md)

## Fluxo resumido

```text
Google Sheets / API REST → fetchSheetData()
→ validação e normalização → DashboardContext
→ filtros client-side → KPIs, gráficos, tabela, modal e CSV
```

## Privacidade

O painel pode exibir interessado, assunto e números de processo. A publicação
do Apps Script como “qualquer pessoa” deve ser usada apenas em protótipo. Em
produção, adote autenticação, autorização, mascaramento e auditoria.
