# Code Review Notes

## Proceso de review visible en el repositorio

⚠️ No hay evidencia de proceso de code review formal:
- Un solo autor de commits en todo el historial.
- Sin Pull Requests visibles desde este repo local (no se puede confirmar sin acceso a GitHub, pero no hay ramas locales además de `main`).
- Sin branch protection configurada de forma visible desde el repo (requeriría revisar GitHub Settings directamente).
- Sin CI que bloquee merges (no existe ningún workflow de CI/CD).

## Observaciones de calidad detectadas durante la auditoría (no bloqueantes, no corregidas — solo documentadas)

- **Mezcla TS/JS:** 41 archivos `.ts` (capas nuevas: `lib/`, `services/`, rutas API) conviven con 230 archivos `.js` (UI heredada del template). La migración a TypeScript parece parcial e intencional (empezó por las capas de datos/seguridad), no completa.
- **Lista manual de auth endpoints:** `AUTH_ENDPOINTS` en `apiSlice.js` es un `Set` mantenido a mano — riesgo de olvido documentado en `ARCHITECTURE.md` / `ADR-001`.
- **Sin validación de schema (Zod/Yup) en los Route Handlers:** por ejemplo `src/app/api/auth/login/route.ts` hace `await request.json()` y desestructura `{ email, password }` sin validar tipos/formato antes de reenviarlos a WordPress. El proyecto sí tiene `yup` como dependencia (usado en formularios de UI vía `react-hook-form`), pero no se usa como guarda en el límite del Route Handler.
- **Comentarios de código de alta calidad:** el código nuevo en `src/lib/` y `src/services/` documenta consistentemente el "por qué" de decisiones no obvias (ej. el truco de `X-Cart-Cookie`, el motivo de `server-only`, el fallback del sitemap) — buena señal de mantenibilidad, vale la pena preservar este estándar en código futuro.

## Recomendación

Dado que el proyecto es de un solo desarrollador por ahora, formalizar un proceso de review de PRs es de bajo costo y alto valor antes de sumar colaboradores o de que el volumen de cambios crezca — ver `ROADMAP` en el resumen ejecutivo de esta auditoría.
