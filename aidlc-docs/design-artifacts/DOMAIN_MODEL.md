# Domain Model (DDD)

El modelo de dominio no vive en una base de datos propia: WooCommerce/WordPress es el sistema de registro (source of truth). Este frontend consume esos datos vía dos formas — el shape "crudo" de WooCommerce (`WCStore*`, `WC*` en `src/lib/woocommerce/types.ts`) y un shape "normalizado" que el resto de la app consume, traducido por `src/lib/woocommerce/mappers.ts`. Ese mapeo es en sí mismo la capa anti-corrupción del dominio.

## Bounded Context: Storefront (jonahbruzzi.me)

### Aggregates / Entities identificados

**Product** (Aggregate Root)
- Identidad: `_id` (mapeado desde `WCStoreProduct.id`)
- Atributos: `title`, `slug`, `price`, `originalPrice`, `discount`, `sku`, `tags`, `category`, `type`, `description`
- Fuente: `src/lib/woocommerce/products.ts`, mapeado por `mapStoreProduct`
- Value Objects contenidos: precio (`price`/`originalPrice`/`discount`, derivados de `WCStorePrices` vía `parseStorePrice`), imágenes (`image`, `relatedImages`)

**Category**
- Identidad: `_id`
- Atributos: `slug`, `parent`, `children`, `status` ("Show"/"Hide")
- Fuente: `src/lib/woocommerce/categories.ts`, mapeado por `mapStoreCategory`

**Cart** (Aggregate Root, transitorio/por sesión — no tiene identidad persistente propia, se identifica por `CartSession`)
- Value Object de sesión: `CartSession { cartToken, nonce, cookie }` — no es un dato de negocio, es el mecanismo de correlación de la sesión stateless de WooCommerce
- Entidad hija: `CartItem { cartKey, _id, title, orderQuantity, price, ... }` — `cartKey` es la identidad del ítem dentro del carrito (permite variantes)
- Value Objects: `ShippingRate { rateId, label, price, selected }`, totales (`subtotal`, `total`, `discountTotal`)
- Invariante relevante: `total` solo refleja envío/impuestos/descuento una vez que hay `ShippingRate` seleccionado (comentario explícito en `types.ts`)

**Order**
- Identidad: `id` (WooCommerce order id)
- Dos proyecciones distintas del mismo agregado según el caso de uso:
  - `OrderSummary` — para listados (historial de pedidos)
  - `OrderInvoice` — para detalle/factura (incluye dirección, método de pago, desglose de costos)
- Fuente: `src/lib/woocommerce/orders.ts`

**Coupon**
- Identidad: `_id`
- Atributos: `discountPercentage`, `endTime`, `minimumAmount`, `couponCode`
- Nota de dominio explícita en el código: WooCommerce no tiene concepto nativo de "título/logo" de cupón — solo se muestran cupones de tipo porcentaje con fecha de expiración, usando el código como título (decisión de negocio documentada en comentario de `types.ts`).

**AuthUser / Customer**
- Identidad: `id` (WordPress user ID)
- `AuthUser { id, email, name, roles }` — usado para sesión/autorización
- `CustomerUpdateInput` — comando de actualización de perfil (firstName, lastName, email, phone, address, password), traducido a payload WooCommerce `billing.*` por `toWCPayload`

### Repositories (implícitos, por convención de nombres — no hay interfaz `Repository<T>` formal)
Cada archivo en `src/lib/woocommerce/*.ts` actúa como un repository de solo-lectura/escritura específico por agregado: `products.ts`, `categories.ts`, `cart.ts`, `checkout.ts`, `orders.ts`, `coupons.ts`, `customers.ts`. No siguen el patrón `Repository<T>` genérico documentado en las reglas de patrones del equipo — son funciones libres, no clases.

### Domain Events
No existe un sistema de eventos de dominio (pub/sub, event bus). Los "eventos" reales son efectos de red hacia WooCommerce (crear pedido, actualizar carrito) — no hay proyecciones ni reacciones asíncronas dentro del frontend.

## Fuera de este bounded context
- El backend WordPress/WooCommerce (`admin.jonahbruzzi.me`) es un bounded context externo, tratado como sistema opaco vía su API pública. No se documenta su modelo interno aquí.
