# Test Strategy

## Framework

**Vitest**, adoptado 2026-08-18 (antes de esto, el proyecto no tenía ningún framework de testing configurado — ver `code-generation/GENERATED_CODE_LOG.md`). Elegido por integración nativa con Vite/tsconfig paths, sin necesidad de configurar Babel/ts-jest, y compatibilidad directa con el stack Next.js 16 + React 19 + TypeScript ya existente.

```bash
npm test              # vitest run — una pasada, para CI
npm run test:watch    # vitest — modo watch para desarrollo
npm run test:coverage # vitest run --coverage
```

Config: `vitest.config.ts` (raíz del repo) — `environment: "node"` (no se necesita DOM todavía porque solo hay tests de lógica pura, no de componentes React), resuelve los path aliases de `tsconfig.json` vía `resolve.tsconfigPaths`.

⚠️ **Nota de tooling:** en este entorno (Windows), el reporter de tabla en terminal de `vitest run --coverage` omite silenciosamente las filas de `checkout.ts` y `lib/wordpress/auth.ts` (no aparecen ni siquiera como 0%) aunque sí tengan tests — es un glitch cosmético del reporter, no una ausencia real de cobertura. Para verificar los números reales de un archivo que no aparece en la tabla, leer `coverage/coverage-final.json` directamente en vez de confiar en el resumen impreso.

## Cobertura actual (medida, no inferida — verificada leyendo `coverage/coverage-final.json` donde el reporter de tabla fallaba)

Ejecutado `npm run test:coverage` el 2026-08-18:

| Archivo | % Statements | % Branch | % Funcs |
|---|---|---|---|
| `src/lib/woocommerce/mappers.ts` | 100% | 87.75% | 100% |
| `src/lib/woocommerce/cart.ts` | 83.33% | 82.6% | 63.63% |
| `src/lib/woocommerce/checkout.ts` | 100% | 100% | 100% |
| `src/lib/wordpress/auth.ts` | 100% | 100% | 100% |
| Resto del proyecto (`lib/`, `services/`, componentes) | 0% | 0% | 0% |

**55 tests, todos verdes**, en 4 archivos: `src/lib/woocommerce/mappers.test.ts`, `src/lib/woocommerce/cart.test.ts`, `src/lib/woocommerce/checkout.test.ts`, `src/lib/wordpress/auth.test.ts`.

## Qué cubren los tests existentes

- **`mappers.test.ts`** — las 4 funciones puras de traducción WooCommerce → dominio propio: `parseStorePrice` (conversión de minor units, entradas inválidas), `mapStoreProduct` (cálculo de descuento, stock, imágenes, colores, categorías, HTML-stripping de la descripción, defaults cuando WooCommerce omite campos opcionales en runtime pese al tipo), `mapStoreCategory`, `mapStoreCart` (items, totales, cupones, tarifas de envío, carrito vacío).
- **`cart.test.ts`** — la capa de sesión de carrito, mockeando `"./client"` (nunca `fetch` global directamente, para no acoplar el test al detalle de transporte): `buildHeaders`, `getCart` (forwarding de headers, merge de sesión nueva/vieja), `ensureSession` (no debe pegarle a la red si ya hay `nonce`+`cookie`; debe "primar" con un GET si falta cualquiera de los dos), y `writeCart` a través de `addCartItem`/`updateCartItem` (prime-then-write, y skip del prime cuando la sesión ya está establecida).
- **`checkout.test.ts`** — `submitCheckout`, mockeando también solo `"./client"` (deja correr el `ensureSession`/`buildHeaders` reales de `cart.ts`, ya probados aparte, para verificar la integración real): prime-then-post cuando la sesión no está establecida, skip del prime cuando ya lo está, merge de sesión post-respuesta, y que `paymentStatus`/`redirectUrl` no truene cuando `payment_result` viene ausente.
- **`auth.test.ts`** — todo `src/lib/wordpress/auth.ts`: `login` (payload/headers correctos, error con mensaje de WordPress, error genérico si no hay detalle, `success:false` con `res.ok`, y que falle sin red si falta `WOOCOMMERCE_URL`), `validateToken` (mapeo correcto de `WPUser`→`AuthUser`, fallback de `display_name` vacío al email, y — el caso de riesgo más importante — que devuelve `null` tanto para un token rechazado como para un error de red **como para un error de configuración** (`WOOCOMMERCE_URL` ausente), documentando explícitamente que hoy esos tres casos son indistinguibles desde el llamador), `requestPasswordReset`, `confirmPasswordReset`, y `register` (incluye el `AUTH_KEY` server-side, y falla sin red si falta `SIMPLE_JWT_LOGIN_AUTH_CODE`).
  - Nota técnica: `auth.ts` importa `"server-only"` directamente, y ese paquete lanza una excepción por defecto fuera de la condición `react-server` (que Vitest no configura) — el test lo neutraliza con `vi.mock("server-only", () => ({}))`. Además, `WOOCOMMERCE_URL`/`SIMPLE_JWT_LOGIN_AUTH_CODE` se leen en constantes a nivel de módulo, así que cada escenario que necesita un valor de env distinto usa `vi.resetModules()` + `import()` dinámico *después* de fijar `process.env` — mutar `process.env` después del import no tendría efecto.

## Gaps identificados (prioridad siguiente, no cubierto aún)

1. **`applyCoupon`, `removeCoupon`, `removeCartItem`, `selectShippingRate`** en `cart.ts` (líneas 100-121, sin cobertura) — son wrappers delgados de `writeCart`, que ya está probado; bajo riesgo, pero fáciles de agregar.
2. **`src/app/api/**/route.ts`** — sin tests de integración (status codes, shape de error) — estos son los que realmente exponen `login`/`submitCheckout`/etc. al browser.
3. **Componentes de UI** (cart, checkout forms) — sin tests de comportamiento; requeriría agregar `@testing-library/react` y cambiar `environment` a `"jsdom"` para ese subconjunto.
4. **`categories.ts`, `coupons.ts`, `customers.ts`, `orders.ts`, `products.ts`, `client.ts`** — sin tests todavía; `client.ts` en particular es la base de toda la capa (`storeApiFetch`, `restApiFetch`) y no tiene cobertura propia (solo se ejercita indirectamente vía mocks en los tests de arriba).

## Recomendación de stack para lo que falta

Para (3), agregar `@testing-library/react` + `jsdom` como proyecto separado en `vitest.config.ts` (o `environmentMatchGlobs`) para no pagar el costo de un DOM simulado en los tests de lógica pura que hoy corren en ~500ms. Para E2E de flujos completos (login, agregar al carrito, checkout), Playwright sigue siendo la recomendación cuando se aborde esa capa — no implementado todavía.
