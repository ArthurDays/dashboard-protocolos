# Especificação integrada: Dashboard de Protocolos

| Campo | Valor |
|---|---|
| Formato | Specsfy/2.0 |
| ID | SPEC-0001 |
| Slug | 0001-dashboard-protocolos |
| Status | Draft |
| Effort | 6 |
| Effort updated at | 2026-08-14 |
| Effort rationale | Integração externa, normalização, visualização, fallback e backend de transição já existem; faltam decisões operacionais e rastreabilidade formal. |
| Definition Gate | Pending |
| Plan Gate | Pending |
| Delivery Gate | Pending |
| Origem Inbox | `specs/inbox/2026-08-14-000000-dashboard-protocolos.md` |
| Origem Backlog | `specs/backlog/0001-dashboard-protocolos.md` |
| Pesquisa local | `research/google-sheets-2026-08-14.md` |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

Os registros de protocolo estão distribuídos em abas mensais e precisam ser consultados para gestão operacional, mas a especificação original não formaliza ainda a fonte oficial de produção, a política de acesso, SLAs ou o conjunto mínimo de métricas.

#### Resultado desejado

Entregar um dashboard de leitura que carregue registros consolidados, permita filtros por `Mes_Origem` e datas, mostre indicadores e rankings, sobreviva a falhas de rede com cache local e ofereça detalhes para categorias agrupadas em `Outros`.

#### Métricas de sucesso

- 100% dos meses presentes no payload válido aparecem no filtro sem opções hardcoded.
- Toda seleção de mês filtra os registros por igualdade de `Mes_Origem`.
- Categorias além do Top 5 não poluem o gráfico e permanecem consultáveis no modal.
- Payload inválido ou fonte indisponível apresenta estado de erro compreensível.

### 2. Research e esclarecimentos

#### Researchs executados

Não houve pesquisa externa. A definição foi baseada no código, documentação e contratos locais do dashboard.

#### Fontes e contexto consultados

- `README.md` do dashboard.
- `docs/data-contract.md`.
- `docs/architecture.md`.
- `src/services/protocolContract.js`.
- `src/utils/filtering.js`.
- `src/utils/chartData.js`.
- `src/context/DashboardContext.jsx`.

#### Artefatos de pesquisa armazenados

- `research/google-sheets-2026-08-14.md`: estrutura e cabeçalhos observados na planilha fornecida; sem cópia de registros pessoais.

#### Dúvidas respondidas

- O payload atual aceita array direto e envelopes `rows`/`data`.
- O campo de origem é normalizado para `mes_origem`.
- A agregação Top 5 + `Outros` ocorre no client-side.
- A fonte operacional atual é a planilha Google Sheets `Caderno de Entrada 2026`, lida pelo Apps Script.

#### Dúvidas abertas

#### Documentação consultada

- `dashboard-protocolos/README.md`, `docs/data-contract.md` e `docs/architecture.md`, consultados em 2026-08-14.

- Política de produção e exposição do Apps Script/API.
- Política de mascaramento e fronteira de rede.
- Status, SLA, retenção e auditoria oficiais.
- Limite de volume e navegador suportado.

### 3. Escopo e atores

#### Incluído

- Carregamento e normalização de protocolos.
- Filtro dinâmico por mês de origem e período.
- Filtros complementares por canal e tipo.
- KPIs, gráficos, Top 5 + `Outros`, modal, tabela, busca, paginação e exportação.
- Cache, refresh manual/automático e estados de erro.

#### Fora de escopo nesta fatia

- Edição de protocolos.
- Autenticação e autorização definitivas.
- Definição de SLA institucional.
- RPA/n8n/Python de produção.
- Migração definitiva da fonte para PostgreSQL.

#### Atores

- Operador do setor: consulta e filtra protocolos.
- Gestor: acompanha indicadores e distribuição por categoria.
- Administrador técnico: configura fonte, deploy e observabilidade.

### 4. Princípios e restrições do projeto

- O processamento de filtros e gráficos ocorre no client-side após o carregamento.
- `Mes_Origem` é a fonte dos meses exibidos; não usar meses fixos no componente.
- A tabela e os gráficos devem permanecer utilizáveis em telas pequenas.
- Não haverá autenticação própria no dashboard; a exposição da URL e dos dados será controlada pela rede, compartilhamento da planilha ou proxy institucional.
- A fonte de dados deve ser substituível por adaptador sem duplicar regras da interface.

### 5. Histórias de usuário

#### US-001 — Acompanhar indicadores operacionais (P1)

Como operador ou gestor, quero visualizar volume, média diária, meios de entrada e rankings para entender a carga de trabalho.

#### US-002 — Filtrar a visão por mês ou período (P1)

Como operador, quero selecionar um mês recebido do backend ou um intervalo customizado para analisar somente os registros relevantes.

#### US-003 — Investigar dados agrupados e operar com falhas de fonte (P1)

Como gestor, quero detalhar `Outros` e continuar consultando o último cache quando a fonte estiver indisponível.

### 6. Cenários BDD de aceite

#### AC-001 — Carregar indicadores

**Cobre**: US-001, FR-001, FR-002, NFR-002

```gherkin
@US-001 @FR-001 @FR-002 @NFR-002 @AC-001
Feature: Indicadores operacionais
  Scenario: Carregar indicadores válidos
    Given o payload contém registros válidos de múltiplas abas
    When o dashboard conclui o carregamento
    Then deve exibir total, média diária, distribuição de canais e rankings
```

#### AC-002 — Meses dinâmicos

**Cobre**: US-002, FR-003, NFR-002

```gherkin
@US-002 @FR-003 @NFR-002 @AC-002
Feature: Filtro dinâmico de mês
  Scenario: Listar meses recebidos
    Given existem registros com Mes_Origem JANEIRO e AGOSTO
    When o usuário abre o seletor de mês
    Then JANEIRO e AGOSTO aparecem uma vez cada, sem meses fixos inexistentes
```

#### AC-003 — Filtrar mês por igualdade

**Cobre**: US-002, FR-003, FR-004, NFR-002

```gherkin
@US-002 @FR-003 @FR-004 @NFR-002 @AC-003
Feature: Filtro por mês
  Scenario: Aplicar igualdade de origem
    Given AGOSTO está selecionado
    When a projeção é recalculada
    Then somente registros cujo Mes_Origem normalizado é AGOSTO são renderizados
```

#### AC-004 — Período personalizado

**Cobre**: US-002, FR-004, NFR-002

```gherkin
@US-002 @FR-004 @NFR-002 @AC-004
Feature: Período personalizado
  Scenario: Alterar datas manualmente
    Given um mês está selecionado
    When o usuário altera manualmente a data inicial ou final
    Then o modo muda para personalizado e gráficos e tabela são recalculados
```

#### AC-005 — Top 5 e Outros

**Cobre**: US-001, US-003, FR-005, NFR-002

```gherkin
@US-001 @US-003 @FR-005 @NFR-002 @AC-005
Feature: Agregação visual
  Scenario: Agrupar categorias menores
    Given um gráfico possui mais de cinco categorias
    When seus dados são preparados
    Then as cinco maiores aparecem ordenadas e as demais formam uma única categoria Outros
```

#### AC-006 — Detalhar Outros

**Cobre**: US-003, FR-005, NFR-001

```gherkin
@US-003 @FR-005 @NFR-001 @AC-006
Feature: Detalhamento de Outros
  Scenario: Abrir modal da categoria
    Given o gráfico possui Outros
    When o usuário clica nessa categoria
    Then um modal mostra cada item agrupado e sua quantidade, com ação de fechar
```

#### AC-007 — Cache após falha

**Cobre**: US-003, FR-006, NFR-001

```gherkin
@US-003 @FR-006 @NFR-001 @AC-007
Feature: Resiliência de fonte
  Scenario: Usar cache após falha
    Given existe um cache válido e a fonte retorna erro de rede
    When o carregamento falha
    Then o dashboard exibe o cache, informa a falha e oferece nova tentativa
```

#### AC-008 — Payload inválido

**Cobre**: US-003, FR-001, FR-006, NFR-001

```gherkin
@US-003 @FR-001 @FR-006 @NFR-001 @AC-008
Feature: Validação de contrato
  Scenario: Rejeitar payload inválido
    Given o payload não contém uma coleção válida ou coluna vital
    When a resposta é processada
    Then a interface mostra erro estrutural e não apresenta indicadores incorretos
```

#### AC-009 — Atualização manual

**Cobre**: US-001, FR-007, NFR-001

```gherkin
@US-001 @FR-007 @NFR-001 @AC-009
Feature: Atualização manual
  Scenario: Atualizar dados
    Given o dashboard está carregado
    When o usuário aciona Atualizar Agora
    Then o botão indica carregamento, busca a fonte e atualiza timestamp e projeções
```

#### AC-010 — Atualização automática

**Cobre**: US-001, FR-007, NFR-001

```gherkin
@US-001 @FR-007 @NFR-001 @AC-010
Feature: Atualização automática
  Scenario: Atualizar sem perder filtros
    Given o dashboard permanece aberto
    When o intervalo configurado expira
    Then uma nova leitura é disparada sem perder os filtros vigentes
```

### 7. Requisitos

#### Funcionais

- **FR-001**: aceitar array direto ou envelope `rows`/`data` e validar a coleção.
- **FR-002**: normalizar datas, canal, tipo, unidade e `Mes_Origem` em contrato único.
- **FR-003**: gerar opções únicas de mês a partir dos dados recebidos e filtrar por igualdade.
- **FR-004**: sincronizar seleção de mês, datas, canal e tipo com uma projeção filtrada client-side.
- **FR-005**: preparar gráficos com Top 5 + `Outros` e abrir modal de composição ao clicar em `Outros`.
- **FR-006**: preservar cache local e apresentar estados distintos para erro de rede e contrato inválido.
- **FR-007**: oferecer refresh manual e automático sem apagar filtros nem dados válidos durante o carregamento.

#### Não funcionais

- **NFR-001**: interface responsiva e acessível, com foco de teclado, diálogo rotulado e alternativa textual aos gráficos. **Verificação**: inspeção e teste manual.
- **NFR-002**: agregações devem ser determinísticas, testáveis sem navegador e não devem mutar o conjunto bruto recebido. **Verificação**: testes unitários.
- **NFR-003**: não haverá autenticação própria; segredos não podem ser embutidos no código e a publicação de dados pessoais deve respeitar a fronteira de rede/compartilhamento definida. **Verificação**: inspeção de configuração e deploy.

#### Erros e casos-limite

- Mês ausente, vazio ou inconsistente deve ser tratado como não informado e não criar opção vazia.
- Datas inválidas devem ser descartadas ou sinalizadas conforme o contrato, sem contaminar KPIs.
- Menos de seis categorias não deve criar `Outros`.
- Clique em `Outros` sem itens não deve abrir modal vazio.
- Falha de rede sem cache deve exibir estado de erro recuperável.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

Frontend React/Vite em `src/`; backend Fastify/Prisma em `backend/`; Apps Script em `google-apps-script/`; Docker Compose na raiz do módulo.

#### Arquitetura e módulos

`sheetsService` carrega e valida; `protocolContract` normaliza; `DashboardContext` mantém estado; `filtering` gera projeção; `chartData` agrega; componentes renderizam.

#### Migrations

- Não aplicável ao frontend; o backend possui migration Prisma em `backend/prisma/migrations/0001_init`.

#### Models

- `Protocol`, `Movement`, `IngestionEvent`, `SlaRule` e `Holiday` no schema Prisma do backend.

#### Controllers e casos de uso

- Handlers Fastify em `backend/src/server.ts` para health, consulta, ingestão e métricas.

#### Views e experiência

- Componentes em `src/components/`; devem cobrir loading, erro, vazio, sucesso, foco e modal acessível.

#### Queries e repositórios

- Prisma consulta protocolos com filtros, paginação e ordenação; índices devem ser revisados com o volume real.

#### Jobs e processamento assíncrono

- Não aplicável ao dashboard atual; ingestão futura via n8n/Python deve ser idempotente.

#### Estrutura de arquivos

Alterações previstas: `src/services/protocolContract.js`, `src/utils/filtering.js`, `src/utils/chartData.js`, `src/context/DashboardContext.jsx`, componentes de gráfico/modal e testes em `tests/`.

### Persistência e integrações

O caminho atual usa Google Apps Script e LocalStorage. O backend PostgreSQL permanece adaptador de transição até a decisão da fonte oficial.

### 9. Modelo de dados

`RegistroProtocolo` contém data, mês de origem, canal, tipo, interessado, unidade e identificadores opcionais. A fonte externa pode usar nomes de colunas legados; o adaptador normaliza para o registro interno.

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
|---|---|---|---|
| RegistroProtocolo | id ou identificador externo | data, mês, canal, tipo, unidade | pode possuir movimentações |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
|---|---|---|---|---|
| Protocolo | recebido | ingestão | recebido/atualizado | external_id idempotente |

#### Migração e retenção

- A fonte Apps Script permanece transicional; retenção e migração para PostgreSQL aguardam decisão de produto.

### 10. Interfaces e contratos

#### APIs externas utilizadas

- Google Apps Script Web App, resposta JSON.
- API REST Fastify opcional por `VITE_PROTOCOLS_API_URL`.

#### APIs expostas

- O frontend expõe apenas a interface visual; o backend opcional possui `/api/health`, `/api/metrics`, `/api/protocolos` e endpoints de dashboard documentados em `backend/README.md`.

#### Documentação das APIs consultadas

- Contratos locais em `docs/data-contract.md` e `docs/api-migration.md`.

#### Eventos e outros contratos

- Payload JSON do Apps Script e registros normalizados descritos em `docs/data-contract.md`.

#### Contratos internos

- `fetchSheetData()` retorna registros normalizados e metadados de origem.
- `aggregateTopN()` retorna categorias ordenadas com `items` para `Outros`.
- `filterProtocols()` retorna nova coleção sem mutar `todosProtocolos`.

### 11. Estratégia TDD

#### Evidência RED-GREEN-REFACTOR

| ID | BDD de referência | Teste TDD | RED observado | GREEN observado | Refactor/regressão |
|---|---|---|---|---|---|
| TDD-001 | AC-002, AC-003 | `tests/protocolContract.test.js` | Pendente | Pendente | Pendente |
| TDD-002 | AC-005, AC-006 | `tests/chartData.test.js` | Pendente | Pendente | Pendente |
| TDD-003 | AC-007, AC-008 | teste de fallback/erro a criar | Pendente | Pendente | Pendente |

O projeto Node deve adotar um runner TDD explícito para os casos derivados. A recomendação do contrato Specsfy é Vitest, mas a escolha final ainda está aberta e não será instalada silenciosamente.

### 12. Plano de testes e rastreabilidade

| Requisito | Cenários | Teste previsto | Evidência |
|---|---|---|---|
| FR-001/FR-002 | AC-001, AC-008 | contrato e normalização | Pendente |
| FR-003/FR-004 | AC-002, AC-003, AC-004 | filtros e mês dinâmico | Pendente |
| FR-005 | AC-005, AC-006 | agregação e interação do modal | Pendente |
| FR-006 | AC-007, AC-008 | cache e estados de erro | Pendente |
| FR-007 | AC-009, AC-010 | refresh | Pendente |
| NFR-001/002/003 | revisão automatizada e manual | Pendente | Pendente |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: Pending

**Achados P1:** política de exposição/mascaramento, SLAs/status e runner TDD ainda não foram confirmados. A ausência de autenticação própria foi decidida.

**Próxima ação:** rodada de refinamento do backlog e validação formal da spec.

#### Gate do Ato II — Plano

- **Resultado**: Pending
- **Comando**: `npm run test:tdd`
- **Achados**: Pendente. Não iniciar implementação nova orientada pela spec antes de observar RED válido.

#### Gate do Ato III — Entrega

- **Resultado**: Pending
- **Comando**: `npm test`, `npm run lint`, `npm run build`, Docker smoke test e revisão manual.
- **Achados**: Pendente. O código existente é evidência de implementação prévia, não prova de entrega Specsfy desta fatia.

### 14. Tarefas

- [ ] T001 [P1] Confirmar fonte oficial e política de acesso.
- [ ] T002 [P1] Confirmar status, SLA, retenção e métricas de gestão.
- [ ] T003 [P1] Escolher runner TDD Node e criar testes derivados dos ACs.
- [ ] T004 [P1] Executar RED dos contratos e filtros antes de novas alterações.
- [ ] T005 [P1] Validar os componentes atuais contra AC-001 a AC-010.
- [ ] T006 [P2] Executar GREEN, refatorar e registrar evidências.
- [ ] T007 [P2] Validar Docker, API, Apps Script e fluxo de refresh.
- [ ] T008 [P2] Rodar regressão e matriz de rastreabilidade.
- [ ] T009 [P2] Atualizar documentação técnica derivada.
- [ ] T010 [P3] Preparar observabilidade, auditoria e migração definitiva.

### 15. Ordem de execução

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- Endpoint JSON do Apps Script ou API REST configurado.
- Dados reais com `Mes_Origem` consistente.
- Ambiente Node e Docker disponíveis.

#### Riscos

- Exposição de dados pessoais via Web App público.
- Divergência entre cabeçalhos das abas.
- Volume alto causar custo de memória no client-side.
- Ausência de decisão de SLA gerar indicadores ambíguos.

#### Suposições

- A fatia atual permanece somente leitura.
- A agregação Top 5 é uma regra de apresentação, não uma perda de dados.
- O modal é suficiente para investigação inicial de `Outros`.

### 17. Decisões

- **DEC-001**: usar `Mes_Origem` como origem das opções de mês.
- **DEC-002**: calcular filtros e agregações no client-side.
- **DEC-003**: manter API PostgreSQL como caminho de migração até confirmação da fonte oficial.
- **DEC-004**: tratar o Google Sheets `Caderno de Entrada 2026` como fonte operacional atual e o Apps Script como adaptador de leitura, com base na evidência recebida.
- **DEC-005**: não implementar autenticação própria no dashboard; qualquer restrição de acesso será responsabilidade da rede, do compartilhamento da planilha ou de um proxy externo.

### 18. Definition of Done

- [ ] DOD-001 Definition Gate aprovado após resolver os três pontos abertos restantes.
- [ ] DOD-002 Plan Gate aprovado com TDD e RED válidos.
- [ ] DOD-003 Cada requisito possui cenários e testes rastreáveis.
- [ ] DOD-004 Fluxos principal, erro, cache, responsividade e acessibilidade verificados.
- [ ] DOD-005 Docker e integração de dados reproduzíveis.
- [ ] DOD-006 Delivery Gate aprovado e Status alterado para Complete.
