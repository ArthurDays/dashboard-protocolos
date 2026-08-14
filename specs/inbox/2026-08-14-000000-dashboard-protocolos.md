# Captura: Painel de Controle de Protocolos

## Texto original

Atue como um Engenheiro de Frontend Sênior especializado em desenvolvimento de dashboards e integrações via APIs REST/JSON.

O seu objetivo é desenvolver o código completo para um "Painel de Controle de Protocolos" (Dashboard), seguindo rigorosamente a Especificação de Software (SDD) fornecida ao final deste prompt.

### Stack Tecnológica Sugerida

- React via Vite ou Vanilla JS.
- TailwindCSS.
- Chart.js ou Recharts.
- Lucide React ou FontAwesome.

### Requisitos explicitamente mencionados

- Cabeçalho com título, filtro de mês, data inicial e data final.
- Botão Atualizar Agora, último sync e spinner.
- Cards de Total Geral, Média Diária e Físico versus Digital.
- Gráfico de Rosca e Gráfico de Barras.
- Fetch para Google Apps Script.
- Cache em LocalStorage.
- Mês gerado dinamicamente pela propriedade `Mes_Origem` do JSON.
- Filtro client-side e atualização bidirecional de datas e mês.
- Tratamento de falha de rede com cache e tentativa novamente.
- Erro crítico quando faltar coluna vital.

### SDD original

O painel consome dados de múltiplas abas mensais da planilha Caderno de Entrada 2026, consolidando os registros e permitindo navegação por mês ou período.

Entidade `RegistroProtocolo`: `data`, `canal_entrada`, `tipo_documento`, `interessado`, `unidade` e `mes_origem`.

Histórias originais: visualização de indicadores; filtro dinâmico por mês; transição para período personalizado; sincronização consolidada de todas as abas.

Casos-limite originais: falha de rede com cache local e alteração de cabeçalho com erro de estrutura.

Requisitos originais: consumir JSON; select dinâmico e date pickers; estado global bidirecional; LocalStorage; atualização manual e a cada 15 minutos; filtragem client-side.

## Declaração

O pedido descreve um dashboard de leitura integrado a Google Apps Script, com filtros client-side, indicadores, gráficos, cache e tratamento de erros.

## Inferência

O código existente também possui ranking Top 5 com agrupamento Outros, modal de detalhamento, tabela com busca/paginação/exportação e uma API Fastify/PostgreSQL de transição.

## Pontos a revisar no futuro

- Definir autenticação, autorização e mascaramento para produção.
- Confirmar SLA, retenção, auditoria e edição de protocolos.
- Confirmar se a API PostgreSQL será a fonte oficial ou somente uma migração futura.
- Confirmar critérios de aceite com usuários operacionais.
