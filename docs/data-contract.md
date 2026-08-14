# Contrato de dados

## Respostas aceitas

```json
[
  { "DATA": "14/08/2026", "Mes_Origem": "AGOSTO" }
]
```

Também são aceitos envelopes com `rows` ou `data`:

```json
{
  "rows": [{ "DATA": "14/08/2026", "Mes_Origem": "AGOSTO" }],
  "timestamp": "2026-08-14T12:00:00.000Z"
}
```

O contrato é interpretado em
[`protocolContract.js`](../src/services/protocolContract.js).

## Campos

| Campo de entrada | Obrigatório | Normalizado |
| --- | ---: | --- |
| `DATA` ou `Data` | Sim | `data`, `_parsedDate` |
| `PROTOCOLIZAÇÃO E-MAIL / BALCÃO / E-PROTOCOLO`, `MEIO DE PROTOCOLIZAÇÃO`, `PROTOCOLIZAÇÃO` ou `CANAL` | Sim | `canal_entrada` |
| `TIPO DE DOCUMENTO` ou `TIPO` | Sim | `tipo_documento` |
| `INTERESSADO` ou `REQUERENTE` | Sim | `interessado` |
| `UNIDADE DE DESTINO`, `UNIDADE` ou `SETOR` | Sim | `unidade` |
| `Mes_Origem`, `mes_origem` ou `_aba` | Recomendado | `mes_origem` |
| `Nº E-PROTOCOLO` | Não | `numero_eprotocolo` |
| `Nº PROCESSO` | Não | `numero_processo` |
| `ASSUNTO` | Não | `assunto` |

## Registro normalizado

```json
{
  "data": "14/08/2026",
  "mes_origem": "AGOSTO",
  "canal_entrada": "E-mail",
  "tipo_documento": "Requerimento",
  "interessado": "Nome do requerente",
  "unidade": "ASSAD",
  "numero_eprotocolo": "",
  "numero_processo": "",
  "assunto": ""
}
```

## Normalização e filtros

- `Mes_Origem` vira maiúsculo e é comparado por igualdade exata.
- Datas aceitas: `DD/MM/AAAA` ou formato interpretável pelo JavaScript.
- Datas inválidas são descartadas.
- Canal vazio vira `Não informado`.
- Unidade vazia vira `Outros`.
- Mês selecionado preenche primeiro e último dia do mês.
- Alteração manual de data muda o modo para `Personalizado`.
- Canal e tipo são aplicados depois do período.

Uma API REST deve manter esses campos ou fornecer um adaptador equivalente.
