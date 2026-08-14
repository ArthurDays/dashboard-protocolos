# Google Apps Script

## Responsabilidade

`Code.gs` lê abas visíveis e retorna JSON com `_aba`, `Mes_Origem`, `headers`,
`rows`, timestamp, total de linhas e total de abas.

## Publicação

1. Abra a planilha no Google Sheets.
2. Acesse **Extensões → Apps Script**.
3. Use o conteúdo de `Code.gs` deste diretório.
4. Publique em **Implantar → Nova implantação → App da Web**.
5. Configure a identidade de execução conforme a política da organização.
6. Copie a URL para `VITE_SHEETS_URL` em `.env.local`.
7. Reinicie o Vite depois de alterar variáveis.

## Requisitos

Cada aba deve usar os cabeçalhos definidos no
[contrato de dados](../docs/data-contract.md). Abas mensais devem manter a
mesma estrutura.

## Segurança

Não use acesso anônimo para dados reais. O Apps Script é um adaptador de
transição; a API REST deve assumir autenticação, autorização, rate limiting,
logs e auditoria.

## Diagnóstico

- Sem `Mes_Origem`: confirme que a implantação publicada usa o `Code.gs` atual.
- Resposta vazia: verifique se a aba está oculta ou possui apenas cabeçalho.
- Erro estrutural: alinhe os cabeçalhos ao contrato antes de publicar.
