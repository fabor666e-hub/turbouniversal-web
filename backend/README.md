# API de Turbo Universal (NestJS + PostgreSQL)

Backend del sitio. Implementa el contrato de `../docs/contratos/api.md` y las specs B1 a B5 de `../docs/specs/`.

## Correr en tu computador
1. Instala PostgreSQL (o usa la base de Supabase/Render) y crea una base, por ejemplo `turbouniversal`.
2. En esta carpeta (`backend/`):
   ```
   npm install
   copy env.ejemplo .env        (en Mac/Linux: cp env.ejemplo .env)
   ```
3. Completa `.env` con tu `DATABASE_URL`, `JWT_SECRETO` y `PANEL_CLAVE`.
4. Arranca en modo desarrollo:
   ```
   npm run dev
   ```
5. Abre http://localhost:4000/api/salud y http://localhost:4000/api/productos

Al arrancar, la API crea las tablas (migración) y carga los 12 productos de ejemplo si la tabla está vacía.

## Pruebas
Usan una base de **pruebas** (se borra al empezar):
```
set DATABASE_URL=postgresql://usuario:clave@localhost:5432/turbouniversal_test
npm test
```
Son 32 pruebas, una por cada criterio de aceptación de B1 a B4.

## Rutas principales
| Método | Ruta | Acceso |
|---|---|---|
| GET | /api/salud | Público |
| GET | /api/productos?q=&categoria=&marca= | Público |
| GET | /api/productos/:referencia | Público |
| GET | /api/categorias · /api/vehiculos | Público |
| POST | /api/cotizaciones | Público |
| POST | /api/eventos | Público (60/min por IP) |
| POST | /api/auth/login | Público (5/min por IP) |
| POST · PUT · PATCH · DELETE | /api/productos… | 🔒 Token |
| GET | /api/cotizaciones · /api/panel/resumen | 🔒 Token |

## Estructura
```
src/
  main.ts · configurar-app.ts   arranque, CORS, prefijo /api, validación y errores
  app.module.ts                 conexión a PostgreSQL y módulos
  config.ts                     variables de entorno
  comun/                        formato de errores del contrato
  productos/ cotizaciones/ eventos/ panel/ auth/ salud/
  base-de-datos/                migración inicial y semilla
test/api.e2e-spec.ts            pruebas de los criterios
```

## Despliegue en Render
Ver la sección "Despliegue" en `../docs/specs/B5-despliegue-render.md` y el archivo `../render.yaml`.
