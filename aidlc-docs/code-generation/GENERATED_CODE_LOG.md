# Generated Code Log

Historial real extraído de `git log` (4 commits totales al 2026-08-18, autor único):

| Commit | Fecha | Descripción | Alcance |
|---|---|---|---|
| `3bdb7fe` | 2026-08-15 | feat: initial commit of jonahbruzzi.me Next.js storefront | Commit inicial completo (template comercial "Harri Shop" + integración WooCommerce ya presente desde el día 1 — no hay historial de la migración incremental desde un scaffold vacío) |
| `25a174a` | 2026-08-15 | fix: replace leftover template contact emails with real domain | Limpieza de datos de ejemplo del template comercial en `off-canvas`, `team-data`, `footer` |
| `5fd400d` | 2026-08-15 | perf: cache public WooCommerce reads to cut outbound connections | Cambio de `cache: "no-store"` a `next: { revalidate }` en `categories.ts`, `client.ts`, `coupons.ts`, `products.ts` — reacción a un problema real de conexiones concurrentes contra el host de WordPress |
| `654ffc2` | 2026-08-15 | fix: don't fail production build when sitemap generation can't reach WooCommerce | `src/app/sitemap.js` — hace tolerante a fallos la generación del sitemap durante el build |

## Origen del código base

El "commit inicial" ya contiene la integración completa con WooCommerce/WordPress y la capa `lib/`/`services/` con comentarios que referencian explícitamente "el backend anterior" (ver `productService.ts`: *"Response envelopes below intentionally mirror the previous backend shapes... so src/redux/features/productApi.js can point at these without UI changes"*). Esto indica que **el trabajo de migración de un backend anterior a WooCommerce ocurrió antes de este historial de Git** (probablemente en otro repositorio o sesión de desarrollo no versionada) — no hay manera de auditar ese proceso desde este repo.

## Herramientas de generación de código

⚠️ No hay evidencia en el repo de qué herramienta generó el código (Claude Code, Copilot, desarrollo manual, o combinación). El `CLAUDE.md` presente en la raíz del repo indica que Claude Code se usa activamente para trabajar en este proyecto a partir de esta sesión de auditoría, pero no hay registro previo de prompts o sesiones de IA usadas para el código ya existente.
