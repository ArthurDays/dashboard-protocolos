# Integrações

<!-- specsfy:documentator:start -->
## Integrações observadas

| Sinal | Tipo | Fonte segura |
| --- | --- | --- |
| VITE_PROTOCOLS_API_KEY | variável de ambiente | `.env.example` (somente nome) |
| VITE_PROTOCOLS_API_URL | variável de ambiente | `.env.example` (somente nome) |
| VITE_SHEETS_URL | variável de ambiente | `.env.example` (somente nome) |

## Mapa

```mermaid
flowchart LR
  App[Aplicação] --> Config[Configuração por ambiente]
  Config --> External[Serviços externos]
  Docs[docs/integrations.md] --> Config
```

Valores de ambiente, credenciais e endpoints privados não são publicados.
Confirme autenticação, timeout, retry e ownership quando não estiverem
expressos no código.
<!-- specsfy:documentator:end -->
