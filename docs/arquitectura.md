# Arquitectura

## Visión general
Next.js (front + acciones de servidor) → Supabase (PostgreSQL con RLS)
Publicación: GitHub → Vercel (despliegue continuo en cada `git push` a `main`).

> Stack del diplomado: Next.js + Spring Boot + MySQL + AWS. Para el MVP se usa la alternativa rápida que permite la guía: **Supabase y Vercel** (ver docs/decisiones.md). La sección Back se migra en la U4 si se exige Spring Boot.

## Front
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- Componentes de servidor leen datos; componentes de cliente (`"use client"`) manejan la interacción.
- Datos de prueba (mock): `data/productos.ts`. Si Supabase no responde, el sitio usa estos datos y no se cae.
- Estado de la cotización: React Context (`app/components/Cotizacion.tsx`) guardado en `localStorage`.

## Back
- Supabase (PostgreSQL) con políticas RLS.
- Lectura: `lib/datos.ts` (`obtenerProductos`, `obtenerProducto`).
- Rastreo: `lib/rastreo.ts` (`registrar`, `guardarCotizacion`).
- Escrituras del administrador: acciones de servidor en `app/panel/productos/acciones.ts` con `lib/supabaseAdmin.ts` (clave secreta, solo servidor) y sesión verificada con `lib/sesionPanel.ts`.

## Estructura
```
app/
  layout.tsx · page.tsx · loading.tsx · not-found.tsx
  productos/ · productos/[referencia]/      F1
  asistente/                                F3
  panel/ · panel/productos/                 F4 · F5
  nosotros/ · marcas/ · puntos-de-venta/    Páginas de apoyo
  prototipo/a · /b · /c                     Variantes de la pantalla principal
  components/                               Componentes en PascalCase
lib/        datos.ts · rastreo.ts · supabase.ts · supabaseAdmin.ts · sesionPanel.ts · utils.ts
data/       productos.ts (tipos, categorías y datos mock)
public/     logo, logos de marcas, fotos de Nosotros
docs/       planos del proyecto (este directorio)
```

## Datos
Entidades: **Producto**, **Evento**, **Cotización**.
- Producto 1—N ítems de Cotización (guardados como JSON dentro de la cotización).
- Producto 1—N Eventos (vistas y "agregar a cotización" referencian la referencia del producto).

| Tabla | Campos | RLS para el visitante |
|---|---|---|
| `productos` | referencia (PK), nombre, marca, categoria, vehiculos text[], precio int, stock int, imagen | Solo leer |
| `eventos` | id, tipo, detalle, creado_en | Solo insertar |
| `cotizaciones` | id, nombre, telefono, items jsonb, total, creado_en | Solo insertar |

Tipos de evento: `vista_producto`, `busqueda`, `categoria`, `clic`, `agregar_cotizacion`, `asistente`.

## Variables de entorno (`.env.local`, nunca en GitHub)
| Variable | Uso | Secreta |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Lectura pública limitada por RLS | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Panel y administrador (solo servidor) | Sí |
| `PANEL_CLAVE` | Contraseña del panel | Sí |

## Servicios externos
WhatsApp (`wa.me`), Google Maps (iframe), Flipsnack (catálogo anterior), Instagram y Facebook.

## Despliegue
- Front y acciones de servidor: Vercel, proyecto `turbouniversal-web` (turboman-web.vercel.app).
- Base de datos: Supabase (plan gratuito; se pausa por inactividad).
