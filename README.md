# Turbo Universal Web

Sitio web de **Importadora Turbo Universal**, distribuidora oficial de Turboman y Master Power en Colombia. Permite:
- buscar turbos y repuestos por referencia, marca o vehículo;
- ver si hay stock;
- armar una cotización y enviarla por WhatsApp;
- usar un asistente por vehículo.

La empresa tiene, además, un panel de analítica y un administrador de productos.

![CI](https://github.com/fabor666e-hub/turbouniversal-web/actions/workflows/ci.yml/badge.svg)

| | URL |
|---|---|
| Sitio (producción) | https://turbouniversal-web.vercel.app |
| API (producción) | https://turbouniversal-api-evth.onrender.com/api/salud |
| Panel | https://turbouniversal-web.vercel.app/panel (con clave) |

> La API usa el plan gratis de Render: si nadie la ha usado en 15 minutos, la primera petición tarda unos 50 s. Mientras tanto, el sitio sigue funcionando con Supabase directo.

## Funcionalidades
| Spec | Qué hace |
|---|---|
| F1 · Catálogo y buscador | Buscador sin tildes, filtro por categoría, página por producto con estado de stock y 404 propia. |
| F2 · Cotización | Lista con cantidades que nunca supera el stock. Al enviar abre WhatsApp, pide autorización de datos (Ley 1581) y guarda la cotización. |
| F3 · Asistente por vehículo | Marca → modelo → tipo de repuesto, con opciones sacadas de los productos. |
| F4 · Panel de analítica | Muestra lo que se busca, se ve y se cotiza, el stock bajo y las últimas cotizaciones. |
| F5 · Administrador | Crear, editar, cambiar stock y borrar productos. |
| B1–B5 · API | API REST NestJS con JWT, límites de peticiones y precios calculados en el servidor. |

Las specs con sus criterios de aceptación están en [`docs/specs/`](docs/specs/), y el contrato de la API en [`docs/contratos/api.md`](docs/contratos/api.md).

## Stack
- **Front:** Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4, desplegado en **Vercel**.
- **API:** NestJS 11, TypeORM y PostgreSQL, desplegada en **Render** (carpeta [`backend/`](backend/)).
- **Base de datos:** **Supabase** (PostgreSQL con RLS), con un proyecto de producción y otro de desarrollo.
- **Calidad:** Playwright (pruebas unitarias y e2e), Jest y Supertest (API), y GitHub Actions (CI).

El diagrama y los equivalentes en AWS están en [`docs/arquitectura.md`](docs/arquitectura.md).

## Correr en local
Requisitos: Node 22 y Git.

```bash
git clone https://github.com/fabor666e-hub/turbouniversal-web.git
cd turbouniversal-web
npm install
npm run dev          # http://localhost:3000
```

Sin `.env.local`, el sitio funciona con los datos de ejemplo de `data/productos.ts`. Para conectarlo a Supabase **dev**, crea `.env.local` con las variables de [`docs/arquitectura.md`](docs/arquitectura.md#variables-de-entorno-envlocal-nunca-en-github), o descárgalas con `npx vercel env pull .env.local`.

La API local está en [`backend/README.md`](backend/README.md).

## Pruebas
```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # pruebas unitarias: reglas de F1–F3 y regla crítica
npm run build        # build de producción
npx playwright install chromium   # solo la primera vez
npm run e2e          # e2e: F1–F3, regla crítica y acceso cruzado (usa el build)

cd backend
npm test             # API contra PostgreSQL (necesita DATABASE_URL de una base de pruebas)
```

Las mismas pruebas corren en GitHub Actions en cada pull request. La rama `main` está protegida: solo recibe cambios por PR con el CI en verde.

## Cómo se publica un cambio
Rama → pull request → CI y preview de Vercel → merge → producción. Si algo sale mal, se hace un rollback en un clic. Todo el proceso está en el runbook: [`docs/operacion/despliegue.md`](docs/operacion/despliegue.md).

## Documentación
| Documento | Para qué |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Reglas para trabajar con IA en el proyecto (SDD) |
| [`docs/producto.md`](docs/producto.md) | Problema, usuarios, alcance del MVP |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Arquitectura desplegada (Mermaid), AWS, datos, variables |
| [`docs/specs/`](docs/specs/) | Specs F1–F5 y B1–B5 con criterios de aceptación |
| [`docs/contratos/api.md`](docs/contratos/api.md) | Contrato entre el front y la API |
| [`docs/diseno/identidad-visual.md`](docs/diseno/identidad-visual.md) | Colores, tipografía, componentes |
| [`docs/decisiones.md`](docs/decisiones.md) | Decisiones y por qué |
| [`docs/tareas.md`](docs/tareas.md) | Tareas hechas y pendientes |
| [`docs/calidad/interventoria.md`](docs/calidad/interventoria.md) | Auditoría e interventoría cruzada |
| [`docs/operacion/despliegue.md`](docs/operacion/despliegue.md) | Runbook: entornos, despliegue, rollback, incidentes |
| [`BITACORA_IA.md`](BITACORA_IA.md) | Uso de IA, errores, métricas y riesgos |
