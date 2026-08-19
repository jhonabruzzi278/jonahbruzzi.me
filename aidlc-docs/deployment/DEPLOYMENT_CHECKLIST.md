# Deployment Checklist

⚠️ El proyecto está en fase Early Construction — no hay pipeline de deployment automatizado. Este checklist documenta el estado real y lo que falta para llegar a un deploy repetible/seguro, no un proceso ya en uso.

## Pre-Deployment

- [x] Tests pasando — 55/55 tests verdes (`npm test`), pero cobertura parcial: `mappers.ts`, la capa de sesión de `cart.ts`, `checkout.ts` y `lib/wordpress/auth.ts` completos (ver `testing/TEST_COVERAGE_REPORT.md`). No bloquea deploy hoy porque no hay CI que lo exija.
- [ ] CI/CD configurado — **no**, no se encontró ningún workflow (`.github/workflows`, `.gitlab-ci.yml`, etc.) en el repositorio
- [x] Secrets no commiteados — verificado: `.env.local` está en `.gitignore` (`local env files: .env*.local`) y no aparece en `git log` ni en el árbol de trabajo commiteado
- [ ] Variables de entorno documentadas centralmente — parcialmente: existen como comentarios en `.env.local` y se referencian en `CLAUDE.md`, pero no hay un `.env.example` en el repo para nuevos entornos
- [ ] Build de producción verificado en este momento (`npm run build`) — no se ejecutó como parte de esta auditoría (fuera de alcance: solo se analizó, no se modificó código fuente)
- [ ] Linting limpio (`npm run lint`) — no se ejecutó como parte de esta auditoría

## Infraestructura detectada

**Ninguna infraestructura como código.** No existe:
- Dockerfile / docker-compose
- Terraform / Pulumi / CloudFormation
- Manifiestos Kubernetes
- `vercel.json`
- Carpeta `.vercel/` (ni siquiera gitignorada localmente — no está presente en el filesystem)

**Lo único que apunta a una plataforma de deploy** es el `README.md` heredado de `create-next-app`, que menciona Vercel como sugerencia por defecto — no hay confirmación de que efectivamente se despliegue ahí.

## Recomendación mínima antes de considerar esto "Late Construction"

1. Crear `.env.example` (sin valores reales) documentando las 4 variables requeridas: `WOOCOMMERCE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`, `SIMPLE_JWT_LOGIN_AUTH_CODE`.
2. Confirmar y documentar la plataforma de deploy real (Vercel u otra) y si el deploy es automático (git push → deploy) o manual.
3. Agregar un workflow mínimo de CI (lint + build) antes de cualquier merge a `main`, dado que hoy no hay ninguna verificación automática antes de que el código llegue a producción.
