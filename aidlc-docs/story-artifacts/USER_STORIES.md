# User Stories

Reconstruidas retroactivamente a partir de las rutas y componentes existentes (`src/app/**`, `src/services/**`). No existían historias de usuario documentadas previamente.

## Catálogo y descubrimiento
- Como visitante, quiero ver una lista de productos con filtros, para encontrar lo que busco. (`/shop`, `shop-filtering`)
- Como visitante, quiero ver el detalle de un producto, incluyendo productos relacionados, para decidir la compra. (`/product-details/[id]`)
- Como visitante, quiero buscar productos por texto, para encontrar algo específico rápido. (`/search`)
- Como visitante, quiero ver productos en oferta, para aprovechar descuentos. (`getDiscountProducts`)

## Carrito
- Como visitante (con o sin cuenta), quiero agregar productos al carrito y que persista entre visitas, para no perder mi selección. (Cart-Token/cookie de sesión)
- Como visitante, quiero aplicar un cupón de descuento en el carrito, para pagar menos. (`cart/coupon`)
- Como visitante, quiero elegir una tarifa de envío antes de pagar, para saber el costo total real. (`cart/select-shipping-rate`)

## Checkout
- Como cliente, quiero completar un checkout con mis datos de facturación y envío, para recibir mi pedido. (`submitCheckout`)
- Como cliente, quiero ver una página de confirmación clara (éxito/pendiente/fallo) después de pagar, para saber el estado de mi compra. (`/checkout/{success,pending,failure}`)

## Cuenta
- Como visitante, quiero registrarme con email y contraseña, para tener una cuenta propia.
- Como cliente, quiero iniciar sesión y mantenerme autenticado, para acceder a mi historial y perfil.
- Como cliente, quiero recuperar mi contraseña si la olvido, sin depender de soporte manual.
- Como cliente, quiero ver mi historial de pedidos y el detalle de cada uno, para hacer seguimiento de mis compras. (`/order`, `/order/[id]`)
- Como cliente, quiero editar mi perfil (datos de contacto), para mantenerlos actualizados. (`/user-dashboard`)

## Wishlist
- Como cliente, quiero guardar productos en una lista de deseos, para comprarlos después. (`/wishlist`)

## Contenido institucional
- Como visitante, quiero encontrar información de la tienda (About, FAQ, Contact, Terms, Policy), para resolver dudas antes de comprar.

⚠️ Pendiente validación humana: estas historias son inferidas del comportamiento observable del código, no confirmadas por un Product Owner. No hay historias explícitas para casos edge (ej. qué pasa si WooCommerce está caído durante el checkout, política de devoluciones, etc.).
