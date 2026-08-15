# Stack do sistema

Documente tecnologias estruturais e a evidência executável que confirma cada
uma. Preserve decisões humanas nas seções livres deste arquivo.

## Inventário detectado

<!-- specsfy:stack:start -->
| Camada | Tecnologia | Evidência |
| --- | --- | --- |
| Biblioteca | React | `package.json` (`react`) |
| Runtime | Node.js | `package.json` |
| Infraestrutura | Containers | arquivo Compose |
| Biblioteca | React | `package.json` |
| Build | Vite | `package.json`, `vite.config.js` |
| Gráficos | Chart.js/react-chartjs-2 | `package.json`, `src/components/` |
| API | Fastify + TypeScript | `backend/package.json`, `backend/src/server.ts` |
| ORM | Prisma | `backend/package.json`, `backend/prisma/schema.prisma` |
| Banco | PostgreSQL | `docker-compose.yml`, `backend/prisma/schema.prisma` |
| Integração | Google Apps Script | `google-apps-script/Code.gs` |
| Containerização | Docker Compose + Nginx | `docker-compose.yml`, `Dockerfile`, `nginx.conf` |
<!-- specsfy:stack:end -->

## Decisões e observações do projeto

O Google Sheets/Apps Script é a fonte operacional atual. PostgreSQL/API REST é
o caminho de migração e ingestão futura. O frontend deve manter a lógica de
contrato e filtros independente da fonte.
