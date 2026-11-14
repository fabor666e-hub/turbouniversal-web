# Decisiones

| Fecha | Decisión | Por qué |
|---|---|---|
| 2026-10 | Next.js + Tailwind para el front | Stack del diplomado; páginas por producto que Google puede leer (SEO). |
| 2026-10 | Supabase en vez de Spring Boot + MySQL para el MVP | La guía permite Supabase y Vercel como alternativa rápida; da base de datos, API y seguridad (RLS) sin montar un servidor. |
| 2026-10 | Vercel para publicar | Despliegue continuo desde GitHub y plan gratuito para el MVP. |
| 2026-10 | La cotización se envía por WhatsApp (no por correo ni pago en línea) | La empresa ya atiende por WhatsApp; el cambio para ellos es mínimo. La cotización también se guarda en Supabase. |
| 2026-10 | Solo rojo `#e8233b` y azul `#1a2150` | Son los colores del logo; la empresa pidió mantenerlos. |
| 2026-10 | Datos mock en `data/productos.ts` como respaldo | Si Supabase falla o está pausado, el sitio no se cae. |
| 2026-11 | Pantalla principal: **variante A · Buscador primero** | Ganó en la rúbrica: la acción principal (buscar) es lo que más resalta, se entiende en 5 s y funciona a 390 px. B obliga a escoger entre dos botones antes de buscar; C depende de que los vehículos estén bien escritos en los datos. Capturas en docs/diseno/referencias/. |
| 2026-11 | Paso 3 del asistente = tipo de repuesto (no combustible) | Los productos no tienen campo de combustible; las opciones salen de datos reales. |
| 2026-11 | La cotización se guarda en `localStorage` | Evita que el cliente pierda su lista al recargar. |
| 2026-11 | Administrador de productos con acciones de servidor y clave secreta | No se abren permisos de escritura al público en Supabase. |
| 2026-11 | Fotos de Nosotros generadas con IA | La empresa no tiene fotos propias; pendiente reemplazar las que muestran logotipos de otras marcas. |

## Rúbrica de las variantes (1 = bajo, 3 = alto)

| Criterio | A · Buscador primero | B · Catálogo visual | C · Por vehículo |
|---|---|---|---|
| Claridad (5 s) | 3 | 2 | 3 |
| Jerarquía (acción principal resalta) | 3 | 2 | 2 |
| Consistencia con la identidad | 3 | 3 | 2 |
| Responsivo (390 px) | 3 | 3 | 3 |
| Accesibilidad | 2 | 2 | 2 |
| **Total** | **14** | **12** | **12** |
