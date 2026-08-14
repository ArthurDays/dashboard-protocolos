# Testes e critérios de qualidade

## Validação atual

```bash
npm test
npm run lint
npm run build
```

O lint pode apresentar avisos de Fast Refresh relacionados aos helpers
exportados pelo contexto, sem bloquear a execução.

## Evidência de validação

As validações de frontend e Docker foram executadas durante a implementação
inicial. Em ambientes Windows restritos, `npm test` e `vite build` podem falhar
com `spawn EPERM`; nesse caso, repetir em terminal autorizado e registrar o
resultado na seção 13 da spec. A regressão do monorepo Specsfy e o BDD também
devem ser executados no ambiente CI com as dependências disponíveis.

## Cenários funcionais

### Fonte

- carregar mock sem URL;
- carregar respostas `rows`, `data` e array;
- rejeitar payload inválido;
- exibir cache em falha de rede;
- exibir erro estrutural;
- executar refresh manual e automático.

### Filtros

- mês gerado pelos valores únicos de `Mes_Origem`;
- seleção de mês por igualdade exata;
- preenchimento automático das datas;
- mudança manual para `Personalizado`;
- limpeza de filtros;
- combinação de período, canal e tipo.
- seleção de “Meio de Protocolização” reduz os registros renderizados;
- seleção de “Tipo de Documento” reduz os registros renderizados;
- combinação de canal e tipo mantém somente a interseção dos critérios;
- “Limpar Filtros” restaura a projeção completa.

### Visualizações e listagem

- ranking mantém Top 5;
- sexto item em diante vira `Outros`;
- modal lista itens agrupados;
- tabela permite busca, ordenação e paginação;
- CSV contém o resultado filtrado.

### Acessibilidade

- controles possuem labels;
- modais possuem `role=dialog` e `aria-modal`;
- modal fecha pelo botão e backdrop;
- interface funciona em viewport móvel.

## Evidência da última entrega

Em 14/08/2026 foram executados `npm test`, `npm run lint` e `npm run build`.
A suíte retornou 7 testes aprovados, incluindo o teste focal de filtragem por
canal e tipo. O fluxo também foi verificado no navegador com dados reais:
selecionar “E-mail”, combinar com “Ofício” e limpar os filtros atualizou os
indicadores e a tabela.

## Próxima evolução

Adicionar um runner TDD explícito, preferencialmente Vitest, e React Testing
Library para filtros e componentes. Depois adicionar E2E com fixture controlada
para o fluxo mês → período → tabela → detalhe → CSV.

<!-- specsfy:documentator:start -->
## Runner e comandos

- Runner observado: **Node Test ou runner definido no projeto**

| Comando | Origem |
| --- | --- |
| `npm run test  # node --test` | manifest ou padrão do framework |

## Resumo dos testes

| Classe | Quantidade |
| --- | --- |
| Outros | 2 |

## Inventário

| Teste | Caminho |
| --- | --- |
| chartData.test | `tests/chartData.test.js` |
| protocolContract.test | `tests/protocolContract.test.js` |

## Guia

1. Executar primeiro o teste focal da mudança.
2. Executar a suíte relacionada e depois a regressão completa.
3. Registrar RED/GREEN e comandos na spec quando o projeto usar Specsfy.
4. Não considerar erro de ambiente ou fixture como RED válido.
<!-- specsfy:documentator:end -->
