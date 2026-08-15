# Projeto

## História e motivação

O projeto nasceu para consolidar a consulta do serviço de protocolo, cujos
registros ficam distribuídos em abas mensais de uma planilha Google Sheets.
Evoluiu de um painel React de leitura para uma solução com Apps Script,
fallback local, Docker e backend Fastify/PostgreSQL preparado para migração.
O primeiro módulo Protocol Intelligence acrescenta triagem assistida por um
provider simulado e substituível, sempre subordinada à decisão humana.

## Finalidade

O sistema serve para acompanhar o volume de protocolos, filtrar registros por
mês/período e visualizar distribuições por canal, tipo e unidade.

## Pessoas e contexto de uso

Operadores consultam e filtram os registros durante a rotina; gestores usam os
indicadores para acompanhamento; administradores técnicos configuram a fonte,
deploy e observabilidade.

## Capacidades principais

O painel carrega JSON consolidado, normaliza registros, calcula KPIs, mantém
filtros client-side, exibe gráficos Top 5 + Outros, permite detalhamento em
modal, pagina a tabela, exporta CSV e usa cache em falha de rede. O backend
também gera recomendações estruturadas de triagem, mantém seu histórico e
registra aprovação ou rejeição auditável. Na interface, o detalhe do protocolo
oferece uma demonstração local do agente com confiança, justificativas,
alertas e decisão humana claramente identificada como simulação. A central de
triagem resume a fila filtrada, prioridades sugeridas, confiança média e
alertas para acompanhamento gerencial.
O detalhe também apresenta uma trilha demonstrativa das etapas do agente,
incluindo a confirmação explícita de que a recomendação não foi aplicada.

## Limites

O painel atual não edita protocolos, não define SLA institucional, não possui
autenticação própria e ainda não tornou a API PostgreSQL a fonte oficial. A
triagem MVP usa somente regras e dados simulados, não acessa modelos externos e
nunca aplica automaticamente prioridade, unidade ou status recomendados.

## Contexto técnico

Frontend React/Vite com Chart.js, backend Node.js/TypeScript/Fastify/Prisma,
PostgreSQL em Docker e Google Apps Script como adaptador da planilha. Evidências
executáveis permanecem em `.specsfy/STACK.md` e `.specsfy/DATABASE.md`.
