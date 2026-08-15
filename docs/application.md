# Aplicação e implementações

<!-- specsfy:documentator:start -->
## Superfícies

Categorias: Serviços, Rotas e APIs, Páginas, Componentes, Testes e Outras fontes.

Relação: relaciona cada arquivo observado à sua superfície.

| Categoria | Arquivo | Símbolos |
| --- | --- | --- |
| Outras fontes | backend/src/auth.ts | requireReadKey, requireIngestKey |
| Outras fontes | backend/src/config.ts | — |
| Outras fontes | backend/src/prisma.ts | — |
| Outras fontes | backend/src/server.ts | parseDate, protocolJson |
| Outras fontes | backend/src/sla.ts | isWorkingDay, calculateDueAt |
| Testes | backend/src/triage.test.ts | — |
| Outras fontes | backend/src/triage.ts | TriageInput, TriageRecommendation, TriageProvider, createSimulatedTriage, TriageDecisionError, decideTriage |
| Outras fontes | backend/vitest.config.ts | — |
| Outras fontes | src/App.css | — |
| Outras fontes | src/App.jsx | DashboardContent, App |
| Componentes | src/components/BarChart.jsx | BarChart |
| Componentes | src/components/DonutChart.jsx | COLORS, DonutChart |
| Componentes | src/components/ErrorScreen.jsx | ErrorScreen |
| Componentes | src/components/FilterBar.jsx | FilterBar, changeMonth, changeDate |
| Componentes | src/components/Header.jsx | Header |
| Componentes | src/components/KPICards.jsx | AnimatedNumber, animate, KPICards |
| Componentes | src/components/OtherItemsModal.jsx | OtherItemsModal |
| Componentes | src/components/ProtocolDetailModal.jsx | ProtocolDetailModal |
| Componentes | src/components/RankingBarChart.jsx | COLORS, RankingBarChart |
| Componentes | src/components/RecentTable.jsx | PAGE_SIZE_OPTIONS, UNIDADE_COLORS, RecentTable, updateQuery, updatePageSize, exportCsv |
| Componentes | src/components/TriageCenter.jsx | TriageCenter |
| Componentes | src/components/UnitChart.jsx | UnitChart |
| Outras fontes | src/context/DashboardContext.jsx | REFRESH_INTERVAL_MS, reducer, DashboardProvider |
| Outras fontes | src/context/dashboardContextValue.js | DashboardContext |
| Outras fontes | src/hooks/useDashboard.js | useDashboard |
| Outras fontes | src/hooks/useKPIs.js | useKPIs |
| Outras fontes | src/index.css | — |
| Outras fontes | src/main.jsx | — |
| Serviços | src/services/mockData.js | CANAIS, TIPOS, UNIDADES, INTERESSADOS, ASSUNTOS, randomItem, randomInt, padZero |
| Serviços | src/services/protocolContract.js | PROTOCOL_CONTRACT_VERSION, PROTOCOL_FIELDS, extractProtocolRows, validateProtocolPayload, protocolToExportRow |
| Serviços | src/services/sheetsService.js | SHEETS_URL, API_URL, API_KEY, DATA_URL, USE_MOCK, CACHE_KEY, findMatchingColumn, REQUIRED_COLUMNS |
| Serviços | src/services/triageDemo.js | createDemoRecommendation, decideDemoRecommendation, summarizeTriageQueue, buildDemoAuditTrail |
| Outras fontes | src/utils/chartData.js | aggregateTopN, aggregateObjectTopN |
| Outras fontes | src/utils/filtering.js | toDayKey, monthRange, filterProtocols |
| Testes | tests/chartData.test.js | — |
| Testes | tests/protocolContract.test.js | — |
| Testes | tests/triageDemo.test.js | — |
| Outras fontes | vite.config.js | — |
<!-- specsfy:documentator:end -->
