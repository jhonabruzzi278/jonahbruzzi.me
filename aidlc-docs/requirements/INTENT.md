# Project Intent

## High-Level Purpose

INFERIDO del código: jonahbruzzi.me es una **tienda online (e-commerce headless)** dirigida al mercado chileno (locale `es-CL`, moneda CLP, timezone `America/Santiago`), que vende "tecnología, hogar, moda y productos interesantes" (tagline literal en `src/config/site.js`: *"Cosas que vale la pena descubrir."*). El frontend es un Next.js App Router desacoplado de un backend WordPress + WooCommerce alojado en `admin.jonahbruzzi.me`, que actúa como catálogo, gestor de pedidos y sistema de autenticación de clientes.

⚠️ Pendiente validación humana: no hay documento de negocio que confirme el propósito exacto (dropshipping, catálogo curado, tienda propia, etc.) — la inferencia se basa únicamente en el código y copy de la UI.

## Business Objectives

⚠️ No documentado — requiere input del Product Owner. Inferencias razonables a partir del código:
- Ofrecer un checkout funcional en CLP con envío y cupones vía WooCommerce Store API.
- Dar a los clientes cuenta propia (registro, login, historial de pedidos, recuperación de contraseña) sin depender del panel de WordPress.
- Mantener SEO básico (sitemap, robots, metadata Open Graph) — ver `src/app/sitemap.js`, `src/app/robots.js`.

## Success Metrics

⚠️ No documentado — requiere input del Product Owner. No hay analytics, A/B testing, ni métricas de conversión configuradas en el código (no se encontró Google Analytics, GTM, Meta Pixel, ni panel de métricas propio).

## Constraints

### Technical
- Framework: Next.js 16 (App Router, `--webpack` explícito, no Turbopack) con React 19.
- Backend obligatorio: WordPress + WooCommerce en `admin.jonahbruzzi.me` — el frontend no funciona sin ese origen disponible (confirmado por el fix de build `654ffc2`: el sitemap debía tolerar que WooCommerce no respondiera durante el build).
- Node/TypeScript mixto: 41 archivos `.ts` (capas `lib/`, `services/`, rutas API) conviven con 230 archivos `.js` (UI heredada del template comercial "Harri Shop").
- Sin base de datos propia — todo el estado persistente vive en WordPress/WooCommerce; Redux solo mantiene estado de cliente (carrito, sesión, UI).
- Secretos de WooCommerce (`WOOCOMMERCE_CONSUMER_KEY/SECRET`) y de Simple JWT Login deben permanecer server-side (enforced por `import "server-only"` en cada archivo de `lib/`/`services/`).

### Business
⚠️ No documentado — requiere input del Product Owner (presupuesto, plazos, mercado objetivo más allá de Chile, medios de pago soportados más allá de lo que WooCommerce ya provee).
