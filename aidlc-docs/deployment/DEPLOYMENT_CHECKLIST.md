# Deployment Checklist

⚠️ El proyecto está en fase Early Construction. Ya existe un pipeline de CI (tests + coverage gate), pero todavía no hay pipeline de *deployment* automatizado. Este checklist documenta el estado real y lo que falta para llegar a un deploy repetible/seguro.

## Pre-Deployment

- [x] Tests pasando — 55/55 tests verdes (`npm test`), cobertura completa (90%+) en `mappers.ts`, la capa de sesión de `cart.ts`, `checkout.ts` y `lib/wordpress/auth.ts` (ver `testing/TEST_COVERAGE_REPORT.md`). El resto del código sigue sin tests.
- [x] CI configurado — `.github/workflows/test.yml` (agregado 2026-08-18): corre en cada push/PR a `main`, ejecuta `npm run test:coverage` y **falla el job si la cobertura cae bajo los umbrales** definidos en `vitest.config.ts` (statements 90% / branches 80% / functions 85% / lines 90%, sobre los 4 módulos que hoy tienen tests). Sube el reporte de cobertura como artifact y publica un resumen en el job summary.
  - ⚠️ El workflow **no** corre `npm run lint` ni `npm run build` todavía — `npm run lint` ya funciona (se arregló por separado, ver nota abajo) pero hoy reporta 16 errores reales preexistentes en el código heredado del template (ej. `setState` síncrono dentro de `useEffect` en `use-auth-check.js`, `use-checkout-submit.js`), así que agregarlo al pipeline tal cual haría fallar CI inmediatamente sin relación con los cambios de esta sesión. Queda como paso siguiente explícito, no incluido en este checklist como "hecho".
- [x] Secrets no commiteados — verificado: `.env.local` está en `.gitignore` (`local env files: .env*.local`) y no aparece en `git log` ni en el árbol de trabajo commiteado
- [ ] Variables de entorno documentadas centralmente — parcialmente: existen como comentarios en `.env.local` y se referencian en `CLAUDE.md`, pero no hay un `.env.example` en el repo para nuevos entornos
- [ ] Build de producción verificado en CI (`npm run build`) — no está en el workflow todavía
- [ ] Linting limpio en CI (`npm run lint`) — el comando funciona (fix aplicado en sesión separada) pero reporta errores reales pendientes; no está gateando CI todavía

## CI/CD

**Workflow:** [`.github/workflows/test.yml`](../../.github/workflows/test.yml)
- Trigger: `push`/`pull_request` sobre `main`.
- Node 22, `npm ci`, `npm run test:coverage`.
- Gate de cobertura vía `vitest.config.ts` → `coverage.thresholds` (falla el job con exit code ≠ 0 si no se cumplen).
- El `coverage.include` está **deliberadamente acotado** a los 4 módulos con tests (no todo `src/lib/**`/`src/services/**`) — de lo contrario el agregado caería a ~30% (la mayoría del código sigue sin tests) y un umbral "alto" sería imposible de cumplir hasta testear todo. Extender esa lista a medida que se agreguen tests a más módulos (ver gaps en `testing/TEST_STRATEGY.md`).
- Sube `coverage/` completo como artifact (14 días de retención) y escribe una tabla resumen en `$GITHUB_STEP_SUMMARY`.

## Infraestructura detectada

**Ninguna infraestructura de deployment como código.** No existe:
- Dockerfile / docker-compose
- Terraform / Pulumi / CloudFormation
- Manifiestos Kubernetes
- `vercel.json`
- Carpeta `.vercel/` (ni siquiera gitignorada localmente — no está presente en el filesystem)

**Lo único que apunta a una plataforma de deploy** es el `README.md` heredado de `create-next-app`, que menciona Vercel como sugerencia por defecto — no hay confirmación de que efectivamente se despliegue ahí.

## Recomendación mínima antes de considerar esto "Late Construction"

1. Crear `.env.example` (sin valores reales) documentando las 4 variables requeridas: `WOOCOMMERCE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`, `SIMPLE_JWT_LOGIN_AUTH_CODE`.
2. Confirmar y documentar la plataforma de deploy real (Vercel u otra) y si el deploy es automático (git push → deploy) o manual.
3. Resolver los 16 errores de lint pendientes y agregar `npm run lint` + `npm run build` al workflow de CI, para que un PR con código roto no pueda llegar a `main`.
