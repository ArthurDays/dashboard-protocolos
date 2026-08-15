# Evidência local: planilha operacional de protocolos

| Campo | Valor |
|---|---|
| Origem | Google Sheets fornecido pelo usuário |
| Documento | Caderno de Entrada 2026 |
| URL | Removida da documentação pública; recurso institucional restrito |
| Data de consulta | 2026-08-14 |
| Finalidade | Confirmar abas e cabeçalhos do contrato de entrada |

## Estrutura observada

Abas visíveis: `JANEIRO`, `FEVEREIRO`, `MARÇO`, `MAIO`, `ABRIL`, `JUNHO`, `JULHO` e `AGOSTO`.

Cabeçalhos observados:

- `DATA`
- `PROTOCOLIZAÇÃO E-MAIL / BALCÃO / E-PROTOCOLO`
- `NÚMERO DO E-PROTOCOLO`
- `TIPO DE DOCUMENTO`
- `INTERESSADO`
- `ASSUNTO`
- `NÚMERO DE PROCESSO`
- `UNIDADE DE DESTINO`
- `OBSERVAÇÃO`

## Limites da evidência

- A consulta não copiou registros, nomes de interessados ou números de processo.
- `Mes_Origem` não aparece como coluna nativa nos cabeçalhos observados; deve ser acrescentado pelo Apps Script ou inferido pelo nome da aba antes da normalização.
- A planilha comprova a fonte e o formato observado, mas não define autenticação, SLA, retenção, autorização ou política de produção.
