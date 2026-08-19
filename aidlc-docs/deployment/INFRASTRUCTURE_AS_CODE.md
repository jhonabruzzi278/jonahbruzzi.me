# Infrastructure as Code

**Estado: No implementado.**

No se encontró ningún artefacto de infraestructura como código en el repositorio (Dockerfile, docker-compose.yml, `terraform/`, `k8s/`, `serverless.yml`, `vercel.json`, ni script de deploy propio).

El único componente de infraestructura configurado explícitamente en código es la lista de hosts remotos de imágenes permitidos en `next.config.js` (`images.remotePatterns`: `i.ibb.co`, `res.cloudinary.com`, `admin.jonahbruzzi.me`) — no es IaC de infraestructura de cómputo/red, es configuración de la propia app.

⚠️ Pendiente validación humana: si el deploy real ocurre a través del dashboard de Vercel con un proyecto vinculado manualmente (link vía `vercel` CLI, sin `vercel.json` commiteado porque la configuración se hizo desde la UI), eso es válido operacionalmente pero no es reproducible por otra persona sin acceso a esa cuenta de Vercel. Se recomienda documentar esto explícitamente en `deployment/DEPLOYMENT_CHECKLIST.md` una vez confirmado.
