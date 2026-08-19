# ADR-001: Frontend headless con BFF de Route Handlers sobre WooCommerce/WordPress

**Estado:** Aceptada (implementada — no hay evidencia de que se haya reconsiderado)
**Fecha:** Inferida del commit inicial `3bdb7fe` (2026-08-15)
**Reconstrucción:** Esta ADR fue reconstruida retroactivamente a partir del código; no existía como documento antes de esta auditoría.

## Contexto

El proyecto necesita un catálogo de productos, carrito, checkout, gestión de pedidos y cuentas de cliente. En vez de construir estos sistemas desde cero, se optó por usar WordPress + el plugin WooCommerce como backend (`admin.jonahbruzzi.me`), consumido por un frontend Next.js separado (headless commerce).

WordPress no expone un mecanismo de autenticación pensado para apps externas, y su Store API pública no requiere credenciales pero tampoco puede exponer operaciones de escritura sensibles (pedidos históricos, perfil) sin autenticar al usuario real.

## Decisión

1. Todo acceso a WooCommerce/WordPress pasa por Route Handlers de Next.js (`src/app/api/**`) — el browser nunca llama directamente a `admin.jonahbruzzi.me`.
2. Las credenciales de WooCommerce (consumer key/secret) y el código de autorización de Simple JWT Login viven solo en variables de entorno server-side, leídas exclusivamente en módulos marcados con `import "server-only"`.
3. Se usa el plugin **Simple JWT Login** para habilitar login/registro/reset de contraseña externos, emitiendo JWTs que el frontend reenvía como `Authorization: Bearer`.
4. Cada JWT recibido del cliente se re-valida contra WordPress en el servidor antes de confiar en su contenido (`validateToken`) — nunca se decodifica y confía en el payload sin verificación de firma remota.
5. Se separan dos rutas de acceso a WooCommerce: Store API (pública, cacheable) para catálogo/carrito, y REST API v3 (autenticada, Basic auth) para operaciones administrativas como checkout y pedidos.

## Alternativas consideradas

⚠️ No documentadas explícitamente en el código o commits. Alternativas razonables que NO se tomaron (inferencia del auditor, no del equipo):
- Backend propio (Node/Postgres) en vez de WooCommerce — descartado, probablemente por velocidad de desarrollo y por reutilizar un ecosistema de e-commerce maduro (envío, impuestos, cupones ya resueltos).
- Acceso directo del browser a la Store API de WooCommerce (sin BFF) — habría evitado la capa de Route Handlers, pero habría requerido configurar CORS en el WordPress (comentario explícito en `client.ts` menciona esto como razón para no hacerlo) y habría expuesto la REST API v3 (con secretos) como inviable de usar desde el cliente.

## Consecuencias

**Positivas:**
- Secretos nunca llegan al bundle del cliente (garantizado en tiempo de build, no solo por convención).
- No se requiere configurar CORS en WordPress.
- Cache diferenciado por sensibilidad del dato (público vs. personalizado).

**Negativas / riesgos:**
- Acoplamiento fuerte a la disponibilidad de `admin.jonahbruzzi.me` — si ese origen cae, el frontend completo pierde funcionalidad (mitigado parcialmente para el build del sitemap, no para runtime).
- Doble mantenimiento de tipos: shapes crudos de WooCommerce (`WCStore*`) y shapes normalizados (`Product`, `Cart`) deben mantenerse sincronizados manualmente en `mappers.ts` cuando WooCommerce cambia su contrato.
- El registro de qué endpoints RTK Query requieren auth es una lista manual (`AUTH_ENDPOINTS`) — un endpoint nuevo que necesite auth y no se agregue ahí fallará silenciosamente en producción sin token.
- Sin tests automatizados que verifiquen este contrato entre capas (ver `testing/TEST_STRATEGY.md`).
