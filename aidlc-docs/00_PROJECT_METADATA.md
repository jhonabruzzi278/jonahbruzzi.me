# Project Metadata

**Project Name:** jonahbruzzi.me (headless storefront frontend; package name `jonahbruzzi-frontend`)
**Owner:** JONAHBRUZZI <jon.guerra@duocuc.cl> (single committer on all history to date)
**Repository:** https://github.com/jhonabruzzi278/jonahbruzzi.me (branch `main`, up to date with origin)
**Analyzed On:** 2026-08-18
**Current Phase:** Early Construction
**Last Updated:** 2026-08-18 (testing infra added: Vitest, 37 tests covering `mappers.ts` + cart session logic)

## Status
- [x] Inception Phase — parcial (reconstruido retroactivamente en esta auditoría; no existía documentación previa de intent/requirements)
- [x] Construction Phase — parcial (código funcional y desplegado, sin tests automatizados ni CI/CD)
- [ ] Operations Phase — pendiente (no hay evidencia de monitoring, alerting ni runbooks)

## Quick Links
- Requirements: [aidlc-docs/requirements/](./requirements/)
- Architecture: [aidlc-docs/design-artifacts/ARCHITECTURE.md](./design-artifacts/ARCHITECTURE.md)
- Deployment: [aidlc-docs/deployment/](./deployment/)
- Prompts audit trail: [aidlc-docs/prompts.md](./prompts.md)

## Notas del Análisis Automático

**Supuestos hechos por falta de información explícita:**
- No existe ningún documento de negocio (README de producto, notion, issues de GitHub) — todo el "intent" del proyecto fue inferido del código: nombre de dominio, `siteConfig` (`src/config/site.js`), estructura de rutas y mensajes de UI en español/CLP.
- No hay stakeholders documentados en ningún lado; se asume que el único stakeholder actual es el propio dueño/operador del proyecto (un solo commit author, `jon.guerra@duocuc.cl`), sin evidencia de equipo o cliente externo.
- No hay `vercel.json` ni carpeta `.vercel/` commiteada, pero el `README.md` original (boilerplate `create-next-app`) y la ausencia de Dockerfile/IaC sugieren que el deploy es manual vía Vercel (dashboard o CLI, no pipeline). Esto se documenta como supuesto, no como hecho confirmado.
- El repositorio Git real vive en `jonahbruzzi.me/jonahbruzzi.me/` (carpeta renombrada de `harri-front-end/` el 2026-08-18); el nivel superior `C:\Trabajos\jonahbruzzi.me\` solo agrupa esta carpeta más `documentation/` (documentación estática del template comercial "Harri Shop Next.js Template" comprado como base, no documentación del proyecto) y `.claude/` (config del harness de desarrollo). Este `aidlc-docs/` se coloca en la raíz del repo Git real por ser el "root del proyecto" desplegable.
- Solo 4 commits en el historial (todos del 2026-08-15), lo que indica que el proyecto es muy reciente — probablemente aún en validación activa, no en mantenimiento de largo plazo.
