# B5 · Despliegue del backend en Render

## Historia
Como **equipo**, queremos la API publicada en internet y conectada a la base de datos, para que el front en Vercel use datos reales.

## Comportamiento
1. Render toma el código de la carpeta `backend/` del repositorio en GitHub (`render.yaml` en la raíz).
2. Instala, compila y arranca la API.
3. La API se conecta a la base PostgreSQL de **Supabase** (proyecto "turboman") con `DATABASE_URL` y SSL.
4. Cada `git push` a `main` vuelve a desplegar.

## Criterios de aceptación
- [ ] `https://<servicio>.onrender.com/api/salud` responde 200 con `"baseDeDatos": "ok"`.
- [ ] `GET /api/productos` devuelve los productos que ya están en Supabase (no se duplican ni se borran).
- [ ] El front en Vercel muestra los productos que vienen de la API (variable `NEXT_PUBLIC_API_URL`).
- [ ] Ninguna clave aparece en el repositorio: `DATABASE_URL`, `PANEL_CLAVE` y `JWT_SECRETO` viven solo en Render.

## Pasos para desplegar
1. Sube el repositorio a GitHub con la carpeta `backend/` y el archivo `render.yaml` en la raíz.
2. En Supabase → proyecto **turboman** → botón **Connect** → pestaña de cadenas de conexión → **Session pooler**. Copia la URI (empieza por `postgresql://postgres.`) y reemplaza `[YOUR-PASSWORD]` por la contraseña de la base. Si no la recuerdas, se cambia en **Project Settings → Database → Reset database password**.
3. En render.com: **New → Blueprint** y elige el repositorio `turbouniversal-web`.
4. Render muestra el servicio `turbouniversal-api` y pide dos valores: pega la URI en `DATABASE_URL` y escribe la clave del panel en `PANEL_CLAVE`. Pulsa **Apply**.
5. Cuando el despliegue diga **Live**, abre `https://<servicio>.onrender.com/api/salud`.

## Notas
- Se usa el **Session pooler** y no la conexión directa porque la conexión directa de Supabase solo funciona por IPv6 y Render se conecta por IPv4.
- Al arrancar, la API solo agrega la columna `actualizado_en` a `productos` y crea la tabla `migrations`; no borra datos.
- La API se conecta como dueño de la base, así que las reglas RLS de Supabase no la bloquean; la seguridad la hacen el token y las validaciones de la API.
- Plan gratuito de Render: el servicio se duerme tras 15 minutos sin tráfico y tarda cerca de un minuto en despertar.
- Plan gratuito de Supabase: el proyecto se pausa tras una semana sin actividad; para producción se necesita el plan de pago.
