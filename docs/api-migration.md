# Migração para API REST e PostgreSQL

## Motivo

Google Sheets atende ao protótipo, mas não oferece controle suficiente de
autenticação, histórico, paginação, idempotência, SLA e auditoria.

## Arquitetura alvo

```text
n8n / Python / RPA → API REST → PostgreSQL
                              ↓
                    Dashboard React
```

## Endpoints mínimos

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/api/health` | Saúde da API e banco |
| `GET` | `/api/protocolos` | Listagem paginada e filtrada |
| `GET` | `/api/protocolos/{id}` | Detalhe |
| `GET` | `/api/protocolos/{id}/movimentacoes` | Histórico |
| `GET` | `/api/dashboard/kpis` | Indicadores agregados |
| `GET` | `/api/dashboard/series` | Séries dos gráficos |
| `GET` | `/api/dashboard/sla` | Indicadores de prazo |
| `PATCH` | `/api/protocolos/{id}/status` | Transição e histórico |
| `POST` | `/api/ingestao/protocolos` | Entrada em lote idempotente |

## Parâmetros de listagem

```text
page=1&per_page=25&search=alvará&date_start=2026-08-01
&date_end=2026-08-31&mes_origem=AGOSTO&unidade=ASSAD&sort=-data
```

## Modelo mínimo

- `protocolos`: identidade, entrada, origem e estado atual;
- `movimentacoes`: status, unidade, responsável e data;
- `unidades`, `usuarios` e `perfis`;
- `regras_sla` e `feriados`;
- `ingestao_eventos`: origem, chave externa, hash e erro;
- `auditoria`: ator, ação, antes, depois e timestamp.

## Idempotência

Toda entrada externa deve possuir `source`, `external_id` e `payload_hash`.
O banco deve impedir duplicidade por `(source, external_id)` e registrar o
resultado de cada item do lote.

## Migração incremental

1. Publicar o contrato normalizado atual.
2. Criar API somente leitura com dados importados da planilha.
3. Configurar `VITE_PROTOCOLS_API_URL` em homologação.
4. Comparar KPIs da API e do Sheets.
5. Migrar ingestão para n8n, Python ou RPA.
6. Desativar leitura direta da planilha após observação.

O frontend não incorpora credenciais. Em modo API, um proxy institucional deve
autenticar a sessão e acrescentar a credencial de leitura no servidor.
Em produção, substitua essa chave exposta no bundle por sessão institucional,
OIDC ou proxy backend-for-frontend.
