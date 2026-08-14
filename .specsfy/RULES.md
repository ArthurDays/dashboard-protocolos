# Regras do sistema

Estas regras complementam as instruções dos agentes sem substituir a spec ou os
critérios de aceite.

## Arquitetura

- Componentes não fazem `fetch` diretamente; serviços centralizam fontes e contratos.
- Filtros e agregações atuais são client-side e não podem mutar o conjunto bruto.

## Código e qualidade

- Toda mudança de comportamento deve possuir teste focal e documentação derivada.
- A normalização deve aceitar os cabeçalhos reais da planilha e o campo `Mes_Origem`.

## Testes

- Executar `npm test`, `npm run lint` e `npm run build` antes da entrega.
- O BDD permanece na spec; testes executáveis devem apontar para IDs `SPECSFY:`.

## Segurança e privacidade

- Não implementar autenticação no dashboard; controlar a exposição por rede,
  compartilhamento da planilha ou proxy institucional.
- Não colocar chaves privadas em variáveis `VITE_*` ou no bundle frontend.
- Interessados, assuntos e números de processo são dados potencialmente pessoais.

## Operação

- Alterações no contrato exigem validação de todas as abas mensais.
- Cache local é contingência, nunca fonte de auditoria.

## Regras específicas do projeto

- A opção de mês deve ser derivada de `Mes_Origem`; meses não podem ser hardcoded.
- Gráficos com muitas categorias usam Top 5 + `Outros` e modal de detalhamento.
