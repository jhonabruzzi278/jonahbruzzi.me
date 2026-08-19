# jonahbruzzi.me

Tienda online headless para el mercado chileno ("Cosas que vale la pena descubrir"), construida con Next.js (App Router) sobre un backend WordPress + WooCommerce (`admin.jonahbruzzi.me`). El frontend nunca llama directamente al backend externo — todo pasa por Route Handlers de Next.js que actúan como BFF y mantienen las credenciales de WooCommerce fuera del navegador.

## Stack

- Next.js 16 (App Router, webpack) + React 19
- Redux Toolkit / RTK Query para estado y data fetching del cliente
- TypeScript en las capas de datos y API (`src/lib`, `src/services`, `src/app/api`), JavaScript en la UI heredada del template
- Bootstrap 5 + Sass para estilos

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

Requiere un archivo `.env.local` (no versionado) con las credenciales server-only de WooCommerce y del plugin Simple JWT Login — ver [`CLAUDE.md`](./CLAUDE.md#environment-variables) para la lista de variables requeridas.

```bash
npm run build    # build de producción
npm run start    # servir el build de producción
npm run lint     # eslint .
npm test         # tests (Vitest)
```

Para el detalle de arquitectura (flujo de datos, capas, path aliases, sesión de carrito), ver [`CLAUDE.md`](./CLAUDE.md).

## 📋 Documentación del Proyecto (AI-DLC)

Este proyecto sigue la metodología AI-DLC. Estado actual: **Early Construction** (código funcional y desplegado; tests automatizados parciales con Vitest, sin CI/CD).

Documentación completa en [`/aidlc-docs/`](./aidlc-docs/):
- [Requirements](./aidlc-docs/requirements/)
- [Architecture](./aidlc-docs/design-artifacts/ARCHITECTURE.md)
- [Domain Model](./aidlc-docs/design-artifacts/DOMAIN_MODEL.md)
- [Testing Strategy](./aidlc-docs/testing/TEST_STRATEGY.md)
- [Deployment Checklist](./aidlc-docs/deployment/DEPLOYMENT_CHECKLIST.md)

Última auditoría: 2026-08-18
