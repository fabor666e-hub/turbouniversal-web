# Contrato de la API · Turbo Universal

Fuente única de verdad entre el front (Next.js en Vercel) y el back (NestJS en Render).
Si algo cambia aquí, se cambia primero este documento y después el código.

- **URL base:** `https://<servicio>.onrender.com/api` (local: `http://localhost:4000/api`)
- **Formato:** JSON en UTF-8. Fechas en ISO 8601 (UTC). Precios en pesos colombianos, enteros.
- **CORS:** solo se aceptan peticiones del dominio del front (`ORIGEN_FRONT`).
- **Autenticación:** las rutas marcadas 🔒 exigen el encabezado `Authorization: Bearer <token>` obtenido en `POST /api/auth/login`.

## Formato de error (todas las rutas)
```json
{ "error": { "codigo": "VALIDACION", "mensaje": "El precio debe ser un entero mayor o igual a 0.", "detalles": ["precio"] } }
```
| HTTP | código | Cuándo |
|---|---|---|
| 400 | `VALIDACION` | Falta un campo o tiene un formato inválido |
| 401 | `NO_AUTORIZADO` | Sin token, token vencido o clave incorrecta |
| 404 | `NO_ENCONTRADO` | La referencia o el recurso no existe |
| 409 | `REFERENCIA_DUPLICADA` | Se crea un producto con una referencia que ya existe |
| 409 | `STOCK_INSUFICIENTE` | Una cotización pide más unidades de las disponibles |
| 429 | `DEMASIADAS_SOLICITUDES` | Se superó el límite de peticiones por minuto |
| 500 | `ERROR_INTERNO` | Error no previsto (no expone detalles internos) |

## Modelos

### Producto
```json
{
  "referencia": "TB-1002",
  "nombre": "Turboalimentador HX35",
  "marca": "Turboman",
  "categoria": "turboalimentadores",
  "vehiculos": ["Chevrolet NPR", "Kenworth"],
  "precio": 2400000,
  "stock": 2,
  "imagen": null,
  "oem": ["EJEMPLO-123456"],
  "garantia": "6 meses por defecto de fábrica"
}
```
Reglas: `referencia` en mayúsculas, 2–30 caracteres (letras, números y guiones), única. `nombre` 3–120 caracteres. `categoria` es uno de los slugs de `GET /api/categorias`. `precio` y `stock` enteros ≥ 0, o `null` = **a consultar** (el catálogo de la empresa no publica precio ni inventario; si no se envían en POST/PUT quedan en `null`). Cada vehículo con formato "Marca Modelo".
`oem` (opcional, por defecto `[]`): números de parte originales o equivalentes con los que el mecánico busca el repuesto; máximo 20, cada uno de 2 a 40 caracteres (letras, números, guiones, puntos, barras o espacios), sin repetir. `garantia` (opcional, `null` si no se informa): texto de hasta 120 caracteres.

### Cotización
```json
{
  "id": 15,
  "nombre": "Camila Pérez",
  "telefono": "3001234567",
  "items": [
    { "referencia": "TB-1002", "nombre": "Turboalimentador HX35", "cantidad": 1, "precio": 2400000, "subtotal": 2400000 },
    { "referencia": "JF-158", "nombre": "Turbo Land Rover Evoque K03", "cantidad": 1, "precio": null, "subtotal": null }
  ],
  "total": 2400000,
  "creadoEn": "2026-11-20T23:10:00.000Z"
}
```

## Rutas públicas

### `GET /api/salud`
Comprueba que la API y la base de datos responden. **200** `{ "estado": "ok", "baseDeDatos": "ok" }`

### `GET /api/productos`
Parámetros opcionales: `q` (texto, ignora mayúsculas y tildes; busca en referencia, nombre, marca, vehículos y números OEM), `categoria` (slug), `marca`.
**200** `Producto[]` ordenado por referencia.

### `GET /api/productos/:referencia`
**200** `Producto` · **404** `NO_ENCONTRADO`

### `GET /api/categorias`
**200** `[{ "slug": "cartridge", "nombre": "Cartridge", "cantidad": 2 }]` (las 8 categorías, con cuántos productos tiene cada una)

### `GET /api/vehiculos`
Marcas y modelos de vehículos sacados de los productos (para el asistente).
**200** `[{ "marca": "Chevrolet", "modelos": ["NPR"] }]`

### `POST /api/cotizaciones`
Cuerpo:
```json
{ "nombre": "Camila Pérez", "telefono": "3001234567", "aceptaDatos": true, "items": [{ "referencia": "TB-1002", "cantidad": 1 }] }
```
- El **servidor** toma el nombre y el precio de cada producto de la base de datos y calcula el total: el navegador no puede cambiar precios.
- Un producto con precio `null` queda en la cotización con `precio` y `subtotal` en `null` y **no suma** al total (lo cotiza el asesor).
- `STOCK_INSUFICIENTE` solo aplica a productos con stock conocido; con stock `null` la disponibilidad la confirma el asesor.
- `nombre` 2–80 caracteres; `telefono` 7–15 dígitos; `aceptaDatos` debe ser `true` (Ley 1581); 1 a 30 ítems; `cantidad` entero 1–99.
**201** `Cotización` · **400** `VALIDACION` · **404** `NO_ENCONTRADO` (referencia inexistente) · **409** `STOCK_INSUFICIENTE`

### `POST /api/eventos`
Cuerpo: `{ "tipo": "busqueda", "detalle": "npr" }`. `tipo` ∈ `vista_producto`, `busqueda`, `categoria`, `clic`, `agregar_cotizacion`, `asistente`, `video`. `detalle` máximo 120 caracteres.
**202** `{ "ok": true }` · Límite: 60 eventos por minuto por IP (**429** al superarlo).

## Rutas de administración 🔒

### `POST /api/auth/login`
Cuerpo `{ "clave": "..." }`. **200** `{ "token": "<JWT>", "expiraEn": "2026-11-21T07:00:00.000Z" }` (vigencia 8 horas) · **401** `NO_AUTORIZADO`. Límite: 5 intentos por minuto por IP.

### 🔒 `POST /api/productos`
Cuerpo: `Producto` completo. **201** `Producto` · **400** · **409** `REFERENCIA_DUPLICADA`

### 🔒 `PUT /api/productos/:referencia`
Cuerpo: `Producto` sin `referencia` (no se puede cambiar). **200** `Producto` · **400** · **404**

### 🔒 `PATCH /api/productos/:referencia/stock`
Cuerpo `{ "delta": 1 }` o `{ "delta": -1 }`. El stock nunca baja de 0; un stock `null` se toma como 0. **200** `Producto` · **404**

### 🔒 `DELETE /api/productos/:referencia`
**204** sin cuerpo · **404**

### 🔒 `GET /api/cotizaciones?limite=20`
Últimas cotizaciones (máximo 100). **200** `Cotización[]`

### 🔒 `GET /api/panel/resumen`
**200**
```json
{
  "totales": { "vistas": 120, "busquedas": 45, "agregados": 18, "cotizaciones": 6 },
  "masVistos": [{ "valor": "TB-1002", "cantidad": 30 }],
  "masAgregados": [{ "valor": "TB-1002", "cantidad": 7 }],
  "masBuscados": [{ "valor": "npr", "cantidad": 12 }],
  "categorias": [{ "valor": "cartridge", "cantidad": 9 }],
  "clics": [{ "valor": "whatsapp-pie", "cantidad": 5 }],
  "vehiculosAsistente": [{ "valor": "modelo:Chevrolet NPR", "cantidad": 4 }],
  "stockBajo": [{ "referencia": "TB-5001", "nombre": "Actuador electrónico GT1749V", "stock": 1 }]
}
```
`stockBajo` solo incluye productos con stock conocido (no `null`) de 3 o menos.
