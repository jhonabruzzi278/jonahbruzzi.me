# Requirements

Extraídos del código funcional existente (no de un documento de requisitos previo — este proyecto no tenía ninguno). Cada requisito abajo tiene evidencia directa en el código; se marcan explícitamente los que son inferencia razonable.

## Funcionales — Catálogo
- **RF-01** Listar productos con filtros (`src/app/api/woocommerce/products/route.ts`, `src/components/common/shop-filtering`).
- **RF-02** Ver detalle de un producto por ID, incluyendo productos relacionados por tags (`src/lib/woocommerce/products.ts: listRelatedProducts`).
- **RF-03** Mostrar productos en oferta ("discount") — `getDiscountProducts` filtra `on_sale=true`.
- **RF-04** Navegación por categorías (`src/app/api/woocommerce/categories`, `categoryService.ts`).
- **RF-05** Búsqueda de productos (`src/app/search`).

## Funcionales — Carrito y Checkout
- **RF-06** Carrito persistente entre requests sin cuenta (sesión anónima vía `Cart-Token`/`Nonce`/cookie WooCommerce) — `src/lib/woocommerce/cart.ts`.
- **RF-07** Agregar, actualizar y eliminar ítems del carrito (`cart/add-item`, `cart/update-item`, `cart/remove-item` route handlers).
- **RF-08** Aplicar/quitar cupones de descuento (`cart/coupon`, `src/lib/woocommerce/coupons.ts`).
- **RF-09** Selección de tarifa de envío (`cart/select-shipping-rate`).
- **RF-10** Checkout con dirección de facturación y envío, nota del cliente y método de pago, devolviendo posible `redirect_url` de pago (`src/lib/woocommerce/checkout.ts`).
- **RF-11** Página de resultado de checkout: éxito, pendiente, fallo (`src/app/checkout/{success,pending,failure}`).

## Funcionales — Cuenta de usuario
- **RF-12** Registro de cuenta (requiere `SIMPLE_JWT_LOGIN_AUTH_CODE` server-side) — `src/lib/wordpress/auth.ts: register`.
- **RF-13** Login con email/password devolviendo JWT — `login()`.
- **RF-14** Recuperación de contraseña por email + código (`forgot-password`, `reset-password` routes).
- **RF-15** Cambio de contraseña autenticado (`change-password` route).
- **RF-16** Ver/editar perfil (`profile` route, `customers.ts: updateCustomer`).
- **RF-17** Ver historial de pedidos propios y detalle de un pedido (`orders`, `orders/[id]`).
- **RF-18** Validación server-side de JWT en cada request autenticado — nunca se confía en el payload del token sin re-verificarlo contra WordPress (`validateToken`).

## Funcionales — Otros
- **RF-19** Wishlist (lista de deseos) — `redux/features/wishlist-slice.js`, `src/app/wishlist`.
- **RF-20** Páginas de contenido estático: About, FAQ, Contact, Terms, Policy (⚠️ inferido que su contenido es editorial fijo, no gestionado desde WooCommerce).
- **RF-21** Sitemap y robots.txt dinámicos generados desde el catálogo real (`src/app/sitemap.js`, `robots.js`) — deben tolerar que WooCommerce no responda durante el build (ver commit `654ffc2`).

## No Funcionales
- **RNF-01 (Seguridad)** Ningún secreto de WooCommerce/WordPress debe llegar al bundle del cliente — enforced con `import "server-only"`.
- **RNF-02 (Rendimiento/Resiliencia)** Lecturas públicas no personalizadas (productos, categorías, cupones) usan revalidación cacheada (`next: { revalidate }`) en vez de `no-store`, porque el host de WordPress soltaba conexiones concurrentes bajo carga (ver commit `5fd400d`) — ⚠️ no hay un valor de `revalidateSeconds` documentado centralizadamente; queda pendiente auditar qué segundos usa cada llamador.
- **RNF-03 (Localización)** Todo el copy visible y el formato de precio deben ser `es-CL` / CLP sin decimales (`formatPrice` en `src/config/site.js`).
- **RNF-04 (Compatibilidad de imágenes)** Solo se permiten imágenes remotas de `i.ibb.co`, `res.cloudinary.com` y `admin.jonahbruzzi.me` (`next.config.js`).

⚠️ Pendiente validación humana: no hay requisitos de accesibilidad, SLA de disponibilidad, ni política de medios de pago documentados explícitamente — solo lo que WooCommerce soporta de forma nativa.
