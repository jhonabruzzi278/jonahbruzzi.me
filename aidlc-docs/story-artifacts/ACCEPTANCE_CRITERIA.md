# Acceptance Criteria

⚠️ No existían criterios de aceptación formales. Lo siguiente se deriva del comportamiento real implementado en el código (lo que el sistema efectivamente garantiza hoy), no de un acuerdo con el Product Owner.

## Checkout
- **Dado** un carrito con items y una dirección de envío válida, **cuando** el cliente confirma el checkout, **entonces** se crea un pedido en WooCommerce y se retorna `orderId`, `orderKey`, `status` y opcionalmente `redirectUrl` de pago (`submitCheckout`).
- **Dado** que WooCommerce exige un `Nonce` obtenido de un `GET /cart` previo, **cuando** no existe sesión de carrito activa, **entonces** el checkout debe "primar" la sesión antes de enviar (`ensureSession`) — evita fallos por nonce faltante.

## Sesión de carrito
- **Dado** que el navegador no puede enviar el header `Cookie` manualmente por restricción del `fetch()` del browser, **cuando** el cliente reenvía la cookie de sesión de WooCommerce, **entonces** debe hacerlo vía header custom `X-Cart-Cookie`, y el route handler la reenvía como `Cookie` real al backend.

## Autenticación
- **Dado** un JWT provisto por el cliente, **cuando** el backend necesita identificar al usuario, **entonces** SIEMPRE debe revalidar el JWT contra WordPress (`validateToken`) — nunca confiar en el payload decodificado localmente sin verificación.
- **Dado** un intento de registro, **cuando** falta `SIMPLE_JWT_LOGIN_AUTH_CODE` en el entorno del servidor, **entonces** la operación debe fallar explícitamente (`throw new Error(...)`), no silenciosamente.

## Seguridad de secretos
- **Dado** cualquier módulo bajo `src/lib/` o `src/services/`, **cuando** se compila el bundle de cliente, **entonces** el build debe fallar si ese módulo (o algo que lo importe) termina en un componente `"use client"` — garantizado por la directiva `import "server-only"`.

## Resiliencia de build
- **Dado** que WooCommerce puede no responder durante un build de producción, **cuando** se genera `sitemap.xml`, **entonces** el build NO debe fallar — debe degradar (commit `654ffc2`, sin más detalle documentado sobre el fallback exacto).

## Precios y localización
- **Dado** cualquier monto monetario mostrado al usuario, **cuando** se formatea, **entonces** debe usarse `formatPrice()` de `src/config/site.js` (formato `$19.990`, sin decimales, separador de miles `.`) — no debe reimplementarse el formateo de precio en otro lugar.

⚠️ Pendiente validación humana: no hay criterios de aceptación para casos de error de pago, timeouts de red hacia WooCommerce, ni límites de stock/concurrencia en checkout.
