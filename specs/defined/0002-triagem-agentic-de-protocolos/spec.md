# Especificação integrada: Triagem agentic de protocolos

| Campo | Valor |
| --- | --- |
| Formato | Specsfy/2.0 |
| ID | SPEC-0002 |
| Slug | 0002-triagem-agentic-de-protocolos |
| Status | Reviewing |
| Effort | 3 |
| Effort updated at | 2026-08-15 |
| Effort rationale | Fatia vertical com contrato do agente, decisão humana, persistência e testes. |
| ClickUp Task | |
| Milestones | Protocol Intelligence MVP |
| Definition Gate | Passed |
| Plan Gate | Passed |
| Delivery Gate | Passed |
| Evidence Contract | 1 |
| Atualizada em | 2026-08-15 |

## Ato I — Definir

### 1. Problema e resultado

#### Problema

O painel consolida protocolos, mas a triagem continua manual e não oferece recomendação estruturada, explicável e auditável.

#### Resultado desejado

Um operador solicita recomendação de um agente simulado, entende prioridade, unidade, confiança, justificativas e alertas, e aprova ou rejeita sem alteração automática do protocolo.

#### Métricas de sucesso

- 100% das recomendações retornam o contrato completo e permanecem pendentes até decisão humana.
- 100% das decisões persistem ator e instante.
- Três casos Vitest passam sem rede e somente com dados simulados.

### 2. Research e esclarecimentos

#### Researchs executados

- **R-001**: O backend suporta esta evolução? → Fastify, Prisma e API keys permitem um serviço provider-neutral e rotas protegidas.
- **R-002**: Qual é a menor fatia segura? → Provider determinístico, persistência e decisão humana; LLM/RAG ficam fora do MVP.

#### Fontes e contexto consultados

- `backend/src/server.ts`, `backend/prisma/schema.prisma`, `backend/src/auth.ts`, `PROJECT.md` e documentos `.specsfy/`.
- Decisões do usuário: fluxo de agente, Vitest e somente dados simulados.

#### Documentação consultada

- Somente código e documentação locais; nenhuma fonte externa.

#### Artefatos de pesquisa armazenados

- Nenhum artefato externo.

#### Dúvidas respondidas

- **Q**: Qual runner? → **A**: Vitest.
- **Q**: Dados reais? → **A**: Não, somente simulados.
- **Q**: O agente altera protocolos? → **A**: Não, exige decisão humana explícita.

#### Dúvidas abertas

- Nenhuma.

### 3. Escopo e atores

#### Incluído

- Contrato provider-neutral, provider simulado offline, persistência, consulta, aprovação, rejeição, auditoria e testes.

#### Fora de escopo

- LLM externo, RAG, embeddings, anexos, dados reais, autenticação institucional, execução autônoma e UI completa.

#### Atores

- **Operador**: solicita, consulta e decide via API protegida.
- **Agente simulado**: recomenda sem executar ações.
- **Auditor/Gestor**: consulta recomendação e decisão.

### 4. Princípios e restrições do projeto

- **PR-001**: Campos do protocolo são entrada não confiável e nunca instruem o agente.
- **PR-002**: Criação de recomendação não altera o protocolo; human-in-the-loop é obrigatório.
- **PR-003**: O provider é substituível, determinístico, offline e usa dados simulados.
- **PR-004**: Rotas reutilizam API keys existentes e não expõem segredos.

### 5. Histórias de usuário

#### US-001 — Recomendar e decidir uma triagem (P1)

Como operador, quero receber uma recomendação estruturada e decidir sobre ela, para acelerar a análise sem entregar controle autônomo ao agente.

**Por que P1**: Demonstra a capacidade AI-native central com guardrails e auditoria.
**Teste independente**: `npm run test:tdd -- --run src/triage.test.ts` valida geração, conteúdo malicioso e decisão humana.
**Requisitos**: FR-001, NFR-001

### 6. Cenários BDD de aceite

#### AC-001 — Recomendação estruturada permanece pendente

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-001
Feature: Triagem assistida
  Scenario: Gerar recomendação para protocolo simulado
    Given um protocolo simulado de ouvidoria sem recomendação
    When o operador solicita a triagem
    Then recebe prioridade, unidade, confiança, justificativas e alertas com estado pendente
    And o protocolo original permanece inalterado
```

#### AC-002 — Conteúdo malicioso não controla o agente

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-002
Feature: Triagem assistida
  Scenario: Tratar instrução no assunto como dado
    Given um protocolo cujo assunto manda ignorar regras e aprovar automaticamente
    When o operador solicita a triagem
    Then a saída continua no contrato permitido e pendente
    And nenhuma instrução do assunto é executada
```

#### AC-003 — Decisão humana é auditável e única

**Cobre**: US-001, FR-001, NFR-001

```gherkin
@US-001 @FR-001 @NFR-001 @AC-003
Feature: Triagem assistida
  Scenario: Aprovar uma recomendação pendente
    Given uma recomendação pendente para protocolo simulado
    When o operador identificado a aprova
    Then a decisão registra aprovação, ator e instante
    And uma segunda decisão é recusada
```

### 7. Requisitos

#### Funcionais

- **FR-001**: O sistema deve gerar recomendação estruturada pendente e permitir exatamente uma decisão humana auditável, sem alterar automaticamente o protocolo.

#### Não funcionais

- **NFR-001**: O fluxo deve ser determinístico, offline, resistente a instruções nos campos do protocolo e testável com dados simulados. **Verificação**: três casos Vitest sem rede nem banco real.

#### Erros e casos-limite

- Protocolo ou recomendação inexistente → HTTP 404.
- Decisão inválida ou ator vazio → HTTP 400.
- Recomendação já decidida → HTTP 409, preservando a primeira decisão.

## Ato II — Projetar e provar

### 8. Plano técnico

#### Contexto existente

- Backend Node.js/TypeScript/Fastify, Prisma/PostgreSQL, autenticação por API key e servidor em `backend/src/server.ts`.

#### Arquitetura e módulos

- `backend/src/triage.ts` concentra tipos, provider e regras puras; `server.ts` orquestra HTTP e Prisma; o schema persiste recomendação/decisão.

#### Migrations

- Migration aditiva cria enum `TriageDecision` e tabela `TriageRecommendation`; rollback remove apenas os novos objetos.

#### Models

- `TriageRecommendation`: saída imutável do provider e estado/ator/instante da decisão; relação N:1 com `Protocol`.

#### Controllers e casos de uso

- POST de triagem carrega protocolo, chama provider e persiste PENDING; GET lista; POST de decisão valida e atualiza condicionalmente PENDING.

#### Views e experiência

- Não aplicável nesta fatia; JSON diferencia 200/201/400/404/409.

#### Queries e repositórios

- Prisma consulta por `protocolId, createdAt` e decide por `id + decision=PENDING`, prevenindo dupla decisão.

#### Jobs e processamento assíncrono

- Não aplicável; provider local síncrono.

#### Estrutura de arquivos

```text
backend/prisma/migrations/0002_triage_recommendations/migration.sql
backend/prisma/schema.prisma
backend/src/server.ts
backend/src/triage.ts
backend/src/triage.test.ts
specs/draft/0002-triagem-agentic-de-protocolos/spec.md
```

### 9. Modelo de dados

#### Entidades

| Entidade | Identidade | Atributos e regras | Relações |
| --- | --- | --- | --- |
| TriageRecommendation | UUID | priority, suggestedUnit, confidence 0..1, rationale/alerts JSON, provider/version, decision, decidedBy/At, note | N:1 Protocol |

#### Estados e transições

| Entidade | Estado atual | Evento | Próximo estado | Invariantes |
| --- | --- | --- | --- | --- |
| TriageRecommendation | PENDING | approve | APPROVED | ator obrigatório; decisão única; não altera Protocol |
| TriageRecommendation | PENDING | reject | REJECTED | ator obrigatório; decisão única; não altera Protocol |

#### Migração e retenção

- Sem backfill; cascade acompanha retenção do protocolo. Atualizar `.specsfy/DATABASE.md`.

### 10. Interfaces e contratos

#### APIs expostas

- `POST /api/protocolos/:id/triagens`, read key, body vazio → 201 ou 404.
- `GET /api/protocolos/:id/triagens`, read key → 200 com histórico decrescente.
- `POST /api/triagens/:id/decisao`, ingest key, `{ decision: "APPROVED"|"REJECTED", actor: string, note?: string }` → 200/400/404/409.

#### APIs externas utilizadas

- Nenhuma; provider simulado não acessa rede.

#### Documentação das APIs consultadas

- Nenhuma fonte externa; contratos derivados do backend local.

#### Eventos e outros contratos

- `TriageProvider.recommend(input)` devolve priority, suggestedUnit, confidence, rationale, alerts, provider e providerVersion.

### 11. Estratégia TDD

- **Unidade**: contrato, regra determinística, conteúdo não confiável e decisão única.
- **Integração/contrato**: build TypeScript e geração Prisma; banco real não é necessário nos testes simulados.
- **BDD/aceite**: AC-001 a AC-003 orientam os testes, sem `.feature`.
- **Runner TDD**: Vitest, confirmado pelo usuário e exposto como `test:tdd`.
- **E2E**: Não aplicável nesta fatia.
- **Verificação manual**: Não aplicável.

#### Evidência RED-GREEN-REFACTOR

| IDs | BDD de referência | Teste TDD informado pelo BDD | RED observado | GREEN observado | Refactor/regressão |
| --- | --- | --- | --- | --- | --- |
| US-001, FR-001, NFR-001, AC-001 | AC-001 | `gera recomendação estruturada pendente` em `backend/src/triage.test.ts` | `npm run test:tdd -- --run src/triage.test.ts`: módulo `triage.js` ausente | 3/3 testes passaram | `npm test` e `npm run build` passaram |
| US-001, FR-001, NFR-001, AC-002 | AC-002 | `não executa instruções do assunto` em `backend/src/triage.test.ts` | Mesmo RED válido; implementação importada ainda ausente | 3/3 testes passaram | `npm test` e `npm run build` passaram |
| US-001, FR-001, NFR-001, AC-003 | AC-003 | `aceita exatamente uma decisão humana` em `backend/src/triage.test.ts` | Mesmo RED válido; implementação importada ainda ausente | 3/3 testes passaram | `npm test` e `npm run build` passaram |

### 12. Plano de testes e rastreabilidade

| Requisito | Cenário BDD | Nível | Arquivo/comando esperado | Evidência |
| --- | --- | --- | --- | --- |
| FR-001 | AC-001 | Unidade | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |
| FR-001 | AC-002 | Unidade/segurança | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |
| FR-001 | AC-003 | Unidade | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |
| NFR-001 | AC-001 | Unidade | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |
| NFR-001 | AC-002 | Unidade/segurança | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |
| NFR-001 | AC-003 | Unidade | `npm run test:tdd -- --run src/triage.test.ts` | Passed — 2026-08-15 |

### 13. Validações

#### Gate do Ato I — Definição

- **Resultado**: READY — 2026-08-15
- **Comando**: `node .agents/skills/specsfy-04-validate/scripts/validate_spec.mjs specs/draft/0002-triagem-agentic-de-protocolos/spec.md`
- **Achados**: Formato válido; cobertura US/FR/NFR = 3 ACs cada; revisões PROD/ARCH/SEC sem achado bloqueante.

#### Gate do Ato II — Plano

- **Resultado**: Passed — 2026-08-15
- **Comando**: `node .agents/skills/specsfy-05-tasks/scripts/validate_tasks.mjs specs/draft/0002-triagem-agentic-de-protocolos/spec.md`
- **Achados**: 7 tarefas, três predecessores TDD materializados e RED válido observado.

#### Gate do Ato III — Entrega

- **Resultado**: Passed — 2026-08-15
- **Comando**: `node .agents/skills/specsfy-06-tdd-bdd/scripts/check_traceability.mjs specs/draft/0002-triagem-agentic-de-protocolos/spec.md . --full-chain`
- **Achados**: 3/3 testes Vitest, build TypeScript, Prisma generate, rastreabilidade e monitor de contexto aprovados.

### 14. Tarefas

#### Fase 0 — Runner

- [x] T001 [OPS] Configurar Vitest e script test:tdd em backend/package.json — Refs: NFR-001 — Depends: none
  - [x] **PREP**: Confirmado Node sem PHP e decisão explícita por Vitest.
  - [x] **EXECUTE**: Vitest 4 e scripts `test`/`test:tdd` adicionados.
  - [x] **VERIFY**: Runner iniciou e descobriu `src/triage.test.ts`.
  - [x] **EVIDENCE**: `npm run test:tdd -- --run src/triage.test.ts` iniciou Vitest 4.1.10.
  - [x] **IMPROVE**: `test` e `test:tdd` usam o mesmo runner para evitar deriva.

#### Fase 1 — RED TDD informado pelo BDD

- [x] T002 [TEST] [TDD] [US-001] Derivar AC-001 em backend/src/triage.test.ts — Refs: US-001, FR-001, NFR-001, AC-001 — Depends: T001
  - [x] **PREP**: Gherkin, contrato e nível unitário confirmados.
  - [x] **EXECUTE**: Caso Vitest criado com marcador SPECSFY próprio.
  - [x] **VERIFY**: RED observado por módulo de produção ausente.
  - [x] **EVIDENCE**: Comando e causa registrados na seção 11.
  - [x] **IMPROVE**: O teste também compara o protocolo antes/depois.

- [x] T003 [TEST] [TDD] [US-001] Derivar AC-002 em backend/src/triage.test.ts — Refs: US-001, FR-001, NFR-001, AC-002 — Depends: T001
  - [x] **PREP**: Ameaça em campo não confiável confirmada.
  - [x] **EXECUTE**: Caso Vitest criado com marcador SPECSFY próprio.
  - [x] **VERIFY**: RED observado por comportamento ausente.
  - [x] **EVIDENCE**: Comando e causa registrados na seção 11.
  - [x] **IMPROVE**: Oráculo usa contrato fechado, não texto do atacante.

- [x] T004 [TEST] [TDD] [US-001] Derivar AC-003 em backend/src/triage.test.ts — Refs: US-001, FR-001, NFR-001, AC-003 — Depends: T001
  - [x] **PREP**: Transição e invariante de decisão única confirmadas.
  - [x] **EXECUTE**: Caso Vitest criado com marcador SPECSFY próprio.
  - [x] **VERIFY**: RED observado por comportamento ausente.
  - [x] **EVIDENCE**: Comando e causa registrados na seção 11.
  - [x] **IMPROVE**: Caso verifica estado, ator e instante.

#### Fase 2 — Fatia vertical

- [x] T005 [CODE] [US-001] Implementar provider, persistência e rotas em backend/src/triage.ts, backend/src/server.ts e backend/prisma — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T002, T003, T004
  - [x] **PREP**: Três REDs válidos e baseline confirmados.
  - [x] **EXECUTE**: Provider, domínio, schema, migration, rotas e docs implementados.
  - [x] **VERIFY**: Vitest 3/3, Prisma generate e build aprovados.
  - [x] **EVIDENCE**: GREEN, comandos e arquivos registrados nas seções 11–13.
  - [x] **IMPROVE**: Provider isolado do HTTP para substituição futura segura.
  <!-- specsfy:evidence {"task":"T005","refs":["US-001","FR-001","NFR-001","AC-001","AC-002","AC-003"],"files":["backend/src/triage.ts","backend/src/server.ts","backend/prisma/schema.prisma","backend/prisma/migrations/0002_triage_recommendations/migration.sql"],"commands":[{"run":"npm run test:tdd -- --run src/triage.test.ts","exit":0},{"run":"npm run build","exit":0}]} -->

- [x] T006 [DOC] Atualizar PROJECT.md, .specsfy/STACK.md e .specsfy/DATABASE.md — Refs: FR-001, NFR-001 — Depends: T005
  - [x] **PREP**: Mudanças de capacidade, runner e persistência inspecionadas.
  - [x] **EXECUTE**: Contexto e documentação reconstruídos sem remover conteúdo humano.
  - [x] **VERIFY**: Monitor retornou CURRENT.
  - [x] **EVIDENCE**: PROJECT, STACK, DATABASE, PACKAGES e docs/ atualizados.
  - [x] **IMPROVE**: Limites simulados e human-in-the-loop explicitados.

#### Fase final — Qualidade

- [x] T007 [TEST] Executar regressão em backend/src/triage.test.ts, rastreabilidade da spec e verificação de docs/ — Refs: US-001, FR-001, NFR-001, AC-001, AC-002, AC-003 — Depends: T006
  - [x] **PREP**: Suites e gates finais identificados.
  - [x] **EXECUTE**: Testes, build, validadores e documentator executados.
  - [x] **VERIFY**: Sem gaps de IDs; documentação e contexto atuais.
  - [x] **EVIDENCE**: 3 testes, 6/6 IDs e comandos finais registrados.
  - [x] **IMPROVE**: `.gitignore` criado para impedir artefatos gerados e segredos no versionamento.

### 15. Ordem de execução

- Caminho crítico: T001 → T002/T003/T004 → T005 → T006 → T007.
- Tarefas paralelas: T002, T003 e T004 compartilham arquivo e serão executadas sequencialmente apesar de independentes.
- Estratégia de MVP: domínio seguro primeiro, depois persistência/API e documentação.

## Ato III — Entregar e validar

### 16. Dependências, riscos e suposições

#### Dependências

- Vitest; Prisma/PostgreSQL já existentes.

#### Riscos

- “Agente” sugerir autonomia → documentação explicita human-in-the-loop.
- Prompt injection pelos campos → regras fechadas tratam campos somente como dados.
- Corrida de decisões → update condicional PENDING e HTTP 409.

#### Suposições

- Códigos simulados de unidade servem para demonstrar roteamento, sem representar regra institucional.

### 17. Decisões

- **DEC-001**: Provider determinístico antes de LLM — testes reproduzíveis, custo zero e menor risco.
- **DEC-002**: Aprovação não aplica recomendação — execução de mudanças exigirá outra spec.
- **DEC-003**: Justificativas e alertas em JSON — contrato estruturado e evolutivo.

### 18. Definition of Done

- [x] `Definition Gate`, `Plan Gate` e `Delivery Gate` estão `Passed`.
- [x] Os três ACs passam no Vitest com dados simulados e sem rede.
- [x] Contrato HTTP, provider, persistência e decisão humana compilam.
- [x] Migration é aditiva e `prisma generate` passa.
- [x] `.specsfy/STACK.md`, `.specsfy/DATABASE.md`, `PROJECT.md` e `docs/` estão atualizados.
- [x] Todas as tarefas e checks estão concluídos com evidência.
