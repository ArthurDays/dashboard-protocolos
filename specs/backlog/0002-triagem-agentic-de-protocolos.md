# Backlog: Triagem agentic de protocolos

| Metainformação | Valor |
| --- | --- |
| ID | BACKLOG-0002 |
| Status | Ready for specification |
| Produto | Protocol Intelligence |
| Épico | Operações documentais agentic |
| Funcionalidade | Triagem explicável com aprovação humana |
| Tipo | Funcionalidade |
| Prioridade | P1 |
| Milestones | |
| Criado em | 2026-08-15 |
| Spec promovida | Nenhuma |

## Ideia original

Elevar o dashboard de protocolos ao nível avançado com fluxo de agentes, Vitest e somente dados simulados.

## Problema percebido

Operadores recebem protocolos sem uma recomendação estruturada de prioridade, unidade e riscos, e decisões automatizadas sem governança seriam inseguras.

## Pessoa afetada ou beneficiada

Operador responsável por revisar e encaminhar protocolos; gestor que acompanha justificativas e resultados.

## Resultado ou valor esperado

Gerar recomendação de triagem explicável, com confiança, alertas e fontes do raciocínio, exigindo aprovação humana antes de aplicar qualquer mudança.

## Contexto

Primeira fatia do Protocol Intelligence sobre a API Fastify/PostgreSQL existente; provider-neutral, determinística no MVP e sem dados reais.

## Referências relacionadas

- `specs/inbox/2026-08-15-163352-protocol-intelligence-com-fluxo-de-agentes.md` — origem e decisões confirmadas.
- `docs/architecture.md` — arquitetura React/Fastify/PostgreSQL.
- `backend/prisma/schema.prisma` — protocolos, prioridades, unidades e movimentações.

## Comportamento esperado

Ao solicitar triagem para um protocolo simulado, o sistema produz recomendação estruturada de prioridade e encaminhamento, confiança, justificativa e alertas. A recomendação não altera o protocolo até aprovação humana explícita.

## Regras de negócio

- Recomendações são propostas, nunca decisões automáticas.
- Toda saída indica confiança, justificativa e alertas.
- Aprovação ou rejeição humana é auditável.
- O MVP usa somente dados simulados e provider determinístico substituível.

## Critérios de aceitação

- Protocolo simulado válido retorna triagem estruturada e validada.
- Recomendação pendente não altera o protocolo antes da aprovação.
- Aprovação ou rejeição registra ator, instante e decisão.
- Dados fora do contrato são rejeitados sem chamar o provider.

## Qualidades e operação

- Segurança: conteúdo documental é entrada não confiável e não controla o agente.
- Privacidade: somente fixtures simuladas; nenhum dado real.
- Desempenho e volume: uma triagem síncrona por protocolo no MVP, com timeout.
- Auditoria e observabilidade: provider, versão, confiança, decisão e timestamps, sem prompts sensíveis.

## Dependências

- API Fastify e contrato de protocolo existentes.
- Vitest no backend.
- Interface de provider desacoplada de fornecedor externo.

## Situações de erro

- Protocolo inexistente ou payload inválido.
- Saída do provider fora do schema.
- Confiança abaixo do limite.
- Timeout ou indisponibilidade do provider.
- Aprovação duplicada ou recomendação encerrada.

## Escopo

- Dentro: contrato, provider simulado, API de criar/consultar/aprovar/rejeitar recomendação, auditoria e testes.
- Fora: LLM externo, RAG, anexos, autenticação institucional, alteração automática e dados reais.

## Dúvidas, decisões e riscos

- Decisão: Vitest como runner.
- Decisão: dados exclusivamente simulados.
- Decisão: human-in-the-loop obrigatório.
- Risco: o mock determinístico ser confundido com IA de produção; a documentação deve explicitar a limitação.

## Pronto para desenvolvimento

- [x] O problema e a pessoa beneficiada estão claros.
- [x] O evento inicial e o resultado esperado estão claros.
- [x] Permissões, regras e exceções relevantes estão claras.
- [x] O resultado pode ser verificado objetivamente.
- [x] Segurança, privacidade e desempenho foram avaliados conforme o risco.
- [x] Fora de escopo, dependências e decisões pendentes estão registrados.

## Próximo passo

Promover para `$specsfy-03-specify`.
