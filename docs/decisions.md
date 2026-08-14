# Decisões técnicas

<!-- specsfy:documentator:start -->
## Fontes explícitas

| Fonte | Decisões e tópicos observados |
| --- | --- |
| PROJECT.md | Projeto; História e motivação; Finalidade; Pessoas e contexto de uso |
| .specsfy/RULES.md | Regras do sistema; Arquitetura; Código e qualidade; Testes; Componentes não fazem `fetch` diretamente; serviços centralizam fontes e contratos.; Filtros e agregações atuais são client-side e não podem mutar o conjunto bruto.; Toda mudança de comportamento deve possuir teste focal e documentação derivada.; A normalização deve aceitar os cabeçalhos reais da planilha e o campo `Mes_Origem`.; Executar `npm test`, `npm run lint` e `npm run build` antes da entrega.; O BDD permanece na spec; testes executáveis devem apontar para IDs `SPECSFY:`. |
| .specsfy/STACK.md | Stack do sistema; Inventário detectado; Decisões e observações do projeto |
| .specsfy/DATABASE.md | Banco de dados; Fontes de dados; Estruturas; Decisões, ownership e retenção |

## Política

- Decisão explícita prevalece sobre inferência deste documentador.
- Histórico detalhado deve usar ADR ou mecanismo já adotado pelo projeto.
- Ausência de uma decisão é registrada como lacuna, não preenchida por
  preferência do agente.
<!-- specsfy:documentator:end -->
