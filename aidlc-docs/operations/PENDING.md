# Operations — Pendiente

El proyecto está en fase **Early Construction**, no ha llegado a Operations. Por regla del método AI-DLC, no se generan los documentos completos de esta fase (`MONITORING_SETUP.md`, `SLA_DEFINITION.md`, `INCIDENT_RUNBOOKS.md`, `POST_MORTEMS/`) todavía — solo este placeholder.

No se encontró evidencia de:
- Monitoring o alerting (sin config de Sentry, Datadog, Prometheus, Vercel Analytics, etc.)
- Logs centralizados (solo `console.error` puntual dentro de los Route Handlers, ej. `src/app/api/woocommerce/cart/route.ts`)
- Definición de SLA/SLO, ni siquiera informal
- Runbooks o notas de troubleshooting

**Cuándo revisitar esta carpeta:** una vez que el proyecto tenga CI/CD y esté sirviendo tráfico real de forma sostenida (ver `deployment/DEPLOYMENT_CHECKLIST.md` para los pasos previos), generar los documentos completos de esta fase.
