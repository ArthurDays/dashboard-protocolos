# Operação e troubleshooting

## Desenvolvimento

```bash
cd dashboard-protocolos
npm install
copy .env.example .env.local
npm run dev
```

Abra `http://127.0.0.1:5173/`.

## Fonte operacional confirmada

O catálogo operacional fica em uma planilha institucional restrita. O
identificador e a URL reais não são publicados neste repositório.
Ela possui abas mensais e é lida pelo `google-apps-script/Code.gs`, que retorna
um payload consolidado com `_aba` e `Mes_Origem`. Não copie registros da
planilha para o repositório.

Antes de publicar uma nova versão do Apps Script:

1. confirme que as abas possuem os mesmos cabeçalhos;
2. confirme que `Mes_Origem` corresponde exatamente ao nome da aba em maiúsculas;
3. execute um GET de homologação e valide `headers`, `rows`, `timestamp` e
   `totalRows`;
4. atualize `VITE_SHEETS_URL` somente no ambiente de execução.

## Produção estática

```bash
npm ci
npm run lint
npm run build
npm run preview
```

O diretório `dist/` pode ser publicado em um servidor estático. Configure as
variáveis `VITE_*` antes do build, pois elas entram no bundle.

## Container frontend

```bash
docker build -t dashboard-protocolos:local .
docker run --rm -p 8080:80 dashboard-protocolos:local
```

Acesse `http://127.0.0.1:8080/`. O endpoint `GET /health` responde `ok`.

Para subir frontend, API e PostgreSQL juntos:

```bash
docker compose up -d --build
docker compose ps
```

A API fica em `http://127.0.0.1:3333`; o dashboard containerizado fica em
`http://127.0.0.1:8080`.

Use `GET /api/health` para disponibilidade e `GET /api/metrics` para contadores
básicos de requisições, respostas, erros 5xx e uptime. Logs estruturados são
emitidos pelo Pino/Fastify.

## Cache e modo degradado

O cache usa `dashboard_protocolos_cache` no `localStorage` e armazena registros
normalizados, timestamp e origem. Em falha da fonte, o dashboard exibe cache e
banner de dados antigos. Sem cache, exibe indisponibilidade.

O cache do navegador não é fonte de verdade e não deve ser usado para auditoria.

## Problemas comuns

### Coluna obrigatória ausente

Revise os cabeçalhos de todas as abas e publique novamente o Apps Script.

### Dropdown sem os meses esperados

Confirme que cada registro possui `Mes_Origem`. O frontend usa `_aba` como
fallback, mas a fonte oficial deve enviar o campo explicitamente. Como
compatibilidade temporária com implantações antigas, se ambos estiverem
ausentes o cliente deriva o mês a partir de `DATA`; isso não substitui a
publicação correta do Apps Script, pois a origem oficial continua sendo o nome
da aba.

### Dados antigos

Confira o timestamp do cabeçalho, use “Atualizar Agora” e verifique o log do
Apps Script. Em falha de rede, o cache será indicado na interface.

### `spawn EPERM` no Windows

Alguns ambientes bloqueiam o processo auxiliar do Vite. Execute o comando em
terminal autorizado; rode `npm run lint` separadamente para validar o código.

## Segurança operacional

- O dashboard não terá autenticação própria. Restrinja a exposição por rede
  institucional, compartilhamento da planilha ou proxy externo conforme a
  política do órgão.
- Tokens não devem ficar em variáveis `VITE_*`, pois ficam públicos no bundle.
- Defina se interessados, assuntos e números de processo serão mascarados antes
  de publicar a planilha ou o endpoint.
- Evite exportar CSV com dados pessoais para locais compartilhados.

## Auditoria do repositório

Auditoria realizada em 14/08/2026 no repositório GitHub do projeto:

- nenhum `.env.local`, arquivo de planilha, CSV, log, token, chave privada ou
  URL real do Apps Script foi publicado;
- a árvore remota contém somente `.env.example` e arquivos de configuração
  demonstrativos;
- os nomes, assuntos e números presentes em `src/services/mockData.js` são
  dados sintéticos para desenvolvimento, não uma cópia da planilha;
- As credenciais do PostgreSQL e da API são obrigatórias no arquivo `.env` e
  devem ser substituídos por valores fortes antes de qualquer implantação;
- o Secret Scanning do GitHub não está habilitado; a verificação foi realizada
  por busca de padrões de credenciais no conteúdo atual e no histórico
  publicado.
