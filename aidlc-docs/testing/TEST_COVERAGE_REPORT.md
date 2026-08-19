# Test Coverage Report

**Medido con `npm run test:coverage` (Vitest + v8) el 2026-08-18.** Los porcentajes de `checkout.ts` y `lib/wordpress/auth.ts` fueron leídos directamente de `coverage/coverage-final.json`, porque el reporter de tabla en terminal los omite silenciosamente en este entorno (Windows) — ver nota en `TEST_STRATEGY.md`.

## Resumen global del repositorio

```
Statements   : 31.55% ( 71/225 )   ← denominador cuenta TODO src/lib + src/services,
Branches     : 45.85% ( 83/181 )     incluyendo módulos aún sin ningún test
Functions    : 31.46% ( 28/89 )
```

Como antes, este número global es engañoso leído como "el proyecto tiene 31% de cobertura" — son **cuatro archivos con cobertura alta/completa** (los más críticos: traducción de datos, sesión de carrito, checkout, autenticación) y **todo el resto en 0%**.

## Detalle por archivo con cobertura > 0%

| Archivo | Statements | Branch | Funcs | Líneas/casos sin cubrir |
|---|---|---|---|---|
| `src/lib/woocommerce/mappers.ts` | 100% | 87.75% | 100% | ninguna statement; algunas ramas de fallback (`?? ""`) no ejercitadas en todas sus combinaciones |
| `src/lib/woocommerce/cart.ts` | 83.33% | 82.6% | 63.63% | `removeCartItem`, `applyCoupon`, `removeCoupon`, `selectShippingRate` — wrappers delgados de `writeCart`, que sí está cubierto |
| `src/lib/woocommerce/checkout.ts` | 100% | 100% | 100% | ninguna |
| `src/lib/wordpress/auth.ts` | 100% | 100% | 100% | ninguna |

## Todo lo demás: 0% (no auditado en este ciclo, no roto — simplemente sin tests aún)

`src/lib/woocommerce/{categories,client,coupons,customers,orders,products}.ts`, todo `src/services/**`, y todos los componentes de UI. Ver gaps priorizados en `TEST_STRATEGY.md`.
