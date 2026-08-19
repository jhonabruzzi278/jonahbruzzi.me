# Stakeholders

⚠️ No hay documentación de stakeholders en el proyecto (sin README de producto, sin CODEOWNERS, sin issues de GitHub). Lo siguiente es lo único verificable objetivamente, más inferencia marcada explícitamente.

## Verificable (extraído de git/infra)
| Rol | Identidad | Evidencia |
|---|---|---|
| Único autor de commits / dueño del repositorio | JONAHBRUZZI (`jon.guerra@duocuc.cl`) | `git log`, todos los commits |
| Dueño del repo GitHub | `jhonabruzzi278` | remote `origin`: `github.com/jhonabruzzi278/jonahbruzzi.me` |
| Operador del backend WordPress/WooCommerce | Desconocido — mismo dueño probablemente | `admin.jonahbruzzi.me` (subdominio del mismo dominio) |

## Inferido (⚠️ pendiente validación humana)
- **Product Owner / dueño de negocio:** probablemente la misma persona que el desarrollador (proyecto de un solo autor, sin evidencia de equipo).
- **Clientes finales:** compradores de habla hispana en Chile (`es-CL`, CLP) — segmento objetivo inferido del locale y la moneda, no confirmado.
- **Proveedores externos con dependencia dura:**
  - Host de WordPress/WooCommerce en `admin.jonahbruzzi.me` — dependencia crítica y única fuente de datos de catálogo/pedidos/auth.
  - Plugin "Simple JWT Login" — dependencia crítica para todo el flujo de autenticación headless.
  - Servicios de imágenes: `i.ibb.co`, `res.cloudinary.com` (permitidos en `next.config.js`).
  - Hosting de deploy: presumiblemente Vercel (README boilerplate de `create-next-app` menciona Vercel; sin `vercel.json` ni pipeline commiteado que lo confirme).

**No se encontró evidencia de:** clientes B2B, inversionistas, equipo de soporte, ni SLA con terceros.
