# Architecture Overview

## Estructura del proyecto

```
jonahbruzzi.me/                  # raíz del repo Git (app Next.js)
├── src/
│   ├── app/                     # App Router: páginas + Route Handlers (src/app/api/**)
│   │   ├── api/auth/**          # BFF hacia WordPress (Simple JWT Login)
│   │   ├── api/woocommerce/**   # BFF hacia WooCommerce (cart, checkout, products, orders, coupons, categories)
│   │   └── {shop,cart,checkout,product-details,user-dashboard,...}/  # páginas de UI
│   ├── components/              # UI por dominio (cart, checkout, shop, product-details, user-dashboard, ...)
│   ├── layout/                  # header/footer/layout compartido
│   ├── lib/
│   │   ├── woocommerce/         # clientes REST + tipos crudos + mappers (capa anti-corrupción)
│   │   └── wordpress/auth.ts    # cliente JWT auth
│   ├── services/                # capa de servicio entre route handlers y lib/
│   ├── redux/                   # RTK Query (apiSlice) + slices de estado cliente
│   ├── hooks/                   # hooks compartidos (auth check, cart info, checkout submit, sticky header)
│   ├── config/site.js           # constantes de sitio + formatPrice()
│   └── utils/, ui/, svg/        # utilidades y componentes de presentación genéricos
├── public/assets/                # assets estáticos del template comercial
├── next.config.js               # remote image patterns
├── tsconfig.json                 # path aliases (@components, @lib, @services, etc.)
└── aidlc-docs/                   # esta documentación

../documentation/                 # (fuera del repo Git) documentación estática del template
                                   # comercial "Harri Shop Next.js Template" — NO es doc del proyecto
```

## Tech Stack

| Capa | Tecnología | Justificación (inferida) | Fuente |
|---|---|---|---|
| Frontend framework | Next.js App Router (webpack) | SSR/SSG + Route Handlers como BFF en un solo deploy | package.json, next.config.js |
| Estado cliente | Redux Toolkit + RTK Query | Cache automático + tags de invalidación para catálogo/carrito | src/redux/ |
| Backend de datos | WordPress + WooCommerce | Reutilizar un ecosistema e-commerce maduro (catálogo, pagos, envío, cuentas) en vez de construir uno propio | src/lib/woocommerce/, .env.local |
| Auth | Simple JWT Login (plugin WP) + JWT propio | WordPress core no soporta auth externa; el plugin lo habilita sin reescribir todo el sistema de usuarios | src/lib/wordpress/auth.ts |
| Estilos | Bootstrap 5 + Sass | Heredado del template comercial base ("Harri Shop") | package.json, public/assets |

## Decisiones arquitectónicas detectadas

- **Headless commerce, no monolito acoplado:** el frontend Next.js es completamente independiente del admin de WordPress; se comunican solo por HTTP/REST.
- **BFF obligatorio, nunca acceso directo del browser a WooCommerce:** decisión de seguridad (secretos server-only) y de arquitectura (evita configurar CORS en WordPress, ver comentario en `client.ts`).
- **Sync, no async/event-driven:** todo el flujo es request/response síncrono contra WooCommerce; no hay colas, webhooks entrantes ni jobs en background dentro de este repo.
- **Migración de backend con compatibilidad de contrato:** los envelopes de `services/*Service.ts` imitan intencionalmente el shape de "un backend previo" — evidencia de que este proyecto reemplazó un backend anterior (probablemente Node/Mongo, dado el estilo de los shapes normalizados `_id`, `itemInfo`, etc.) sin tocar la capa de UI. ⚠️ inferido, no confirmado por el usuario.
- **Cache selectivo por sensibilidad del dato:** lecturas públicas cacheadas con `revalidate`; lecturas personalizadas/carrito siempre `no-store` — decisión tomada reactivamente tras un incidente de conexiones (commit `5fd400d`), no como diseño inicial.
- **Sin infraestructura como código:** no hay Dockerfile, docker-compose, Terraform, ni manifiestos k8s. El deploy es presumiblemente manual/plataforma-gestionada (Vercel).
