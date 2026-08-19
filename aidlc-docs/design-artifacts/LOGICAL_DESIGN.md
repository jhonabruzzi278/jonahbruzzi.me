# Logical Design

## Patterns detectados en el código

- **BFF / Backend-for-Frontend vía Route Handlers:** `src/app/api/**/route.ts` actúa como capa BFF entre el browser y WooCommerce/WordPress. El browser nunca llama directamente al backend externo.
- **Anti-Corruption Layer:** `src/lib/woocommerce/mappers.ts` traduce los shapes `WCStore*`/`WC*` (formato WooCommerce) a shapes propios (`Product`, `Cart`, `Category`) usados por el resto de la app — aísla a la UI de cambios en el contrato de WooCommerce.
- **Service Layer:** `src/services/*Service.ts` — una capa intermedia entre los route handlers y los clientes `lib/`, que además preserva envelopes de respuesta heredados de un backend anterior (comentario explícito: "intentionally mirror the previous backend shapes... so UI didn't need changes").
- **Repository-like modules (no genérico):** cada archivo de `lib/woocommerce/*.ts` encapsula acceso a un recurso específico, pero sin interfaz `Repository<T>` compartida — ver nota en `DOMAIN_MODEL.md`.
- **CQRS informal:** `storeApiFetch`/`storeApiFetchWithHeaders` (lecturas públicas, cacheables) vs `restApiFetch` (escrituras/admin, autenticado, `no-store`) — dos rutas de acceso separadas según intención de lectura vs escritura.
- **RTK Query como capa de datos del cliente:** `src/redux/api/apiSlice.js` centraliza fetching client-side con cache/tags (`Category`, `Products`, `Discount`, `Coupon`, `Product`, `RelatedProducts`, `Cart`), evitando fetches manuales dispersos en componentes.
- **Dynamic base query / routing por convención:** `AUTH_ENDPOINTS` (un `Set` de nombres de endpoint) decide en runtime si una llamada RTK Query va a `/api/auth` (con Bearer token) o `/api/woocommerce` — un patrón de enrutamiento por lista explícita, frágil si se olvida registrar un endpoint nuevo ahí.
- **Guard de compilación para secretos:** `import "server-only"` en cada módulo sensible no es solo convención — falla el build si se importa desde un client component, hoy es la única defensa técnica contra fuga de credenciales.

## Stack Tecnológico (detectado)

| Componente | Tecnología | Versión | Fuente |
|---|---|---|---|
| Framework | Next.js (App Router) | ^16.3.1 | package.json |
| UI Runtime | React / React DOM | ^19.2.8 | package.json |
| Bundler | Webpack (explícito, no Turbopack) | vía `next dev/build --webpack` | package.json scripts |
| Lenguaje | TypeScript | ^5.9.3 (mixto con JS heredado) | package.json, tsconfig.json |
| Estado global | Redux Toolkit + RTK Query | ^2.12.0 | package.json |
| Formularios | react-hook-form + @hookform/resolvers + yup | ^7.42.1 / ^2.9.10 / ^0.32.11 | package.json |
| Estilos | Bootstrap 5 + react-bootstrap + Sass | ^5.2.3 / ^2.10.6 / ^1.56.1 | package.json |
| Carruseles/UI | swiper, slick-carousel, react-slick | — | package.json |
| Fechas | dayjs | ^1.11.7 | package.json |
| Linting | ESLint (`next/core-web-vitals`) | ^9.17.0 | .eslintrc.json |
| Testing | **ninguno configurado** | — | ausencia de jest/vitest/playwright en package.json |

## Servicios externos detectados

| Servicio | Rol | Evidencia |
|---|---|---|
| WordPress + WooCommerce (`admin.jonahbruzzi.me`) | Catálogo, carrito, checkout, pedidos, cupones | `WOOCOMMERCE_URL` env var, `src/lib/woocommerce/client.ts` |
| WooCommerce Store API (`/wp-json/wc/store/v1`) | Lecturas públicas + carrito/checkout, sin credenciales | `storeApiFetch` |
| WooCommerce REST API v3 (`/wp-json/wc/v3`) | Operaciones autenticadas (Basic auth con consumer key/secret) | `restApiFetch` |
| Plugin "Simple JWT Login" (`/wp-json/simple-jwt-login/v1`) | Login, registro, reset de contraseña headless | `src/lib/wordpress/auth.ts` |
| i.ibb.co, res.cloudinary.com | Hosting de imágenes de producto/contenido | `next.config.js: images.remotePatterns` |
| (presumible) Vercel | Hosting de deploy del frontend | README boilerplate, ausencia de Dockerfile/IaC propio — ⚠️ no confirmado |

No se detectaron: base de datos propia, cola de mensajes, servicio de emails transaccionales propio (probablemente delegado a WordPress/WooCommerce), pasarela de pago explícita en el código del frontend (el `payment_method` se pasa como string a WooCommerce, que decide el proveedor real).
