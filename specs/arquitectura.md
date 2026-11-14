# Arquitectura

## Stack
| Capa | Tecnología | Uso |
|---|---|---|
| Interfaz | Next.js 16 (App Router), React 19, TypeScript | Páginas y componentes |
| Estilos | Tailwind CSS 4 | Diseño, colores, animaciones, responsive |
| Datos | Supabase (PostgreSQL) + `@supabase/supabase-js` | Productos, eventos, cotizaciones |
| Publicación | GitHub + Vercel | Cada `git push` a `main` publica el sitio |
| Servicios externos | WhatsApp (`wa.me`), Google Maps (iframe), Flipsnack | Cotizaciones, mapas, catálogo anterior |

## Estructura de carpetas
```
app/
  layout.tsx              Encabezado, pie, cotización, WhatsApp flotante y rastreo en todas las páginas
  page.tsx                Inicio
  loading.tsx             Pantalla de carga
  not-found.tsx           Página 404
  productos/page.tsx      Catálogo con buscador y filtros
  productos/[referencia]/ Página de cada producto (ruta dinámica)
  asistente/              Asistente por vehículo
  marcas/                 Turboman y Master Power
  nosotros/               Quiénes somos (scroll con imágenes)
  puntos-de-venta/        Sedes con mapa
  panel/                  Panel privado de analítica
  components/             Piezas reutilizables (Cotizacion, Estructura, Comunes, Catalogo, Asistente...)
lib/
  datos.ts                Lee productos de Supabase (con respaldo local)
  rastreo.ts              registrar(tipo, detalle) y guardarCotizacion()
  supabase.ts             Cliente con clave pública
  supabaseAdmin.ts        Cliente con clave secreta (solo servidor)
  utils.ts                WhatsApp, redes, colores, formatos
data/productos.ts         Tipo Producto, categorías y productos de respaldo
public/                   Logo, logos de marcas, fotos de Nosotros
specs/                    Esta documentación
```

## Modelo de datos (Supabase)

### `productos`
| Columna | Tipo | Nota |
|---|---|---|
| referencia | text (PK) | Ej. `TB-1001` |
| nombre | text | |
| marca | text | `Turboman`, `Master Power` |
| categoria | text | Slug de `data/productos.ts` |
| vehiculos | text[] | Formato "Marca Modelo", ej. `Chevrolet NPR` |
| precio | integer | Pesos colombianos |
| stock | integer | Unidades disponibles |
| imagen | text, opcional | Ruta o URL de la foto |

RLS: lectura pública.

### `eventos`
| Columna | Tipo | Nota |
|---|---|---|
| id | bigint | |
| tipo | text | `vista_producto`, `busqueda`, `clic`, `agregar_cotizacion`, `asistente` |
| detalle | text | Referencia, texto buscado, botón, elección |
| creado_en | timestamptz | |

RLS: el visitante solo inserta.

### `cotizaciones`
| Columna | Tipo | Nota |
|---|---|---|
| id | bigint | |
| nombre, telefono | text | Datos personales (Ley 1581) |
| items | jsonb | `[{referencia, nombre, cantidad, precio}]` |
| total | integer | |
| creado_en | timestamptz | |

RLS: el visitante solo inserta.

## Flujos principales
1. **Ver catálogo:** página de servidor → `obtenerProductos()` → Supabase (o respaldo local) → componente de cliente que filtra.
2. **Cotizar:** `agregar()` en el Context de cotización → se guarda en `localStorage` → el cliente escribe nombre y teléfono → `guardarCotizacion()` inserta en Supabase → se abre WhatsApp con el mensaje.
3. **Rastreo:** `registrar(tipo, detalle)` inserta en `eventos`; los clics se capturan con un único escuchador sobre elementos con `data-track`.
4. **Panel:** contraseña (`PANEL_CLAVE`) → cookie httpOnly → lectura con `supabaseAdmin` en el servidor.

## Variables de entorno
| Variable | Dónde | Secreta |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Navegador y servidor | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Navegador y servidor | No (limitada por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | **Sí** |
| `PANEL_CLAVE` | Solo servidor | **Sí** |
