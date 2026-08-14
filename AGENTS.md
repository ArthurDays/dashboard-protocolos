<!-- specsfy:framework:start -->
## Framework Specsfy

Leia e siga integralmente `.specsfy/Spec.md` antes de trabalhar com
backlogs, entrevistas, especificações, tarefas, testes ou implementação. Esse
arquivo contém o fluxo, os caminhos canônicos e os gates do framework.

- Preserve as instruções próprias deste projeto.
- Leia `PROJECT.md`, `.specsfy/STACK.md`, `.specsfy/RULES.md` e
  `.specsfy/DATABASE.md` como contexto persistente antes de planejar mudanças.
- Execute `$specsfy-setup` quando algum desses arquivos estiver ausente.
- Execute o monitor de contexto no início, após cada tarefa e antes de concluir
  a entrega; resolva todo resultado `PENDING`.
- Use as skills `specsfy-aux-*` para manter stack, regras e banco sem apagar
  conteúdo humano.
- Execute `$specsfy-documentator` depois de cada implementação para reconstruir
  a documentação técnica completa em `docs/`.
- Use `specs/backlog/` para ideias ainda não promovidas.
- Use `specs/specs/<NNNN>-<slug>/spec.md` como fonte normativa de cada fatia.
- Não crie `plan.md`, `tasks.md`, `research.md` ou outra fonte normativa
  paralela.
<!-- specsfy:framework:end -->
